"use client";

import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import Image from "next/image";

const users = [
    { id: 1, name: "Admin User", email: "admin@entra.com", role: "Super Admin", lastLogin: "2 mins ago", status: "Active" },
    { id: 2, name: "Sarah Connor", email: "sarah.c@entra.com", role: "HR Manager", lastLogin: "1 hour ago", status: "Active" },
    { id: 3, name: "John Wick", email: "john.w@entra.com", role: "Finance Head", lastLogin: "Jan 30", status: "Inactive" },
    { id: 4, name: "Ethan Hunt", email: "ethan.h@entra.com", role: "Ops Lead", lastLogin: "Last Week", status: "Active" },
];

export default function UsersPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="User Management"
                subtitle="Control access, roles, and security policies for your team."
                breadcrumbs={[{ label: "User Management" }]}
            />

            <div className="card">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-8">
                        <div className="relative">
                            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all outline-none min-w-[300px]"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-orange-700 active:scale-95 transition-all">
                            Invite New User
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                    <th className="px-4 py-3">User info</th>
                                    <th className="px-4 py-3">Assigned Role</th>
                                    <th className="px-4 py-3">Last Activity</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-700 text-sm">{user.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-medium text-gray-600">{user.role}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-xs font-medium text-gray-400">{user.lastLogin}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                    user.status === "Active" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-400"
                                                )}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="p-2 hover:bg-white hover:shadow-sm rounded transition-all text-gray-400 hover:text-orange-600"><i className="ti ti-edit"></i></button>
                                                <button className="p-2 hover:bg-white hover:shadow-sm rounded transition-all text-gray-400 hover:text-red-500"><i className="ti ti-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center opacity-30">
                                            <i className="ti ti-user-x text-6xl"></i>
                                            <p className="text-lg font-bold mt-2">No Users Configured</p>
                                            <p className="text-sm">Add system users and assign roles to get started.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RolePolicyCard title="Security Policies" desc="2FA enabled for 85% of users." status="Compliant" color="teal" />
                <RolePolicyCard title="Access Logs" desc="45 failed login attempts today." status="Review" color="yellow" />
                <RolePolicyCard title="Recent Roles" desc="3 new custom roles created." status="Update" color="orange" />
            </div>
        </div>
    );
}

function RolePolicyCard({ title, desc, status, color }: any) {
    const colorMap: any = {
        teal: "text-teal-600 bg-teal-50/50 border-teal-100",
        yellow: "text-yellow-600 bg-yellow-50/50 border-yellow-100",
        orange: "text-orange-600 bg-orange-50/50 border-orange-100"
    };

    return (
        <div className="card border border-transparent hover:shadow-lg transition-all">
            <div className="card-body p-5">
                <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest">{title}</h4>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter border", colorMap[color])}>{status}</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">{desc}</p>
                <button className="mt-4 text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">
                    Manage Settings <i className="ti ti-arrow-right"></i>
                </button>
            </div>
        </div>
    );
}
