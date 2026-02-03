import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all job postings
export async function GET() {
    try {
        const jobPostings = await prisma.jobPosting.findMany({
            include: {
                applications: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: jobPostings,
            timestamp: new Date().toISOString(),
            module: "Recruitment"
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch job postings" }, { status: 500 });
    }
}

// POST create new job posting
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newJob = await prisma.jobPosting.create({
            data: {
                title: body.title,
                department: body.department,
                location: body.location,
                type: body.type || "Full-Time",
                salary: body.salary,
                description: body.description,
                requirements: body.requirements,
                status: "Open",
                postedBy: body.postedBy || "HR Team",
            }
        });

        return NextResponse.json({
            success: true,
            message: "Job posting created successfully",
            data: newJob
        }, { status: 201 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ success: false, error: "Failed to create job posting" }, { status: 500 });
    }
}
