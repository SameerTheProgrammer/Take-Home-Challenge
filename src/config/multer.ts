import multer from "multer";

// Configure multer to store files in memory and accept only PDF files
const storage = multer.memoryStorage();
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
        return callback(new Error("Only PDF files are allowed"));
    }
    callback(null, true);
};
export const upload = multer({ storage: storage, fileFilter: fileFilter });
