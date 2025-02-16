import * as multer from "multer";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as i18n from "i18n";
import { InvalidInputException } from "../errors/exceptions";
import { Logger } from "./logger";

export default class UploadService {
  private static _instance;

  private logger: Logger = Logger.Instance;

  constructor() {}

  static get Instance() {
    return this._instance ? this._instance : (this._instance = new this());
  }

  public uploadFiles = () => {
    this.createRequiredFolders();

    let storagePath =
      process.env.PATH_OVER_NETWORK === "true"
        ? process.env.STORAGE_PATH
        : path.resolve(process.env.STORAGE_PATH);

    let isStoragePathExist = fs.existsSync(storagePath);

    if (!isStoragePathExist) {
      throw new Error("Storage Path Not Exist");
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, storagePath);
      },
      filename: async (req, file, cb) => {
        let file_name = await this.getCryptoName(file);
        cb(null, file_name);
      },
    });

    const fileFilter = (req, file, cb) => {
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype == "application/vnd.ms-excel" ||
        file.mimetype == "application/vnd.ms-excel.sheet.macroenabled.12"
      ) {
        cb(null, true);
      } else {
        cb(new InvalidInputException(i18n.__("invalid_file_type")));
      }
    };

    return multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: { fileSize: Number(process.env.FILE_MAX_SIZE) },
    });
  };

  public getCryptoName = (file) => {
    if (!file.originalname) file.originalname = file.fileName;
    return new Promise((resolve, reject) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        resolve(
          raw.toString("hex") + Date.now() + path.extname(file.originalname)
        );
      });
    });
  };

  private createRequiredFolders() {
    this.mkDirByPathSync(`${__dirname}\\..\\..\\..\\public\\publications`);
    this.mkDirByPathSync(`${__dirname}\\..\\..\\..\\public\\uploads`);
  }

  public async copyFileAndDelete(
    folderPath,
    fileName,
    newFolderPath,
    newFileName
  ) {
    let filePath = `${folderPath}\\${fileName}`;
    let newFilePath = `${newFolderPath}\\${newFileName}`;
    await this.mkDirByPathSync(newFolderPath);
    if (fs.existsSync(filePath)) {
      fs.copyFile(filePath, newFilePath, (err) => {
        if (err) throw err;
        this.logger
          .log()
          .info(`file coppied from ${filePath} to ${newFilePath}`);
        fs.unlinkSync(filePath);
      });
    }
  }

  public mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : "";
    const baseDir = isRelativeToScript ? __dirname : ".";

    return targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code === "EEXIST") {
          // curDir already exists!
          return curDir;
        }

        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === "ENOENT") {
          // Throw the original parentDir error on curDir `ENOENT` failure.
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }

        const caughtErr = ["EACCES", "EPERM", "EISDIR"].indexOf(err.code) > -1;
        if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
          throw err; // Throw if it's just the last created dir.
        }
      }

      return curDir;
    }, initDir);
  }

  public async copyFilePath(folderPath, fileName, newFolderPath, newFileName) {
    let filePath = `${folderPath}\\${fileName}`;
    let newFilePath = `${newFolderPath}\\${newFileName}`;
    await this.mkDirByPathSync(newFolderPath);
    if (fs.existsSync(filePath)) {
      fs.copyFile(filePath, newFilePath, (err) => {
        if (err) throw err;
        this.logger
          .log()
          .info(`file coppied from ${filePath} to ${newFilePath}`);
      });
    }
  }

  public async copyFilePathToFinalPdf(
    folderPath,
    fileName,
    newFolderPath,
    newFileName
  ) {
    newFolderPath = newFolderPath + "\\final_pdf";
    let filePath = `${folderPath}\\${fileName}`;
    let newFilePath = `${newFolderPath}\\${newFileName}`;
    await this.mkDirByPathSync(newFolderPath);
    if (fs.existsSync(filePath)) {
      fs.copyFile(filePath, newFilePath, (err) => {
        if (err) throw err;
        this.logger
          .log()
          .info(`file coppied from ${filePath} to ${newFilePath}`);
      });
    }
  }

  public async copyFromFinalPdfToFinalPdf(
    folderPath,
    fileName,
    newFolderPath,
    newFileName
  ) {
    folderPath = folderPath + "\\final_pdf";
    newFolderPath = newFolderPath + "\\final_pdf";
    let filePath = `${folderPath}\\${fileName}`;
    let newFilePath = `${newFolderPath}\\${newFileName}`;
    await this.mkDirByPathSync(newFolderPath);
    if (fs.existsSync(filePath)) {
      fs.copyFile(filePath, newFilePath, (err) => {
        if (err) throw err;
        this.logger
          .log()
          .info(`file coppied from ${filePath} to ${newFilePath}`);
      });
    }
  }

  public async copyFromFinalPdfToPublication(
    folderPath,
    fileName,
    newFolderPath,
    newFileName
  ) {
    folderPath = folderPath + "\\final_pdf";
    newFolderPath = newFolderPath;
    let filePath = `${folderPath}\\${fileName}`;
    let newFilePath = `${newFolderPath}\\${newFileName}`;
    await this.mkDirByPathSync(newFolderPath);
    if (fs.existsSync(filePath)) {
      fs.copyFile(filePath, newFilePath, (err) => {
        if (err) throw err;
        this.logger
          .log()
          .info(`file coppied from ${filePath} to ${newFilePath}`);
      });
    }
  }

  public async deleteOldFiles(folderPath, fileName) {
    let filePath = `${folderPath}\\${fileName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
