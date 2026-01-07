"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  CalendarClock, 
  Clock, 
  BookOpen, 
  Users, 
  MapPin, 
  Download,
  Coffee,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BarChart3
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TeacherHeader } from "@/app/components/ui/teacher-header"

// Dynamic time slot configuration (same as school admin)
interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  period: number
  isBreak: boolean
  breakType?: 'short' | 'lunch' | 'assembly'
  duration: number
}

interface SchoolTiming {
  id: string
  name: string
  timeSlots: TimeSlot[]
  totalPeriods: number
  schoolStartTime: string
  schoolEndTime: string
}

// Default school timing (same as school admin)
const defaultSchoolTiming: SchoolTiming = {
  id: "1",
  name: "Standard 8-Period Day",
  schoolStartTime: "08:00",
  schoolEndTime: "15:30",
  totalPeriods: 8,
  timeSlots: [
    { id: "1", startTime: "08:00", endTime: "08:45", period: 1, isBreak: false, duration: 45 },
    { id: "2", startTime: "08:45", endTime: "09:30", period: 2, isBreak: false, duration: 45 },
    { id: "3", startTime: "09:30", endTime: "10:15", period: 3, isBreak: false, duration: 45 },
    { id: "4", startTime: "10:15", endTime: "11:00", period: 4, isBreak: false, duration: 45 },
    { id: "break1", startTime: "11:00", endTime: "11:15", period: 0, isBreak: true, breakType: 'short', duration: 15 },
    { id: "5", startTime: "11:15", endTime: "12:00", period: 5, isBreak: false, duration: 45 },
    { id: "6", startTime: "12:00", endTime: "12:45", period: 6, isBreak: false, duration: 45 },
    { id: "lunch", startTime: "12:45", endTime: "13:30", period: 0, isBreak: true, breakType: 'lunch', duration: 45 },
    { id: "7", startTime: "13:30", endTime: "14:15", period: 7, isBreak: false, duration: 45 },
    { id: "8", startTime: "14:15", endTime: "15:00", period: 8, isBreak: false, duration: 45 },
    { id: "assembly", startTime: "15:00", endTime: "15:30", period: 0, isBreak: true, breakType: 'assembly', duration: 30 },
  ]
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
type Day = typeof days[number]

interface TimetablePeriod {
  subject: string
  teacher: string
  room: string
  color: string
  classId: string
  className: string
  studentCount: number
  isBreak: boolean
  breakType?: 'short' | 'lunch' | 'assembly'
}

interface TimetableData {
  [key: string]: {
    [K in Day]?: TimetablePeriod[]
  }
}

// Mock teacher data
const currentTeacher = {
  id: "1",
  name: "John Smith",
  subjects: ["Mathematics", "Physics"],
  totalClasses: 6,
  totalStudents: 180
}

// Enhanced timetable data for teacher view
const mockTeacherTimetable: TimetableData = {
  "1": {
    Monday: [
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", classId: "", className: "", studentCount: 0, isBreak: true, breakType: 'short' },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
    ],
    Tuesday: [
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", classId: "", className: "", studentCount: 0, isBreak: true, breakType: 'short' },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
    ],
    Wednesday: [
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", classId: "", className: "", studentCount: 0, isBreak: true, breakType: 'short' },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
    ],
    Thursday: [
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", classId: "", className: "", studentCount: 0, isBreak: true, breakType: 'short' },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
    ],
    Friday: [
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", classId: "", className: "", studentCount: 0, isBreak: true, breakType: 'short' },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
    ],
    Saturday: [
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
      { subject: "Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", classId: "", className: "", studentCount: 0, isBreak: true, breakType: 'short' },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "1", className: "Class 10-A", studentCount: 32, isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", classId: "2", className: "Class 11-B", studentCount: 28, isBreak: false },
      { subject: "Physics", teacher: "John Smith", room: "Lab 201", color: "bg-green-100 text-green-800", classId: "3", className: "Class 9-C", studentCount: 35, isBreak: false },
    ],
  }
}

export default function TeacherTimetablePage() {
  const [viewMode, setViewMode] = useState<"weekly" | "today" | "list">("weekly")
  const [selectedTiming] = useState<SchoolTiming>(defaultSchoolTiming)

  // Get current time info for highlighting
  const now = new Date()
  const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1
  const currentDay = days[currentDayIndex]
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  // Determine current period
  const getCurrentPeriod = () => {
    const periods = selectedTiming.timeSlots.map((slot, index) => {
      const [hour, minute] = slot.startTime.split(':').map(Number)
      const startMinutes = hour * 60 + minute
      const [endHour, endMinute] = slot.endTime.split(':').map(Number)
      const endMinutes = endHour * 60 + endMinute
      return { start: startMinutes, end: endMinutes, index, slot }
    })

    return periods.findIndex((period) => 
      currentTimeInMinutes >= period.start && currentTimeInMinutes <= period.end
    )
  }

  const currentPeriodIndex = getCurrentPeriod()
  const timetableData = mockTeacherTimetable["1"] || {}
  const todaySchedule = timetableData[currentDay] || []

  // Get list view data
  const listData = Object.entries(timetableData).flatMap(([day, periods]) =>
    periods.map((period, index) => ({
      day,
      period: index + 1,
      timeSlot: selectedTiming.timeSlots[index],
      ...period
    }))
  )

  // Calculate teaching statistics
  const teachingStats = {
    totalClasses: currentTeacher.totalClasses,
    totalStudents: currentTeacher.totalStudents,
    subjectsTaught: currentTeacher.subjects.length,
    weeklyHours: listData.filter(item => !item.isBreak).length * 45 / 60, // 45 min periods
    todayClasses: todaySchedule.filter(item => !item.isBreak).length
  }

  // Calculate today's quick stats
  const todayPeriods = todaySchedule.filter(item => !item.isBreak).length
  const todayBreaks = todaySchedule.filter(item => item.isBreak).length
  const uniqueClasses = Array.from(new Set(todaySchedule.filter(item => !item.isBreak).map(item => item.className))).length
  // Find next class
  const nextPeriodIndex = todaySchedule.findIndex((item, idx) => idx > currentPeriodIndex && !item.isBreak)
  const nextPeriod = nextPeriodIndex !== -1 ? todaySchedule[nextPeriodIndex] : null
  const nextPeriodTime = nextPeriodIndex !== -1 ? selectedTiming.timeSlots[nextPeriodIndex] : null

  // Example motivational badge (could be dynamic)
  const motivationalBadge = todayPeriods === 0 ? "No classes today!" : `${todayPeriods} periods, ${uniqueClasses} classes, ${todayBreaks} breaks today!`

  return (
    <TooltipProvider>
      {/* Dashboard Card with stat cards and quick stats */}
      <Card className="w-full bg-white/95 border-b border-gray-200 shadow-sm print:hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1"></div>
        <CardContent className="p-6 space-y-6">
          {/* Stat Cards in grid, colored like attendance page */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
            {/* Total Classes */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Total Classes</p>
                    <p className="text-3xl font-bold">{teachingStats.totalClasses}</p>
                    <p className="text-indigo-200 text-sm">Classes assigned</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Total Students */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Students</p>
                    <p className="text-3xl font-bold">{teachingStats.totalStudents}</p>
                    <p className="text-emerald-200 text-sm">Students taught</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Subjects */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Subjects</p>
                    <p className="text-3xl font-bold">{teachingStats.subjectsTaught}</p>
                    <p className="text-red-200 text-sm">{currentTeacher.subjects.join(", ")}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <BookOpen className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Weekly Hours */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Weekly Hours</p>
                    <p className="text-3xl font-bold">{teachingStats.weeklyHours.toFixed(1)}h</p>
                    <p className="text-amber-200 text-sm">Teaching time</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Period Highlight */}
          {currentDay && currentPeriodIndex >= 0 && todaySchedule[currentPeriodIndex] && (
            <div className="transition-all duration-300">
              <Card className="border-green-200 bg-green-50 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-green-800">Current Teaching Period</h3>
                      <p className="text-sm text-green-600">
                        {currentDay} - Period {currentPeriodIndex + 1} ({selectedTiming.timeSlots[currentPeriodIndex]?.startTime} - {selectedTiming.timeSlots[currentPeriodIndex]?.endTime})
                      </p>
                      {todaySchedule[currentPeriodIndex] && !todaySchedule[currentPeriodIndex].isBreak && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="default" className="bg-green-600">
                            {todaySchedule[currentPeriodIndex].subject}
                          </Badge>
                          <span className="text-sm text-green-700">
                            {todaySchedule[currentPeriodIndex].className} • {todaySchedule[currentPeriodIndex].studentCount} students • {todaySchedule[currentPeriodIndex].room}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-800">
                        {selectedTiming.timeSlots[currentPeriodIndex]?.startTime}
                      </div>
                      <div className="text-sm text-green-600">
                        {selectedTiming.timeSlots[currentPeriodIndex]?.endTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* View Tabs */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "weekly" | "today" | "list")}
            className="mt-6">
            <TabsList className="grid w-full grid-cols-3 sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
              <TabsTrigger value="weekly">Weekly View</TabsTrigger>
              <TabsTrigger value="today">Today's Classes</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            {/* Weekly View */}
            <TabsContent value="weekly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Teaching Schedule</CardTitle>
                  <CardDescription>
                    Complete weekly timetable for {currentTeacher.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr>
                          <th className="border p-3 bg-muted text-left font-medium min-w-[120px] sticky left-0 z-20">Time</th>
                          {days.map((day) => (
                            <th key={day} className={`border p-3 bg-muted text-left font-medium min-w-[180px] ${currentDay === day ? 'bg-green-100' : ''}`}>{day}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTiming.timeSlots.map((timeSlot, timeIndex) => (
                          <tr key={timeSlot.id} className={timeIndex === currentPeriodIndex ? 'bg-green-50/60' : ''}>
                            <td className="border p-3 font-medium text-xs bg-muted/50 sticky left-0 z-10">
                              <div>{timeSlot.startTime} - {timeSlot.endTime}</div>
                              <div className="text-xs text-muted-foreground">
                                {timeSlot.isBreak ? (
                                  <span className="flex items-center gap-1 text-orange-700">
                                    <Coffee className="h-3 w-3" />
                                    {timeSlot.breakType ? `${timeSlot.breakType.charAt(0).toUpperCase() + timeSlot.breakType.slice(1)} Break` : 'Break'}
                                  </span>
                                ) : (
                                  `Period ${timeSlot.period}`
                                )}
                              </div>
                            </td>
                            {days.map((day) => {
                              const period = timetableData[day]?.[timeIndex]
                              const isCurrentPeriod = currentDay === day && currentPeriodIndex === timeIndex
                              const isBreak = period?.isBreak
                              return (
                                <td key={`${day}-${timeIndex}`} className={`border p-2 align-top transition-all duration-200 ${isCurrentPeriod ? 'ring-2 ring-green-500 bg-green-100' : ''}`}> 
                                  {period ? (
                                    <div className={`p-3 rounded-lg ${period.color} flex flex-col items-start gap-1 ${isBreak ? 'bg-orange-100 text-orange-800' : ''}`}> 
                                      {isBreak ? (
                                        <div className="flex items-center gap-2">
                                          <Coffee className="h-4 w-4" />
                                          <span className="font-medium text-sm">{period.subject}</span>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="font-medium text-sm">{period.subject}</div>
                                          <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                                            <Users className="h-3 w-3" />
                                            {period.className} ({period.studentCount} students)
                                          </div>
                                          <div className="text-xs opacity-75 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {period.room}
                                          </div>
                                        </>
                                      )}
                                      {isCurrentPeriod && (
                                        <Badge variant="default" className="mt-2 text-xs animate-pulse">
                                          Current
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="p-3 text-center text-muted-foreground text-sm">-</div>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Today's Classes: Timeline style */}
            <TabsContent value="today" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Classes - {currentDay}</CardTitle>
                  <CardDescription>
                    {currentDay && currentPeriodIndex >= 0 && (
                      <span className="text-green-600 font-medium">
                        Current Period: {currentPeriodIndex + 1} ({selectedTiming.timeSlots[currentPeriodIndex]?.startTime} - {selectedTiming.timeSlots[currentPeriodIndex]?.endTime})
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-muted pl-6 space-y-6">
                    {selectedTiming.timeSlots.map((timeSlot, index) => {
                      const period = todaySchedule[index]
                      const isCurrentPeriod = currentPeriodIndex === index
                      const isBreak = period?.isBreak
                      return (
                        <div
                          key={index}
                          className={`relative group`}
                        >
                          <div className={`absolute -left-6 top-4 w-3 h-3 rounded-full border-2 ${isCurrentPeriod ? 'border-green-500 bg-green-400 animate-pulse' : isBreak ? 'border-orange-400 bg-orange-200' : 'border-gray-300 bg-white'}`}></div>
                          <div
                            className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-2 transition-all duration-200 ${
                              isCurrentPeriod
                                ? 'border-green-500 bg-green-50 shadow-md'
                                : isBreak
                                  ? 'border-orange-300 bg-orange-50'
                                  : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-center min-w-[36px]">
                                <div className="font-bold text-lg">{index + 1}</div>
                                <div className="text-xs text-muted-foreground">Period</div>
                              </div>
                              <div>
                                <div className="font-medium">{timeSlot.startTime} - {timeSlot.endTime}</div>
                                {period ? (
                                  <div className={`inline-block px-2 py-1 rounded text-sm ${period.color}`}>{period.subject}</div>
                                ) : (
                                  <div className="text-muted-foreground text-sm">No class</div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              {period && !isBreak && (
                                <div className="text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {period.className} ({period.studentCount})
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {period.room}
                                  </div>
                                </div>
                              )}
                              {isCurrentPeriod && (
                                <Badge variant="default" className="mt-2 animate-pulse">Current</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* List View: Collapsible by day */}
            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Complete Teaching Schedule</CardTitle>
                      <CardDescription>All teaching periods for {currentTeacher.name}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.alert('Export coming soon!')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {days.map((day) => (
                      <div key={day}>
                        <div className="sticky top-16 z-10 bg-white/90 px-2 py-1 rounded font-semibold text-lg border-l-4 border-green-400 mb-2">{day}</div>
                        <div className="space-y-2">
                          {(timetableData[day] || []).map((item, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-2 ${item.color}`}
                            >
                              <div className="flex items-center gap-4">
                                <div>
                                  <div className="font-medium">{item.subject}</div>
                                  <div className="text-sm opacity-75">Period {idx + 1}</div>
                                </div>
                                <div className="text-sm">
                                  {selectedTiming.timeSlots[idx]?.startTime} - {selectedTiming.timeSlots[idx]?.endTime}
                                </div>
                                {!item.isBreak && (
                                  <>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Users className="h-4 w-4" />
                                      <span>{item.className} ({item.studentCount})</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <MapPin className="h-4 w-4" />
                                      <span>{item.room}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
