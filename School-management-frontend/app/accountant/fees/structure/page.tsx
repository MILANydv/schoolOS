"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  Search,
  Download,
  RefreshCw,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  List,
  Grid3X3,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Send,
  Eye,
  CreditCard,
  FileText,
  Bell,
  TrendingUp,
  Users,
  PieChart,
  BarChart3,
} from "lucide-react"

// Enhanced fee data structure
const initialFeeData = [
  {
    id: "1",
    studentName: "Alice Johnson",
    studentId: "1001",
    class: "8A",
    feeType: "Academic Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 15000,
    dueDate: "2024-02-15",
    status: "Paid",
    paymentDate: "2024-02-10",
    paymentMethod: "Online",
    isMandatory: true,
    remarks: "Paid online via UPI",
  },
  {
    id: "2",
    studentName: "Alice Johnson",
    studentId: "1001",
    class: "8A",
    feeType: "Library Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 1500,
    dueDate: "2024-02-20",
    status: "Paid",
    paymentDate: "2024-02-18",
    paymentMethod: "Online",
    isMandatory: true,
    remarks: "Annual library maintenance",
  },
  {
    id: "3",
    studentName: "Alice Johnson",
    studentId: "1001",
    class: "8A",
    feeType: "Laboratory Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 2000,
    dueDate: "2024-02-25",
    status: "Paid",
    paymentDate: "2024-02-22",
    paymentMethod: "Cash",
    isMandatory: true,
    remarks: "Science lab equipment",
  },
  {
    id: "4",
    studentName: "Alice Johnson",
    studentId: "1001",
    class: "8A",
    feeType: "Transportation Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 3000,
    dueDate: "2024-02-10",
    status: "Pending",
    paymentDate: null,
    paymentMethod: null,
    isMandatory: false,
    remarks: "Bus route: Main Street",
  },
  {
    id: "5",
    studentName: "Bob Williams",
    studentId: "1002",
    class: "8A",
    feeType: "Academic Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 15000,
    dueDate: "2024-02-15",
    status: "Overdue",
    paymentDate: null,
    paymentMethod: null,
    isMandatory: true,
    remarks: "",
  },
  {
    id: "6",
    studentName: "Bob Williams",
    studentId: "1002",
    class: "8A",
    feeType: "Library Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 1500,
    dueDate: "2024-02-20",
    status: "Pending",
    paymentDate: null,
    paymentMethod: null,
    isMandatory: true,
    remarks: "",
  },
  {
    id: "7",
    studentName: "Carol Davis",
    studentId: "1003",
    class: "9B",
    feeType: "Academic Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 16000,
    dueDate: "2024-02-15",
    status: "Pending",
    paymentDate: null,
    paymentMethod: null,
    isMandatory: true,
    remarks: "",
  },
  {
    id: "8",
    studentName: "David Brown",
    studentId: "1004",
    class: "9B",
    feeType: "Transportation Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 3500,
    dueDate: "2024-02-10",
    status: "Overdue",
    paymentDate: null,
    paymentMethod: null,
    isMandatory: false,
    remarks: "Bus route: Park Avenue",
  },
  {
    id: "9",
    studentName: "Emma Wilson",
    studentId: "1005",
    class: "8B",
    feeType: "Academic Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 15000,
    dueDate: "2024-02-15",
    status: "Paid",
    paymentDate: "2024-02-14",
    paymentMethod: "Cash",
    isMandatory: true,
    remarks: "Paid at school office",
  },
  {
    id: "10",
    studentName: "Frank Miller",
    studentId: "1006",
    class: "9A",
    feeType: "Academic Fee",
    term: "Quarter 1",
    year: "2024-25",
    amount: 16000,
    dueDate: "2024-02-15",
    status: "Overdue",
    paymentDate: null,
    paymentMethod: null,
    isMandatory: true,
    remarks: "",
  },
]

// Class data with fee information
const classData = [
  {
    id: "8A",
    className: "8A",
    students: 25,
    totalFees: 487500,
    collectedFees: 390000,
    pendingFees: 97500,
    overdueFees: 15000,
    mandatoryPending: 2,
    optionalPending: 1,
    collectionRate: 80,
  },
  {
    id: "8B",
    className: "8B",
    students: 28,
    totalFees: 546000,
    collectedFees: 436800,
    pendingFees: 109200,
    overdueFees: 22000,
    mandatoryPending: 3,
    optionalPending: 2,
    collectionRate: 78,
  },
  {
    id: "9A",
    className: "9A",
    students: 30,
    totalFees: 600000,
    collectedFees: 540000,
    pendingFees: 60000,
    overdueFees: 8000,
    mandatoryPending: 1,
    optionalPending: 1,
    collectionRate: 90,
  },
  {
    id: "9B",
    className: "9B",
    students: 26,
    totalFees: 520000,
    collectedFees: 416000,
    pendingFees: 104000,
    overdueFees: 18000,
    mandatoryPending: 4,
    optionalPending: 1,
    collectionRate: 80,
  },
]

