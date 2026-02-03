"use client";

import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Analytics & Reports"
                subtitle="Generate deep insights from your ERP data with custom reporting tools."
                breadcrumbs={[{ label: "Analytics" }]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="card-body">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 italic">Performance Trends</h3>
                        <div className="h-64 flex items-end gap-1">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div key={i} className="flex-1 bg-orange-100 rounded-t group relative">
                                    <div className="absolute bottom-0 w-full bg-orange-600 rounded-t transition-all" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 font-bold mt-4 uppercase text-center tracking-widest">30 Day Multi-Module Aggregate Analysis</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 italic">Data Distribution</h3>
                        <div className="flex items-center justify-center h-64">
                            <div className="w-48 h-48 rounded-full border-20 border-orange-600 border-l-teal-500 border-b-yellow-400 border-r-red-400 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">84%</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Accuracy</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-600"></div><span className="text-[10px] font-bold text-gray-500">Finance</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500"></div><span className="text-[10px] font-bold text-gray-500">HR</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div><span className="text-[10px] font-bold text-gray-500">Ops</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div><span className="text-[10px] font-bold text-gray-500">Proc</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Generated Reports</h3>
                    <div className="flex flex-col gap-2">
                        <ReportItem name="Annual Financial Statement 2025" date="Jan 15, 2026" type="PDF" size="4.2 MB" />
                        <ReportItem name="Quarterly HR Retention Analysis" date="Jan 45, 2026" type="XLSX" size="1.8 MB" />
                        <ReportItem name="Operations Efficiency Audit" date="Jan 05, 2026" type="PDF" size="45.4 MB" />
                        <ReportItem name="Supply Chain Risk Assessment" date="Dec 28, 2025" type="PDF" size="3.1 MB" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReportItem({ name, date, type, size }: any) {
    return (
        <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl border border-transparent hover:border-orange-100 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "h-45 w-45 rounded-lg flex items-center justify-center text-xl font-bold",
                    type === "PDF" ? "bg-red-50 text-red-600" : "bg-teal-50 text-teal-600"
                )}>
                    <i className={cn("ti", type === "PDF" ? "ti-file-type-pdf" : "ti-file-spreadsheet")}></i>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{name}</p>
                    <p className="text-xs text-gray-400 font-medium">{date} • {size}</p>
                </div>
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-400 hover:text-orange-600 transition-all">
                <i className="ti ti-download text-xl"></i>
            </button>
        </div>
    );
}
