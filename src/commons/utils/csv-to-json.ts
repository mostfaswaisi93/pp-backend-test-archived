import { exceptionMap } from "../../commons/enums/http-exception";
import { HttpException } from "../helpers/exception";
import APP_REGEX from "./constants";

const csvToJson = (csvTxt: string) => {
  let grid: any[] = csvTxt.toString().split("\r\n");

  //* remove the last index if empty
  if (grid.length && grid[grid.length - 1] == "") {
    grid.pop();
  }

  if (!grid.length) throw new HttpException(exceptionMap.resourceNotFound); // if no data

  if (grid.length - 1 < 1)
    throw new HttpException(exceptionMap.excelValidations.noUsersFound); // if headers only exists without data

  let headers: string[] = grid.shift().split(",");
  let data: any = [];

  let newHeaders: any[] = [];
  //* Convert incoming headers to database instant form // First Name English => firstNameEN
  headers.forEach((head) => {
    let newHead: string = transformHeader(head);
    newHeaders.push(newHead);
  });

  newHeaders = newHeaders.map((head) => {
    return {
      header: head,
      isRequired: getRequiredFields(head),
      applyRegex: regexNeeded(head),
    };
  });

  grid.forEach((row) => {
    let rowArr = row.split(",");
    let obj = {};

    for (let i = 0; i < newHeaders.length; i++) {
      let key = newHeaders[i];
      let value = rowArr[i];

      // check if required value is empty
      if (key.isRequired && !value)
        throw new HttpException(exceptionMap.excelValidations.requiredFields);

      // check if value is not correct
      if (key.applyRegex) regexValidator(key.header, value);

      obj = { ...obj, [key.header]: value };
    }
    data.push(obj);
  });

  return data.map((employee: any, index: number) => {
    return { ...employee, id: index + 1 };
  });
};

function transformHeader(head: string) {
  switch (head.trim()) {
    case "Email":
      return "email";
    case "Employee code":
      return "employeeCode";
    case "First name Arabic":
      return "firstName";
    case "First name English":
      return "firstNameEn";
    case "Last name Arabic":
      return "lastName";
    case "Last name English":
      return "lastNameEn";
    case "Department":
      return "dirCode";
    case "Job title":
      return "hirRoleCode";
    case "Country code":
      return "countryCodeId";
    case "Phone":
      return "mobileNo";
    case "EXT":
      return "phoneExt";
    default:
      return head.toLocaleLowerCase();
  }
}

function getRequiredFields(head: string): boolean {
  switch (head.trim()) {
    case "email":
      return true;
    case "employeeCode":
      return true;
    case "firstName":
      return true;
    case "firstNameEn":
      return true;
    case "dirCode":
      return true;
    case "hirRoleCode":
      return true;
    case "mobileNo":
      return true;
    default:
      return false;
  }
}

function regexNeeded(head: string): boolean {
  switch (head) {
    case "email":
      return true;
    case "employeeCode":
      return true;
    case "dirCode":
      return true;
    case "hirRoleCode":
      return true;
    case "mobileNo":
      return true;
    case "phoneExt":
      return true;
    case "countryCodeId":
      return true;
    default:
      return false;
  }
}

function regexValidator(head: string, value: any) {
  switch (head) {
    case "email":
      return isEmailValid(value);
    case "employeeCode":
      return isEmployeeCodeValid(value);
    case "mobileNo":
      return isMobileNumberValid(value);
    case "dirCode":
      return isNumberValid(head, value);
    case "hirRoleCode":
      return isNumberValid(head, value);
    case "phoneExt":
      return isNumberValid(head, value);
    case "countryCodeId":
      return isNumberValid(head, value);
    default:
      return false;
  }
}

function isEmailValid(value: string) {
  if (!APP_REGEX.email().test(value))
    throw new HttpException(exceptionMap.excelValidations.wrongEmailFormat);
}

function isEmployeeCodeValid(value: string) {
  if (!APP_REGEX.number().test(value))
    throw new HttpException(
      exceptionMap.excelValidations.wrongEmployeeCodeFormat
    );
  if (value.length > 5)
    throw new HttpException(
      exceptionMap.excelValidations.wrongEmployeeCodeLength
    );
}

function isMobileNumberValid(value: string) {
  if (!APP_REGEX.number().test(value))
    throw new HttpException(exceptionMap.excelValidations.wrongMobileNumber);
}

function isNumberValid(head: string, value: any) {
  if (!APP_REGEX.numberMinMax(1, 5).test(value)) {
    head = capitalizeFirstLetter(head);
    // throw new HttpException(exceptionMap.excelValidations["wrong" + head]);
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default csvToJson;
