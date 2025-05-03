/*
PRO		            PR202011122
WO		            WO202011122
EST		            ES202011121
STAFF		          ST202011121
PROMO		          PM202011121
VENDOR		        VD202011121
INVENTORY	        IN202011121
CUSTOMER	        CU202011121
JOB		            JB202011121
PRICEBOOK	        PB202011121
LOCATIONS	        LO202011121
PURCHASE_ORDERS	  PO202011121
EQUIPMENT	        EQ202011121
*/

import _ from "lodash";
import db from "../../models";
import { DATE_FORMATS, SYSTEM_CODES } from "../../commons/constants/constants";

const AutoIncrementId = db.AutoIncrementor;

const generateId = async (type: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      AutoIncrementId.findOneAndUpdate(
        { type: SYSTEM_CODES.SEQUENCE_CODE },
        { $inc: { [type]: 1 } },
        { upsert: true, new: true }
      )
        .then((sequence: any) => {
          if (sequence) {
            let system = _.findKey(SYSTEM_CODES, _.partial(_.isEqual, type));
            console.log("sequence[type] ", type, sequence[type]);
            resolve(
              `${SYSTEM_CODES[system as keyof typeof SYSTEM_CODES]}${DATE_FORMATS.CURRENT_DATE}` +
                (parseInt(sequence[type]) + 1)
            );
          } else {
            reject("Sequence not found");
          }
        })
        .catch((err: any) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
};

export { generateId };
