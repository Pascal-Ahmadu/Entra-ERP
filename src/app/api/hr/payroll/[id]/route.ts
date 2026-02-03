import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch single payroll line (payslip)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const payrollLineId = parseInt(id);

        if (isNaN(payrollLineId)) {
            return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
        }

        const payslip = await prisma.payrollLine.findUnique({
            where: { id: payrollLineId },
            include: {
                payrollRun: true
            }
        });

        if (!payslip) {
            return NextResponse.json({ success: false, error: "Payslip not found" }, { status: 404 });
        }

        // Fetch employee details
        const employee = await prisma.employee.findUnique({
            where: { id: payslip.employeeId }
        });

        return NextResponse.json({
            success: true,
            data: {
                ...payslip,
                employee
            }
        });
    } catch (error) {
        console.error("Error fetching payslip:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch payslip" }, { status: 500 });
    }
}
