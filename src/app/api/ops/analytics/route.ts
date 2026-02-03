import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: { tasks: true }
        });

        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.status === "In Progress").length;

        // Calculate Task Stats
        let totalTasks = 0;
        let inProgressTasks = 0;
        let planningTasks = 0;
        let doneTasks = 0;

        projects.forEach(p => {
            p.tasks.forEach(t => {
                totalTasks++;
                if (t.status === "In Progress") inProgressTasks++;
                if (t.status === "Todo") planningTasks++;
                if (t.status === "Done") doneTasks++;
            });
        });

        // Mock Efficiency (Could be based on deadlines vs completion time in future)
        const efficiency = 92.5;

        return NextResponse.json({
            success: true,
            data: {
                totalProjects,
                activeProjects,
                efficiency,
                taskStats: {
                    total: totalTasks,
                    inProgress: inProgressTasks,
                    planning: planningTasks,
                    done: doneTasks
                }
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
    }
}
