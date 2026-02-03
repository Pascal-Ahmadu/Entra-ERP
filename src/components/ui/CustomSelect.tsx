"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    required?: boolean;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    required = false
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Find selected option label
    const selectedOption = options.find(opt => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {/* Hidden input for form validation */}
            {required && (
                <input
                    type="text"
                    value={value}
                    required
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                    tabIndex={-1}
                    onChange={() => { }}
                />
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-semibold text-left outline-none transition-all flex items-center justify-between gap-2",
                    isOpen
                        ? "border-orange-500 ring-2 ring-orange-500/20"
                        : "border-slate-200 hover:border-slate-300",
                    selectedOption ? "text-slate-700" : "text-slate-400"
                )}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn(
                    "w-4 h-4 text-slate-400 transition-transform flex-shrink-0",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="max-h-64 overflow-y-auto py-1">
                        {options.map((option, index) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors flex items-center justify-between gap-2",
                                    value === option.value
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <span className="truncate">{option.label}</span>
                                {value === option.value && (
                                    <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
