const { PrismaClient } = require("@prisma/client");

async function testPrisma() {
    const prisma = new PrismaClient();

    try {
        console.log("Testing Prisma connection...");
        const count = await prisma.employee.count();
        console.log(`✅ Prisma connected! Employee count: ${count}`);

        const employees = await prisma.employee.findMany();
        console.log(`✅ Found ${employees.length} employees:`, employees);
    } catch (error) {
        console.error("❌ Prisma error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testPrisma();
