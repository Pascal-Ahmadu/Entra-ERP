"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { Plus, Check, X, Clock, AlertTriangle, ShieldCheck, Banknote, Briefcase, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function StaffClearancePage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";
    // In a real app, we'd have specific roles like "Finance", "AssetMgr". For now Admin does all.

    // Simulating Dept roles for demo if user is not Admin
    const isAssetLead = (user?.role as string) === "AssetLead" || isAdmin;
    const isFinanceLead = (user?.role as string) === "FinanceLead" || isAdmin;
    const isHRLead = (user?.role as string) === "HR" || isAdmin;

    const [clearances, setClearances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInitModal, setShowInitModal] = useState(false);

    // For initiating clearance
    const [initData, setInitData] = useState({
        remarks: ""
    });

    const fetchData = async () => {
        try {
            const res = await fetch("/api/hr/clearance");
            const json = await res.json();
            if (json.success) {
                setClearances(json.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInitiate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Initiate for self if not specified (normally HR initiates for others)
            const res = await fetch("/api/hr/clearance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employeeId: user?.id, // Assuming user context has ID
                    employeeName: user?.name,
                    remarks: initData.remarks
                })
            });

            if (res.ok) {
                setShowInitModal(false);
                fetchData();
            } else {
                alert("Could not initiate. You might already have a pending clearance.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = async (id: number, field: string, status: string) => {
        try {
            const res = await fetch("/api/hr/clearance", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, [field]: status })
            });
            if (res.ok) fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'Cleared') return "bg-green-100 text-green-700 border-green-200";
        if (status === 'Pending') return "bg-orange-50 text-orange-600 border-orange-100";
        if (status === 'Rejected') return "bg-red-50 text-red-600 border-red-100";
        return "bg-slate-100 text-slate-500 border-slate-200";
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Staff Clearance"
                subtitle="Exit process tracking and approvals."
                breadcrumbs={[{ label: "HR", href: "/hr" }, { label: "Clearance" }]}
                action={
                    <button
                        onClick={() => setShowInitModal(true)}
                        className="btn btn-primary bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Initiate Value
                    </button>
                }
            />

            <div className="card">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                                    <th className="py-4 px-4">Employee</th>
                                    <th className="py-4 px-4">Request Date</th>
                                    <th className="py-4 px-4 text-center">Assets</th>
                                    <th className="py-4 px-4 text-center">Finance</th>
                                    <th className="py-4 px-4 text-center">Dept</th>
                                    <th className="py-4 px-4 text-center">HR</th>
                                    <th className="py-4 px-4 text-center">Final</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={7} className="py-12 text-center text-slate-400">Loading...</td></tr>
                                ) : clearances.length === 0 ? (
                                    <tr><td colSpan={7} className="py-12 text-center text-slate-400">No active clearances.</td></tr>
                                ) : (
                                    clearances.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-slate-800">{c.employeeName}</div>
                                                <div className="text-xs text-slate-400">ID: {c.employeeId}</div>
                                            </td>
                                            <td className="py-4 px-4 font-mono text-xs text-slate-500">
                                                {new Date(c.requestDate).toLocaleDateString()}
                                            </td>

                                            {/* Operations / Assets */}
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={cn("px-2 py-1 rounded text-[10px] font-black uppercase border", getStatusBadge(c.assetStatus))}>
                                                        {c.assetStatus}
                                                    </span>
                                                    {isAssetLead && c.assetStatus !== 'Cleared' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(c.id, 'assetStatus', 'Cleared')}
                                                            className="text-xs font-bold text-blue-600 hover:underline"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Finance */}
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={cn("px-2 py-1 rounded text-[10px] font-black uppercase border", getStatusBadge(c.financeStatus))}>
                                                        {c.financeStatus}
                                                    </span>
                                                    {isFinanceLead && c.financeStatus !== 'Cleared' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(c.id, 'financeStatus', 'Cleared')}
                                                            className="text-xs font-bold text-blue-600 hover:underline"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Dept */}
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={cn("px-2 py-1 rounded text-[10px] font-black uppercase border", getStatusBadge(c.deptStatus))}>
                                                        {c.deptStatus}
                                                    </span>
                                                    {/* Assuming Line Manager or Admin approves Dept */}
                                                    {isAdmin && c.deptStatus !== 'Cleared' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(c.id, 'deptStatus', 'Cleared')}
                                                            className="text-xs font-bold text-blue-600 hover:underline"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* HR Final Check */}
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={cn("px-2 py-1 rounded text-[10px] font-black uppercase border", getStatusBadge(c.hrStatus))}>
                                                        {c.hrStatus}
                                                    </span>
                                                    {isHRLead && c.hrStatus !== 'Cleared' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(c.id, 'hrStatus', 'Cleared')}
                                                            className="text-xs font-bold text-blue-600 hover:underline"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Final Status */}
                                            <td className="py-4 px-4 text-center">
                                                {c.finalStatus === 'Completed' ? (
                                                    <span className="flex items-center justify-center gap-1.5 text-green-600 font-bold text-xs">
                                                        <ShieldCheck className="w-4 h-4" /> Cleared
                                                    </span>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-slate-400 font-medium text-xs">In Progress</span>
                                                        {isHRLead &&
                                                            c.assetStatus === 'Cleared' &&
                                                            c.financeStatus === 'Cleared' &&
                                                            c.hrStatus === 'Cleared' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(c.id, 'finalStatus', 'Completed')}
                                                                    className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-bold hover:bg-slate-700"
                                                                >
                                                                    Sign Off
                                                                </button>
                                                            )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Init Modal */}
            {showInitModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-in zoom-in-95">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-lg font-black text-slate-900">Initiate Clearance</h2>
                            <button onClick={() => setShowInitModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleInitiate} className="p-6 space-y-4">
                            <div className="p-4 bg-orange-50 rounded-lg flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
                                <p className="text-xs text-orange-800 font-medium">
                                    You are about to start the exit clearance process. This will notify Asset, Finance, and HR departments.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Remarks (Optional)</label>
                                <textarea
                                    className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-slate-900 resize-none"
                                    placeholder="Reason for exit or notes..."
                                    value={initData.remarks}
                                    onChange={e => setInitData({ ...initData, remarks: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-slate-800">
                                Start Process
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
