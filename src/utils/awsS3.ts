import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import createHttpError from "http-errors";
import env from "../config/dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";

// Initialize the S3 client
const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Upload a buffer to S3
 * @param file - The file object from Multer
 * @param userId - The ID of the user uploading the file
 * @returns The data from the S3 upload response
 */

export const uploadToS3 = async (file: Express.Multer.File, userId: string) => {
    const uploadParams = {
        Bucket: env.S3_BUCKET_NAME,
        Key: `uploads/${userId}/${file.originalname}-${Date.now()}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const result = await s3.send(new PutObjectCommand(uploadParams));
        return { key: uploadParams.Key, result };
    } catch (err) {
        const error = createHttpError(
            500,
            "Error while uploading file in aws s3",
        );
        throw error;
    }
};

/**
 * Get a signed URL for a file in S3
 * @param key - The key of the file in S3
 * @returns The signed URL for the file
 */
export const getPdfUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
    });

    try {
        const url = await getSignedUrl(s3, command);
        return url;
    } catch (err) {
        throw new Error("Error while generating signed URL");
    }
};
