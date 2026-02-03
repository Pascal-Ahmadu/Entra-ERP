import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Nigerian PAYE Tax Bands (Annual Limits)
const TAX_BANDS = [
    { limit: 300000, rate: 0.07 },   // 7%
    { limit: 300000, rate: 0.11 },   // 11%
    { limit: 500000, rate: 0.15 },   // 15%
    { limit: 500000, rate: 0.19 },   // 19%
    { limit: 1600000, rate: 0.21 },  // 21%
    { limit: Infinity, rate: 0.24 }  // 24%
];

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Calculate CRA (Consolidated Relief Allowance)
function calculateCRA(grossAnnual: number): number {
    const fixedOrPercent = Math.max(200000, grossAnnual * 0.01);
    return fixedOrPercent + (grossAnnual * 0.20);
}

// Calculate Annual PAYE
function calculateAnnualPAYE(grossAnnual: number): number {
    const cra = calculateCRA(grossAnnual);
    const taxableIncome = Math.max(0, grossAnnual - cra);

    let tax = 0;
    let remaining = taxableIncome;

    for (const band of TAX_BANDS) {
        if (remaining <= 0) break;
        const taxableAmount = Math.min(remaining, band.limit);
        tax += taxableAmount * band.rate;
        remaining -= taxableAmount;
    }

    return tax;
}

// GET - Fetch payroll runs
export async function GET() {
    try {
        const payrollRuns = await prisma.payrollRun.findMany({
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
            include: {
                lines: true
            }
        });

        return NextResponse.json({
            success: true,
            data: payrollRuns
        });
    } catch (error) {
        console.error("Error fetching payroll:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch payroll data" }, { status: 500 });
    }
}

// POST - Create and calculate new payroll run
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { month, year, include13thMonth, airtimeDataPercentage = 0 } = body;

        if (!month || !year) {
            return NextResponse.json({ success: false, error: "Month and year are required" }, { status: 400 });
        }

        // Check if payroll already exists for this month
        const existing = await prisma.payrollRun.findFirst({
            where: { month, year }
        });

        if (existing) {
            if (existing.status === "DRAFT") {
                // Delete existing draft and its lines to allow a fresh run
                await prisma.payrollRun.delete({
                    where: { id: existing.id }
                });
            } else {
                return NextResponse.json({
                    success: false,
                    error: `Payroll for ${MONTHS[month - 1]} ${year} is already ${existing.status} and cannot be re-run.`
                }, { status: 400 });
            }
        }

        // Fetch all active employees
        const employees = await prisma.employee.findMany({
            where: { status: "Active" }
        });

        if (employees.length === 0) {
            return NextResponse.json({
                success: false,
                error: "No active employees found"
            }, { status: 400 });
        }

        // Calculate payroll for each employee
        const payrollLines = employees.map(emp => {
            // Parse salary (remove commas, ₦ symbol, etc.)
            const salaryStr = emp.salary?.replace(/[₦,\s]/g, '') || '0';
            const monthlyBasic = parseFloat(salaryStr) || 0;
            const allowances = monthlyBasic * 0.15; // 15% transport + housing allowance

            // New Additions:
            const bonus = include13thMonth ? monthlyBasic : 0; // 100% of Basic as 13th Month
            const cashBenefits = monthlyBasic * (Number(airtimeDataPercentage) / 100); // Percentage of Basic as Airtime/Data

            const monthlyGross = monthlyBasic + allowances + bonus + cashBenefits;

            // Annual Calculation (Marginal Tax Approach for Bonus)
            // Note: For simplicity in this Corporate system, we strictly annualize the *Monthly Gross* to find the tax bracket.
            // This ensures higher tax is deducted in the bonus month, which is correct for PAYE.
            const annualGross = monthlyGross * 12;

            // Calculate deductions
            const annualCRA = calculateCRA(annualGross);
            const annualTaxable = Math.max(0, annualGross - annualCRA);
            const annualPAYE = calculateAnnualPAYE(annualGross);

            const monthlyPAYE = annualPAYE / 12;
            const monthlyCRA = annualCRA / 12;
            const monthlyTaxable = annualTaxable / 12;

            // Pension (8% of Total Gross)
            const pension = monthlyGross * 0.08;

            // NHF (2.5% of Basic Salary)
            const nhf = monthlyBasic * 0.025;

            // Net Pay
            const netPay = monthlyGross - monthlyPAYE - pension - nhf;

            return {
                employeeId: emp.id,
                employeeName: emp.name,
                basicSalary: monthlyBasic,
                allowances: allowances,
                bonus: bonus,
                cashBenefits: cashBenefits,
                grossPay: monthlyGross,
                cra: monthlyCRA,
                taxableIncome: monthlyTaxable,
                paye: monthlyPAYE,
                pension: pension,
                nhf: nhf,
                netPay: netPay
            };
        });

        // Calculate totals
        const totalGross = payrollLines.reduce((sum, l) => sum + l.grossPay, 0);
        const totalPaye = payrollLines.reduce((sum, l) => sum + l.paye, 0);
        const totalPension = payrollLines.reduce((sum, l) => sum + l.pension, 0);
        const totalNhf = payrollLines.reduce((sum, l) => sum + l.nhf, 0);
        const totalNet = payrollLines.reduce((sum, l) => sum + l.netPay, 0);

        // Create payroll run with lines
        const payrollRun = await prisma.payrollRun.create({
            data: {
                month,
                year,
                status: "DRAFT",
                totalGross,
                totalPaye,
                totalPension,
                totalNhf,
                totalNet,
                employeeCount: payrollLines.length,
                lines: {
                    create: payrollLines
                }
            },
            include: {
                lines: true
            }
        });

        return NextResponse.json({
            success: true,
            message: `Payroll for ${month}/${year} created successfully`,
            data: payrollRun
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating payroll:", error);
        return NextResponse.json({ success: false, error: "Failed to create payroll" }, { status: 500 });
    }
}

