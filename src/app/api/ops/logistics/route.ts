import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: { shipments: true }
        });
        const shipments = await prisma.shipment.findMany({
            include: { vehicle: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: {
                vehicles,
                shipments
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch logistics data" }, { status: 500 });
    }
}
