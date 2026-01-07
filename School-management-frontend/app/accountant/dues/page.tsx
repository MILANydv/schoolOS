"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Hourglass,
  Mail,
  MessageSquare,
  Filter,
  Search,
  Download,
  Eye,
  IndianRupee,
  AlertTriangle,
  Users,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CRUDTable } from "@/components/table/crud-table"
import { DueDetailsDialog } from "@/components/dialog/due-detail-dialog"

/* -----------------------------------------------------------------------------
 * Types & Mock data
 * -------------------------------------------------------------------------- */
interface Due {
  id: string
  studentName: string
  rollNo: string
  class: string
  feeType: string
  amount: number
  dueDate: string // ISO date string
  status: "Overdue" | "Due Soon" | "Pending"
  daysOverdue: number
  contactEmail: string
  contactPhone: string
}

// Demo data – replace with real API results
const mockDues: Due[] = [
  {
    id: "1",
    studentName: "John Doe",
    rollNo: "001",
    class: "Class 10-A",
    feeType: "Tuition Fee",
    amount: 15000,
    dueDate: "2024-01-15",
    status: "Overdue",
    daysOverdue: 15,
    contactEmail: "john.doe@example.com",
    contactPhone: "+919876543210",
  },
  {
    id: "2",
    studentName: "Jane Smith",
    rollNo: "002",
    class: "Class 10-A",
    feeType: "Transport Fee",
    amount: 8000,
    dueDate: "2024-02-05",
    status: "Due Soon",
    daysOverdue: 0,
    contactEmail: "jane.smith@example.com",
    contactPhone: "+919876543211",
  },
  {
    id: "3",
    studentName: "Mike Johnson",
    rollNo: "003",
    class: "Class 9-B",
    feeType: "Library Fee",
    amount: 2000,
    dueDate: "2024-03-10",
    status: "Pending",
    daysOverdue: 0,
    contactEmail: "mike.j@example.com",
    contactPhone: "+919876543212",
  },
  {
    id: "4",
    studentName: "Emily White",
    rollNo: "004",
    class: "Class 11-C",
    feeType: "Exam Fee",
    amount: 5000,
    dueDate: "2024-01-01",
    status: "Overdue",
    daysOverdue: 45,
    contactEmail: "emily.w@example.com",
    contactPhone: "+919876543213",
  },
  {
    id: "5",
    studentName: "David Brown",
    rollNo: "005",
    class: "Class 10-A",
    feeType: "Tuition Fee",
    amount: 15000,
    dueDate: "2024-02-28",
    status: "Pending",
    daysOverdue: 0,
    contactEmail: "david.b@example.com",
    contactPhone: "+919876543214",
  },
]

/* -----------------------------------------------------------------------------
 * Page Component
 * -------------------------------------------------------------------------- */
export default function DuesPage() {
  const [dues, setDues] = useState<Due[]>([] as Due[])
  const [loading, setLoading] = useState(true)
  const [classFilter, setClassFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDue, setSelectedDue] = useState<Due | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Simulate data fetching
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setDues(mockDues)
      setLoading(false)
    }, 1000) // Simulate network delay
    return () => clearTimeout(timer)
  }, [])

  /* ------------------------------ Helper ---------------------------------- */
  const handleSendReminder = (due: Due, type: "sms" | "email") => {
    console.log(`Sending ${type.toUpperCase()} reminder to:`, due.studentName)
    alert(`${type.toUpperCase()} reminder sent to ${due.studentName}`)
  }
  const handleExportData = () => {
    alert("Exporting data to CSV...")
    // Implementation for exporting data would go here
  }
  const handleViewDetails = (due: Due) => {
    setSelectedDue(due)
    setIsDetailsDialogOpen(true)
  }
  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false)
    setSelectedDue(null)
  }

  /* ------------------------------ Filters --------------------------------- */
  const filteredDues = dues.filter((due) => {
    const matchesClass = classFilter === "all" || due.class === classFilter
    const matchesStatus = statusFilter === "all" || due.status === statusFilter
    const matchesSearch =
      !searchTerm || due.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || due.rollNo.includes(searchTerm)
    return matchesClass && matchesStatus && matchesSearch
  })

  /* --------------------------- ColumnDefs --------------------------------- */
  const columns: ColumnDef<Due>[] = [
    {
      id: "student",
      header: "Student",
      accessorFn: (row) => row.studentName,
      cell: ({ row }) => {
        const due = row.original
        return (
          <div>
            <div className="font-medium">{due.studentName}</div>
            <div className="text-sm text-muted-foreground">
              {due.rollNo} • {due.class}
            </div>
          </div>
        )
      },
    },
    {
      header: "Fee Type",
      accessorKey: "feeType",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => `₹${(getValue() as number).toLocaleString()}`,
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const due = row.original
        const badgeVariant =
          due.status === "Overdue" ? "destructive" : due.status === "Due Soon" ? "default" : "secondary"
        return (
          <div>
            <Badge variant={badgeVariant}>{due.status}</Badge>
            {due.daysOverdue > 0 && <div className="mt-1 text-xs text-red-600">{due.daysOverdue} days overdue</div>}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const due = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleSendReminder(due, "sms")}>
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Send SMS</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleSendReminder(due, "email")}>
              <Mail className="h-4 w-4" />
              <span className="sr-only">Send Email</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleViewDetails(due)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Details</span>
            </Button>
          </div>
        )
      },
    },
  ]

  /* --------------------------- Totals / Stats ----------------------------- */
  const totalDues = filteredDues.reduce((sum, d) => sum + d.amount, 0)
  const overdue = filteredDues.filter((d) => d.status === "Overdue")
  const overdueTotal = overdue.reduce((sum, d) => sum + d.amount, 0)

  /* ------------------------------ Render ---------------------------------- */
  return (
    <main className="space-y-6 p-6 md:p-8 lg:p-10">
      {/* Page header with search ------------------------------------------------------- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Dues</h1>
          <p className="text-muted-foreground">Track outstanding fees and send reminders</p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats and Filters in same section -------------------------------------------- */}
      <div className="grid gap-6">
        {/* Stat Cards -------------------------------------------------------- */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹{totalDues.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Outstanding</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{overdue.length}</div>
                <p className="text-xs text-muted-foreground">Overdue Payments</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">₹{overdueTotal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Overdue Amount</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{filteredDues.length}</div>
                <p className="text-xs text-muted-foreground">Total Records</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simplified Filters -------------------------------------------------- */}
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <div className="w-full sm:w-auto">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                <SelectItem value="Class 9-B">Class 9-B</SelectItem>
                <SelectItem value="Class 11-C">Class 11-C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Due Soon">Due Soon</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setClassFilter("all")
              setStatusFilter("all")
              setSearchTerm("")
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table ------------------------------------------------------------- */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hourglass className="h-5 w-5" />
            Outstanding Dues
          </CardTitle>
          <CardDescription>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {"Loading records..."}
              </div>
            ) : (
              `Showing ${filteredDues.length} of ${dues.length} records`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <CRUDTable data={filteredDues} columns={columns} filterColumn="studentName" />
          )}
        </CardContent>
      </Card>

      {selectedDue && (
        <DueDetailsDialog due={selectedDue} isOpen={isDetailsDialogOpen} onClose={handleCloseDetailsDialog} />
      )}
    </main>
  )
}
