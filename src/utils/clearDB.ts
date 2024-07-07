import { prisma } from "../index";

async function clearDatabase() {
    try {
        await prisma.user.deleteMany({});
        await prisma.organisation.deleteMany({});
        await prisma.organisationUser.deleteMany({});
        // Add more deleteMany calls for other tables as needed
        console.log('Database cleared successfully');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();