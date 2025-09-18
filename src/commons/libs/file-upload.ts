import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";

type MulterFile = Express.Multer.File;

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID as string,
  },
});

const awsStorage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_BUCKET_ACCESS_IMAGES as string,
  key: (
    req: Request,
    file: MulterFile,
    cb: (error: any, key?: string) => void
  ) => {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

export const s3FileUploadAPI = () => {
  return multer({ storage: awsStorage });
};
