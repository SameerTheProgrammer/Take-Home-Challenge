import express from "express";
const app = express();

const PORT = 8000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`server is running on port ${PORT}..`);
});
