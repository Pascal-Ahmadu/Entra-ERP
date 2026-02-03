import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon, color, trend, sub }: any) {
    const colorMap: any = {
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        teal: "bg-teal-50 text-teal-600 border-teal-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
        red: "bg-red-50 text-red-600 border-red-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
    };

    return (
        <div className={cn("card border border-transparent hover:border-orange-100 transition-all")}>
            <div className="card-body p-5">
                <div className="flex justify-between items-start">
                    <div className={cn("p-2 rounded-lg", colorMap[color] || colorMap.orange)}>
                        <i className={`ti ti-${icon} text-2xl`}></i>
                    </div>
                    {trend && (
                        <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded",
                            trend.startsWith("+") ? "bg-teal-50 text-teal-600" : "bg-red-50 text-red-600"
                        )}>
                            {trend}
                        </span>
                    )}
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-wide">{title}</p>
                    {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
                </div>
            </div>
        </div>
    );
}
