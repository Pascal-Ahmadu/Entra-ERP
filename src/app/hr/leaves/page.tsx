"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Plus,
    MoreHorizontal,
    FileText,
    GraduationCap,
    ShieldCheck,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types & Interfaces
// ============================================================================

type LeaveStatus = "Pending" | "Approved" | "Rejected";
type LeaveType =
    | "Annual"
    | "Sick"
    | "Study/Educational"
    | "Maternity"
    | "Paternity"
    | "Casual"
    | "Compassionate";
type ViewMode = "EMPLOYEE" | "HR";

interface LeaveRequest {
    id: number;
    employeeName: string;
    type: LeaveType;
    startDate: string;
    endDate: string;
    days: number;
    status: LeaveStatus;
    reason: string;
}

interface Employee {
    id: number;
    name: string;
}

interface LeaveFormData {
    employeeId: string;
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
}

interface LeaveBalance {
    type: string;
    hours: number;
    label: string;
    icon: typeof Calendar;
    color: {
        bg: string;
        text: string;
        badge: string;
    };
    progress?: number;
}

// ============================================================================
// Constants
// ============================================================================

const LEAVE_TYPES: Array<{ value: LeaveType; label: string }> = [
    { value: "Annual", label: "Annual Leave" },
    { value: "Sick", label: "Sick Leave" },
    { value: "Study/Educational", label: "Study / Educational Leave" },
    { value: "Maternity", label: "Maternity Leave" },
    { value: "Paternity", label: "Paternity Leave" },
    { value: "Casual", label: "Casual Leave" },
    { value: "Compassionate", label: "Compassionate Leave" },
] as const;

const LEAVE_TYPE_STYLES: Record<
    LeaveType,
    { bg: string; text: string }
> = {
    "Study/Educational": { bg: "bg-purple-100", text: "text-purple-700" },
    Sick: { bg: "bg-red-100", text: "text-red-700" },
    Annual: { bg: "bg-blue-100", text: "text-blue-700" },
    Maternity: { bg: "bg-pink-100", text: "text-pink-700" },
    Paternity: { bg: "bg-indigo-100", text: "text-indigo-700" },
    Casual: { bg: "bg-green-100", text: "text-green-700" },
    Compassionate: { bg: "bg-gray-100", text: "text-gray-700" },
};

const STATUS_STYLES: Record<
    LeaveStatus,
    { bg: string; text: string; border: string }
> = {
    Approved: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100",
    },
    Rejected: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-100",
    },
    Pending: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-100",
    },
};

const INITIAL_FORM_STATE: LeaveFormData = {
    employeeId: "",
    type: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
};

// ============================================================================
// Utility Functions
// ============================================================================

const calculateBusinessDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) return 0;

    let count = 0;
    const current = new Date(start);

    while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) count++;
        current.setDate(current.getDate() + 1);
    }

    return count;
};

const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
};

// ============================================================================
// API Functions
// ============================================================================

const api = {
    fetchLeaves: async (): Promise<LeaveRequest[]> => {
        const response = await fetch("/api/hr/leaves");
        const data = await response.json();
        return data.success ? data.data : [];
    },

    fetchEmployees: async (): Promise<Employee[]> => {
        const response = await fetch("/api/hr");
        const data = await response.json();
        return data.success ? data.data : [];
    },

    createLeave: async (formData: LeaveFormData): Promise<boolean> => {
        const response = await fetch("/api/hr/leaves", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || "Failed to create request");
        }

        return true;
    },

    updateLeaveStatus: async (
        id: number,
        status: LeaveStatus
    ): Promise<boolean> => {
        // TODO: Implement actual API call
        // const response = await fetch(`/api/hr/leaves/${id}`, {
        //   method: "PUT",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ status }),
        // });
        // return response.ok;
        return true;
    },
};

// ============================================================================
// Sub-Components
// ============================================================================

