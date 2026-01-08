"use client"

import { useState, useEffect } from "react"
import { useDashboardStats, useRecentActivities, useDashboardAlerts, useRefreshDashboard, useUpcomingEvents } from "@/hooks"
import { Toaster } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  GraduationCap,
  RefreshCw,
  Activity,
  Zap,
  UserCheck,
  Calendar,
  UserPlus,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Eye,
  CreditCard,
  FileText,
  Bell,
  Download
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { toast } from "sonner"

// Icons mapping for dashboard metrics
const getMetricIcon = (title: string) => {
  switch (title) {
    case "Total Students": return Users
    case "Active Teachers": return GraduationCap
    case "Fee Collection": return DollarSign
    case "Attendance Rate": return UserCheck
    case "Pending Admissions": return UserPlus
    case "Upcoming Events": return Calendar
    default: return Activity
  }
}

// Recent activities will be fetched from API
const recentActivities: any[] = []


// Enhanced quick actions for school admin
const quickActions = [
  {
    title: "Add New Student",
    description: "Register new student enrollment",
    icon: UserPlus,
    href: "/schooladmin/students/add",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    urgent: false
  },
  {
    title: "Review Admissions",
    description: "Process pending applications",
    icon: FileText,
    href: "/schooladmin/admissions",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    urgent: true,
    badge: "42 Pending"
  },
  {
    title: "Fee Collection",
    description: "Track and manage payments",
    icon: DollarSign,
    href: "/schooladmin/fees",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    urgent: false
  },
  {
    title: "Staff Management",
    description: "Manage teachers and staff",
    icon: GraduationCap,
    href: "/schooladmin/staff/management",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    urgent: false
  },
  {
    title: "Send Notifications",
    description: "Broadcast to students/parents",
    icon: Bell,
    href: "/schooladmin/notifications",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    urgent: false
  },
  {
    title: "View System Logs",
    description: "Monitor system activity",
    icon: Activity,
    href: "/schooladmin/logs",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    urgent: false
  }
]

// Today's schedule
const todaysSchedule = [
  {
    id: 1,
    time: "09:00 AM",
    title: "Math Class - Grade 10",
    teacher: "Mrs. Johnson",
    room: "Room 101",
    type: "class"
  },
  {
    id: 2,
    time: "10:30 AM",
    title: "Parent Meeting",
    teacher: "Principal",
    room: "Office",
    type: "meeting"
  },
  {
    id: 3,
    time: "02:00 PM",
    title: "Staff Meeting",
    teacher: "All Staff",
    room: "Conference Room",
    type: "meeting"
  },
  {
    id: 4,
    time: "03:30 PM",
    title: "Science Lab - Grade 9",
    teacher: "Dr. Smith",
    room: "Lab 1",
    type: "class"
  }
]

// Performance summary data
const performanceSummary = [
  {
    title: "Academic Performance",
    value: "87.5%",
    target: 85,
    current: 87.5,
    trend: "up",
    description: "Average test scores across all grades"
  },
  {
    title: "Teacher Satisfaction",
    value: "4.2/5",
    target: 4.0,
    current: 4.2,
    trend: "up",
    description: "Based on monthly surveys"
  },
  {
    title: "Student Retention",
    value: "96.8%",
    target: 95,
    current: 96.8,
    trend: "up",
    description: "Students continuing next year"
  },
  {
    title: "Parent Engagement",
    value: "78%",
    target: 80,
    current: 78,
    trend: "down",
    description: "Active parent participation"
  }
]




