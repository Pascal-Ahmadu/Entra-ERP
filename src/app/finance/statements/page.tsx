"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileOutput, Download, Printer, TrendingUp, TrendingDown, DollarSign, PieChart, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinancialStatementsPage() {
    const [activeTab, setActiveTab] = useState<"balance-sheet" | "cash-flow" | "profit-loss">("profit-loss");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatements();
    }, []);

    const fetchStatements = async () => {
        try {
            const response = await fetch("/api/finance/statements");
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error("Error loading statements:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading Financial Reports...</p>
                </div>
            </div>
        );
    }

    const { balanceSheet, cashFlow, incomeStatement } = data;

    // --- P&L CALCULATIONS ---
    const grossProfit = incomeStatement ? incomeStatement.revenue.total - incomeStatement.cogs.total : 0;
    const ebitda = incomeStatement ? grossProfit - incomeStatement.operatingExpenses.total : 0;
    const ebit = incomeStatement ? ebitda - incomeStatement.depreciationAmortization.total : 0;
    const pbt = incomeStatement ? ebit - incomeStatement.financeCosts.net : 0;
    const pat = incomeStatement ? pbt - incomeStatement.taxation.total : 0;

    // Metrics
    const grossMargin = incomeStatement && incomeStatement.revenue.total > 0 ? (grossProfit / incomeStatement.revenue.total) * 100 : 0;
    const ebitdaMargin = incomeStatement && incomeStatement.revenue.total > 0 ? (ebitda / incomeStatement.revenue.total) * 100 : 0;
    const netMargin = incomeStatement && incomeStatement.revenue.total > 0 ? (pat / incomeStatement.revenue.total) * 100 : 0;


    // --- BS CALCULATIONS ---
    const totalNonCurrentAssets = balanceSheet.assets.nonCurrent.reduce((a: any, b: any) => a + b.value, 0);
    const totalCurrentAssets = balanceSheet.assets.current.reduce((a: any, b: any) => a + b.value, 0);
    const totalAssets = totalNonCurrentAssets + totalCurrentAssets;

    const totalNonCurrentLiabilities = balanceSheet.liabilities.nonCurrent.reduce((a: any, b: any) => a + b.value, 0);
    const totalCurrentLiabilities = balanceSheet.liabilities.current.reduce((a: any, b: any) => a + b.value, 0);
    const totalLiabilities = totalNonCurrentLiabilities + totalCurrentLiabilities;

    const totalEquity = balanceSheet.equity.reduce((a: any, b: any) => a + b.value, 0);


    // --- CASH FLOW CALCULATIONS ---
    const operatingProfitBeforeWC = cashFlow.operating.start.value + cashFlow.operating.adjustments.reduce((a: any, b: any) => a + b.value, 0);
    const cashFromOperations = operatingProfitBeforeWC + cashFlow.operating.workingCapital.reduce((a: any, b: any) => a + b.value, 0) + cashFlow.operating.taxPaid.value;
    const cashFromInvesting = cashFlow.investing.reduce((a: any, b: any) => a + b.value, 0);
    const cashFromFinancing = cashFlow.financing.reduce((a: any, b: any) => a + b.value, 0);
    const netCashMovement = cashFromOperations + cashFromInvesting + cashFromFinancing;
    const cashAtEnd = cashFlow.reconciliation.begin + netCashMovement + cashFlow.reconciliation.fxEffect;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-slate-800">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/finance" className="hover:text-orange-600 hover:underline transition-colors flex items-center gap-1">
                        Finance
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-orange-600 font-bold">Financial Statements</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Reports</h1>
                        <p className="text-sm text-gray-500 mt-1">Consolidated financial position and cash flow analysis</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-bold shadow-sm transition-all">
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-bold shadow-md shadow-orange-600/20 transition-all">
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Tab Navigation */}
                <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200 shadow-sm w-fit mb-6 overflow-x-auto">
                    <TabButton active={activeTab === "profit-loss"} onClick={() => setActiveTab("profit-loss")} icon={FileText} label="Profit & Loss" />
                    <TabButton active={activeTab === "balance-sheet"} onClick={() => setActiveTab("balance-sheet")} icon={PieChart} label="Balance Sheet" />
                    <TabButton active={activeTab === "cash-flow"} onClick={() => setActiveTab("cash-flow")} icon={TrendingUp} label="Cash Flow" />
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">

                    {/* PROFIT & LOSS VIEW */}
                    {activeTab === "profit-loss" && incomeStatement && (
                        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
                            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 uppercase">Profit & Loss Statement</h2>
                                    <p className="text-xs text-gray-500 mt-1">
                                        <span className="font-semibold text-gray-700">Company Name:</span> Entra ERP &bull;
                                        <span className="font-semibold text-gray-700 ml-1">Period Ended:</span> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &bull;
                                        <span className="font-semibold text-gray-700 ml-1">Currency:</span> ₦
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* 1. Revenue */}
                                <PLSection title="1. Revenue (Income)" items={incomeStatement.revenue.items} total={incomeStatement.revenue.total} totalLabel="Total Revenue" />

                                {/* 2. COGS */}
                                <PLSection title="2. Cost of Sales (COGS)" items={incomeStatement.cogs.items} total={incomeStatement.cogs.total} totalLabel="Total Cost of Sales" negative />

                                {/* 3. Gross Profit */}
                                <SummaryRow label="3. Gross Profit" subLabel="(Revenue – Cost of Sales)" value={grossProfit} />

                                {/* 4. Operating Expenses */}
                                <PLSection title="4. Operating Expenses" items={incomeStatement.operatingExpenses.items} total={incomeStatement.operatingExpenses.total} totalLabel="Total Operating Expenses (Excl. D&A)" negative />

                                {/* 5. EBITDA */}
                                <div>
                                    <SummaryRow label="5. EBITDA" subLabel="(Earnings Before Interest, Tax, Depreciation & Amortisation)" value={ebitda} highlight />
                                    <p className="text-[10px] text-gray-400 mt-2 italic border-l-2 border-orange-200 pl-3">
                                        EBITDA = Gross Profit – Operating Expenses (excluding Depreciation & Amortisation)
                                    </p>
                                </div>

                                {/* 6. D&A */}
                                <PLSection title="6. Depreciation & Amortisation" items={incomeStatement.depreciationAmortization.items} total={incomeStatement.depreciationAmortization.total} totalLabel="Total D&A" negative />

                                {/* 7. Operating Profit (EBIT) */}
                                <SummaryRow label="7. Operating Profit (EBIT)" value={ebit} />

                                {/* 8. Finance Costs */}
                                <PLSection title="8. Finance Income / (Costs)" items={incomeStatement.financeCosts.items} total={incomeStatement.financeCosts.net} totalLabel="Net Finance Cost" negative />

                                {/* 9. PBT */}
                                <SummaryRow label="9. Profit Before Tax (PBT)" value={pbt} />

                                {/* 10. Taxation */}
                                <PLSection title="10. Taxation" items={incomeStatement.taxation.items} total={incomeStatement.taxation.total} totalLabel="Total Tax" negative />

                                {/* 11. PAT */}
                                <SummaryRow label="11. Profit After Tax (PAT)" subLabel="Net Profit for the Period" value={pat} highlight doubleUnderline />

                                {/* Metrics */}
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-6">Key Performance Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <MetricCard label="Gross Margin" value={`${grossMargin.toFixed(1)}%`} sub="Revenue - COGS" />
                                        <MetricCard label="EBITDA Margin" value={`${ebitdaMargin.toFixed(1)}%`} sub="Operational Efficiency" active />
                                        <MetricCard label="Net Profit Margin" value={`${netMargin.toFixed(1)}%`} sub="Final Profitability" />
                                    </div>
                                </div>

                                {/* Compact Snapshot */}
                                <div className="mt-12">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Very Compact (Bank Snapshot)</h3>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Item</th>
                                                    <th className="px-4 py-2 text-right font-semibold text-gray-600">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <SnapshotRow label="Revenue" value={incomeStatement.revenue.total} />
                                                <SnapshotRow label="Gross Profit" value={grossProfit} />
                                                <SnapshotRow label="EBITDA" value={ebitda} bold bg />
                                                <SnapshotRow label="EBIT" value={ebit} />
                                                <SnapshotRow label="PBT" value={pbt} />
                                                <SnapshotRow label="PAT" value={pat} bold />
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* BALANCE SHEET VIEW */}
                    {activeTab === "balance-sheet" && (
                        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* ... Existing BS Content ... */}
                            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Statement of Financial Position</h2>
                                    <p className="text-xs text-gray-500 mt-1">As at {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Assets</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAssets - totalLiabilities)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* ASSETS COLUMN */}
                                <div className="space-y-8">
                                    <Section title="Non-Current Assets" total={totalNonCurrentAssets} items={balanceSheet.assets.nonCurrent} />
                                    <Section title="Current Assets" total={totalCurrentAssets} items={balanceSheet.assets.current} />
                                    <TotalRow label="Total Assets" value={totalAssets} doubleUnderline />
                                </div>
                                {/* LIABILITIES & EQUITY COLUMN */}
                                <div className="space-y-8">
                                    <Section title="Equity" total={totalEquity} items={balanceSheet.equity} />
                                    <Section title="Non-Current Liabilities (NCL)" total={totalNonCurrentLiabilities} items={balanceSheet.liabilities.nonCurrent} />
                                    <Section title="Current Liabilities" total={totalCurrentLiabilities} items={balanceSheet.liabilities.current} />
                                    <TotalRow label="Total Equity & Liabilities" value={totalEquity + totalLiabilities} doubleUnderline />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CASH FLOW VIEW */}
                    {activeTab === "cash-flow" && (
                        <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
                            {/* ... Existing CF Content ... */}
                            {/* I will copy paste the specific content or use a simplified placeholder if logic is complex to reconstruct blindly */
                                /* Actually I have the full content in the view_file above. I must preserve it. */
                            }
                            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Statement of Cash Flows</h2>
                                    <p className="text-xs text-gray-500 mt-1">For the period ended {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Closing Cash Position</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(cashAtEnd)}</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-orange-600 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2"><div className="w-8 h-px bg-orange-200"></div>Operating Activities</h3>
                                    <div className="space-y-3">
                                        <Row label="Profit/(Loss) Before Tax" value={cashFlow.operating.start.value} bold />
                                        <p className="text-xs font-semibold text-gray-400 mt-2 mb-1 px-4">Adjustments for:</p>
                                        {cashFlow.operating.adjustments.map((item: any, i: number) => <Row key={i} label={item.label} value={item.value} indent />)}
                                        <Row label="Operating Profit Before Working Capital Changes" value={operatingProfitBeforeWC} subTotal className="mt-2" />
                                        <p className="text-xs font-semibold text-gray-400 mt-2 mb-1 px-4">Changes in Working Capital:</p>
                                        {cashFlow.operating.workingCapital.map((item: any, i: number) => <Row key={i} label={item.label} value={item.value} indent />)}
                                        <Row label={cashFlow.operating.taxPaid.label} value={cashFlow.operating.taxPaid.value} indent />
                                    </div>
                                    <TotalRow label="Net Cash from Operating Activities" value={cashFromOperations} className="mt-4 bg-orange-50/50 p-3 rounded-lg" />
                                </div>
                                <div>
                                    <h3 className="text-blue-600 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2"><div className="w-8 h-px bg-blue-200"></div>Investing Activities</h3>
                                    <div className="space-y-3">
                                        {cashFlow.investing.map((item: any, i: number) => <Row key={i} label={item.label} value={item.value} />)}
                                    </div>
                                    <TotalRow label="Net Cash from Investing Activities" value={cashFromInvesting} className="mt-4 bg-blue-50/50 p-3 rounded-lg" />
                                </div>
                                <div>
                                    <h3 className="text-purple-600 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2"><div className="w-8 h-px bg-purple-200"></div>Financing Activities</h3>
                                    <div className="space-y-3">
                                        {cashFlow.financing.map((item: any, i: number) => <Row key={i} label={item.label} value={item.value} />)}
                                    </div>
                                    <TotalRow label="Net Cash from Financing Activities" value={cashFromFinancing} className="mt-4 bg-purple-50/50 p-3 rounded-lg" />
                                </div>
                                <div className="pt-6 border-t-2 border-gray-100">
                                    <Row label="Net Increase/(Decrease) in Cash" value={netCashMovement} bold textClass="text-lg" />
                                    <Row label="Cash & Cash Equivalents at Beginning of Year" value={cashFlow.reconciliation.begin} />
                                    <Row label="Effect of Foreign Exchange Rate Changes" value={cashFlow.reconciliation.fxEffect} />
                                    <div className="mt-6 p-4 bg-gray-900 text-white rounded-xl flex justify-between items-center shadow-lg">
                                        <span className="font-bold">Cash & Cash Equivalents at End of Year</span>
                                        <span className="text-xl font-bold font-mono">{formatCurrency(cashAtEnd)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap",
                active ? "bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-200" : "text-gray-600 hover:bg-gray-50"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}

function PLSection({ title, items, total, totalLabel, negative }: any) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
    const displayTotal = negative ? `(${formatCurrency(total)})` : formatCurrency(total);

    return (
        <div>
            <h3 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3 bg-gray-50/50 px-2 pt-1">{title}</h3>
            <ul className="space-y-2 px-2">
                {items.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between text-sm text-gray-600">
                        <span>&bull; {item.label}</span>
                        <span className="font-mono text-gray-800">{formatCurrency(Math.abs(item.value))}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-300 px-2 font-medium">
                <span className="text-gray-900 italic">{totalLabel}</span>
                <span className="font-mono text-gray-900 border-b border-gray-400 pb-0.5">{displayTotal}</span>
            </div>
        </div>
    );
}

function SummaryRow({ label, subLabel, value, highlight, doubleUnderline }: any) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

    return (
        <div className={cn(
            "flex justify-between items-center p-3 rounded-lg mt-4",
            highlight ? "bg-orange-50 border border-orange-100" : "bg-gray-50 border border-transparent"
        )}>
            <div>
                <span className="font-bold text-gray-900 block">{label}</span>
                {subLabel && <span className="text-xs text-gray-500 font-medium">{subLabel}</span>}
            </div>
            <span className={cn(
                "font-bold font-mono text-lg",
                highlight ? "text-orange-700" : "text-gray-900",
                doubleUnderline ? "border-b-4 border-double border-current pb-0.5" : ""
            )}>
                {formatCurrency(value)}
            </span>
        </div>
    );
}

function MetricCard({ label, value, sub, active }: any) {
    return (
        <div className={cn(
            "p-4 rounded-xl border flex flex-col items-center text-center gap-1",
            active ? "bg-orange-600 border-orange-600 text-white shadow-md transform scale-105 transition-transform" : "bg-white border-gray-200 text-gray-900"
        )}>
            <span className={cn("text-xs font-bold uppercase tracking-wider opacity-80", active ? "text-orange-100" : "text-gray-400")}>{label}</span>
            <span className="text-2xl font-bold">{value}</span>
            <span className={cn("text-[10px]", active ? "text-orange-100" : "text-gray-400")}>{sub}</span>
        </div>
    );
}

function SnapshotRow({ label, value, bold, bg }: any) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
    return (
        <tr className={cn(bg ? "bg-orange-50/50" : "")}>
            <td className={cn("px-4 py-3 text-left", bold ? "font-bold text-gray-900" : "text-gray-700")}>{label}</td>
            <td className={cn("px-4 py-3 text-right font-mono", bold ? "font-bold text-gray-900" : "text-gray-700")}>{formatCurrency(value)}</td>
        </tr>
    );
}

