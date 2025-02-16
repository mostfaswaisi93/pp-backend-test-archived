import {
  ARITHMETIC_OPERATORS,
  CHART_TYPE,
  LANG_LIST,
  LOGIC_OPERATORS,
  SORT_TYPE,
} from "@typings/enums/defualts.enum";
import { CURRENT_DATE } from "@typings/interfaces/chart.interface";
import { Translatable } from "@typings/interfaces/translation.interface";
import { completeTranslate } from "@utils/language";
import { getAttributeLang } from "@utils/translateObject";

export class ChartOptions {
  constructor();
  constructor(data: any);
  constructor(data?: any) {
    Object.assign(this, data);
    if (this.translatable) {
      this.translatable = completeTranslate(this.translatable);
      this.chartNameAr = getAttributeLang(
        this.translatable,
        "name",
        LANG_LIST.Ar
      );
      this.chartNameEn = getAttributeLang(
        this.translatable,
        "name",
        LANG_LIST.En
      );
    }
  }
  id: number;
  boards: Array<number>;
  categoryId: number;
  chartNameAr: string;
  chartNameEn: string;
  chartType: CHART_TYPE;
  workItemId: number;
  groupByXId: number;
  groupByYId: number;
  stackedById: number;
  sortType: number;
  publicFlag: number;
  rowLimit: number;
  aggregationType: number;
  translatable: Translatable[];
  filterRows: Array<chartFilterRow>;
  selectedColor: string;
  aggregationTypeSelection: number
}
export interface chartFilterRow {
  arithmeticOp: ARITHMETIC_OPERATORS;
  logicOp: LOGIC_OPERATORS;
  value: string | number | Date | boolean | Array<string>;
  fieldId: number;
  currentDate?: CURRENT_DATE;
}

export enum AggregationSelectionType {

  AggregationFunctions = 1,
  ColumnValues = 2
}