export default function SchoolAdminDashboardPage() {
  // New React Query hooks with proper caching
  const { data: dashboardStatsData, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: logsData } = useRecentActivities()
  const { data: eventsData } = useUpcomingEvents()
  const { data: alertsData } = useDashboardAlerts()
  const refreshDashboard = useRefreshDashboard()

  // Local UI state
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [localAlerts, setLocalAlerts] = useState<any[]>([])

  const router = useRouter()

  // Sync alertsData with localAlerts
  useEffect(() => {
    if (alertsData) {
      setLocalAlerts(alertsData)
    }
  }, [alertsData])

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Handle data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshDashboard()
    } catch (error) {
      toast.error("Refresh Failed", {
        description: "Failed to update dashboard data",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const dismissAlert = (id: string) => {
    setLocalAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  // Handle card clicks
  const handleCardClick = (href: string) => {
    router.push(href)
  }

  const stats = (dashboardStatsData as any)?.data || dashboardStatsData || {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalRevenue: 0,
    totalDue: 0,
    feeCollectionRate: 0,
    pendingAdmissions: 0
  }

  // Handle quick action clicks
  const handleQuickAction = (action: any) => {
    if (action.urgent) {
      toast.error("Urgent Action Required", {
        description: `${action.badge || action.description}`,
      })
      router.push(action.href)
    } else {
      router.push(action.href)
    }
  }

  if (statsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load dashboard data</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">School Administration Dashboard</h1>
                <p className="text-gray-600 mt-1">Comprehensive overview of school operations and key metrics</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    System Online
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Last updated: {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {/* Enhanced Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Total Students",
                value: String(stats?.totalStudents ?? 0),
                change: "+12%",
                trend: "up",
                details: "Total active students",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Active Teachers",
                value: String(stats?.totalTeachers ?? 0),
                change: "+2",
                trend: "up",
                details: "Full-time faculty",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Fee Collection",
                value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`,
                change: `${stats?.feeCollectionRate ?? 0}%`,
                trend: "up",
                details: "Collection rate",
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Total Due",
                value: `₹${(stats?.totalDue ?? 0).toLocaleString()}`,
                change: "-5%",
                trend: "down",
                details: "Outstanding fees",
                gradient: "from-orange-500 to-orange-600"
              },
              {
                title: "Upcoming Events",
                value: String(eventsData?.total || eventsData?.length || 0),
                change: "Next 7 days",
                trend: "neutral",
                details: "Scheduled events",
                gradient: "from-pink-500 to-pink-600"
              },
              {
                title: "System Logs",
                value: String(logsData?.total || logsData?.data?.length || 0),
                change: "Last 24h",
                trend: "neutral",
                details: "System activities",
                gradient: "from-gray-500 to-gray-600"
              }
            ].map((metric, index) => {
              const Icon = getMetricIcon(metric.title)
              // Mock target for progress bar
              const target = 100
              const current = 75
              const progress = (current / target) * 100

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card
                        className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group"
                        onClick={() => { }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-90`}></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                        <CardContent className="relative p-6 text-white">
                          <div className="flex items-center justify-between mb-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-white/90">{metric.title}</p>
                              <p className="text-3xl font-bold">{metric.value}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            {metric.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-white" />
                            ) : metric.trend === "down" ? (
                              <TrendingDown className="h-4 w-4 text-white" />
                            ) : (
                              <Activity className="h-4 w-4 text-white" />
                            )}
                            <span className="text-sm font-medium text-white">
                              {metric.change}
                            </span>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20"></div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold">{metric.title}</p>
                        <p className="text-xs">{metric.details}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>

          {/* Quick Actions */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {quickActions.slice(0, 6).map((action, index) => {
                  const Icon = action.icon
                  return (
                    <div
                      key={index}
                      className={`relative p-3 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer group ${action.urgent ? 'border-orange-200 bg-orange-50' : 'border-gray-200 hover:border-blue-300'}`}
                      onClick={() => handleQuickAction(action)}
                    >
                      {action.urgent && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-105 transition-transform`}>
                          <Icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </h3>
                          {action.urgent && action.badge && (
                            <span className="text-xs text-orange-600 font-medium">{action.badge}</span>
                          )}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Key Information */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Today's Highlights */}
            <Card className="border shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Today's Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Fee Collection</p>
                        <p className="text-sm text-gray-600">Total collected</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Attendance Rate</p>
                        <p className="text-sm text-gray-600">Today's average</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">94.2%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-gray-900">Pending Admissions</p>
                        <p className="text-sm text-gray-600">Awaiting review</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-orange-600">{stats.pendingAdmissions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Recent Activities
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/schooladmin/logs')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {(logsData?.data || []).slice(0, 4).map((activity: any) => {
                    const Icon = Activity // Default icon
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`p-1.5 rounded-lg bg-blue-100 flex-shrink-0`}>
                          <Icon className={`h-3 w-3 text-blue-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.message || activity.action}</p>
                          <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    )
                  })}
                  {(!logsData?.data || logsData.data.length === 0) && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          {localAlerts.length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    System Alerts ({localAlerts.length})
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocalAlerts([])}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {localAlerts.slice(0, 3).map((alert) => (
                    <Alert key={alert.id} className={`border-l-4 ${alert.type === 'warning' ? 'border-orange-400 bg-orange-50' :
                      alert.type === 'error' ? 'border-red-400 bg-red-50' :
                        'border-blue-400 bg-blue-50'
                      }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {alert.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                          ) : alert.type === 'error' ? (
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                          )}
                          <div>
                            <AlertDescription className="font-medium text-gray-900 text-sm">
                              {alert.title}
                            </AlertDescription>
                            <AlertDescription className="text-xs text-gray-600 mt-1">
                              {alert.message}
                            </AlertDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
