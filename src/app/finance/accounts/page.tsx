"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Account } from "@/components/finance/accounts/types";
import AddAccountModal from "@/components/finance/accounts/AddAccountModal";
import AccountsTable from "@/components/finance/accounts/AccountsTable";

const ACCOUNT_TYPES = ["Asset", "Liability", "Equity", "Revenue", "Expense"] as const;

export default function ChartOfAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch("/api/finance/accounts");
            const data = await res.json();
            if (data.success) {
                setAccounts(data.data);
            }
        } catch (error) {
            console.error("Error fetching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch =
            acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.code.includes(searchQuery);
        const matchesFilter = filterType === "All" || acc.type === filterType;
        return matchesSearch && matchesFilter;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterType]);

    const accountTypes = ["All", ...ACCOUNT_TYPES];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 p-6">
            {/* Navigation */}
            <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500">
                <Link href="/finance" className="hover:text-orange-600 transition-colors">
                    Finance
                </Link>
                <span>/</span>
                <span className="text-slate-900">Chart of Accounts</span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                        Chart of Accounts
                    </h1>
                    <p className="text-sm font-semibold text-slate-500">
                        Financial Structural Framework
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold text-[10px] tracking-wider shadow-md shadow-orange-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add New Account
                </button>
            </div>

            {/* Unified Account Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                {/* Visual Toolbar */}
                <div className="bg-gradient-to-r from-slate-50 to-orange-50/30 border-b border-slate-200/60 p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Left side: Search + Filters */}
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Search */}
                            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm min-w-[200px] max-w-[300px]">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search accounts..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-xs font-semibold text-slate-700 placeholder:text-slate-400 p-0 focus:ring-0 w-full"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                                {accountTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-md text-[10px] font-black tracking-wider transition-all flex-shrink-0",
                                            filterType === type
                                                ? "bg-white text-orange-600 shadow-sm border border-slate-200 ring-1 ring-slate-200"
                                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right side: Actions */}
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 font-bold text-[10px] tracking-wider transition-all shadow-sm">
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table Component */}
                <AccountsTable
                    accounts={paginatedAccounts}
                    loading={loading}
                    startIndex={startIndex}
                />

                {/* Pagination Footer */}
                {!loading && filteredAccounts.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/30">
                        <p className="text-xs font-bold text-slate-500">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold text-xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>

                            <span className="px-4 py-1.5 text-xs font-bold text-slate-600">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold text-xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Account Modal Component */}
            <AddAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchAccounts();
                }}
                accounts={accounts}
            />
        </div>
    );
}