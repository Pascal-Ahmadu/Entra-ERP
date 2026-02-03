import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to calculate business days (Monday-Friday)
function countBusinessDays(startDate: Date, endDate: Date) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
            count++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

// GET - List all leave requests
export async function GET() {
    try {
        const leaves = await prisma.leaveRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: leaves });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch leaves" }, { status: 500 });
    }
}

// POST - Create a new leave request
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employeeId, type, startDate, endDate, reason } = body;

        if (!employeeId || !type || !startDate || !endDate) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            return NextResponse.json({ success: false, error: "End date cannot be before start date" }, { status: 400 });
        }

        // Calculate days (business days only)
        const days = countBusinessDays(start, end);

        if (days <= 0) {
            return NextResponse.json({ success: false, error: "Leave duration must be at least 1 working day" }, { status: 400 });
        }

        // Fetch employee name
        const employee = await prisma.employee.findUnique({
            where: { id: Number(employeeId) }
        });

        if (!employee) {
            return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
        }

        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                employeeId: Number(employeeId),
                employeeName: employee.name,
                type,
                startDate: start,
                endDate: end,
                days,
                reason: reason || "",
                status: "Pending"
            }
        });

        return NextResponse.json({ success: true, data: leaveRequest }, { status: 201 });

    } catch (error) {
        console.error("Error creating leave request:", error);
        return NextResponse.json({ success: false, error: "Failed to create leave request" }, { status: 500 });
    }
}
