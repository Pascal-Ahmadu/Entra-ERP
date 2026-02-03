"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { Plus, X, Check, ChevronDown, UserPlus, UserRound, Package, Laptop, Armchair, Settings, Car, Calendar, Upload, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AssetInventoryPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";

    const [assets, setAssets] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Register Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
    const [newAsset, setNewAsset] = useState({
        name: "",
        category: "Electronics",
        serialNumber: "",
        tagNumber: "",
        purchaseDate: "",
        purchaseCost: "",
        location: "HQ",
        receiptUrl: ""
    });

    // Assign Modal State
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [currentAsset, setCurrentAsset] = useState<any>(null);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState("");

    const employeeRef = useRef<HTMLDivElement>(null);

    // Disposal Modal State
    const [showDisposalModal, setShowDisposalModal] = useState(false);
    const [disposalData, setDisposalData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: "Sale",
        reason: "",
        value: ""
    });

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (employeeRef.current && !employeeRef.current.contains(event.target as Node)) {
                setIsEmployeeOpen(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [assetRes, empRes] = await Promise.all([
                fetch("/api/ops/assets"),
                fetch("/api/hr")
            ]);

            const assetJson = await assetRes.json();
            const empJson = await empRes.json();

            if (assetJson.success) setAssets(assetJson.data);
            if (empJson.success) setEmployees(empJson.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssignAsset = async () => {
        if (!currentAsset || !selectedEmployee) return;
        try {
            const empName = employees.find(e => e.id.toString() === selectedEmployee)?.name || selectedEmployee;

            const res = await fetch("/api/ops/assets", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentAsset.id,
                    assignedTo: empName,
                    status: "In Use"
                })
            });

            if (res.ok) {
                setShowAssignModal(false);
                fetchData();
                setSelectedEmployee("");
                setCurrentAsset(null);
            }
        } catch (err) {
            console.error("Failed to assign", err);
        }
    };

    const openAssignModal = (asset: any) => {
        setCurrentAsset(asset);
        setShowAssignModal(true);
    };

    const openDisposalModal = (asset: any) => {
        setCurrentAsset(asset);
        setCurrentAsset(asset);
        setDisposalData({ date: new Date().toISOString().split('T')[0], type: "Sale", reason: "", value: "0" });
        setShowDisposalModal(true);
        setShowDisposalModal(true);
    };

    const handleDisposeAsset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentAsset) return;

        try {
            const res = await fetch("/api/ops/assets", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentAsset.id,
                    status: "Disposed",
                    disposalDate: disposalData.date,
                    disposalType: disposalData.type,
                    disposalReason: disposalData.reason,
                    disposalValue: parseFloat(disposalData.value) || 0
                })
            });

            if (res.ok) {
                setShowDisposalModal(false);
                fetchData();
                setCurrentAsset(null);
            }
        } catch (err) {
            console.error("Failed to dispose", err);
        }
    };

    const handleCreateAsset = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/ops/assets", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newAsset, currentValue: newAsset.purchaseCost })
            });
            if (res.ok) {
                setShowAddModal(false);
                fetchData();
                setNewAsset({ name: "", category: "Electronics", serialNumber: "", tagNumber: "", purchaseDate: "", purchaseCost: "", location: "HQ", receiptUrl: "" });
            }
        } catch (err) {
            console.error("Failed to create", err);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Asset Inventory"
                subtitle="Full list of company equipment."
                breadcrumbs={[{ label: "Assets", href: "/assets" }, { label: "Inventory" }]}
                action={
                    <button onClick={() => setShowAddModal(true)} className="btn btn-primary bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Register Asset
                    </button>
                }
            />

            <div className="card">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-2">Asset Name</th>
                                    <th className="py-3 px-2">Category</th>
                                    <th className="py-3 px-2">Serial / Tag</th>
                                    <th className="py-3 px-2">Assigned To</th>
                                    <th className="py-3 px-2">Location</th>
                                    <th className="py-3 px-2">Value</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={8} className="py-8 text-center text-gray-400">Loading registry...</td></tr>
                                ) : assets.filter(a => a.status !== 'Disposed').map((asset) => (
                                    <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                                        <td className="py-3 px-2 font-medium text-gray-800">{asset.name}</td>
                                        <td className="py-3 px-2 text-gray-500">{asset.category}</td>
                                        <td className="py-3 px-2 font-mono text-xs">
                                            <div className="flex flex-col">
                                                <span>{asset.serialNumber}</span>
                                                {asset.tagNumber && <span className="text-gray-400">{asset.tagNumber}</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-gray-600">
                                            {asset.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                                                        {asset.assignedTo.charAt(0)}
                                                    </span>
                                                    {asset.assignedTo}
                                                </div>
                                            ) : <span className="text-gray-400 italic">Unassigned</span>}
                                        </td>
                                        <td className="py-3 px-2 text-gray-500">{asset.location}</td>
                                        <td className="py-3 px-2 font-mono text-gray-800">
                                            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(asset.currentValue)}
                                        </td>
                                        <td className="py-3 px-2">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-bold",
                                                asset.status === "In Use" ? "bg-teal-50 text-teal-600" :
                                                    asset.status === "Available" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                                            )}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2">
                                            {asset.status === "Available" ? (
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openAssignModal(asset)} className="text-xs text-orange-600 hover:text-orange-800 font-bold underline">
                                                        Assign
                                                    </button>
                                                    {isAdmin && (
                                                        <button onClick={() => openDisposalModal(asset)} className="text-xs text-red-500 hover:text-red-700 font-bold underline" title="Dispose Asset">
                                                            Dispose
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                isAdmin && asset.status !== "Disposed" && (
                                                    <button onClick={() => openDisposalModal(asset)} className="text-xs text-red-500 hover:text-red-700 font-bold underline">
                                                        Dispose
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Asset Modal */}
            {
                showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-orange-50/30 sticky top-0 bg-white z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900">Register New Asset</h2>
                                        <p className="text-xs font-semibold text-slate-500 mt-0.5">Add equipment to company registry</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAsset} className="p-6 space-y-5">
                                {/* Asset Name */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                        Asset Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                        value={newAsset.name}
                                        onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                                        placeholder="e.g. MacBook Pro M3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                            Category
                                        </label>
                                        <div className="relative" ref={categoryRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                                className={cn(
                                                    "w-full h-10 px-4 bg-slate-50 border rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all flex items-center justify-between",
                                                    isCategoryOpen ? "border-orange-500 ring-2 ring-orange-500/20" : "border-slate-300"
                                                )}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {newAsset.category === 'Electronics' && <Laptop className="w-4 h-4 text-slate-500" />}
                                                    {newAsset.category === 'Furniture' && <Armchair className="w-4 h-4 text-slate-500" />}
                                                    {newAsset.category === 'Machinery' && <Settings className="w-4 h-4 text-slate-500" />}
                                                    {newAsset.category === 'Vehicle' && <Car className="w-4 h-4 text-slate-500" />}
                                                    {newAsset.category}
                                                </span>
                                                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isCategoryOpen && "rotate-180")} />
                                            </button>

                                            {isCategoryOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {['Electronics', 'Furniture', 'Machinery', 'Vehicle'].map((cat) => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => {
                                                                setNewAsset({ ...newAsset, category: cat });
                                                                setIsCategoryOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-3 text-left text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between group ${newAsset.category === cat ? 'text-orange-600 bg-orange-50/50' : 'text-slate-700'}`}
                                                        >
                                                            <span className="flex items-center gap-3">
                                                                {cat === 'Electronics' && <Laptop className="w-4 h-4" />}
                                                                {cat === 'Furniture' && <Armchair className="w-4 h-4" />}
                                                                {cat === 'Machinery' && <Settings className="w-4 h-4" />}
                                                                {cat === 'Vehicle' && <Car className="w-4 h-4" />}
                                                                {cat}
                                                            </span>
                                                            {newAsset.category === cat && <Check className="w-4 h-4 text-orange-600" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                            Serial Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                            value={newAsset.serialNumber}
                                            onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                                            placeholder="S/N 123456"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                            Tag Number
                                        </label>
                                        <input
                                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                            value={newAsset.tagNumber}
                                            onChange={e => setNewAsset({ ...newAsset, tagNumber: e.target.value })}
                                            placeholder="TAG-001"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                            Purchase Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className={cn(
                                                "w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold flex items-center justify-between",
                                                !newAsset.purchaseDate ? "text-slate-400 font-medium" : "text-slate-900"
                                            )}>
                                                {newAsset.purchaseDate || "Select Date"}
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="date"
                                                required
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                value={newAsset.purchaseDate}
                                                onChange={e => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                            Cost (NGN) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                            value={newAsset.purchaseCost}
                                            onChange={e => setNewAsset({ ...newAsset, purchaseCost: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                            Location
                                        </label>
                                        <input
                                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                            value={newAsset.location}
                                            onChange={e => setNewAsset({ ...newAsset, location: e.target.value })}
                                            placeholder="e.g. Lagos HQ, Remote"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                        Upload Receipt
                                    </label>
                                    <div className="relative group">
                                        <div className="w-full h-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer group-hover:border-orange-500 group-hover:bg-orange-50/10 transition-all">
                                            <Upload className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                                            <span className="text-sm font-semibold text-slate-500 group-hover:text-orange-600 truncate">
                                                {newAsset.receiptUrl ? newAsset.receiptUrl.split('\\').pop() : "Click to upload receipt (PDF/IMG)"}
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={e => setNewAsset({ ...newAsset, receiptUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Register Asset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                )
            }

            {/* Assign Asset Modal */}
            {
                showAssignModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-in zoom-in-95 overflow-visible">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-orange-50/30 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900">Assign Asset</h2>
                                        <p className="text-xs font-semibold text-slate-500 mt-0.5">Assign <b>{currentAsset?.name}</b> to an employee</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <label className="flex flex-col gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                                    Select Employee
                                    <div className="relative" ref={employeeRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsEmployeeOpen(!isEmployeeOpen)}
                                            className={cn(
                                                "w-full h-10 px-4 bg-slate-50 border rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all flex items-center justify-between",
                                                isEmployeeOpen ? "border-orange-500 ring-2 ring-orange-500/20" : "border-slate-300"
                                            )}
                                        >
                                            <span className="truncate">
                                                {selectedEmployee
                                                    ? employees.find(e => e.id.toString() === selectedEmployee)?.name + ` (${employees.find(e => e.id.toString() === selectedEmployee)?.dept})`
                                                    : "-- Choose Employee --"}
                                            </span>
                                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isEmployeeOpen && "rotate-180")} />
                                        </button>

                                        {isEmployeeOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-y-auto max-h-60 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {employees.map((emp) => (
                                                    <button
                                                        key={emp.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedEmployee(emp.id.toString());
                                                            setIsEmployeeOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-3 text-left text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between group ${selectedEmployee === emp.id.toString() ? 'text-orange-600 bg-orange-50/50' : 'text-slate-700'}`}
                                                    >
                                                        <div>
                                                            <div className="font-bold">{emp.name}</div>
                                                            <div className="text-xs text-slate-400 font-medium">{emp.dept}</div>
                                                        </div>
                                                        {selectedEmployee === emp.id.toString() && <Check className="w-4 h-4 text-orange-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </label>

                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        onClick={() => setShowAssignModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAssignAsset}
                                        disabled={!selectedEmployee}
                                        className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <UserRound className="w-4 h-4" /> Assign
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {showDisposalModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-in zoom-in-95 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Dispose Asset</h2>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Mark <b>{currentAsset?.name}</b> as disposed</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDisposalModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleDisposeAsset} className="p-6 space-y-5">
                            <div className="p-3 bg-red-50 rounded-lg flex gap-3 items-start">
                                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-700 font-medium leading-relaxed">
                                    This action will mark the asset as <b>Disposed</b> and remove it from active inventory. Historic records will be preserved.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Disposal Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    value={disposalData.date}
                                    onChange={e => setDisposalData({ ...disposalData, date: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Disposal Type</label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full h-10 pl-4 pr-10 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 appearance-none"
                                        value={disposalData.type}
                                        onChange={e => setDisposalData({ ...disposalData, type: e.target.value })}
                                    >
                                        <option value="Sale">Sale / Revenue</option>
                                        <option value="Scrap">Scrap / Write-off</option>
                                        <option value="Donation">Charity / Donation</option>
                                        <option value="Lost">Lost / Stolen</option>
                                        <option value="Damaged">Damaged Beyond Repair</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Data / Reason</label>
                                <textarea
                                    required
                                    className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none placeholder:font-medium placeholder:text-slate-400"
                                    placeholder="e.g. End of life, Damaged beyond repair, Sold"
                                    value={disposalData.reason}
                                    onChange={e => setDisposalData({ ...disposalData, reason: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Disposal Value / Scrapped Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">NGN</span>
                                    <input
                                        type="number"
                                        className="w-full h-10 pl-12 pr-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        placeholder="0.00"
                                        value={disposalData.value}
                                        onChange={e => setDisposalData({ ...disposalData, value: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                <button type="button" onClick={() => setShowDisposalModal(false)} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-xs uppercase tracking-wider">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" /> Confirm Disposal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
