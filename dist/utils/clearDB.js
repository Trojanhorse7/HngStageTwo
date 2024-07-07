"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
async function clearDatabase() {
    try {
        await app_1.prisma.user.deleteMany({});
        await app_1.prisma.organisation.deleteMany({});
        await app_1.prisma.organisationUser.deleteMany({});
        // Add more deleteMany calls for other tables as needed
        console.log('Database cleared successfully');
    }
    catch (error) {
        console.error('Error clearing database:', error);
    }
    finally {
        await app_1.prisma.$disconnect();
    }
}
clearDatabase();
//# sourceMappingURL=clearDB.js.map