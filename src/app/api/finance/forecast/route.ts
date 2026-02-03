import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Fetch Current Month's Data (Baseline)
        const accounts = await prisma.account.findMany();

        const revAccounts = accounts.filter(a => a.type === "Revenue");
        const expAccounts = accounts.filter(a => a.type === "Expense");

        const currentMonthlyRev = revAccounts.reduce((sum, a) => sum + a.balance, 0) / 12; // Simple baseline: Average per month if annual seeding
        const currentMonthlyExp = expAccounts.reduce((sum, a) => sum + a.balance, 0) / 12;

        // 2. Fetch Assumptions
        let assumption = await prisma.forecastAssumption.findFirst();
        if (!assumption) {
            assumption = await prisma.forecastAssumption.create({
                data: {
                    revenueGrowth: 5.0,
                    expenseInflation: 2.0,
                    headcountGrowth: 0,
                    projectionMonths: 12
                }
            });
        }

        // 3. Generate 12-Month Projections
        const projections = [];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let startMonth = new Date().getMonth();

        let projectedRev = currentMonthlyRev || 1500000; // Default if zero
        let projectedExp = currentMonthlyExp || 800000;  // Default if zero
        let cumulativeProfit = 0;

        // Average Salary Assumption for new hires
        const avgSalary = 500000;

        for (let i = 1; i <= assumption.projectionMonths; i++) {
            const monthIdx = (startMonth + i) % 12;

            // Apply Growth Assumptions
            projectedRev = projectedRev * (1 + (assumption.revenueGrowth / 100));

            // Base Expense Inflation
            projectedExp = projectedExp * (1 + (assumption.expenseInflation / 100));

            // Add Headcount impact
            projectedExp += (assumption.headcountGrowth * i * avgSalary);

            const monthlyProfit = projectedRev - projectedExp;
            cumulativeProfit += monthlyProfit;

            projections.push({
                month: months[monthIdx],
                revenue: Math.round(projectedRev),
                expenses: Math.round(projectedExp),
                profit: Math.round(monthlyProfit),
                cumulative: Math.round(cumulativeProfit)
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                assumptions: assumption,
                projections
            }
        });

    } catch (error) {
        console.error("Forecasting Error:", error);
        return NextResponse.json({ success: false, error: "Failed to generate forecast" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { revenueGrowth, expenseInflation, headcountGrowth } = body;

        const updated = await prisma.forecastAssumption.upsert({
            where: { id: 1 },
            update: {
                revenueGrowth: parseFloat(revenueGrowth),
                expenseInflation: parseFloat(expenseInflation),
                headcountGrowth: parseInt(headcountGrowth)
            },
            create: {
                id: 1,
                revenueGrowth: parseFloat(revenueGrowth),
                expenseInflation: parseFloat(expenseInflation),
                headcountGrowth: parseInt(headcountGrowth)
            }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update assumptions" }, { status: 500 });
    }
}
