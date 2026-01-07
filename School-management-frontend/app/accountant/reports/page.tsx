"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts"
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  BarChart3,
  PieChartIcon,
  Activity,
  Eye,
  FileSpreadsheet,
  Clock,
  Target,
  AlertTriangle,
} from "lucide-react"

// Enhanced mock data
const mockReportData = [
  { month: "Jan", collected: 450000, expected: 500000, students: 120, defaulters: 15 },
  { month: "Feb", collected: 480000, expected: 500000, students: 125, defaulters: 12 },
  { month: "Mar", collected: 520000, expected: 550000, students: 130, defaulters: 18 },
  { month: "Apr", collected: 490000, expected: 520000, students: 128, defaulters: 20 },
  { month: "May", collected: 510000, expected: 530000, students: 132, defaulters: 16 },
  { month: "Jun", collected: 495000, expected: 520000, students: 135, defaulters: 22 },
]

const classWiseData = [
  {
    class: "Class 10-A",
    collected: 180000,
    expected: 200000,
    students: 35,
    completion: 90,
    outstanding: 20000,
    status: "good",
  },
  {
    class: "Class 9-B",
    collected: 150000,
    expected: 180000,
    students: 32,
    completion: 83,
    outstanding: 30000,
    status: "warning",
  },
  {
    class: "Class 11-C",
    collected: 165000,
    expected: 170000,
    students: 28,
    completion: 97,
    outstanding: 5000,
    status: "excellent",
  },
  {
    class: "Class 8-A",
    collected: 140000,
    expected: 160000,
    students: 30,
    completion: 87,
    outstanding: 20000,
    status: "warning",
  },
  {
    class: "Class 12-A",
    collected: 190000,
    expected: 200000,
    students: 25,
    completion: 95,
    outstanding: 10000,
    status: "good",
  },
]

const paymentModeData = [
  { name: "Online", value: 45, amount: 1350000, color: "#3b82f6" },
  { name: "Cash", value: 25, amount: 750000, color: "#10b981" },
  { name: "Cheque", value: 20, amount: 600000, color: "#f59e0b" },
  { name: "Bank Transfer", value: 10, amount: 300000, color: "#ef4444" },
]

const outstandingData = [
  { class: "Class 10-A", amount: 25000, students: 5, avgDays: 15 },
  { class: "Class 9-B", amount: 45000, students: 8, avgDays: 22 },
  { class: "Class 11-C", amount: 15000, students: 3, avgDays: 8 },
  { class: "Class 8-A", amount: 35000, students: 6, avgDays: 18 },
  { class: "Class 12-A", amount: 20000, students: 4, avgDays: 12 },
]

const reportTypes = [
  {
    id: "fee-collection",
    name: "Fee Collection Report",
    description: "Detailed collection analysis with monthly breakdowns",
  },
  {
    id: "outstanding-dues",
    name: "Outstanding Dues Report",
    description: "Complete list of pending payments with student details",
  },
  {
    id: "class-wise",
    name: "Class-wise Fee Report",
    description: "Performance analysis by class with completion rates",
  },
  { id: "payment-mode", name: "Payment Mode Analysis", description: "Payment method breakdown with trends" },
  { id: "monthly-summary", name: "Monthly Summary Report", description: "Comprehensive monthly data with comparisons" },
  { id: "defaulter-list", name: "Defaulter List", description: "Students with pending fees and follow-up actions" },
  { id: "collection-trends", name: "Collection Trends", description: "Historical collection patterns and forecasting" },
]

