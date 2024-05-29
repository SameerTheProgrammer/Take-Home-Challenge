import pdfParse from "pdf-parse";

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
    const data = await pdfParse(buffer, { max: 5 });
    return data.text.replace(/\n/g, " ");
};
