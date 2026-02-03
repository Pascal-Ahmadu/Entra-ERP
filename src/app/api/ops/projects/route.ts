import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List all projects with task stats
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                tasks: true
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Calculate derived progress based on completed tasks if needed, 
        // or just return the record as is.
        const enrichedProjects = projects.map(p => ({
            ...p,
            taskCount: p.tasks.length,
            completedTaskCount: p.tasks.filter(t => t.status === "Done").length
        }));

        return NextResponse.json({ success: true, data: enrichedProjects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
    }
}

// POST - Create new project
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, client, priority, budget, startDate, endDate } = body;

        const project = await prisma.project.create({
            data: {
                name,
                client,
                priority,
                budget: parseFloat(budget),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: "Planning"
            }
        });

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
    }
}
