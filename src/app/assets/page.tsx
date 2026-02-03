"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { Package, Plus, UserPlus, FileSpreadsheet, List } from "lucide-react";

export default function AssetsDashboard() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/ops/assets");
                const json = await res.json();
                if (json.success) setAssets(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalValue = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
    const assignedCount = assets.filter(a => a.assignedTo).length;
    const utilization = assets.length > 0 ? (assignedCount / assets.length) * 100 : 0;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Asset Management"
                subtitle="Overview of company assets, value, and assignments."
                breadcrumbs={[{ label: "Assets" }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Value"
                    value={loading ? "..." : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(totalValue)}
                    icon="businessplan"
                    color="teal"
                    trend="+2.5%"
                />
                <StatCard
                    title="Total Assets"
                    value={loading ? "..." : assets.length.toString()}
                    icon="box"
                    color="orange"
                    trend="+1"
                />
                <StatCard
                    title="Utilization"
                    value={loading ? "..." : utilization.toFixed(1) + "%"}
                    icon="activity"
                    color="blue"
                    trend={utilization > 80 ? "High" : "Normal"}
                />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-2">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/assets/inventory" className="card hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-blue-500">
                    <div className="card-body flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <List className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg">Asset Inventory</h4>
                            <p className="text-sm text-gray-500">View and manage full asset list.</p>
                        </div>
                    </div>
                </Link>

                <Link href="/assets/inventory" className="card hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-orange-500">
                    <div className="card-body flex items-center gap-4">
                        <div className="p-3 rounded-full bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg">Register Asset</h4>
                            <p className="text-sm text-gray-500">Add new equipment via modal.</p>
                        </div>
                    </div>
                </Link>

                <Link href="/assets/assignments" className="card hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-teal-500">
                    <div className="card-body flex items-center gap-4">
                        <div className="p-3 rounded-full bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg">Assignments</h4>
                            <p className="text-sm text-gray-500">Manage employee handouts.</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
