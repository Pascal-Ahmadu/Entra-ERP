import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all expense requests
export async function GET() {
    try {
        const expenses = await prisma.expenseRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: expenses,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch expense requests" }, { status: 500 });
    }
}

// POST create new expense request
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Generate unique request number
        const requestNumber = `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        const newExpense = await prisma.expenseRequest.create({
            data: {
                requestNumber,
                staffName: body.staffName,
                staffEmail: body.staffEmail,
                department: body.department,
                category: body.category,
                amount: parseFloat(body.amount),
                description: body.description,
                purpose: body.purpose,
                attachments: body.attachments,
                status: "Pending HOD",
            }
        });

        return NextResponse.json({
            success: true,
            message: "Expense request submitted successfully",
            data: newExpense
        }, { status: 201 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to create expense request" }, { status: 500 });
    }
}

// PATCH approve/reject expense
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, level, action, approver, comments } = body;

        const expense = await prisma.expenseRequest.findUnique({ where: { id: parseInt(id) } });

        if (!expense) {
            return NextResponse.json({ success: false, error: "Expense not found" }, { status: 404 });
        }

        let updateData: any = {};

        // HOD Level
        if (level === "HOD") {
            updateData.hodApproval = action;
            updateData.hodApprovedBy = approver;
            updateData.hodApprovedAt = new Date();
            updateData.hodComments = comments;

            if (action === "Approved") {
                updateData.status = "Pending Finance";
            } else {
                updateData.status = "Rejected by HOD";
                updateData.finalStatus = "Rejected";
            }
        }

        // Finance Level
        if (level === "Finance") {
            updateData.financeApproval = action;
            updateData.financeApprovedBy = approver;
            updateData.financeApprovedAt = new Date();
            updateData.financeComments = comments;

            if (action === "Approved") {
                updateData.status = "Pending COE";
            } else {
                updateData.status = "Rejected by Finance";
                updateData.finalStatus = "Rejected";
            }
        }

        // COE Level
        if (level === "COE") {
            updateData.coeApproval = action;
            updateData.coeApprovedBy = approver;
            updateData.coeApprovedAt = new Date();
            updateData.coeComments = comments;

            if (action === "Approved") {
                updateData.status = "Approved";
                updateData.finalStatus = "Approved";
            } else {
                updateData.status = "Rejected by COE";
                updateData.finalStatus = "Rejected";
            }
        }

        const updatedExpense = await prisma.expenseRequest.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            message: `Expense ${action.toLowerCase()} successfully`,
            data: updatedExpense
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to update expense" }, { status: 500 });
    }
}
