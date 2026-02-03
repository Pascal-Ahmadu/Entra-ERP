"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import Image from "next/image";
import {
  LayoutDashboard, Users, Wallet,
  Settings2, ShoppingCart, UserCog,
  BarChart3, Settings, ChevronRight, Package, UserCircle, Menu, X
} from "lucide-react";
import { useAuth, UserRole } from "@/context/AuthContext";

interface SidebarItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isOpen?: boolean;
  isSubItem?: boolean;
}

const SidebarItem = ({ href, icon, label, onClick, isOpen, isSubItem }: SidebarItemProps) => {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const isActive = href && pathname === href;

  const content = (
    <div
      className={cn(
        "flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 group relative",
        isActive
          ? "bg-orange-50 text-orange-600 font-bold border-l-2 border-orange-600 rounded-l-none"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
        isCollapsed && !isSubItem && "justify-center px-0 h-10 w-10 mx-auto"
      )}
    >
      <div className={cn(
        "shrink-0 transition-colors duration-200",
        isActive ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600"
      )}>
        {icon}
      </div>

      {!isCollapsed && (
        <span className={cn(
          "truncate whitespace-nowrap text-sm tracking-tight transition-opacity duration-200",
          isActive ? "text-orange-600" : "text-slate-600"
        )}>
          {label}
        </span>
      )}

      {isCollapsed && !isSubItem && (
        <div className="absolute left-14 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
          {label}
        </div>
      )}

      {!isCollapsed && onClick && (
        <ChevronRight className={cn("ml-auto w-3.5 h-3.5 transition-transform duration-200 text-slate-300", isOpen && "rotate-90")} />
      )}
    </div>
  );

  if (href) {
    return (
      <li className="list-none px-2">
        <Link href={href}>{content}</Link>
      </li>
    );
  }

  return (
    <li className="list-none text-left px-2">
      <button onClick={onClick} className="w-full">
        {content}
      </button>
    </li>
  );
};

