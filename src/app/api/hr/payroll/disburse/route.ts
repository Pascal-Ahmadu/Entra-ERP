import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const runId = parseInt(searchParams.get("runId") || "");

        if (isNaN(runId)) {
            return NextResponse.json({ success: false, error: "Invalid Payroll Run ID" }, { status: 400 });
        }

        const run = await prisma.payrollRun.findUnique({
            where: { id: runId },
            include: {
                lines: true
            }
        });

        if (!run) {
            return NextResponse.json({ success: false, error: "Payroll run not found" }, { status: 404 });
        }

        // Fetch employee details for all lines to get bank info
        const employeeIds = run.lines.map(l => l.employeeId);
        const employees = await prisma.employee.findMany({
            where: { id: { in: employeeIds } }
        });

        // Create CSV Header
        let csv = "Employee Name,Bank Name,Account Number,Net Pay,Narration\n";

        const MONTHS = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const narration = `Salary Payment - ${MONTHS[run.month - 1]} ${run.year}`;

        // Add CSV Rows
        run.lines.forEach(line => {
            const emp = employees.find(e => e.id === line.employeeId);
            const empName = line.employeeName.replace(/,/g, ""); // Remove commas to avoid breaking CSV
            const bankName = (emp?.bank || "N/A").replace(/,/g, "");
            const accountNo = emp?.accountNo || "N/A";
            const netPay = line.netPay.toFixed(2);

            csv += `${empName},${bankName},${accountNo},${netPay},${narration}\n`;
        });

        // Return CSV as a download
        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="Payroll_Schedule_${run.month}_${run.year}.csv"`
            }
        });

    } catch (error) {
        console.error("Error generating bank CSV:", error);
        return NextResponse.json({ success: false, error: "Failed to generate CSV" }, { status: 500 });
    }
}