const LeaveBalanceCard = ({ balance }: { balance: LeaveBalance }) => {
    const Icon = balance.icon;

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className={cn("w-24 h-24", balance.color.text)} />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-2 rounded-lg", balance.color.bg)}>
                        <Icon className={cn("w-5 h-5", balance.color.text)} />
                    </div>
                    <span
                        className={cn(
                            "text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded",
                            balance.color.badge
                        )}
                    >
                        {balance.type}
                    </span>
                </div>
                <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-black text-slate-800">
                        {balance.hours}
                    </h3>
                    <span className="text-sm font-bold text-slate-400">hours</span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1">
                    {balance.label}
                </p>
                {balance.progress !== undefined && (
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div
                            className={cn("h-full rounded-full", balance.color.text.replace('text-', 'bg-'))}
                            style={{ width: `${balance.progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({
    icon: Icon,
    value,
    label,
    accentColor,
}: {
    icon: typeof Clock;
    value: number;
    label: string;
    accentColor?: string;
}) => (
    <div
        className={cn(
            "bg-white p-5 rounded-xl border border-slate-100 shadow-sm",
            accentColor && `border-l-4 ${accentColor}`
        )}
    >
        <div className="flex justify-between items-start mb-2">
            <div
                className={cn(
                    "p-1.5 rounded-lg",
                    accentColor?.includes("rose")
                        ? "bg-rose-50 text-rose-600"
                        : "bg-purple-50 text-purple-600"
                )}
            >
                <Icon className="w-4 h-4" />
            </div>
        </div>
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {label}
        </p>
    </div>
);

const ViewModeToggle = ({
    viewMode,
    onToggle,
}: {
    viewMode: ViewMode;
    onToggle: (mode: ViewMode) => void;
}) => (
    <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
        <button
            onClick={() => onToggle("EMPLOYEE")}
            className={cn(
                "px-3 py-1.5 rounded-md transition-all",
                viewMode === "EMPLOYEE"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
            )}
        >
            <User className="w-3 h-3 inline-block mr-1.5" />
            Staff View
        </button>
        <button
            onClick={() => onToggle("HR")}
            className={cn(
                "px-3 py-1.5 rounded-md transition-all",
                viewMode === "HR"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
            )}
        >
            <ShieldCheck className="w-3 h-3 inline-block mr-1.5" />
            HR Admin
        </button>
    </div>
);

const LeaveStatusBadge = ({ status }: { status: LeaveStatus }) => {
    const styles = STATUS_STYLES[status];
    const Icon =
        status === "Approved"
            ? CheckCircle2
            : status === "Rejected"
                ? XCircle
                : Clock;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                styles.bg,
                styles.text,
                styles.border
            )}
        >
            <Icon className="w-3 h-3" />
            {status}
        </span>
    );
};

const LeaveTypeBadge = ({ type }: { type: LeaveType }) => {
    const styles = LEAVE_TYPE_STYLES[type];

    return (
        <span
            className={cn(
                "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                styles.bg,
                styles.text
            )}
        >
            {type}
        </span>
    );
};

const LeaveRequestModal = ({
    isOpen,
    onClose,
    employees,
    onSubmit,
    isSubmitting,
}: {
    isOpen: boolean;
    onClose: () => void;
    employees: Employee[];
    onSubmit: (data: LeaveFormData) => Promise<void>;
    isSubmitting: boolean;
}) => {
    const [formData, setFormData] = useState<LeaveFormData>(INITIAL_FORM_STATE);

    const updateFormField = useCallback(
        <K extends keyof LeaveFormData>(field: K, value: LeaveFormData[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const businessDays = useMemo(
        () => calculateBusinessDays(formData.startDate, formData.endDate),
        [formData.startDate, formData.endDate]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        setFormData(INITIAL_FORM_STATE);
    };

    const handleClose = () => {
        setFormData(INITIAL_FORM_STATE);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
                <div className="px-6 py-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-orange-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">
                                New Leave Request
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                Submit a request for time off
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Employee <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                            value={formData.employeeId}
                            onChange={(e) => updateFormField("employeeId", e.target.value)}
                        >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Leave Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            className="w-full h-10 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                            value={formData.type}
                            onChange={(e) =>
                                updateFormField("type", e.target.value as LeaveType)
                            }
                        >
                            {LEAVE_TYPES.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-0 top-0 bottom-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                                <div className={cn(
                                    "w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold flex items-center transition-all group-hover:border-orange-300 group-hover:bg-slate-50/80",
                                    formData.startDate ? "text-slate-900" : "text-slate-400"
                                )}>
                                    {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "dd / mm / yyyy"}
                                </div>
                                <input
                                    type="date"
                                    required
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    value={formData.startDate}
                                    onChange={(e) => updateFormField("startDate", e.target.value)}
                                    onClick={(e) => e.currentTarget.showPicker?.()}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-0 top-0 bottom-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                                <div className={cn(
                                    "w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold flex items-center transition-all group-hover:border-orange-300 group-hover:bg-slate-50/80",
                                    formData.endDate ? "text-slate-900" : "text-slate-400"
                                )}>
                                    {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : "dd / mm / yyyy"}
                                </div>
                                <input
                                    type="date"
                                    required
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    value={formData.endDate}
                                    onChange={(e) => updateFormField("endDate", e.target.value)}
                                    onClick={(e) => e.currentTarget.showPicker?.()}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                            Duration (Business Days)
                        </span>
                        <span className="font-black text-slate-800 text-lg">
                            {businessDays} days
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Reason
                        </label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 h-24 resize-none"
                            placeholder="Brief description of the leave request..."
                            value={formData.reason}
                            onChange={(e) => updateFormField("reason", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-orange-700 transition-all shadow-md shadow-orange-600/20 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? (
                                "Submitting..."
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LeaveRequestTable = ({
    leaves,
    viewMode,
    loading,
    onApprove,
    onReject,
}: {
    leaves: LeaveRequest[];
    viewMode: ViewMode;
    loading: boolean;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}) => {
    if (loading) {
        return (
            <div className="p-8 text-center text-slate-500 text-sm">
                Loading requests...
            </div>
        );
    }

    if (leaves.length === 0) {
        return (
            <div className="p-12 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No leave requests found.</p>
            </div>
        );
    }

    return (
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                <tr>
                    <th className="px-6 py-3 w-12">S/N</th>
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Dates</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {leaves.map((leave, index) => (
                    <tr key={leave.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-400">
                            {(index + 1).toString().padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-bold text-slate-700">
                                {leave.employeeName}
                            </div>
                            {viewMode === "HR" && (
                                <div className="text-xs text-slate-400">
                                    ID: #{leave.id.toString().padStart(4, "0")}
                                </div>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <LeaveTypeBadge type={leave.type} />
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-slate-800 font-bold">
                                {leave.days * 8} hours
                            </div>
                            <div className="text-xs text-slate-400">({leave.days} days)</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                            {formatDateRange(leave.startDate, leave.endDate)}
                        </td>
                        <td className="px-6 py-4">
                            <LeaveStatusBadge status={leave.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                            {viewMode === "HR" && leave.status === "Pending" ? (
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onApprove(leave.id)}
                                        className="p-1 hover:bg-emerald-100/50 text-slate-300 hover:text-emerald-600 rounded transition-colors"
                                        title="Approve"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => onReject(leave.id)}
                                        className="p-1 hover:bg-red-100/50 text-slate-300 hover:text-red-600 rounded transition-colors"
                                        title="Reject"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <button className="text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// ============================================================================
// Main Component
// ============================================================================

export default function LeavesPage() {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("EMPLOYEE");
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [leavesData, employeesData] = await Promise.all([
                api.fetchLeaves(),
                api.fetchEmployees(),
            ]);

            setLeaves(leavesData);
            setEmployees(employeesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = useCallback(
        async (formData: LeaveFormData) => {
            setSubmitting(true);
            try {
                await api.createLeave(formData);
                setShowModal(false);
                await fetchData();
            } catch (error) {
                console.error("Error submitting leave:", error);
                alert(error instanceof Error ? error.message : "Failed to create request");
            } finally {
                setSubmitting(false);
            }
        },
        [fetchData]
    );

    const handleApprove = useCallback(async (id: number) => {
        setLeaves((prev) =>
            prev.map((l) => (l.id === id ? { ...l, status: "Approved" } : l))
        );
        await api.updateLeaveStatus(id, "Approved");
    }, []);

    const handleReject = useCallback(async (id: number) => {
        setLeaves((prev) =>
            prev.map((l) => (l.id === id ? { ...l, status: "Rejected" } : l))
        );
        await api.updateLeaveStatus(id, "Rejected");
    }, []);

    const leaveBalances: LeaveBalance[] = useMemo(
        () => [
            {
                type: "Annual",
                hours: 160,
                label: "Available this year",
                icon: Calendar,
                color: {
                    bg: "bg-blue-50",
                    text: "text-blue-600",
                    badge: "bg-slate-100 text-slate-500",
                },
                progress: 15,
            },
            {
                type: "Sick",
                hours: 80,
                label: "Sick Leave Balance",
                icon: ShieldCheck,
                color: {
                    bg: "bg-red-50",
                    text: "text-red-600",
                    badge: "bg-slate-100 text-slate-500",
                },
            },
            {
                type: "Casual",
                hours: 40,
                label: "Casual Leave Balance",
                icon: Clock,
                color: {
                    bg: "bg-emerald-50",
                    text: "text-emerald-600",
                    badge: "bg-slate-100 text-slate-500",
                },
            },
            {
                type: "Study",
                hours: 40,
                label: "Educational Leave",
                icon: GraduationCap,
                color: {
                    bg: "bg-purple-50",
                    text: "text-purple-600",
                    badge: "bg-slate-100 text-slate-500",
                },
            },
        ],
        []
    );

    const stats = useMemo(() => {
        const pending = leaves.filter((l) => l.status === "Pending").length;
        const studyLeaves = leaves.filter((l) => l.type === "Study/Educational" && l.status === "Approved")
            .length;
        const sickLeaves = leaves.filter((l) => l.type === "Sick" && l.status === "Approved")
            .length;

        return { pending, studyLeaves, sickLeaves };
    }, [leaves]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Absence Management
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Track leave balances, requests, and approvals.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />

                    {viewMode === "EMPLOYEE" && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-sm text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            New Request
                        </button>
                    )}
                </div>
            </div>

            {viewMode === "EMPLOYEE" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leaveBalances.map((balance) => (
                        <LeaveBalanceCard key={balance.type} balance={balance} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Clock}
                        value={stats.pending}
                        label="Pending Approvals"
                        accentColor="border-l-rose-500"
                    />
                    <StatCard
                        icon={ShieldCheck}
                        value={stats.sickLeaves}
                        label="Active Sick Leaves"
                        accentColor="border-l-red-500"
                    />
                    <StatCard
                        icon={GraduationCap}
                        value={stats.studyLeaves}
                        label="Active Study Leaves"
                        accentColor="border-l-purple-500"
                    />
                    <StatCard
                        icon={Calendar}
                        value={leaves.filter(l => l.status === "Approved").length}
                        label="Total Approved"
                        accentColor="border-l-emerald-500"
                    />
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        {viewMode === "HR" ? (
                            <>
                                <ShieldCheck className="w-4 h-4 text-orange-600" />
                                <span>Approval Queue</span>
                            </>
                        ) : (
                            <>
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span>My Request History</span>
                            </>
                        )}
                    </h3>
                </div>

                <LeaveRequestTable
                    leaves={leaves}
                    viewMode={viewMode}
                    loading={loading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            </div>

            <LeaveRequestModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                employees={employees}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
            />
        </div>
    );
}