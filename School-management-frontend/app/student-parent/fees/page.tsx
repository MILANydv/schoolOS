"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  DollarSign,
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  BarChart3,
  Receipt,
  Calendar,
  Search,
  RefreshCw,
  Eye,
  FileText,
  AlertTriangle,
  CalendarDays,
  Target,
  Zap,
  Shield,
  CreditCardIcon,
  Smartphone,
  Banknote,
  SortAsc,
  SortDesc,
  PieChart,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react"

interface FeeRecord {
  id: string
  feeType: string
  amount: number
  dueDate: string
  status: "Paid" | "Outstanding" | "Overdue"
  paidDate?: string
  transactionId?: string
  paymentMethod?: string
  description?: string
  category: "Tuition" | "Transport" | "Library" | "Sports" | "Other"
  lateFee?: number
  discount?: number
  installment?: boolean
  installmentNumber?: number
  totalInstallments?: number
  priority?: "High" | "Medium" | "Low"
}

// Enhanced mock data
const mockFeeRecords: FeeRecord[] = [
  {
    id: "1",
    feeType: "Tuition Fee - August 2025",
    amount: 15000,
    dueDate: "2025-08-01",
    status: "Outstanding",
    description: "Monthly tuition fee for August 2025",
    category: "Tuition",
    installment: true,
    installmentNumber: 1,
    totalInstallments: 12,
    priority: "High",
  },
  {
    id: "2",
    feeType: "Transport Fee - July 2025",
    amount: 3000,
    dueDate: "2025-07-15",
    status: "Overdue",
    description: "Monthly transport fee for July 2025",
    category: "Transport",
    lateFee: 150,
    priority: "High",
  },
  {
    id: "3",
    feeType: "Library Membership",
    amount: 500,
    dueDate: "2025-06-30",
    status: "Paid",
    paidDate: "2025-06-25",
    transactionId: "TXN123456",
    paymentMethod: "Online Banking",
    description: "Annual library membership fee",
    category: "Library",
    priority: "Low",
  },
  {
    id: "4",
    feeType: "Sports Facility Fee",
    amount: 2000,
    dueDate: "2025-08-15",
    status: "Outstanding",
    description: "Sports facility usage fee for semester",
    category: "Sports",
    priority: "Medium",
  },
  {
    id: "5",
    feeType: "Laboratory Fee",
    amount: 1000,
    dueDate: "2025-07-30",
    status: "Paid",
    paidDate: "2025-07-28",
    transactionId: "TXN789012",
    paymentMethod: "Credit Card",
    description: "Science laboratory usage fee",
    category: "Other",
    priority: "Medium",
  },
  {
    id: "6",
    feeType: "Computer Lab Fee",
    amount: 800,
    dueDate: "2025-08-10",
    status: "Outstanding",
    description: "Computer laboratory usage fee",
    category: "Other",
    priority: "Low",
  },
  {
    id: "7",
    feeType: "Examination Fee",
    amount: 1200,
    dueDate: "2025-08-20",
    status: "Outstanding",
    description: "Mid-term examination fee",
    category: "Other",
    priority: "High",
  },
  {
    id: "8",
    feeType: "Activity Fee",
    amount: 600,
    dueDate: "2025-07-10",
    status: "Paid",
    paidDate: "2025-07-08",
    transactionId: "TXN345678",
    paymentMethod: "UPI",
    description: "Extra-curricular activities fee",
    category: "Sports",
    priority: "Low",
  },
]

