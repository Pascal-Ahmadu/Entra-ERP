"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, Briefcase, Users2, Clock, MapPin, DollarSign, TrendingUp, Eye, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Application {
    id: number;
    candidateName: string;
    candidateEmail: string;
    candidatePhone: string;
    status: string;
    createdAt: string;
}

interface JobPosting {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    salary: string | null;
    description: string;
    requirements: string;
    status: string;
    postedBy: string;
    applications: Application[];
    createdAt: string;
}

export default function RecruitmentPage() {
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewJobForm, setShowNewJobForm] = useState(false);

    useEffect(() => {
        fetchJobPostings();
    }, []);

    const fetchJobPostings = async () => {
        try {
            const response = await fetch("/api/recruitment");
            const data = await response.json();
            if (data.success) {
                setJobPostings(data.data);
            }
        } catch (error) {
            console.error("Error fetching job postings:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "open": return "bg-teal-100 text-teal-600";
            case "closed": return "bg-gray-100 text-gray-600";
            case "filled": return "bg-blue-100 text-blue-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
                <p className="text-sm text-gray-400 font-medium mt-1 tracking-wide">
                    Manage job postings and track applications
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Openings"
                    value={jobPostings.length}
                    icon={<Briefcase className="w-6 h-6" />}
                    color="blue"
                    trend="+12%"
                />
                <StatCard
                    title="Open Positions"
                    value={jobPostings.filter(j => j.status === "Open").length}
                    icon={<UserPlus className="w-6 h-6" />}
                    color="teal"
                    trend="+8%"
                />
                <StatCard
                    title="Total Applications"
                    value={jobPostings.reduce((sum, job) => sum + job.applications.length, 0)}
                    icon={<Users2 className="w-6 h-6" />}
                    color="purple"
                    trend="+24%"
                />
                <StatCard
                    title="Pending Review"
                    value={jobPostings.reduce((sum, job) =>
                        sum + job.applications.filter(a => a.status === "New").length, 0
                    )}
                    icon={<Clock className="w-6 h-6" />}
                    color="orange"
                    trend="+5"
                />
            </div>

            {/* Main Table Card */}
            <div className="card">
                <div className="card-body p-6">
                    {/* Table Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Job Postings</h2>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                                <i className="ti ti-download text-lg"></i> Export
                            </button>
                            <button
                                onClick={() => setShowNewJobForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                            >
                                <i className="ti ti-plus text-lg"></i> Post New Job
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                    <th className="px-4 py-3">Job Title</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Applications</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {jobPostings.length > 0 ? (
                                    jobPostings.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
                                                        <Briefcase className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-700 text-sm">{job.title}</p>
                                                        <p className="text-xs text-gray-400 font-medium">
                                                            Posted {new Date(job.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-gray-600 font-medium">{job.department}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="font-medium">{job.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-gray-600 font-medium">{job.type}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        {job.applications.slice(0, 3).map((app, idx) => (
                                                            <div
                                                                key={app.id}
                                                                className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center"
                                                                title={app.candidateName}
                                                            >
                                                                <span className="text-xs font-bold text-gray-600">
                                                                    {app.candidateName.charAt(0)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {job.applications.length}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
                                                    getStatusColor(job.status)
                                                )}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="text-gray-400 hover:text-orange-600 transition-colors">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-40">
                                                <Briefcase className="w-16 h-16 text-gray-300" />
                                                <div>
                                                    <p className="text-lg font-bold text-gray-800">No Job Postings Found</p>
                                                    <p className="text-sm text-gray-400">Start by creating your first job posting</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowNewJobForm(true)}
                                                    className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold opacity-100! hover:bg-orange-700 transition-all"
                                                >
                                                    + Post New Job
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* New Job Form Modal */}
            {showNewJobForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>
                            <p className="text-gray-600 mt-1">Fill in the details below</p>
                        </div>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const data = Object.fromEntries(formData);

                                try {
                                    const response = await fetch("/api/recruitment", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(data),
                                    });

                                    if (response.ok) {
                                        setShowNewJobForm(false);
                                        fetchJobPostings();
                                    }
                                } catch (error) {
                                    console.error("Error creating job:", error);
                                }
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                <input
                                    name="title"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="e.g. Senior Software Engineer"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                    <input
                                        name="department"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="e.g. Engineering"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        name="location"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="e.g. Lagos, Nigeria"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                                    <select
                                        name="type"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option>Full-Time</option>
                                        <option>Part-Time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                                    <input
                                        name="salary"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="e.g. ₦500k - ₦800k"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                                <textarea
                                    name="requirements"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="List the required skills, experience, and qualifications..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewJobForm(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 font-medium shadow-lg shadow-orange-500/30 transition-all"
                                >
                                    Post Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, color, trend }: any) {
    const colorMap: any = {
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        teal: "bg-teal-50 text-teal-600 border-teal-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100"
    };

    return (
        <div className={cn("card border border-transparent hover:border-orange-100 transition-all")}>
            <div className="card-body p-5">
                <div className="flex justify-between items-start">
                    <div className={cn("p-2 rounded-lg", colorMap[color])}>
                        {icon}
                    </div>
                    <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded",
                        trend.startsWith("+") ? "bg-teal-50 text-teal-600" : "bg-red-50 text-red-600"
                    )}>
                        {trend}
                    </span>
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{title}</p>
                </div>
            </div>
        </div>
    );
}
