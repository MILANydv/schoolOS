"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { EnhancedTable, TableColumn, TableFilter, TableAction } from "@/components/table/enhanced-table"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Eye, 
  FileText, 
  RefreshCw,
  Database,
  Shield, 
  Trash2, 
  User, 
  Users, 
  BookOpen,
  GraduationCap,
  DollarSign,
  Settings,
  Lock,
  XCircle,
  Mail,
  Phone
} from "lucide-react"
import { format } from "date-fns"

// Enhanced mock data for comprehensive logging
const mockLogs = [
  {
    id: "log001",
    timestamp: new Date("2025-01-15T10:30:00"),
    user: "admin@school.edu",
    userName: "John Admin",
    role: "School Admin",
    module: "User Management",
    action: "Created new teacher account",
    severity: "info" as const,
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
    sessionId: "sess_001",
    details: "Teacher: Sarah Johnson, Email: sarah.j@school.edu",
    status: "success" as const
  },
  {
    id: "log002",
    timestamp: new Date("2025-01-15T09:15:22"),
    user: "teacher.sarah@school.edu",
    userName: "Sarah Johnson",
    role: "Teacher",
    module: "Attendance",
    action: "Marked attendance for Class 5A",
    severity: "info" as const,
    ipAddress: "192.168.1.101",
    userAgent: "Firefox/119.0.0.0",
    sessionId: "sess_002",
    details: "Class: 5A, Date: 2025-01-15, Present: 28/30",
    status: "success" as const
  },
  {
    id: "log003",
    timestamp: new Date("2025-01-15T08:45:10"),
    user: "accountant@school.edu",
    userName: "Mike Finance",
    role: "Accountant",
    module: "Fees Management",
    action: "Recorded fee payment",
    severity: "info" as const,
    ipAddress: "192.168.1.102",
    userAgent: "Safari/17.0.0.0",
    sessionId: "sess_003",
    details: "Student: Alex Smith, Amount: $500, Method: Credit Card",
    status: "success" as const
  },
  {
    id: "log004",
    timestamp: new Date("2025-01-14T16:20:05"),
    user: "admin@school.edu",
    userName: "John Admin",
    role: "School Admin",
    module: "Class Management",
    action: "Updated class section",
    severity: "warning" as const,
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
    sessionId: "sess_004",
    details: "Class: 2B, Old Section: A, New Section: B",
    status: "success" as const
  },
  {
    id: "log005",
    timestamp: new Date("2025-01-14T14:30:00"),
    user: "unknown@external.com",
    userName: "Unknown User",
    role: "External",
    module: "Authentication",
    action: "Failed login attempt",
    severity: "error" as const,
    ipAddress: "203.45.67.89",
    userAgent: "Unknown Browser",
    sessionId: "sess_005",
    details: "Invalid credentials for admin@school.edu",
    status: "failed" as const
  },
  {
    id: "log006",
    timestamp: new Date("2025-01-13T17:30:45"),
    user: "admin@school.edu",
    userName: "John Admin",
    role: "School Admin",
    module: "Security",
    action: "Password reset requested",
    severity: "warning" as const,
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
    sessionId: "sess_006",
    details: "User: teacher.sarah@school.edu",
    status: "success" as const
  },
  {
    id: "log007",
    timestamp: new Date("2025-01-13T15:20:10"),
    user: "system@school.edu",
    userName: "System",
    role: "System",
    module: "Database",
    action: "Backup completed",
    severity: "info" as const,
    ipAddress: "127.0.0.1",
    userAgent: "System Process",
    sessionId: "sess_007",
    details: "Backup size: 2.5GB, Duration: 15 minutes",
    status: "success" as const
  },
  {
    id: "log008",
    timestamp: new Date("2025-01-13T12:45:30"),
    user: "teacher.mike@school.edu",
    userName: "Mike Teacher",
    role: "Teacher",
    module: "Exam Management",
    action: "Created new exam",
    severity: "info" as const,
    ipAddress: "192.168.1.103",
    userAgent: "Edge/120.0.0.0",
    sessionId: "sess_008",
    details: "Exam: Math Midterm, Class: 8A, Date: 2025-01-20",
    status: "success" as const
  },
  {
    id: "log009",
    timestamp: new Date("2025-01-12T11:00:15"),
    user: "admin@school.edu",
    userName: "John Admin",
    role: "School Admin",
    module: "System Settings",
    action: "Changed system configuration",
    severity: "critical" as const,
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
    sessionId: "sess_009",
    details: "Updated backup schedule from daily to weekly",
    status: "success" as const
  },
  {
    id: "log010",
    timestamp: new Date("2025-01-12T09:45:22"),
    user: "parent.jane@email.com",
    userName: "Jane Parent",
    role: "Parent",
    module: "Student Portal",
    action: "Viewed student progress",
    severity: "info" as const,
    ipAddress: "192.168.1.104",
    userAgent: "Mobile Safari/17.0.0.0",
    sessionId: "sess_010",
    details: "Student: Emma Parent, Grade: 6B",
    status: "success" as const
  }
]

