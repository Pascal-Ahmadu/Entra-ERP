"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Calendar, DollarSign, Users, FileText, Play, CheckCircle2,
    TrendingUp, Building2, Wallet, Clock, ChevronDown, ChevronUp, Download,
    AlertCircle, CheckCircle, Info, X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PayrollLine {
    id: number;
    employeeId: number;
    employeeName: string;
    basicSalary: number;
    allowances: number;
    grossPay: number;
    cra: number;
    taxableIncome: number;
    paye: number;
    pension: number;
    nhf: number;
    netPay: number;
    bonus: number;
    cashBenefits: number;
}

interface PayrollRun {
    id: number;
    month: number;
    year: number;
    status: string;
    totalGross: number;
    totalPaye: number;
    totalPension: number;
    totalNhf: number;
    totalNet: number;
    employeeCount: number;
    processedAt: string | null;
    lines: PayrollLine[];
    createdAt: string;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function PayrollPage() {
    const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [expandedRun, setExpandedRun] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    // New Config State
    const [include13thMonth, setInclude13thMonth] = useState(false);
    const [airtimePercentage, setAirtimePercentage] = useState<number | string>(0);

    // Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: "confirm" | "alert";
        variant: "info" | "success" | "warning" | "danger";
        onConfirm?: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: "alert",
        variant: "info"
    });

    const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
    const showModal = (config: Omit<typeof modal, "isOpen">) => setModal({ ...config, isOpen: true });

    useEffect(() => {
        fetchPayrollRuns();
    }, []);

    const fetchPayrollRuns = async () => {
        try {
            const res = await fetch("/api/hr/payroll");
            const data = await res.json();
            if (data.success) {
                setPayrollRuns(data.data);
            }
        } catch (error) {
            console.error("Error fetching payroll:", error);
        } finally {
            setLoading(false);
        }
    };

    const runPayroll = async () => {
        setCreating(true);
        try {
            const res = await fetch("/api/hr/payroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    month: selectedMonth,
                    year: selectedYear,
                    include13thMonth,
                    airtimeDataPercentage: airtimePercentage
                })
            });
            const data = await res.json();
            if (data.success) {
                await fetchPayrollRuns();
                showModal({
                    title: "Success",
                    message: `Payroll for ${MONTHS[selectedMonth - 1]} ${selectedYear} created successfully!`,
                    type: "alert",
                    variant: "success"
                });
            } else {
                showModal({
                    title: "Error",
                    message: data.error || "Failed to run payroll",
                    type: "alert",
                    variant: "danger"
                });
            }
        } catch (error) {
            console.error("Error running payroll:", error);
            showModal({
                title: "Error",
                message: "Failed to run payroll",
                type: "alert",
                variant: "danger"
            });
        } finally {
            setCreating(false);
        }
    };

    const processPayroll = async (id: number) => {
        showModal({
            title: "Process Payroll",
            message: "This will lock the payroll and create accounting entries in the Finance module. Continue?",
            type: "confirm",
            variant: "warning",
            onConfirm: async () => {
                try {
                    const res = await fetch("/api/hr/payroll", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id })
                    });
                    const data = await res.json();
                    if (data.success) {
                        await fetchPayrollRuns();
                        showModal({
                            title: "Processed",
                            message: "Payroll processed successfully! Accounting entries have been created.",
                            type: "alert",
                            variant: "success"
                        });
                    } else {
                        showModal({
                            title: "Error",
                            message: data.error || "Failed to process payroll",
                            type: "alert",
                            variant: "danger"
                        });
                    }
                } catch (error) {
                    console.error("Error processing payroll:", error);
                    showModal({
                        title: "Error",
                        message: "Failed to process payroll",
                        type: "alert",
                        variant: "danger"
                    });
                }
            }
        });
    };

    const downloadCSV = (id: number) => {
        window.open(`/api/hr/payroll/disburse?runId=${id}`, '_blank');
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(val);
    };

    // Calculate current month stats
    const currentRun = payrollRuns[0];
    const stats = {
        totalGross: currentRun?.totalGross || 0,
        totalPaye: currentRun?.totalPaye || 0,
        totalPension: currentRun?.totalPension || 0,
        totalNhf: currentRun?.totalNhf || 0,
        totalNet: currentRun?.totalNet || 0,
        employeeCount: currentRun?.employeeCount || 0
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading Payroll Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/20 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Link href="/hr" className="hover:text-orange-600 transition-colors">Human Resources</Link>
                            <span className="text-gray-300">/</span>
                            <span className="text-orange-600 font-bold">Payroll & PAYE</span>
                        </nav>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payroll Management</h1>
                            <p className="text-sm text-slate-500">Nigerian PAYE compliant salary processing</p>
                        </div>
                    </div>

                    {/* Run Payroll Button - Wrapped in larger container */}
                    <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-slate-200 p-3 shadow-sm w-fit">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-100"
                        >
                            {MONTHS.map((m, i) => (
                                <option key={i} value={i + 1}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-100"
                        >
                            {[2024, 2025, 2026, 2027].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                        {/* New Configuration Inputs */}
                        <div className="flex items-center gap-3 px-2 border-r border-slate-200 pr-4 mr-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={include13thMonth}
                                    onChange={(e) => setInclude13thMonth(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-200"
                                />
                                <span className="text-xs font-bold text-slate-600 group-hover:text-orange-600 transition-colors">13th Month</span>
                            </label>
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                                <span className="text-xs font-semibold text-slate-400">Airtime:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={airtimePercentage}
                                    onChange={(e) => setAirtimePercentage(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="w-16 bg-transparent text-sm font-bold text-slate-700 outline-none text-right"
                                />
                                <span className="text-xs font-bold text-slate-400">%</span>
                            </div>
                        </div>
                        <button
                            onClick={runPayroll}
                            disabled={creating}
                            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold text-sm shadow-md shadow-orange-600/20 transition-all disabled:opacity-50 whitespace-nowrap"
                        >
                            <Play className="w-4 h-4" />
                            {creating ? "Processing..." : "Run Payroll"}
                        </button>
                    </div>
                </div>

                {/* Stats Cards - Switch to 3 columns to prevent overlap/text squishing */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        label="Gross Payroll"
                        value={formatCurrency(stats.totalGross)}
                        icon={<DollarSign className="w-5 h-5" />}
                        color="emerald"
                    />
                    <StatCard
                        label="PAYE Tax"
                        value={formatCurrency(stats.totalPaye)}
                        icon={<Building2 className="w-5 h-5" />}
                        color="orange"
                    />
                    <StatCard
                        label="Net Payroll"
                        value={formatCurrency(stats.totalNet)}
                        icon={<TrendingUp className="w-5 h-5" />}
                        color="teal"
                    />
                    <StatCard
                        label="Pension (8%)"
                        value={formatCurrency(stats.totalPension)}
                        icon={<Wallet className="w-5 h-5" />}
                        color="blue"
                    />
                    <StatCard
                        label="NHF (2.5%)"
                        value={formatCurrency(stats.totalNhf)}
                        icon={<Building2 className="w-5 h-5" />}
                        color="purple"
                    />
                    <StatCard
                        label="Employees Processed"
                        value={stats.employeeCount.toString()}
                        icon={<Users className="w-5 h-5" />}
                        color="slate"
                    />
                </div>

                {/* Payroll History */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Payroll History</h3>
                                <p className="text-xs text-slate-400">{payrollRuns.length} payroll runs</p>
                            </div>
                        </div>
                    </div>

                    {payrollRuns.length === 0 ? (
                        <div className="p-12 text-center">
                            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No payroll runs yet</p>
                            <p className="text-sm text-slate-400 mt-1">Select a month and click "Run Payroll" to get started</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {payrollRuns.map((run) => (
                                <div key={run.id}>
                                    <div
                                        onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                                        className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black text-lg">
                                                {run.month.toString().padStart(2, '0')}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{MONTHS[run.month - 1]} {run.year}</p>
                                                <p className="text-xs text-slate-400 font-medium">{run.employeeCount} employees • {run.status}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 font-bold">Net Disbursement</p>
                                                <p className="font-black text-slate-800 text-lg">{formatCurrency(run.totalNet)}</p>
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold",
                                                run.status === "PROCESSED" ? "bg-emerald-100 text-emerald-600" :
                                                    run.status === "APPROVED" ? "bg-blue-100 text-blue-600" :
                                                        "bg-amber-100 text-amber-600"
                                            )}>
                                                {run.status}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 pr-4" onClick={(e) => e.stopPropagation()}>
                                                {run.status === "DRAFT" && (
                                                    <button
                                                        onClick={() => processPayroll(run.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 w-25 align-text-center justify-center transition-colors shadow-sm font-bold text-[5px] whitespace-nowrap"
                                                    >

                                                        Process
                                                    </button>
                                                )}
                                                {run.status === "PROCESSED" && (
                                                    <button
                                                        onClick={() => downloadCSV(run.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-bold text-[10px] whitespace-nowrap"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        DOWNLOAD
                                                    </button>
                                                )}
                                            </div>

                                            {expandedRun === run.id ? (
                                                <ChevronUp className="w-5 h-5 text-slate-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedRun === run.id && (
                                        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                                            <div className="bg-slate-50 rounded-xl overflow-x-auto border border-slate-200">
                                                <table className="w-full text-sm min-w-[1000px]">
                                                    <thead>
                                                        <tr className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                                                            <th className="px-3 py-3 text-left">Employee</th>
                                                            <th className="px-3 py-3 text-right">Basic</th>
                                                            <th className="px-3 py-3 text-right">Bonus/Benefits</th>
                                                            <th className="px-3 py-3 text-right">Gross</th>
                                                            <th className="px-3 py-3 text-right">PAYE</th>
                                                            <th className="px-3 py-3 text-right">Pension</th>
                                                            <th className="px-3 py-3 text-right">NHF</th>
                                                            <th className="px-3 py-3 text-right font-black">Net Pay</th>
                                                            <th className="px-3 py-3 text-center">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200">
                                                        {run.lines.map((line) => (
                                                            <tr key={line.id} className="hover:bg-white transition-colors">
                                                                <td className="px-3 py-3 font-medium text-slate-800">{line.employeeName}</td>
                                                                <td className="px-3 py-3 text-right font-mono text-slate-600">{formatCurrency(line.basicSalary)}</td>
                                                                <td className="px-3 py-3 text-right font-mono text-[10px]">
                                                                    {(line.bonus || line.cashBenefits) ? (
                                                                        <div className="flex flex-col">
                                                                            {line.bonus > 0 && <span className="text-emerald-600">+{formatCurrency(line.bonus)}</span>}
                                                                            {line.cashBenefits > 0 && <span className="text-blue-600">+{formatCurrency(line.cashBenefits)}</span>}
                                                                        </div>
                                                                    ) : "-"}
                                                                </td>
                                                                <td className="px-3 py-3 text-right font-mono text-slate-800 font-bold">{formatCurrency(line.grossPay)}</td>
                                                                <td className="px-3 py-3 text-right font-mono text-orange-600">{formatCurrency(line.paye)}</td>
                                                                <td className="px-3 py-3 text-right font-mono text-blue-600">{formatCurrency(line.pension)}</td>
                                                                <td className="px-3 py-3 text-right font-mono text-purple-600">{formatCurrency(line.nhf)}</td>
                                                                <td className="px-3 py-3 text-right font-mono text-emerald-600 font-bold">{formatCurrency(line.netPay)}</td>
                                                                <td className="px-3 py-3 text-center">
                                                                    <Link
                                                                        href={`/hr/payroll/payslip/${line.id}`}
                                                                        className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                                                                    >
                                                                        View Payslip
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="bg-slate-800 text-white font-bold">
                                                            <td className="px-3 py-3">TOTALS</td>
                                                            <td className="px-3 py-3 text-right font-mono">-</td>
                                                            <td className="px-3 py-3 text-right font-mono">-</td>
                                                            <td className="px-3 py-3 text-right font-mono font-black italic">{formatCurrency(run.totalGross)}</td>
                                                            <td className="px-3 py-3 text-right font-mono text-orange-300">{formatCurrency(run.totalPaye)}</td>
                                                            <td className="px-3 py-3 text-right font-mono text-blue-300">{formatCurrency(run.totalPension)}</td>
                                                            <td className="px-3 py-3 text-right font-mono text-purple-300">{formatCurrency(run.totalNhf)}</td>
                                                            <td className="px-3 py-3 text-right font-mono text-emerald-300 font-black tracking-tight">{formatCurrency(run.totalNet)}</td>
                                                            <td className="px-3 py-3"></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PAYE Info Card */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white shadow-xl shadow-orange-600/20">
                    <h3 className="font-bold text-lg mb-3">Nigerian PAYE Tax Bands</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-orange-200 text-xs">First ₦300k</p>
                            <p className="font-bold text-xl">7%</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-orange-200 text-xs">Next ₦300k</p>
                            <p className="font-bold text-xl">11%</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-orange-200 text-xs">Next ₦500k</p>
                            <p className="font-bold text-xl">15%</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-orange-200 text-xs">Next ₦500k</p>
                            <p className="font-bold text-xl">19%</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-orange-200 text-xs">Next ₦1.6M</p>
                            <p className="font-bold text-xl">21%</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="text-orange-200 text-xs">Above ₦3.2M</p>
                            <p className="font-bold text-xl">24%</p>
                        </div>
                    </div>
                    <p className="text-orange-200 text-xs mt-4">
                        * CRA (Consolidated Relief Allowance) = max(₦200,000, 1% of Gross) + 20% of Gross
                    </p>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                variant={modal.variant}
            />
        </div>
    );
}

function ConfirmationModal({
    isOpen, onClose, onConfirm, title, message, type, variant
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type: "confirm" | "alert";
    variant: "info" | "success" | "warning" | "danger";
}) {
    if (!isOpen) return null;

    const variants = {
        info: { bg: "bg-blue-50", text: "text-blue-600", icon: <Info className="w-6 h-6" /> },
        success: { bg: "bg-emerald-50", text: "text-emerald-600", icon: <CheckCircle className="w-6 h-6" /> },
        warning: { bg: "bg-orange-50", text: "text-orange-600", icon: <AlertCircle className="w-6 h-6" /> },
        danger: { bg: "bg-red-50", text: "text-red-600", icon: <X className="w-6 h-6" /> },
    };

    const color = variants[variant];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="flex items-start gap-5">
                        <div className={cn("p-4 rounded-2xl shadow-sm", color.bg, color.text)}>
                            {color.icon}
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                            <p className="text-slate-500 font-medium text-sm mt-2 leading-relaxed">{message}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-10">
                        {type === "confirm" ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm?.();
                                        onClose();
                                    }}
                                    className={cn(
                                        "px-8 py-2.5 text-sm font-black text-white rounded-xl shadow-lg transition-all active:scale-95 hover:brightness-110",
                                        variant === "danger" ? "bg-red-600 shadow-red-200" :
                                            variant === "warning" ? "bg-orange-600 shadow-orange-200" :
                                                "bg-blue-600 shadow-blue-200"
                                    )}
                                >
                                    Confirm Action
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className={cn(
                                    "px-10 py-3 text-sm font-black text-white rounded-xl shadow-lg transition-all active:scale-95 hover:brightness-110",
                                    variant === "success" ? "bg-emerald-600 shadow-emerald-200" :
                                        variant === "warning" ? "bg-orange-600 shadow-orange-200" :
                                            variant === "danger" ? "bg-red-600 shadow-red-200" :
                                                "bg-blue-600 shadow-blue-200"
                                )}
                            >
                                GOT IT
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
    const colors: Record<string, string> = {
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        orange: "bg-orange-50 text-orange-600 ring-orange-100",
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        purple: "bg-purple-50 text-purple-600 ring-purple-100",
        teal: "bg-teal-50 text-teal-600 ring-teal-100",
        slate: "bg-slate-100 text-slate-600 ring-slate-200"
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center ring-1 mb-3", colors[color])}>
                {icon}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1 tracking-tight">{value}</p>
        </div>
    );
}