// PATCH - Process/Authorize payroll run
export async function PATCH(request: Request) {
    try {
        const { id } = await request.json();
        const runId = parseInt(id);

        if (isNaN(runId)) {
            return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
        }

        const run = await prisma.payrollRun.findUnique({
            where: { id: runId },
            include: { lines: true }
        });

        if (!run) {
            return NextResponse.json({ success: false, error: "Payroll run not found" }, { status: 404 });
        }

        if (run.status !== "DRAFT") {
            return NextResponse.json({ success: false, error: "Only draft payrolls can be processed" }, { status: 400 });
        }

        // 1. Create a Journal Entry for this payroll
        const monthName = MONTHS[run.month - 1];
        const description = `Payroll Disbursement - ${monthName} ${run.year}`;

        // Find necessary accounts
        const accounts = await prisma.account.findMany({
            where: {
                code: { in: ["1103", "2103", "2105", "2106", "5001"] }
            }
        });

        const getAccount = (code: string) => accounts.find(a => a.code === code);
        const salariesExp = getAccount("5001"); // Expense
        const bankAcc = getAccount("1103");      // Asset
        const payeAcc = getAccount("2103");      // Liability
        const pensionAcc = getAccount("2105");   // Liability
        const nhfAcc = getAccount("2106");       // Liability

        if (!salariesExp || !bankAcc || !payeAcc || !pensionAcc || !nhfAcc) {
            return NextResponse.json({
                success: false,
                error: "One or more required accounting codes (1103, 2103, 2105, 2106, 5001) are missing from the Chart of Accounts. Please ensure COA is seeded."
            }, { status: 400 });
        }

        // 2. Perform everything in a transaction
        await prisma.$transaction(async (tx) => {
            // A. Create Journal Entry
            await tx.journalEntry.create({
                data: {
                    date: new Date(),
                    description,
                    reference: `PAY-${run.id}`,
                    lines: {
                        create: [
                            { accountId: salariesExp.id, amount: run.totalGross },    // Debit Expense (+)
                            { accountId: bankAcc.id, amount: -run.totalNet },       // Credit Asset (-)
                            { accountId: payeAcc.id, amount: -run.totalPaye },      // Credit Liability (-)
                            { accountId: pensionAcc.id, amount: -run.totalPension }, // Credit Liability (-)
                            { accountId: nhfAcc.id, amount: -run.totalNhf },       // Credit Liability (-)
                        ]
                    }
                }
            });

            // B. Update Account Balances
            // Note: In this system, balance adjustment logic should match Journal Entry increments.
            await tx.account.update({ where: { id: salariesExp.id }, data: { balance: { increment: run.totalGross } } });
            await tx.account.update({ where: { id: bankAcc.id }, data: { balance: { decrement: run.totalNet } } });
            await tx.account.update({ where: { id: payeAcc.id }, data: { balance: { increment: run.totalPaye } } });
            await tx.account.update({ where: { id: pensionAcc.id }, data: { balance: { increment: run.totalPension } } });
            await tx.account.update({ where: { id: nhfAcc.id }, data: { balance: { increment: run.totalNhf } } });

            // C. Update Payroll Run Status
            await tx.payrollRun.update({
                where: { id: runId },
                data: {
                    status: "PROCESSED",
                    processedAt: new Date()
                }
            });
        });

        return NextResponse.json({ success: true, message: "Payroll processed and accounting entries created successfully" });

    } catch (error) {
        console.error("Error processing payroll:", error);
        return NextResponse.json({ success: false, error: "Failed to process payroll" }, { status: 500 });
    }
}
