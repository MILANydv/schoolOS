"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LucideBarChart,
  DollarSign,
  Users,
  School,
  LucideLineChart,
  PlusCircle,
  Search,
  Bell,
  Filter,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  UserCheck,
  AlertCircle,
  Download,
  RefreshCw,
  MoreHorizontal,
  Activity,
  CreditCard,
  Mail,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart as ReLineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import CreateSchoolForm from "@/components/forms/school/create-school-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ExportDialog from "@/components/forms/school/export-dialog"
import EditSchoolForm from "@/components/forms/school/edit-school-form"

// Enhanced mock data for stat cards with trends
const statCards = [
  {
    title: "Total Schools",
    value: "15",
    description: "+2 new this month",
    trend: 13.3,
    trendDirection: "up",
    icon: School,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Active Subscriptions",
    value: "12",
    description: "+1 since last month",
    trend: 8.3,
    trendDirection: "up",
    icon: CreditCard,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Total Users",
    value: "1,250",
    description: "+15% from last month",
    trend: 15.0,
    trendDirection: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Revenue (MRR)",
    value: "$45,231",
    description: "+5% from last month",
    trend: 5.2,
    trendDirection: "up",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
]

// Enhanced platform usage data
const platformUsageData = [
  { month: "Jan", schools: 10, users: 800, revenue: 35000 },
  { month: "Feb", schools: 11, users: 900, revenue: 38000 },
  { month: "Mar", schools: 11, users: 950, revenue: 39500 },
  { month: "Apr", schools: 12, users: 1000, revenue: 41000 },
  { month: "May", schools: 13, users: 1100, revenue: 43000 },
  { month: "Jun", schools: 14, users: 1200, revenue: 44500 },
  { month: "Jul", schools: 15, users: 1250, revenue: 45231 },
]

// Enhanced subscription data
const subscriptionStatusData = [
  { status: "Premium", count: 7, color: "#10b981" },
  { status: "Standard", count: 5, color: "#3b82f6" },
  { status: "Basic", count: 3, color: "#f59e0b" },
  { status: "Expired", count: 2, color: "#ef4444" },
]

// Recent activities data
const recentActivities = [
  {
    id: 1,
    type: "school_created",
    title: "New school registered",
    description: "Greenwood High School joined the platform",
    timestamp: "2 hours ago",
    icon: School,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "subscription_upgraded",
    title: "Subscription upgraded",
    description: "Lincoln Academy upgraded to Premium plan",
    timestamp: "4 hours ago",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "user_milestone",
    title: "User milestone reached",
    description: "Total users crossed 1,250 mark",
    timestamp: "6 hours ago",
    icon: Users,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "payment_received",
    title: "Payment received",
    description: "$2,500 payment from Oak Valley School",
    timestamp: "1 day ago",
    icon: DollarSign,
    color: "text-emerald-600",
  },
]

// Top performing schools data
const topSchools = [
  { name: "Lincoln Academy", users: 156, plan: "Premium", revenue: 4500, growth: 12 },
  { name: "Greenwood High", users: 142, plan: "Premium", revenue: 4200, growth: 8 },
  { name: "Oak Valley School", users: 128, plan: "Standard", revenue: 2500, growth: 15 },
  { name: "Riverside Elementary", users: 98, plan: "Standard", revenue: 2200, growth: 5 },
  { name: "Mountain View Academy", users: 87, plan: "Basic", revenue: 1200, growth: -2 },
]

// Mock users data for search
const mockUsers = [
  { id: 1, name: "John Smith", email: "john@lincoln.edu", school: "Lincoln Academy", role: "Teacher" },
  { id: 2, name: "Sarah Johnson", email: "sarah@greenwood.edu", school: "Greenwood High", role: "Principal" },
  { id: 3, name: "Mike Davis", email: "mike@oakvalley.edu", school: "Oak Valley School", role: "Admin" },
  { id: 4, name: "Emily Brown", email: "emily@riverside.edu", school: "Riverside Elementary", role: "Teacher" },
  { id: 5, name: "David Wilson", email: "david@mountain.edu", school: "Mountain View Academy", role: "Student" },
]

// Mock schools data for search
const mockSchools = [
  { id: 1, name: "Lincoln Academy", users: 156, plan: "Premium", status: "Active" },
  { id: 2, name: "Greenwood High School", users: 142, plan: "Premium", status: "Active" },
  { id: 3, name: "Oak Valley School", users: 128, plan: "Standard", status: "Active" },
  { id: 4, name: "Riverside Elementary", users: 98, plan: "Standard", status: "Active" },
  { id: 5, name: "Mountain View Academy", users: 87, plan: "Basic", status: "Suspended" },
]

export default function EnhancedSuperAdminDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchResults, setSearchResults] = useState<{ schools: any[]; users: any[] }>({ schools: [], users: [] })
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  const [showSchoolDetails, setShowSchoolDetails] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const handleCreateSchool = () => {
    setShowCreateForm(true)
  }

  const handleBackToDashboard = () => {
    setShowCreateForm(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setShowSearchResults(false)
      setSearchResults({ schools: [], users: [] })
      return
    }

    const filteredSchools = mockSchools.filter((school) => school.name.toLowerCase().includes(query.toLowerCase()))

    const filteredUsers = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.school.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults({ schools: filteredSchools, users: filteredUsers })
    setShowSearchResults(true)
  }

  const handleViewDetails = (school: any) => {
    setSelectedSchool(school)
    setShowSchoolDetails(true)
  }

  const handleEditSchool = (school: any) => {
    setSelectedSchool(school)
    setShowEditForm(true)
  }

  const handleSendMessage = (school: any) => {
    setSelectedSchool(school)
    setShowMessageDialog(true)
  }

  const handleSuspendSchool = (school: any) => {
    setSelectedSchool(school)
    setShowSuspendDialog(true)
  }

  const handleExportReport = () => {
    setShowExportDialog(true)
  }

  const confirmSuspendSchool = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update school status (in real app, this would update the backend)
    console.log(`School ${selectedSchool?.name} suspended`)
    setShowSuspendDialog(false)
    setSelectedSchool(null)
  }

  const sendMessage = async () => {
    if (!messageText.trim()) return

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log(`Message sent to ${selectedSchool?.name}: ${messageText}`)
    setMessageText("")
    setShowMessageDialog(false)
    setSelectedSchool(null)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage schools, users, and platform analytics</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search with Results */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search schools, users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
              />

              {/* Search Results Dropdown */}
              {showSearchResults && (searchResults.schools.length > 0 || searchResults.users.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.schools.length > 0 && (
                    <div className="p-2">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Schools</h4>
                      {searchResults.schools.map((school) => (
                        <div
                          key={school.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <School className="h-4 w-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{school.name}</p>
                            <p className="text-xs text-gray-500">
                              {school.users} users • {school.plan}
                            </p>
                          </div>
                          <Badge variant={school.status === "Active" ? "default" : "destructive"}>
                            {school.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.users.length > 0 && (
                    <div className="p-2 border-t">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Users</h4>
                      {searchResults.users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <Users className="h-4 w-4 text-purple-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">
                              {user.email} • {user.school}
                            </p>
                          </div>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Time Range Selector */}
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            {/* Notifications */}
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
            </Button>

            {/* Create School Button */}
            <Button onClick={handleCreateSchool} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create School
            </Button>
          </div>
        </div>
      </div>

      {/* Create School Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <School className="h-6 w-6" />
              Create New School
            </DialogTitle>
            <DialogDescription>
              Add a new school to the platform with admin details and subscription plan
            </DialogDescription>
          </DialogHeader>
          <CreateSchoolForm onSuccess={handleBackToDashboard} />
        </DialogContent>
      </Dialog>

      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Stat Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {card.trendDirection === "up" ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            card.trendDirection === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {card.trend}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{card.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Platform Usage Chart - Fixed sizing */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Platform Growth</CardTitle>
                    <CardDescription>Schools, users, and revenue over time</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer
                    config={{
                      schools: {
                        label: "Schools",
                        color: "hsl(var(--chart-1))",
                      },
                      users: {
                        label: "Users",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[280px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={platformUsageData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="schools"
                          stackId="1"
                          stroke="var(--color-schools)"
                          fill="var(--color-schools)"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stackId="2"
                          stroke="var(--color-users)"
                          fill="var(--color-users)"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <activity.icon className={`h-3 w-3 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-sm">
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Distribution - Fixed sizing */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                  <CardDescription>Current status of all school subscriptions</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer
                    config={{
                      count: {
                        label: "Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[250px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <Pie
                          data={subscriptionStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ status, count }) => `${status}: ${count}`}
                        >
                          {subscriptionStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Schools</CardTitle>
                  <CardDescription>Schools ranked by user count and growth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topSchools.map((school, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{school.name}</p>
                          <p className="text-sm text-gray-500">{school.users} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            school.plan === "Premium" ? "default" : school.plan === "Standard" ? "secondary" : "outline"
                          }
                        >
                          {school.plan}
                        </Badge>
                        <div className="flex items-center gap-1 mt-1">
                          {school.growth >= 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`text-xs ${school.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {school.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Analytics Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Schools</SelectItem>
                    <SelectItem value="premium">Premium Only</SelectItem>
                    <SelectItem value="standard">Standard Only</SelectItem>
                    <SelectItem value="basic">Basic Only</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExportReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardContent>
            </Card>

            {/* Detailed Analytics - Fixed sizing */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly recurring revenue growth</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[280px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={platformUsageData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          fill="var(--color-revenue)"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>Average users per school over time</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer
                    config={{
                      avgUsers: {
                        label: "Avg Users per School",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="h-[280px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart
                        data={platformUsageData.map((item) => ({
                          ...item,
                          avgUsers: Math.round(item.users / item.schools),
                        }))}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="avgUsers" stroke="var(--color-avgUsers)" strokeWidth={3} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Management</CardTitle>
                <CardDescription>Detailed view of all schools on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSchools.map((school, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${school.name.charAt(0)}`} />
                          <AvatarFallback>{school.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{school.name}</h3>
                          <p className="text-sm text-gray-500">{school.users} active users</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                school.plan === "Premium"
                                  ? "default"
                                  : school.plan === "Standard"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {school.plan}
                            </Badge>
                            <span className="text-sm text-gray-500">${school.revenue}/month</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(school)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditSchool(school)}>
                              <Settings className="mr-2 h-4 w-4" />
                              Edit School
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendMessage(school)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleSuspendSchool(school)}>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Suspend School
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quick-actions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* School Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    School Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleCreateSchool} className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New School
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/schools">
                      <Eye className="mr-2 h-4 w-4" />
                      View All Schools
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/schools">
                      <Eye className="mr-2 h-4 w-4" />
                      View All Schools
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/schools/bulk-actions">
                      <Settings className="mr-2 h-4 w-4" />
                      Bulk Actions
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* User Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/users">
                      <Users className="mr-2 h-4 w-4" />
                      Manage All Users
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/impersonate">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Impersonate User
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/user-reports">
                      <Activity className="mr-2 h-4 w-4" />
                      User Reports
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Financial Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/subscriptions">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Subscriptions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/billing">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Billing Overview
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/revenue-reports">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Revenue Reports
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Communication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/announcements">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Announcements
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      Manage Notifications
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/support">
                      <Shield className="mr-2 h-4 w-4" />
                      Support Center
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* System Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/system-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      System Settings
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/logs">
                      <Activity className="mr-2 h-4 w-4" />
                      System Logs
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/backups">
                      <Shield className="mr-2 h-4 w-4" />
                      Data Backups
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Reports & Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideBarChart className="h-5 w-5" />
                    Reports & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/reports">
                      <LucideBarChart className="mr-2 h-4 w-4" />
                      Generate Reports
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/analytics">
                      <LucideLineChart className="mr-2 h-4 w-4" />
                      Advanced Analytics
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/superadmin/export">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* School Details Dialog */}
      <Dialog open={showSchoolDetails} onOpenChange={setShowSchoolDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <School className="h-6 w-6" />
              {selectedSchool?.name} - Details
            </DialogTitle>
            <DialogDescription>Comprehensive information about this school</DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">School Name</p>
                      <p className="font-medium">{selectedSchool.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="font-medium">{selectedSchool.users}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Subscription Plan</p>
                      <Badge
                        variant={
                          selectedSchool.plan === "Premium"
                            ? "default"
                            : selectedSchool.plan === "Standard"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {selectedSchool.plan}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Revenue</p>
                      <p className="font-medium">${selectedSchool.revenue}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Growth Rate</p>
                      <div className="flex items-center gap-2">
                        {selectedSchool.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`font-medium ${selectedSchool.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {selectedSchool.growth}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="font-medium">2 hours ago</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Support Tickets</p>
                      <p className="font-medium">3 Open</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">5 new students enrolled</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Payment received: $2,500</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">Profile updated</p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit School Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Edit School - {selectedSchool?.name}
            </DialogTitle>
            <DialogDescription>Update school information and settings</DialogDescription>
          </DialogHeader>
          {selectedSchool && <EditSchoolForm school={selectedSchool} onSuccess={() => setShowEditForm(false)} />}
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Send Message
            </DialogTitle>
            <DialogDescription>Send a message to {selectedSchool?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={sendMessage} disabled={!messageText.trim()}>
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspend School Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Suspend School
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend <strong>{selectedSchool?.name}</strong>? This will immediately disable
              their access to the platform and all services. This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSuspendSchool} className="bg-red-600 hover:bg-red-700">
              Suspend School
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        data={topSchools}
        title="Schools Report"
      />
    </div>
  )
}
