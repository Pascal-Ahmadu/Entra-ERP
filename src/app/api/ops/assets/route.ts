import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const assets = await prisma.asset.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: assets });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch assets" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const asset = await prisma.asset.create({
            data: {
                ...body,
                purchaseDate: new Date(body.purchaseDate),
                purchaseCost: parseFloat(body.purchaseCost),
                currentValue: parseFloat(body.currentValue),
                tagNumber: body.tagNumber,
                receiptUrl: body.receiptUrl
            }
        });
        return NextResponse.json({ success: true, data: asset }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to create asset" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        // Date handling for updates
        if (data.disposalDate) {
            data.disposalDate = new Date(data.disposalDate);
        }
        // disposalType is just a string, no parsing needed
        if (data.purchaseDate) {
            data.purchaseDate = new Date(data.purchaseDate);
        }

        const asset = await prisma.asset.update({
            where: { id },
            data: data
        });
        return NextResponse.json({ success: true, data: asset });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update asset" }, { status: 500 });
    }
}
