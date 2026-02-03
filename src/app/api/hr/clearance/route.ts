import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const clearances = await prisma.staffClearance.findMany({
            include: {
                employee: {
                    select: {
                        dept: true,
                        role: true
                    }
                }
            },
            orderBy: { requestDate: 'desc' }
        });
        return NextResponse.json({ success: true, data: clearances });
    } catch (error) {
        console.error("GET Clearance Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch clearances" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Check if active clearance already exists
        const existing = await prisma.staffClearance.findFirst({
            where: {
                employeeId: body.employeeId,
                finalStatus: "In Progress"
            }
        });

        if (existing) {
            return NextResponse.json({ success: false, error: "Clearance already in progress" }, { status: 400 });
        }

        const clearance = await prisma.staffClearance.create({
            data: {
                employeeId: body.employeeId,
                employeeName: body.employeeName,
                remarks: body.remarks
            }
        });

        return NextResponse.json({ success: true, data: clearance }, { status: 201 });
    } catch (error) {
        console.error("POST Clearance Error:", error);
        return NextResponse.json({ success: false, error: "Failed to initiate clearance" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        // Simple logic: if all depts are cleared, set finalStatus to Completed
        // In a real app, this might be a separate trigger or button

        const clearance = await prisma.staffClearance.update({
            where: { id },
            data: data
        });

        // Check if all cleared to auto-complete (optional, maybe keep manual)
        if (
            clearance.assetStatus === 'Cleared' &&
            clearance.financeStatus === 'Cleared' &&
            clearance.hrStatus === 'Cleared' &&
            clearance.deptStatus === 'Cleared' &&
            clearance.finalStatus !== 'Completed'
        ) {
            // We could auto-complete, but let's let HR do the final sign-off
        }

        return NextResponse.json({ success: true, data: clearance });
    } catch (error) {
        console.error("PATCH Clearance Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update clearance" }, { status: 500 });
    }
}
