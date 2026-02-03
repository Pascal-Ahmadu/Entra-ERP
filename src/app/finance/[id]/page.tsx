"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText, User, DollarSign, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ExpenseRequest {
    id: number;
    requestNumber: string;
    staffName: string;
    staffEmail: string;
    department: string;
    category: string;
    amount: number;
    description: string;
    purpose: string;
    status: string;
    hodApproval: string | null;
    hodApprovedBy: string | null;
    hodApprovedAt: string | null;
    hodComments: string | null;
    financeApproval: string | null;
    financeApprovedBy: string | null;
    financeApprovedAt: string | null;
    financeComments: string | null;
    coeApproval: string | null;
    coeApprovedBy: string | null;
    coeApprovedAt: string | null;
    coeComments: string | null;
    finalStatus: string;
    createdAt: string;
}

export default function ExpenseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [expense, setExpense] = useState<ExpenseRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [approverRole, setApproverRole] = useState<"HOD" | "Finance" | "COE">("HOD");
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState<"Approved" | "Rejected">("Approved");
    const [comments, setComments] = useState("");
    const [approverName, setApproverName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchExpense();
    }, []);

    const fetchExpense = async () => {
        try {
            const response = await fetch("/api/finance");
            const data = await response.json();
            if (data.success) {
                const exp = data.data.find((e: ExpenseRequest) => e.id === parseInt(params.id as string));
                setExpense(exp);
            }
        } catch (error) {
            console.error("Error fetching expense:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async () => {
        if (!approverName.trim()) {
            alert("Please enter your name");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch("/api/finance", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: expense?.id,
                    level: approverRole,
                    action: actionType,
                    approver: approverName,
                    comments: comments,
                }),
            });

            if (response.ok) {
                setShowActionModal(false);
                fetchExpense();
                setComments("");
                setApproverName("");
            }
        } catch (error) {
            console.error("Error processing approval:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string | null) => {
        if (status === "Approved") return "text-teal-600 bg-teal-50";
        if (status === "Rejected") return "text-red-600 bg-red-50";
        return "text-yellow-600 bg-yellow-50";
    };

    const getStatusIcon = (status: string | null) => {
        if (status === "Approved") return <CheckCircle2 className="w-5 h-5" />;
        if (status === "Rejected") return <XCircle className="w-5 h-5" />;
        return <Clock className="w-5 h-5" />;
    };

    const canApprove = (level: "HOD" | "Finance" | "COE") => {
        if (!expense) return false;

        if (level === "HOD" && expense.status === "Pending HOD") return true;
        if (level === "Finance" && expense.status === "Pending Finance") return true;
        if (level === "COE" && expense.status === "Pending COE") return true;

        return false;
    };

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (!expense) {
        return (
            <div className="p-8 max-w-4xl mx-auto text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Expense request not found</p>
                <Link href="/finance" className="text-orange-600 hover:underline mt-4 inline-block">
                    Back to Finance
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/finance" className="hover:text-orange-600 hover:underline transition-colors flex items-center gap-1">
                        Finance
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-medium">Expense Details</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-orange-600 font-bold">{expense.requestNumber}</span>
                </nav>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{expense.requestNumber}</h1>
                        <p className="text-sm text-gray-400 font-medium mt-1">
                            Submitted {new Date(expense.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold",
                        getStatusColor(expense.finalStatus)
                    )}>
                        {expense.status}
                    </span>
                </div>
            </div>

            {/* Approval Timeline */}
            <div className="card">
                <div className="card-body p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Approval Workflow</h2>
                    <div className="space-y-4">
                        {/* HOD */}
                        <ApprovalStep
                            title="Head of Department"
                            status={expense.hodApproval || "Pending"}
                            approver={expense.hodApprovedBy}
                            date={expense.hodApprovedAt}
                            comments={expense.hodComments}
                        />

                        {/* Finance */}
                        <ApprovalStep
                            title="Finance Team"
                            status={expense.financeApproval || "Pending"}
                            approver={expense.financeApprovedBy}
                            date={expense.financeApprovedAt}
                            comments={expense.financeComments}
                        />

                        {/* COE */}
                        <ApprovalStep
                            title="Chief Operating Executive"
                            status={expense.coeApproval || "Pending"}
                            approver={expense.coeApprovedBy}
                            date={expense.coeApprovedAt}
                            comments={expense.coeComments}
                        />
                    </div>
                </div>
            </div>

            {/* Expense Details */}
            <div className="grid grid-cols-2 gap-6">
                <div className="card">
                    <div className="card-body p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-orange-600" />
                            Requestor Information
                        </h3>
                        <div className="space-y-3">
                            <InfoRow label="Name" value={expense.staffName} />
                            <InfoRow label="Email" value={expense.staffEmail} />
                            <InfoRow label="Department" value={expense.department} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-orange-600" />
                            Expense Details
                        </h3>
                        <div className="space-y-3">
                            <InfoRow label="Category" value={expense.category} />
                            <InfoRow label="Amount" value={`₦${expense.amount.toLocaleString()}`} emphasis />
                            <InfoRow label="Purpose" value={expense.purpose} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="card">
                <div className="card-body p-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Description</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{expense.description}</p>
                </div>
            </div>

            {/* Approval Actions */}
            <div className="card border-2 border-orange-100">
                <div className="card-body p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Take Action</h3>

                    {/* Role Selector - Simulation Mode */}
                    <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                                Dev / Test Mode
                            </div>
                            <p className="text-xs text-orange-800 font-medium">
                                Simulate different approvers to test the workflow:
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {(["HOD", "Finance", "COE"] as const).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setApproverRole(role)}
                                    className={cn(
                                        "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all border",
                                        approverRole === role
                                            ? "bg-orange-600 border-orange-600 text-black shadow-md ring-2 ring-orange-200 ring-offset-1 font-bold"
                                            : "bg-white border-orange-200 text-orange-700 hover:bg-orange-50"
                                    )}
                                >
                                    Act as {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {/* Action Buttons */}
                    {canApprove(approverRole) ? (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setActionType("Approved");
                                    setShowActionModal(true);
                                }}
                                className="flex-1 px-6 py-3 bg-orange-600 text-black rounded-lg hover:bg-orange-700 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Approve Request
                            </button>
                            <button
                                onClick={() => {
                                    setActionType("Rejected");
                                    setShowActionModal(true);
                                }}
                                className="flex-1 px-6 py-3 bg-red-600 text-black border-2 border-black rounded-lg hover:bg-red-700 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                            >
                                <XCircle className="w-5 h-5" />
                                Decline Request
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-center space-y-2">
                            <Clock className="w-8 h-8 text-gray-400 mx-auto" />
                            <p className="text-gray-900 font-semibold">
                                No Actions Available for {approverRole}
                            </p>
                            <p className="text-sm text-gray-600">
                                {expense.status.includes("Rejected")
                                    ? "This request has been rejected and closed."
                                    : expense.finalStatus === "Approved"
                                        ? "This request has already been fully approved."
                                        : `This request is currently waiting for ${expense.status.replace("Pending ", "")}.`
                                }
                            </p>
                            {/* Smart Hint */}
                            {!expense.status.includes("Rejected") && expense.finalStatus !== "Approved" && (
                                <p className="text-xs text-blue-600 bg-blue-50 py-1 px-3 rounded-full inline-block mt-2 font-medium">
                                    💡 Tip: Click "Act as {expense.status.replace("Pending ", "")}" above to see buttons.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Modal */}
            {showActionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {actionType === "Approved" ? "Approve" : "Decline"} Request
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {expense.requestNumber} - ₦{expense.amount.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <InputNoLine
                                    label={<span>Your Name <span className="text-red-500">*</span></span>}
                                    placeholder="Enter your full name"
                                    value={approverName}
                                    onChange={(v: string) => setApproverName(v)}
                                />
                            </div>

                            <div>
                                <TextAreaNoLine
                                    label="Comments (Optional)"
                                    placeholder="Add any comments or notes..."
                                    value={comments}
                                    onChange={(v: string) => setComments(v)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowActionModal(false);
                                        setComments("");
                                        setApproverName("");
                                    }}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApproval}
                                    disabled={submitting || !approverName.trim()}
                                    className={cn(
                                        "flex-1 px-6 py-3 text-black rounded-lg font-bold transition-all",
                                        actionType === "Approved" ? "bg-orange-600 hover:bg-orange-700" : "bg-red-600 hover:bg-red-700",
                                        (submitting || !approverName.trim()) && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {submitting ? "Processing..." : `Confirm ${actionType === "Approved" ? "Approval" : "Decline"}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ApprovalStep({ title, status, approver, date, comments }: any) {
    const getStatusColor = (status: string) => {
        if (status === "Approved") return "border-teal-200 bg-teal-50";
        if (status === "Rejected") return "border-red-200 bg-red-50";
        return "border-yellow-200 bg-yellow-50";
    };

    const getIcon = (status: string) => {
        if (status === "Approved") return <CheckCircle2 className="w-5 h-5 text-teal-600" />;
        if (status === "Rejected") return <XCircle className="w-5 h-5 text-red-600" />;
        return <Clock className="w-5 h-5 text-yellow-600" />;
    };

    return (
        <div className={cn("border-2 rounded-lg p-4", getStatusColor(status))}>
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    {getIcon(status)}
                    <div>
                        <h4 className="font-bold text-sm text-gray-900">{title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                            {status === "Pending" ? "Awaiting decision" : `${status} by ${approver}`}
                        </p>
                        {date && (
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(date).toLocaleString()}
                            </p>
                        )}
                        {comments && (
                            <div className="mt-2 p-2 bg-white/50 rounded border border-gray-200">
                                <p className="text-xs text-gray-700 italic flex items-start gap-1">
                                    <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    {comments}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold",
                    status === "Approved" ? "bg-teal-100 text-teal-700" :
                        status === "Rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                )}>
                    {status}
                </span>
            </div>
        </div>
    );
}

function InfoRow({ label, value, emphasis = false }: any) {
    return (
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={cn(
                "text-sm mt-0.5",
                emphasis ? "font-bold text-orange-600 text-lg" : "font-semibold text-gray-900"
            )}>
                {value}
            </p>
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

// Custom TextArea Component (matching the input style)
function TextAreaNoLine({ label, placeholder, value, onChange }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-400 ml-1">{label}</label>
            <div className="bg-gray-50 border border-transparent rounded-lg px-3 py-2 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-50 transition-all shadow-sm">
                <textarea
                    required
                    rows={3}
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
