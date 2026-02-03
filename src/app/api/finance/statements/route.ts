import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const accounts = await prisma.account.findMany();

        // Helper to find balance by specific code or name pattern if needed, 
        // but here we just group by subType/Category.

        // --- BALANCE SHEET DATA ---
        const assets = {
            nonCurrent: accounts.filter(a => a.type === "Asset" && a.subType === "Non-Current").map(a => ({ label: a.name, value: a.balance })),
            current: accounts.filter(a => a.type === "Asset" && a.subType === "Current").map(a => ({ label: a.name, value: a.balance })),
        };

        const liabilities = {
            nonCurrent: accounts.filter(a => a.type === "Liability" && a.subType === "Non-Current").map(a => ({ label: a.name, value: a.balance })),
            current: accounts.filter(a => a.type === "Liability" && a.subType === "Current").map(a => ({ label: a.name, value: a.balance })),
        };

        // Calculate Net Profit for Retained Earnings
        const totalRevenue = accounts.filter(a => a.type === "Revenue").reduce((sum, a) => sum + a.balance, 0);
        const totalExpense = accounts.filter(a => a.type === "Expense").reduce((sum, a) => sum + a.balance, 0);
        const netProfit = totalRevenue - totalExpense;

        const equity = accounts.filter(a => a.type === "Equity").map(a => ({ label: a.name, value: a.balance }));

        // Add Retained Earnings to Equity to insure BS balances
        equity.push({ label: "Retained Earnings (Current Year)", value: netProfit });

        // --- CASH FLOW DATA ---
        // For a real Cash Flow, we'd calculate movement. For this demo with seeded balances,
        // we will simulate the Cash Flow structure using the seeded categories.
        // In a real app, this would be: Cash Flow = Delta in Balance from StartDate to EndDate.
        // We will assume the "Balance" represents the "Net Movement" for the period for simplicity in this view,
        // except for Cash which is the closing balance.

        // This is a SIMPLIFICATION for the display requirement.

        const operating = {
            start: { label: "Profit/Loss Before Tax", value: accounts.filter(a => a.type === "Revenue").reduce((sum, a) => sum + a.balance, 0) - accounts.filter(a => a.type === "Expense").reduce((sum, a) => sum + a.balance, 0) },
            adjustments: [{ label: "No Adjustments Recorded", value: 0 }],
            workingCapital: accounts.filter(a => a.category === "Operating" && a.type === "Asset" && a.subType === "Current").map(a => ({
                label: `Movement in ${a.name}`,
                value: 0
            })),
            taxPaid: { label: "Tax Paid", value: 0 }
        };

        const investing = accounts.filter(a => a.category === "Investing").map(a => ({
            label: `Investment in ${a.name}`,
            value: 0
        }));

        const financing = accounts.filter(a => a.category === "Financing").map(a => ({
            label: `Financing from ${a.name}`,
            value: 0
        }));

        // Dynamically build Income Statement from live accounts
        const revAccounts = accounts.filter(a => a.type === "Revenue");
        const expAccounts = accounts.filter(a => a.type === "Expense");
        const taxAccounts = accounts.filter(a => a.category === "Tax" && a.type === "Expense");

        // Group expenses (Operating vs Direct vs Financial)
        const directExp = expAccounts.filter(a => a.category === "Direct" || a.subType === "Direct");
        const operatingExp = expAccounts.filter(a => a.category === "Operating" || a.subType === "Operating" || a.subType === "Current");
        const financialExp = expAccounts.filter(a => a.category === "Financial" || a.subType === "Financial");

        // Reconciliation starting balances should be 0 unless seeded.
        const reconciliationBegin = 0;

        return NextResponse.json({
            success: true,
            data: {
                balanceSheet: {
                    assets,
                    liabilities,
                    equity
                },
                cashFlow: {
                    operating,
                    investing,
                    financing,
                    reconciliation: {
                        begin: reconciliationBegin,
                        fxEffect: 0
                    }
                },
                incomeStatement: {
                    revenue: {
                        total: revAccounts.reduce((sum, a) => sum + a.balance, 0),
                        items: revAccounts.length > 0 ? revAccounts.map(a => ({ label: a.name, value: a.balance })) : [{ label: "No Revenue Recorded", value: 0 }]
                    },
                    cogs: {
                        total: directExp.reduce((sum, a) => sum + a.balance, 0),
                        items: directExp.length > 0 ? directExp.map(a => ({ label: a.name, value: a.balance })) : [{ label: "No Direct Costs Recorded", value: 0 }]
                    },
                    operatingExpenses: {
                        total: operatingExp.reduce((sum, a) => sum + a.balance, 0),
                        items: operatingExp.length > 0 ? operatingExp.map(a => ({ label: a.name, value: a.balance })) : [{ label: "No Operating Expenses", value: 0 }]
                    },
                    depreciationAmortization: {
                        total: 0,
                        items: [{ label: "Not Calculated", value: 0 }]
                    },
                    financeCosts: {
                        net: financialExp.reduce((sum, a) => sum + a.balance, 0),
                        items: financialExp.length > 0 ? financialExp.map(a => ({ label: a.name, value: a.balance })) : [{ label: "No Finance Costs", value: 0 }]
                    },
                    taxation: {
                        total: taxAccounts.reduce((sum, a) => sum + a.balance, 0),
                        items: taxAccounts.length > 0 ? taxAccounts.map(a => ({ label: a.name, value: a.balance })) : [{ label: "No Tax Recorded", value: 0 }]
                    }
                }
            }
        });

    } catch (error: any) {
        console.error("Error fetching financial statements:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch financial statements" },
            { status: 500 }
        );
    }
}
