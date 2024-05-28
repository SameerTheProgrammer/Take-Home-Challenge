import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { PassThrough } from "stream";
import s3 from "./../config/s3";
import createHttpError from "http-errors";
import env from "../config/dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Function to upload a buffer to S3
export const uploadToS3 = async (file: Express.Multer.File) => {
    const passThrough = new PassThrough();
    passThrough.end(file.buffer);

    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `uploads/${file.originalname}`,
        Body: passThrough,
        ContentType: file.mimetype,
    };

    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        return data;
    } catch (err) {
        const error = createHttpError(
            500,
            "Error while uploading file in aws s3",
        );
        throw error;
    }
};

export const getPdfUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
    });
    const url = await getSignedUrl(s3, command);
    return url;
};
