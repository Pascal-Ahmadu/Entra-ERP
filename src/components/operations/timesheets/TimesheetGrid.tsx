"use client";

import { useState, useEffect, useMemo } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameDay } from "date-fns";
import {
    Plus,
    Trash2,
    Save,
    Send,
    ChevronLeft,
    ChevronRight,
    FileText,
    TrendingUp,
    Info,
    LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimesheetGridProps {
    weekStart: Date;
    employeeId: number;
    employeeName: string;
    onSaveSuccess?: () => void;
}

interface GridRow {
    id: string;
    projectId: number;
    projectName: string;
    taskId: number | null;
    taskName: string;
    description: string;
    hours: Record<string, number>;
}

export function TimesheetGrid({
    weekStart,
    employeeId,
    employeeName,
    onSaveSuccess
}: TimesheetGridProps) {
    const [rows, setRows] = useState<GridRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [availableProjects, setAvailableProjects] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(weekStart));
    const [selectedProject, setSelectedProject] = useState<string>("");

    const monthDays = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const projRes = await fetch("/api/ops/projects");
                const projJson = await projRes.json();
                if (projJson.success) {
                    const uniqueProjects = Array.from(
                        new Map(projJson.data.map((p: any) => [p.name, p])).values()
                    );
                    setAvailableProjects(uniqueProjects);
                }

                const startStr = startOfMonth(currentMonth).toISOString();
                const endStr = endOfMonth(currentMonth).toISOString();
                const tsRes = await fetch(
                    `/api/ops/timesheets?employeeId=${employeeId}&startDate=${startStr}&endDate=${endStr}`
                );
                const tsJson = await tsRes.json();

                if (tsJson.success) {
                    const existingData = tsJson.data;
                    const grouped: Record<string, GridRow> = {};

                    existingData.forEach((ts: any) => {
                        const rowKey = `${ts.projectId}-${ts.taskId}-${ts.description || ""}`;
                        if (!grouped[rowKey]) {
                            grouped[rowKey] = {
                                id: rowKey,
                                projectId: ts.projectId,
                                projectName: ts.project?.name || "Unknown Project",
                                taskId: ts.taskId,
                                taskName: ts.task?.title || "General",
                                description: ts.description || "",
                                hours: {},
                            };
                        }

                        const dateKey = format(new Date(ts.date), "yyyy-MM-dd");
                        grouped[rowKey].hours[dateKey] = ts.hours;
                    });

                    setRows(Object.values(grouped));
                }
            } catch (err) {
                console.error("Failed to load grid data", err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [currentMonth, employeeId]);

    const handleHourChange = (rowIndex: number, dateKey: string, val: string) => {
        const num = Math.min(24, Math.max(0, parseFloat(val) || 0));
        const newRows = [...rows];
        if (!newRows[rowIndex].hours) {
            newRows[rowIndex].hours = {};
        }
        newRows[rowIndex].hours[dateKey] = num;
        setRows(newRows);
    };

    const handleDescriptionChange = (rowIndex: number, val: string) => {
        const newRows = [...rows];
        newRows[rowIndex].description = val;
        setRows(newRows);
    };

    const addRow = () => {
        if (!selectedProject) return;

        const proj = availableProjects.find((p) => p.id === parseInt(selectedProject));
        if (!proj) return;

        const tempId = `new-${Date.now()}`;
        setRows([
            ...rows,
            {
                id: tempId,
                projectId: proj.id,
                projectName: proj.name,
                taskId: null,
                taskName: "General",
                description: "",
                hours: {},
            },
        ]);

        setSelectedProject("");
    };

    const removeRow = (index: number) => {
        if (confirm("Remove this entry line?")) {
            setRows(rows.filter((_, i) => i !== index));
        }
    };

    const handleSave = async (isSubmit = false) => {
        setSaving(true);
        try {
            const entries: any[] = [];
            rows.forEach((row) => {
                Object.entries(row.hours).forEach(([dateKey, hours]) => {
                    if (hours > 0) {
                        entries.push({
                            date: new Date(dateKey).toISOString(),
                            projectId: row.projectId,
                            taskId: row.taskId,
                            hours: hours,
                            description: row.description,
                            status: isSubmit ? "Submitted" : "Draft",
                        });
                    }
                });
            });

            const res = await fetch("/api/ops/timesheets/batch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId, employeeName, entries }),
            });

            if (res.ok && onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const dayTotals = useMemo(() => {
        const totals: Record<string, number> = {};
        monthDays.forEach((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            totals[dateKey] = rows.reduce(
                (sum, row) => sum + (row.hours[dateKey] || 0),
                0
            );
        });
        return totals;
    }, [rows, monthDays]);

    const grandTotal = Object.values(dayTotals).reduce((a, b) => a + b, 0);

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentMonth((prev) => direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1));
    };

    if (loading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center gap-3 bg-white rounded-lg border">
                <div className="w-10 h-10 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Loading timesheet...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Month Navigator */}
                    <div className="flex items-center border rounded-lg">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => navigateMonth("prev")}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="px-4 min-w-[140px] text-center">
                            <span className="text-sm font-semibold text-gray-900">
                                {format(currentMonth, "MMMM yyyy")}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => navigateMonth("next")}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Project Selector */}
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger className="w-[280px] h-9">
                            <SelectValue placeholder="Select project..." />
                        </SelectTrigger>
                        <SelectContent>
                            {availableProjects.map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Add Line Button */}
                    <Button
                        onClick={addRow}
                        disabled={!selectedProject}
                        variant="outline"
                        size="sm"
                        className="h-9"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add line
                    </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total hours</p>
                        <p className="text-lg font-semibold text-orange-600">{grandTotal.toFixed(1)}h</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        size="sm"
                    >
                        <Save className="w-4 h-4 mr-1.5 " />
                        Save draft
                    </Button>
                    <Button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-black border:black"
                    >
                        <Send className="w-4 h-4 mr-1.5" />
                        Submit
                    </Button>
                </div>
            </div>

            {/* Monthly Grid */}
            <Card className="rounded-lg border shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <div className="min-w-full">
                            {/* Grid Header */}
                            <div className="flex border-b bg-gray-50/80 sticky top-0 z-20">
                                <div className="w-[320px] px-4 py-3 border-r flex-shrink-0 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-medium uppercase tracking-wide text-gray-600">
                                        Project / Task
                                    </span>
                                </div>
                                <div className="flex flex-1">
                                    {monthDays.map((day) => (
                                        <div
                                            key={day.toString()}
                                            className={cn(
                                                "w-[70px] px-2 py-3 text-center border-r flex-shrink-0 flex flex-col gap-0.5",
                                                isWeekend(day) ? "bg-gray-50" : "",
                                                isSameDay(day, new Date()) && "bg-orange-50 border-l-2 border-l-orange-500"
                                            )}
                                        >
                                            <span className="text-xs font-medium text-gray-500 uppercase">
                                                {format(day, "EEE")}
                                            </span>
                                            <span className={cn(
                                                "text-sm font-semibold",
                                                isSameDay(day, new Date()) ? "text-orange-600" : "text-gray-900"
                                            )}>
                                                {format(day, "d")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-[100px] px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-600">
                                    Total
                                </div>
                            </div>

                            {/* Grid Rows */}
                            <div className="divide-y">
                                {rows.length === 0 ? (
                                    <div className="p-20 flex flex-col items-center justify-center gap-3 bg-gray-50/30">
                                        <div className="w-14 h-14 rounded-lg bg-white border shadow-sm flex items-center justify-center text-gray-300">
                                            <LayoutGrid className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900">
                                            No entries yet
                                        </h3>
                                        <p className="text-sm text-gray-500 text-center max-w-[240px]">
                                            Select a project and click "Add line" to start tracking time
                                        </p>
                                    </div>
                                ) : (
                                    rows.map((row, rIndex) => {
                                        const rowTotal = Object.values(row.hours).reduce((a, b) => a + b, 0);
                                        return (
                                            <div key={row.id} className="flex hover:bg-gray-50/50 transition-colors group items-stretch">
                                                {/* Meta Section */}
                                                <div className="w-[320px] p-4 border-r flex-shrink-0 flex flex-col gap-2.5">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                            <span className="text-sm font-semibold text-gray-900 truncate">
                                                                {row.projectName}
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs font-medium w-fit"
                                                            >
                                                                {row.taskName}
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity flex-shrink-0"
                                                            onClick={() => removeRow(rIndex)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                    <Textarea
                                                        value={row.description}
                                                        onChange={(e) => handleDescriptionChange(rIndex, e.target.value)}
                                                        placeholder="Activity description..."
                                                        className="min-h-[60px] resize-none text-sm"
                                                    />
                                                </div>

                                                {/* Hour Input Section */}
                                                <div className="flex flex-1">
                                                    {monthDays.map((day) => {
                                                        const dateKey = format(day, "yyyy-MM-dd");
                                                        const hours = row.hours[dateKey] || 0;
                                                        return (
                                                            <div
                                                                key={dateKey}
                                                                className={cn(
                                                                    "w-[70px] px-1 py-2 border-r flex-shrink-0 flex items-center justify-center relative",
                                                                    isWeekend(day) ? "bg-gray-50/50" : "",
                                                                    hours > 0 && "after:absolute after:top-1.5 after:right-1.5 after:w-1 after:h-1 after:bg-orange-500 after:rounded-full"
                                                                )}
                                                            >
                                                                <input
                                                                    type="number"
                                                                    step="0.5"
                                                                    placeholder="-"
                                                                    value={hours || ""}
                                                                    onChange={(e) => handleHourChange(rIndex, dateKey, e.target.value)}
                                                                    className="w-full text-center text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-300"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Row Total */}
                                                <div className="w-[100px] px-4 py-4 flex items-center justify-center flex-shrink-0 bg-gray-50/50">
                                                    <span className="font-semibold text-sm text-gray-900">
                                                        {rowTotal.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Grand Totals Section */}
                            {rows.length > 0 && (
                                <div className="flex border-t-2 bg-gray-900 text-white items-stretch h-14">
                                    <div className="w-[320px] px-4 py-3 border-r border-white/10 flex-shrink-0 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-orange-400" />
                                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            Daily totals
                                        </span>
                                    </div>
                                    <div className="flex flex-1">
                                        {monthDays.map((day) => {
                                            const dateKey = format(day, "yyyy-MM-dd");
                                            const total = dayTotals[dateKey] || 0;
                                            return (
                                                <div
                                                    key={dateKey}
                                                    className="w-[70px] border-r border-white/5 flex items-center justify-center flex-shrink-0 relative"
                                                >
                                                    <span className={cn(
                                                        "text-sm font-medium",
                                                        total > 8 ? "text-orange-400" : "text-white"
                                                    )}>
                                                        {total > 0 ? total.toFixed(1) : ""}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="w-[100px] px-4 py-3 flex items-center justify-center flex-shrink-0 bg-orange-600">
                                        <span className="text-base font-semibold">{grandTotal.toFixed(1)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Info Notice */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border">
                <Info className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-1">
                        Timesheet submission
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Submit your completed timesheet by the end of each month. All entries must include project details and descriptions.
                    </p>
                </div>
            </div>
        </div>
    );
}