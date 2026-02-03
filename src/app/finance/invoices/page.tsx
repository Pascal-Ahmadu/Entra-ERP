"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Filter, FileText, Download, MoreVertical, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch("/api/finance/invoices");
            const data = await res.json();
            if (data.success) {
                setInvoices(data.data);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
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
                    <span className="text-orange-600 font-bold">Invoices</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invoices</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage client invoices and track payments</p>
                    </div>
                    <Link
                        href="/finance/invoices/create"
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-md transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Create Invoice
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No Invoices Found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                            Get started by creating your first invoice to send to clients.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">S/N</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice #</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoices.map((invoice, index) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-[10px] font-bold text-gray-400 tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{invoice.clientName}</div>
                                            <div className="text-xs text-gray-500">{invoice.clientEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(invoice.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900">
                                            ₦{invoice.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border ${invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                invoice.status === 'SENT' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
