"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { Plus, X, Check, Clock, Globe, Calendar as CalendarIcon, DollarSign, Plane, Car, Train, Briefcase, MapPin, ChevronDown, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const travelRequestSchema = z.object({
    destination: z.string().min(2, "Destination is required"),
    purpose: z.string().min(5, "Purpose must be at least 5 characters"),
    travelDate: z.string().min(1, "Travel date is required"),
    returnDate: z.string().min(1, "Return date is required"),
    estimatedCost: z.string().min(1, "Estimated cost is required"),
    transportMode: z.string().min(1, "Transport mode is required"),
});

type TravelRequestValues = z.infer<typeof travelRequestSchema>;

export default function TravelRequestsPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const form = useForm<TravelRequestValues>({
        resolver: zodResolver(travelRequestSchema),
        defaultValues: {
            destination: "",
            purpose: "",
            travelDate: "",
            returnDate: "",
            estimatedCost: "",
            transportMode: "Flight"
        }
    });

    const fetchData = async () => {
        try {
            const res = await fetch("/api/ops/travel");
            const json = await res.json();
            if (json.success) {
                setRequests(json.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (values: TravelRequestValues) => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/ops/travel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    employeeId: user?.id || 1, // Fallback for dev
                    employeeName: user?.name
                })
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
                form.reset();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string, reason?: string) => {
        if (!confirm(`Are you sure you want to ${status} this request?`)) return;
        try {
            const res = await fetch("/api/ops/travel", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    status,
                    approvedBy: status === "Approved" ? user?.name : null,
                    rejectionReason: reason
                })
            });

            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-orange-50 text-orange-600";
            case "Approved": return "bg-green-50 text-green-600";
            case "Rejected": return "bg-red-50 text-red-600";
            default: return "bg-gray-100 text-gray-500";
        }
    };

    // Mode of Transport Options
    const TRANSPORT_MODES = ["Flight", "Road", "Train"];

    // Filter logic: Staff only see their own, Admins see all
    const filteredRequests = isAdmin ? requests : requests.filter((r: any) => r.employeeName === user?.name);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Travel Authorization"
                subtitle="Request and manage business travel."
                breadcrumbs={[{ label: "Operations", href: "/operations" }, { label: "Travel" }]}
                action={
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Request
                    </button>
                }
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full h-32 flex items-center justify-center text-slate-400">Loading requests...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="col-span-full h-32 flex items-center justify-center text-slate-400">No travel requests found.</div>
                ) : (
                    filteredRequests.map((req: any) => (
                        <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{req.destination}</h3>
                                        <div className="text-xs font-semibold text-slate-500">{req.employeeName}</div>
                                    </div>
                                </div>
                                <span className={cn("px-2 py-1 rounded text-xs font-bold", getStatusColor(req.status))}>
                                    {req.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 p-2 rounded-lg">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(req.travelDate).toLocaleDateString()} - {new Date(req.returnDate).toLocaleDateString()}
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 flex-1">
                                <div className="flex items-center gap-2">
                                    {req.transportMode === "Flight" ? <Plane className="w-4 h-4" /> : req.transportMode === "Road" ? <Car className="w-4 h-4" /> : <Train className="w-4 h-4" />} <span>{req.transportMode}</span>
                                </div>
                                <p className="line-clamp-2 text-xs leading-relaxed" title={req.purpose}>{req.purpose}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Cost</span>
                                    <span className="font-mono font-bold text-slate-800">
                                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(req.estimatedCost)}
                                    </span>
                                </div>
                                {isAdmin && req.status === 'Pending' && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(req.id, "Rejected")}
                                            className="w-8 h-8 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors"
                                            title="Reject"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(req.id, "Approved")}
                                            className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors shadow-sm"
                                            title="Approve"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* shadcn Dialog Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                    <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-orange-50/30 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                <Plane className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-black text-slate-900">New Travel Request</DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500 mt-0.5">Submit a plan for business travel</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
                            <div className="space-y-4">
                                {/* Destination */}
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700">
                                                Destination <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                                                        <MapPin className="w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                                    </div>
                                                    <Input
                                                        placeholder="e.g. Abuja, Nigeria"
                                                        className="!pl-10 h-10 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="travelDate"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700">
                                                    Depart Date <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full h-10 px-4 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="returnDate"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700">
                                                    Return Date <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full h-10 px-4 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Cost & Mode */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="estimatedCost"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700">
                                                    Est. Cost <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
                                                            <span className="text-slate-400 font-bold text-xs group-focus-within:text-orange-500 transition-colors">NGN</span>
                                                        </div>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            className="!pl-14 h-10 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="transportMode"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700">
                                                    Transport Mode <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="!w-full !h-10 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all">
                                                            <SelectValue placeholder="Select mode" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {TRANSPORT_MODES.map(mode => (
                                                            <SelectItem key={mode} value={mode}>
                                                                <div className="flex items-center gap-2">
                                                                    {mode === "Flight" ? <Plane className="w-4 h-4" /> : mode === "Road" ? <Car className="w-4 h-4" /> : <Train className="w-4 h-4" />}
                                                                    {mode}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Purpose */}
                                <FormField
                                    control={form.control}
                                    name="purpose"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700">
                                                Travel Purpose <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the goal of this travel..."
                                                    className="min-h-[100px] resize-none bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 h-11 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 h-11 !bg-[#ea580c] !text-white rounded-lg hover:bg-orange-700 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
                                >                                  {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" /> Submit Request
                                    </>
                                )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
