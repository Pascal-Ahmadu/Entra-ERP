"use client";

import { useState, useEffect } from "react";
import {
    TrendingUp, ArrowRight, Settings2, BarChart3,
    ArrowUpRight, ArrowDownRight, Target, Users,
    RefreshCw, Info, CheckCircle2, AlertCircle,
    Layers, LineChart, Sparkles, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Projection {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    cumulative: number;
}

interface Assumptions {
    revenueGrowth: number;
    expenseInflation: number;
    headcountGrowth: number;
}

export default function ForecastPage() {
    const [projections, setProjections] = useState<Projection[]>([]);
    const [assumptions, setAssumptions] = useState<Assumptions>({
        revenueGrowth: 5.0,
        expenseInflation: 2.0,
        headcountGrowth: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    useEffect(() => {
        fetchForecast();
    }, []);

    const fetchForecast = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/finance/forecast");
            const data = await res.json();
            if (data.success) {
                setProjections(data.data.projections);
                setAssumptions(data.data.assumptions);
            }
        } catch (error) {
            console.error("Forecast fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        setStatus(null);
        try {
            const res = await fetch("/api/finance/forecast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(assumptions)
            });
            const data = await res.json();
            if (data.success) {
                await fetchForecast();
                setStatus({ type: 'success', msg: 'Assumptions updated and model recalculated!' });
            } else {
                setStatus({ type: 'error', msg: 'Failed to update model.' });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Connection error.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadCSV = () => {
        if (!projections.length) return;

        const headers = ["Fiscal Month", "Projected Revenue", "OpEx & Cost", "Projected Profit", "Margin %"];
        const rows = projections.map(p => [
            p.month,
            p.revenue.toString(),
            p.expenses.toString(),
            p.profit.toString(),
            ((p.profit / p.revenue) * 100).toFixed(2) + "%"
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `finance_forecast_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Building Forecast...</p>
            </div>
        </div>
    );

    const totalProjectedProfit = projections.reduce((sum, p) => sum + p.profit, 0);
    const breakEvenMonth = projections.find(p => p.profit > 0)?.month || "TBD";

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-y-auto">
            <div className="relative z-10 p-10 pt-16 space-y-12 max-w-[1300px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-200 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em]">Strategy & Planning</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                                Financial Forecast <span className="text-slate-200 ml-2 font-light">v2.0</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                Simulate enterprise performance using live ledger data. Project trajectories with custom growth benchmarks.
                            </p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 pt-2">
                        <Link href="/finance" className="group flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl font-black text-xs text-slate-500 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all hover:shadow-md active:scale-95">
                            Back to Hub
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Assumptions Panel (Glassmorphism) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="backdrop-blur-xl bg-white/70 rounded-3xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden">
                            <div className="p-6 border-b border-slate-100/50 flex items-center justify-between bg-white/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                        <Settings2 className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-black text-slate-900 tracking-tight text-lg">Model Setup</h3>
                                </div>
                                <Sparkles className="w-5 h-5 text-indigo-400 opacity-50" />
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Revenue Growth */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Growth</p>
                                            <p className="text-sm font-bold text-slate-800">Target Revenue</p>
                                        </div>
                                        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-black text-lg tabular-nums">
                                            {assumptions.revenueGrowth}%
                                        </div>
                                    </div>
                                    <input
                                        type="range" min="0" max="50" step="0.5"
                                        value={assumptions.revenueGrowth}
                                        onChange={(e) => setAssumptions({ ...assumptions, revenueGrowth: parseFloat(e.target.value) })}
                                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                        Compounding monthly yield based on average sales pipeline.
                                    </p>
                                </div>

                                {/* Expense Inflation */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost Drivers</p>
                                            <p className="text-sm font-bold text-slate-800">OpEx Inflation</p>
                                        </div>
                                        <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl font-black text-xl tabular-nums">
                                            {assumptions.expenseInflation}%
                                        </div>
                                    </div>
                                    <input
                                        type="range" min="0" max="20" step="0.1"
                                        value={assumptions.expenseInflation}
                                        onChange={(e) => setAssumptions({ ...assumptions, expenseInflation: parseFloat(e.target.value) })}
                                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                        Expected increase in utilities, vendor costs, and rent.
                                    </p>
                                </div>

                                {/* Headcount Growth */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Talent Acquisition</p>
                                            <p className="text-sm font-bold text-slate-800">New Monthly Hires</p>
                                        </div>
                                        <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xl tabular-nums">
                                            +{assumptions.headcountGrowth}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                                        <button
                                            onClick={() => setAssumptions({ ...assumptions, headcountGrowth: Math.max(0, assumptions.headcountGrowth - 1) })}
                                            className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-lg hover:shadow-md transition-all active:scale-95"
                                        >-</button>
                                        <div className="flex-1 text-center font-black text-2xl text-slate-900 tracking-tighter">{assumptions.headcountGrowth}</div>
                                        <button
                                            onClick={() => setAssumptions({ ...assumptions, headcountGrowth: assumptions.headcountGrowth + 1 })}
                                            className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-lg hover:shadow-md transition-all active:scale-95"
                                        >+</button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                                >
                                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-indigo-400 group-hover:scale-125 transition-transform" />}
                                    Recalculate Model
                                </button>

                                {status && (
                                    <div className={cn(
                                        "p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4",
                                        status.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                                    )}>
                                        <div className={status.type === 'success' ? "p-2 bg-emerald-100 rounded-lg" : "p-2 bg-red-100 rounded-lg"}>
                                            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        </div>
                                        <p className="text-xs font-bold leading-tight">{status.msg}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary Result Card */}
                        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-[0_32px_64px_-16px_rgba(79,70,229,0.3)] relative overflow-hidden group">
                            <Target className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-[30deg] transition-transform duration-700" />
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Projected Performance Portfolio</h4>
                                    <div className="text-5xl font-black tracking-tighter tabular-nums pt-2">
                                        ₦{(totalProjectedProfit / 1000000).toFixed(2)}M
                                    </div>
                                    <p className="text-xs font-medium text-indigo-100">Next 12-month net potential yield</p>
                                </div>
                                <div className="pt-8 border-t border-white/20 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Break-even Horizon</p>
                                        <p className="font-black text-2xl tracking-tight">{breakEvenMonth.toUpperCase()}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ring-4 ring-white/10">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projections Visuals (Glassmorphism) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Trend Visualization */}
                        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] p-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <LineChart className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-black text-slate-900 tracking-tight text-xl">Revenue vs Operating Income</h3>
                                </div>
                                <div className="flex items-center gap-6 self-end sm:self-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.5)]"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Profit</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-end justify-between h-56 gap-2 sm:gap-4">
                                {projections.map((p, idx) => {
                                    const maxVal = Math.max(...projections.map(d => d.revenue));
                                    const height = (p.revenue / maxVal) * 100;
                                    const profitHeight = (p.profit / p.revenue) * 100;
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-4 group relative h-full">
                                            {/* Tooltip */}
                                            <div className="absolute -top-16 bg-slate-900 text-white text-[10px] px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 font-black shadow-xl -translate-y-2 group-hover:translate-y-0 flex flex-col items-center">
                                                <span className="text-slate-400 mb-1">PROFIT %</span>
                                                {((p.profit / p.revenue) * 100).toFixed(0)}%
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                            </div>

                                            <div className="flex-1 w-full flex flex-col justify-end">
                                                <div
                                                    className="w-full bg-slate-100 group-hover:bg-indigo-50 transition-all rounded-[0.5rem] relative overflow-hidden"
                                                    style={{ height: `${height}%` }}
                                                >
                                                    <div
                                                        className="absolute bottom-0 left-0 w-full bg-indigo-600 shadow-lg shadow-indigo-600/20 rounded-t-[0.5rem] transition-all group-hover:scale-y-105"
                                                        style={{ height: `${Math.max(0, profitHeight)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-slate-900 transition-colors">{p.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Detailed Data Matrix */}
                        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/40">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-black text-slate-900 tracking-tight text-lg">Detailed P&L Matrix</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleDownloadCSV}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                                    >
                                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                                        Download (Excel)
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto border-t border-slate-100">
                                <table className="w-full text-left border-collapse">
                                    <thead className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-slate-800">
                                        <tr>
                                            <th className="px-6 py-4 border-r border-slate-700/50">Fiscal Month</th>
                                            <th className="px-6 py-4 text-right border-r border-slate-700/50">Proj. Revenue</th>
                                            <th className="px-6 py-4 text-right border-r border-slate-700/50">OpEx & Cost</th>
                                            <th className="px-6 py-4 text-right border-r border-slate-700/50">Proj. Profit</th>
                                            <th className="px-6 py-4 text-right">Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {projections.map((p, idx) => (
                                            <tr key={idx} className={cn(
                                                "group hover:bg-indigo-50/30 transition-all border-b border-slate-100",
                                                idx % 2 === 0 ? "bg-white/40" : "bg-slate-50/30"
                                            )}>
                                                <td className="px-6 py-3 font-black text-slate-500 border-r border-slate-100 uppercase">{p.month}</td>
                                                <td className="px-6 py-3 text-right font-black text-slate-900 border-r border-slate-100 tabular-nums">₦{p.revenue.toLocaleString()}</td>
                                                <td className="px-6 py-3 text-right font-bold text-slate-400 border-r border-slate-100 tabular-nums">₦{p.expenses.toLocaleString()}</td>
                                                <td className={cn(
                                                    "px-6 py-3 text-right font-black tabular-nums border-r border-slate-100",
                                                    p.profit >= 0 ? "text-emerald-600 bg-emerald-50/20" : "text-red-500 bg-red-50/20"
                                                )}>
                                                    <div className="flex items-center justify-end gap-2">
                                                        {p.profit >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                        ₦{p.profit.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[9px] font-black tracking-widest shadow-none",
                                                        p.profit >= 0 ? "text-emerald-600" : "text-red-500"
                                                    )}>
                                                        {((p.profit / p.revenue) * 100).toFixed(1)}% MARG.
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
