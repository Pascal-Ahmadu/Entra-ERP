"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { cn } from "@/lib/utils";

export default function LogisticsPage() {
    const [data, setData] = useState<{ vehicles: any[], shipments: any[] }>({ vehicles: [], shipments: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/ops/logistics")
            .then(res => res.json())
            .then(json => {
                if (json.success) setData(json.data);
                setLoading(false);
            });
    }, []);

    const activeVehicles = data.vehicles.filter(v => v.status === "Active" || v.status === "In Transit").length;
    const inTransitShipments = data.shipments.filter(s => s.status === "In Transit").length;
    const fleetHealth = data.vehicles.length > 0 ? ((activeVehicles / data.vehicles.length) * 100).toFixed(0) : 0;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Logistics & Fleet"
                subtitle="Track shipments, vehicle status, and delivery routes."
                breadcrumbs={[{ label: "Operations", href: "/operations" }, { label: "Logistics" }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Active Fleet"
                    value={loading ? "..." : `${activeVehicles} / ${data.vehicles.length}`}
                    sub="Vehicles on road"
                    icon="truck"
                    color="teal"
                    trend="Healthy"
                />
                <StatCard
                    title="In Transit"
                    value={loading ? "..." : inTransitShipments.toString()}
                    sub="Active Shipments"
                    icon="package"
                    color="orange"
                    trend="On Time"
                />
                <StatCard
                    title="Fleet Health"
                    value={loading ? "..." : fleetHealth + "%"}
                    sub="Operational Status"
                    icon="heart-rate-monitor"
                    color="green"
                    trend="+100%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fleet Overview */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="font-bold text-gray-800 mb-4">Fleet Status</h3>
                            <div className="space-y-4">
                                {loading ? <div className="text-sm text-gray-400">Loading fleet...</div> : data.vehicles.map(v => (
                                    <div key={v.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50">
                                        <div>
                                            <p className="font-bold text-gray-800">{v.plateNumber}</p>
                                            <p className="text-xs text-gray-500">{v.model} • {v.capacity}</p>
                                        </div>
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            v.status === "Active" ? "bg-green-500" :
                                                v.status === "In Transit" ? "bg-orange-500 animate-pulse" : "bg-red-500"
                                        )}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipment Tracker */}
                <div className="lg:col-span-2">
                    <div className="card h-full">
                        <div className="card-body">
                            <h3 className="font-bold text-gray-800 mb-4">Active Shipments</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
                                            <th className="py-2">Tracking ID</th>
                                            <th className="py-2">Route</th>
                                            <th className="py-2">Vehicle</th>
                                            <th className="py-2">ETA</th>
                                            <th className="py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr><td colSpan={5} className="py-4 text-center text-sm">Loading shipments...</td></tr>
                                        ) : data.shipments.map(s => (
                                            <tr key={s.id} className="text-sm group">
                                                <td className="py-3 font-mono font-medium text-orange-600">{s.trackingCode}</td>
                                                <td className="py-3 text-gray-600">{s.origin} <span className="text-gray-300 mx-1">→</span> {s.destination}</td>
                                                <td className="py-3 text-gray-500">{s.vehicle ? s.vehicle.plateNumber : "Not Assigned"}</td>
                                                <td className="py-3 text-gray-500">{s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : "-"}</td>
                                                <td className="py-3">
                                                    <span className={cn(
                                                        "px-2 py-1 rounded text-xs font-bold",
                                                        s.status === "In Transit" ? "bg-teal-50 text-teal-600" :
                                                            s.status === "Delivered" ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
                                                    )}>
                                                        {s.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