export default function EnhancedReportsPage() {
  const [selectedReport, setSelectedReport] = useState("")
  const [dateRange, setDateRange] = useState("current-month")
  const [selectedClass, setSelectedClass] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [isExporting, setIsExporting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Enhanced export functions
  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create mock PDF content
      const reportData = generateReportData()
      const pdfContent = `
Fee Management System - ${reportTypes.find((r) => r.id === selectedReport)?.name}
Generated on: ${new Date().toLocaleDateString()}
Date Range: ${dateRange}

${reportData}
      `

      // Create and download blob
      const blob = new Blob([pdfContent], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedReport}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert("PDF report exported successfully!")
    } catch (error) {
      alert("Error exporting PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create mock Excel content (CSV format)
      const reportData = generateExcelData()
      const csvContent = convertToCSV(reportData)

      // Create and download blob
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedReport}-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert("Excel report exported successfully!")
    } catch (error) {
      alert("Error exporting Excel. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handlePreviewReport = () => {
    setShowPreview(true)
  }

  const generateReportData = () => {
    const report = reportTypes.find((r) => r.id === selectedReport)
    if (!report) return ""

    switch (selectedReport) {
      case "fee-collection":
        return `
Total Collected: ₹${totalCollected.toLocaleString()}
Total Expected: ₹${totalExpected.toLocaleString()}
Collection Rate: ${collectionRate}%
Outstanding Amount: ₹${totalOutstanding.toLocaleString()}
        `
      case "class-wise":
        return classWiseData
          .map(
            (cls) =>
              `${cls.class}: ₹${cls.collected.toLocaleString()} / ₹${cls.expected.toLocaleString()} (${cls.completion}%)`,
          )
          .join("\n")
      default:
        return "Report data will be generated based on selected filters."
    }
  }

  const generateExcelData = () => {
    switch (selectedReport) {
      case "fee-collection":
        return mockReportData.map((data) => ({
          Month: data.month,
          Collected: data.collected,
          Expected: data.expected,
          Students: data.students,
          Defaulters: data.defaulters,
        }))
      case "class-wise":
        return classWiseData.map((cls) => ({
          Class: cls.class,
          Collected: cls.collected,
          Expected: cls.expected,
          Students: cls.students,
          Completion: cls.completion,
          Outstanding: cls.outstanding,
        }))
      default:
        return []
    }
  }

  const convertToCSV = (data: any[]) => {
    if (!data.length) return ""

    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(","))
    return [headers, ...rows].join("\n")
  }

  // Calculate statistics
  const totalCollected = mockReportData.reduce((sum, data) => sum + data.collected, 0)
  const totalExpected = mockReportData.reduce((sum, data) => sum + data.expected, 0)
  const totalOutstanding = totalExpected - totalCollected
  const collectionRate = ((totalCollected / totalExpected) * 100).toFixed(1)
  const totalDefaulters = mockReportData.reduce((sum, data) => sum + data.defaulters, 0)
  const totalStudents = mockReportData[mockReportData.length - 1]?.students || 0

  // Calculate trends
  const currentMonth = mockReportData[mockReportData.length - 1]
  const previousMonth = mockReportData[mockReportData.length - 2]
  const collectionTrend =
    currentMonth && previousMonth
      ? (((currentMonth.collected - previousMonth.collected) / previousMonth.collected) * 100).toFixed(1)
      : "0"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "good":
        return "bg-gray-50 text-gray-700 border-gray-200"
      case "warning":
        return "bg-gray-100 text-gray-600 border-gray-300"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-gray-600" />
      case "good":
        return <Target className="h-4 w-4 text-gray-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const handleQuickExport = async () => {
    setIsExporting(true)
    try {
      // Generate comprehensive report data
      const reportData = `
Fee Management System - Quick Export Report
Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Date Range: ${dateRange}

=== SUMMARY ===
Total Collected: ₹${totalCollected.toLocaleString()}
Total Expected: ₹${totalExpected.toLocaleString()}
Collection Rate: ${collectionRate}%
Outstanding Amount: ₹${totalOutstanding.toLocaleString()}
Total Students: ${totalStudents}
Total Defaulters: ${totalDefaulters}

=== CLASS-WISE BREAKDOWN ===
${classWiseData
  .map(
    (cls) =>
      `${cls.class}: ₹${cls.collected.toLocaleString()} / ₹${cls.expected.toLocaleString()} (${cls.completion}% complete)`,
  )
  .join("\n")}

=== MONTHLY TRENDS ===
${mockReportData
  .map(
    (data) =>
      `${data.month}: Collected ₹${data.collected.toLocaleString()}, Expected ₹${data.expected.toLocaleString()}`,
  )
  .join("\n")}
    `

      // Create and download blob
      const blob = new Blob([reportData], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fee-report-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert("Quick report exported successfully!")
    } catch (error) {
      alert("Error exporting report. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Fee Reports & Analytics</h1>
            <p className="text-lg text-gray-600 mt-2">Comprehensive fee collection reports and insights</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleQuickExport} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Quick Export
            </Button>
          </div>
        </div>

        {/* Key Metrics - Enhanced */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Collected</CardTitle>
              <div className="p-2 bg-blue-600 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">₹{totalCollected.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-sm mt-2">
                {Number.parseFloat(collectionTrend) >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={Number.parseFloat(collectionTrend) >= 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(Number.parseFloat(collectionTrend))}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Collection Rate</CardTitle>
              <div className="p-2 bg-green-600 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{collectionRate}%</div>
              <Progress value={Number.parseFloat(collectionRate)} className="mt-3 h-3" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Outstanding</CardTitle>
              <div className="p-2 bg-red-600 rounded-lg">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">₹{totalOutstanding.toLocaleString()}</div>
              <p className="text-sm text-red-600 mt-2 font-medium">{totalDefaulters} defaulters</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Active Students</CardTitle>
              <div className="p-2 bg-purple-600 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{totalStudents}</div>
              <p className="text-sm text-purple-600 mt-2">Across all classes</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
            <CardDescription>Filter reports by date range, class, and other criteria</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="current-quarter">Current Quarter</SelectItem>
                    <SelectItem value="current-year">Current Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Class Filter</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classWiseData.map((cls) => (
                      <SelectItem key={cls.class} value={cls.class}>
                        {cls.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Class-wise Performance - Enhanced and Prominent */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="bg-gray-100 border-b">
                <CardTitle className="text-xl font-semibold text-gray-800">Class-wise Fee Collection Status</CardTitle>
                <CardDescription className="text-gray-600">
                  Real-time collection status for easy accounting oversight
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  {classWiseData.map((cls, index) => (
                    <div
                      key={cls.class}
                      className={`p-6 border-b last:border-b-0 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(cls.status)}
                            <div>
                              <div className="text-lg font-semibold text-gray-900">{cls.class}</div>
                              <div className="text-sm text-gray-600">{cls.students} students enrolled</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Collected</div>
                            <div className="text-xl font-bold text-green-600">₹{cls.collected.toLocaleString()}</div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm text-gray-500">Expected</div>
                            <div className="text-xl font-bold text-gray-900">₹{cls.expected.toLocaleString()}</div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm text-gray-500">Outstanding</div>
                            <div className="text-xl font-bold text-red-600">₹{cls.outstanding.toLocaleString()}</div>
                          </div>

                          <div className="flex flex-col items-center gap-2 min-w-[120px]">
                            <Progress value={cls.completion} className="h-3 w-full" />
                            <Badge className={`${getStatusColor(cls.status)} font-semibold px-3 py-1`}>
                              {cls.completion}% Complete
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Collection Trends
                  </CardTitle>
                  <CardDescription>Collection vs Expected amounts over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={mockReportData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        formatter={(value) => `₹${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      />
                      <Area dataKey="expected" stackId="1" stroke="#e5e7eb" fill="#f3f4f6" name="Expected" />
                      <Area dataKey="collected" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Collected" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <PieChartIcon className="h-5 w-5" />
                    Payment Mode Distribution
                  </CardTitle>
                  <CardDescription>Breakdown by payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={paymentModeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {paymentModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-800">Collection Efficiency Trends</CardTitle>
                  <CardDescription>Monthly collection rate performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={mockReportData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        formatter={(value) => `${value}%`}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey={(data) => ((data.collected / data.expected) * 100).toFixed(1)}
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Collection Rate (%)"
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-800">Outstanding Analysis</CardTitle>
                  <CardDescription>Pending amounts requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={outstandingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="class" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        formatter={(value) => `₹${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      />
                      <Bar dataKey="amount" fill="#ef4444" name="Outstanding Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-800">Payment Method Performance</CardTitle>
                <CardDescription>Detailed analysis of payment preferences and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {paymentModeData.map((method) => (
                    <div
                      key={method.name}
                      className="p-6 border rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: method.color }} />
                        <span className="font-semibold text-gray-800">{method.name}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">₹{method.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{method.value}% of total collections</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-800">Export Reports</CardTitle>
                <CardDescription>Generate and download detailed fee reports in various formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Report Type</Label>
                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((report) => (
                          <SelectItem key={report.id} value={report.id}>
                            {report.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handlePreviewReport}
                    disabled={!selectedReport}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Report
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    disabled={!selectedReport || isExporting}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                  >
                    {isExporting ? <Clock className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                    {isExporting ? "Exporting..." : "Export PDF"}
                  </Button>
                  <Button
                    onClick={handleExportExcel}
                    disabled={!selectedReport || isExporting}
                    variant="outline"
                    className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    {isExporting ? <Clock className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                    {isExporting ? "Exporting..." : "Export Excel"}
                  </Button>
                </div>

                {selectedReport && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="font-medium mb-2">{reportTypes.find((r) => r.id === selectedReport)?.name}</div>
                      <div className="text-sm">{reportTypes.find((r) => r.id === selectedReport)?.description}</div>
                      <div className="mt-3 text-sm">
                        <strong>Date Range:</strong> {dateRange} | <strong>Format:</strong> {exportFormat.toUpperCase()}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {showPreview && selectedReport && (
                  <Card className="border-2 border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="text-blue-800">Report Preview</CardTitle>
                      <CardDescription>
                        Preview of {reportTypes.find((r) => r.id === selectedReport)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white p-6 rounded-lg border">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{generateReportData()}</pre>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setShowPreview(false)}
                          className="text-blue-600 border-blue-200"
                        >
                          Close Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
