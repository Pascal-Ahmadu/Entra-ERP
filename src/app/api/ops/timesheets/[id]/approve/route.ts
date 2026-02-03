import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params;
        const body = await request.json();
        const { stage, status, approvedBy } = body; // stage: 'supervisor' | 'finance' | 'hr'
        const id = parseInt(paramId);

        let updateData: any = {};
        const now = new Date();

        if (stage === 'supervisor') {
            updateData.supervisorStatus = status;
            updateData.supervisorBy = approvedBy;
            updateData.supervisorAt = now;
        } else if (stage === 'finance') {
            updateData.financeStatus = status;
            updateData.financeBy = approvedBy;
            updateData.financeAt = now;
        } else if (stage === 'hr') {
            updateData.hrStatus = status;
            updateData.hrBy = approvedBy;
            updateData.hrAt = now;
            // If HR approved, mark the whole timesheet as Approved
            if (status === 'Approved') {
                updateData.status = 'Approved';
            }
        }

        if (status === 'Rejected') {
            updateData.status = 'Rejected';
        }

        const timesheet = await prisma.timesheet.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, data: timesheet });
    } catch (error) {
        console.error("PATCH Timesheet Approval Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update approval status" }, { status: 500 });
    }
}
