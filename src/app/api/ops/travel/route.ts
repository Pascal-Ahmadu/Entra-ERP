import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const requests = await prisma.travelRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: requests });
    } catch (error) {
        console.error("GET Travel Requests Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch travel requests" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const travelRequest = await prisma.travelRequest.create({
            data: {
                employeeId: body.employeeId,
                employeeName: body.employeeName,
                destination: body.destination,
                purpose: body.purpose,
                travelDate: new Date(body.travelDate),
                returnDate: new Date(body.returnDate),
                estimatedCost: parseFloat(body.estimatedCost),
                advanceAmount: parseFloat(body.advanceAmount || 0),
                transportMode: body.transportMode
            }
        });

        return NextResponse.json({ success: true, data: travelRequest }, { status: 201 });
    } catch (error) {
        console.error("POST Travel Request Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create travel request" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        const travelRequest = await prisma.travelRequest.update({
            where: { id },
            data: data
        });

        return NextResponse.json({ success: true, data: travelRequest });
    } catch (error) {
        console.error("PATCH Travel Request Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update travel request" }, { status: 500 });
    }
}
