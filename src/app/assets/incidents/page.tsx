"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { Plus, X, Search, Filter, AlertCircle, AlertTriangle, CheckCircle, ArrowRight, Calendar, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function IncidentsPage() {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [newIncident, setNewIncident] = useState({
        assetId: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
        reportedBy: user?.name || "",
        status: "Open"
    });

    const fetchData = async () => {
        try {
            const [kvIncidents, kvAssets] = await Promise.all([
                fetch("/api/ops/incidents").then(res => res.json()),
                fetch("/api/ops/assets").then(res => res.json())
            ]);

            if (kvIncidents.success) setIncidents(kvIncidents.data);
            if (kvAssets.success) setAssets(kvAssets.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Pre-fill reportedBy when user loads
    useEffect(() => {
        if (user) {
            setNewIncident(prev => ({ ...prev, reportedBy: user.name }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/ops/incidents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newIncident)
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
                setNewIncident({
                    assetId: "",
                    date: new Date().toISOString().split('T')[0],
                    description: "",
                    reportedBy: user?.name || "",
                    status: "Open"
                });
            }
        } catch (error) {
            console.error("Failed to create incident", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open": return "bg-red-50 text-red-600";
            case "In Progress": return "bg-orange-50 text-orange-600";
            case "Resolved": return "bg-green-50 text-green-600";
            default: return "bg-gray-100 text-gray-500";
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Incident Reporting"
                subtitle="Track and resolve asset damages and issues."
                breadcrumbs={[{ label: "Assets", href: "/assets" }, { label: "Incidents" }]}
                action={
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <AlertTriangle className="w-4 h-4" /> Report Incident
                    </button>
                }
            />

            <div className="card">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-2">Date</th>
                                    <th className="py-3 px-2">Asset</th>
                                    <th className="py-3 px-2">Description</th>
                                    <th className="py-3 px-2">Reported By</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2">Resolution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading incidents...</td></tr>
                                ) : incidents.length === 0 ? (
                                    <tr><td colSpan={6} className="py-8 text-center text-gray-400">No incidents reported yet.</td></tr>
                                ) : (
                                    incidents.map((incident) => (
                                        <tr key={incident.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                                            <td className="py-3 px-2 font-mono text-gray-500">
                                                {new Date(incident.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800">{incident.asset.name}</span>
                                                    <span className="text-xs text-gray-400 font-mono">{incident.asset.tagNumber || "No Tag"}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 text-gray-600 max-w-xs truncate" title={incident.description}>
                                                {incident.description}
                                            </td>
                                            <td className="py-3 px-2 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                        {incident.reportedBy.charAt(0)}
                                                    </div>
                                                    {incident.reportedBy}
                                                </div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className={cn("px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1.5", getStatusColor(incident.status))}>
                                                    {incident.status === 'Open' && <AlertCircle className="w-3 h-3" />}
                                                    {incident.status === 'Resolved' && <CheckCircle className="w-3 h-3" />}
                                                    {incident.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-gray-500 italic">
                                                {incident.resolution || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 animate-in zoom-in-95 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Report Incident</h2>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Log a new issue or damage</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Select Asset</label>
                                    <div className="relative">
                                        <select
                                            required
                                            className="w-full h-10 pl-4 pr-10 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none"
                                            value={newIncident.assetId}
                                            onChange={e => setNewIncident({ ...newIncident, assetId: e.target.value })}
                                        >
                                            <option value="">-- Choose Asset --</option>
                                            {assets.map(asset => (
                                                <option key={asset.id} value={asset.id}>
                                                    {asset.name} ({asset.tagNumber || "No Tag"})
                                                </option>
                                            ))}
                                        </select>
                                        <Package className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Incident Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            required
                                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                            value={newIncident.date}
                                            onChange={e => setNewIncident({ ...newIncident, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Description of Issue</label>
                                <textarea
                                    required
                                    className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none placeholder:font-medium placeholder:text-slate-400"
                                    placeholder="Describe the damage or incident in detail..."
                                    value={newIncident.description}
                                    onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Reported By</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="w-full h-10 px-4 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 outline-none cursor-not-allowed"
                                    value={newIncident.reportedBy}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-xs uppercase tracking-wider">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 flex items-center justify-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
