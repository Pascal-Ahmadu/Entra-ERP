"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Send, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
}

export default function CreateInvoicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

    // Items State
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: 1, description: "", quantity: 1, unitPrice: 0 }
    ]);

    // Derived State
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (id: number) => {
        if (items.length === 1) return;
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                clientName,
                clientEmail,
                date: invoiceDate,
                dueDate,
                items: items.map(({ description, quantity, unitPrice }) => ({
                    description,
                    quantity: Number(quantity),
                    unitPrice: Number(unitPrice),
                    amount: Number(quantity) * Number(unitPrice)
                }))
            };

            const res = await fetch("/api/finance/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push("/finance/invoices");
            } else {
                alert("Failed to create invoice");
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 max-w-4xl mx-auto pb-8 text-zinc-800 p-4 md:p-8">
            <PageHeader
                title="Create New Invoice"
                subtitle="Fill in the details below to generate a new invoice."
                breadcrumbs={[{ label: "Finance", href: "/finance" }, { label: "Invoices", href: "/finance/invoices" }, { label: "Create" }]}
            />

            <div className="card shadow-lg border border-gray-100 bg-white rounded-lg overflow-hidden">
                <div className="bg-orange-600 h-1 w-full"></div>
                <div className="card-body p-5 md:p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Client Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputNoLine label="Client Name" placeholder="e.g. Acme Corp" value={clientName} onChange={(v: string) => setClientName(v)} />
                            <InputNoLine label="Client Email" type="email" placeholder="billing@acme.com" value={clientEmail} onChange={(v: string) => setClientEmail(v)} />
                            <InputNoLine label="Invoice Date" type="date" value={invoiceDate} onChange={(v: string) => setInvoiceDate(v)} />
                            <InputNoLine label="Due Date" type="date" value={dueDate} onChange={(v: string) => setDueDate(v)} />
                        </div>

                        {/* Line Items Section */}
                        <div className="border-t border-gray-50 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-gray-700">Line Items</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-sm text-orange-600 font-bold hover:text-orange-700 hover:bg-orange-100 flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Item
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {/* Static Headers */}
                                <div className="grid grid-cols-12 gap-3 px-1">
                                    <div className="col-span-5 md:col-span-6">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Qty</label>
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Price (₦)</label>
                                    </div>
                                </div>

                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-3 items-start animate-in fade-in slide-in-from-bottom-1">
                                        <div className="col-span-5 md:col-span-6">
                                            <InputNoLine
                                                placeholder="Item description"
                                                value={item.description}
                                                onChange={(v: string) => updateItem(item.id, "description", v)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <InputNoLine
                                                type="number"
                                                value={item.quantity}
                                                onChange={(v: string) => updateItem(item.id, "quantity", Number(v))}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <InputNoLine
                                                type="number"
                                                value={item.unitPrice}
                                                onChange={(v: string) => updateItem(item.id, "unitPrice", Number(v))}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center items-center h-full pt-1">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                disabled={items.length === 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total & Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4 border-t border-gray-50">
                            <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900 font-mono tracking-tight">₦ {totalAmount.toLocaleString()}</p>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-2 bg-white border border-gray-200 text-gray-500 rounded-lg font-semibold hover:bg-gray-50 transition-all text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-2.5 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm whitespace-nowrap"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" />
                                            Create Invoice
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function InputNoLine({ label, type = "text", placeholder, value, onChange, required = true }: any) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-[10px] font-semibold text-gray-400 ml-1">{label}</label>}
            <div className="bg-gray-50 border border-transparent rounded-lg px-3 py-1.5 focus-within:border-orange-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-50 transition-all shadow-sm">
                <input
                    required={required}
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none outline-none font-semibold text-zinc-900 placeholder:text-zinc-300 placeholder:font-normal text-xs"
                    style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