// Fee structure by class
const feeStructureByClass = {
  "8A": [
    { type: "Academic Fee", amount: 15000, mandatory: true },
    { type: "Library Fee", amount: 1500, mandatory: true },
    { type: "Laboratory Fee", amount: 2000, mandatory: true },
    { type: "Sports Fee", amount: 1000, mandatory: true },
    { type: "Transportation Fee", amount: 3000, mandatory: false },
  ],
  "8B": [
    { type: "Academic Fee", amount: 15000, mandatory: true },
    { type: "Library Fee", amount: 1500, mandatory: true },
    { type: "Laboratory Fee", amount: 2000, mandatory: true },
    { type: "Sports Fee", amount: 1000, mandatory: true },
    { type: "Transportation Fee", amount: 3000, mandatory: false },
  ],
  "9A": [
    { type: "Academic Fee", amount: 16000, mandatory: true },
    { type: "Library Fee", amount: 1800, mandatory: true },
    { type: "Laboratory Fee", amount: 2500, mandatory: true },
    { type: "Sports Fee", amount: 1200, mandatory: true },
    { type: "Transportation Fee", amount: 3500, mandatory: false },
  ],
  "9B": [
    { type: "Academic Fee", amount: 16000, mandatory: true },
    { type: "Library Fee", amount: 1800, mandatory: true },
    { type: "Laboratory Fee", amount: 2500, mandatory: true },
    { type: "Sports Fee", amount: 1200, mandatory: true },
    { type: "Transportation Fee", amount: 3500, mandatory: false },
  ],
}

