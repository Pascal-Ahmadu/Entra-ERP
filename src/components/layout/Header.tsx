"use client";

import Image from "next/image";
import { useSidebar } from "./SidebarContext";
import { Menu, Bell, Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
    const { toggleSidebar, toggleMobile, isCollapsed } = useSidebar();

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-[40] bg-white border-b border-slate-100 h-16 transition-all duration-300",
                isCollapsed ? "pl-[72px]" : "xl:pl-[260px]"
            )}
        >
            <nav className="h-full flex items-center justify-between px-6" aria-label="Global">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            if (window.innerWidth >= 1280) {
                                toggleSidebar();
                            } else {
                                toggleMobile();
                            }
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all active:scale-95 group"
                        title="Toggle Navigation"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg w-[300px] group transition-all duration-200">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Universal search..."
                            className="bg-transparent border-none outline-none appearance-none focus:outline-none focus:ring-0 text-[11px] font-semibold w-full text-slate-700 placeholder:text-slate-400"
                            style={{ outline: 'none', boxShadow: 'none', border: 'none', appearance: 'none' }}
                        />
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] text-slate-400 font-black shadow-sm">
                            <Command className="w-2 h-2" />
                            <span>K</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center border-r border-slate-100 pr-3 mr-1 gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all relative group">
                            <Bell className="w-4.5 h-4.5" />
                            <span className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-600"></span>
                            </span>
                        </button>
                    </div>

                    <button className="flex items-center gap-3 group hover:bg-slate-100/50 px-2 py-1 rounded-lg transition-all border border-transparent hover:border-slate-100">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[11px] font-black text-slate-900 leading-none">John Doe</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">Admin</span>
                        </div>
                        <div className="relative">
                            <Image
                                src="/assets/images/profile/user-1.jpg"
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-lg shadow-sm border border-slate-200"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                    </button>
                </div>
            </nav>
        </header>
    );
}
