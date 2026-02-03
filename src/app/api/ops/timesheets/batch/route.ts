import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { employeeId, employeeName, entries } = body;

        if (!employeeId || !entries || !Array.isArray(entries)) {
            return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
        }

        // We use a transaction to ensure all entries are saved or none
        await prisma.$transaction(async (tx) => {
            for (const entry of entries) {
                const entryDate = new Date(entry.date);
                // Clear existing entry for this specific project/task/day combo for this employee
                // This allows "updates" by overwriting
                await tx.timesheet.deleteMany({
                    where: {
                        employeeId: parseInt(employeeId),
                        date: entryDate,
                        projectId: entry.projectId ? parseInt(entry.projectId) : null,
                        taskId: entry.taskId ? parseInt(entry.taskId) : null,
                    }
                });

                // Only create if hours > 0
                if (entry.hours > 0) {
                    await tx.timesheet.create({
                        data: {
                            employeeId: parseInt(employeeId),
                            employeeName: employeeName,
                            date: entryDate,
                            hours: parseFloat(entry.hours),
                            description: entry.description || "",
                            projectId: entry.projectId ? parseInt(entry.projectId) : null,
                            taskId: entry.taskId ? parseInt(entry.taskId) : null,
                            status: entry.status || "Draft",
                            supervisorStatus: "Pending",
                            financeStatus: "Pending",
                            hrStatus: "Pending"
                        }
                    });
                }
            }
        });

        return NextResponse.json({ success: true, message: "Week saved successfully" });
    } catch (error) {
        console.error("Batch Timesheet Error:", error);
        return NextResponse.json({ success: false, error: "Failed to save timesheet batch" }, { status: 500 });
    }
}
