"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { Search, Filter, Trash2, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DisposedAssetsPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/ops/assets");
            const json = await res.json();
            if (json.success) {
                // Filter only disposed assets
                setAssets(json.data.filter((a: any) => a.status === "Disposed"));
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

    const handleRestoreAsset = async (asset: any) => {
        if (!confirm(`Are you sure you want to restore "${asset.name}" to inventory?`)) return;

        try {
            const res = await fetch("/api/ops/assets", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: asset.id,
                    status: "Available", // Restore as Available
                    disposalDate: null,
                    disposalType: null,
                    disposalReason: null,
                    disposalValue: null
                })
            });

            if (res.ok) {
                fetchData();
            }
        } catch (err) {
            console.error("Failed to restore", err);
        }
    };

    const getDisposalBadge = (type: string) => {
        switch (type) {
            case "Sale": return "bg-green-100 text-green-700";
            case "Scrap": return "bg-gray-100 text-gray-600";
            case "Donation": return "bg-blue-100 text-blue-700";
            case "Lost": return "bg-red-100 text-red-700";
            case "Damaged": return "bg-orange-100 text-orange-700";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    if (!isAdmin) {
        return <div className="p-8 text-center text-slate-500">Access Denied. Admin only.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Disposed Assets"
                subtitle="History of sold, scrapped, and donated equipment."
                breadcrumbs={[{ label: "Assets", href: "/assets" }, { label: "Disposed" }]}
            />

            <div className="card">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-2">Asset Name</th>
                                    <th className="py-3 px-2">Tag / Serial</th>
                                    <th className="py-3 px-2">Disposal Date</th>
                                    <th className="py-3 px-2">Type</th>
                                    <th className="py-3 px-2">Reason / Note</th>
                                    <th className="py-3 px-2">Value / Proceeds</th>
                                    <th className="py-3 px-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={7} className="py-8 text-center text-gray-400">Loading history...</td></tr>
                                ) : assets.length === 0 ? (
                                    <tr><td colSpan={7} className="py-8 text-center text-gray-400">No disposed assets found.</td></tr>
                                ) : (
                                    assets.map((asset) => (
                                        <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                                            <td className="py-3 px-2">
                                                <div className="font-medium text-gray-800">{asset.name}</div>
                                                <div className="text-xs text-gray-400">{asset.category}</div>
                                            </td>
                                            <td className="py-3 px-2 font-mono text-xs text-gray-500">
                                                {asset.tagNumber || asset.serialNumber}
                                            </td>
                                            <td className="py-3 px-2 font-mono text-gray-600">
                                                {new Date(asset.disposalDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className={cn("px-2 py-1 rounded text-xs font-bold", getDisposalBadge(asset.disposalType))}>
                                                    {asset.disposalType || "Other"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-gray-600 max-w-xs truncate" title={asset.disposalReason}>
                                                {asset.disposalReason || "-"}
                                            </td>
                                            <td className="py-3 px-2 font-mono font-medium text-gray-800">
                                                {asset.disposalValue > 0 ? (
                                                    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(asset.disposalValue)
                                                ) : "-"}
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <button
                                                    onClick={() => handleRestoreAsset(asset)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-xs transition-colors"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" /> Restore
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
