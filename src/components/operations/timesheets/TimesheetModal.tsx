"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Plus,
    X,
    Check,
    Calendar as CalendarIcon,
    Clock,
    Briefcase,
    ListTodo,
    MessageSquare,
    AlertCircle
} from "lucide-react";
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const timesheetSchema = z.object({
    date: z.string().min(1, "Date is required"),
    hours: z.string().min(1, "Hours are required"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    projectId: z.string().optional(),
    taskId: z.string().optional(),
});

type TimesheetValues = z.infer<typeof timesheetSchema>;

interface TimesheetModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSuccess: () => void;
    employeeId: number;
    employeeName: string;
}

export function TimesheetModal({ open, setOpen, onSuccess, employeeId, employeeName }: TimesheetModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const form = useForm<TimesheetValues>({
        resolver: zodResolver(timesheetSchema),
        defaultValues: {
            date: format(new Date(), "yyyy-MM-dd"),
            hours: "",
            description: "",
            projectId: "",
            taskId: "",
        }
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/ops/projects");
                const json = await res.json();
                if (json.success) {
                    setProjects(json.data);
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
            }
        };
        if (open) fetchProjects();
    }, [open]);

    const onSubmit = async (values: TimesheetValues) => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/ops/timesheets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    employeeId,
                    employeeName
                })
            });

            if (res.ok) {
                setOpen(false);
                onSuccess();
                form.reset();
            }
        } catch (error) {
            console.error("Error logging timesheet:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedProjectData = projects.find(p => p.id.toString() === selectedProject);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-orange-50/30 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-black text-slate-900">Log Work Hours</DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-slate-500 mt-0.5">Record your daily activities and progress</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                                Date <span className="text-orange-500">*</span>
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full h-10 px-4 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-orange-600" />
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
                                    name="hours"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                                Hours Worked <span className="text-orange-500">*</span>
                                            </FormLabel>
                                            <div className="relative group">
                                                <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                                                    <Clock className="w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.5"
                                                        min="0.5"
                                                        max="24"
                                                        placeholder="e.g. 8.0"
                                                        className="!pl-10 h-10 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                            Project <span className="text-slate-400 font-medium normal-case ml-1">(Optional)</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                setSelectedProject(val);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="!w-full !h-10 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4 text-orange-600" />
                                                        <SelectValue placeholder="Select relevant project" />
                                                    </div>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {projects.map(project => (
                                                    <SelectItem key={project.id} value={project.id.toString()}>
                                                        {project.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />

                            {selectedProjectData && selectedProjectData.tasks && selectedProjectData.tasks.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name="taskId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                                Linked Task <span className="text-slate-400 font-medium normal-case ml-1">(Optional)</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="!w-full !h-10 bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all">
                                                        <div className="flex items-center gap-2">
                                                            <ListTodo className="w-4 h-4 text-orange-600" />
                                                            <SelectValue placeholder="Select specific task" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {selectedProjectData.tasks.map((task: any) => (
                                                        <SelectItem key={task.id} value={task.id.toString()}>
                                                            {task.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                            Activity Description <span className="text-orange-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-3 pointer-events-none">
                                                    <MessageSquare className="w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                                </div>
                                                <Textarea
                                                    placeholder="Describe what you accomplished today..."
                                                    className="min-h-[100px] !pl-10 resize-none bg-slate-50 border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 h-11 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 h-11 !bg-[#ea580c] !text-white rounded-lg hover:bg-orange-700 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Logging...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" /> Save Entry
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
