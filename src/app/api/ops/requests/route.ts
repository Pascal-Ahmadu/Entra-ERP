import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const requests = await prisma.assetRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: requests });
    } catch (error) {
        console.error("GET Asset Requests Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch asset requests" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const assetRequest = await prisma.assetRequest.create({
            data: {
                requesterName: body.requesterName,
                department: body.department,
                category: body.category,
                description: body.description,
                urgency: body.urgency,
                status: "Pending"
            }
        });
        return NextResponse.json({ success: true, data: assetRequest }, { status: 201 });
    } catch (error) {
        console.error("POST Asset Request Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create asset request" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        const assetRequest = await prisma.assetRequest.update({
            where: { id },
            data: data
        });

        return NextResponse.json({ success: true, data: assetRequest });
    } catch (error) {
        console.error("PATCH Asset Request Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update asset request" }, { status: 500 });
    }
}