export default function FeeManagementWithStats() {
  const [fees, setFees] = useState(initialFeeData)
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("All Classes")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [feeTypeFilter, setFeeTypeFilter] = useState("All Types")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [selectedFees, setSelectedFees] = useState<string[]>([])
  const [expandedClasses, setExpandedClasses] = useState<string[]>(["8A"])
  const [addFeeDialogOpen, setAddFeeDialogOpen] = useState(false)
  const [editingFee, setEditingFee] = useState<any>(null)
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false)
  const [selectedFeeDetails, setSelectedFeeDetails] = useState<any>(null)
  const [feeStructureDialogOpen, setFeeStructureDialogOpen] = useState(false)
  const [statsDialogOpen, setStatsDialogOpen] = useState(false)
  const [selectedStatsType, setSelectedStatsType] = useState<string>("")

  const { toast } = useToast()

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const pending = fees.filter((f) => f.status === "Pending")
    const overdue = fees.filter((f) => f.status === "Overdue")
    const paid = fees.filter((f) => f.status === "Paid")
    const total = fees.length
    const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0)
    const collectedAmount = paid.reduce((sum, f) => sum + f.amount, 0)
    const pendingAmount = pending.reduce((sum, f) => sum + f.amount, 0)
    const overdueAmount = overdue.reduce((sum, f) => sum + f.amount, 0)
    const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

    // Fee type breakdown
    const feeTypeStats = fees.reduce(
      (acc, fee) => {
        if (!acc[fee.feeType]) {
          acc[fee.feeType] = { total: 0, paid: 0, pending: 0, overdue: 0, amount: 0, paidAmount: 0 }
        }
        acc[fee.feeType].total += 1
        acc[fee.feeType].amount += fee.amount
        if (fee.status === "Paid") {
          acc[fee.feeType].paid += 1
          acc[fee.feeType].paidAmount += fee.amount
        } else if (fee.status === "Pending") {
          acc[fee.feeType].pending += 1
        } else if (fee.status === "Overdue") {
          acc[fee.feeType].overdue += 1
        }
        return acc
      },
      {} as Record<string, any>,
    )

    // Class breakdown
    const classStats = fees.reduce(
      (acc, fee) => {
        if (!acc[fee.class]) {
          acc[fee.class] = { total: 0, paid: 0, pending: 0, overdue: 0, amount: 0, paidAmount: 0, students: new Set() }
        }
        acc[fee.class].total += 1
        acc[fee.class].amount += fee.amount
        acc[fee.class].students.add(fee.studentId)
        if (fee.status === "Paid") {
          acc[fee.class].paid += 1
          acc[fee.class].paidAmount += fee.amount
        } else if (fee.status === "Pending") {
          acc[fee.class].pending += 1
        } else if (fee.status === "Overdue") {
          acc[fee.class].overdue += 1
        }
        return acc
      },
      {} as Record<string, any>,
    )

    // Convert students Set to count
    Object.keys(classStats).forEach((key) => {
      classStats[key].studentCount = classStats[key].students.size
      delete classStats[key].students
    })

    // Payment method breakdown
    const paymentMethodStats = paid.reduce(
      (acc, fee) => {
        const method = fee.paymentMethod || "Unknown"
        if (!acc[method]) {
          acc[method] = { count: 0, amount: 0 }
        }
        acc[method].count += 1
        acc[method].amount += fee.amount
        return acc
      },
      {} as Record<string, any>,
    )

    // Monthly collection trend (mock data for demo)
    const monthlyTrend = [
      { month: "Jan", collected: 450000, target: 500000 },
      { month: "Feb", collected: collectedAmount, target: totalAmount },
      { month: "Mar", collected: 0, target: 600000 },
    ]

    return {
      pending: pending.length,
      overdue: overdue.length,
      paid: paid.length,
      total,
      totalAmount,
      collectedAmount,
      pendingAmount,
      overdueAmount,
      collectionRate,
      feeTypeStats,
      classStats,
      paymentMethodStats,
      monthlyTrend,
      uniqueStudents: new Set(fees.map((f) => f.studentId)).size,
      averageFeeAmount: total > 0 ? Math.round(totalAmount / total) : 0,
    }
  }, [fees])

  // Filter fees
  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchesSearch =
        searchTerm === "" ||
        fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.feeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.studentId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClass = classFilter === "All Classes" || fee.class === classFilter
      const matchesStatus = statusFilter === "All Status" || fee.status === statusFilter
      const matchesFeeType = feeTypeFilter === "All Types" || fee.feeType === feeTypeFilter

      return matchesSearch && matchesClass && matchesStatus && matchesFeeType
    })
  }, [fees, searchTerm, classFilter, statusFilter, feeTypeFilter])

  // Handler functions
  const handleAddFee = (formData: any) => {
    if (formData.generateAll) {
      // Generate all fees for the student
      const classStructure = feeStructureByClass[formData.class as keyof typeof feeStructureByClass] || []
      const newFees = classStructure.map((feeStructure, index) => ({
        id: `${Date.now()}-${index}`,
        studentName: formData.studentName,
        studentId: formData.studentId,
        class: formData.class,
        feeType: feeStructure.type,
        term: formData.term,
        year: formData.year,
        amount: feeStructure.amount,
        dueDate: formData.dueDate,
        status: "Pending",
        paymentDate: null,
        paymentMethod: null,
        isMandatory: feeStructure.mandatory,
        remarks: formData.remarks,
      }))
      setFees((prev) => [...prev, ...newFees])
      toast({
        title: "Fees Generated",
        description: `${newFees.length} fees generated for ${formData.studentName}`,
      })
    } else {
      // Add single fee
      const newFee = {
        id: Date.now().toString(),
        ...formData,
        status: "Pending",
        paymentDate: null,
        paymentMethod: null,
      }
      setFees((prev) => [...prev, newFee])
      toast({
        title: "Fee Added",
        description: `Fee added successfully for ${formData.studentName}`,
      })
    }
    setAddFeeDialogOpen(false)
  }

  const handleEditFee = (fee: any) => {
    setEditingFee(fee)
    setAddFeeDialogOpen(true)
  }

  const handleUpdateFee = (formData: any) => {
    setFees((prev) => prev.map((f) => (f.id === editingFee.id ? { ...f, ...formData } : f)))
    setEditingFee(null)
    setAddFeeDialogOpen(false)
    toast({
      title: "Fee Updated",
      description: "Fee details updated successfully",
    })
  }

  const handleDeleteFee = (id: string) => {
    setFees((prev) => prev.filter((f) => f.id !== id))
    toast({
      title: "Fee Deleted",
      description: "Fee record deleted successfully",
      variant: "destructive",
    })
  }

  const handleMarkAsPaid = (id: string) => {
    setFees((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: "Paid",
              paymentDate: new Date().toISOString().split("T")[0],
              paymentMethod: "Manual",
            }
          : f,
      ),
    )
    toast({
      title: "Payment Recorded",
      description: "Fee marked as paid successfully",
    })
  }

  const handleSendReminder = (fee: any) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${fee.studentName}`,
    })
  }

  const handleViewDetails = (fee: any) => {
    setSelectedFeeDetails(fee)
    setViewDetailsDialogOpen(true)
  }

  // Stats card click handlers
  const handleStatsCardClick = (statsType: string) => {
    setSelectedStatsType(statsType)
    setStatsDialogOpen(true)
  }

  // Quick Actions
  const handleApproveAll = () => {
    const pendingIds = fees.filter((f) => f.status === "Pending").map((f) => f.id)
    setFees((prev) =>
      prev.map((f) =>
        pendingIds.includes(f.id)
          ? {
              ...f,
              status: "Paid",
              paymentDate: new Date().toISOString().split("T")[0],
              paymentMethod: "Bulk Approval",
            }
          : f,
      ),
    )
    toast({
      title: "Bulk Payment Processed",
      description: `${pendingIds.length} fees marked as paid`,
    })
  }

  const handleMarkOverdueAsPaid = () => {
    const overdueIds = fees.filter((f) => f.status === "Overdue").map((f) => f.id)
    setFees((prev) =>
      prev.map((f) =>
        overdueIds.includes(f.id)
          ? {
              ...f,
              status: "Paid",
              paymentDate: new Date().toISOString().split("T")[0],
              paymentMethod: "Overdue Payment",
            }
          : f,
      ),
    )
    toast({
      title: "Overdue Payments Processed",
      description: `${overdueIds.length} overdue fees marked as paid`,
    })
  }

  const handleBulkReminders = () => {
    const pendingCount = fees.filter((f) => f.status === "Pending" || f.status === "Overdue").length
    toast({
      title: "Bulk Reminders Sent",
      description: `Payment reminders sent to ${pendingCount} students`,
    })
  }

  const handleGenerateReports = () => {
    const reportData = {
      totalFees: stats.total,
      totalAmount: stats.totalAmount,
      collectedAmount: stats.collectedAmount,
      pendingAmount: stats.totalAmount - stats.collectedAmount,
      collectionRate: stats.collectionRate,
    }

    // Create CSV content
    const csvContent = [
      ["Fee Management Report"],
      ["Generated on:", new Date().toLocaleDateString()],
      [""],
      ["Summary"],
      ["Total Fees", stats.total],
      ["Total Amount", `₹${stats.totalAmount.toLocaleString()}`],
      ["Collected Amount", `₹${stats.collectedAmount.toLocaleString()}`],
      ["Pending Amount", `₹${(stats.totalAmount - stats.collectedAmount).toLocaleString()}`],
      ["Collection Rate", `${stats.collectionRate}%`],
      [""],
      ["Detailed Records"],
      ["Student Name", "Student ID", "Class", "Fee Type", "Amount", "Status", "Due Date"],
      ...filteredFees.map((fee) => [
        fee.studentName,
        fee.studentId,
        fee.class,
        fee.feeType,
        `₹${fee.amount.toLocaleString()}`,
        fee.status,
        fee.dueDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fee-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast({
      title: "Report Generated",
      description: "Fee collection report has been downloaded",
    })
  }

  const handleExportData = () => {
    const csvContent = [
      ["Student Name", "Student ID", "Class", "Fee Type", "Amount", "Status", "Due Date", "Payment Date", "Remarks"],
      ...filteredFees.map((fee) => [
        fee.studentName,
        fee.studentId,
        fee.class,
        fee.feeType,
        fee.amount,
        fee.status,
        fee.dueDate,
        fee.paymentDate || "",
        fee.remarks,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fee-data-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast({
      title: "Data Exported",
      description: "Fee data has been exported successfully",
    })
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setClassFilter("All Classes")
    setStatusFilter("All Status")
    setFeeTypeFilter("All Types")
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    })
  }

  // Class Management Actions
  const handleClassApproveAll = (className: string) => {
    const classFeesIds = fees
      .filter((f) => f.class === className && (f.status === "Pending" || f.status === "Overdue"))
      .map((f) => f.id)

    setFees((prev) =>
      prev.map((f) =>
        classFeesIds.includes(f.id)
          ? {
              ...f,
              status: "Paid",
              paymentDate: new Date().toISOString().split("T")[0],
              paymentMethod: "Class Bulk Payment",
            }
          : f,
      ),
    )

    toast({
      title: "Class Fees Processed",
      description: `All pending fees for ${className} marked as paid`,
    })
  }

  const handleClassReminders = (className: string) => {
    const pendingCount = fees.filter(
      (f) => f.class === className && (f.status === "Pending" || f.status === "Overdue"),
    ).length

    toast({
      title: "Class Reminders Sent",
      description: `Payment reminders sent to ${pendingCount} students in ${className}`,
    })
  }

  const handleClassReport = (className: string) => {
    const classData = fees.filter((f) => f.class === className)
    const csvContent = [
      [`Fee Report for Class ${className}`],
      ["Generated on:", new Date().toLocaleDateString()],
      [""],
      ["Student Name", "Student ID", "Fee Type", "Amount", "Status", "Due Date"],
      ...classData.map((fee) => [
        fee.studentName,
        fee.studentId,
        fee.feeType,
        `₹${fee.amount.toLocaleString()}`,
        fee.status,
        fee.dueDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${className}-fee-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast({
      title: "Class Report Generated",
      description: `Fee report for ${className} has been downloaded`,
    })
  }

  const toggleClassExpansion = (classId: string) => {
    setExpandedClasses((prev) => (prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 text-xs">✓ Paid</Badge>
      case "Pending":
        return <Badge className="bg-orange-100 text-orange-800 text-xs">⏳ Pending</Badge>
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800 text-xs">⚠ Overdue</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Fee Management</h1>
              <p className="text-sm text-gray-600">Manage student fee payments and track collections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={addFeeDialogOpen} onOpenChange={setAddFeeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Fee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingFee ? "Edit Fee" : "Add New Fee"}</DialogTitle>
                </DialogHeader>
                <AddFeeForm
                  onSubmit={editingFee ? handleUpdateFee : handleAddFee}
                  initialData={editingFee}
                  onCancel={() => {
                    setAddFeeDialogOpen(false)
                    setEditingFee(null)
                  }}
                />
              </DialogContent>
            </Dialog>
            <div className="text-xs text-gray-500 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stats.pending} pending
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {stats.overdue} overdue
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {stats.collectionRate}% collected
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent"
              onClick={() => setStatusFilter("Pending")}
            >
              <Clock className="w-3 h-3 mr-1" />
              Pending ({stats.pending})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
              onClick={() => setStatusFilter("Overdue")}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Overdue ({stats.overdue})
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700 text-white" onClick={handleApproveAll}>
              <CheckCircle className="w-3 h-3 mr-1" />
              Mark All Paid
            </Button>
            <Button
              size="sm"
              className="text-xs bg-red-600 hover:bg-red-700 text-white"
              onClick={handleMarkOverdueAsPaid}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Pay Overdue
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Class Management */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Class Management</h2>
            <p className="text-xs text-gray-600 mb-3">Filter by class and fee status</p>

            <div className="relative mb-4">
              <Search className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{classData.length}</div>
                <div className="text-xs text-gray-600">Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {classData.filter((c) => c.mandatoryPending > 0 || c.optionalPending > 0).length}
                </div>
                <div className="text-xs text-gray-600">Need Collection</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Filters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Class</label>
                <select
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option>All Classes</option>
                  {classData.map((cls) => (
                    <option key={cls.id} value={cls.className}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Fee Type</label>
                <select
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={feeTypeFilter}
                  onChange={(e) => setFeeTypeFilter(e.target.value)}
                >
                  <option>All Types</option>
                  <option>Academic Fee</option>
                  <option>Library Fee</option>
                  <option>Laboratory Fee</option>
                  <option>Sports Fee</option>
                  <option>Transportation Fee</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Status</label>
                <select
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button
                className="w-full text-left text-xs text-green-700 hover:bg-green-50 px-2 py-1.5 rounded flex items-center gap-2"
                onClick={handleApproveAll}
              >
                <CheckCircle className="w-3 h-3" />✓ Mark All Pending as Paid
              </button>
              <button
                className="w-full text-left text-xs text-blue-700 hover:bg-blue-50 px-2 py-1.5 rounded flex items-center gap-2"
                onClick={handleBulkReminders}
              >
                <Bell className="w-3 h-3" />📧 Send All Reminders
              </button>
              <button
                className="w-full text-left text-xs text-purple-700 hover:bg-purple-50 px-2 py-1.5 rounded flex items-center gap-2"
                onClick={handleGenerateReports}
              >
                <FileText className="w-3 h-3" />📊 Generate Reports
              </button>
              <button
                className="w-full text-left text-xs text-indigo-700 hover:bg-indigo-50 px-2 py-1.5 rounded flex items-center gap-2"
                onClick={() => setFeeStructureDialogOpen(true)}
              >
                <TrendingUp className="w-3 h-3" />📋 Fee Structure
              </button>
            </div>
          </div>

          {/* Classes List */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Classes ({classData.length})</h3>
            <div className="space-y-2">
              {classData.map((classItem) => (
                <div key={classItem.id} className="border border-gray-200 rounded">
                  <div
                    className="p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleClassExpansion(classItem.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{classItem.className}</div>
                      <div className="text-xs text-gray-500">{classItem.students} students</div>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      ₹{classItem.collectedFees.toLocaleString()} / ₹{classItem.totalFees.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {classItem.mandatoryPending > 0 && (
                          <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">
                            {classItem.mandatoryPending} mandatory
                          </span>
                        )}
                        {classItem.optionalPending > 0 && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded">
                            {classItem.optionalPending} optional
                          </span>
                        )}
                        <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                          {classItem.collectionRate}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          className="w-5 h-5 bg-green-600 text-white text-xs rounded flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClassApproveAll(classItem.className)
                          }}
                          title="Mark All Paid"
                        >
                          ✓
                        </button>
                        <button
                          className="w-5 h-5 bg-blue-600 text-white text-xs rounded flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClassReminders(classItem.className)
                          }}
                          title="Send Reminders"
                        >
                          📧
                        </button>
                        <button
                          className="w-5 h-5 bg-purple-600 text-white text-xs rounded flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClassReport(classItem.className)
                          }}
                          title="Generate Report"
                        >
                          📊
                        </button>
                        {expandedClasses.includes(classItem.id) ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleStatsCardClick("total")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold tracking-tight">₹{stats.totalAmount.toLocaleString()}</p>
                    <p className="text-xs opacity-75 mt-1">{stats.total} total fees</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleStatsCardClick("collected")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90 font-medium">Collected</p>
                    <p className="text-2xl font-bold tracking-tight">₹{stats.collectedAmount.toLocaleString()}</p>
                    <p className="text-xs opacity-75 mt-1">{stats.collectionRate}% collection rate</p>
                  </div>
                  <CheckCircle className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleStatsCardClick("pending")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90 font-medium">Pending</p>
                    <p className="text-2xl font-bold tracking-tight">₹{stats.pendingAmount.toLocaleString()}</p>
                    <p className="text-xs opacity-75 mt-1">{stats.pending} pending fees</p>
                  </div>
                  <Clock className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-red-500 to-red-600 text-white cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleStatsCardClick("overdue")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-90 font-medium">Overdue</p>
                    <p className="text-2xl font-bold tracking-tight">₹{stats.overdueAmount.toLocaleString()}</p>
                    <p className="text-xs opacity-75 mt-1">{stats.overdue} overdue fees</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleStatsCardClick("students")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.uniqueStudents}</p>
                    <p className="text-xs text-gray-500 mt-1">Across {Object.keys(stats.classStats).length} classes</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleStatsCardClick("average")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Fee</p>
                    <p className="text-3xl font-bold text-gray-900">₹{stats.averageFeeAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Per fee record</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleStatsCardClick("feeTypes")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fee Types</p>
                    <p className="text-3xl font-bold text-gray-900">{Object.keys(stats.feeTypeStats).length}</p>
                    <p className="text-xs text-gray-500 mt-1">Different fee categories</p>
                  </div>
                  <PieChart className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Header */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Fee Records</h2>
                  <p className="text-sm text-gray-600">
                    Showing 1-{Math.min(filteredFees.length, 15)} of {filteredFees.length} fee records
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
                    <button
                      className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                        viewMode === "table" ? "bg-white shadow-sm" : "text-gray-600"
                      }`}
                      onClick={() => setViewMode("table")}
                    >
                      <List className="w-3 h-3" />
                      Table
                    </button>
                    <button
                      className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                        viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-600"
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-3 h-3" />
                      Grid
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                    <DollarSign className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Fee Records</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {filteredFees.length} items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    onClick={handleClearFilters}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Clear
                  </button>
                  <button
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    onClick={handleExportData}
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                  <span className="text-xs text-gray-500">
                    {filteredFees.length} of {fees.length}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Showing 1-{Math.min(filteredFees.length, 15)} of {filteredFees.length} fee records
              </p>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fees by student name, fee type, or student ID..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Table/Grid View */}
              {viewMode === "table" ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">
                          <Checkbox />
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Student</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Fee Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Due Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFees.slice(0, 15).map((fee) => (
                        <tr key={fee.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <Checkbox />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                                {fee.studentName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{fee.studentName}</div>
                                <div className="text-xs text-gray-500">
                                  {fee.studentId} • {fee.class}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block text-xs px-2 py-1 rounded ${
                                  fee.isMandatory ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {fee.feeType}
                              </span>
                              {fee.isMandatory && <span className="text-xs text-red-600 font-medium">*</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-mono text-sm">₹{fee.amount.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">{fee.term}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">{new Date(fee.dueDate).toLocaleDateString()}</div>
                            {fee.status === "Overdue" && (
                              <div className="text-xs text-red-600">
                                {Math.ceil(
                                  (new Date().getTime() - new Date(fee.dueDate).getTime()) / (1000 * 60 * 60 * 24),
                                )}{" "}
                                days overdue
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(fee.status)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleViewDetails(fee)}
                                title="View Details"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEditFee(fee)}
                                title="Edit Fee"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              {fee.status !== "Paid" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-green-600"
                                  onClick={() => handleMarkAsPaid(fee.id)}
                                  title="Mark as Paid"
                                >
                                  <CreditCard className="w-3 h-3" />
                                </Button>
                              )}
                              {fee.status !== "Paid" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-blue-600"
                                  onClick={() => handleSendReminder(fee)}
                                  title="Send Reminder"
                                >
                                  <Send className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-600"
                                onClick={() => handleDeleteFee(fee.id)}
                                title="Delete Fee"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFees.slice(0, 15).map((fee) => (
                    <Card key={fee.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                              {fee.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{fee.studentName}</div>
                              <div className="text-xs text-gray-500">
                                {fee.studentId} • {fee.class}
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(fee.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Fee Type:</span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  fee.isMandatory ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {fee.feeType}
                              </span>
                              {fee.isMandatory && <span className="text-xs text-red-600">*</span>}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-mono font-medium">₹{fee.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Due Date:</span>
                            <span>{new Date(fee.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Term:</span>
                            <span>{fee.term}</span>
                          </div>
                          {fee.status === "Overdue" && (
                            <div className="text-xs text-red-600 text-center">
                              {Math.ceil(
                                (new Date().getTime() - new Date(fee.dueDate).getTime()) / (1000 * 60 * 60 * 24),
                              )}{" "}
                              days overdue
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs bg-transparent"
                            onClick={() => handleViewDetails(fee)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs bg-transparent"
                            onClick={() => handleEditFee(fee)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          {fee.status !== "Paid" && (
                            <Button
                              size="sm"
                              className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => handleMarkAsPaid(fee.id)}
                            >
                              <CreditCard className="w-3 h-3 mr-1" />
                              Pay
                            </Button>
                          )}
                        </div>
                        {fee.status !== "Paid" && (
                          <div className="flex gap-1 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-7 text-xs bg-transparent"
                              onClick={() => handleSendReminder(fee)}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Remind
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                              onClick={() => handleDeleteFee(fee.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Details Dialog */}
      <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStatsType === "total" && "Total Revenue Details"}
              {selectedStatsType === "collected" && "Collected Revenue Details"}
              {selectedStatsType === "pending" && "Pending Fees Details"}
              {selectedStatsType === "overdue" && "Overdue Fees Details"}
              {selectedStatsType === "students" && "Student Statistics"}
              {selectedStatsType === "average" && "Average Fee Analysis"}
              {selectedStatsType === "feeTypes" && "Fee Type Breakdown"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {selectedStatsType === "total" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">₹{stats.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                      <div className="text-sm text-gray-600">Total Fees</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ₹{stats.averageFeeAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Average Fee</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Class</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.classStats).map(([className, data]: [string, any]) => (
                        <div key={className} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">Class {className}</div>
                            <div className="text-sm text-gray-600">
                              {data.studentCount} students • {data.total} fees
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-semibold">₹{data.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">
                              {data.amount > 0 ? Math.round((data.paidAmount / data.amount) * 100) : 0}% collected
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatsType === "collected" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">₹{stats.collectedAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Collected</div>
                      <div className="text-xs text-gray-500 mt-1">{stats.paid} payments received</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">{stats.collectionRate}%</div>
                      <div className="text-sm text-gray-600">Collection Rate</div>
                      <Progress value={stats.collectionRate} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.paymentMethodStats).map(([method, data]: [string, any]) => (
                        <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{method}</div>
                            <div className="text-sm text-gray-600">{data.count} payments</div>
                          </div>
                          <div className="font-mono font-semibold">₹{data.amount.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Collection by Class</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.classStats).map(([className, data]: [string, any]) => (
                        <div key={className} className="p-3 bg-gray-50 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Class {className}</div>
                            <div className="font-mono font-semibold">₹{data.paidAmount.toLocaleString()}</div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                              {data.paid} of {data.total} fees paid
                            </span>
                            <span>{data.amount > 0 ? Math.round((data.paidAmount / data.amount) * 100) : 0}%</span>
                          </div>
                          <Progress
                            value={data.amount > 0 ? (data.paidAmount / data.amount) * 100 : 0}
                            className="mt-2 h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatsType === "pending" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600">₹{stats.pendingAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Pending Amount</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
                      <div className="text-sm text-gray-600">Pending Fees</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Fees List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {fees
                        .filter((f) => f.status === "Pending")
                        .map((fee) => (
                          <div
                            key={fee.id}
                            className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200"
                          >
                            <div>
                              <div className="font-medium">{fee.studentName}</div>
                              <div className="text-sm text-gray-600">
                                {fee.feeType} • {fee.class}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-semibold">₹{fee.amount.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">
                                Due: {new Date(fee.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatsType === "overdue" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-red-600">₹{stats.overdueAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Overdue Amount</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
                      <div className="text-sm text-gray-600">Overdue Fees</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Overdue Fees List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {fees
                        .filter((f) => f.status === "Overdue")
                        .map((fee) => (
                          <div
                            key={fee.id}
                            className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200"
                          >
                            <div>
                              <div className="font-medium">{fee.studentName}</div>
                              <div className="text-sm text-gray-600">
                                {fee.feeType} • {fee.class}
                              </div>
                              <div className="text-xs text-red-600">
                                {Math.ceil(
                                  (new Date().getTime() - new Date(fee.dueDate).getTime()) / (1000 * 60 * 60 * 24),
                                )}{" "}
                                days overdue
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-semibold">₹{fee.amount.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">
                                Due: {new Date(fee.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatsType === "students" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">{stats.uniqueStudents}</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">{Object.keys(stats.classStats).length}</div>
                      <div className="text-sm text-gray-600">Classes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {Math.round(stats.uniqueStudents / Object.keys(stats.classStats).length)}
                      </div>
                      <div className="text-sm text-gray-600">Avg Students/Class</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Students by Class</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.classStats).map(([className, data]: [string, any]) => (
                        <div key={className} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">Class {className}</div>
                            <div className="text-sm text-gray-600">{data.total} total fees</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{data.studentCount}</div>
                            <div className="text-sm text-gray-600">students</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatsType === "feeTypes" && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Fee Type Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(stats.feeTypeStats).map(([feeType, data]: [string, any]) => (
                        <div key={feeType} className="p-4 bg-gray-50 rounded">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium text-lg">{feeType}</div>
                            <div className="font-mono font-semibold text-lg">₹{data.amount.toLocaleString()}</div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900">{data.total}</div>
                              <div className="text-xs text-gray-600">Total</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-green-600">{data.paid}</div>
                              <div className="text-xs text-gray-600">Paid</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-orange-600">{data.pending}</div>
                              <div className="text-xs text-gray-600">Pending</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-red-600">{data.overdue}</div>
                              <div className="text-xs text-gray-600">Overdue</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Collection Rate:</span>
                              <span className="font-medium">
                                {data.amount > 0 ? Math.round((data.paidAmount / data.amount) * 100) : 0}%
                              </span>
                            </div>
                            <Progress
                              value={data.amount > 0 ? (data.paidAmount / data.amount) * 100 : 0}
                              className="h-2"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Collected: ₹{data.paidAmount.toLocaleString()}</span>
                              <span>Pending: ₹{(data.amount - data.paidAmount).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatsType === "average" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        ₹{stats.averageFeeAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Average Fee Amount</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        ₹{Math.round(stats.collectedAmount / (stats.paid || 1)).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Average Payment</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Fee by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.feeTypeStats).map(([feeType, data]: [string, any]) => (
                        <div key={feeType} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{feeType}</div>
                            <div className="text-sm text-gray-600">{data.total} fees</div>
                          </div>
                          <div className="font-mono font-semibold">
                            ₹{Math.round(data.amount / (data.total || 1)).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Fee by Class</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.classStats).map(([className, data]: [string, any]) => (
                        <div key={className} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">Class {className}</div>
                            <div className="text-sm text-gray-600">
                              {data.total} fees • {data.studentCount} students
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-semibold">
                              ₹{Math.round(data.amount / (data.total || 1)).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">per fee</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsDialogOpen} onOpenChange={setViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fee Details</DialogTitle>
          </DialogHeader>
          {selectedFeeDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Student Name</label>
                  <p className="text-sm text-gray-900">{selectedFeeDetails.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Student ID</label>
                  <p className="text-sm text-gray-900">{selectedFeeDetails.studentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Class</label>
                  <p className="text-sm text-gray-900">{selectedFeeDetails.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fee Type</label>
                  <p className="text-sm text-gray-900">
                    {selectedFeeDetails.feeType}{" "}
                    {selectedFeeDetails.isMandatory && <span className="text-red-600">*</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-sm text-gray-900">₹{selectedFeeDetails.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedFeeDetails.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedFeeDetails.dueDate).toLocaleDateString()}</p>
                </div>
                {selectedFeeDetails.paymentDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Date</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedFeeDetails.paymentDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Term</label>
                  <p className="text-sm text-gray-900">{selectedFeeDetails.term}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Academic Year</label>
                  <p className="text-sm text-gray-900">{selectedFeeDetails.year}</p>
                </div>
              </div>
              {selectedFeeDetails.remarks && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Remarks</label>
                  <p className="text-sm text-gray-900">{selectedFeeDetails.remarks}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fee Structure Dialog */}
      <Dialog open={feeStructureDialogOpen} onOpenChange={setFeeStructureDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fee Structure by Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(feeStructureByClass).map(([className, structure]) => (
              <Card key={className}>
                <CardHeader>
                  <CardTitle className="text-lg">Class {className}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Fee Type</th>
                          <th className="text-left py-2">Amount</th>
                          <th className="text-left py-2">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {structure.map((fee, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{fee.type}</td>
                            <td className="py-2 font-mono">₹{fee.amount.toLocaleString()}</td>
                            <td className="py-2">
                              <Badge
                                className={fee.mandatory ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                              >
                                {fee.mandatory ? "Mandatory" : "Optional"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 font-semibold">
                          <td className="py-2">Total (Mandatory)</td>
                          <td className="py-2 font-mono">
                            ₹
                            {structure
                              .filter((f) => f.mandatory)
                              .reduce((sum, f) => sum + f.amount, 0)
                              .toLocaleString()}
                          </td>
                          <td className="py-2"></td>
                        </tr>
                        <tr className="font-semibold">
                          <td className="py-2">Total (All Fees)</td>
                          <td className="py-2 font-mono">
                            ₹{structure.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                          </td>
                          <td className="py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Enhanced Add Fee Form Component
function AddFeeForm({ onSubmit, initialData, onCancel }: any) {
  const [formData, setFormData] = useState({
    studentName: initialData?.studentName || "",
    studentId: initialData?.studentId || "",
    class: initialData?.class || "",
    feeType: initialData?.feeType || "",
    term: initialData?.term || "Quarter 1",
    year: initialData?.year || "2024-25",
    amount: initialData?.amount || "",
    dueDate: initialData?.dueDate || "",
    remarks: initialData?.remarks || "",
    generateAll: false,
  })

  const [selectedFees, setSelectedFees] = useState<string[]>([])

  const handleClassChange = (selectedClass: string) => {
    setFormData({ ...formData, class: selectedClass })
    // Auto-select all mandatory fees when class is selected
    const classStructure = feeStructureByClass[selectedClass as keyof typeof feeStructureByClass] || []
    const mandatoryFees = classStructure.filter((f) => f.mandatory).map((f) => f.type)
    setSelectedFees(mandatoryFees)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.generateAll) {
      onSubmit({
        ...formData,
        generateAll: true,
      })
    } else {
      const classStructure = feeStructureByClass[formData.class as keyof typeof feeStructureByClass] || []
      const selectedFeeStructure = classStructure.find((f) => f.type === formData.feeType)

      onSubmit({
        ...formData,
        amount: selectedFeeStructure?.amount || Number(formData.amount),
        isMandatory: selectedFeeStructure?.mandatory || false,
      })
    }
  }

  const classStructure = feeStructureByClass[formData.class as keyof typeof feeStructureByClass] || []

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentName">Student Name *</Label>
          <Input
            id="studentName"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="studentId">Student ID *</Label>
          <Input
            id="studentId"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="class">Class *</Label>
          <Select value={formData.class} onValueChange={handleClassChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classData.map((cls) => (
                <SelectItem key={cls.id} value={cls.className}>
                  {cls.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="term">Term *</Label>
          <Select value={formData.term} onValueChange={(value) => setFormData({ ...formData, term: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Quarter 1">Quarter 1</SelectItem>
              <SelectItem value="Quarter 2">Quarter 2</SelectItem>
              <SelectItem value="Quarter 3">Quarter 3</SelectItem>
              <SelectItem value="Quarter 4">Quarter 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year">Academic Year *</Label>
          <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2025-26">2025-26</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Generate All Fees Option */}
      {formData.class && !initialData && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Checkbox
              id="generateAll"
              checked={formData.generateAll}
              onCheckedChange={(checked) => setFormData({ ...formData, generateAll: !!checked })}
            />
            <Label htmlFor="generateAll" className="font-medium">
              Generate all fees for this class automatically
            </Label>
          </div>

          {formData.generateAll && (
            <div className="space-y-2">
              <p className="text-sm text-blue-800 font-medium">The following fees will be generated:</p>
              <div className="grid grid-cols-1 gap-2">
                {classStructure.map((fee, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{fee.type}</span>
                      <Badge className={fee.mandatory ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                        {fee.mandatory ? "Mandatory" : "Optional"}
                      </Badge>
                    </div>
                    <span className="font-mono text-sm">₹{fee.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                <span className="font-semibold text-green-800">Total Amount:</span>
                <span className="font-mono font-semibold text-green-800">
                  ₹{classStructure.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Single Fee Selection */}
      {!formData.generateAll && formData.class && (
        <div>
          <Label htmlFor="feeType">Fee Type *</Label>
          <Select
            value={formData.feeType}
            onValueChange={(value) => {
              const selectedFeeStructure = classStructure.find((f) => f.type === value)
              setFormData({
                ...formData,
                feeType: value,
                amount: selectedFeeStructure?.amount.toString() || "",
              })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fee type" />
            </SelectTrigger>
            <SelectContent>
              {classStructure.map((fee) => (
                <SelectItem key={fee.type} value={fee.type}>
                  {fee.type} - ₹{fee.amount.toLocaleString()}
                  {fee.mandatory ? " (Mandatory)" : " (Optional)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!formData.generateAll && formData.feeType && (
        <div>
          <Label htmlFor="amount">Amount (₹) *</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            disabled={!!classStructure.find((f) => f.type === formData.feeType)}
          />
          {classStructure.find((f) => f.type === formData.feeType) && (
            <p className="text-xs text-gray-600 mt-1">Amount is auto-filled based on class fee structure</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          rows={3}
          placeholder="Optional remarks or notes"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? "Update Fee" : formData.generateAll ? "Generate All Fees" : "Add Fee"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
