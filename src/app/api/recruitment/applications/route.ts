import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all applications
export async function GET() {
    try {
        const applications = await prisma.application.findMany({
            include: {
                jobPosting: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: applications,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch applications" }, { status: 500 });
    }
}

// POST create new application
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newApplication = await prisma.application.create({
            data: {
                jobPostingId: parseInt(body.jobPostingId),
                candidateName: body.candidateName,
                candidateEmail: body.candidateEmail,
                candidatePhone: body.candidatePhone,
                resume: body.resume,
                coverLetter: body.coverLetter,
                status: "New",
            }
        });

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully",
            data: newApplication
        }, { status: 201 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to submit application" }, { status: 500 });
    }
}
