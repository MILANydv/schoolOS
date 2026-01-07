"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Filter,
  BarChart3,
  CalendarDays,
  Target,
  Award,
  XCircle,
  MinusCircle,
  Activity,
  Zap,
  Star,
  Trophy,
  CalendarCheck,
  FileText,
  Search,
  Eye,
  Home,
} from "lucide-react"
import { format, isSameDay } from "date-fns"

// Enhanced attendance data
interface AttendanceRecord {
  date: Date
  status: "present" | "absent" | "late" | "half-day"
  time: string
  remarks: string
  subject?: string
  teacher?: string
  reason?: string
  period?: number
}

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    date: new Date(2025, 6, 1),
    status: "present",
    time: "08:00",
    remarks: "On time",
    subject: "Mathematics",
    teacher: "John Smith",
    period: 1,
  },
  {
    date: new Date(2025, 6, 2),
    status: "present",
    time: "08:05",
    remarks: "Slightly late",
    subject: "Physics",
    teacher: "Sarah Johnson",
    period: 1,
  },
  { date: new Date(2025, 6, 3), status: "absent", time: "", remarks: "Medical appointment", reason: "Health issue" },
  {
    date: new Date(2025, 6, 4),
    status: "present",
    time: "07:55",
    remarks: "Early arrival",
    subject: "Chemistry",
    teacher: "Mike Wilson",
    period: 1,
  },
  {
    date: new Date(2025, 6, 5),
    status: "late",
    time: "08:30",
    remarks: "Traffic delay",
    subject: "English",
    teacher: "Emma Davis",
    period: 1,
  },
  {
    date: new Date(2025, 6, 8),
    status: "present",
    time: "08:00",
    remarks: "On time",
    subject: "Computer Science",
    teacher: "Alex Chen",
    period: 1,
  },
  {
    date: new Date(2025, 6, 9),
    status: "present",
    time: "08:02",
    remarks: "On time",
    subject: "Biology",
    teacher: "Lisa Brown",
    period: 1,
  },
  {
    date: new Date(2025, 6, 10),
    status: "present",
    time: "07:58",
    remarks: "Early arrival",
    subject: "Mathematics",
    teacher: "John Smith",
    period: 1,
  },
  { date: new Date(2025, 6, 11), status: "absent", time: "", remarks: "Family function", reason: "Personal" },
  {
    date: new Date(2025, 6, 12),
    status: "present",
    time: "08:00",
    remarks: "On time",
    subject: "Physics",
    teacher: "Sarah Johnson",
    period: 1,
  },
  {
    date: new Date(2025, 6, 15),
    status: "present",
    time: "08:01",
    remarks: "On time",
    subject: "Chemistry",
    teacher: "Mike Wilson",
    period: 1,
  },
  {
    date: new Date(2025, 6, 16),
    status: "late",
    time: "08:25",
    remarks: "Bus delay",
    subject: "English",
    teacher: "Emma Davis",
    period: 1,
  },
  {
    date: new Date(2025, 6, 17),
    status: "present",
    time: "07:55",
    remarks: "Early arrival",
    subject: "Computer Science",
    teacher: "Alex Chen",
    period: 1,
  },
  {
    date: new Date(2025, 6, 18),
    status: "present",
    time: "08:00",
    remarks: "On time",
    subject: "Biology",
    teacher: "Lisa Brown",
    period: 1,
  },
  {
    date: new Date(2025, 6, 19),
    status: "present",
    time: "08:03",
    remarks: "On time",
    subject: "Mathematics",
    teacher: "John Smith",
    period: 1,
  },
  {
    date: new Date(2025, 6, 22),
    status: "present",
    time: "08:00",
    remarks: "On time",
    subject: "Physics",
    teacher: "Sarah Johnson",
    period: 1,
  },
  {
    date: new Date(2025, 6, 23),
    status: "present",
    time: "07:58",
    remarks: "Early arrival",
    subject: "Chemistry",
    teacher: "Mike Wilson",
    period: 1,
  },
  {
    date: new Date(2025, 6, 24),
    status: "present",
    time: "08:01",
    remarks: "On time",
    subject: "English",
    teacher: "Emma Davis",
    period: 1,
  },
  {
    date: new Date(2025, 6, 25),
    status: "late",
    time: "08:20",
    remarks: "Weather delay",
    subject: "Computer Science",
    teacher: "Alex Chen",
    period: 1,
  },
  {
    date: new Date(2025, 6, 26),
    status: "present",
    time: "08:00",
    remarks: "On time",
    subject: "Biology",
    teacher: "Lisa Brown",
    period: 1,
  },
]

