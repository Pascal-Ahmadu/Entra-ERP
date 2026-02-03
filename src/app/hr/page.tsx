"use client";

import PageHeader from "@/components/shared/PageHeader";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HRPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [empRes, leavesRes] = await Promise.all([
                fetch("/api/hr"),
                fetch("/api/hr/leaves")
            ]);

            const empJson = await empRes.json();
            const leavesJson = await leavesRes.json();

            setEmployees(empJson.data || []);
            setLeaves(leavesJson.data || []);
            setLoading(false);
        } catch (err) {
            console.error("API error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Human Resources"
                subtitle="Manage your workforce, payroll, and recruitment pipeline."
                breadcrumbs={[{ label: "Human Resources" }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value={loading ? "..." : employees.length.toLocaleString()}
                    icon="users"
                    color="orange"
                    trend="+0%"
                />
                <StatCard
                    title="New Joinees"
                    value={loading ? "..." : employees.filter(e => {
                        const month = new Date(e.createdAt).getMonth();
                        const currentMonth = new Date().getMonth();
                        return month === currentMonth;
                    }).length.toString()}
                    icon="user-plus" color="teal" trend="+0%"
                />
                <StatCard
                    title="Leave  Requests"
                    value={loading ? "..." : (employees.filter(e => e.status === "On Leave").length + leaves.filter(l => l.status === "Pending").length).toString()}
                    icon="calendar-off" color="yellow" trend="0%"
                />
                <StatCard title="Resignations" value="0" icon="user-minus" color="red" trend="0%" />
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Employee Directory</h3>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                                <i className="ti ti-download text-lg"></i> Export
                            </button>
                            <Link
                                href="/hr/add"
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                            >
                                <i className="ti ti-plus text-lg"></i> Add Employee
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                    <th className="px-4 py-3 text-center">S/N</th>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {employees.length > 0 ? (
                                    employees.map((emp, index) => (
                                        <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-[10px] font-bold text-gray-400 tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Image src={emp.image} alt={emp.name} width={40} height={40} className="rounded-full shadow-sm" />
                                                    <div>
                                                        <p className="font-bold text-gray-700 text-sm">{emp.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{emp.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-gray-600 font-medium">{emp.dept}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border",
                                                    emp.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {emp.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="text-gray-400 hover:text-orange-600 transition-colors">
                                                    <i className="ti ti-dots text-xl"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-40">
                                                <i className="ti ti-users-group text-6xl"></i>
                                                <div>
                                                    <p className="text-lg font-bold text-gray-800">No Employees Found</p>
                                                    <p className="text-sm text-gray-400">Start by adding your first team member to the system.</p>
                                                </div>
                                                <Link
                                                    href="/hr/add"
                                                    className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold opacity-100! hover:bg-orange-700 transition-all"
                                                >
                                                    + Add First Employee
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, trend }: any) {
    const colorMap: any = {
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        teal: "bg-teal-50 text-teal-600 border-teal-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
        red: "bg-red-50 text-red-600 border-red-100"
    };

    return (
        <div className={cn("card border border-transparent hover:border-orange-100 transition-all")}>
            <div className="card-body p-5">
                <div className="flex justify-between items-start">
                    <div className={cn("p-2 rounded-lg", colorMap[color])}>
                        <i className={`ti ti-${icon} text-2xl`}></i>
                    </div>
                    <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded",
                        trend.startsWith("+") ? "bg-teal-50 text-teal-600" : "bg-red-50 text-red-600"
                    )}>
                        {trend}
                    </span>
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">{title}</p>
                </div>
            </div>
        </div>
    );
}
