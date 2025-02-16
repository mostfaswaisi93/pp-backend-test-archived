import * as oracledb from 'oracledb';

export const DELETE_INSERT_FINAL_TEMPLATE =
{
    name: 'DELETE_INSERT_FINAL_TEMPLATE',
    parameters: {
        pTemplateId: { dir: oracledb.BIND_IN, type: oracledb.STRING},
        pTableIssueSourceId: { dir: oracledb.BIND_IN, type: oracledb.NUMBER }
    }
}