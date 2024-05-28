import pdfParse from "pdf-parse";

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
    const data = await pdfParse(buffer);
    return data.text.replace(/\n/g, "").replace("", "");
};
