import { EmployeeReport } from "@entities/EmployeeReport";
import { ProcessModel } from "@entities/ProcessModel";
import { ProductProcessNotes } from "@entities/ProductProcessNotes";
import { ReportRepository } from "@logic/report.repository";
import { ACTIVITY_LOG_REF_TYPE } from "@typings/enums/defualts.enum";

export interface ActivityLogReference {
  refType: ACTIVITY_LOG_REF_TYPE;
  refId: number;
}

export type LogDetails =
  | OldNew
  | OldNewLang
  | ResourceDetail[]
  | ChangeDetail[]
  | ResourceName;

export interface Details {
  task?: Partial<ProcessModel>;
  report?: Partial<EmployeeReport>;
  note?: Partial<ProductProcessNotes>;
}
export interface OldNewLang extends Details {
  ar: {
    n: string;
    o: string;
  };

  en: {
    n: string;
    o: string;
  };
}
export interface OldNew extends Details {
  n: string;
  o: string;
}

export interface ResourceDetail extends Details {
  ar: string;
  i: string;
  en: string;
}
export interface ChangeDetail extends Details {
  ar: {
    l: string;
    n: string;
    o: string;
  };
  en: {
    l: string;
    n: string;
    o: string;
  };
}
export interface ResourceName extends Details {
  ar: string;
  en: string;
}

