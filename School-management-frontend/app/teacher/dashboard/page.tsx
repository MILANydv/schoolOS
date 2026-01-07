"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { timetableApi, examsApi, notificationsApi } from "@/lib/api"
import { useAuthStore } from "@/hooks/useAuthStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarCheck, Edit, BookOpen, BarChart, FileText, Clock, ClipboardList, User, TrendingUp, TrendingDown, Target, Award, AlertTriangle, CheckCircle, XCircle, Activity, Users, Calendar, Star, Zap, Lightbulb, Brain, Eye, Filter, Download, RefreshCw, Settings, Bell, Search, Plus, MoreHorizontal, ChevronRight, ChevronLeft, BarChart3, PieChart, LineChart, AreaChart } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedNumber } from "@/app/components/ui/animated-number"
import { CircularProgress } from "@/app/components/ui/circular-progress"
import { TeacherHeader } from "@/app/components/ui/teacher-header"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Enhanced Analytics Data Structure
interface AnalyticsData {
  performance: {
    overallScore: number
    trend: 'up' | 'down' | 'stable'
    changePercent: number
    topSubject: string
    improvementAreas: string[]
  }
  attendance: {
    currentRate: number
    targetRate: number
    trend: 'up' | 'down' | 'stable'
    classBreakdown: { className: string; rate: number; students: number }[]
  }
  engagement: {
    activeStudents: number
    totalStudents: number
    participationRate: number
    topPerformers: { name: string; score: number; improvement: number }[]
  }
  workload: {
    pendingTasks: number
    completedToday: number
    efficiency: number
    timeSpent: number
  }
}

// Enhanced Mock Data with Analytics
const teacherName = "Dr. Sarah Johnson"
const teacherAvatar = "/placeholder-user.jpg"
const teacherRole = "Senior Mathematics Teacher"
const teacherExperience = "8 years"

// Mock data replaced by API calls
const todaysClasses: any[] = []
const upcomingExams: any[] = []
const notifications: any[] = []