// ... existing components (Section, TotalRow, Row) ...
function Section({ title, total, items }: { title: string, total: number, items: { label: string, value: number }[] }) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">{title}</h3>
                <div className="flex-1 h-px bg-gray-100"></div>
            </div>
            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm group">
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{item.label}</span>
                        <span className="font-medium text-gray-900 font-mono">{formatCurrency(item.value)}</span>
                    </div>
                ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center font-bold">
                <span className="text-sm text-gray-800">Total {title.split('(')[0]}</span>
                <span className="text-gray-900 font-mono">{formatCurrency(total)}</span>
            </div>
        </div>
    );
}

function TotalRow({ label, value, doubleUnderline, className }: any) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

    return (
        <div className={cn("flex justify-between items-center", className)}>
            <span className="font-bold text-gray-900">{label}</span>
            <div className="text-right">
                <span className={cn(
                    "font-bold text-gray-900 font-mono block",
                    doubleUnderline ? "border-b-4 border-double border-gray-900 pb-1" : ""
                )}>
                    {formatCurrency(value)}
                </span>
            </div>
        </div>
    );
}

function Row({ label, value, bold, indent, subTotal, textClass, className }: any) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

    return (
        <div className={cn(
            "flex justify-between items-center text-sm py-1",
            indent ? "pl-6 text-gray-500" : "text-gray-700",
            subTotal ? "border-t border-gray-300 font-semibold pt-2" : "",
            className
        )}>
            <span className={cn(bold ? "font-bold text-gray-900" : "", textClass)}>{label}</span>
            <span className={cn(
                "font-mono",
                bold ? "font-bold text-gray-900" : "",
                value < 0 ? "text-red-600" : "text-gray-900"
            )}>
                {value < 0 ? `(${formatCurrency(Math.abs(value))})` : formatCurrency(value)}
            </span>
        </div>
    );
}