export default function EnhancedAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate comprehensive statistics
  const currentMonthRecords = mockAttendanceRecords.filter(
    (record) =>
      record.date.getMonth() === selectedMonth.getMonth() && record.date.getFullYear() === selectedMonth.getFullYear(),
  )

  const totalDays = currentMonthRecords.length
  const presentDays = currentMonthRecords.filter((r) => r.status === "present").length
  const absentDays = currentMonthRecords.filter((r) => r.status === "absent").length
  const lateDays = currentMonthRecords.filter((r) => r.status === "late").length
  const halfDays = currentMonthRecords.filter((r) => r.status === "half-day").length

  const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0
  const punctualityRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0

  // Calculate streaks
  const getCurrentStreak = () => {
    let streak = 0
    const today = new Date()
    for (let i = mockAttendanceRecords.length - 1; i >= 0; i--) {
      const record = mockAttendanceRecords[i]
      if (record.status === "present" && record.date <= today) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const getBestStreak = () => {
    let bestStreak = 0
    let currentStreak = 0
    mockAttendanceRecords.forEach((record) => {
      if (record.status === "present") {
        currentStreak++
        bestStreak = Math.max(bestStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    })
    return bestStreak
  }

  const currentStreak = getCurrentStreak()
  const bestStreak = getBestStreak()

  // Get attendance for selected date
  const getAttendanceForDate = (date: Date | undefined) => {
    if (!date) return null
    return mockAttendanceRecords.find((record) => isSameDay(record.date, date))
  }

  const attendanceForSelectedDate = getAttendanceForDate(selectedDate)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-50 text-green-700 border-green-200"
      case "absent":
        return "bg-red-50 text-red-700 border-red-200"
      case "late":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "half-day":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "late":
        return <MinusCircle className="h-4 w-4 text-yellow-600" />
      case "half-day":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 95) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-50" }
    if (percentage >= 90) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (percentage >= 80) return { level: "Average", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const performanceLevel = getPerformanceLevel(attendancePercentage)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Simple Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <CalendarCheck className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
                <p className="text-gray-600">Track your attendance and punctuality</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedMonth.toISOString()} onValueChange={(value) => setSelectedMonth(new Date(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={new Date(2025, 6, 1).toISOString()}>July 2025</SelectItem>
                  <SelectItem value={new Date(2025, 5, 1).toISOString()}>June 2025</SelectItem>
                  <SelectItem value={new Date(2025, 4, 1).toISOString()}>May 2025</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {presentDays} of {totalDays} days
              </p>
              <Progress value={attendancePercentage} className="mt-2" />
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${performanceLevel.bgColor} ${performanceLevel.color}`}
              >
                {performanceLevel.level}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Punctuality</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{punctualityRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">{lateDays} late arrivals</p>
              <Progress value={punctualityRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Zap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreak}</div>
              <p className="text-xs text-muted-foreground">Consecutive days</p>
              <div className="text-xs text-gray-500 mt-1">Best: {bestStreak} days</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absences</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{absentDays}</div>
              <p className="text-xs text-muted-foreground">This month</p>
              {absentDays === 0 && <div className="text-xs text-green-600 font-medium mt-1">Perfect attendance!</div>}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by date, subject, or teacher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <Home className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Attendance Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Monthly Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Monthly Summary
                    </CardTitle>
                    <CardDescription>{format(selectedMonth, "MMMM yyyy")} attendance breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{presentDays}</div>
                        <div className="text-sm text-green-700">Present</div>
                        <div className="text-xs text-gray-500">{((presentDays / totalDays) * 100).toFixed(1)}%</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{lateDays}</div>
                        <div className="text-sm text-yellow-700">Late</div>
                        <div className="text-xs text-gray-500">{((lateDays / totalDays) * 100).toFixed(1)}%</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{absentDays}</div>
                        <div className="text-sm text-red-700">Absent</div>
                        <div className="text-xs text-gray-500">{((absentDays / totalDays) * 100).toFixed(1)}%</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{halfDays}</div>
                        <div className="text-sm text-orange-700">Half Day</div>
                        <div className="text-xs text-gray-500">{((halfDays / totalDays) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <Progress value={attendancePercentage} className="h-3" />
                    <div className="text-center mt-2 text-sm text-gray-600">
                      Overall Attendance: {attendancePercentage.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Attendance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-purple-600" />
                      Recent Attendance
                    </CardTitle>
                    <CardDescription>Last 10 school days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentMonthRecords
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .slice(0, 10)
                        .map((record, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(record.status)}
                              <div>
                                <div className="font-medium">{format(record.date, "EEEE, MMM d")}</div>
                                <div className="text-sm text-gray-500">
                                  {record.subject && `${record.subject} • `}
                                  {record.teacher}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                              {record.time && <div className="text-xs text-gray-500 mt-1">{record.time}</div>}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Quick Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-green-600" />
                      Quick Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      modifiers={{
                        present: currentMonthRecords.filter((r) => r.status === "present").map((r) => r.date),
                        absent: currentMonthRecords.filter((r) => r.status === "absent").map((r) => r.date),
                        late: currentMonthRecords.filter((r) => r.status === "late").map((r) => r.date),
                        halfDay: currentMonthRecords.filter((r) => r.status === "half-day").map((r) => r.date),
                      }}
                      modifiersStyles={{
                        present: { backgroundColor: "#dcfce7", color: "#166534" },
                        absent: { backgroundColor: "#fee2e2", color: "#dc2626" },
                        late: { backgroundColor: "#fef3c7", color: "#d97706" },
                        halfDay: { backgroundColor: "#fed7aa", color: "#ea580c" },
                      }}
                    />
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 rounded"></div>
                        <span>Present</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 rounded"></div>
                        <span>Absent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                        <span>Late</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-3 rounded-lg ${performanceLevel.bgColor}`}>
                      <div className={`font-semibold ${performanceLevel.color}`}>{performanceLevel.level}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {attendancePercentage.toFixed(1)}% attendance rate
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Streak</span>
                        <span className="font-semibold">{currentStreak} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Best Streak</span>
                        <span className="font-semibold">{bestStreak} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Punctuality</span>
                        <span className="font-semibold">{punctualityRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Set multiple alarms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Prepare bag night before</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Leave 10 minutes early</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Track attendance daily</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      Attendance Calendar
                    </CardTitle>
                    <CardDescription>
                      {format(selectedMonth, "MMMM yyyy")} • Click on any date for details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border w-full"
                      modifiers={{
                        present: currentMonthRecords.filter((r) => r.status === "present").map((r) => r.date),
                        absent: currentMonthRecords.filter((r) => r.status === "absent").map((r) => r.date),
                        late: currentMonthRecords.filter((r) => r.status === "late").map((r) => r.date),
                        halfDay: currentMonthRecords.filter((r) => r.status === "half-day").map((r) => r.date),
                      }}
                      modifiersStyles={{
                        present: { backgroundColor: "#dcfce7", color: "#166534" },
                        absent: { backgroundColor: "#fee2e2", color: "#dc2626" },
                        late: { backgroundColor: "#fef3c7", color: "#d97706" },
                        halfDay: { backgroundColor: "#fed7aa", color: "#ea580c" },
                      }}
                    />

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <div className="w-4 h-4 bg-green-200 rounded"></div>
                        <span className="text-sm">Present ({presentDays})</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                        <div className="w-4 h-4 bg-red-200 rounded"></div>
                        <span className="text-sm">Absent ({absentDays})</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                        <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                        <span className="text-sm">Late ({lateDays})</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <div className="w-4 h-4 bg-orange-200 rounded"></div>
                        <span className="text-sm">Half Day ({halfDays})</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-600" />
                      Selected Date
                    </CardTitle>
                    <CardDescription>
                      {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {attendanceForSelectedDate ? (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg border ${getStatusColor(attendanceForSelectedDate.status)}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(attendanceForSelectedDate.status)}
                            <span className="font-semibold capitalize">{attendanceForSelectedDate.status}</span>
                          </div>
                          {attendanceForSelectedDate.time && (
                            <div className="text-sm mb-2">
                              <strong>Time:</strong> {attendanceForSelectedDate.time}
                            </div>
                          )}
                          <div className="text-sm">
                            <strong>Remarks:</strong> {attendanceForSelectedDate.remarks}
                          </div>
                        </div>

                        {attendanceForSelectedDate.subject && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm">
                              <strong>First Period:</strong> {attendanceForSelectedDate.subject}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Teacher:</strong> {attendanceForSelectedDate.teacher}
                            </div>
                          </div>
                        )}

                        {attendanceForSelectedDate.reason && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm">
                              <strong>Reason:</strong> {attendanceForSelectedDate.reason}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No attendance record for this date</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* All Records */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      All Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {currentMonthRecords
                          .sort((a, b) => b.date.getTime() - a.date.getTime())
                          .map((record, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded border cursor-pointer hover:shadow-sm transition-shadow ${
                                selectedDate && isSameDay(record.date, selectedDate) ? "ring-2 ring-blue-500" : ""
                              }`}
                              onClick={() => setSelectedDate(record.date)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(record.status)}
                                  <span className="text-sm font-medium">{format(record.date, "MMM d")}</span>
                                </div>
                                <Badge variant="outline" className={`text-xs ${getStatusColor(record.status)}`}>
                                  {record.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Attendance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Attendance Trends
                  </CardTitle>
                  <CardDescription>Your attendance patterns and insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Overall Performance</span>
                      <Badge className="bg-green-100 text-green-800">{attendancePercentage.toFixed(1)}%</Badge>
                    </div>
                    <Progress value={attendancePercentage} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      {attendancePercentage >= 95
                        ? "Excellent attendance!"
                        : attendancePercentage >= 90
                          ? "Good attendance"
                          : attendancePercentage >= 80
                            ? "Average attendance"
                            : "Needs improvement"}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Punctuality Score</span>
                      <Badge className="bg-blue-100 text-blue-800">{punctualityRate.toFixed(1)}%</Badge>
                    </div>
                    <Progress value={punctualityRate} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      {lateDays === 0 ? "Perfect punctuality!" : `${lateDays} late arrivals this month`}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Attendance Streak</span>
                      <Badge className="bg-purple-100 text-purple-800">{currentStreak} days</Badge>
                    </div>
                    <Progress value={(currentStreak / bestStreak) * 100} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      {currentStreak === bestStreak
                        ? "New record!"
                        : `${bestStreak - currentStreak} days to beat your record`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Detailed Statistics
                  </CardTitle>
                  <CardDescription>Comprehensive attendance breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{presentDays}</div>
                      <div className="text-sm text-green-700">Present Days</div>
                      <div className="text-xs text-gray-500">{((presentDays / totalDays) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{absentDays}</div>
                      <div className="text-sm text-red-700">Absent Days</div>
                      <div className="text-xs text-gray-500">{((absentDays / totalDays) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{lateDays}</div>
                      <div className="text-sm text-yellow-700">Late Days</div>
                      <div className="text-xs text-gray-500">{((lateDays / totalDays) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{halfDays}</div>
                      <div className="text-sm text-orange-700">Half Days</div>
                      <div className="text-xs text-gray-500">{((halfDays / totalDays) * 100).toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold">Key Insights</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span>Best streak: {bestStreak} consecutive days</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span>Average arrival: 8:05 AM</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Star className="h-4 w-4 text-green-600" />
                        <span>Most punctual subject: Mathematics</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
