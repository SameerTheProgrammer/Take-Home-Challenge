export const splitText = (text: string, chunkSize = 800, overlap = 100) => {
    const chunks = [];
    let start = 0;
    let round = 1;
    while (round < Math.ceil(text.length / chunkSize)) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.substring(start, end));
        start = end - overlap;
        round += 1;
    }
    return chunks;
};
