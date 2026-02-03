"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { UserMinus, Search, UserPlus } from "lucide-react";

export default function AssetAssignmentsPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ops/assets");
            const json = await res.json();
            if (json.success) {
                // Filter only assigned assets
                const assigned = json.data.filter((a: any) => a.status === "In Use" || a.assignedTo);
                setAssets(assigned);
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

    const handleReturnAsset = async (asset: any) => {
        if (!confirm(`Are you sure you want to unassign ${asset.name} from ${asset.assignedTo}?`)) return;

        try {
            const res = await fetch("/api/ops/assets", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: asset.id,
                    assignedTo: null,
                    status: "Available"
                })
            });

            if (res.ok) {
                fetchData();
            }
        } catch (err) {
            console.error("Failed to return asset", err);
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Asset Assignments"
                subtitle="Track equipment currently in use by employees."
                breadcrumbs={[{ label: "Assets", href: "/assets" }, { label: "Assignments" }]}
                action={
                    <Link href="/assets/inventory" className="btn btn-primary bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> New Assignment
                    </Link>
                }
            />

            <div className="card">
                <div className="card-body">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search employee or asset..."
                                className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-2">Employee</th>
                                    <th className="py-3 px-2">Asset Name</th>
                                    <th className="py-3 px-2">Category</th>
                                    <th className="py-3 px-2">Serial / Tag</th>
                                    <th className="py-3 px-2">Location</th>
                                    <th className="py-3 px-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading assignments...</td></tr>
                                ) : filteredAssets.length === 0 ? (
                                    <tr><td colSpan={6} className="py-8 text-center text-gray-400">No active assignments found.</td></tr>
                                ) : filteredAssets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold border border-orange-200">
                                                    {asset.assignedTo?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-800">{asset.assignedTo}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 font-medium text-gray-600">{asset.name}</td>
                                        <td className="py-3 px-2 text-gray-500">{asset.category}</td>
                                        <td className="py-3 px-2 font-mono text-xs text-gray-500">
                                            {asset.tagNumber || asset.serialNumber}
                                        </td>
                                        <td className="py-3 px-2 text-gray-500">{asset.location}</td>
                                        <td className="py-3 px-2 text-right">
                                            <button
                                                onClick={() => handleReturnAsset(asset)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-xs font-bold transition-colors"
                                                title="Return Asset"
                                            >
                                                <UserMinus className="w-3.5 h-3.5" /> Return
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
