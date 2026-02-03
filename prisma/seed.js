require('dotenv').config();
const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function main() {
    // Seed Employees
    const employees = [
        { name: "Mark Freeman", email: "mark@entra.com", phone: "+234 1", idType: "NIN", idNumber: "123", stateOfOrigin: "Lagos", role: "Product Manager", dept: "Operations", salary: "1.2M", image: "https://ui-avatars.com/api/?name=Mark+Freeman&background=f97316&color=fff" },
        { name: "Nina Oldman", email: "nina@entra.com", phone: "+234 2", idType: "NIN", idNumber: "124", stateOfOrigin: "Lagos", role: "UX Designer", dept: "Product", status: "On Leave", salary: "1.1M", image: "https://ui-avatars.com/api/?name=Nina+Oldman&background=0d9488&color=fff" },
        { name: "Arya Shah", email: "arya@entra.com", phone: "+234 3", idType: "NIN", idNumber: "125", stateOfOrigin: "Lagos", role: "Software Engineer", dept: "Tech", salary: "2.4M", image: "https://ui-avatars.com/api/?name=Arya+Shah&background=8b5cf6&color=fff" },
        { name: "June Smith", email: "june@entra.com", phone: "+234 4", idType: "NIN", idNumber: "126", stateOfOrigin: "Lagos", role: "HR Generalist", dept: "HR", salary: "1.0M", image: "https://ui-avatars.com/api/?name=June+Smith&background=db2777&color=fff" },
    ];

    for (const emp of employees) {
        await prisma.employee.upsert({
            where: { email: emp.email },
            update: {},
            create: emp,
        });
    }

    console.log('✅ Employees seeded!');

    // Seed Job Postings
    const jobPostings = [
        { title: "Senior Software Engineer", department: "Engineering", location: "Lagos, Nigeria", type: "Full-Time", salary: "₦800k - ₦1.2M", description: "We're looking for an experienced software engineer to join our growing engineering team.", requirements: "5+ years of experience, Strong knowledge of React, Node.js, PostgreSQL.", status: "Open", postedBy: "HR Team" },
        { title: "Product Designer", department: "Product", location: "Remote", type: "Full-Time", salary: "₦600k - ₦900k", description: "Join our product team to create beautiful, user-centered designs.", requirements: "3+ years of UI/UX design experience. Proficiency in Figma, Adobe XD.", status: "Open", postedBy: "Product Team" },
        { title: "HR Manager", department: "Human Resources", location: "Lagos, Nigeria", type: "Full-Time", salary: "₦700k - ₦1M", description: "Lead our HR initiatives including recruitment and employee relations.", requirements: "7+ years in HR management. Experience with HRIS systems.", status: "Open", postedBy: "Executive Team" },
        { title: "Marketing Intern", department: "Marketing", location: "Hybrid", type: "Internship", salary: "₦80k - ₦120k", description: "Get hands-on experience in digital marketing and content creation.", requirements: "Currently pursuing degree in Marketing or related field.", status: "Open", postedBy: "Marketing Team" },
        { title: "DevOps Engineer", department: "Engineering", location: "Lagos, Nigeria", type: "Contract", salary: "₦900k - ₦1.4M", description: "Help us build and maintain robust CI/CD pipelines.", requirements: "4+ years of DevOps experience. Strong knowledge of Docker, Kubernetes.", status: "Filled", postedBy: "CTO" }
    ];

    for (const job of jobPostings) {
        await prisma.jobPosting.create({ data: job });
    }

    console.log('✅ Job postings seeded!');

    // Seed Applications
    const applications = [
        { jobPostingId: 1, candidateName: "Ahmed Olatunji", candidateEmail: "ahmed.o@email.com", candidatePhone: "+234 803 123 4567", status: "Shortlisted" },
        { jobPostingId: 1, candidateName: "Chioma Eze", candidateEmail: "chioma.e@email.com", candidatePhone: "+234 805 987 6543", status: "Interview" },
        { jobPostingId: 2, candidateName: "Tunde Bakare", candidateEmail: "tunde.b@email.com", candidatePhone: "+234 807 456 7890", status: "New" },
        { jobPostingId: 3, candidateName: "Fatima Mohammed", candidateEmail: "fatima.m@email.com", candidatePhone: "+234 809 234 5678", status: "Reviewed" },
    ];

    for (const app of applications) {
        await prisma.application.create({ data: app });
    }

    console.log('✅ Applications seeded!');

    // Seed Expense Requests
    const expenses = [
        {
            requestNumber: "EXP-2026-001",
            staffName: "Mark Freeman",
            staffEmail: "mark@entra.com",
            department: "Operations",
            category: "Travel",
            amount: 450000,
            description: "Business trip to Abuja for client meeting",
            purpose: "Client Meeting - Project Alpha",
            status: "Approved",
            hodApproval: "Approved",
            hodApprovedBy: "Sarah Johnson",
            financeApproval: "Approved",
            financeApprovedBy: "David Chen",
            coeApproval: "Approved",
            coeApprovedBy: "CEO Office",
            finalStatus: "Approved"
        },
        {
            requestNumber: "EXP-2026-002",
            staffName: "Nina Oldman",
            staffEmail: "nina@entra.com",
            department: "Product",
            category: "Equipment",
            amount: 350000,
            description: "New MacBook Pro for design work",
            purpose: "Design Tools Upgrade",
            status: "Pending Finance",
            hodApproval: "Approved",
            hodApprovedBy: "James Wilson",
            financeApproval: "Pending",
            coeApproval: "Pending",
            finalStatus: "Pending"
        },
        {
            requestNumber: "EXP-2026-003",
            staffName: "Arya Shah",
            staffEmail: "arya@entra.com",
            department: "Tech",
            category: "Training",
            amount: 280000,
            description: "AWS Solutions Architect certification training",
            purpose: "Professional Development",
            status: "Pending COE",
            hodApproval: "Approved",
            hodApprovedBy: "Tech Lead",
            financeApproval: "Approved",
            financeApprovedBy: "Finance Team",
            coeApproval: "Pending",
            finalStatus: "Pending"
        },
        {
            requestNumber: "EXP-2026-004",
            staffName: "June Smith",
            staffEmail: "june@entra.com",
            department: "HR",
            category: "Office Supplies",
            amount: 85000,
            description: "Office furniture and supplies for new hires",
            purpose: "Onboarding Setup",
            status: "Pending HOD",
            hodApproval: "Pending",
            financeApproval: "Pending",
            coeApproval: "Pending",
            finalStatus: "Pending"
        },
        {
            requestNumber: "EXP-2026-005",
            staffName: "Ahmed Ibrahim",
            staffEmail: "ahmed@entra.com",
            department: "Marketing",
            category: "Entertainment",
            amount: 150000,
            description: "Team building event for Q1",
            purpose: "Team Building",
            status: "Rejected by Finance",
            hodApproval: "Approved",
            hodApprovedBy: "Marketing Head",
            financeApproval: "Rejected",
            financeApprovedBy: "CFO",
            coeApproval: "Pending",
            finalStatus: "Rejected"
        }
    ];

    for (const expense of expenses) {
        await prisma.expenseRequest.upsert({
            where: { requestNumber: expense.requestNumber },
            update: {},
            create: expense
        });
    }

    console.log('✅ Expense requests seeded!');

    // Seed Chart of Accounts
    const accounts = [
        // Non-Current Assets
        { code: "1001", name: "Property, Plant & Equipment (PPE)", type: "Asset", subType: "Non-Current", category: "Investing", balance: 4500000 },
        { code: "1002", name: "Goodwill", type: "Asset", subType: "Non-Current", category: "Investing", balance: 1200000 },
        { code: "1003", name: "Right-of-Use Assets", type: "Asset", subType: "Non-Current", category: "Investing", balance: 850000 },
        { code: "1004", name: "Software Cost (Long Term)", type: "Asset", subType: "Non-Current", category: "Investing", balance: 320000 },

        // Current Assets
        { code: "1101", name: "Inventory", type: "Asset", subType: "Current", category: "Operating", balance: 650000 },
        { code: "1102", name: "Trade Receivables", type: "Asset", subType: "Current", category: "Operating", balance: 890000 },
        { code: "1103", name: "Cash & Cash Equivalents", type: "Asset", subType: "Current", category: "Cash", balance: 1250000 },
        { code: "1104", name: "Prepaid Expenses", type: "Asset", subType: "Current", category: "Operating", balance: 120000 },

        // Equity
        { code: "3001", name: "Share Capital", type: "Equity", subType: "", category: "Financing", balance: 3000000 },
        { code: "3002", name: "Retained Earnings", type: "Equity", subType: "", category: "Financing", balance: 2400000 },
        { code: "3003", name: "Other Reserves", type: "Equity", subType: "", category: "Financing", balance: 50000 },

        // Non-Current Liabilities
        { code: "2001", name: "Long-term Loans", type: "Liability", subType: "Non-Current", category: "Financing", balance: 2500000 },
        { code: "2002", name: "Tax Provisions", type: "Liability", subType: "Non-Current", category: "Operating", balance: 450000 },
        { code: "2003", name: "Deferred Revenue", type: "Liability", subType: "Non-Current", category: "Operating", balance: 300000 },

        // Current Liabilities
        { code: "2101", name: "Trade Payables", type: "Liability", subType: "Current", category: "Operating", balance: 550000 },
        { code: "2102", name: "Short-term Loans", type: "Liability", subType: "Current", category: "Financing", balance: 200000 },
        { code: "2103", name: "Tax Payable", type: "Liability", subType: "Current", category: "Operating", balance: 180000 },
        { code: "2104", name: "Dividend Payables", type: "Liability", subType: "Current", category: "Financing", balance: 150000 },
    ];

    for (const acc of accounts) {
        await prisma.account.upsert({
            where: { code: acc.code },
            update: { balance: acc.balance }, // Update balance if exists (allows value tweaking)
            create: acc
        });
    }
    console.log('✅ Accounts seeded!');

    console.log('✅ Database fully seeded with employees, jobs, applications, expenses, and accounts!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
