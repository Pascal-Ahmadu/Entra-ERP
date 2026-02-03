"use client";

import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

const orders = [
    { id: "PO-2026-001", vendor: "Global Supplies Ltd", date: "Jan 30, 2026", total: "$4,250", status: "Pending Approval" },
    { id: "PO-2026-002", vendor: "Tech Components Inc", date: "Jan 28, 2026", total: "$45,800", status: "Shipped" },
    { id: "PO-2026-003", vendor: "Office Depot", date: "Jan 27, 2026", total: "$840", status: "Delivered" },
    { id: "PO-2026-004", vendor: "Logistics Pro", date: "Jan 25, 2026", total: "$2,100", status: "Processing" },
];

export default function ProcurementPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Procurement & Inventory"
                subtitle="Manage vendors, purchase orders, and stock levels."
                breadcrumbs={[{ label: "Procurement" }]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Recent Purchase Orders</h3>
                                <button className="text-orange-600 text-sm font-bold hover:underline">New Purchase Order +</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <th className="px-4 py-3 text-center">S/N</th>
                                            <th className="px-4 py-3">Order ID</th>
                                            <th className="px-4 py-3">Vendor</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Total</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center opacity-30">
                                                <i className="ti ti-shopping-cart-off text-6xl"></i>
                                                <p className="text-lg font-bold mt-2">No Purchase Orders</p>
                                                <p className="text-sm">New procurement requests will appear here.</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 font-mono">Stock Alerts</h3>
                                <div className="flex flex-col gap-4">
                                    <StockItem name="Laptop - MacBook Pro" stock={2} min={5} status="Low Stock" />
                                    <StockItem name="Desk Chairs" stock={45} min={10} status="Sufficient" />
                                    <StockItem name="Monitors 27\" stock={0} min={8} status="Out of Stock" />
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Top Vendors</h3>
                                <div className="flex flex-col gap-4">
                                    <VendorItem name="Global Supplies" orders={42} spend="$1.2M" />
                                    <VendorItem name="Tech Components" orders={28} spend="$850K" />
                                    <VendorItem name="Office Depot" orders={15} spend="$450K" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="card bg-gray-900 text-white overflow-hidden">
                        <div className="card-body p-6 relative">
                            <h4 className="text-xl font-bold mb-4">Inventory Value</h4>
                            <p className="text-3xl font-mono text-teal-400">$3.84M</p>
                            <p className="text-xs text-gray-400 mt-2 font-medium">+2.5% from last month</p>
                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex justify-between text-xs font-bold border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 uppercase">Total Items</span>
                                    <span>45,402</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold border-b border-gray-800 pb-2">
                                    <span className="text-gray-500 uppercase">Categories</span>
                                    <span>24</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold border-b border-gray-800 pb-1">
                                    <span className="text-gray-500 uppercase">Warehouses</span>
                                    <span>3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StockItem({ name, stock, min, status }: any) {
    return (
        <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded border border-gray-100 select-none hover:border-orange-100 transition-all">
            <div>
                <p className="text-sm font-bold text-gray-700">{name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase italic">Stock: {stock} / Min: {min}</p>
            </div>
            <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
                status === "Out of Stock" ? "bg-red-500 text-white shadow-sm" :
                    status === "Low Stock" ? "bg-yellow-100 text-yellow-600" :
                        "bg-teal-100 text-teal-600"
            )}>{status}</span>
        </div>
    );
}

function VendorItem({ name, orders, spend }: any) {
    return (
        <div className="flex justify-between items-center group">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-orange-50 text-orange-600 rounded flex items-center justify-center font-bold text-xs uppercase group-hover:bg-orange-600 group-hover:text-white transition-all">{name[0]}</div>
                <div>
                    <p className="text-sm font-bold text-gray-700">{name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{orders} Orders</p>
                </div>
            </div>
            <span className="text-sm font-bold text-gray-800">{spend}</span>
        </div>
    );
}
