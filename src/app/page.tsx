"use client";

import { useState, useEffect } from "react";

import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

export default function ArchitectureDashboard() {
  const [stats, setStats] = useState({
    hr: 0,
    finance: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch HR Data
        const hrRes = await fetch('/api/hr');
        const hrData = await hrRes.json();
        const hrCount = hrData.data ? hrData.data.length : 0;

        // Fetch Finance Data
        const financeRes = await fetch('/api/finance/accounts');
        const financeData = await financeRes.json();
        const cashAccounts = financeData.data ? financeData.data.filter((a: any) => a.category === 'Cash') : [];
        const cashTotal = cashAccounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);

        setStats({
          hr: hrCount,
          finance: cashTotal,
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">System Architecture</h1>
          <p className="text-gray-500 mt-2 font-medium">Entra ERP Real-time Monitoring & Infrastructure Gateway</p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest">Systems Online</span>
          </div>
          <p className="text-xs text-gray-400 font-bold pr-4">Refreshed: 1 min ago</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModuleOverviewCard
          title="Human Resources"
          value={stats.loading ? "..." : stats.hr.toString()}
          sub="Staff Active"
          icon="users"
          color="blue"
          href="/hr"
        />
        <ModuleOverviewCard
          title="Finance"
          value={stats.loading ? "..." : `₦${stats.finance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="Current Cash"
          icon="wallet"
          color="teal"
          href="/finance"
        />
        <ModuleOverviewCard title="Operations" value="0" sub="Live Projects" icon="settings-automation" color="yellow" href="/operations" />
        <ModuleOverviewCard title="Procurement" value="0" sub="Pending POs" icon="shopping-cart" color="red" href="/procurement" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          <div className="card border-none shadow-xl bg-linear-to-br from-gray-900 to-gray-800 text-white min-h-[400px] relative overflow-hidden">
            <div className="card-body relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold mb-2">Platform Performance</h3>
                <p className="text-gray-400 font-medium max-w-md">Global infrastructure response times and database load across multi-region clusters.</p>
              </div>
              <div className="flex items-end gap-2 h-40">
                {[30, 45, 35, 60, 80, 55, 90, 75, 40, 65, 85, 95, 70, 50, 40, 60, 80, 90, 100, 85, 75, 60].map((h, i) => (
                  <div key={i} className="flex-1 bg-orange-500/30 rounded-t-lg relative group transition-all hover:bg-orange-400">
                    <div className="absolute bottom-0 w-full bg-orange-400 rounded-t-lg transition-all" style={{ height: `${h}%` }}></div>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}ms
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Throughput</p>
                  <p className="text-xl font-bold">12.4 TB / Sec</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Server Latency</p>
                  <p className="text-xl font-bold">12.2 ms</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">DB Connections</p>
                  <p className="text-xl font-bold">14.8k Active</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <i className="ti ti-activity text-orange-600"></i> Server Heatmap
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={cn(
                      "h-10 rounded-md transition-all",
                      i % 7 === 0 ? "bg-red-100" : i % 3 === 0 ? "bg-yellow-100" : "bg-teal-50 border border-teal-100"
                    )}></div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">Node distribution across cluster Lagos-01</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4">Security Logs</h3>
                  <div className="flex flex-col gap-4">
                    <SecurityLog title="New IP Authorized" user=" b.lawal" date="1:12 PM" color="teal" />
                    <SecurityLog title="External Access" user=" Unknown" date="11:15 AM" color="red" />
                    <SecurityLog title="Role Escalation" user=" c.okeke" date="Today" color="yellow" />
                  </div>
                </div>
                <button className="w-full py-2 bg-gray-50 text-xs font-bold text-gray-600 rounded hover:bg-gray-100 transition-colors">GO TO AUDIT CENTER</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="card border-none shadow-lg">
            <div className="card-body">
              <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider text-center">Module Health</h3>
              <div className="flex flex-col gap-4">
                <HealthBar label="CORE API" health={99} />
                <HealthBar label="Lagos-DB-01" health={100} />
                <HealthBar label="STAFF PORTAL" health={95} />
                <HealthBar label="LOGISTICS" health={91} />
                <HealthBar label="AUTH-SENTRY" health={99} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Upcoming Maintenance</h3>
              <div className="relative border-l border-gray-100 pl-6 flex flex-col gap-8">
                <MaintenanceItem title="Primary DB Sharding" time="Feb 02, 02:00 WAT" active />
                <MaintenanceItem title="Gateway Patch 4.2" time="Feb 05, 14:00 WAT" />
                <MaintenanceItem title="Compliance Audit" time="Feb 12, 09:00 WAT" />
              </div>
            </div>
          </div>

          <div className="card bg-orange-50 border border-orange-100">
            <div className="card-body flex flex-col items-center text-center p-8">
              <div className="h-16 w-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-3xl mb-4 shadow-lg shadow-orange-200">
                <i className="ti ti-rocket"></i>
              </div>
              <h4 className="text-xl font-extrabold text-orange-900 mb-2">Entra Pro v4.0</h4>
              <p className="text-xs text-orange-700 font-medium mb-6">Enterprise resource planning, reimagined for Nigeria.</p>
              <button className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-orange-700 transition-all">UPGRADE NOW</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleOverviewCard({ title, value, sub, icon, color, href }: any) {
  const colorMap: any = {
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    teal: "text-teal-600 bg-teal-50 border-teal-100",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-100",
    red: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <div className="card hover:translate-y-[-5px] transition-all cursor-pointer border border-transparent hover:border-orange-100">
      <div className="card-body p-6">
        <div className="flex justify-between items-center mb-4">
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-2xl", colorMap[color])}>
            <i className={`ti ti-${icon}`}></i>
          </div>
          <i className="ti ti-chevron-right text-gray-300"></i>
        </div>
        <h4 className="text-3xl font-black text-gray-800 tracking-tighter">{value}</h4>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-widest">{title}</span>
          <span className="text-[10px] text-gray-400 font-bold">• {sub}</span>
        </div>
      </div>
    </div>
  );
}

function SecurityLog({ title, user, date, color }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2">
        <span className={cn("w-1.5 h-1.5 rounded-full", color === "red" ? "bg-red-500" : color === "teal" ? "bg-teal-500" : "bg-yellow-500")}></span>
        <span className="text-xs font-bold text-gray-700">{title}</span>
      </div>
      <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded uppercase tracking-tighter">@{user}</span>
    </div>
  );
}

function HealthBar({ label, health }: any) {
  const color = health > 95 ? "bg-teal-500" : health > 90 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="group">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-900 transition-colors">
        <span>{label}</span>
        <span>{health}%</span>
      </div>
      <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${health}%` }}></div>
      </div>
    </div>
  );
}

function MaintenanceItem({ title, time, active }: any) {
  return (
    <div className="relative">
      <div className={cn(
        "absolute -left-[29px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm",
        active ? "bg-orange-600" : "bg-gray-200"
      )}></div>
      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        <p className="text-xs text-gray-400 font-medium">{time}</p>
      </div>
    </div>
  );
}
