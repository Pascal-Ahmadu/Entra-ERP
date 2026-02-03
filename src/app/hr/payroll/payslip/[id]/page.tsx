"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Printer, Download, ArrowLeft, Building2 } from "lucide-react";

interface PayslipData {
    id: number;
    employeeId: number;
    employeeName: string;
    basicSalary: number;
    allowances: number;
    bonus: number;
    cashBenefits: number;
    grossPay: number;
    cra: number;
    taxableIncome: number;
    paye: number;
    pension: number;
    nhf: number;
    netPay: number;
    payrollRun: {
        id: number;
        month: number;
        year: number;
        status: string;
    };
    employee: {
        id: number;
        name: string;
        email: string;
        dept: string;
        role: string;
        bank: string | null;
        accountNo: string | null;
        pfa: string | null;
        rsa: string | null;
    } | null;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function PayslipPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [payslip, setPayslip] = useState<PayslipData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayslip();
    }, [resolvedParams.id]);

    const fetchPayslip = async () => {
        try {
            const res = await fetch(`/api/hr/payroll/${resolvedParams.id}`);
            const data = await res.json();
            if (data.success) {
                setPayslip(data.data);
            }
        } catch (error) {
            console.error("Error fetching payslip:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(val);
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500 font-medium">Loading Payslip...</p>
                </div>
            </div>
        );
    }

    if (!payslip) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500 font-medium">Payslip not found</p>
                    <Link href="/hr/payroll" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                        ← Back to Payroll
                    </Link>
                </div>
            </div>
        );
    }

    const totalEarnings = payslip.grossPay;
    const totalDeductions = payslip.paye + payslip.pension + payslip.nhf;
    const payPeriod = `${MONTHS[payslip.payrollRun.month - 1]} ${payslip.payrollRun.year}`;
    const generationDate = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8 font-sans print:p-0 print:bg-white">

            {/* Action Bar (Original screen only) */}
            <div id="print-actions" className="max-w-[210mm] mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href="/hr/payroll"
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Payroll
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-bold shadow-sm transition-all"
                    >
                        <Printer className="w-4 h-4" />
                        Print
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-bold shadow-md shadow-orange-600/20 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* A4 Paper Container */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] print:shadow-none print:min-h-0 print:w-full print:max-w-none">

                {/* 1. Header Section */}
                <div className="p-10 border-b-4 border-orange-600">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            {/* Company Logo Placeholder */}
                            <div className="w-16 h-16 bg-orange-600 text-white flex items-center justify-center rounded">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Entra ERP</h1>
                                <p className="text-sm text-slate-500 mt-1">123 Business District, Victoria Island</p>
                                <p className="text-sm text-slate-500">Lagos, Nigeria</p>
                                <p className="text-sm text-slate-500">RC: 12345678</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-black text-orange-200 uppercase tracking-widest">Payslip</h2>
                            <p className="text-sm font-bold text-slate-900 mt-2">Period: {payPeriod}</p>
                            <p className="text-xs text-slate-500 mt-1">Payslip ID: #PAY-{payslip.payrollRun.id}-{payslip.id}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Employee Details Grid */}
                <div className="p-10 bg-slate-50 border-b border-slate-200">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-500 uppercase text-xs font-bold tracking-wider">Employee Name</span>
                                <span className="font-bold text-slate-900">{payslip.employeeName}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-500 uppercase text-xs font-bold tracking-wider">Employee ID</span>
                                <span className="font-bold text-slate-900">EMP-{payslip.employeeId.toString().padStart(4, '0')}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-500 uppercase text-xs font-bold tracking-wider">Designation</span>
                                <span className="font-bold text-slate-900">{payslip.employee?.role || '-'}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-500 uppercase text-xs font-bold tracking-wider">Department</span>
                                <span className="font-bold text-slate-900">{payslip.employee?.dept || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-500 uppercase text-xs font-bold tracking-wider">Bank Name</span>
                                <span className="font-bold text-slate-900">{payslip.employee?.bank || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-1">
                                <span className="text-slate-500 uppercase text-xs font-bold tracking-wider">Account Number</span>
                                <span className="font-mono font-bold text-slate-900">{payslip.employee?.accountNo || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Financials Table */}
                <div className="p-10">
                    <div className="grid grid-cols-2 gap-0 border border-slate-200">
                        {/* Column 1: Earnings */}
                        <div className="border-r border-slate-200">
                            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Earnings</h3>
                            </div>
                            <div className="p-4 space-y-3 min-h-[200px]">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Basic Salary</span>
                                    <span className="font-mono text-slate-900">{formatCurrency(payslip.basicSalary)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Housing & Transport</span>
                                    <span className="font-mono text-slate-900">{formatCurrency(payslip.allowances)}</span>
                                </div>
                                {payslip.bonus > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">13th Month Bonus</span>
                                        <span className="font-mono text-slate-900">{formatCurrency(payslip.bonus)}</span>
                                    </div>
                                )}
                                {payslip.cashBenefits > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Airtime & Data</span>
                                        <span className="font-mono text-slate-900">{formatCurrency(payslip.cashBenefits)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-sm text-slate-700">Total Earnings</span>
                                <span className="font-mono font-bold text-slate-900">{formatCurrency(totalEarnings)}</span>
                            </div>
                        </div>

                        {/* Column 2: Deductions */}
                        <div>
                            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Deductions</h3>
                            </div>
                            <div className="p-4 space-y-3 min-h-[200px]">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">PAYE Tax</span>
                                    <span className="font-mono text-slate-900">{formatCurrency(payslip.paye)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Pension (8%)</span>
                                    <span className="font-mono text-slate-900">{formatCurrency(payslip.pension)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">NHF (2.5%)</span>
                                    <span className="font-mono text-slate-900">{formatCurrency(payslip.nhf)}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-sm text-slate-700">Total Deductions</span>
                                <span className="font-mono font-bold text-slate-900">{formatCurrency(totalDeductions)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Net Pay Highlight */}
                <div className="px-10 pb-10">
                    <div className="bg-orange-600 text-white p-6 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-orange-100">Net Pay</p>
                            <p className="text-sm text-orange-100 mt-1 capitalize">
                                {convertNumberToWords(Math.floor(payslip.netPay))} Naira Only
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-black font-mono tracking-tight">{formatCurrency(payslip.netPay)}</p>
                        </div>
                    </div>
                </div>

                {/* 5. Footer / Disclaimer */}
                <div className="mt-auto px-10 pb-12 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-end text-xs text-slate-400">
                        <div>
                            <p className="font-bold text-slate-500 mb-1">Generated on: {generationDate}</p>
                            <p>This is a system generated payslip and does not require a signature.</p>
                            <p>Any discrepancies should be reported to HR within 24 hours.</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-900">Entra Corp.</p>
                            <p>www.entracorp.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Optimization */}
            {/* Print Optimization & Global Overrides */}
            <style jsx global>{`
                @media print {
                    /* Reset Standard Layout */
                    @page { margin: 0; size: A4; }
                    html, body { 
                        background: white !important; 
                        height: auto !important; 
                        overflow: visible !important;
                    }

                    /* Hide ALL App Shell Elements & Action Bar by ID/Tag */
                    #print-actions, aside, nav, header, button, .sidebar, .header { 
                        display: none !important; 
                    }

                    /* Ensure Main Content is Full Width */
                    main, .layout-wrapper, #root, body > div {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        transform: none !important; /* Fix for some sidebar transforms */
                    }

                    /* Utility Hiders */
                    .print\\:hidden { display: none !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:min-h-0 { min-height: 0 !important; }
                    .print\\:w-full { width: 100% !important; }
                    .print\\:max-w-none { max-width: none !important; }
                    
                    /* Force Background Colors */
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>
        </div>
    );
}

// Simple number to text converter helper
function convertNumberToWords(amount: number): string {
    // This is a simplified placeholder. Ideally use a library.
    // For now, returning a generic statement to avoid complex logic bloat here.
    return "Sum of ";
}
