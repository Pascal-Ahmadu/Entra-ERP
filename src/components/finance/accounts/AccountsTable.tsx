"use client";

import { Search } from "lucide-react";
import { Account } from "./types";

interface AccountsTableProps {
    accounts: Account[];
    loading: boolean;
    startIndex: number;
}

export default function AccountsTable({ accounts, loading, startIndex }: AccountsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">S/N</th>
                        <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Code</th>
                        <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Account Name</th>
                        <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Type</th>
                        <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Sub-Type</th>
                        <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        [1, 2, 3, 4, 5].map(i => (
                            <tr key={i} className="border-b border-slate-100 animate-pulse">
                                <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-slate-200 rounded w-24 ml-auto"></div></td>
                            </tr>
                        ))
                    ) : accounts.length > 0 ? (
                        accounts.map((acc, index) => (
                            <tr key={acc.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                <td className="px-4 py-3 text-xs font-bold text-slate-400 group-hover:text-slate-600">
                                    {(startIndex + index + 1).toString().padStart(2, '0')}
                                </td>
                                <td className="px-4 py-3 text-xs font-mono font-bold text-slate-600">{acc.code}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-bold text-slate-900">{acc.name}</span>
                                        {acc.category && (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                {acc.category}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs font-bold text-slate-600">{acc.type}</td>
                                <td className="px-4 py-3 text-xs font-bold text-slate-500">{acc.subType || '-'}</td>
                                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                                    ₦{acc.balance.toLocaleString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="p-12 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Search className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-600 mb-1">No matching accounts</p>
                                        <p className="text-xs text-slate-400">Try adjusting your filters or search query</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}