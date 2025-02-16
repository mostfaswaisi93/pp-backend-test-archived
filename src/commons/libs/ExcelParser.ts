import { readFile, utils, WorkSheet } from "xlsx";
var path = require("path");

export class ExcelParser<T> {
	private xslToJson = (worksheet): T[] => {
		return utils.sheet_to_json(worksheet, {
			raw: false,
			dateNF: "DD-MM-YYYY",
			defval: null,
			rawNumbers: true,
			blankrows: false,
		});
	};

	parseFile = (fileName: string, sheet: string) => {
		let filePath = path.resolve(`${process.cwd()}/${fileName}`);
		let workbook = readFile(filePath);
		return this.xslToJson(workbook.Sheets[sheet]);
	};
	parseFileWorkBook = (fileName: string, sheet: string) => {
		let filePath = path.resolve(`${process.cwd()}/${fileName}`);
		let workbook = readFile(filePath);
		return workbook.Sheets[sheet];
	};
	ec(r, c) {
		return utils.encode_cell({ r: r, c: c });
	}
	parseSheetToJson(sheet: WorkSheet) {
		return this.xslToJson(sheet);
	}
	deleteRow(ws, row_index) {
		var variable = utils.decode_range(ws["!ref"]);
		for (var R = row_index; R < variable.e.r; ++R) {
			for (var C = variable.s.c; C <= variable.e.c; ++C) {
				ws[this.ec(R, C)] = ws[this.ec(R + 1, C)];
			}
		}
		variable.e.r--;
		ws["!ref"] = utils.encode_range(variable.s, variable.e);
	}
}
