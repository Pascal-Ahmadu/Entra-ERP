"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { cn } from "@/lib/utils";

const ProjectRow = ({ project }: any) => {
    const statusColors: any = {
        "Planning": "bg-yellow-100 text-yellow-800",
        "In Progress": "bg-orange-100 text-orange-800",
        "Completed": "bg-teal-100 text-teal-800"
    };

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div>
                <h4 className="font-bold text-gray-800">{project.name}</h4>
                <p className="text-xs text-gray-500">{project.client}</p>
            </div>
            <div className="flex items-center gap-4">
                <span className={cn("px-2 py-1 rounded text-xs font-bold", statusColors[project.status] || "bg-gray-100 text-gray-800")}>
                    {project.status}
                </span>
                <div className="text-right w-24">
                    <p className="text-xs font-bold text-gray-500 mb-1">{project.progress}%</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function OperationsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [projRes, statRes] = await Promise.all([
                    fetch("/api/ops/projects"),
                    fetch("/api/ops/analytics")
                ]);
                const projJson = await projRes.json();
                const statJson = await statRes.json();

                if (projJson.success) setProjects(projJson.data);
                if (statJson.success) setStats(statJson.data);
            } catch (err) {
                console.error("Failed to load ops data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const taskStats = stats?.taskStats || { total: 0, inProgress: 0, planning: 0, done: 0 };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Operations Control"
                subtitle="Monitor ongoing projects, resource allocation, and workflow efficiency."
                breadcrumbs={[{ label: "Operations" }]}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Active Projects" value={loading ? "..." : stats?.activeProjects?.toString() || "0"} sub="Current Initiatives" icon="subtask" color="orange" trend="Stable" />
                        <StatCard title="Total Projects" value={loading ? "..." : stats?.totalProjects?.toString() || "0"} sub="All time" icon="folder" color="teal" trend="+1" />
                        <StatCard title="Efficiency" value={loading ? "..." : (stats?.efficiency + "%") || "N/A"} sub="Target: 95%" icon="bolt" color="yellow" trend="-0.8%" />
                    </div>

                    {/* Quick Access */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/assets" className="card hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-teal-500">
                            <div className="card-body flex items-center gap-4">
                                <div className="p-3 rounded-full bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    <i className="ti ti-box text-2xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Asset Registry</h4>
                                    <p className="text-sm text-gray-500">Manage laptops, furniture & equipment.</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/operations/logistics" className="card hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-orange-500">
                            <div className="card-body flex items-center gap-4">
                                <div className="p-3 rounded-full bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    <i className="ti ti-truck text-2xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Logistics Hub</h4>
                                    <p className="text-sm text-gray-500">Track fleet & shipments.</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Live Project Tracking</h3>
                                <button className="text-sm text-orange-600 font-bold hover:underline">View All</button>
                            </div>

                            {loading ? (
                                <div className="p-8 text-center text-gray-400">Loading projects...</div>
                            ) : projects.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 opacity-50">
                                    <i className="ti ti-folder-off text-4xl mb-2"></i>
                                    <p>No Active Projects</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {projects.map((p: any) => (
                                        <ProjectRow key={p.id} project={p} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Workflow Status</h3>
                            <div className="h-64 flex items-center justify-center relative">
                                <div className="w-48 h-48 rounded-full border-4 shadow-xl border-orange-100 relative flex items-center justify-center bg-orange-50/30">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-800">{taskStats.total}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Tasks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 mt-6">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-600"></span><span className="text-gray-500">In Progress</span></div>
                                    <span className="text-gray-800">{taskStats.inProgress}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500"></span><span className="text-gray-500">Completed</span></div>
                                    <span className="text-gray-800">{taskStats.done}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span><span className="text-gray-500">Planning (Todo)</span></div>
                                    <span className="text-gray-800">{taskStats.planning}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


