"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { Plus, X, Search, Filter, Check, Clock, AlertCircle, ArrowRight, Package, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AssetRequestsPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Filter State
    const [statusFilter, setStatusFilter] = useState("All");

    // Form State
    const [newRequest, setNewRequest] = useState({
        requesterName: user?.name || "",
        department: "",
        category: "Electronics",
        description: "",
        urgency: "Medium"
    });

    // Populate user details on load
    useEffect(() => {
        if (user) {
            setNewRequest(prev => ({
                ...prev,
                requesterName: user.name,
                // In a real app we'd fetch dept from user profile, simulating for now
                department: "Operations"
            }));
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/ops/requests");
            const json = await res.json();
            if (json.success) {
                setRequests(json.data);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/ops/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRequest)
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
                setNewRequest(prev => ({
                    ...prev,
                    category: "Electronics",
                    description: "",
                    urgency: "Medium"
                }));
            }
        } catch (error) {
            console.error("Failed to submit request", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string, reason?: string) => {
        try {
            const res = await fetch("/api/ops/requests", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    status,
                    approvedBy: status === "Approved" ? user?.name : null,
                    rejectionReason: reason
                })
            });

            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-orange-50 text-orange-600";
            case "Approved": return "bg-green-50 text-green-600";
            case "Rejected": return "bg-red-50 text-red-600";
            case "Fulfilled": return "bg-blue-50 text-blue-600";
            default: return "bg-gray-100 text-gray-500";
        }
    };

    const filteredRequests = requests.filter(r => {
        if (!isAdmin && r.requesterName !== user?.name) return false;
        if (statusFilter !== "All" && r.status !== statusFilter) return false;
        return true;
    });

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Asset Requests"
                subtitle="Manage and track equipment requests."
                breadcrumbs={[{ label: "Assets", href: "/assets" }, { label: "Requests" }]}
                action={
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-lg shadow-orange-600/20"
                    >
                        <Plus className="w-4 h-4" /> New Request
                    </button>
                }
            />

            <div className="card">
                <div className="card-header border-b border-slate-100 p-4 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                    statusFilter === status
                                        ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
                                        : "text-slate-500 hover:bg-slate-100"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider bg-slate-50/30">
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Requester</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4">Urgency</th>
                                    <th className="py-3 px-4">Status</th>
                                    {isAdmin && <th className="py-3 px-4 text-right">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={7} className="py-12 text-center text-slate-400">Loading requests...</td></tr>
                                ) : filteredRequests.length === 0 ? (
                                    <tr><td colSpan={7} className="py-12 text-center text-slate-400">No requests found.</td></tr>
                                ) : (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors text-sm group">
                                            <td className="py-3 px-4 font-mono text-xs text-slate-500">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-700">{req.requesterName}</div>
                                                <div className="text-xs text-slate-400">{req.department}</div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">{req.category}</td>
                                            <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={req.description}>
                                                {req.description}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                                    req.urgency === "High" ? "bg-red-50 text-red-600" :
                                                        req.urgency === "Medium" ? "bg-orange-50 text-orange-600" :
                                                            "bg-blue-50 text-blue-600"
                                                )}>
                                                    {req.urgency}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={cn("px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1.5", getStatusColor(req.status))}>
                                                    {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                                                    {req.status === 'Approved' && <Check className="w-3 h-3" />}
                                                    {req.status === 'Rejected' && <X className="w-3 h-3" />}
                                                    {req.status}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="py-3 px-4 text-right">
                                                    {req.status === 'Pending' && (
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleUpdateStatus(req.id, "Approved")}
                                                                className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(req.id, "Rejected")}
                                                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 animate-in zoom-in-95 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Request New Asset</h2>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Submit a requisition for equipment</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Category</label>
                                    <div className="relative">
                                        <select
                                            required
                                            className="w-full h-10 pl-4 pr-10 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none"
                                            value={newRequest.category}
                                            onChange={e => setNewRequest({ ...newRequest, category: e.target.value })}
                                        >
                                            <option value="Electronics">Electronics (Laptop, Phone)</option>
                                            <option value="Furniture">Furniture (Chair, Desk)</option>
                                            <option value="Stationery">Stationery / Consumables</option>
                                            <option value="Vehicle">Vehicle / Transportation</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Urgency</label>
                                    <select
                                        required
                                        className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none"
                                        value={newRequest.urgency}
                                        onChange={e => setNewRequest({ ...newRequest, urgency: e.target.value })}
                                    >
                                        <option value="Low">Low - Can wait</option>
                                        <option value="Medium">Medium - Standard</option>
                                        <option value="High">High - Urgent / Blocker</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Description / Justification</label>
                                <textarea
                                    required
                                    className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none placeholder:font-medium placeholder:text-slate-400"
                                    placeholder="Explain what is needed and why..."
                                    value={newRequest.description}
                                    onChange={e => setNewRequest({ ...newRequest, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Requester</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="w-full h-10 px-4 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 outline-none cursor-not-allowed"
                                    value={newRequest.requesterName}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-xs uppercase tracking-wider">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-70">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
