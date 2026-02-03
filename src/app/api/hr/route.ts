import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: employees,
            timestamp: new Date().toISOString(),
            module: "Human Resources"
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newEmployee = await prisma.employee.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                idType: body.idType,
                idNumber: body.idNumber,
                stateOfOrigin: body.stateOfOrigin || "Lagos",
                hasPassport: !!body.hasPassport,
                hasCredentials: !!body.hasCredentials,
                role: body.role || "New Hire",
                dept: body.dept || "Operations",
                type: body.type || "Full-Time",
                salary: body.salary || "N/A",
                pfa: body.pfa,
                rsa: body.rsa,
                hmo: body.hmo,
                bloodGroup: body.bloodGroup,
                medicalCond: body.medicalCond,
                proofOfLife: body.proofOfLife,
                uniqueTrait: body.uniqueTrait,
                bank: body.bank,
                accountNo: body.accountNo,
                bvn: body.bvn,
                nokName: body.nokName,
                nokPhone: body.nokPhone,
                status: "Active",
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name)}&background=f97316&color=fff`
            }
        });

        return NextResponse.json({
            success: true,
            message: "Employee registered successfully",
            data: newEmployee
        }, { status: 201 });
    } catch (error) {
        console.error("Database error details:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to save data",
            details: error instanceof Error ? error.message : "Unknown error",
            code: (error as any).code
        }, { status: 500 });
    }
}
