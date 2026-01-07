"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import { 
  BarChartIcon, 
  TrendingUp, 
  User, 
  Users, 
  Target, 
  Award, 
  BookOpen, 
  Calendar,
  Download,
  Search,
  Filter,
  Eye,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  GraduationCap,
  Activity,
  Zap,
  Trophy,
  TrendingDown,
  Minus,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target as TargetIcon
} from "lucide-react"
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TeacherHeader } from "@/app/components/ui/teacher-header"

// Enhanced mock data
const mockClasses = [
  { id: "1", name: "Class 10-A", subject: "Mathematics", students: 32, avgScore: 78.5 },
  { id: "2", name: "Class 9-B", subject: "Physics", students: 28, avgScore: 82.3 },
  { id: "3", name: "Class 11-C", subject: "Chemistry", students: 35, avgScore: 75.8 },
  { id: "4", name: "Class 12-D", subject: "Biology", students: 30, avgScore: 85.2 },
]

const mockStudents = [
  { 
    id: "1", 
    name: "John Doe", 
    rollNo: "001", 
    avatar: "JD",
    email: "john.doe@school.com",
    overallScore: 89.2,
    attendance: 95.5,
    classRank: 3,
    grade: "A",
    improvement: 12.5,
    lastExam: "2024-01-15",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    strengths: ["Problem Solving", "Critical Thinking"],
    weaknesses: ["Time Management", "Presentation Skills"]
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    rollNo: "002", 
    avatar: "JS",
    email: "jane.smith@school.com",
    overallScore: 92.8,
    attendance: 98.2,
    classRank: 1,
    grade: "A+",
    improvement: 8.3,
    lastExam: "2024-01-15",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    strengths: ["Analytical Skills", "Research"],
    weaknesses: ["Public Speaking"]
  },
  { 
    id: "3", 
    name: "Mike Johnson", 
    rollNo: "003", 
    avatar: "MJ",
    email: "mike.johnson@school.com",
    overallScore: 76.4,
    attendance: 87.3,
    classRank: 15,
    grade: "B",
    improvement: -2.1,
    lastExam: "2024-01-15",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    strengths: ["Creativity", "Teamwork"],
    weaknesses: ["Mathematical Concepts", "Study Habits"]
  },
  { 
    id: "4", 
    name: "Sarah Wilson", 
    rollNo: "004", 
    avatar: "SW",
    email: "sarah.wilson@school.com",
    overallScore: 84.7,
    attendance: 91.8,
    classRank: 7,
    grade: "A-",
    improvement: 15.2,
    lastExam: "2024-01-15",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    strengths: ["Communication", "Leadership"],
    weaknesses: ["Advanced Mathematics"]
  },
  { 
    id: "5", 
    name: "David Brown", 
    rollNo: "005", 
    avatar: "DB",
    email: "david.brown@school.com",
    overallScore: 81.3,
    attendance: 89.5,
    classRank: 12,
    grade: "B+",
    improvement: 6.8,
    lastExam: "2024-01-15",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    strengths: ["Practical Skills", "Innovation"],
    weaknesses: ["Theory Understanding", "Exam Preparation"]
  },
]

const mockGradesData = [
  { subject: "Mathematics", marks: 85, target: 90, improvement: 8 },
  { subject: "Physics", marks: 78, target: 85, improvement: 12 },
  { subject: "Chemistry", marks: 92, target: 88, improvement: 5 },
  { subject: "English", marks: 88, target: 85, improvement: 3 },
  { subject: "Biology", marks: 76, target: 80, improvement: 15 },
]

const mockAttendanceData = [
  { month: "Jan", percentage: 95, target: 90 },
  { month: "Feb", percentage: 88, target: 90 },
  { month: "Mar", percentage: 92, target: 90 },
  { month: "Apr", percentage: 85, target: 90 },
  { month: "May", percentage: 90, target: 90 },
  { month: "Jun", percentage: 87, target: 90 },
]

const mockPerformanceTrend = [
  { month: "Jul", score: 75, attendance: 88 },
  { month: "Aug", score: 78, attendance: 90 },
  { month: "Sep", score: 82, attendance: 92 },
  { month: "Oct", score: 79, attendance: 89 },
  { month: "Nov", score: 85, attendance: 93 },
  { month: "Dec", score: 89, attendance: 95 },
]

