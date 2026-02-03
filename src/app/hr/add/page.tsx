"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { ERPService } from "@/services/api";

export default function AddEmployeePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Personal Profile
        name: "",
        email: "",
        phone: "",
        idType: "National ID (NIN)",
        idNumber: "",
        stateOfOrigin: "Lagos",
        hasPassport: false,
        hasCredentials: false,
        // Step 2: Employment & Pension
        role: "",
        dept: "Operations",
        type: "Full-Time",
        salary: "",
        pfa: "",
        rsa: "",
        // Step 3: Health & Security Trait
        hmo: "Standard Plan",
        bloodGroup: "O+",
        medicalCond: "",
        proofOfLife: "",
        uniqueTrait: "",
        // Step 4: Financials & Emergency
        bank: "Zenith Bank",
        accountNo: "",
        bvn: "",
        nokName: "",
        nokPhone: "",
    });

    const totalSteps = 4;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < totalSteps) {
            setStep(step + 1);
            return;
        }

        setLoading(true);
        try {
            const result = await ERPService.addEmployee(formData);
            if (result.success) {
                router.push("/hr");
            }
        } catch (error) {
            console.error("Failed to enroll employee:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-between mb-6 px-4 relative">
            <div className="absolute top-3.5 left-10 right-10 h-px bg-gray-100 z-0"></div>
            {[1, 2, 3, 4].map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center gap-1">
                    <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all",
                        step === s ? "bg-white border-orange-600 text-orange-600 shadow-md ring-2 ring-orange-50" :
                            step > s ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-gray-200 text-gray-400"
                    )}>
                        {step > s ? <i className="ti ti-check text-sm"></i> : s}
                    </div>
                    <span className={cn(
                        "text-[9px] font-semibold",
                        step === s ? "text-orange-600" : "text-gray-400"
                    )}>
                        {s === 1 ? "Profile" : s === 2 ? "Work" : s === 3 ? "Security" : "Finances"}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-3 max-w-2xl mx-auto pb-8 text-zinc-800">
            <PageHeader
                title="Personnel Onboarding"
                subtitle="Complete the standardized employee enrollment flow."
                breadcrumbs={[{ label: "Personnel", href: "/hr" }, { label: "Enrollment" }]}
            />

            <div className="card shadow-lg border border-gray-100 bg-white rounded-lg overflow-hidden">
                <div className="bg-orange-600 h-1 w-full"></div>
                <div className="card-body p-5 md:p-6">

                    {renderStepIndicator()}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* STEP 1: PERSONAL & IDS */}
                        {step === 1 && (
                            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                                <InputNoLine label="Legal Full Name" placeholder="e.g. Babatunde Lawal" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
                                <div className="grid grid-cols-2 gap-3">
                                    <InputNoLine label="Personal Email" type="email" placeholder="email@ext.ng" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                                    <InputNoLine label="Mobile Number" placeholder="+234..." value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <SelectNoLine label="Identification Type" options={["NIN", "Passport", "Voter's Card"]} value={formData.idType} onChange={(v: string) => setFormData({ ...formData, idType: v })} />
                                    <InputNoLine label="ID / NIN Number" placeholder="Enter ID number" value={formData.idNumber} onChange={(v: string) => setFormData({ ...formData, idNumber: v })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50 mt-1">
                                    <UploadMini label="Passport Photos (3)" status={formData.hasPassport} onUpload={() => setFormData({ ...formData, hasPassport: true })} />
                                    <UploadMini label="Educational Credentials" status={formData.hasCredentials} onUpload={() => setFormData({ ...formData, hasCredentials: true })} />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: EMPLOYMENT & PENSION */}
                        {step === 2 && (
                            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                                <InputNoLine label="Assigned Role" placeholder="e.g. Operations Manager" value={formData.role} onChange={(v: string) => setFormData({ ...formData, role: v })} />
                                <div className="grid grid-cols-2 gap-3">
                                    <SelectNoLine label="Primary Department" options={["Operations", "Finance", "Programs", "HR", "Legal"]} value={formData.dept} onChange={(v: string) => setFormData({ ...formData, dept: v })} />
                                    <InputNoLine label="Annual Salary (₦)" placeholder="0.00" value={formData.salary} onChange={(v: string) => setFormData({ ...formData, salary: v })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <InputNoLine label="PFA (Pension Admin)" placeholder="e.g. Stanbic IBTC" value={formData.pfa} onChange={(v: string) => setFormData({ ...formData, pfa: v })} />
                                    <InputNoLine label="RSA Number" placeholder="PEN..." value={formData.rsa} onChange={(v: string) => setFormData({ ...formData, rsa: v })} />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: MEDICAL & SECURITY (POL) */}
                        {step === 3 && (
                            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                                <div className="grid grid-cols-2 gap-3">
                                    <SelectNoLine label="HMO Plan" options={["Standard Plan", "Executive Plan", "Basic Plan"]} value={formData.hmo} onChange={(v: string) => setFormData({ ...formData, hmo: v })} />
                                    <SelectNoLine label="Blood Group" options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} value={formData.bloodGroup} onChange={(v: string) => setFormData({ ...formData, bloodGroup: v })} />
                                </div>
                                <InputNoLine label="Known Medical Conditions" placeholder="e.g. Allergies, None" value={formData.medicalCond} onChange={(v: string) => setFormData({ ...formData, medicalCond: v })} />
                                <div className="p-3 bg-orange-50/20 rounded-lg border border-orange-100 flex flex-col gap-3 mt-1">
                                    <p className="text-[10px] font-bold text-orange-800">Confidential Security Data</p>
                                    <InputNoLine label="Proof of Life Statement" placeholder="A phrase only you know" value={formData.proofOfLife} onChange={(v: string) => setFormData({ ...formData, proofOfLife: v })} />
                                    <InputNoLine label="Unique Identifying Trait" placeholder="e.g. Scars, Tattoos" value={formData.uniqueTrait} onChange={(v: string) => setFormData({ ...formData, uniqueTrait: v })} />
                                </div>
                            </div>
                        )}

                        {/* STEP 4: FINANCE & EMERGENCY */}
                        {step === 4 && (
                            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                                <div className="grid grid-cols-2 gap-3">
                                    <SelectNoLine label="Payout Bank" options={["Zenith Bank", "Access Bank", "GTBank", "UBA", "First Bank"]} value={formData.bank} onChange={(v: string) => setFormData({ ...formData, bank: v })} />
                                    <InputNoLine label="Account Number" placeholder="10 Digits" value={formData.accountNo} onChange={(v: string) => setFormData({ ...formData, accountNo: v })} />
                                </div>
                                <InputNoLine label="BVN" placeholder="11 Digits" value={formData.bvn} onChange={(v: string) => setFormData({ ...formData, bvn: v })} />
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 mt-1">
                                    <InputNoLine label="Emergency Contact Name" placeholder="Full Name" value={formData.nokName} onChange={(v: string) => setFormData({ ...formData, nokName: v })} />
                                    <InputNoLine label="Emergency Phone" placeholder="+234..." value={formData.nokPhone} onChange={(v: string) => setFormData({ ...formData, nokPhone: v })} />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-2">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg font-semibold hover:bg-gray-50 transition-all text-xs"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-1.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                            >
                                {loading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : (
                                    <>
                                        {step === totalSteps ? "Finish Registration" : "Continue"}
                                        <i className={cn("ti", step === totalSteps ? "ti-check text-sm" : "ti-arrow-right text-sm")}></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

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

function SelectNoLine({ label, value, onChange, options }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 ml-1">{label}</label>
            <div className="bg-gray-50 border border-transparent rounded-lg px-3 py-1.5 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-50 transition-all shadow-sm relative">
                <select
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

function UploadMini({ label, status, onUpload }: any) {
    return (
        <button
            type="button"
            onClick={onUpload}
            className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1.5 py-4 px-4 border border-dashed rounded-lg transition-all",
                status ? "bg-teal-50 border-teal-200 text-teal-600" : "bg-gray-50 border-gray-200 text-gray-400 hover:border-orange-300"
            )}
        >
            <i className={cn("text-xl", status ? "ti ti-circle-check" : "ti ti-upload text-zinc-300")}></i>
            <span className="text-[10px] font-semibold text-center">{label}</span>
        </button>
    );
}