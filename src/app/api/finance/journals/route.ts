import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST create a new journal entry (Double Entry)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, description, reference, lines } = body;

        // Validation
        if (!date || !description || !lines || lines.length < 2) {
            return NextResponse.json({
                success: false,
                error: "Invalid request. Date, description, and at least 2 lines are required."
            }, { status: 400 });
        }

        // Validate Balance (Debits must equal Credits)
        // We expect lines to have 'debit' and 'credit' fields from the UI
        // We will convert them to a single 'amount' field (Positive for Debit, Negative for Credit)
        let totalDebit = 0;
        let totalCredit = 0;

        const processedLines = lines.map((line: any) => {
            const debit = parseFloat(line.debit || "0");
            const credit = parseFloat(line.credit || "0");

            totalDebit += debit;
            totalCredit += credit;

            // Net amount for this line
            // Debit is +, Credit is -
            const amount = debit - credit;

            return {
                accountId: parseInt(line.accountId),
                amount: amount
            };
        });

        // Check if balanced (allow small floating point diff)
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            return NextResponse.json({
                success: false,
                error: `Journal is not balanced. Debits: ${totalDebit}, Credits: ${totalCredit}`
            }, { status: 400 });
        }

        // Transactional Write
        const journalEntry = await prisma.$transaction(async (tx) => {
            // 1. Create Journal Parent
            const je = await tx.journalEntry.create({
                data: {
                    date: new Date(date),
                    description,
                    reference,
                    // Create lines
                    lines: {
                        create: processedLines.map((line: any) => ({
                            accountId: line.accountId,
                            amount: line.amount
                        }))
                    }
                },
                include: { lines: true }
            });

            // 2. Update Account Balances
            for (const line of processedLines) {
                await tx.account.update({
                    where: { id: line.accountId },
                    data: {
                        balance: { increment: line.amount }
                    }
                });
            }

            return je;
        });

        return NextResponse.json({
            success: true,
            message: "Journal Entry posted successfully",
            data: journalEntry
        }, { status: 201 });

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to post journal entry" }, { status: 500 });
    }
}
