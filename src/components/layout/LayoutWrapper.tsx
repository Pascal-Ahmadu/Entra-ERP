"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "./SidebarContext";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { isCollapsed, isMobileOpen } = useSidebar();

    return (
        <AuthProvider>
            <div id="main-wrapper" className="flex">
                <Sidebar />
                <div
                    className={cn(
                        "w-full page-wrapper flex flex-col min-h-screen transition-all duration-300 pt-16",
                        isCollapsed ? "xl:pl-[72px]" : "xl:pl-[260px]"
                    )}
                >
                    <Header />
                    <div className="p-6">
                        <main className="h-full max-w-full">{children}</main>
                        <footer className="mt-auto">
                            <p className="text-base text-gray-400 font-normal p-3 text-center">
                                &copy; 2026 Spike Admin. All rights reserved.
                            </p>
                        </footer>
                    </div>
                </div>

                {/* Mobile Overlay */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-[998] xl:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => { }} // Handle close in Sidebar later
                    />
                )}
            </div>
        </AuthProvider>
    );
}
