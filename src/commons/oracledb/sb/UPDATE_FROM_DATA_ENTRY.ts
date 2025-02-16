import * as oracledb from 'oracledb';

export const UPDATE_FROM_DATA_ENTRY =
{
    name: 'UPDATE_FROM_DATA_ENTRY',
    parameters: {
        pTemplateId: { dir: oracledb.BIND_IN, type: oracledb.STRING },
        pJsonData: { dir: oracledb.BIND_IN, type: oracledb.CLOB }
    }
}