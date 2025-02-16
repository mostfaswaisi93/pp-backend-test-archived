import * as  oracledb from 'oracledb';
import * as async from 'async';
import * as moment from 'moment-timezone';
let numRows = 1000;

function fetchRowsFromRS(connection, resultSet, numRows, result, columns, callback) {
    resultSet.getRows(
        numRows,
        function (err, rows) {
            if (err) {
                callback(err.message, null);
                doClose(connection, resultSet);
            } else if (rows.length === 0) {
                callback(null, result);
            } else if (rows.length > 0) {
                let mappedRow = {};
                let mappedRows = [];
                if (columns.length == 1) {
                    rows.forEach(row => {
                        Object.keys(row).forEach(key => {
                            mappedRows.push(row[key]);
                        });
                    });
                } else {
                    rows.forEach(row => {
                        mappedRow = {};
                        Object.keys(row).forEach((key, index) => {
                            try {
                                if (typeof row[key] == "number" && row[key] % 1 != 0) {
                                    mappedRow[columns[index]] = row[key].toFixed(3);
                                } else if (row[key] instanceof Date) {
                                    mappedRow[columns[index]] = moment(row[key]).tz('Asia/Baghdad').format('DD/MM/YYYY');
                                } else {
                                    mappedRow[columns[index]] = row[key];
                                }
                            } catch (error) {
                                throw error;
                            }

                        });
                        mappedRows.push(mappedRow);
                    });
                }
                result.push(mappedRows);
                fetchRowsFromRS(connection, resultSet, numRows, result, columns, callback);
            }
        });
}

function doRelease(connection) {
    try {
        connection.close(
            function (err) {
                if (err) {
                    throw err;
                }
            });
    } catch (err) {
        throw err;
    }
}

function doClose(connection, resultSet) {
    resultSet.close(
        function (err) {
            if (err) {
                throw err;
            }
        });
}


export const db = {
    execQuery: async function (query, cb) {
        let sql = 'select * from individualuserinfo';
        oracledb.fetchInfo = [oracledb.DATE, oracledb.NUMBER];
        await oracledb.getConnection(
            // getConnection(),
            function (err, connection) {
                if (err) {
                    cb(err, null);
                    return;
                }
                connection.action = 'test';

                connection.execute(sql,
                    query, {
                    autoCommit: true
                })
            }
        )
    },
    execProc: async function (procedure, cb) {

        let paramNames = Object.keys(procedure.parameters).map((key,index) => {
            return `:${key}`;
        });
        oracledb.fetchInfo = [oracledb.DATE, oracledb.NUMBER];
        let sql = `Begin ${procedure.name}(${paramNames.join(',')}); END;`;
        await oracledb.getConnection(

            function (err, connection) {
                if (err) {
                    cb(err, null);
                    return;
                }

                connection.execute(
                    sql,
                    procedure.parameters, {
                    autoCommit: true
                },
                    function (err, result) {
                        if (err) {
                            cb(err, null);
                            doRelease(connection);
                            return;
                        }
                        let Output = result.outBinds;

                        doRelease(connection);
                        cb(null, Output);
                    }
                )
            }
        )
    },
    getDatatables: async function (procedure:any, cb) {

        let cursorParam = [];

        let paramNames = Object.keys(procedure.parameters).map((key,index) => {
            return `:${key}`;
        });

        Object.keys(procedure.parameters).forEach(key => {
            if(procedure.parameters[key].type == oracledb.CURSOR){
                cursorParam.push(key);
            }
        });

        let sql = `Begin ${procedure.name}(${paramNames.join(',')});`;

        cursorParam.forEach(param => {
            sql += ` if(:${param} IS NULL) then OPEN :${param} FOR SELECT * FROM dual WHERE 1 = 0; end if;`;
        });
        sql += ' END;';

        oracledb.fetchInfo = [oracledb.DATE, oracledb.NUMBER];

        oracledb.prefetchRows = 10000;
        
        await oracledb.getConnection(

            function (err, connection) {
                if (err) {
                    cb(err, null);
                    return;
                }

                connection.execute(
                    sql,
                    procedure.parameters, {
                    autoCommit: true
                },
                    function (err, result) {
                        if (err) {
                            cb(err, null);
                            doRelease(connection);
                            return;
                        }

                        let output = {};
                        let cursors = Object.keys(result.outBinds);

                        async.each(cursors, function (cursor, callback) {
                            output[cursor] = [];
                            if (typeof result.outBinds[cursor] === "object" && result.outBinds[cursor] != null &&
                                result.outBinds[cursor].metaData != undefined) {
                                let columns = result.outBinds[cursor].metaData.map(col => col.name);
                                fetchRowsFromRS(connection, result.outBinds[cursor], numRows, output[cursor],
                                    columns, callback);
                            } else {
                                output[cursor] = result.outBinds[cursor];
                                callback(null, output);
                            }

                        }, function (err) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, output);
                            }
                            doRelease(connection);
                        });

                    }
                )
            }
        )
    },
    promiseDatatbles: async function(procedure){
      return new Promise((resolve, reject) => {
          db.getDatatables(procedure,function (error, result) {
              if(error){
                  reject(error);
              }else{
                  resolve(result);
              }
          })
      })
    }
};