export default function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();
  const { user, switchRole } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    hr: false,
    finance: false,
    ops: false,
    assets: true,
    procure: false
  });

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white z-[999] transition-all duration-500 flex flex-col border-r border-slate-200",
        isCollapsed ? "w-[72px]" : "w-[260px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
      )}
    >
      {/* Brand Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
        <Link href="/" className="flex items-center gap-2 overflow-hidden" onClick={closeMobileSidebar}>
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-lg">E</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 tracking-tighter leading-none">Entra</span>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none mt-1">Enterprise</span>
            </div>
          )}
        </Link>
        <button onClick={toggleSidebar} className="hidden xl:flex text-slate-400 hover:text-orange-600 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <button onClick={closeMobileSidebar} className="xl:hidden text-slate-400 hover:text-red-500">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar">
        <ul className="space-y-6">

          {/* Workspace */}
          <li>
            {!isCollapsed && (
              <h5 className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Workspace</h5>
            )}
            <ul className="space-y-0.5">
              <SidebarItem href="/" icon={<LayoutDashboard className="w-[18px] h-[18px]" />} label="Dashboard" />
            </ul>
          </li>

          {/* Enterprise Suite */}
          <li>
            {!isCollapsed && (
              <h5 className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Enterprise Suite</h5>
            )}
            <ul className="space-y-0.5">
              {isAdmin && (
                <>
                  <SidebarItem
                    icon={<Users className="w-[18px] h-[18px]" />}
                    label="Human Resources"
                    onClick={() => toggleMenu('hr')}
                    isOpen={openMenus.hr}
                  />
                  {!isCollapsed && openMenus.hr && (
                    <div className="ml-7 mt-1 border-l border-slate-100 pl-2 space-y-0.5 py-1">
                      <SidebarItem href="/hr" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Employees" isSubItem />
                      <SidebarItem href="/hr/payroll" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Payroll" isSubItem />
                      <SidebarItem href="/hr/recruitment" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Recruitment" isSubItem />
                      <SidebarItem href="/hr/performance" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Performance" isSubItem />
                      <SidebarItem href="/hr/leaves" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Leave Management" isSubItem />
                      <SidebarItem href="/hr/clearance" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Exit Clearance" isSubItem />
                    </div>
                  )}
                </>
              )}

              {isAdmin && (
                <>
                  <SidebarItem
                    icon={<Wallet className="w-[18px] h-[18px]" />}
                    label="Finance"
                    onClick={() => toggleMenu('finance')}
                    isOpen={openMenus.finance}
                  />
                  {!isCollapsed && openMenus.finance && (
                    <div className="ml-7 mt-1 border-l border-slate-100 pl-2 space-y-0.5 py-1">
                      <SidebarItem href="/finance" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Finance Hub" isSubItem />
                      <SidebarItem href="/finance/invoices" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Income / Invoices" isSubItem />
                      <SidebarItem href="/finance/expenses" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Expend / Expenses" isSubItem />
                      <SidebarItem href="/finance/accounts" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Chart of Accounts" isSubItem />
                      <SidebarItem href="/finance/journals/create" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Manual Journals" isSubItem />
                      <SidebarItem href="/finance/statements" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Financial Reports" isSubItem />
                    </div>
                  )}
                </>
              )}

              {isAdmin && (
                <>
                  <SidebarItem
                    icon={<Settings2 className="w-[18px] h-[18px]" />}
                    label="Operations"
                    onClick={() => toggleMenu('ops')}
                    isOpen={openMenus.ops}
                  />
                  {!isCollapsed && openMenus.ops && (
                    <div className="ml-7 mt-1 border-l border-slate-100 pl-2 space-y-0.5 py-1">
                      <SidebarItem href="/operations" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Project Hub" isSubItem />
                      <SidebarItem href="/operations/workflow" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Workflows" isSubItem />
                      <SidebarItem href="/operations/timesheets" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Timesheets" isSubItem />
                      <SidebarItem href="/operations/logistics" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Logistics & Fleet" isSubItem />
                      <SidebarItem href="/operations/travel" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Travel Auth" isSubItem />
                    </div>
                  )}
                </>
              )}

              {!isAdmin && (
                <>
                  <SidebarItem
                    icon={<Settings2 className="w-[18px] h-[18px]" />}
                    label="Operations"
                    onClick={() => toggleMenu('ops')}
                    isOpen={openMenus.ops}
                  />
                  {!isCollapsed && openMenus.ops && (
                    <div className="ml-7 mt-1 border-l border-slate-100 pl-2 space-y-0.5 py-1">
                      <SidebarItem href="/operations/timesheets" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="My Timesheets" isSubItem />
                      <SidebarItem href="/operations/travel" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="My Travel Requests" isSubItem />
                    </div>
                  )}
                </>
              )}

              <SidebarItem
                icon={<Package className="w-[18px] h-[18px]" />}
                label="Assets"
                onClick={() => toggleMenu('assets')}
                isOpen={openMenus.assets}
              />
              {!isCollapsed && openMenus.assets && (
                <div className="ml-7 mt-1 border-l border-slate-100 pl-2 space-y-0.5 py-1">
                  {isAdmin && <SidebarItem href="/assets" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Dashboard" isSubItem />}
                  <SidebarItem href="/assets/inventory" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label={isAdmin ? "Inventory" : "My Assets"} isSubItem />
                  <SidebarItem href="/assets/incidents" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label={isAdmin ? "Incidents" : "Report Issue"} isSubItem />
                  <SidebarItem href="/assets/requests" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label={isAdmin ? "Requests" : "My Requests"} isSubItem />
                  {isAdmin && <SidebarItem href="/assets/assignments" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Assignments" isSubItem />}
                  {isAdmin && <SidebarItem href="/assets/disposed" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Disposed Assets" isSubItem />}
                </div>
              )}

              {isAdmin && (
                <>
                  <SidebarItem
                    icon={<ShoppingCart className="w-[18px] h-[18px]" />}
                    label="Procurement"
                    onClick={() => toggleMenu('procure')}
                    isOpen={openMenus.procure}
                  />
                  {!isCollapsed && openMenus.procure && (
                    <div className="ml-7 mt-1 border-l border-slate-100 pl-2 space-y-0.5 py-1">
                      <SidebarItem href="/procurement" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Purchase Orders" isSubItem />
                      <SidebarItem href="/procurement/vendors" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Vendors" isSubItem />
                      <SidebarItem href="/procurement/stock" icon={<div className="w-1.5 h-1.5 rounded-sm bg-slate-200" />} label="Inventory" isSubItem />
                    </div>
                  )}
                </>
              )}
            </ul>
          </li>

          {/* Systems */}
          <li>
            {!isCollapsed && (
              <h5 className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Systems</h5>
            )}
            <ul className="space-y-0.5">
              {isAdmin && <SidebarItem href="/users" icon={<Users className="w-[18px] h-[18px]" />} label="User Mgmt" />}
              {!isAdmin && <SidebarItem href="#" icon={<UserCircle className="w-[18px] h-[18px]" />} label="My Profile" />}
              <SidebarItem href="/settings" icon={<Settings className="w-[18px] h-[18px]" />} label="Configuration" />
            </ul>
          </li>

        </ul>
      </nav>

      {/* Role Switcher */}
      {!isCollapsed && (
        <div className="px-4 pb-2 mt-auto">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Simulate Role</p>
            <div className="flex gap-2">
              <button
                onClick={() => switchRole("Admin")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                  isAdmin ? "bg-orange-600 text-white shadow-sm" : "bg-white text-slate-500 hover:bg-slate-100"
                )}
              >
                Admin
              </button>
              <button
                onClick={() => switchRole("Staff")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                  !isAdmin ? "bg-orange-600 text-white shadow-sm" : "bg-white text-slate-500 hover:bg-slate-100"
                )}
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Status */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="h-8 w-8 bg-white border border-slate-100 rounded-lg shrink-0 overflow-hidden shadow-sm">
            <Image src="/assets/images/profile/user-1.jpg" alt="User" width={32} height={32} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate tracking-tight">{user?.name}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{user?.role}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
