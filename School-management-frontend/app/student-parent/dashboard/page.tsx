"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { timetableApi, eventsApi, notificationsApi, authApi, examsApi, resultsApi, feesApi } from "@/lib/api"
import { useAuthStore } from "@/hooks/useAuthStore"
import {
  BookOpen,
  DollarSign,
  CalendarCheck,
  ClipboardList,
  BellRing,
  TrendingUp,
  Clock,
  MapPin,
  Users,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Download,
  Filter,
  Target,
  BarChart3,
  GraduationCap,
  Activity,
  Star,
  Trophy,
  Zap,
  FileText,
  Eye,
  Edit3
} from "lucide-react"

// Mock data replaced by API calls
const studentData: any = {}
const academicMetrics: any = {}
const todaysSchedule: any[] = []
const upcomingEvents: any[] = []
const smartNotifications: any[] = []

export default function StudentParentDashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  // Fetch real data using React Query
  const { data: timetableData, isLoading: timetableLoading } = useQuery({
    queryKey: ['studentTimetable', user?.id],
    queryFn: () => timetableApi.getStudentTimetable(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  })

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => eventsApi.getAll({ upcoming: true, limit: 10 }),
    staleTime: 10 * 60 * 1000,
  })

  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getAll({ unread: true, limit: 20 }),
    staleTime: 2 * 60 * 1000,
  })

  const { data: examResultsData, isLoading: resultsLoading } = useQuery({
    queryKey: ['studentResults', user?.id],
    queryFn: () => resultsApi.getByStudent(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000,
  })

  const { data: feesData, isLoading: feesLoading } = useQuery({
    queryKey: ['studentFees', user?.id],
    queryFn: () => feesApi.getAll({ studentId: user?.id }),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  })

  // Mock data transformation functions
  const transformTimetableData = (data: any) => {
    if (!data?.data) return []
    return data.data.map((item: any) => ({
      id: item.id,
      time: item.timeSlot || `${item.startTime} - ${item.endTime}`,
      subject: item.subject?.name || item.subject,
      teacher: item.teacher?.name || 'Teacher',
      room: item.room || 'Room TBD',
      status: item.status || 'scheduled',
      topic: item.topic || ''
    }))
  }

  const transformEventsData = (data: any) => {
    if (!data?.data) return []
    return data.data.map((event: any) => ({
      id: event.id,
      title: event.title,
      date: new Date(event.date || event.startDate).toLocaleDateString(),
      type: event.type || 'general',
      description: event.description || ''
    }))
  }

  const todaysSchedule = transformTimetableData(timetableData)
  const upcomingEvents = transformEventsData(eventsData)

  const smartNotifications = (notificationsData?.data || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    description: n.content || n.message,
    time: new Date(n.createdAt).toLocaleDateString(),
    type: n.type || 'info',
    priority: n.priority || 'medium',
    icon: n.type === 'ALERT' ? AlertCircle : BellRing,
    color: n.priority === 'HIGH' ? 'text-red-600' : 'text-blue-600',
    bgColor: n.priority === 'HIGH' ? 'bg-red-50' : 'bg-blue-50',
    action: 'View',
    actionLink: '/student-parent/notifications'
  }))

  // Calculate academic metrics from real data
  const calculateAcademicMetrics = () => {
    const results = examResultsData?.data || []
    const totalResults = results.length || 1
    
    // Calculate CGPA from results
    const totalMarks = results.reduce((sum: number, result: any) => sum + (result.marks || 0), 0)
    const overallCGPA = totalResults > 0 ? ((totalMarks / totalResults) / 100) * 10 : 8.7

    // Calculate fee data
    const fees = feesData?.data || []
    const totalFees = fees.reduce((sum: number, fee: any) => sum + (fee.total || 0), 0)
    const paidFees = fees.reduce((sum: number, fee: any) => sum + (fee.paid || 0), 0)
    const pendingFees = totalFees - paidFees

    return {
      overallCGPA: Math.round(overallCGPA * 10) / 10,
      attendanceRate: 92.5, // This would come from attendance API
      assignmentsCompleted: 15, // This would come from assignments API
      totalAssignments: 18, // This would come from assignments API
      upcomingExams: 2, // This would come from exams API
      pendingFees,
      recentAchievements: 3 // This would come from achievements API
    }
  }

  const studentData = {
    name: user?.name || "Student",
    class: "Class 10-A", // Should come from user profile
    rollNumber: "10A001", // Should come from user profile
    avatar: "/placeholder-user.jpg",
    academicYear: "2024-2025",
    currentSemester: "Second Semester"
  }

  // Enhanced stat cards with actionable insights
  const studentStatCards = [
    {
      title: "Academic Performance",
      value: `${academicMetrics.overallCGPA} CGPA`,
      description: "Current semester",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+0.3 from last semester",
      action: "View Details",
      actionLink: "/student-parent/results"
    },
    {
      title: "Attendance Rate",
      value: `${academicMetrics.attendanceRate}%`,
      description: "This semester",
      icon: CalendarCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "Above class average",
      action: "View Details",
      actionLink: "/student-parent/attendance"
    },
    {
      title: "Assignment Progress",
      value: `${academicMetrics.assignmentsCompleted}/${academicMetrics.totalAssignments}`,
      description: "Completed",
      icon: ClipboardList,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "83% completion rate",
      action: "View Details",
      actionLink: "/student-parent/work/assignments"
    },
    {
      title: "Fee Status",
      value: `₹${academicMetrics.pendingFees.toLocaleString()}`,
      description: "Outstanding",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "Due in 15 days",
      action: "Pay Now",
      actionLink: "/student-parent/fees"
    },
  ]

  // Quick actions for common tasks
  const quickActions = [
    {
      title: "Submit Assignment",
      description: "Upload homework files",
      icon: ClipboardList,
      href: "/student-parent/work/assignments",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      priority: "high"
    },
    {
      title: "Pay Fees",
      description: "Make online payment",
      icon: DollarSign,
      href: "/student-parent/fees",
      color: "text-red-600",
      bgColor: "bg-red-50",
      priority: "high"
    },
    {
      title: "View Timetable",
      description: "Check class schedule",
      icon: BookOpen,
      href: "/student-parent/timetable",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      priority: "medium"
    },
    {
      title: "Check Results",
      description: "View exam scores",
      icon: Award,
      href: "/student-parent/results",
      color: "text-green-600",
      bgColor: "bg-green-50",
      priority: "medium"
    },
    {
      title: "Attendance Report",
      description: "View attendance details",
      icon: CalendarCheck,
      href: "/student-parent/attendance",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      priority: "low"
    },
    {
      title: "School Notifications",
      description: "Read announcements",
      icon: BellRing,
      href: "/student-parent/notifications",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      priority: "low"
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50"
      case "current": return "text-blue-600 bg-blue-50"
      case "upcoming": return "text-gray-600 bg-gray-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "low": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="h-4 w-4 text-red-500" />
      case "important": return <Clock className="h-4 w-4 text-orange-500" />
      case "info": return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <BellRing className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header with Student Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={studentData.avatar} alt={studentData.name} />
            <AvatarFallback className="text-lg">{studentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {studentData.name}!</h1>
            <p className="text-muted-foreground">
              {studentData.class} • Roll No: {studentData.rollNumber} • {studentData.currentSemester}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Badge>
        </div>
      </div>

      {/* Academic Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {studentStatCards.map((card, index) => {
          const IconComponent = card.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {card.trend}
                </p>
                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto" asChild>
                  <Link href={card.actionLink}>
                    {card.action} <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Today's Schedule Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Today's Classes
                </CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysSchedule.slice(0, 3).map((classItem, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <div className={`p-2 rounded-lg ${getStatusColor(classItem.status)}`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{classItem.subject}</div>
                          <div className="text-sm text-muted-foreground">{classItem.time}</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1">
                        <div className="text-sm font-medium">{classItem.teacher}</div>
                        <div className="text-xs text-muted-foreground">{classItem.room}</div>
                        <Badge variant="outline" className={`w-fit text-xs ${getStatusColor(classItem.status)}`}>
                          {classItem.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/student-parent/timetable">
                      View Full Schedule <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Top Performer</span>
                    </div>
                    <p className="text-sm text-green-700">Achieved highest score in Physics Mid-Term</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Perfect Attendance</span>
                    </div>
                    <p className="text-sm text-blue-700">100% attendance for the month of July</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Assignment Excellence</span>
                    </div>
                    <p className="text-sm text-purple-700">Outstanding work in Mathematics assignment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                Today's Complete Schedule
              </CardTitle>
              <CardDescription>Detailed class schedule for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {todaysSchedule.map((classItem, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${classItem.status === 'current' ? 'border-blue-500 bg-blue-50' : 'hover:bg-muted/50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${getStatusColor(classItem.status)}`}>
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{classItem.subject}</div>
                          <div className="text-sm text-muted-foreground">{classItem.topic}</div>
                          <div className="text-sm text-muted-foreground">{classItem.time}</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="text-sm font-medium">{classItem.teacher}</div>
                        <div className="text-sm text-muted-foreground">{classItem.room}</div>
                        <Badge variant="outline" className={`w-fit ${getStatusColor(classItem.status)}`}>
                          {classItem.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BellRing className="h-5 w-5" />
                    Smart Notifications
                  </CardTitle>
                  <CardDescription>Important updates and action items</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/student-parent/notifications">
                    View All <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartNotifications.map((notification) => {
                  const IconComponent = notification.icon
                  return (
                    <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${notification.bgColor}`}>
                          <IconComponent className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground">{notification.description}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            {getNotificationIcon(notification.type)}
                            {notification.time}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={notification.actionLink}>
                          {notification.action}
                        </Link>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                  <Link href={action.href}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                          <IconComponent className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                          <Badge variant="outline" className={`mt-2 ${getPriorityColor(action.priority)}`}>
                            {action.priority} priority
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
