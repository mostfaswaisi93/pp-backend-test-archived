import path from "path";
import * as pdf from 'html-pdf'
import * as fs from 'fs'
const util = require("util");
import * as ms from 'html-docx-js'
const HTMLtoDOCX = require('html-to-docx')
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const readFile = util.promisify(fs.readFile);
export function writeCSV(fileName: string, header: any[], data: any[]) {
  let url = `${process.env.APP_STATICS}files/csv/${fileName}.csv`;
  const csvWriter = createCsvWriter({
    path: path.resolve(__dirname + "/../public/files/csv/" + fileName + ".csv"),
    header,
  });
  return csvWriter.writeRecords(data).then(() => {
    return url;
  });
}

export async function csvJSON(
  filename: string,
  dir: string = process.env.Attachment_Path
) {
  let csv = await readFile(path.resolve(dir, filename), "utf8");
  var lines = csv.split("\n");
  var result = [];
  var headers = [
    "ID",
    "PROCESS_ORDER",
    "PROCESS_NAME_EN",
    "PROCESS_NAME_AR",
    "PROCESS_ID",
    "PROCESS_NOTE_AR",
    "PROCESS_NOTE_EN",
    "START_DATE",
    "END_DATE",
    "DURATION",
    "CURRENT_STATUS",
    "PREDCESSOR_PROCESS_ID",
    "DEPENDENCY_TYPE",
    "PROCESS_TYPE",
    "Employees",
  ];
  //console.log(headers);

  for (let i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    let offset = 0;
    for (let j = 0; j < headers.length; j++) {
      let value: string = currentline[j + offset];
      if (value && value[0] == "[") {
        currentline[j] = value.substr(1);
        let valueArray: string[] = [];
        for (let y = j; y < currentline.length; y++) {
          offset++;
          value = currentline[j];
          if (value[value.length - 1] == "]") {
            valueArray.push(value.substr(0, value.length - 1));
            break;
          }
          valueArray.push(value);
        }
        obj[headers[j]] = valueArray;
      } else {
        value = value && value.toLocaleLowerCase() != "null" ? value : null;
        obj[headers[j]] = value;
      }
    }

    result.push(obj);
  }
  // auto binding for arrays
  return result;
}
export async function deletFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    await fs.unlinkSync(filePath);
  }
}
export async function isFileExist(filePath: string) {
  if (fs.existsSync(filePath)) {
    return true;
  }
  return false;
}
export async function freeAttachments(files: any[]) {
  for (let file of files) {
    deletFile(path.resolve(process.env.Attachment_Path, file.filename));
  }
}

export function printPDF(html: any, res: any) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  pdf.create(html, {
    format: 'A4',
    quality: "20",
    border: {
      bottom: "0.2in"
    }
  }).toStream((err, stream) => {
    stream.pipe(res)
  })
}

export async function printMS(html: string, res: any) {

  let data = await HTMLtoDOCX(html)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=test.docx`);
  res.setHeader('Content-Length', data.length)

  res.send(data)

}