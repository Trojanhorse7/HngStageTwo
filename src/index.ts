import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

//ROUTES IMPORTS
import authRouter from "./routes/auth.routes";

//SINGLE PRISMA CLIENT FOR ALL
export const prisma = new PrismaClient();

async function main() {
  const app = express();
  const port = process.env.PORT || 3000;

  //MIDDLEWARES
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors())

  // API ROUTES
  app.use("/auth", authRouter);

  // CATCH UNREGISTERED ROUTES
  app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

//PRISMA CONNECT
main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });