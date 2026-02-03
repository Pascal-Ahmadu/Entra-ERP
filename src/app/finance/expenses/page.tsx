"use client";

import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ExpenseRequest {
    id: number;
    requestNumber: string;
    staffName: string;
    staffEmail: string;
    department: string;
    category: string;
    amount: number;
    description: string;
    status: string;
    finalStatus: string;
    createdAt: string;
}

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<ExpenseRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = () => {
        setLoading(true);
        fetch("/api/finance")
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setExpenses(json.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("API error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchExpenses();
    }, []);


    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Expense Management"
                subtitle="Centralized control for staff reimbursements and corporate spending."
                breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Expenses" }]}
            />

            <div className="card">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Expense Requests</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchExpenses}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                <i className={cn("ti ti-refresh text-lg", loading && "animate-spin")}></i> Refresh
                            </button>
                            <Link
                                href="/finance/expenses/create"
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                            >
                                <i className="ti ti-plus text-lg"></i> New Request
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                    <th className="px-4 py-3 text-center">S/N</th>
                                    <th className="px-4 py-3">Requester & ID</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-40">
                                                <i className="ti ti-loader text-6xl animate-spin"></i>
                                                <p className="text-lg font-bold text-gray-800">Loading expenses...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : expenses.length > 0 ? (
                                    expenses.map((expense, index) => (
                                        <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-[10px] font-bold text-gray-400 tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-gray-700 text-sm">{expense.staffName}</p>
                                                    <p className="text-[10px] text-orange-600 font-bold uppercase">{expense.requestNumber}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <p className="text-sm text-gray-600 font-medium">{expense.category}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{expense.description}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="font-bold text-gray-800">₦{expense.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm border",
                                                    expense.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        expense.status.includes("Rejected") ? "bg-red-50 text-red-600 border-red-100" :
                                                            "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {expense.status}
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
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-40">
                                                <i className="ti ti-receipt text-6xl"></i>
                                                <div>
                                                    <p className="text-lg font-bold text-gray-800">No Expenses Found</p>
                                                    <p className="text-sm text-gray-400">You haven't submitted any expense requests yet.</p>
                                                </div>
                                                <Link
                                                    href="/finance/expenses/create"
                                                    className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold opacity-100! hover:bg-orange-700 transition-all"
                                                >
                                                    + New Request
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

