import express, { Request, Response } from "express";
// Initialize Express app
const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to take-home-challenge site");
});

export default app;
