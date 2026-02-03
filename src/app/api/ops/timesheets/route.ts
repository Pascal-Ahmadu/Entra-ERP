import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get("employeeId");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const where: any = {};
        if (employeeId) where.employeeId = parseInt(employeeId);
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const timesheets = await prisma.timesheet.findMany({
            where,
            include: {
                project: {
                    select: {
                        name: true
                    }
                },
                task: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
        return NextResponse.json({ success: true, data: timesheets });
    } catch (error) {
        console.error("GET Timesheets Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch timesheets" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const timesheet = await prisma.timesheet.create({
            data: {
                employeeId: parseInt(body.employeeId),
                employeeName: body.employeeName,
                date: new Date(body.date),
                hours: parseFloat(body.hours),
                description: body.description,
                projectId: body.projectId ? parseInt(body.projectId) : null,
                taskId: body.taskId ? parseInt(body.taskId) : null,
                status: "Submitted", // Default to submitted when created via the modal
                supervisorStatus: "Pending",
                financeStatus: "Pending",
                hrStatus: "Pending"
            }
        });

        return NextResponse.json({ success: true, data: timesheet }, { status: 201 });
    } catch (error) {
        console.error("Error creating timesheet:", error);
        return NextResponse.json({ success: false, error: "Failed to log timesheet" }, { status: 500 });
    }
}
