"use client";

import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/shared/PageHeader";
import { TimesheetGrid } from "@/components/operations/timesheets/TimesheetGrid";
import { Info, HelpCircle, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TimesheetsPage() {
    const { user } = useAuth();
    const today = new Date();

    return (
        <div className="flex flex-col gap-8 pb-12">
            <PageHeader
                title="Timesheet Portal"
                subtitle="High-fidelity enterprise time tracking and project attribution system."
                breadcrumbs={[{ label: "Operations", href: "/operations" }, { label: "Timesheets" }]}
                action={
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]">
                            Live System
                        </Badge>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + i * 10}`} alt="avatar" />
                                </div>
                            ))}
                        </div>
                    </div>
                }
            />

            {/* Core Grid component - Managing its own monthly navigation */}
            <div className="w-full">
                <TimesheetGrid
                    weekStart={today}
                    employeeId={user?.id || 1}
                    employeeName={user?.name || "Staff Member"}
                    onSaveSuccess={() => {
                        console.log("Timesheet data synchronized successfully.");
                    }}
                />
            </div>

            {/* Premium Instruction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col gap-4 group hover:scale-[1.02] transition-all duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Efficient Entry</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                            Log hours directly into the monthly grid. Use the <span className="text-slate-900 font-black">TAB</span> key to navigate between days rapidly for high-speed data input.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col gap-4 group hover:scale-[1.02] transition-all duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Audit Compliance</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                            Detailed activity narratives are required for all project billings. Ensure your descriptions meet the <span className="text-orange-600 font-black">Standard Compliance Protocols</span>.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col gap-4 group hover:scale-[1.02] transition-all duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Workflow Status</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                            Once submitted, your timesheet transitions to <span className="text-blue-600 font-black">Pending Approval</span>. Final attribution occurs after Finance and HR validation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
