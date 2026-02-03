import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all accounts in the COA
export async function GET() {
    try {
        const accounts = await prisma.account.findMany({
            orderBy: { code: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: accounts,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch accounts" }, { status: 500 });
    }
}

// POST create a new account
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, name, type, subType, category } = body;

        // Simple validation
        if (!code || !name || !type) {
            return NextResponse.json({ success: false, error: "Missing required fields: code, name, type" }, { status: 400 });
        }

        // Check if code already exists
        const existing = await prisma.account.findUnique({ where: { code } });
        if (existing) {
            return NextResponse.json({ success: false, error: `Account with code ${code} already exists` }, { status: 400 });
        }

        const newAccount = await prisma.account.create({
            data: {
                code,
                name,
                type,
                subType,
                category,
                balance: 0.0
            }
        });

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            data: newAccount
        }, { status: 201 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 });
    }
}
