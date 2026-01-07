"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CalendarClock, 
  Clock, 
  BookOpen, 
  Users, 
  MapPin, 
  Download,
  Coffee,
  GraduationCap,
  BarChart3,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  RefreshCw
} from "lucide-react"

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
  isBreak: boolean
  breakType?: 'short' | 'lunch' | 'assembly'
}

interface TimetableData {
  [key: string]: {
    [K in Day]?: TimetablePeriod[]
  }
}

// Mock student data
const currentStudent = {
  id: "1",
  name: "Emma Watson",
  classId: "1",
  className: "Class 10-A",
  grade: "Grade 10",
  section: "A",
  rollNumber: "10A001"
}

// Enhanced timetable data with more details
const mockTimetable: TimetableData = {
  "1": {
    Monday: [
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", isBreak: false },
      { subject: "Physics", teacher: "Sarah Johnson", room: "Lab 201", color: "bg-green-100 text-green-800", isBreak: false },
      { subject: "Chemistry", teacher: "Mike Wilson", room: "Lab 202", color: "bg-purple-100 text-purple-800", isBreak: false },
      { subject: "English", teacher: "Emma Davis", room: "Room 102", color: "bg-orange-100 text-orange-800", isBreak: false },
      { subject: "Short Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", isBreak: true, breakType: 'short' },
      { subject: "Biology", teacher: "Lisa Brown", room: "Lab 203", color: "bg-pink-100 text-pink-800", isBreak: false },
      { subject: "Computer Science", teacher: "Alex Chen", room: "Computer Lab", color: "bg-indigo-100 text-indigo-800", isBreak: false },
      { subject: "Physical Education", teacher: "Tom Wilson", room: "Sports Ground", color: "bg-red-100 text-red-800", isBreak: false },
    ],
    Tuesday: [
      { subject: "Physics", teacher: "Sarah Johnson", room: "Lab 201", color: "bg-green-100 text-green-800", isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", isBreak: false },
      { subject: "English", teacher: "Emma Davis", room: "Room 102", color: "bg-orange-100 text-orange-800", isBreak: false },
      { subject: "Chemistry", teacher: "Mike Wilson", room: "Lab 202", color: "bg-purple-100 text-purple-800", isBreak: false },
      { subject: "Short Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", isBreak: true, breakType: 'short' },
      { subject: "Biology", teacher: "Lisa Brown", room: "Lab 203", color: "bg-pink-100 text-pink-800", isBreak: false },
      { subject: "Art", teacher: "Maria Garcia", room: "Art Room", color: "bg-yellow-100 text-yellow-800", isBreak: false },
      { subject: "Library", teacher: "David Lee", room: "Library", color: "bg-teal-100 text-teal-800", isBreak: false },
    ],
    Wednesday: [
      { subject: "Chemistry", teacher: "Mike Wilson", room: "Lab 202", color: "bg-purple-100 text-purple-800", isBreak: false },
      { subject: "English", teacher: "Emma Davis", room: "Room 102", color: "bg-orange-100 text-orange-800", isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", isBreak: false },
      { subject: "Physics", teacher: "Sarah Johnson", room: "Lab 201", color: "bg-green-100 text-green-800", isBreak: false },
      { subject: "Short Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", isBreak: true, breakType: 'short' },
      { subject: "Computer Science", teacher: "Alex Chen", room: "Computer Lab", color: "bg-indigo-100 text-indigo-800", isBreak: false },
      { subject: "Biology", teacher: "Lisa Brown", room: "Lab 203", color: "bg-pink-100 text-pink-800", isBreak: false },
      { subject: "Music", teacher: "Anna White", room: "Music Room", color: "bg-cyan-100 text-cyan-800", isBreak: false },
    ],
    Thursday: [
      { subject: "English", teacher: "Emma Davis", room: "Room 102", color: "bg-orange-100 text-orange-800", isBreak: false },
      { subject: "Chemistry", teacher: "Mike Wilson", room: "Lab 202", color: "bg-purple-100 text-purple-800", isBreak: false },
      { subject: "Physics", teacher: "Sarah Johnson", room: "Lab 201", color: "bg-green-100 text-green-800", isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", isBreak: false },
      { subject: "Short Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", isBreak: true, breakType: 'short' },
      { subject: "Physical Education", teacher: "Tom Wilson", room: "Sports Ground", color: "bg-red-100 text-red-800", isBreak: false },
      { subject: "Biology", teacher: "Lisa Brown", room: "Lab 203", color: "bg-pink-100 text-pink-800", isBreak: false },
      { subject: "Study Period", teacher: "", room: "Study Hall", color: "bg-slate-100 text-slate-800", isBreak: false },
    ],
    Friday: [
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", isBreak: false },
      { subject: "Biology", teacher: "Lisa Brown", room: "Lab 203", color: "bg-pink-100 text-pink-800", isBreak: false },
      { subject: "English", teacher: "Emma Davis", room: "Room 102", color: "bg-orange-100 text-orange-800", isBreak: false },
      { subject: "Chemistry", teacher: "Mike Wilson", room: "Lab 202", color: "bg-purple-100 text-purple-800", isBreak: false },
      { subject: "Short Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", isBreak: true, breakType: 'short' },
      { subject: "Physics", teacher: "Sarah Johnson", room: "Lab 201", color: "bg-green-100 text-green-800", isBreak: false },
      { subject: "Computer Science", teacher: "Alex Chen", room: "Computer Lab", color: "bg-indigo-100 text-indigo-800", isBreak: false },
      { subject: "Assembly", teacher: "", room: "Auditorium", color: "bg-amber-100 text-amber-800", isBreak: true, breakType: 'assembly' },
    ],
    Saturday: [
      { subject: "Physics", teacher: "Sarah Johnson", room: "Lab 201", color: "bg-green-100 text-green-800", isBreak: false },
      { subject: "Mathematics", teacher: "John Smith", room: "Room 101", color: "bg-blue-100 text-blue-800", isBreak: false },
      { subject: "Chemistry", teacher: "Mike Wilson", room: "Lab 202", color: "bg-purple-100 text-purple-800", isBreak: false },
      { subject: "English", teacher: "Emma Davis", room: "Room 102", color: "bg-orange-100 text-orange-800", isBreak: false },
      { subject: "Short Break", teacher: "", room: "", color: "bg-orange-100 text-orange-800", isBreak: true, breakType: 'short' },
      { subject: "Biology", teacher: "Lisa Brown", room: "Lab 203", color: "bg-pink-100 text-pink-800", isBreak: false },
      { subject: "Physical Education", teacher: "Tom Wilson", room: "Sports Ground", color: "bg-red-100 text-red-800", isBreak: false },
      { subject: "Study Period", teacher: "", room: "Study Hall", color: "bg-slate-100 text-slate-800", isBreak: false },
    ],
  }
}

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("1")
  const [viewMode, setViewMode] = useState<"weekly" | "today" | "list">("weekly")
  const [selectedTiming] = useState<SchoolTiming>(defaultSchoolTiming)
  const [selectedDay, setSelectedDay] = useState<Day | null>(null)

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
  const timetableData = mockTimetable[selectedClass] || {}
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

  // Calculate student statistics
  const studentStats = {
    totalSubjects: new Set(listData.filter(item => !item.isBreak).map(item => item.subject)).size,
    totalTeachers: new Set(listData.filter(item => !item.isBreak).map(item => item.teacher)).size,
    weeklyHours: listData.filter(item => !item.isBreak).length * 45 / 60, // 45 min periods
    todayClasses: todaySchedule.filter(item => !item.isBreak).length
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Timetable</h1>
          <p className="text-muted-foreground">View your weekly class schedule and track current period</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Student Information
          </CardTitle>
          <CardDescription>Your academic details and schedule overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Class:</strong> {currentStudent.className} ({currentStudent.grade} {currentStudent.section})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Roll No:</strong> {currentStudent.rollNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Subjects:</strong> {studentStats.totalSubjects}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Weekly Hours:</strong> {studentStats.weeklyHours.toFixed(1)}h
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Period Highlight */}
      {currentDay && currentPeriodIndex >= 0 && todaySchedule[currentPeriodIndex] && (
        <Card className="border-green-200 bg-green-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Current Period
                </h3>
                <p className="text-sm text-green-600">
                  {currentDay} - Period {currentPeriodIndex + 1} ({selectedTiming.timeSlots[currentPeriodIndex]?.startTime} - {selectedTiming.timeSlots[currentPeriodIndex]?.endTime})
                </p>
                {todaySchedule[currentPeriodIndex] && !todaySchedule[currentPeriodIndex].isBreak && (
                  <div className="mt-2">
                    <Badge variant="default" className="bg-green-600">
                      {todaySchedule[currentPeriodIndex].subject}
                    </Badge>
                    <span className="ml-2 text-sm text-green-700">
                      with {todaySchedule[currentPeriodIndex].teacher} in {todaySchedule[currentPeriodIndex].room}
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
      )}

      {/* View Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "weekly" | "today" | "list")}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Complete weekly timetable for {currentStudent.className}
              </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-3 bg-muted text-left font-medium w-[120px]">Time</th>
                      {days.map((day) => (
                        <th key={day} className="border p-3 bg-muted text-left font-medium w-[160px]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTiming.timeSlots.map((timeSlot, timeIndex) => (
                      <tr key={timeSlot.id}>
                        <td className="border p-3 font-medium text-sm bg-muted/50">
                          <div>{timeSlot.startTime} - {timeSlot.endTime}</div>
                          <div className="text-xs text-muted-foreground">
                            {timeSlot.isBreak ? `${timeSlot.breakType} Break` : `Period ${timeSlot.period}`}
                          </div>
                        </td>
                        {days.map((day) => {
                          const period = timetableData[day]?.[timeIndex]
                          const isCurrentPeriod = currentDay === day && currentPeriodIndex === timeIndex
                          const isBreak = period?.isBreak

                          return (
                            <td key={`${day}-${timeIndex}`} className="border p-2">
                              {period ? (
                                <div className={`p-3 rounded-lg ${period.color} ${isCurrentPeriod ? 'ring-2 ring-green-500 shadow-lg' : ''} hover:shadow-md transition-shadow cursor-pointer`}>
                                  {isBreak ? (
                                    <div className="text-center">
                                      <Coffee className="h-4 w-4 mx-auto mb-1" />
                                      <div className="font-medium text-sm">{period.subject}</div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="font-medium text-sm">{period.subject}</div>
                                      <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                                        <Users className="h-3 w-3" />
                                        {period.teacher}
                                      </div>
                                      <div className="text-xs opacity-75 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {period.room}
                                      </div>
                                    </>
                                  )}
                                  {isCurrentPeriod && (
                                    <Badge variant="default" className="mt-2 text-xs">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <div className="p-3 text-center text-muted-foreground text-sm">
                                  -
                                </div>
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

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule - {currentDay}</CardTitle>
              <CardDescription>
                {currentDay && currentPeriodIndex >= 0 && (
                  <span className="text-green-600 font-medium">
                    Current Period: {currentPeriodIndex + 1} ({selectedTiming.timeSlots[currentPeriodIndex]?.startTime} - {selectedTiming.timeSlots[currentPeriodIndex]?.endTime})
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {selectedTiming.timeSlots.map((timeSlot, index) => {
                  const period = todaySchedule[index]
                  const isCurrentPeriod = currentPeriodIndex === index
                  const isBreak = period?.isBreak

                  return (
                    <div
                      key={index}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        isCurrentPeriod
                            ? 'border-green-500 bg-green-50 shadow-lg'
                          : isBreak
                            ? 'border-orange-300 bg-orange-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-lg">{index + 1}</div>
                            <div className="text-xs text-muted-foreground">Period</div>
                          </div>
                          <div>
                            <div className="font-medium">{timeSlot.startTime} - {timeSlot.endTime}</div>
                            {period ? (
                              <div className={`inline-block px-2 py-1 rounded text-sm ${period.color}`}>
                                {period.subject}
                              </div>
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
                                {period.teacher}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {period.room}
                              </div>
                            </div>
                          )}
                          {isCurrentPeriod && (
                            <Badge variant="default" className="mt-2">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Complete Schedule List</CardTitle>
                  <CardDescription>All timetable entries for {currentStudent.className}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {listData.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${item.color} hover:shadow-md transition-shadow cursor-pointer`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">{item.subject}</div>
                          <div className="text-sm opacity-75">{item.day} • Period {item.period}</div>
                        </div>
                        <div className="text-sm">
                          {item.timeSlot?.startTime} - {item.timeSlot?.endTime}
                        </div>
                        {!item.isBreak && (
                          <>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4" />
                              <span>{item.teacher}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{item.room}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
