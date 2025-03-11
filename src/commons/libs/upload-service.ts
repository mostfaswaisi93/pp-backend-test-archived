import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import i18n from "i18n";
import { InvalidInputException } from "../errors/exceptions";
import { Logger } from "./logger";

export default class UploadService {
  private static _instance: UploadService | null = null;
  private logger: Logger = Logger.Instance;

  private constructor() {
    this.createRequiredFolders();
  }

  public static get Instance(): UploadService {
    return this._instance ?? (this._instance = new UploadService());
  }

  public uploadFiles() {
    const storagePath =
      process.env.PATH_OVER_NETWORK === "true"
        ? process.env.STORAGE_PATH
        : path.resolve(process.env.STORAGE_PATH!);

    if (!storagePath || !fs.existsSync(storagePath)) {
      this.logger.log().error("Storage path does not exist.");
      throw new Error("Storage path does not exist.");
    }

    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, storagePath),
      filename: (_req, file, cb) => cb(null, this.getCryptoName(file)),
    });

    const fileFilter = (_req: any, file: any, cb: any) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/vnd.ms-excel.sheet.macroenabled.12",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new InvalidInputException(i18n.__("invalid_file_type")));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: Number(process.env.FILE_MAX_SIZE) || 2 * 1024 * 1024,
      },
    });
  }

  private getCryptoName(file: any): string {
    const raw = crypto.randomBytes(16).toString("hex");
    return `${raw}-${Date.now()}${path.extname(file.originalname)}`;
  }

  private createRequiredFolders() {
    const baseDir = path.resolve(__dirname, "../../../public");
    ["publications", "uploads"].forEach((dir) =>
      this.mkDirByPathSync(path.join(baseDir, dir))
    );
  }

  private mkDirByPathSync(targetDir: string) {
    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        this.logger.log().info(`Created directory: ${targetDir}`);
      }
    } catch (error) {
      this.logger
        .log()
        .error(`Failed to create directory: ${targetDir}`, error);
      throw new Error(`Failed to create directory: ${targetDir}`);
    }
  }

  private async copyFile(
    srcPath: string,
    destPath: string,
    deleteAfter = false
  ) {
    try {
      if (fs.existsSync(srcPath)) {
        await fs.promises.copyFile(srcPath, destPath);
        this.logger.log().info(`File copied from ${srcPath} to ${destPath}`);
        if (deleteAfter) {
          await fs.promises.unlink(srcPath);
          this.logger.log().info(`Deleted source file: ${srcPath}`);
        }
      }
    } catch (error) {
      this.logger
        .log()
        .error(`Failed to copy file from ${srcPath} to ${destPath}`, error);
    }
  }

  public async copyFileAndDelete(
    srcFolder: string,
    fileName: string,
    destFolder: string,
    newFileName: string
  ) {
    const srcPath = path.join(srcFolder, fileName);
    const destPath = path.join(destFolder, newFileName);
    await this.mkDirByPathSync(destFolder);
    await this.copyFile(srcPath, destPath, true);
  }

  public async copyFilePath(
    srcFolder: string,
    fileName: string,
    destFolder: string,
    newFileName: string
  ) {
    const srcPath = path.join(srcFolder, fileName);
    const destPath = path.join(destFolder, newFileName);
    await this.mkDirByPathSync(destFolder);
    await this.copyFile(srcPath, destPath);
  }

  public async copyFileToFinalPdf(
    srcFolder: string,
    fileName: string,
    destFolder: string,
    newFileName: string
  ) {
    await this.copyFilePath(
      path.join(srcFolder, "final_pdf"),
      fileName,
      path.join(destFolder, "final_pdf"),
      newFileName
    );
  }

  public async copyFromFinalPdfToPublication(
    srcFolder: string,
    fileName: string,
    destFolder: string,
    newFileName: string
  ) {
    await this.copyFilePath(
      path.join(srcFolder, "final_pdf"),
      fileName,
      destFolder,
      newFileName
    );
  }

  public async deleteOldFiles(folderPath: string, fileName: string) {
    const filePath = path.join(folderPath, fileName);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.log().info(`Deleted file: ${filePath}`);
      }
    } catch (error) {
      this.logger.log().error(`Failed to delete file: ${filePath}`, error);
    }
  }
}
