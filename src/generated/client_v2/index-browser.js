
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.EmployeeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  idType: 'idType',
  idNumber: 'idNumber',
  stateOfOrigin: 'stateOfOrigin',
  hasPassport: 'hasPassport',
  hasCredentials: 'hasCredentials',
  role: 'role',
  dept: 'dept',
  type: 'type',
  salary: 'salary',
  pfa: 'pfa',
  rsa: 'rsa',
  hmo: 'hmo',
  bloodGroup: 'bloodGroup',
  medicalCond: 'medicalCond',
  proofOfLife: 'proofOfLife',
  uniqueTrait: 'uniqueTrait',
  bank: 'bank',
  accountNo: 'accountNo',
  bvn: 'bvn',
  nokName: 'nokName',
  nokPhone: 'nokPhone',
  status: 'status',
  image: 'image',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JobPostingScalarFieldEnum = {
  id: 'id',
  title: 'title',
  department: 'department',
  location: 'location',
  type: 'type',
  salary: 'salary',
  description: 'description',
  requirements: 'requirements',
  status: 'status',
  postedBy: 'postedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ApplicationScalarFieldEnum = {
  id: 'id',
  jobPostingId: 'jobPostingId',
  candidateName: 'candidateName',
  candidateEmail: 'candidateEmail',
  candidatePhone: 'candidatePhone',
  resume: 'resume',
  coverLetter: 'coverLetter',
  status: 'status',
  score: 'score',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExpenseRequestScalarFieldEnum = {
  id: 'id',
  requestNumber: 'requestNumber',
  staffName: 'staffName',
  staffEmail: 'staffEmail',
  department: 'department',
  category: 'category',
  amount: 'amount',
  description: 'description',
  purpose: 'purpose',
  attachments: 'attachments',
  status: 'status',
  hodApproval: 'hodApproval',
  hodApprovedBy: 'hodApprovedBy',
  hodApprovedAt: 'hodApprovedAt',
  hodComments: 'hodComments',
  financeApproval: 'financeApproval',
  financeApprovedBy: 'financeApprovedBy',
  financeApprovedAt: 'financeApprovedAt',
  financeComments: 'financeComments',
  coeApproval: 'coeApproval',
  coeApprovedBy: 'coeApprovedBy',
  coeApprovedAt: 'coeApprovedAt',
  coeComments: 'coeComments',
  finalStatus: 'finalStatus',
  disbursedDate: 'disbursedDate',
  disbursedAmount: 'disbursedAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  type: 'type',
  subType: 'subType',
  category: 'category',
  balance: 'balance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JournalEntryScalarFieldEnum = {
  id: 'id',
  date: 'date',
  description: 'description',
  reference: 'reference',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JournalLineScalarFieldEnum = {
  id: 'id',
  journalEntryId: 'journalEntryId',
  accountId: 'accountId',
  amount: 'amount',
  createdAt: 'createdAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  clientName: 'clientName',
  clientEmail: 'clientEmail',
  status: 'status',
  date: 'date',
  dueDate: 'dueDate',
  totalAmount: 'totalAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  amount: 'amount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayrollRunScalarFieldEnum = {
  id: 'id',
  month: 'month',
  year: 'year',
  status: 'status',
  totalGross: 'totalGross',
  totalPaye: 'totalPaye',
  totalPension: 'totalPension',
  totalNhf: 'totalNhf',
  totalNet: 'totalNet',
  employeeCount: 'employeeCount',
  processedBy: 'processedBy',
  processedAt: 'processedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayrollLineScalarFieldEnum = {
  id: 'id',
  payrollRunId: 'payrollRunId',
  employeeId: 'employeeId',
  employeeName: 'employeeName',
  basicSalary: 'basicSalary',
  allowances: 'allowances',
  bonus: 'bonus',
  cashBenefits: 'cashBenefits',
  grossPay: 'grossPay',
  cra: 'cra',
  taxableIncome: 'taxableIncome',
  paye: 'paye',
  pension: 'pension',
  nhf: 'nhf',
  netPay: 'netPay',
  createdAt: 'createdAt'
};

exports.Prisma.LeaveRequestScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  employeeName: 'employeeName',
  type: 'type',
  startDate: 'startDate',
  endDate: 'endDate',
  days: 'days',
  reason: 'reason',
  status: 'status',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ForecastAssumptionScalarFieldEnum = {
  id: 'id',
  revenueGrowth: 'revenueGrowth',
  expenseInflation: 'expenseInflation',
  headcountGrowth: 'headcountGrowth',
  projectionMonths: 'projectionMonths',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  client: 'client',
  status: 'status',
  priority: 'priority',
  startDate: 'startDate',
  endDate: 'endDate',
  budget: 'budget',
  progress: 'progress',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  title: 'title',
  assignedTo: 'assignedTo',
  status: 'status',
  dueDate: 'dueDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ResourceAllocationScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  projectId: 'projectId',
  utilization: 'utilization',
  createdAt: 'createdAt'
};

exports.Prisma.AssetScalarFieldEnum = {
  id: 'id',
  name: 'name',
  category: 'category',
  serialNumber: 'serialNumber',
  purchaseDate: 'purchaseDate',
  purchaseCost: 'purchaseCost',
  currentValue: 'currentValue',
  assignedTo: 'assignedTo',
  status: 'status',
  location: 'location',
  tagNumber: 'tagNumber',
  receiptUrl: 'receiptUrl',
  disposalDate: 'disposalDate',
  disposalType: 'disposalType',
  disposalReason: 'disposalReason',
  disposalValue: 'disposalValue',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AssetRequestScalarFieldEnum = {
  id: 'id',
  requesterName: 'requesterName',
  department: 'department',
  category: 'category',
  description: 'description',
  urgency: 'urgency',
  status: 'status',
  approvedBy: 'approvedBy',
  rejectionReason: 'rejectionReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IncidentScalarFieldEnum = {
  id: 'id',
  assetId: 'assetId',
  reportedBy: 'reportedBy',
  description: 'description',
  date: 'date',
  status: 'status',
  resolution: 'resolution',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StaffClearanceScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  employeeName: 'employeeName',
  requestDate: 'requestDate',
  deptStatus: 'deptStatus',
  assetStatus: 'assetStatus',
  financeStatus: 'financeStatus',
  hrStatus: 'hrStatus',
  finalStatus: 'finalStatus',
  remarks: 'remarks',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TravelRequestScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  employeeName: 'employeeName',
  destination: 'destination',
  purpose: 'purpose',
  travelDate: 'travelDate',
  returnDate: 'returnDate',
  estimatedCost: 'estimatedCost',
  advanceAmount: 'advanceAmount',
  transportMode: 'transportMode',
  status: 'status',
  approvedBy: 'approvedBy',
  rejectionReason: 'rejectionReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VehicleScalarFieldEnum = {
  id: 'id',
  plateNumber: 'plateNumber',
  model: 'model',
  capacity: 'capacity',
  status: 'status',
  driverName: 'driverName',
  createdAt: 'createdAt'
};

exports.Prisma.ShipmentScalarFieldEnum = {
  id: 'id',
  trackingCode: 'trackingCode',
  origin: 'origin',
  destination: 'destination',
  vehicleId: 'vehicleId',
  driverName: 'driverName',
  status: 'status',
  estimatedDelivery: 'estimatedDelivery',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TimesheetScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  employeeName: 'employeeName',
  date: 'date',
  hours: 'hours',
  description: 'description',
  projectId: 'projectId',
  taskId: 'taskId',
  supervisorStatus: 'supervisorStatus',
  supervisorBy: 'supervisorBy',
  supervisorAt: 'supervisorAt',
  financeStatus: 'financeStatus',
  financeBy: 'financeBy',
  financeAt: 'financeAt',
  hrStatus: 'hrStatus',
  hrBy: 'hrBy',
  hrAt: 'hrAt',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Employee: 'Employee',
  JobPosting: 'JobPosting',
  Application: 'Application',
  ExpenseRequest: 'ExpenseRequest',
  Account: 'Account',
  JournalEntry: 'JournalEntry',
  JournalLine: 'JournalLine',
  Invoice: 'Invoice',
  InvoiceItem: 'InvoiceItem',
  PayrollRun: 'PayrollRun',
  PayrollLine: 'PayrollLine',
  LeaveRequest: 'LeaveRequest',
  ForecastAssumption: 'ForecastAssumption',
  Project: 'Project',
  Task: 'Task',
  ResourceAllocation: 'ResourceAllocation',
  Asset: 'Asset',
  AssetRequest: 'AssetRequest',
  Incident: 'Incident',
  StaffClearance: 'StaffClearance',
  TravelRequest: 'TravelRequest',
  Vehicle: 'Vehicle',
  Shipment: 'Shipment',
  Timesheet: 'Timesheet'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
