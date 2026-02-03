import { PrismaClient } from "../generated/client_v2";

const globalForPrisma = global as unknown as { prismaInstanceV3: PrismaClient };

export const prisma =
    globalForPrisma.prismaInstanceV3 ||
    new PrismaClient({
        log: ["query"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaInstanceV3 = prisma;
