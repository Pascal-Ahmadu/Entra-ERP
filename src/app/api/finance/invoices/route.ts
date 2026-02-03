import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const invoices = await prisma.invoice.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: invoices });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch invoices" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientName, clientEmail, date, dueDate, items } = body;

        // Basic Validation
        if (!clientName || !clientEmail || !items || items.length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate Invoice Number (e.g. INV-20240131-001)
        // For simplicity using timestamp suffix: INV-{Timestamp}
        const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

        // Calculate total server side for safety
        const totalAmount = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                clientName,
                clientEmail,
                date: new Date(date),
                dueDate: new Date(dueDate),
                totalAmount,
                status: "DRAFT",
                items: {
                    create: items.map((item: any) => ({
                        description: item.description,
                        quantity: Number(item.quantity),
                        unitPrice: Number(item.unitPrice),
                        amount: Number(item.quantity) * Number(item.unitPrice)
                    }))
                }
            }
        });

        return NextResponse.json({ success: true, data: invoice });

    } catch (error: any) {
        console.error("Error creating invoice:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create invoice" },
            { status: 500 }
        );
    }
}
