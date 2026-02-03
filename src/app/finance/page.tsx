"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    DollarSign, TrendingUp, Clock, CheckCircle2,
    XCircle, FileText, Plus, ArrowRight,
    Wallet, Receipt, BarChart3, ArrowUpRight, ArrowDownRight,
    BookOpen, Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleRecord {
    id: number | string;
    number: string;
    entity: string;
    amount: number;
    status: string;
    date: string;
}

export default function FinanceHub() {
    const router = useRouter();
    const [recentExpenses, setRecentExpenses] = useState<SimpleRecord[]>([]);
    const [recentInvoices, setRecentInvoices] = useState<SimpleRecord[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Expenses
                const expRes = await fetch("/api/finance");
                const expData = await expRes.json();
                if (expData.success) {
                    setRecentExpenses(expData.data.slice(0, 5).map((e: any) => ({
                        id: e.id,
                        number: e.requestNumber,
                        entity: e.staffName,
                        amount: e.amount,
                        status: e.status,
                        date: e.createdAt
                    })));
                }

                // Fetch Invoices
                const invRes = await fetch("/api/finance/invoices");
                const invData = await invRes.json();
                if (invData.success) {
                    setRecentInvoices(invData.data.slice(0, 5).map((i: any) => ({
                        id: i.id,
                        number: i.invoiceNumber,
                        entity: i.clientName,
                        amount: i.totalAmount,
                        status: i.status,
                        date: i.date
                    })));
                }

                // Fetch Accounts
                const accRes = await fetch("/api/finance/accounts");
                const accData = await accRes.json();
                if (accData.success) {
                    setAccounts(accData.data);
                }
            } catch (error) {
                console.error("Error fetching hub data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = {
        receivables: recentInvoices.reduce((sum, i) => sum + i.amount, 0),
        payables: recentExpenses.reduce((sum, e) => sum + e.amount, 0),
        pendingExpenses: recentExpenses.filter(e => e.status.includes("Pending")).length,
        pendingInvoices: recentInvoices.filter(i => i.status !== "PAID").length
    };

    if (loading) {
        return (
            <div className="p-8 animate-pulse space-y-8">
                <div className="h-20 bg-slate-100 rounded-xl w-full"></div>
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>)}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-80 bg-slate-100 rounded-xl"></div>
                    <div className="h-80 bg-slate-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finance Hub</h1>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Enterprise Financial Overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/finance/statements" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-xs shadow-sm transition-all">
                        <BarChart3 className="w-4 h-4" /> Reports
                    </Link>
                    <Link href="/finance/invoices/create" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold text-xs shadow-lg shadow-slate-900/20 transition-all">
                        <Plus className="w-4 h-4" /> Create Invoice
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <HubCard
                    title="Total Receivables"
                    value={`₦${(stats.receivables / 1000).toFixed(1)}k`}
                    sub="Pending Invoices"
                    icon={<ArrowUpRight className="w-5 h-5" />}
                    color="teal"
                />
                <HubCard
                    title="Total Payables"
                    value={`₦${(stats.payables / 1000).toFixed(1)}k`}
                    sub="Awaiting Disbursement"
                    icon={<ArrowDownRight className="w-5 h-5" />}
                    color="orange"
                />
                <HubCard
                    title="Invoice Activity"
                    value={stats.pendingInvoices.toString()}
                    sub="Items requiring action"
                    icon={<FileText className="w-5 h-5" />}
                    color="blue"
                />
                <HubCard
                    title="Account Matrix"
                    value={accounts.length.toString()}
                    sub="Total COA ledger items"
                    icon={<BookOpen className="w-5 h-5" />}
                    color="slate"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Recent Expenses Snapshot */}
                <div className="card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-slate-800 tracking-tight text-lg">Recent Expenses</h3>
                        </div>
                        <Link href="/finance/expenses" className="text-[10px] font-black uppercase text-orange-600 hover:text-orange-700 flex items-center gap-1 group">
                            View All <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="p-4">
                        <div className="overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-4 py-3 text-center">S/N</th>
                                        <th className="px-4 py-3">Requester</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentExpenses.map((exp, index) => (
                                        <tr key={exp.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => router.push(`/finance/${exp.id}`)}>
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-[10px] font-black text-slate-300 tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-bold text-slate-700 text-sm leading-none">{exp.entity}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1.5">{exp.number}</p>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="font-black text-slate-900 border-b-2 border-slate-100 pb-0.5">₦{exp.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter shadow-sm",
                                                    exp.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                                                )}>
                                                    {exp.status.split(' ')[0]}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Invoices Snapshot */}
                <div className="card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-slate-800 tracking-tight text-lg">Recent Invoices</h3>
                        </div>
                        <Link href="/finance/invoices" className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                            Manage All <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="p-4">
                        <div className="overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-4 py-3 text-center">S/N</th>
                                        <th className="px-4 py-3">Client</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentInvoices.map((inv, index) => (
                                        <tr key={inv.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-[10px] font-black text-slate-300 tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-bold text-slate-700 text-sm leading-none">{inv.entity}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1.5">{inv.number}</p>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="font-black text-slate-900 border-b-2 border-slate-100 pb-0.5">₦{inv.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter shadow-sm",
                                                    inv.status === "PAID" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                                                )}>
                                                    {inv.status}
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

            {/* Navigation Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4">
                <NavTile
                    title="Expenses"
                    desc="Manage staff disbursement & claims"
                    href="/finance/expenses"
                    icon={<Receipt className="w-6 h-6" />}
                    color="orange"
                />
                <NavTile
                    title="Invoices"
                    desc="Client billing & payment tracking"
                    href="/finance/invoices"
                    icon={<Wallet className="w-6 h-6" />}
                    color="blue"
                />
                <NavTile
                    title="Chart of Accounts"
                    desc="Manage financial ledger & codes"
                    href="/finance/accounts"
                    icon={<BookOpen className="w-6 h-6" />}
                    color="orange"
                />
                <NavTile
                    title="Manual Journal"
                    desc="Double-entry recording & adjustments"
                    href="/finance/journals/create"
                    icon={<FileText className="w-6 h-6" />}
                    color="teal"
                />
                <NavTile
                    title="Fiscal Reports"
                    desc="P&L, Balance Sheet, Cash Flow"
                    href="/finance/statements"
                    icon={<BarChart3 className="w-6 h-6" />}
                    color="slate"
                />
                <NavTile
                    title="Forecasting"
                    desc="12-month projections & modeling"
                    href="/finance/forecast"
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="teal"
                />
            </div>
        </div>
    );
}

function HubCard({ title, value, sub, icon, color }: any) {
    const colors: any = {
        orange: "bg-orange-50 text-orange-600 ring-orange-100",
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        teal: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        yellow: "bg-amber-50 text-amber-600 ring-amber-100"
    };

    return (
        <div className="card hover:translate-y-[-4px] transition-all duration-300 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-xl p-6 relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className={cn("p-2 rounded-lg ring-1", colors[color])}>
                    {icon}
                </div>
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{title}</p>
                <div className="mt-4 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{sub}</span>
                </div>
            </div>
        </div>
    );
}

function NavTile({ title, desc, href, icon, color }: any) {
    const colors: any = {
        orange: "hover:bg-orange-50 text-orange-600",
        blue: "hover:bg-blue-50 text-blue-600",
        teal: "hover:bg-emerald-50 text-emerald-600",
        slate: "hover:bg-slate-50 text-slate-900"
    };

    return (
        <Link href={href} className={cn(
            "p-8 rounded-xl bg-white border border-slate-100 flex flex-col items-center text-center gap-4 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200/20 group",
            colors[color]
        )}>
            <div className="w-14 h-14 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-current transition-all shadow-sm group-hover:shadow-md">
                {icon}
            </div>
            <div>
                <h3 className="font-black text-slate-900 tracking-tight text-lg">{title}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">{desc}</p>
            </div>
            <div className="mt-2 text-slate-300 group-hover:text-current transition-colors">
                <ArrowRight className="w-5 h-5" />
            </div>
        </Link>
    );
}
