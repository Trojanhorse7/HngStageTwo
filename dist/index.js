"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const port = process.env.PORT || 3000;
const app_1 = require("./app");
const app_2 = __importDefault(require("./app"));
//PRISMA CONNECT
async function main() {
    try {
        await app_1.prisma.$connect();
        app_2.default.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
    catch (e) {
        console.error(e);
        await app_1.prisma.$disconnect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map