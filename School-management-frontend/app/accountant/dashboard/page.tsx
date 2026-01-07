"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  DollarSign,
  Receipt,
  Hourglass,
  TrendingUp,
  Users,
  Calendar,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Eye,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data
const weeklyCollection = [
  { day: "Mon", amount: 45000 },
  { day: "Tue", amount: 32000 },
  { day: "Wed", amount: 58000 },
  { day: "Thu", amount: 41000 },
  { day: "Fri", amount: 67000 },
  { day: "Sat", amount: 23000 },
  { day: "Sun", amount: 15000 },
]

const feeTypeData = [
  { name: "Tuition", value: 65, color: "#3b82f6" },
  { name: "Transport", value: 20, color: "#10b981" },
  { name: "Library", value: 10, color: "#f59e0b" },
  { name: "Others", value: 5, color: "#ef4444" },
]

const recentPayments = [
  {
    id: "1",
    student: "John Doe",
    studentId: "STU001",
    amount: 15000,
    type: "Tuition Fee",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    student: "Jane Smith",
    studentId: "STU002",
    amount: 8000,
    type: "Transport Fee",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: "3",
    student: "Mike Johnson",
    studentId: "STU003",
    amount: 2000,
    type: "Library Fee",
    time: "1 day ago",
    status: "pending",
  },
]

const overduePayments = [
  {
    id: "1",
    student: "Sarah Wilson",
    studentId: "STU004",
    amount: 25000,
    daysOverdue: 15,
    type: "Tuition Fee",
  },
  {
    id: "2",
    student: "David Brown",
    studentId: "STU005",
    amount: 12000,
    daysOverdue: 8,
    type: "Transport Fee",
  },
  {
    id: "3",
    student: "Lisa Garcia",
    studentId: "STU006",
    amount: 18000,
    daysOverdue: 22,
    type: "Tuition Fee",
  },
]

// Stats data for different tabs
const overviewStats = {
  totalPaid: { value: 450000, label: "Total Collected", change: "+12.5%", icon: DollarSign, color: "green" },
  totalDues: { value: 125000, label: "Outstanding Dues", change: "-5.2%", icon: Hourglass, color: "red" },
  weeklyTotal: { value: 281000, label: "This Week", change: "+14.8%", icon: TrendingUp, color: "blue" },
  overdueCount: { value: 3, label: "Overdue Students", change: "Requires attention", icon: Users, color: "orange" },
}

const transactionStats = {
  todayPayments: { value: 25, label: "Today's Payments", change: "+8 from yesterday", icon: Receipt, color: "green" },
  completedPayments: { value: 142, label: "Completed", change: "This month", icon: CheckCircle, color: "blue" },
  pendingPayments: { value: 8, label: "Pending", change: "Awaiting confirmation", icon: Clock, color: "orange" },
  totalTransactions: {
    value: 150,
    label: "Total Transactions",
    change: "+15% this month",
    icon: CreditCard,
    color: "purple",
  },
}

const duesStats = {
  totalOverdue: { value: 55000, label: "Total Overdue", change: "₹55,000 pending", icon: AlertTriangle, color: "red" },
  overdueStudents: {
    value: 3,
    label: "Overdue Students",
    change: "Immediate action needed",
    icon: Users,
    color: "orange",
  },
  avgOverdueDays: {
    value: 15,
    label: "Avg Overdue Days",
    change: "Across all students",
    icon: Calendar,
    color: "blue",
  },
  reminders: { value: 12, label: "Reminders Sent", change: "This week", icon: Bell, color: "green" },
}

