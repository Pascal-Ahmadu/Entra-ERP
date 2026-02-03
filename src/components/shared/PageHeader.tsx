"use client";

import Link from "next/link";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: { label: string; href?: string }[];
    action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col mb-6">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Link href="/" className="hover:text-orange-600">Home</Link>
                {breadcrumbs?.map((bc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <i className="ti ti-chevron-right text-[10px]"></i>
                        {bc.href ? (
                            <Link href={bc.href} className="hover:text-orange-600">{bc.label}</Link>
                        ) : (
                            <span>{bc.label}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
        </div>
    );
}
