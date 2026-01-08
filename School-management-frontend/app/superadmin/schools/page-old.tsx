"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  MoreHorizontal,
  School,
  Users,
  Crown,
  Activity,
  Search,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Settings,
  BarChart3,
  FileText,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  GraduationCap,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CRUDTable } from "@/components/table/crud-table"
import { MOCK_SCHOOLS } from "@/lib/constants"
import { AddSchoolForm } from "@/components/forms/add-school-form"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { BulkMessageForm } from "@/components/forms/superadmin/bulk-message-form"
import { ReportGeneratorForm } from "@/components/forms/superadmin/report-generator-form"

type SchoolType = (typeof MOCK_SCHOOLS)[number] & {
  lastActivity?: string
  performanceScore?: number
  collectionRate?: number
  growthRate?: number
}

// Enhanced mock data with additional fields
const ENHANCED_MOCK_SCHOOLS: SchoolType[] = MOCK_SCHOOLS.map((school, index) => ({
  ...school,
  lastActivity: ["2 hours ago", "1 day ago", "3 hours ago", "5 days ago"][index % 4],
  performanceScore: [85, 92, 78, 88][index % 4],
  collectionRate: [95, 87, 92, 89][index % 4],
  growthRate: [12.5, -2.1, 8.3, 15.2][index % 4],
}))

const recentActivities = [
  { id: 1, school: "Greenwood Elementary", action: "New enrollment", time: "2 hours ago", type: "enrollment" },
  { id: 2, school: "Riverside High", action: "Payment received", time: "4 hours ago", type: "payment" },
  { id: 3, school: "Oak Valley Middle", action: "Performance report", time: "1 day ago", type: "report" },
  { id: 4, school: "Sunset Academy", action: "Staff update", time: "2 days ago", type: "staff" },
]