// Analytics Data
const analyticsData: AnalyticsData = {
  performance: {
    overallScore: 87.5,
    trend: 'up',
    changePercent: 12.3,
    topSubject: "Mathematics",
    improvementAreas: ["Class 9-B Physics", "Student Engagement"]
  },
  attendance: {
    currentRate: 94.2,
    targetRate: 95.0,
    trend: 'up',
    classBreakdown: [
      { className: "Class 10-A", rate: 96.4, students: 28 },
      { className: "Class 9-B", rate: 93.8, students: 32 },
      { className: "Class 11-C", rate: 92.1, students: 25 }
    ]
  },
  engagement: {
    activeStudents: 78,
    totalStudents: 85,
    participationRate: 91.8,
    topPerformers: [
      { name: "Emma Wilson", score: 95, improvement: 8 },
      { name: "Michael Chen", score: 93, improvement: 12 },
      { name: "Sophia Rodriguez", score: 91, improvement: 5 }
    ]
  },
  workload: {
    pendingTasks: 8,
    completedToday: 12,
    efficiency: 88.5,
    timeSpent: 6.5
  }
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

// Enhanced Analytics Components
const PerformanceCard = ({ data }: { data: AnalyticsData['performance'] }) => (
  <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-emerald-100 text-sm font-medium">Performance Score</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{data.overallScore}</span>
            <div className={`flex items-center gap-1 text-sm ${data.trend === 'up' ? 'text-green-200' : data.trend === 'down' ? 'text-red-200' : 'text-yellow-200'}`}>
              {data.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : data.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
              {data.changePercent}%
            </div>
          </div>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <Award className="h-6 w-6" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-100">Top Subject</span>
          <span className="font-semibold">{data.topSubject}</span>
        </div>
        <Progress value={data.overallScore} className="h-2 bg-white/20" />
      </div>
    </CardContent>
  </Card>
)

const AttendanceCard = ({ data }: { data: AnalyticsData['attendance'] }) => (
  <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-blue-100 text-sm font-medium">Attendance Rate</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{data.currentRate}%</span>
            <div className={`flex items-center gap-1 text-sm ${data.trend === 'up' ? 'text-green-200' : data.trend === 'down' ? 'text-red-200' : 'text-yellow-200'}`}>
              {data.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : data.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
              Target: {data.targetRate}%
            </div>
          </div>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <Users className="h-6 w-6" />
        </div>
      </div>
      <div className="space-y-2">
        {data.classBreakdown.map((cls, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-blue-100">{cls.className}</span>
            <span className="font-semibold">{cls.rate}%</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const EngagementCard = ({ data }: { data: AnalyticsData['engagement'] }) => (
  <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-purple-100 text-sm font-medium">Student Engagement</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{data.participationRate}%</span>
            <span className="text-sm text-purple-200">{data.activeStudents}/{data.totalStudents} active</span>
          </div>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <Brain className="h-6 w-6" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-purple-100">Top Performers</div>
        {data.topPerformers.slice(0, 2).map((performer, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-purple-100 truncate">{performer.name}</span>
            <span className="font-semibold">+{performer.improvement}%</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const WorkloadCard = ({ data }: { data: AnalyticsData['workload'] }) => (
  <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-orange-100 text-sm font-medium">Workload Efficiency</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{data.efficiency}%</span>
            <span className="text-sm text-orange-200">{data.timeSpent}h today</span>
          </div>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <Zap className="h-6 w-6" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-orange-100">Pending Tasks</span>
          <span className="font-semibold">{data.pendingTasks}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-orange-100">Completed Today</span>
          <span className="font-semibold">{data.completedToday}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [showNotifications, setShowNotifications] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedExam, setSelectedExam] = useState<any>(null)

  const { user } = useAuthStore()

  // Fetch real data
  const { data: timetableData } = useQuery({
    queryKey: ['teacherTimetable', user?.id],
    queryFn: () => timetableApi.getTeacherTimetable(user?.id || ''),
    enabled: !!user?.id
  })

  const { data: examsData } = useQuery({
    queryKey: ['exams'],
    queryFn: examsApi.getAll
  })

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getAll
  })

  const todaysClasses = timetableData?.data || []
  const upcomingExams = examsData?.data || []
  const notifications = notificationsData?.data || []
  const unreadCount = notifications.filter((n: any) => !n.read).length

  // Placeholder data for features not yet linked to API
  const pendingTasks: any[] = []
  const pendingGrading: any[] = []

  // Simulate loading state
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 500)
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Memoized calculations
  const highPriorityTasks = useMemo(() =>
    pendingTasks.filter(task => task.priority === "high"), [])

  const urgentGrading = useMemo(() =>
    pendingGrading.filter(assign => assign.priority === "high"), [])

  const currentClass = useMemo(() =>
    todaysClasses.find(cls => cls.status === "current"), [])

  // Handler functions
  const handleClassClick = (cls: any) => {
    setSelectedClass(cls)
    // Navigate to class management or show modal
    if (cls.status === "current") {
      window.location.href = `/teacher/attendance/mark?class=${cls.id}`
    } else {
      // Show class details modal
      console.log("Show class details for:", cls.name)
    }
  }

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    // Navigate based on task category
    switch (task.category) {
      case "grading":
        window.location.href = `/teacher/results/enter?task=${task.id}`
        break
      case "attendance":
        window.location.href = `/teacher/attendance/mark?class=${task.class}`
        break
      case "preparation":
        window.location.href = `/teacher/work/assignments?task=${task.id}`
        break
      default:
        console.log("Handle task:", task.task)
    }
  }

  const handleExamClick = (exam: any) => {
    setSelectedExam(exam)
    window.location.href = `/teacher/results/enter?exam=${exam.id}`
  }

  const handleGradingClick = (assignment: any) => {
    window.location.href = `/teacher/work/assignments?assignment=${assignment.id}`
  }

  const handleNotificationClick = (notification: any) => {
    // Mark as read and handle action
    console.log("Handle notification:", notification)
  }

  const handleProfileClick = () => {
    setShowProfileModal(true)
  }

  const handleSettingsClick = () => {
    setShowSettingsModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="w-full">


        <div className="p-6 space-y-6">
          {/* Enhanced Header with Analytics */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/teacher/profile">
                <Avatar className="h-16 w-16 ring-4 ring-blue-200 shadow-lg cursor-pointer hover:ring-blue-300 transition-all duration-200">
                  <AvatarImage src={teacherAvatar} alt={teacherName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl font-bold">
                    {teacherName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                  {getGreeting()}, {teacherName.split(" ")[0]}
                  <span className="text-2xl">👋</span>
                </h1>
                <p className="text-slate-600 text-lg">{teacherRole} • {teacherExperience} experience</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Star className="h-3 w-3 mr-1" />
                    Top Performer
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-refresh" className="text-sm font-medium text-slate-700">Auto Refresh</Label>
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>

              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications ({unreadCount} unread)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Link href="/teacher/profile">
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={handleSettingsClick}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PerformanceCard data={analyticsData.performance} />
            <AttendanceCard data={analyticsData.attendance} />
            <EngagementCard data={analyticsData.engagement} />
            <WorkloadCard data={analyticsData.workload} />
          </div>

          {/* Enhanced Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="assessments" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Assessments
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Current Class Alert */}
              {currentClass && (
                <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-green-900">Currently Teaching: {currentClass.name}</h3>
                          <p className="text-green-700">{currentClass.subject} • {currentClass.room}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-green-600">{currentClass.students} students</span>
                            <span className="text-sm text-green-600">{currentClass.attendance}% attendance</span>
                            <span className="text-sm text-green-600">Avg: {currentClass.avgScore}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          <Activity className="h-4 w-4 mr-2" />
                          View Class
                        </Button>
                        <Link href="/teacher/profile">
                          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Main Dashboard Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Today's Classes */}
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {todaysClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md cursor-pointer ${cls.status === "current"
                          ? "border-blue-500 bg-blue-50 hover:bg-blue-100"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          }`}
                        onClick={() => handleClassClick(cls)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-900">{cls.name}</h4>
                            <p className="text-sm text-slate-600">{cls.subject}</p>
                          </div>
                          <Badge variant={cls.status === "current" ? "default" : "secondary"}>
                            {cls.status === "current" ? "Now" : cls.time}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>{cls.room}</span>
                          <span>{cls.students} students</span>
                        </div>
                        {cls.status === "current" && (
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleClassClick(cls)}
                          >
                            <Activity className="h-4 w-4 mr-2" />
                            Manage Class
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-purple-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/teacher/attendance/mark">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <CalendarCheck className="h-4 w-4 mr-3 text-blue-600" />
                        Mark Attendance
                      </Button>
                    </Link>
                    <Link href="/teacher/results/enter">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <BarChart className="h-4 w-4 mr-3 text-green-600" />
                        Enter Results
                      </Button>
                    </Link>
                    <Link href="/teacher/work/assignments">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <FileText className="h-4 w-4 mr-3 text-purple-600" />
                        Manage Assignments
                      </Button>
                    </Link>
                    <Link href="/teacher/classes">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Users className="h-4 w-4 mr-3 text-orange-600" />
                        View All Classes
                      </Button>
                    </Link>
                    <Link href="/teacher/profile">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <User className="h-4 w-4 mr-3 text-indigo-600" />
                        My Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recent Notifications */}
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bell className="h-5 w-5 text-red-600" />
                      Recent Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all ${notification.priority === "high" ? "border-red-400 bg-red-50" :
                          notification.priority === "medium" ? "border-yellow-400 bg-yellow-50" :
                            "border-green-400 bg-green-50"
                          }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notification.timestamp}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                      View All Notifications
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Advanced Analytics Content */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.attendance.classBreakdown.map((cls, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{cls.className}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={cls.rate} className="w-24 h-2" />
                            <span className="text-sm font-bold">{cls.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.engagement.topPerformers.map((performer, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">
                                {performer.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{performer.name}</p>
                              <p className="text-xs text-slate-500">Score: {performer.score}%</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            +{performer.improvement}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assessments" className="space-y-6">
              {/* Enhanced Assessments Content */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Upcoming Exams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingExams.map((exam) => (
                        <div
                          key={exam.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleExamClick(exam)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{exam.subject}</h4>
                            <Badge variant="outline">{exam.type}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Class:</span> {exam.class}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {new Date(exam.date).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Students:</span> {exam.students}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {exam.duration}
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-slate-500">
                              <span className="font-medium">Topics:</span> {exam.topics.join(", ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Pending Grading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingGrading.map((assign) => (
                        <div
                          key={assign.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleGradingClick(assign)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{assign.title}</h4>
                            <Badge variant={assign.priority === "high" ? "destructive" : "secondary"}>
                              {assign.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>{assign.class}</span>
                            <span>Due: {assign.dueDate}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress: {assign.graded}/{assign.submissions}</span>
                              <span className="font-medium">{assign.avgScore}% avg</span>
                            </div>
                            <Progress value={(assign.graded / assign.submissions) * 100} className="mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              {/* Enhanced Tasks Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Task Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            task.priority === "high" ? "destructive" :
                              task.priority === "medium" ? "default" : "secondary"
                          }>
                            {task.priority}
                          </Badge>
                          <div>
                            <h4 className="font-semibold">{task.task}</h4>
                            <p className="text-sm text-slate-600">{task.class} • {task.estimatedTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">Due: {task.due}</span>
                          <Button size="sm" variant="outline">
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Teacher Profile</DialogTitle>
            <DialogDescription>
              Manage your profile information and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={teacherAvatar} alt={teacherName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl">
                  {teacherName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{teacherName}</h3>
                <p className="text-slate-600">{teacherRole}</p>
                <p className="text-sm text-slate-500">{teacherExperience} experience</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={teacherName.split(" ")[0]} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={teacherName.split(" ")[1]} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="sarah.johnson@school.edu" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                defaultValue="Senior Mathematics Teacher with 8 years of experience in advanced mathematics and physics. Passionate about making complex concepts accessible to students."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowProfileModal(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your dashboard preferences and notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Dashboard Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh-setting">Auto Refresh</Label>
                    <p className="text-sm text-slate-500">Automatically refresh dashboard data</p>
                  </div>
                  <Switch
                    id="auto-refresh-setting"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-slate-500">Receive real-time notifications</p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-slate-500">Use dark theme</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-4">Notification Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-slate-500">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-slate-500">Receive notifications via SMS</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
                Cancel
              </Button>
              <Button>Save Settings</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
