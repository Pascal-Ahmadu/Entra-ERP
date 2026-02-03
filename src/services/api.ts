// This service mimics the future Spring Boot API structure
// You can replace these fetch calls with your Spring Boot URL later: http://localhost:8080/api/...

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-mock.entra.com";

export interface Employee {
    id: number;
    name: string;
    role: string;
    dept: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    salary: string;
    image: string;
}

export interface FinanceTransaction {
    id: string;
    title: string;
    date: string;
    amount: string;
    category: string;
    type: 'debit' | 'credit';
}

export const ERPService = {
    // HR Module
    getEmployees: async (): Promise<Employee[]> => {
        // In production, this would be: await fetch(`${API_BASE_URL}/employees`).then(res => res.json());
        return [
            { id: 1, name: "Mark Freeman", role: "Product Manager", dept: "Operations", status: "Active", salary: "$125,000", image: "/assets/images/profile/user-1.jpg" },
            { id: 2, name: "Nina Oldman", role: "UX Designer", dept: "Product", status: "On Leave", salary: "$98,000", image: "/assets/images/profile/user-2.jpg" },
            { id: 3, name: "Arya Shah", role: "Software Engineer", dept: "Tech", status: "Active", salary: "$110,000", image: "/assets/images/profile/user-3.jpg" },
            { id: 4, name: "June Smith", role: "HR Generalist", dept: "HR", status: "Active", salary: "$85,000", image: "/assets/images/profile/user-4.jpg" },
        ];
    },

    addEmployee: async (data: any) => {
        const response = await fetch("/api/hr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await response.json();
    },

    // Finance Module
    getTransactions: async (): Promise<FinanceTransaction[]> => {
        return [
            { id: "1", title: "AWS Cloud Services", date: "Jan 30, 2026", amount: "-$4,250", category: "Infrastructure", type: 'debit' },
            { id: "2", title: "Client Payment: Acme Corp", date: "Jan 29, 2026", amount: "+$25,000", category: "Revenue", type: 'credit' },
            { id: "3", title: "Office Supplies", date: "Jan 28, 2026", amount: "-$120", category: "Overhead", type: 'debit' },
        ];
    },

    // Operations Module
    getProjects: async () => {
        return [
            { id: 1, name: "Supply Chain Optimization", progress: 75, status: "Active" },
            { id: 2, name: "ERP System Migration", progress: 30, status: "Planning" },
        ];
    },

    // User Management
    getUsers: async () => {
        return [
            { id: 1, name: "System Admin", role: "Superuser", email: "admin@entra.com" },
            { id: 2, name: "Finance Lead", role: "Manager", email: "finance@entra.com" },
        ];
    }
};
