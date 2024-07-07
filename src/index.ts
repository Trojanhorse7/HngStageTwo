import "dotenv/config";
const port = process.env.PORT || 3000;
import {prisma} from "./app"
import app from "./app";

//PRISMA CONNECT
async function main() {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();