const mockSubjectBreakdown = [
  { name: "Mathematics", value: 85, color: "#3b82f6" },
  { name: "Physics", value: 78, color: "#10b981" },
  { name: "Chemistry", value: 92, color: "#f59e0b" },
  { name: "English", value: 88, color: "#ef4444" },
  { name: "Biology", value: 76, color: "#8b5cf6" },
]

const mockSkillsRadar = [
  { skill: "Problem Solving", value: 85, fullMark: 100 },
  { skill: "Critical Thinking", value: 78, fullMark: 100 },
  { skill: "Communication", value: 92, fullMark: 100 },
  { skill: "Time Management", value: 70, fullMark: 100 },
  { skill: "Research Skills", value: 88, fullMark: 100 },
  { skill: "Creativity", value: 82, fullMark: 100 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function StudentPerformancePage() {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [viewMode, setViewMode] = useState<"overview" | "detailed" | "comparison">("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "score" | "rank" | "improvement">("score")
  const [isLoading, setIsLoading] = useState(false)

  // Get selected student data
  const selectedStudentData = mockStudents.find(s => s.id === selectedStudent)
  const selectedClassData = mockClasses.find(c => c.id === selectedClass)

  // Filter students by search
  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name": return a.name.localeCompare(b.name)
      case "score": return b.overallScore - a.overallScore
      case "rank": return a.classRank - b.classRank
      case "improvement": return b.improvement - a.improvement
      default: return 0
    }
  })

  // Calculate class statistics
  const classStats = {
    totalStudents: mockStudents.length,
    avgScore: mockStudents.reduce((sum, s) => sum + s.overallScore, 0) / mockStudents.length,
    avgAttendance: mockStudents.reduce((sum, s) => sum + s.attendance, 0) / mockStudents.length,
    topPerformers: mockStudents.filter(s => s.overallScore >= 90).length,
    needsImprovement: mockStudents.filter(s => s.overallScore < 80).length,
    improving: mockStudents.filter(s => s.improvement > 0).length
  }

  // Simulate loading
  useEffect(() => {
    if (selectedClass || selectedStudent) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 800)
      return () => clearTimeout(timer)
    }
  }, [selectedClass, selectedStudent])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "text-green-600 bg-green-100"
      case "A": return "text-blue-600 bg-blue-100"
      case "A-": return "text-indigo-600 bg-indigo-100"
      case "B+": return "text-yellow-600 bg-yellow-100"
      case "B": return "text-orange-600 bg-orange-100"
      default: return "text-red-600 bg-red-100"
    }
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />
    if (improvement < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getMotivationalBadge = () => {
    if (classStats.topPerformers > classStats.totalStudents * 0.3) {
      return "Outstanding class performance! 🎉"
    }
    if (classStats.improving > classStats.totalStudents * 0.7) {
      return "Great improvement across the class! 📈"
    }
    return `${classStats.topPerformers} top performers this term`
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="w-full">
         
          
          <div className="flex flex-col lg:flex-row gap-4 p-4 w-full">
            {/* Enhanced Sidebar */}
            <aside className="lg:w-80 w-full lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)] flex-shrink-0 z-30">
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Analytics
                  </h2>
                  <p className="text-purple-100 text-xs mt-1">Track student progress & insights</p>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Class Selection */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Select Class</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="border-2 border-purple-200 focus:border-purple-500">
                        <SelectValue placeholder="Choose a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClasses.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{cls.name}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {cls.students} students
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Student Search */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Search Students</Label>
                    <div className="relative">
                      <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, roll no..."
                        className="pl-9 pr-4 py-2 rounded-lg border-2 border-purple-200 bg-white w-full text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Sort By</Label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                      <SelectTrigger className="border-2 border-purple-200 focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="score">Overall Score</SelectItem>
                        <SelectItem value="rank">Class Rank</SelectItem>
                        <SelectItem value="improvement">Improvement</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Class Statistics */}
                  {selectedClass && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-800 text-sm">Class Overview</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Students:</span>
                          <span className="font-semibold">{classStats.totalStudents}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Score:</span>
                          <span className="font-semibold text-blue-600">{classStats.avgScore.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Attendance:</span>
                          <span className="font-semibold text-green-600">{classStats.avgAttendance.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Top Performers:</span>
                          <span className="font-semibold text-purple-600">{classStats.topPerformers}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 space-y-4">
              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-xs font-medium">Total Students</p>
                        <p className="text-2xl font-bold">{classStats.totalStudents}</p>
                        <p className="text-blue-200 text-xs">Enrolled</p>
                      </div>
                      <div className="p-2 bg-white/20 rounded-full">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-xs font-medium">Avg Score</p>
                        <p className="text-2xl font-bold">{classStats.avgScore.toFixed(1)}%</p>
                        <p className="text-emerald-200 text-xs">Class average</p>
                      </div>
                      <div className="p-2 bg-white/20 rounded-full">
                        <Target className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-xs font-medium">Top Performers</p>
                        <p className="text-2xl font-bold">{classStats.topPerformers}</p>
                        <p className="text-purple-200 text-xs">90%+ scores</p>
                      </div>
                      <div className="p-2 bg-white/20 rounded-full">
                        <Trophy className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-xs font-medium">Improving</p>
                        <p className="text-2xl font-bold">{classStats.improving}</p>
                        <p className="text-amber-200 text-xs">Positive trend</p>
                      </div>
                      <div className="p-2 bg-white/20 rounded-full">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Student List */}
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Student Performance Overview</h2>
                      <p className="text-sm text-gray-600">Click on a student to view detailed analytics</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.alert('Export coming soon!')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-purple-50/50 shadow-sm">
                          <tr className="text-gray-700">
                            <th className="px-4 py-3 text-left font-semibold text-sm">Student</th>
                            <th className="px-4 py-3 text-center font-semibold text-sm">Overall Score</th>
                            <th className="px-4 py-3 text-center font-semibold text-sm">Class Rank</th>
                            <th className="px-4 py-3 text-center font-semibold text-sm">Attendance</th>
                            <th className="px-4 py-3 text-center font-semibold text-sm">Improvement</th>
                            <th className="px-4 py-3 text-center font-semibold text-sm">Grade</th>
                            <th className="px-4 py-3 text-center font-semibold text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                              <tr key={idx} className="animate-pulse">
                                <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded-lg w-32"></div></td>
                                <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded-lg w-16 mx-auto"></div></td>
                                <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded-lg w-12 mx-auto"></div></td>
                                <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded-lg w-16 mx-auto"></div></td>
                                <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded-lg w-16 mx-auto"></div></td>
                                <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded-lg w-12 mx-auto"></div></td>
                                <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded-lg w-20 mx-auto"></div></td>
                              </tr>
                            ))
                          ) : (
                            sortedStudents.map((student) => (
                              <tr
                                key={student.id}
                                className={`group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer ${
                                  selectedStudent === student.id ? 'bg-purple-50 ring-2 ring-purple-200' : ''
                                }`}
                                onClick={() => setSelectedStudent(student.id)}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 ring-2 ring-purple-200 group-hover:ring-purple-400 transition-all">
                                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold">
                                        {student.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                        {student.name}
                                      </div>
                                      <div className="text-sm text-gray-500">{student.rollNo} • {student.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <span className={`text-lg font-bold ${
                                      student.overallScore >= 90 ? 'text-green-600' :
                                      student.overallScore >= 80 ? 'text-blue-600' :
                                      student.overallScore >= 70 ? 'text-yellow-600' :
                                      'text-red-600'
                                    }`}>
                                      {student.overallScore}%
                                    </span>
                                    <Progress value={student.overallScore} className="w-16 h-2" />
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Badge variant={student.classRank <= 5 ? "default" : "secondary"} className="text-xs">
                                    #{student.classRank}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`text-sm font-semibold ${
                                    student.attendance >= 95 ? 'text-green-600' :
                                    student.attendance >= 90 ? 'text-blue-600' :
                                    student.attendance >= 85 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {student.attendance}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    {getImprovementIcon(student.improvement)}
                                    <span className={`text-sm font-semibold ${
                                      student.improvement > 0 ? 'text-green-600' :
                                      student.improvement < 0 ? 'text-red-600' :
                                      'text-gray-600'
                                    }`}>
                                      {Math.abs(student.improvement)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Badge className={`text-xs font-bold ${getGradeColor(student.grade)}`}>
                                    {student.grade}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedStudent(student.id)
                                    }}
                                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Detailed Student Analytics */}
              {selectedStudentData && (
                <div className="space-y-4">
                  {/* Student Header */}
                  <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl font-bold">
                              {selectedStudentData.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedStudentData.name}</h2>
                            <p className="text-gray-600">Roll No: {selectedStudentData.rollNo} • {selectedStudentData.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge className={`${getGradeColor(selectedStudentData.grade)} font-semibold`}>
                                Grade: {selectedStudentData.grade}
                              </Badge>
                              <Badge variant="outline" className="text-purple-600 border-purple-300">
                                Rank: #{selectedStudentData.classRank}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-purple-600">{selectedStudentData.overallScore}%</div>
                          <div className="text-sm text-gray-600">Overall Score</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analytics Tabs */}
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                      <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Quick Stats */}
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Performance Metrics</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Overall Score</span>
                              <span className="font-semibold text-blue-600">{selectedStudentData.overallScore}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Attendance</span>
                              <span className="font-semibold text-green-600">{selectedStudentData.attendance}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Class Rank</span>
                              <span className="font-semibold text-purple-600">#{selectedStudentData.classRank}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Improvement</span>
                              <div className="flex items-center gap-1">
                                {getImprovementIcon(selectedStudentData.improvement)}
                                <span className={`font-semibold ${
                                  selectedStudentData.improvement > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {Math.abs(selectedStudentData.improvement)}%
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Subject Performance */}
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Subject Performance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={mockGradesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="marks" fill="#8b5cf6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Attendance Trend */}
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">Attendance Trend</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={mockAttendanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={2} />
                              </LineChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                              <CheckCircle className="h-5 w-5" />
                              Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedStudentData.strengths.map((strength, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">{strength}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                              <AlertCircle className="h-5 w-5" />
                              Areas for Improvement
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedStudentData.weaknesses.map((weakness, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">{weakness}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Detailed Analysis Tab */}
                    <TabsContent value="detailed" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Skills Radar Chart */}
                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TargetIcon className="h-5 w-5" />
                              Skills Assessment
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <RadarChart data={mockSkillsRadar}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="skill" />
                                <PolarRadiusAxis />
                                <Radar name="Skills" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Subject Breakdown */}
                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <PieChartIcon className="h-5 w-5" />
                              Subject Breakdown
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={mockSubjectBreakdown}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                                                     label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {mockSubjectBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Performance Trend */}
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <LineChartIcon className="h-5 w-5" />
                            Performance Trend (6 Months)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mockPerformanceTrend}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} name="Score" />
                              <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} name="Attendance" />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Comparison Tab */}
                    <TabsContent value="comparison" className="space-y-4">
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Class Comparison
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{selectedStudentData.overallScore}%</div>
                                <div className="text-sm text-gray-600">Student Score</div>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{classStats.avgScore.toFixed(1)}%</div>
                                <div className="text-sm text-gray-600">Class Average</div>
                              </div>
                              <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                  {selectedStudentData.overallScore > classStats.avgScore ? '+' : ''}
                                  {(selectedStudentData.overallScore - classStats.avgScore).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">Difference</div>
                              </div>
                            </div>
                            
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={[
                                { name: 'Student', score: selectedStudentData.overallScore },
                                { name: 'Class Avg', score: classStats.avgScore },
                                { name: 'Top Student', score: 95 }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="score" fill="#8b5cf6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Enhanced Custom Scrollbar Styles */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f8fafc;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #8b5cf6, #ec4899);
            border-radius: 4px;
            transition: all 0.3s ease;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #7c3aed, #db2777);
            transform: scale(1.1);
          }
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: #f8fafc;
          }
        `}</style>
      </div>
    </TooltipProvider>
  )
}