interface LogEntry {
  id: string
  timestamp: Date
  user: string
  userName: string
  role: string
  module: string
  action: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  ipAddress: string
  userAgent: string
  sessionId: string
  details: string
  status: 'success' | 'failed' | 'pending'
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200'
    case 'error': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-green-100 text-green-800 border-green-200'
    case 'failed': return 'bg-red-100 text-red-800 border-red-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getModuleIcon = (module: string) => {
  switch (module) {
    case 'User Management': return <Users className="w-4 h-4" />
    case 'Attendance': return <CheckCircle className="w-4 h-4" />
    case 'Fees Management': return <DollarSign className="w-4 h-4" />
    case 'Class Management': return <GraduationCap className="w-4 h-4" />
    case 'Authentication': return <Shield className="w-4 h-4" />
    case 'Exam Management': return <BookOpen className="w-4 h-4" />
    case 'System Settings': return <Settings className="w-4 h-4" />
    case 'Student Portal': return <User className="w-4 h-4" />
    case 'Security': return <Lock className="w-4 h-4" />
    case 'Database': return <Database className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

export default function SchoolAdminLogsPage() {
  const [logs, setLogs] = React.useState<LogEntry[]>(mockLogs)
  const [selectedLog, setSelectedLog] = React.useState<LogEntry | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const { toast } = useToast()

  // Analytics calculations
  const totalLogs = logs.length
  const criticalLogs = logs.filter(log => log.severity === 'critical').length
  const errorLogs = logs.filter(log => log.severity === 'error').length
  const warningLogs = logs.filter(log => log.severity === 'warning').length
  const infoLogs = logs.filter(log => log.severity === 'info').length
  const failedActions = logs.filter(log => log.status === 'failed').length
  const uniqueUsers = new Set(logs.map(log => log.user)).size
  const uniqueModulesCount = new Set(logs.map(log => log.module)).size
  const todayLogs = logs.filter(log => 
    log.timestamp.toDateString() === new Date().toDateString()
  ).length

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Role', 'Module', 'Action', 'Severity', 'Status', 'IP Address', 'Details'],
      ...logs.map(log => [
        log.timestamp.toISOString(),
        log.userName,
        log.role,
        log.module,
        log.action,
        log.severity,
        log.status,
        log.ipAddress,
        log.details
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Export Successful",
      description: `${logs.length} logs exported to CSV`,
    })
  }

  const handleRefresh = () => {
    toast({
      title: "Logs Refreshed",
      description: "Latest logs have been loaded",
    })
  }

  const handleViewLog = (log: LogEntry) => {
    setSelectedLog(log)
  }

  const handleBulkDelete = (selectedLogs: LogEntry[]) => {
    const idsToDelete = selectedLogs.map(log => log.id)
    setLogs(prev => prev.filter(log => !idsToDelete.includes(log.id)))
    setSelectedIds([])
    toast({
      title: "Logs Deleted",
      description: `${selectedLogs.length} logs have been deleted`,
      variant: "destructive"
    })
  }

  // Define table columns
  const columns: TableColumn<LogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      cell: (log) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}</span>
        </div>
      )
    },
    {
      key: 'userName',
      header: 'User',
      sortable: true,
      cell: (log) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{log.userName}</div>
            <div className="text-sm text-gray-500">{log.role}</div>
          </div>
        </div>
      )
    },
    {
      key: 'module',
      header: 'Module',
      sortable: true,
      cell: (log) => (
        <div className="flex items-center gap-2">
          {getModuleIcon(log.module)}
          <span className="text-sm text-gray-900">{log.module}</span>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      cell: (log) => (
        <div>
          <div className="text-sm text-gray-900 max-w-xs truncate" title={log.action}>
            {log.action}
          </div>
          <div className="text-sm text-gray-500 max-w-xs truncate" title={log.details}>
            {log.details}
          </div>
        </div>
      )
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      cell: (log) => (
        <Badge className={`${getSeverityColor(log.severity)}`}>
          {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (log) => (
        <Badge className={`${getStatusColor(log.status)}`}>
          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
        </Badge>
      )
    }
  ]

  // Define table filters
  const filters: TableFilter[] = [
    {
      key: 'severity',
      type: 'select',
      label: 'Severity',
      options: [
        { value: 'info', label: 'Info' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' },
        { value: 'critical', label: 'Critical' }
      ]
    },
    {
      key: 'module',
      type: 'select',
      label: 'Module',
      options: Array.from(new Set(logs.map(log => log.module))).map(module => ({
        value: module,
        label: module
      }))
    },
    {
      key: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { value: 'success', label: 'Success' },
        { value: 'failed', label: 'Failed' },
        { value: 'pending', label: 'Pending' }
      ]
    },
    {
      key: 'role',
      type: 'select',
      label: 'Role',
      options: Array.from(new Set(logs.map(log => log.role))).map(role => ({
        value: role,
        label: role
      }))
    },
    {
      key: 'timestamp',
      type: 'dateRange',
      label: 'Date Range'
    }
  ]

  // Define table actions
  const actions: TableAction<LogEntry>[] = [
    {
      key: 'view',
      label: 'View Details',
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewLog
    }
  ]

  // Define bulk actions
  const bulkActions: TableAction<LogEntry[]>[] = [
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleBulkDelete,
      variant: 'destructive'
    }
  ]

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Audit Logs</h1>
                <p className="text-gray-600 mt-1">Comprehensive system activity monitoring and security tracking</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button 
                  onClick={handleExport}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-blue-100 mb-1">Total Logs</p>
                          <p className="text-4xl font-bold text-white mb-2">{totalLogs}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-blue-100">
                              {todayLogs} today
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                          <FileText className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-400"></div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">System Activity</p>
                    <p className="text-xs">Total: {totalLogs} logs</p>
                    <p className="text-xs">Today: {todayLogs} activities</p>
                    <p className="text-xs">Real-time monitoring active</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-red-100 mb-1">Critical Issues</p>
                          <p className="text-4xl font-bold text-white mb-2">{criticalLogs}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-red-100">
                              {errorLogs} errors, {warningLogs} warnings
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                          <AlertTriangle className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-orange-400"></div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Security Alerts</p>
                    <p className="text-xs">Critical: {criticalLogs} issues</p>
                    <p className="text-xs">Errors: {errorLogs} events</p>
                    <p className="text-xs">Warnings: {warningLogs} alerts</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-green-100 mb-1">Success Rate</p>
                          <p className="text-4xl font-bold text-white mb-2">{Math.round(((totalLogs - failedActions) / totalLogs) * 100)}%</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-green-100">
                              {failedActions} failed actions
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                          <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">System Health</p>
                    <p className="text-xs">Success Rate: {Math.round(((totalLogs - failedActions) / totalLogs) * 100)}%</p>
                    <p className="text-xs">Failed: {failedActions} actions</p>
                    <p className="text-xs">Status: Excellent</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-purple-100 mb-1">Active Users</p>
                          <p className="text-4xl font-bold text-white mb-2">{uniqueUsers}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-purple-100">
                              {uniqueModulesCount} modules
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">User Activity</p>
                    <p className="text-xs">Active Users: {uniqueUsers}</p>
                    <p className="text-xs">Modules Used: {uniqueModulesCount}</p>
                    <p className="text-xs">System Utilization: High</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-orange-100 mb-1">System Load</p>
                          <p className="text-4xl font-bold text-white mb-2">85%</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-orange-100">
                              Normal operation
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                          <Activity className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
                    </CardContent>
        </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Performance</p>
                    <p className="text-xs">CPU Usage: 85%</p>
                    <p className="text-xs">Memory: 72%</p>
                    <p className="text-xs">Status: Optimal</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Enhanced Table */}
          <EnhancedTable
            data={logs}
            columns={columns}
            title="System Audit Logs"
            description="Comprehensive system activity monitoring and security tracking"
            filters={filters}
            actions={actions}
            bulkActions={bulkActions}
            onExport={handleExport}
            searchPlaceholder="Search logs by action, user, or details..."
            searchKeys={['action', 'userName', 'details', 'module']}
            pageSize={10}
            pageSizeOptions={[10, 25, 50, 100]}
            showPagination={true}
            showSearch={true}
            showFilters={true}
            showBulkActions={true}
            showExport={true}
            onRowClick={handleViewLog}
            onSelectionChange={setSelectedIds}
            selectedIds={selectedIds}
            sortable={true}
            sortKey="timestamp"
            sortDirection="desc"
            idField="id"
            emptyState={
              <div className="flex flex-col items-center py-12">
                <Database className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
      </div>
            }
          />
        </div>

        {/* Log Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Log Details
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLog(null)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Timestamp</label>
                    <p className="text-sm text-gray-900">{format(selectedLog.timestamp, 'PPP p')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">User</label>
                    <p className="text-sm text-gray-900">{selectedLog.userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900">{selectedLog.user}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Role</label>
                    <p className="text-sm text-gray-900">{selectedLog.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Module</label>
                    <div className="flex items-center gap-2">
                      {getModuleIcon(selectedLog.module)}
                      <span className="text-sm text-gray-900">{selectedLog.module}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Action</label>
                    <p className="text-sm text-gray-900">{selectedLog.action}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Severity</label>
                    <Badge className={`${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity.charAt(0).toUpperCase() + selectedLog.severity.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={`${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status.charAt(0).toUpperCase() + selectedLog.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">IP Address</label>
                    <p className="text-sm text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Session ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.sessionId}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Details</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{selectedLog.details}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">User Agent</label>
                  <p className="text-xs text-gray-900 bg-gray-50 p-3 rounded-md font-mono">{selectedLog.userAgent}</p>
                </div>
              </CardContent>
      </Card>
          </div>
        )}
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
