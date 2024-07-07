import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

//ROUTES IMPORTS
import authRouter from "./routes/auth.routes";
import apiRouter from "./routes/api.routes";

//SINGLE PRISMA CLIENT FOR ALL
export const prisma = new PrismaClient();

const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// API ROUTES
app.use("/auth", authRouter);
app.use("/api", apiRouter);

// CATCH UNREGISTERED ROUTES
app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

export default app
