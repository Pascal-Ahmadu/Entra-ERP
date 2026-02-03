import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const incidents = await prisma.incident.findMany({
            include: {
                asset: {
                    select: {
                        name: true,
                        tagNumber: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
        return NextResponse.json({ success: true, data: incidents });
    } catch (error) {
        console.error("GET Incidents Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch incidents" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const incident = await prisma.incident.create({
            data: {
                assetId: parseInt(body.assetId),
                reportedBy: body.reportedBy,
                description: body.description,
                date: new Date(body.date),
                status: body.status || "Open",
                resolution: body.resolution
            },
            include: {
                asset: true
            }
        });
        return NextResponse.json({ success: true, data: incident }, { status: 201 });
    } catch (error) {
        console.error("Error creating incident:", error);
        return NextResponse.json({ success: false, error: "Failed to create incident" }, { status: 500 });
    }
}
