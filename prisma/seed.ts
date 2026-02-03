import "dotenv/config"
import { PrismaClient } from '../src/generated/client_v2'
const prisma = new PrismaClient()

async function main() {
    const employees = [
        { name: "Mark Freeman", email: "mark@entra.com", phone: "+234 1", idType: "NIN", idNumber: "123", stateOfOrigin: "Lagos", role: "Product Manager", dept: "Operations", salary: "₦650,000", image: "https://ui-avatars.com/api/?name=Mark+Freeman&background=f97316&color=fff" },
        { name: "Nina Oldman", email: "nina@entra.com", phone: "+234 2", idType: "NIN", idNumber: "124", stateOfOrigin: "Lagos", role: "UX Designer", dept: "Product", status: "On Leave", salary: "₦450,000", image: "https://ui-avatars.com/api/?name=Nina+Oldman&background=0d9488&color=fff" },
        { name: "Arya Shah", email: "arya@entra.com", phone: "+234 3", idType: "NIN", idNumber: "125", stateOfOrigin: "Lagos", role: "Software Engineer", dept: "Tech", salary: "₦1,200,000", image: "https://ui-avatars.com/api/?name=Arya+Shah&background=8b5cf6&color=fff" },
        { name: "June Smith", email: "june@entra.com", phone: "+234 4", idType: "NIN", idNumber: "126", stateOfOrigin: "Lagos", role: "HR Generalist", dept: "HR", salary: "₦350,000", image: "https://ui-avatars.com/api/?name=June+Smith&background=db2777&color=fff" },
    ]

    for (const emp of employees) {
        await prisma.employee.upsert({
            where: { email: emp.email },
            update: {
                salary: emp.salary,
                role: emp.role,
                dept: emp.dept,
                status: emp.status || "Active"
            },
            create: emp,
        })
    }

    // Seed Chart of Accounts
    const accounts = [
        { code: "1103", name: "Cash & Cash Equivalents", type: "Asset", subType: "Current", category: "Cash", balance: 15450000 },
        { code: "1105", name: "Accounts Receivable", type: "Asset", subType: "Current", category: "Operating", balance: 2450000 },
        { code: "1201", name: "Office Equipment", type: "Asset", subType: "Non-Current", category: "Investing", balance: 4500000 },
        { code: "2103", name: "Tax Payable (PAYE)", type: "Liability", subType: "Current", category: "Tax", balance: 345000 },
        { code: "2105", name: "Pension Payable", type: "Liability", subType: "Current", category: "Operating", balance: 120000 },
        { code: "2106", name: "NHF Payable", type: "Liability", subType: "Current", category: "Operating", balance: 25000 },
        { code: "2107", name: "Accounts Payable", type: "Liability", subType: "Current", category: "Operating", balance: 850000 },
        { code: "3101", name: "Share Capital", type: "Equity", subType: "Equity", category: "Financing", balance: 10000000 },
        { code: "4001", name: "Sales Revenue", type: "Revenue", subType: "Revenue", category: "Operating", balance: 18500000 },
        { code: "4002", name: "Service Income", type: "Revenue", subType: "Revenue", category: "Operating", balance: 4200000 },
        { code: "5001", name: "Salaries & Wages Expense", type: "Expense", subType: "Operating", category: "Operating", balance: 3200000 },
        { code: "5002", name: "Rent Expense", type: "Expense", subType: "Operating", category: "Operating", balance: 1500000 },
        { code: "5003", name: "Utilities Expense", type: "Expense", subType: "Operating", category: "Operating", balance: 450000 },
        { code: "5004", name: "Professional Fees", type: "Expense", subType: "Operating", category: "Operating", balance: 250000 },
    ];

    for (const acc of accounts) {
        await prisma.account.upsert({
            where: { code: acc.code },
            update: { balance: acc.balance },
            create: acc
        });
    }

    // Seed Invoices
    const invoices = [
        {
            invoiceNumber: "INV-2026-001",
            clientName: "Global Tech Solutions",
            clientEmail: "billing@globaltech.com",
            status: "PAID",
            date: new Date("2026-01-15"),
            dueDate: new Date("2026-02-15"),
            totalAmount: 1250000,
        },
        {
            invoiceNumber: "INV-2026-002",
            clientName: "Starlight Industries",
            clientEmail: "finance@starlight.io",
            status: "SENT",
            date: new Date("2026-01-20"),
            dueDate: new Date("2026-02-20"),
            totalAmount: 850000,
        }
    ];

    for (const inv of invoices) {
        await prisma.invoice.upsert({
            where: { invoiceNumber: inv.invoiceNumber },
            update: {},
            create: inv
        });
    }

    // Seed Expense Requests
    const expenses = [
        {
            requestNumber: "EXP-001",
            staffName: "Mark Freeman",
            staffEmail: "mark@entra.com",
            department: "Operations",
            category: "Travel",
            amount: 45000,
            description: "Flight to Abuja for client meeting",
            purpose: "Client Acquisition",
            status: "Approved",
            finalStatus: "Approved"
        },
        {
            requestNumber: "EXP-002",
            staffName: "Nina Oldman",
            staffEmail: "nina@entra.com",
            department: "Product",
            category: "Office Supplies",
            amount: 12000,
            description: "Stationery for design workshop",
            purpose: "Product Design",
            status: "Pending COE",
            finalStatus: "Pending"
        }
    ];

    for (const exp of expenses) {
        await prisma.expenseRequest.upsert({
            where: { requestNumber: exp.requestNumber },
            update: {},
            create: exp
        });
    }

    // Seed Leave Requests
    const leaveRequests = [
        {
            employeeId: 1,
            employeeName: "Mark Freeman",
            type: "Annual",
            startDate: new Date("2026-03-01"),
            endDate: new Date("2026-03-10"),
            days: 8,
            reason: "Annual vacation",
            status: "Pending"
        }
    ];

    for (const lr of leaveRequests) {
        await prisma.leaveRequest.create({
            data: lr
        });
    }

    // Seed Projects
    const projects = [
        {
            name: "Supply Chain Optimization",
            client: "AgroCorp",
            status: "In Progress",
            priority: "High",
            progress: 75,
            budget: 5000000,
            startDate: new Date("2026-01-10"),
            endDate: new Date("2026-04-10"),
            tasks: [
                { title: "Vendor Assessment", status: "Done", dueDate: new Date("2026-01-20"), assignedTo: "Mark Freeman" },
                { title: "Logistics Mapping", status: "In Progress", dueDate: new Date("2026-02-15"), assignedTo: "Arya Shah" },
            ]
        },
        {
            name: "ERP System Migration",
            client: "Entra Global",
            status: "Planning",
            priority: "Medium",
            progress: 30,
            budget: 15000000,
            startDate: new Date("2026-03-01"),
            endDate: new Date("2026-09-01"),
            tasks: [
                { title: "Requirement Gathering", status: "Done", dueDate: new Date("2026-03-15"), assignedTo: "Nina Oldman" },
                { title: "Database Schema Design", status: "In Progress", dueDate: new Date("2026-03-30"), assignedTo: "Arya Shah" },
            ]
        }
    ];

    for (const proj of projects) {
        const { tasks, ...projectData } = proj;
        await prisma.project.create({
            data: {
                ...projectData,
                tasks: {
                    create: tasks
                }
            }
        });
    }

    // Seed Assets
    const assets = [
        { name: "MacBook Pro M3", category: "Electronics", serialNumber: "MBP-2026-001", purchaseDate: new Date("2026-01-05"), purchaseCost: 2500000, currentValue: 2450000, assignedTo: "Nina Oldman", status: "In Use", location: "Lagos HQ" },
        { name: "Dell Latitude 5420", category: "Electronics", serialNumber: "DEL-2025-882", purchaseDate: new Date("2025-11-12"), purchaseCost: 1200000, currentValue: 1100000, assignedTo: "Mark Freeman", status: "In Use", location: "Lagos HQ" },
        { name: "Executive Desk", category: "Furniture", serialNumber: "FUR-001", purchaseDate: new Date("2025-06-01"), purchaseCost: 450000, currentValue: 400000, assignedTo: null, status: "Available", location: "Manager Office" },
    ];

    for (const asset of assets) {
        await prisma.asset.upsert({
            where: { serialNumber: asset.serialNumber },
            update: {},
            create: asset
        });
    }

    // Seed Vehicles
    const vehicles = [
        { plateNumber: "LND-123-XY", model: "Toyota Hilux", capacity: "1 Ton", status: "Active", driverName: "John Doe" },
        { plateNumber: "ABJ-456-ZZ", model: "Mercedes Actros", capacity: "10 Tons", status: "In Transit", driverName: "Sani Musa" },
    ];

    for (const v of vehicles) {
        await prisma.vehicle.upsert({
            where: { plateNumber: v.plateNumber },
            update: {},
            create: v
        });
    }

    // Seed Shipments
    const vehicle = await prisma.vehicle.findFirst();
    const shipments = [
        { trackingCode: "TRK-00192", origin: "Lagos Warehouse", destination: "Abuja Branch", status: "In Transit", estimatedDelivery: new Date("2026-02-05"), vehicleId: vehicle?.id },
        { trackingCode: "TRK-00201", origin: "Port Harcourt", destination: "Enugu Depot", status: "Pending", estimatedDelivery: new Date("2026-02-10"), vehicleId: null },
    ];

    for (const sh of shipments) {
        await prisma.shipment.upsert({
            where: { trackingCode: sh.trackingCode },
            update: {},
            create: sh
        });
    }

    // Seed Timesheets
    const markInfo = await prisma.employee.findFirst({ where: { name: "Mark Freeman" } });
    const aryaInfo = await prisma.employee.findFirst({ where: { name: "Arya Shah" } });
    const scProj = await prisma.project.findFirst({ where: { name: "Supply Chain Optimization" } });
    const scTask = await prisma.task.findFirst({ where: { title: "Vendor Assessment" } });

    const timesheets = [
        {
            employeeId: markInfo?.id || 1,
            employeeName: "Mark Freeman",
            date: new Date("2026-02-01"),
            hours: 8.0,
            description: "Conducted vendor assessments and reviewed contracts.",
            projectId: scProj?.id,
            taskId: scTask?.id,
            status: "Approved",
            supervisorStatus: "Approved",
            financeStatus: "Approved",
            hrStatus: "Approved",
            supervisorBy: "Admin User",
            financeBy: "Admin User",
            hrBy: "Admin User"
        },
        {
            employeeId: markInfo?.id || 1,
            employeeName: "Mark Freeman",
            date: new Date("2026-02-02"),
            hours: 6.5,
            description: "Follow-up calls with logistics partners.",
            projectId: scProj?.id,
            status: "Submitted",
            supervisorStatus: "Approved",
            financeStatus: "Pending",
            hrStatus: "Pending",
            supervisorBy: "Admin User"
        },
        {
            employeeId: aryaInfo?.id || 3,
            employeeName: "Arya Shah",
            date: new Date("2026-02-02"),
            hours: 7.5,
            description: "Database schema design for ERP migration.",
            projectId: (await prisma.project.findFirst({ where: { name: "ERP System Migration" } }))?.id,
            status: "Submitted",
            supervisorStatus: "Pending",
            financeStatus: "Pending",
            hrStatus: "Pending"
        }
    ];

    for (const ts of timesheets) {
        await prisma.timesheet.create({
            data: ts
        });
    }

    console.log('Database seeded with Assets, Logistics & Timesheets!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
