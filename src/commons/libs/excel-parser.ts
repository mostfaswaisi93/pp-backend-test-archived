import { readFile, utils, WorkSheet, WorkBook } from "xlsx";
import * as path from "path";
import * as fs from "fs";

export class ExcelParser<T> {
  private static _instance: ExcelParser<any>;

  static get Instance(): ExcelParser<any> {
    if (!this._instance) {
      this._instance = new ExcelParser();
    }
    return this._instance;
  }

  private constructor() {}

  private parseSheetToJson(worksheet: WorkSheet): T[] {
    return utils.sheet_to_json<T>(worksheet, {
      raw: false,
      dateNF: "DD-MM-YYYY",
      defval: null,
      rawNumbers: true,
      blankrows: false,
    });
  }

  public parseFile(fileName: string, sheetName: string): T[] | null {
    try {
      const filePath = path.resolve(process.cwd(), fileName);

      if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found -> ${filePath}`);
        return null;
      }

      const workbook: WorkBook = readFile(filePath);
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) {
        console.error(`Error: Sheet not found -> ${sheetName}`);
        return null;
      }

      return this.parseSheetToJson(sheet);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      return null;
    }
  }

  public getSheet(fileName: string, sheetName: string): WorkSheet | null {
    try {
      const filePath = path.resolve(process.cwd(), fileName);

      if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found -> ${filePath}`);
        return null;
      }

      const workbook: WorkBook = readFile(filePath);
      return workbook.Sheets[sheetName] || null;
    } catch (error) {
      console.error("Error getting sheet:", error);
      return null;
    }
  }

  public deleteRow(ws: WorkSheet, rowIndex: number): void {
    try {
      const range = utils.decode_range(ws["!ref"] as string);

      for (let R = rowIndex; R < range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          ws[this.encodeCell(R, C)] = ws[this.encodeCell(R + 1, C)];
        }
      }

      range.e.r--;
      ws["!ref"] = utils.encode_range(range.s, range.e);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  }

  private encodeCell(row: number, col: number): string {
    return utils.encode_cell({ r: row, c: col });
  }
}

export default ExcelParser.Instance;
