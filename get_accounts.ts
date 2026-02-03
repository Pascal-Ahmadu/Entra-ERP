import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const keywords = ["Salary", "Wage", "Bank", "Cash", "Tax", "Pension", "NHF", "PAYE", "Liability", "Expense"];
    const accounts = await prisma.account.findMany();
    const filtered = accounts.filter((a: any) =>
        keywords.some(k => a.name.toLowerCase().includes(k.toLowerCase()))
    );
    console.log(JSON.stringify(filtered, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
