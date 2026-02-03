"use client";

import { useState, useEffect } from "react";
import {
    Calendar, FileText, Plus, Save, Trash2,
    CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import CustomSelect from "@/components/ui/CustomSelect";

interface Account {
    id: number;
    code: string;
    name: string;
    type: string;
}

interface JournalLine {
    id: string;
    accountId: string;
    debit: string;
    credit: string;
}

export default function CreateJournalEntry() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState("");
    const [reference, setReference] = useState("");

    const [lines, setLines] = useState<JournalLine[]>([
        { id: '1', accountId: '', debit: '', credit: '' },
        { id: '2', accountId: '', debit: '', credit: '' }
    ]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch("/api/finance/accounts");
                const data = await res.json();
                if (data.success) {
                    setAccounts(data.data);
                }
            } catch (error) {
                console.error("Failed to load accounts", error);
            }
        };
        fetchAccounts();
    }, []);

    const addLine = () => {
        setLines([...lines, {
            id: Math.random().toString(36).substr(2, 9),
            accountId: '',
            debit: '',
            credit: ''
        }]);
    };

    const removeLine = (id: string) => {
        if (lines.length <= 2) return;
        setLines(lines.filter(l => l.id !== id));
    };

    const updateLine = (id: string, field: keyof JournalLine, value: string) => {
        setLines(lines.map(line => {
            if (line.id !== id) return line;
            if (field === 'debit' && value !== '') return { ...line, debit: value, credit: '' };
            if (field === 'credit' && value !== '') return { ...line, credit: value, debit: '' };
            return { ...line, [field]: value };
        }));
    };

    const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
    const difference = totalDebit - totalCredit;
    const isBalanced = Math.abs(difference) < 0.01;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isBalanced) {
            alert("Journal Entry is not balanced. Please adjust amounts.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/finance/journals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    description,
                    reference,
                    lines: lines.map(l => ({
                        accountId: l.accountId,
                        debit: l.debit,
                        credit: l.credit
                    }))
                })
            });

            const data = await res.json();
            if (data.success) {
                router.push("/finance");
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error posting journal:", error);
            alert("Failed to submit journal entry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 p-6">
            {/* Breadcrumb Navigation */}
            <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500">
                <Link href="/finance" className="hover:text-orange-600 transition-colors">
                    Finance
                </Link>
                <span>/</span>
                <span className="text-slate-900">Manual Journal</span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                        New Journal Entry
                    </h1>
                    <p className="text-sm font-semibold text-slate-500">
                        Manual Double-Entry Recording
                    </p>
                </div>

                <button
                    type="button"
                    onClick={addLine}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold text-[10px] tracking-wider shadow-md shadow-orange-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Line
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Journal Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    {/* Toolbar - Entry Details */}
                    <div className="bg-gradient-to-r from-slate-50 to-orange-50/30 border-b border-slate-200/60 p-4">
                        <div className="flex items-center justify-between gap-6 flex-wrap">
                            {/* Left: Date + Reference */}
                            <div className="flex items-center gap-4 flex-wrap">
                                {/* Date Input */}
                                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="bg-transparent !border-0 !border-none !outline-none !shadow-none text-sm font-bold text-slate-700 focus:!ring-0 focus:!outline-none focus:!border-none focus:!shadow-none w-auto appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-datetime-edit-fields-wrapper]:p-0"
                                        style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                                    />
                                </div>

                                {/* Reference Input */}
                                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Reference #"
                                        value={reference}
                                        onChange={e => setReference(e.target.value)}
                                        className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:ring-0 focus:outline-none w-28"
                                    />
                                </div>
                            </div>

                            {/* Right: Balance Status */}
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-xs",
                                isBalanced
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : "bg-amber-50 text-amber-600 border border-amber-200"
                            )}>
                                {isBalanced ? (
                                    <><CheckCircle2 className="w-4 h-4" /> Balanced</>
                                ) : (
                                    <><AlertCircle className="w-4 h-4" /> Diff: ₦{Math.abs(difference).toLocaleString()}</>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/30">
                        <input
                            type="text"
                            required
                            placeholder="Enter description for this journal entry..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-0"
                        />
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 text-[10px] font-black text-slate-400 tracking-wider px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-5">Account</div>
                        <div className="col-span-2 text-right">Debit</div>
                        <div className="col-span-2 text-right">Credit</div>
                        <div className="col-span-2"></div>
                    </div>

                    {/* Journal Lines */}
                    <div className="divide-y divide-slate-100">
                        {lines.map((line, index) => (
                            <div key={line.id} className="grid grid-cols-12 gap-4 px-4 py-4 items-center group hover:bg-orange-50/30 transition-colors">
                                <div className="col-span-1 flex items-center justify-center">
                                    <span className="w-7 h-7 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg text-xs font-black">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="col-span-5">
                                    <CustomSelect
                                        required
                                        value={line.accountId}
                                        onChange={(val) => updateLine(line.id, 'accountId', val)}
                                        placeholder="Select Account..."
                                        options={accounts.map(acc => ({
                                            value: acc.id.toString(),
                                            label: `${acc.code} - ${acc.name}`
                                        }))}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={line.debit}
                                        onChange={e => updateLine(line.id, 'debit', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 text-right outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={line.credit}
                                        onChange={e => updateLine(line.id, 'credit', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 text-right outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeLine(line.id)}
                                        disabled={lines.length <= 2}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer - Totals & Submit */}
                    <div className="flex items-center justify-between p-5 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-orange-50/30">
                        <div className="flex items-center gap-6">
                            <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">Total Debit</p>
                                <p className="font-mono font-black text-xl text-slate-800">₦{totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">Total Credit</p>
                                <p className="font-mono font-black text-xl text-slate-800">₦{totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!isBalanced || loading}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wider shadow-lg transition-all active:scale-95",
                                isBalanced && !loading
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                            )}
                        >
                            <Save className="w-5 h-5" />
                            {loading ? "Posting..." : "Post Journal"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
