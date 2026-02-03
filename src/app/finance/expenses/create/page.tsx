"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus, Trash2, Send, Loader2,
    ChevronLeft, Upload, FileText,
    AlertCircle, DollarSign, Building,
    User, Mail, Tag, Receipt
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Travel", "Office Supplies", "Meals", "Equipment", "Software", "Maintenance", "Other"];
const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Product"];

export default function CreateExpensePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        staffName: "",
        staffEmail: "",
        department: "",
        category: "Other",
        amount: "",
        description: "",
        purpose: "",
        attachments: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/finance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/finance/expenses");
                router.refresh();
            } else {
                alert("Failed to create expense request");
            }
        } catch (error) {
            console.error("Error creating expense:", error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 -m-6 mb-6 border-b border-gray-100 shadow-sm">
                <PageHeader
                    title="New Expense Request"
                    subtitle="Submit a reimbursement request for business-related expenses."
                    breadcrumbs={[
                        { label: "Finance", href: "/finance" },
                        { label: "Expenses", href: "/finance/expenses" },
                        { label: "Create" }
                    ]}
                />
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                        <div className="p-1 bg-orange-600 w-full"></div>
                        <div className="p-8 space-y-8">
                            {/* Personal Info */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <User className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Requester Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label="Full Name"
                                        name="staffName"
                                        placeholder="Enter your full name"
                                        icon={<User className="w-4 h-4" />}
                                        value={formData.staffName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FormInput
                                        label="Corporate Email"
                                        name="staffEmail"
                                        type="email"
                                        placeholder="email@company.com"
                                        icon={<Mail className="w-4 h-4" />}
                                        value={formData.staffEmail}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FormSelect
                                        label="Department"
                                        name="department"
                                        options={DEPARTMENTS}
                                        icon={<Building className="w-4 h-4" />}
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FormSelect
                                        label="Expense Category"
                                        name="category"
                                        options={CATEGORIES}
                                        icon={<Tag className="w-4 h-4" />}
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </section>

                            <div className="h-px bg-gray-100" />

                            {/* Expense Details */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <DollarSign className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Financial Details</h3>
                                </div>
                                <div className="space-y-6">
                                    <FormInput
                                        label="Amount (₦)"
                                        name="amount"
                                        type="number"
                                        placeholder="0.00"
                                        icon={<span className="font-bold text-xs uppercase">NGN</span>}
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        className="text-lg font-mono font-bold"
                                    />
                                    <FormTextarea
                                        label="Detailed Description"
                                        name="description"
                                        placeholder="What was this expense for? (e.g. Flight ticket to Abuja for Client Meeting)"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FormInput
                                        label="Business Purpose"
                                        name="purpose"
                                        placeholder="e.g. Sales Growth / Infrastructure Maintenance"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </section>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-10 py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-xl shadow-orange-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting Request...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Submit Expense Report
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                            </div>
                            <h4 className="font-bold text-gray-900">Submission Guidelines</h4>
                        </div>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li className="flex gap-3">
                                <span className="shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                                Ensure all fields are filled accurately to avoid delays in processing.
                            </li>
                            <li className="flex gap-3">
                                <span className="shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                                Your request will go through HOD, Finance, and COE approval levels.
                            </li>
                            <li className="flex gap-3">
                                <span className="shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                                Keep your physical receipts as they may be required for auditing.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-linear-to-br from-orange-600 to-orange-700 p-8 rounded-2xl text-white shadow-lg shadow-orange-100 overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Receipt className="w-32 h-32 rotate-12" />
                        </div>
                        <h4 className="font-bold mb-4 relative z-10">Document Upload</h4>
                        <p className="text-orange-50 text-xs mb-6 leading-relaxed relative z-10 opacity-90">
                            Attach your receipts or invoices to support your claim. PDF, JPG, or PNG files only.
                        </p>
                        <button
                            type="button"
                            className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Receipts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function FormInput({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors">
                    {icon}
                </div>
                <input
                    {...props}
                    className={cn(
                        "w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm transition-all outline-none",
                        "focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10",
                        props.className
                    )}
                />
            </div>
        </div>
    );
}

function FormSelect({ label, icon, options, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors pointer-events-none">
                    {icon}
                </div>
                <select
                    {...props}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm appearance-none transition-all outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                >
                    <option value="" disabled>Select {label.toLowerCase()}</option>
                    {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Plus className="w-3 h-3 rotate-45" />
                </div>
            </div>
        </div>
    );
}

function FormTextarea({ label, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <textarea
                {...props}
                rows={4}
                className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl text-sm transition-all outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 resize-none"
            />
        </div>
    );
}