export default function AccountantDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatsData = () => {
    switch (activeTab) {
      case "transactions":
        return transactionStats
      case "dues-actions":
        return duesStats
      default:
        return overviewStats
    }
  }

  const formatValue = (value: number, key: string) => {
    if (key.includes("total") || key.includes("overdue") || key.includes("Paid") || key.includes("Dues")) {
      return `₹${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  const statsData = getStatsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Manage fees and track payments efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-2 rounded-lg shadow-sm">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(statsData).map(([key, stat]) => {
              const IconComponent = stat.icon
              const colorClasses = {
                green: "from-green-50 to-emerald-50 text-green-700 bg-green-100 text-green-600",
                red: "from-red-50 to-rose-50 text-red-700 bg-red-100 text-red-600",
                blue: "from-blue-50 to-indigo-50 text-blue-700 bg-blue-100 text-blue-600",
                orange: "from-orange-50 to-amber-50 text-orange-700 bg-orange-100 text-orange-600",
                purple: "from-purple-50 to-violet-50 text-purple-700 bg-purple-100 text-purple-600",
              }

              return (
                <Card
                  key={key}
                  className={`border-0 shadow-md bg-gradient-to-br ${
                    colorClasses[stat.color as keyof typeof colorClasses].split(" ")[0]
                  } ${colorClasses[stat.color as keyof typeof colorClasses].split(" ")[1]} hover:shadow-lg transition-all duration-300`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className={`text-2xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses].split(" ")[2]}`}
                        >
                          {formatValue(stat.value, key)}
                        </div>
                        <p
                          className={`text-xs font-medium ${colorClasses[stat.color as keyof typeof colorClasses].split(" ")[5]}`}
                        >
                          {stat.label}
                        </p>
                        <div
                          className={`flex items-center mt-1 text-xs ${colorClasses[stat.color as keyof typeof colorClasses].split(" ")[5]}`}
                        >
                          {stat.change.includes("+") ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : stat.change.includes("-") ? (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          ) : null}
                          {stat.change}
                        </div>
                      </div>
                      <div
                        className={`h-10 w-10 ${colorClasses[stat.color as keyof typeof colorClasses].split(" ")[4]} rounded-full flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${colorClasses[stat.color as keyof typeof colorClasses].split(" ")[5]}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border-0 h-11">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="dues-actions"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
              >
                Dues & Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Weekly Collection Chart */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          Weekly Collection Trend
                        </CardTitle>
                        <CardDescription className="mt-1">Daily fee collection for the current week</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={weeklyCollection} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                        />
                        <Tooltip
                          formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="amount"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Fee Distribution */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Fee Distribution</CardTitle>
                    <CardDescription>Breakdown by fee type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={feeTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {feeTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {feeTypeData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-600">{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Receipt className="h-5 w-5 text-blue-600" />
                        Recent Transactions
                      </CardTitle>
                      <CardDescription className="mt-1">Latest fee payments and activities</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search transactions..." className="pl-10 w-64" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${payment.student
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}`}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {payment.student
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">{payment.student}</div>
                          <div className="text-sm text-slate-500">
                            {payment.studentId} • {payment.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">₹{payment.amount.toLocaleString()}</div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={payment.status === "completed" ? "default" : "secondary"}
                            className={payment.status === "completed" ? "bg-green-100 text-green-700" : ""}
                          >
                            {payment.status}
                          </Badge>
                          <span className="text-xs text-slate-500">{payment.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link href="/accountant/payments/mark">
                        <Plus className="h-4 w-4 mr-2" />
                        Record New Payment
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dues-actions" className="mt-6 space-y-6">
              {/* Overdue Payments */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Hourglass className="h-5 w-5 text-red-600" />
                        Overdue Payments
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Students with pending fee payments requiring attention
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {overduePayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                          {payment.daysOverdue} days overdue
                        </Badge>
                        <div>
                          <div className="font-medium text-slate-900">{payment.student}</div>
                          <div className="text-sm text-slate-600">
                            {payment.studentId} • {payment.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-700">₹{payment.amount.toLocaleString()}</div>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <Link href="/accountant/fees/structure" className="block">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Fee Structure</h3>
                          <p className="text-sm text-slate-600 mt-1">Manage fee categories and amounts</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <Link href="/accountant/reports" className="block">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <ClipboardList className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Financial Reports</h3>
                          <p className="text-sm text-slate-600 mt-1">Generate detailed financial reports</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <Link href="/accountant/transport" className="block">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                          <Users className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Transport Management</h3>
                          <p className="text-sm text-slate-600 mt-1">Manage transport fees and routes</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
