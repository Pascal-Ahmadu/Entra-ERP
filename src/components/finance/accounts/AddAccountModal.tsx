"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Check, ChevronDown, Banknote, CreditCard, Landmark, TrendingUp, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { Account } from "./types";

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accounts: Account[];
}

interface FormData {
    code: string;
    name: string;
    type: string;
    subType: string;
    category: string;
}

interface FormErrors {
    code?: string;
    name?: string;
    type?: string;
}

const ACCOUNT_TYPES = ["Asset", "Liability", "Equity", "Revenue", "Expense"] as const;
type AccountType = typeof ACCOUNT_TYPES[number];

const ACCOUNT_TYPE_ICONS: Record<AccountType, typeof Banknote> = {
    Asset: Banknote,
    Liability: CreditCard,
    Equity: Landmark,
    Revenue: TrendingUp,
    Expense: Receipt
};

export default function AddAccountModal({ isOpen, onClose, onSuccess, accounts }: AddAccountModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<FormData>({
        code: "",
        name: "",
        type: "Asset",
        subType: "",
        category: ""
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen && firstInputRef.current) {
            setTimeout(() => firstInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    const handleClose = () => {
        setFormData({
            code: "",
            name: "",
            type: "Asset",
            subType: "",
            category: ""
        });
        setFormErrors({});
        setIsDropdownOpen(false);
        onClose();
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!formData.code.trim()) {
            errors.code = "Account code is required";
        } else if (accounts.some(acc => acc.code === formData.code.trim())) {
            errors.code = "Account code already exists";
        }

        if (!formData.name.trim()) {
            errors.name = "Account name is required";
        }

        if (!formData.type) {
            errors.type = "Account type is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field as keyof FormErrors]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/finance/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setFormData({
                    code: "",
                    name: "",
                    type: "Asset",
                    subType: "",
                    category: ""
                });
                onSuccess();
            } else {
                setFormErrors({ name: data.error || "Failed to create account" });
            }
        } catch (error) {
            console.error("Error adding account:", error);
            setFormErrors({ name: "Network error. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleClose}
        >
            <div
                ref={modalRef}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 animate-in zoom-in-95 duration-200"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-orange-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Add New Account</h2>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                Create a new account in your chart
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Account Code */}
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Account Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={firstInputRef}
                            type="text"
                            placeholder="e.g., 1000"
                            value={formData.code}
                            onChange={e => handleInputChange("code", e.target.value)}
                            className={cn(
                                "w-full h-10 px-4 bg-slate-50 border rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400",
                                formErrors.code ? "border-red-300 bg-red-50/50" : "border-slate-300"
                            )}
                        />
                        {formErrors.code && (
                            <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                                {formErrors.code}
                            </p>
                        )}
                    </div>

                    {/* Account Name */}
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Account Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Cash at Bank"
                            value={formData.name}
                            onChange={e => handleInputChange("name", e.target.value)}
                            className={cn(
                                "w-full h-10 px-4 bg-slate-50 border rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400",
                                formErrors.name ? "border-red-300 bg-red-50/50" : "border-slate-300"
                            )}
                        />
                        {formErrors.name && (
                            <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                                {formErrors.name}
                            </p>
                        )}
                    </div>

                    {/* Account Type */}
                    <div className="space-y-2" ref={dropdownRef}>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Account Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={cn(
                                    "w-full h-10 px-4 bg-slate-50 border rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all flex items-center justify-between",
                                    isDropdownOpen ? "border-orange-500 ring-2 ring-orange-500/20" : "border-slate-300"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {(() => {
                                        const Icon = ACCOUNT_TYPE_ICONS[formData.type as AccountType];
                                        return <Icon className="w-4 h-4 text-slate-500" />;
                                    })()}
                                    {formData.type}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        "w-4 h-4 text-slate-400 transition-transform",
                                        isDropdownOpen && "rotate-180"
                                    )}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {ACCOUNT_TYPES.map((type) => {
                                        const Icon = ACCOUNT_TYPE_ICONS[type];
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => {
                                                    handleInputChange("type", type);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full px-4 py-3 text-left text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between group",
                                                    formData.type === type
                                                        ? "text-orange-600 bg-orange-50/50"
                                                        : "text-slate-700"
                                                )}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <Icon className="w-4 h-4" />
                                                    {type}
                                                </span>
                                                {formData.type === type && (
                                                    <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sub-Type */}
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Sub-Type <span className="text-slate-400 font-semibold">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Current Asset"
                            value={formData.subType}
                            onChange={e => handleInputChange("subType", e.target.value)}
                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Category <span className="text-slate-400 font-semibold">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Banking"
                            value={formData.category}
                            onChange={e => handleInputChange("category", e.target.value)}
                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                        />
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
