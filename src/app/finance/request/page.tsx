"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewExpenseRequestPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        staffName: "",
        staffEmail: "",
        department: "Engineering",
        category: "Travel",
        amount: "",
        purpose: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/finance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push("/finance");
            }
        } catch (error) {
            console.error("Error creating expense:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 max-w-2xl mx-auto pb-8 text-zinc-800 p-8">
            {/* Header */}
            <div className="mb-4">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/finance" className="hover:text-orange-600 hover:underline transition-colors flex items-center gap-1">
                        Finance
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-orange-600 font-bold">New Request</span>
                </nav>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">New Expense Request</h1>
                        <p className="text-xs text-gray-400 font-medium mt-1 tracking-wide">
                            Submit for HOD → Finance → COE approval
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="card shadow-lg border border-gray-100 bg-white rounded-lg overflow-hidden">
                <div className="bg-orange-600 h-1 w-full"></div>
                <div className="card-body p-5 md:p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Staff Information */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-xs">1</span>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">Staff Information</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <InputNoLine
                                    label="Full Name"
                                    placeholder="Your full name"
                                    value={formData.staffName}
                                    onChange={(v: string) => setFormData({ ...formData, staffName: v })}
                                />
                                <InputNoLine
                                    label="Email Address"
                                    type="email"
                                    placeholder="your.email@company.com"
                                    value={formData.staffEmail}
                                    onChange={(v: string) => setFormData({ ...formData, staffEmail: v })}
                                />
                            </div>
                        </div>

                        {/* Expense Details */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                                    <span className="text-teal-600 font-bold text-xs">2</span>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">Expense Details</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <SelectNoLine
                                    label="Department"
                                    value={formData.department}
                                    onChange={(v: string) => setFormData({ ...formData, department: v })}
                                    options={["Engineering", "Operations", "HR", "Finance", "Marketing", "Product", "Sales"]}
                                />
                                <SelectNoLine
                                    label="Category"
                                    value={formData.category}
                                    onChange={(v: string) => setFormData({ ...formData, category: v })}
                                    options={["Travel", "Equipment", "Training", "Office Supplies", "Entertainment", "Software", "Other"]}
                                />
                            </div>

                            <InputNoLine
                                label="Amount (₦)"
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(v: string) => setFormData({ ...formData, amount: v })}
                            />

                            <InputNoLine
                                label="Purpose"
                                placeholder="Brief summary of expense purpose"
                                value={formData.purpose}
                                onChange={(v: string) => setFormData({ ...formData, purpose: v })}
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-xs">3</span>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">Additional Information</h3>
                            </div>

                            <TextAreaNoLine
                                label="Description"
                                placeholder="Provide a detailed description of the expense, including justification and any relevant details..."
                                value={formData.description}
                                onChange={(v: string) => setFormData({ ...formData, description: v })}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6 border-t border-gray-100 mt-2">
                            <Link
                                href="/finance"
                                className="flex-1 px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors text-center text-sm"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    "flex-1 px-5 py-2.5 bg-orange-600 text-white rounded-lg font-semibold shadow-md transition-all text-sm flex items-center justify-center gap-2",
                                    isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
                                )}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Request
                                        <i className="ti ti-check text-sm"></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-xs">
                    <FileText className="w-4 h-4" />
                    Approval Workflow
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                    Your request will go through a 3-level approval process:
                    <strong> HOD → Finance → COE</strong>. You'll be notified at each stage.
                </p>
            </div>
        </div>
    );
}

// Custom Input Component (matching HR add employee style)
function InputNoLine({ label, type = "text", placeholder, value, onChange }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 ml-1">{label}</label>
            <div className="bg-gray-50 border border-transparent rounded-lg px-3 py-1.5 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-50 transition-all shadow-sm">
                <input
                    required
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none outline-none font-semibold text-zinc-900 placeholder:text-zinc-300 placeholder:font-normal text-xs"
                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}

// Custom Select Component (matching HR add employee style)
function SelectNoLine({ label, value, onChange, options }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 ml-1">{label}</label>
            <div className="bg-gray-50 border border-transparent rounded-lg px-3 py-1.5 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-50 transition-all shadow-sm relative">
                <select
                    required
                    className="w-full bg-transparent border-none outline-none font-semibold text-zinc-900 cursor-pointer text-xs appearance-none"
                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map((opt: string) => <option key={opt}>{opt}</option>)}
                </select>
                <i className="ti ti-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]"></i>
            </div>
        </div>
    );
}

// Custom TextArea Component (matching the input style)
function TextAreaNoLine({ label, placeholder, value, onChange }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 ml-1">{label}</label>
            <div className="bg-gray-50 border border-transparent rounded-lg px-3 py-2 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-50 transition-all shadow-sm">
                <textarea
                    required
                    rows={5}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none outline-none font-semibold text-zinc-900 placeholder:text-zinc-300 placeholder:font-normal text-xs resize-none"
                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