const paymentMethods = [
  {
    value: "credit_card",
    label: "Credit Card",
    icon: CreditCardIcon,
    description: "Visa, MasterCard, American Express",
    fee: "2.5%",
  },
  { value: "debit_card", label: "Debit Card", icon: CreditCardIcon, description: "All major debit cards", fee: "1.5%" },
  {
    value: "online_banking",
    label: "Online Banking",
    icon: Banknote,
    description: "Net Banking, IMPS, NEFT",
    fee: "Free",
  },
  { value: "upi", label: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, Paytm", fee: "Free" },
  { value: "cash", label: "Cash", icon: DollarSign, description: "Pay at school office", fee: "Free" },
]

export default function EnhancedFeesPage() {
  const [selectedFees, setSelectedFees] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dueDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<FeeRecord | null>(null)
  const [paymentData, setPaymentData] = useState({
    method: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    notes: "",
  })

  // Calculations
  const totalFees = mockFeeRecords.reduce((sum, fee) => sum + fee.amount, 0)
  const paidFees = mockFeeRecords.filter((fee) => fee.status === "Paid").reduce((sum, fee) => sum + fee.amount, 0)
  const outstandingFees = mockFeeRecords
    .filter((fee) => fee.status === "Outstanding")
    .reduce((sum, fee) => sum + fee.amount, 0)
  const overdueFees = mockFeeRecords.filter((fee) => fee.status === "Overdue").reduce((sum, fee) => sum + fee.amount, 0)
  const lateFees = mockFeeRecords.reduce((sum, fee) => sum + (fee.lateFee || 0), 0)
  const paymentProgress = totalFees > 0 ? (paidFees / totalFees) * 100 : 0

  // Filtered and sorted fees
  const filteredAndSortedFees = useMemo(() => {
    const filtered = mockFeeRecords.filter((fee) => {
      const matchesSearch =
        fee.feeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || fee.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || fee.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    return filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof FeeRecord]
      let bValue: any = b[sortBy as keyof FeeRecord]

      if (sortBy === "dueDate" || sortBy === "paidDate") {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }

      if (sortBy === "amount") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder])

  // Upcoming due dates
  const upcomingDueDates = mockFeeRecords
    .filter((fee) => fee.status !== "Paid")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "Outstanding":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Outstanding":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Fee Type,Amount,Due Date,Status,Category,Payment Method,Transaction ID\n" +
      filteredAndSortedFees
        .map(
          (fee) =>
            `"${fee.feeType}",${fee.amount},"${fee.dueDate}","${fee.status}","${fee.category}","${fee.paymentMethod || "N/A"}","${fee.transactionId || "N/A"}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "fee_records.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openPaymentDialog = (fee: FeeRecord) => {
    setSelectedFeeForPayment(fee)
    setPaymentDialogOpen(true)
  }

  const handlePaymentSubmit = async () => {
    if (!selectedFeeForPayment) return

    // Simulate payment processing
    console.log("Processing payment:", {
      fee: selectedFeeForPayment,
      paymentData,
    })

    // Close dialog and reset
    setPaymentDialogOpen(false)
    setSelectedFeeForPayment(null)
    setPaymentData({
      method: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      notes: "",
    })

    // Show success message (you could use a toast here)
    alert("Payment processed successfully!")
  }

  const handleBulkPayment = () => {
    const selectedFeeRecords = mockFeeRecords.filter((fee) => selectedFees.includes(fee.id))
    const totalAmount = selectedFeeRecords.reduce((sum, fee) => sum + fee.amount, 0)
    console.log("Processing bulk payment for:", selectedFeeRecords, "Total:", totalAmount)
    alert(`Processing bulk payment of ₹${totalAmount.toLocaleString()} for ${selectedFees.length} fees`)
  }

  const generateReceipt = (fee: FeeRecord) => {
    const receiptContent = `
      SCHOOL FEE RECEIPT
      ==================
      
      Fee Type: ${fee.feeType}
      Amount: ₹${fee.amount.toLocaleString()}
      Payment Date: ${fee.paidDate}
      Transaction ID: ${fee.transactionId}
      Payment Method: ${fee.paymentMethod}
      
      Thank you for your payment!
    `

    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt_${fee.transactionId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-muted-foreground">Comprehensive fee tracking and payment system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Academic year 2025</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{paidFees.toLocaleString()}</div>
            <Progress value={paymentProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{paymentProgress.toFixed(1)}% completed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{outstandingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockFeeRecords.filter((f) => f.status === "Outstanding").length} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{overdueFees.toLocaleString()}</div>
            {lateFees > 0 && <div className="text-xs text-red-600 mt-1">+₹{lateFees} late fees</div>}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {mockFeeRecords
                .filter((f) => new Date(f.dueDate).getMonth() === new Date().getMonth())
                .reduce((sum, f) => sum + f.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Due this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Payment Summary Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Payment Overview
                </CardTitle>
                <CardDescription>Your fee payment status breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{paymentProgress.toFixed(0)}%</div>
                    <div className="text-sm text-green-700">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {mockFeeRecords.filter((f) => f.status === "Outstanding").length}
                    </div>
                    <div className="text-sm text-yellow-700">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {mockFeeRecords.filter((f) => f.status === "Overdue").length}
                    </div>
                    <div className="text-sm text-red-700">Overdue</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-semibold">Paid Fees</div>
                        <div className="text-sm text-muted-foreground">Successfully completed</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">₹{paidFees.toLocaleString()}</div>
                      <div className="text-sm text-green-600">{paymentProgress.toFixed(1)}% of total</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-yellow-600" />
                      <div>
                        <div className="font-semibold">Outstanding Fees</div>
                        <div className="text-sm text-muted-foreground">Due soon</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">₹{outstandingFees.toLocaleString()}</div>
                      <Button size="sm" className="mt-1">
                        Pay Now
                      </Button>
                    </div>
                  </div>

                  {overdueFees > 0 && (
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <div>
                          <div className="font-semibold">Overdue Fees</div>
                          <div className="text-sm text-muted-foreground">Immediate attention required</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">₹{overdueFees.toLocaleString()}</div>
                        <div className="text-sm text-red-600">+₹{lateFees} late fees</div>
                        <Button size="sm" variant="destructive" className="mt-1">
                          Pay Urgently
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Upcoming */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => setActiveTab("payments")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Statement
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Bell className="mr-2 h-4 w-4" />
                    Set Reminders
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Get Help
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Due Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Upcoming Due Dates
                  </CardTitle>
                  <CardDescription>Next 5 pending payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {upcomingDueDates.map((fee) => {
                        const daysUntilDue = getDaysUntilDue(fee.dueDate)
                        const isUrgent = daysUntilDue <= 7
                        const isOverdue = daysUntilDue < 0

                        return (
                          <div
                            key={fee.id}
                            className={`p-3 border rounded-lg transition-all hover:shadow-md ${
                              isOverdue
                                ? "border-red-200 bg-red-50"
                                : isUrgent
                                  ? "border-orange-200 bg-orange-50"
                                  : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{fee.feeType}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Due: {new Date(fee.dueDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className={getPriorityColor(fee.priority || "Low")}>
                                    {fee.priority}
                                  </Badge>
                                  {isOverdue && (
                                    <Badge variant="destructive" className="text-xs">
                                      {Math.abs(daysUntilDue)} days overdue
                                    </Badge>
                                  )}
                                  {isUrgent && !isOverdue && (
                                    <Badge variant="secondary" className="text-xs">
                                      {daysUntilDue} days left
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">₹{fee.amount.toLocaleString()}</div>
                                <Button
                                  size="sm"
                                  className="mt-2 w-full"
                                  variant={isOverdue ? "destructive" : "default"}
                                  onClick={() => openPaymentDialog(fee)}
                                >
                                  Pay Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Fee Categories Breakdown
              </CardTitle>
              <CardDescription>Distribution of fees across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["Tuition", "Transport", "Library", "Sports", "Other"].map((category) => {
                  const categoryFees = mockFeeRecords.filter((f) => f.category === category)
                  const categoryTotal = categoryFees.reduce((sum, f) => sum + f.amount, 0)
                  const categoryPaid = categoryFees
                    .filter((f) => f.status === "Paid")
                    .reduce((sum, f) => sum + f.amount, 0)
                  const categoryProgress = categoryTotal > 0 ? (categoryPaid / categoryTotal) * 100 : 0

                  return (
                    <div key={category} className="p-4 border rounded-lg">
                      <div className="text-sm font-medium mb-2">{category}</div>
                      <div className="text-lg font-bold">₹{categoryTotal.toLocaleString()}</div>
                      <Progress value={categoryProgress} className="mt-2" />
                      <div className="text-xs text-muted-foreground mt-1">{categoryProgress.toFixed(0)}% paid</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Fee Payments
                  </CardTitle>
                  <CardDescription>Manage and process your fee payments</CardDescription>
                </div>

                {/* Enhanced Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Tuition">Tuition</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Library">Library</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Outstanding">Outstanding</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="feeType">Fee Type</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedFees.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mt-4">
                  <span className="text-sm font-medium">
                    {selectedFees.length} fee{selectedFees.length > 1 ? "s" : ""} selected
                  </span>
                  <Button size="sm" onClick={handleBulkPayment}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Selected (₹
                    {mockFeeRecords
                      .filter((f) => selectedFees.includes(f.id))
                      .reduce((sum, f) => sum + f.amount, 0)
                      .toLocaleString()}
                    )
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedFees([])}>
                    Clear Selection
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredAndSortedFees.map((fee) => (
                    <div
                      key={fee.id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        selectedFees.includes(fee.id) ? "border-blue-300 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox for selection */}
                        <Checkbox
                          checked={selectedFees.includes(fee.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFees([...selectedFees, fee.id])
                            } else {
                              setSelectedFees(selectedFees.filter((id) => id !== fee.id))
                            }
                          }}
                          className="mt-1"
                        />

                        {/* Fee Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(fee.status)}
                                <h3 className="font-semibold">{fee.feeType}</h3>
                                {fee.priority && (
                                  <Badge variant="outline" className={getPriorityColor(fee.priority)}>
                                    {fee.priority}
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground">{fee.description}</p>

                              <div className="flex items-center gap-4 text-sm">
                                <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                                <Badge variant="outline">{fee.category}</Badge>
                                {fee.installment && (
                                  <Badge variant="secondary">
                                    Installment {fee.installmentNumber}/{fee.totalInstallments}
                                  </Badge>
                                )}
                              </div>

                              {fee.status === "Paid" && (
                                <div className="text-sm text-green-600">
                                  Paid on {fee.paidDate && new Date(fee.paidDate).toLocaleDateString()}
                                  via {fee.paymentMethod}
                                </div>
                              )}
                            </div>

                            {/* Amount and Actions */}
                            <div className="text-right space-y-2">
                              <div>
                                <div className="text-xl font-bold">₹{fee.amount.toLocaleString()}</div>
                                {fee.lateFee && <div className="text-sm text-red-600">+₹{fee.lateFee} late fee</div>}
                                {fee.discount && (
                                  <div className="text-sm text-green-600">-₹{fee.discount} discount</div>
                                )}
                              </div>

                              <Badge variant="outline" className={getStatusColor(fee.status)}>
                                {fee.status}
                              </Badge>

                              <div className="flex gap-2 mt-2">
                                {fee.status !== "Paid" ? (
                                  <Button size="sm" onClick={() => openPaymentDialog(fee)}>
                                    Pay Now
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => generateReceipt(fee)}>
                                    <Receipt className="mr-2 h-4 w-4" />
                                    Receipt
                                  </Button>
                                )}
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Payment History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Payment History
                  </CardTitle>
                  <CardDescription>Complete record of all fee payments</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export History
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Annual Statement
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Payment Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {mockFeeRecords.filter((f) => f.status === "Paid").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Payments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">₹{paidFees.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Amount Paid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ₹
                      {Math.round(
                        paidFees / mockFeeRecords.filter((f) => f.status === "Paid").length || 0,
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Payment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Set(mockFeeRecords.filter((f) => f.status === "Paid").map((f) => f.paymentMethod)).size}
                    </div>
                    <div className="text-sm text-muted-foreground">Payment Methods</div>
                  </div>
                </div>

                <Separator />

                {/* Payment History List */}
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {mockFeeRecords
                      .filter((fee) => fee.status === "Paid")
                      .sort((a, b) => new Date(b.paidDate || 0).getTime() - new Date(a.paidDate || 0).getTime())
                      .map((fee) => (
                        <div
                          key={fee.id}
                          className="p-4 rounded-lg border bg-gradient-to-r from-green-50 to-green-100 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-green-200 rounded-full">
                                <CheckCircle className="h-5 w-5 text-green-700" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{fee.feeType}</h3>
                                <p className="text-sm text-muted-foreground">{fee.description}</p>
                                <div className="flex items-center gap-4 text-sm mt-1">
                                  <span>Paid: {fee.paidDate && new Date(fee.paidDate).toLocaleDateString()}</span>
                                  <Badge variant="outline">{fee.category}</Badge>
                                  <span className="text-muted-foreground">via {fee.paymentMethod}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-2">
                              <div className="text-xl font-bold">₹{fee.amount.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">TXN: {fee.transactionId}</div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => generateReceipt(fee)}>
                                  <Receipt className="mr-2 h-4 w-4" />
                                  Receipt
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>Complete payment for {selectedFeeForPayment?.feeType}</DialogDescription>
          </DialogHeader>

          {selectedFeeForPayment && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Fee Amount:</span>
                  <span className="font-semibold">₹{selectedFeeForPayment.amount.toLocaleString()}</span>
                </div>
                {selectedFeeForPayment.lateFee && (
                  <div className="flex justify-between items-center mb-2">
                    <span>Late Fee:</span>
                    <span className="font-semibold text-red-600">
                      ₹{selectedFeeForPayment.lateFee.toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold">
                  <span>Total Amount:</span>
                  <span>₹{(selectedFeeForPayment.amount + (selectedFeeForPayment.lateFee || 0)).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-semibold">Payment Method</Label>
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                        paymentData.method === method.value ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentData({ ...paymentData, method: method.value })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <method.icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{method.label}</div>
                            <div className="text-sm text-muted-foreground">{method.description}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-green-600">{method.fee}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Details (if card payment selected) */}
              {(paymentData.method === "credit_card" || paymentData.method === "debit_card") && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="Enter cardholder name"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes for this payment..."
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                />
              </div>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your payment information is encrypted and secure. We use industry-standard security measures to
                  protect your data.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={handlePaymentSubmit} disabled={!paymentData.method}>
                  <Shield className="mr-2 h-4 w-4" />
                  Process Payment Securely
                </Button>
                <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