export default function EnhancedSuperAdminSchoolsPage() {
  const [schools, setSchools] = React.useState<SchoolType[]>(ENHANCED_MOCK_SCHOOLS)
  const [selectedSchool, setSelectedSchool] = React.useState<SchoolType | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [subscriptionFilter, setSubscriptionFilter] = React.useState("all")
  const [selectedSchools, setSelectedSchools] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [showEditDialog, setShowEditDialog] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const router = useRouter()

  const [showBulkMessageDialog, setShowBulkMessageDialog] = React.useState(false)
  const [showReportDialog, setShowReportDialog] = React.useState(false)

  // Filter schools based on search and filters
  const filteredSchools = React.useMemo(() => {
    return schools.filter((school) => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.principal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || school.status.toLowerCase() === statusFilter
      const matchesSubscription =
        subscriptionFilter === "all" || school.subscription.toLowerCase() === subscriptionFilter

      return matchesSearch && matchesStatus && matchesSubscription
    })
  }, [schools, searchQuery, statusFilter, subscriptionFilter])

  const handleAddSchool = (newSchool: SchoolType) => {
    const schoolWithId = { ...newSchool, id: Date.now().toString() }
    setSchools((prev) => [...prev, schoolWithId])
    setShowAddDialog(false)
    toast({
      title: "School Added",
      description: `${newSchool.name} has been successfully added to the system.`,
    })
  }

  const handleEditSchool = (updatedSchool: SchoolType) => {
    setSchools((prev) => prev.map((s) => (s.id === updatedSchool.id ? updatedSchool : s)))
    setSelectedSchool(null)
    setShowEditDialog(false)
    toast({
      title: "School Updated",
      description: `${updatedSchool.name} has been successfully updated.`,
    })
  }

  const handleDeleteSchools = async (ids: string[]) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSchools((prev) => prev.filter((s) => !ids.includes(s.id)))
    setSelectedSchools([])
    setIsLoading(false)
    toast({
      title: "Schools Deleted",
      description: `${ids.length} school(s) have been successfully deleted.`,
    })
  }

  const handleBulkAction = async (action: string) => {
    if (selectedSchools.length === 0) {
      toast({
        title: "No Schools Selected",
        description: "Please select schools to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    switch (action) {
      case "activate":
        setSchools((prev) => prev.map((s) => (selectedSchools.includes(s.id) ? { ...s, status: "Active" } : s)))
        toast({
          title: "Schools Activated",
          description: `${selectedSchools.length} school(s) have been activated.`,
        })
        break
      case "deactivate":
        setSchools((prev) => prev.map((s) => (selectedSchools.includes(s.id) ? { ...s, status: "Inactive" } : s)))
        toast({
          title: "Schools Deactivated",
          description: `${selectedSchools.length} school(s) have been deactivated.`,
        })
        break
      case "delete":
        await handleDeleteSchools(selectedSchools)
        break
    }

    setSelectedSchools([])
    setIsLoading(false)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Data Refreshed",
      description: "School data has been refreshed successfully.",
    })
  }

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${filteredSchools.length} schools in ${format.toUpperCase()} format.`,
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: { variant: "default" as const, icon: CheckCircle },
      Inactive: { variant: "secondary" as const, icon: AlertCircle },
      Pending: { variant: "outline" as const, icon: Clock },
    }
    const config = variants[status as keyof typeof variants] || { variant: "secondary" as const, icon: AlertCircle }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getSubscriptionBadge = (subscription: string) => {
    const variants = {
      Free: { variant: "secondary" as const, icon: Building },
      Basic: { variant: "outline" as const, icon: School },
      Standard: { variant: "default" as const, icon: GraduationCap },
      Premium: { variant: "destructive" as const, icon: Crown },
    }
    const config = variants[subscription as keyof typeof variants] || { variant: "secondary" as const, icon: Building }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {subscription}
      </Badge>
    )
  }

  const handleSendBulkMessage = (messageData: { subject: string; message: string; recipients: string[] }) => {
    setIsLoading(true)
    // Simulate sending bulk message
    setTimeout(() => {
      setIsLoading(false)
      setShowBulkMessageDialog(false)
      toast({
        title: "Bulk Message Sent",
        description: `Message sent to ${messageData.recipients.length} school(s) successfully.`,
      })
    }, 2000)
  }

  const handleGenerateReport = (reportType: string) => {
    setIsLoading(true)
    // Simulate report generation
    setTimeout(() => {
      setIsLoading(false)
      setShowReportDialog(false)
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated and will be emailed to you shortly.`,
      })
    }, 3000)
  }

  // Calculate enhanced stats
  const totalSchools = schools.length
  const activeSchools = schools.filter((s) => s.status === "Active").length
  const totalStudents = schools.reduce((sum, school) => sum + school.students, 0)
  const premiumSchools = schools.filter((s) => s.subscription === "Premium" || s.subscription === "Standard").length
  const avgPerformance = schools.reduce((sum, school) => sum + (school.performanceScore || 0), 0) / schools.length
  const avgCollectionRate = schools.reduce((sum, school) => sum + (school.collectionRate || 0), 0) / schools.length
  const totalRevenue = schools.reduce((sum, school) => {
    const rates = { Free: 0, Basic: 50, Standard: 150, Premium: 300 }
    return sum + (rates[school.subscription as keyof typeof rates] || 0)
  }, 0)

  const columns: ColumnDef<SchoolType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          School Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {row.original.address?.split(",")[1]?.trim() || "Location"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "principal",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Principal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.getValue("principal")}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "subscription",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Plan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => getSubscriptionBadge(row.getValue("subscription")),
    },
    {
      accessorKey: "students",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Students
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right space-y-1">
          <div className="font-medium">{row.getValue("students")}</div>
          <div className="text-xs text-muted-foreground">{row.original.teachers} teachers</div>
        </div>
      ),
    },
    {
      accessorKey: "performanceScore",
      header: "Performance",
      cell: ({ row }) => {
        const score = row.original.performanceScore || 0
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{score}%</span>
              {score >= 85 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
            </div>
            <Progress value={score} className="h-1 w-16" />
          </div>
        )
      },
    },
    {
      accessorKey: "lastActivity",
      header: "Last Activity",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.original.lastActivity || "No recent activity"}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const school = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/superadmin/schools/${school.id}/stats`)}>
                <Eye className="h-4 w-4 mr-2" />
                View Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSchool(school)
                  setShowEditDialog(true)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit School
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(school.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy School ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                School Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteSchools([school.id])}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete School
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">School Management</h1>
            <p className="text-muted-foreground">Comprehensive management and monitoring of all registered schools</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add School
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New School</DialogTitle>
                  <DialogDescription>Fill in the details to register a new school in the system.</DialogDescription>
                </DialogHeader>
                <AddSchoolForm onSubmit={handleAddSchool} onCancel={() => setShowAddDialog(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Advanced Search and Filter Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schools, principals, or email addresses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleExport("csv")}>
                        <FileText className="h-4 w-4 mr-2" />
                        CSV File
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("excel")}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Excel Spreadsheet
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("pdf")}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedSchools.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{selectedSchools.length} school(s) selected</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("activate")} disabled={isLoading}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("deactivate")}
                    disabled={isLoading}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("delete")}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSchools([])}>
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSchools}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  +12% from last month
                </div>
                <Progress value={85} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSchools}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
                  {((activeSchools / totalSchools) * 100).toFixed(1)}% active rate
                </div>
                <Progress value={(activeSchools / totalSchools) * 100} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <GraduationCap className="inline h-3 w-3 mr-1" />
                  Across all schools
                </div>
                <Progress value={75} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  +8.2% from last month
                </div>
                <Progress value={92} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </div>

          {/* Schools Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Schools Directory</CardTitle>
                  <CardDescription>
                    Showing {filteredSchools.length} of {totalSchools} schools
                  </CardDescription>
                </div>
                <Badge variant="outline">{filteredSchools.length} results</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CRUDTable
                columns={columns}
                data={filteredSchools}
                filterColumn="name"
                onAdd={() => setShowAddDialog(true)}
                onEdit={handleEditSchool}
                onDelete={handleDeleteSchools}
                selectedItem={selectedSchool}
                onSelectionChange={setSelectedSchools}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Average performance across all schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Performance</span>
                    <span className="text-2xl font-bold">{avgPerformance.toFixed(1)}%</span>
                  </div>
                  <Progress value={avgPerformance} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Top Performer</span>
                      <div className="font-medium">Riverside High (92%)</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Needs Attention</span>
                      <div className="font-medium">Oak Valley (78%)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Rates</CardTitle>
                <CardDescription>Fee collection performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Collection Rate</span>
                    <span className="text-2xl font-bold">{avgCollectionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={avgCollectionRate} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Best Collection</span>
                      <div className="font-medium">Greenwood (95%)</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lowest Collection</span>
                      <div className="font-medium">Riverside (87%)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Premium", "Standard", "Basic", "Free"].map((plan) => {
                    const count = schools.filter((s) => s.subscription === plan).length
                    const percentage = (count / totalSchools) * 100
                    return (
                      <div key={plan} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{plan}</span>
                          <span>
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-1" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Active", "Inactive", "Pending"].map((status) => {
                    const count = schools.filter((s) => s.status === status).length
                    const percentage = (count / totalSchools) * 100
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{status}</span>
                          <span>
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-1" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Students/School</span>
                    <span className="font-medium">{Math.round(totalStudents / totalSchools)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Premium Rate</span>
                    <span className="font-medium">{((premiumSchools / totalSchools) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Teachers</span>
                    <span className="font-medium">{schools.reduce((sum, s) => sum + s.teachers, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Student:Teacher</span>
                    <span className="font-medium">
                      1:{Math.round(totalStudents / schools.reduce((sum, s) => sum + s.teachers, 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest updates from all schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{activity.school}</span>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>3 schools have overdue payments</AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>2 schools need performance review</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New School
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setShowBulkMessageDialog(true)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Bulk Message
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setShowReportDialog(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>Update the details for {selectedSchool?.name}.</DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <AddSchoolForm
              initialData={selectedSchool}
              onSubmit={handleEditSchool}
              onCancel={() => {
                setShowEditDialog(false)
                setSelectedSchool(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Message Dialog */}
      <Dialog open={showBulkMessageDialog} onOpenChange={setShowBulkMessageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Bulk Message</DialogTitle>
            <DialogDescription>Send a message to multiple schools at once.</DialogDescription>
          </DialogHeader>
          <BulkMessageForm
            schools={schools}
            onSubmit={handleSendBulkMessage}
            onCancel={() => setShowBulkMessageDialog(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>Select the type of report you want to generate.</DialogDescription>
          </DialogHeader>
          <ReportGeneratorForm
            onSubmit={handleGenerateReport}
            onCancel={() => setShowReportDialog(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
