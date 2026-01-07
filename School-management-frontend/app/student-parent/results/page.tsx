"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Eye,
  Calendar,
  BookOpen,
  Target,
  Trophy,
  Star,
  Filter,
  Search,
  Printer,
  FileText,
  Activity,
  GraduationCap,
  Users,
  Medal,
  Crown,
  ChevronRight,
  Home,
  Calculator,
  BookMarked,
} from "lucide-react"
import { format, parseISO } from "date-fns"

// Keep the same interfaces and mock data as before
interface SubjectResult {
  id: string
  subject: string
  subjectCode: string
  marksObtained: number
  maxMarks: number
  percentage: number
  grade: string
  gradePoint: number
  rank?: number
  totalStudents: number
  teacher: string
  teacherAvatar?: string
  remarks?: string
  improvement?: number
}

interface TermResult {
  id: string
  termName: string
  termType: "Mid-Term" | "End-Term" | "Unit Test" | "Final Exam"
  academicYear: string
  examDate: string
  resultDate: string
  totalMarks: number
  obtainedMarks: number
  percentage: number
  cgpa: number
  rank: number
  totalStudents: number
  subjects: SubjectResult[]
  status: "Published" | "Pending" | "Under Review"
  remarks?: string
  performance: "Excellent" | "Good" | "Average" | "Needs Improvement"
  attendance: number
  classAverage: number
  schoolAverage: number
}

// Student profile data
const studentProfile = {
  name: "Alex Johnson",
  rollNumber: "2024001",
  class: "Grade 12-A",
  section: "Science",
  admissionNumber: "ADM2024001",
  dateOfBirth: "2006-05-15",
  fatherName: "Robert Johnson",
  motherName: "Sarah Johnson",
  address: "123 Oak Street, Springfield, IL 62701",
  phone: "+1 (555) 123-4567",
  email: "alex.johnson@school.edu",
  avatar: "/placeholder.svg?height=100&width=100",
}

// Same mock data as before
const mockResults: TermResult[] = [
  {
    id: "1",
    termName: "First Term",
    termType: "Mid-Term",
    academicYear: "2024-2025",
    examDate: "2024-10-15",
    resultDate: "2024-10-25",
    totalMarks: 500,
    obtainedMarks: 425,
    percentage: 85,
    cgpa: 8.5,
    rank: 5,
    totalStudents: 45,
    status: "Published",
    performance: "Excellent",
    attendance: 92,
    classAverage: 78.5,
    schoolAverage: 75.2,
    remarks: "Outstanding performance across all subjects. Strong analytical skills demonstrated.",
    subjects: [
      {
        id: "1",
        subject: "Mathematics",
        subjectCode: "MATH101",
        marksObtained: 88,
        maxMarks: 100,
        percentage: 88,
        grade: "A+",
        gradePoint: 9.0,
        rank: 3,
        totalStudents: 45,
        teacher: "John Smith",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Excellent problem-solving skills",
        improvement: 5.2,
      },
      {
        id: "2",
        subject: "Physics",
        subjectCode: "PHY101",
        marksObtained: 85,
        maxMarks: 100,
        percentage: 85,
        grade: "A",
        gradePoint: 8.5,
        rank: 7,
        totalStudents: 45,
        teacher: "Sarah Johnson",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Good understanding of concepts",
        improvement: 3.1,
      },
      {
        id: "3",
        subject: "Chemistry",
        subjectCode: "CHEM101",
        marksObtained: 82,
        maxMarks: 100,
        percentage: 82,
        grade: "A",
        gradePoint: 8.0,
        rank: 12,
        totalStudents: 45,
        teacher: "Mike Wilson",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Needs more practice in numerical problems",
        improvement: -1.5,
      },
      {
        id: "4",
        subject: "English",
        subjectCode: "ENG101",
        marksObtained: 90,
        maxMarks: 100,
        percentage: 90,
        grade: "A+",
        gradePoint: 9.5,
        rank: 2,
        totalStudents: 45,
        teacher: "Emma Davis",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Exceptional writing skills",
        improvement: 7.8,
      },
      {
        id: "5",
        subject: "Computer Science",
        subjectCode: "CS101",
        marksObtained: 80,
        maxMarks: 100,
        percentage: 80,
        grade: "A",
        gradePoint: 8.0,
        rank: 8,
        totalStudents: 45,
        teacher: "Alex Chen",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Good programming logic",
        improvement: 2.3,
      },
    ],
  },
  {
    id: "2",
    termName: "Second Term",
    termType: "End-Term",
    academicYear: "2024-2025",
    examDate: "2024-12-20",
    resultDate: "2025-01-05",
    totalMarks: 500,
    obtainedMarks: 445,
    percentage: 89,
    cgpa: 8.9,
    rank: 3,
    totalStudents: 45,
    status: "Published",
    performance: "Excellent",
    attendance: 95,
    classAverage: 81.2,
    schoolAverage: 77.8,
    remarks: "Significant improvement shown. Consistent performance across subjects.",
    subjects: [
      {
        id: "6",
        subject: "Mathematics",
        subjectCode: "MATH101",
        marksObtained: 92,
        maxMarks: 100,
        percentage: 92,
        grade: "A+",
        gradePoint: 9.5,
        rank: 2,
        totalStudents: 45,
        teacher: "John Smith",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Outstanding mathematical reasoning",
        improvement: 4.5,
      },
      {
        id: "7",
        subject: "Physics",
        subjectCode: "PHY101",
        marksObtained: 88,
        maxMarks: 100,
        percentage: 88,
        grade: "A+",
        gradePoint: 9.0,
        rank: 4,
        totalStudents: 45,
        teacher: "Sarah Johnson",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Excellent practical skills",
        improvement: 3.5,
      },
      {
        id: "8",
        subject: "Chemistry",
        subjectCode: "CHEM101",
        marksObtained: 85,
        maxMarks: 100,
        percentage: 85,
        grade: "A",
        gradePoint: 8.5,
        rank: 9,
        totalStudents: 45,
        teacher: "Mike Wilson",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Good improvement in numerical problems",
        improvement: 3.7,
      },
      {
        id: "9",
        subject: "English",
        subjectCode: "ENG101",
        marksObtained: 92,
        maxMarks: 100,
        percentage: 92,
        grade: "A+",
        gradePoint: 9.5,
        rank: 1,
        totalStudents: 45,
        teacher: "Emma Davis",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Exceptional communication skills",
        improvement: 2.2,
      },
      {
        id: "10",
        subject: "Computer Science",
        subjectCode: "CS101",
        marksObtained: 88,
        maxMarks: 100,
        percentage: 88,
        grade: "A+",
        gradePoint: 9.0,
        rank: 5,
        totalStudents: 45,
        teacher: "Alex Chen",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Excellent coding skills",
        improvement: 10.0,
      },
    ],
  },
  {
    id: "3",
    termName: "Final Term",
    termType: "Final Exam",
    academicYear: "2024-2025",
    examDate: "2025-03-15",
    resultDate: "2025-03-25",
    totalMarks: 500,
    obtainedMarks: 460,
    percentage: 92,
    cgpa: 9.2,
    rank: 2,
    totalStudents: 45,
    status: "Published",
    performance: "Excellent",
    attendance: 96,
    classAverage: 83.5,
    schoolAverage: 79.1,
    remarks: "Outstanding academic performance. Ready for next level.",
    subjects: [
      {
        id: "11",
        subject: "Mathematics",
        subjectCode: "MATH101",
        marksObtained: 95,
        maxMarks: 100,
        percentage: 95,
        grade: "A+",
        gradePoint: 9.8,
        rank: 1,
        totalStudents: 45,
        teacher: "John Smith",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Perfect mathematical understanding",
        improvement: 3.3,
      },
      {
        id: "12",
        subject: "Physics",
        subjectCode: "PHY101",
        marksObtained: 90,
        maxMarks: 100,
        percentage: 90,
        grade: "A+",
        gradePoint: 9.2,
        rank: 3,
        totalStudents: 45,
        teacher: "Sarah Johnson",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Excellent theoretical and practical knowledge",
        improvement: 2.3,
      },
      {
        id: "13",
        subject: "Chemistry",
        subjectCode: "CHEM101",
        marksObtained: 88,
        maxMarks: 100,
        percentage: 88,
        grade: "A+",
        gradePoint: 9.0,
        rank: 6,
        totalStudents: 45,
        teacher: "Mike Wilson",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Strong foundation in chemistry",
        improvement: 3.5,
      },
      {
        id: "14",
        subject: "English",
        subjectCode: "ENG101",
        marksObtained: 94,
        maxMarks: 100,
        percentage: 94,
        grade: "A+",
        gradePoint: 9.6,
        rank: 1,
        totalStudents: 45,
        teacher: "Emma Davis",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Exceptional language skills",
        improvement: 2.2,
      },
      {
        id: "15",
        subject: "Computer Science",
        subjectCode: "CS101",
        marksObtained: 93,
        maxMarks: 100,
        percentage: 93,
        grade: "A+",
        gradePoint: 9.4,
        rank: 2,
        totalStudents: 45,
        teacher: "Alex Chen",
        teacherAvatar: "/placeholder.svg?height=40&width=40",
        remarks: "Outstanding programming abilities",
        improvement: 5.7,
      },
    ],
  },
]

export default function EnhancedResultsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedResult, setSelectedResult] = useState<TermResult | null>(null)
  const [selectedYear, setSelectedYear] = useState("2024-2025")
  const [selectedTerm, setSelectedTerm] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMarksheet, setShowMarksheet] = useState(false)

  // Enhanced calculations
  const currentYearResults = useMemo(() => mockResults.filter((r) => r.academicYear === selectedYear), [selectedYear])

  const overallCGPA = useMemo(
    () =>
      currentYearResults.length > 0
        ? currentYearResults.reduce((sum, r) => sum + r.cgpa, 0) / currentYearResults.length
        : 0,
    [currentYearResults],
  )

  const bestRank = useMemo(
    () => (currentYearResults.length > 0 ? Math.min(...currentYearResults.map((r) => r.rank)) : 0),
    [currentYearResults],
  )

  const averagePercentage = useMemo(
    () =>
      currentYearResults.length > 0
        ? currentYearResults.reduce((sum, r) => sum + r.percentage, 0) / currentYearResults.length
        : 0,
    [currentYearResults],
  )

  const totalMarksObtained = useMemo(
    () => currentYearResults.reduce((sum, r) => sum + r.obtainedMarks, 0),
    [currentYearResults],
  )

  const totalMaxMarks = useMemo(
    () => currentYearResults.reduce((sum, r) => sum + r.totalMarks, 0),
    [currentYearResults],
  )

  // Simple color functions
  const getGradeColor = (grade: string) => {
    if (grade.includes("A+")) return "bg-green-50 text-green-700 border-green-200"
    if (grade.includes("A")) return "bg-blue-50 text-blue-700 border-blue-200"
    if (grade.includes("B")) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    if (grade.includes("C")) return "bg-orange-50 text-orange-700 border-orange-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "bg-green-50 text-green-700"
      case "Good":
        return "bg-blue-50 text-blue-700"
      case "Average":
        return "bg-yellow-50 text-yellow-700"
      case "Needs Improvement":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (improvement < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-600" />
    if (rank <= 3) return <Trophy className="h-4 w-4 text-orange-600" />
    if (rank <= 5) return <Medal className="h-4 w-4 text-blue-600" />
    return <Star className="h-4 w-4 text-gray-600" />
  }

  const academicYears = Array.from(new Set(mockResults.map((r) => r.academicYear)))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Simple Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
                <p className="text-gray-600">Track your academic performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Simplified */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall CGPA</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallCGPA.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Current academic year</p>
              <Progress value={(overallCGPA / 10) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Rank</CardTitle>
              <Trophy className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{bestRank}</div>
              <p className="text-xs text-muted-foreground">
                Out of {currentYearResults[0]?.totalStudents || 0} students
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averagePercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Across all terms</p>
              <Progress value={averagePercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Marks</CardTitle>
              <Calculator className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMarksObtained}</div>
              <p className="text-xs text-muted-foreground">Out of {totalMaxMarks}</p>
              <Progress value={(totalMarksObtained / totalMaxMarks) * 100} className="mt-2" />
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
                  placeholder="Search subjects, teachers, or terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showMarksheet ? "default" : "outline"}
                  onClick={() => setShowMarksheet(!showMarksheet)}
                  className="whitespace-nowrap"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {showMarksheet ? "Hide" : "Show"} Marksheet
                </Button>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <Home className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="term-wise">
              <Calendar className="mr-2 h-4 w-4" />
              Terms
            </TabsTrigger>
            <TabsTrigger value="subject-wise">
              <BookOpen className="mr-2 h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Overall Marksheet */}
            {showMarksheet && (
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-blue-900">Official Marksheet</CardTitle>
                      <CardDescription>Academic Year {selectedYear}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Student Information */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={studentProfile.avatar || "/placeholder.svg"} alt={studentProfile.name} />
                        <AvatarFallback className="text-lg">
                          {studentProfile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Student Name</label>
                          <div className="font-semibold">{studentProfile.name}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Roll Number</label>
                          <div className="font-semibold">{studentProfile.rollNumber}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Class</label>
                          <div className="font-semibold">{studentProfile.class}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Section</label>
                          <div className="font-semibold">{studentProfile.section}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Admission No.</label>
                          <div className="font-semibold">{studentProfile.admissionNumber}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Academic Year</label>
                          <div className="font-semibold">{selectedYear}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Marksheet Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-left font-semibold">Subject</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">Code</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">Max Marks</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">Term 1</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">Term 2</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">Final</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">Total</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">Grade</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">GP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(new Set(currentYearResults.flatMap((r) => r.subjects.map((s) => s.subject)))).map(
                          (subjectName) => {
                            const subjectResults = currentYearResults.flatMap((r) =>
                              r.subjects.filter((s) => s.subject === subjectName),
                            )
                            const subjectCode = subjectResults[0]?.subjectCode || ""
                            const maxMarks = subjectResults[0]?.maxMarks || 100
                            const totalMarks = subjectResults.reduce((sum, s) => sum + s.marksObtained, 0)
                            const averageGrade = subjectResults[subjectResults.length - 1]?.grade || "N/A"
                            const averageGP =
                              subjectResults.reduce((sum, s) => sum + s.gradePoint, 0) / subjectResults.length

                            return (
                              <tr key={subjectName} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-3 font-medium">{subjectName}</td>
                                <td className="border border-gray-300 p-3 text-center text-sm text-gray-600">
                                  {subjectCode}
                                </td>
                                <td className="border border-gray-300 p-3 text-center font-medium">{maxMarks}</td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {subjectResults[0]?.marksObtained || "-"}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {subjectResults[1]?.marksObtained || "-"}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {subjectResults[2]?.marksObtained || "-"}
                                </td>
                                <td className="border border-gray-300 p-3 text-center font-bold text-blue-600">
                                  {totalMarks}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  <Badge variant="outline" className={getGradeColor(averageGrade)}>
                                    {averageGrade}
                                  </Badge>
                                </td>
                                <td className="border border-gray-300 p-3 text-center font-medium">
                                  {averageGP.toFixed(1)}
                                </td>
                              </tr>
                            )
                          },
                        )}
                        <tr className="bg-blue-50 font-bold">
                          <td className="border border-gray-300 p-3" colSpan={3}>
                            TOTAL
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {currentYearResults[0]?.obtainedMarks || 0}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {currentYearResults[1]?.obtainedMarks || 0}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {currentYearResults[2]?.obtainedMarks || 0}
                          </td>
                          <td className="border border-gray-300 p-3 text-center text-lg text-blue-600">
                            {totalMarksObtained}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">-</td>
                          <td className="border border-gray-300 p-3 text-center text-lg text-blue-600">
                            {overallCGPA.toFixed(1)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{averagePercentage.toFixed(1)}%</div>
                      <div className="text-sm text-blue-700">Overall Percentage</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{overallCGPA.toFixed(1)}</div>
                      <div className="text-sm text-green-700">Cumulative GPA</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">#{bestRank}</div>
                      <div className="text-sm text-purple-700">Best Class Rank</div>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="h-16 border-b border-gray-300 mb-2"></div>
                        <div className="text-sm font-medium">Class Teacher</div>
                      </div>
                      <div>
                        <div className="h-16 border-b border-gray-300 mb-2"></div>
                        <div className="text-sm font-medium">Principal</div>
                      </div>
                      <div>
                        <div className="h-16 border-b border-gray-300 mb-2"></div>
                        <div className="text-sm font-medium">Parent/Guardian</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance Summary */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Performance Timeline
                    </CardTitle>
                    <CardDescription>Your academic progress this year</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentYearResults.map((result, index) => (
                      <div
                        key={result.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedResult(result)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <BookMarked className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold">{result.termName}</div>
                              <div className="text-sm text-gray-500">{result.termType}</div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">{result.percentage}%</div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-green-600">{result.cgpa}</div>
                            <div className="text-xs text-gray-500">CGPA</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-600">#{result.rank}</div>
                            <div className="text-xs text-gray-500">Rank</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-orange-600">{result.attendance}%</div>
                            <div className="text-xs text-gray-500">Attendance</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getPerformanceColor(result.performance)}>
                            {result.performance}
                          </Badge>
                          <div className="text-sm text-gray-500">
                            {format(parseISO(result.examDate), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats & Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-orange-600" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">Top Rank in English</div>
                        <div className="text-sm text-gray-600">Final Term - Rank #1</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Mathematics Excellence</div>
                        <div className="text-sm text-gray-600">95% in Final Term</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Medal className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Consistent Performance</div>
                        <div className="text-sm text-gray-600">Top 5 in all terms</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Quick Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">Strongest Subject</div>
                      <div className="text-sm text-green-600">Mathematics (92% average)</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-orange-800">Focus Area</div>
                      <div className="text-sm text-orange-600">Chemistry (needs improvement)</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">Trend</div>
                      <div className="text-sm text-blue-600">Improving consistently</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Keep the other tabs content similar but simplified */}
          <TabsContent value="term-wise" className="mt-6">
            <div className="grid gap-6">
              {currentYearResults.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          {result.termName} - {result.termType}
                        </CardTitle>
                        <CardDescription>{format(parseISO(result.examDate), "MMMM d, yyyy")}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPerformanceColor(result.performance)}>
                          {result.performance}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => setSelectedResult(result)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.percentage}%</div>
                        <div className="text-sm text-blue-700">Score</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.cgpa}</div>
                        <div className="text-sm text-green-700">CGPA</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">#{result.rank}</div>
                        <div className="text-sm text-purple-700">Rank</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{result.attendance}%</div>
                        <div className="text-sm text-orange-700">Attendance</div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <h4 className="font-semibold">Subject Performance</h4>
                      <div className="grid gap-3">
                        {result.subjects.map((subject) => (
                          <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={subject.teacherAvatar || "/placeholder.svg"} alt={subject.teacher} />
                                <AvatarFallback>
                                  {subject.teacher
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{subject.subject}</div>
                                <div className="text-sm text-gray-500">{subject.teacher}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-semibold">
                                  {subject.marksObtained}/{subject.maxMarks}
                                </div>
                                <div className="text-sm text-gray-500">{subject.percentage}%</div>
                              </div>
                              <Badge variant="outline" className={getGradeColor(subject.grade)}>
                                {subject.grade}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {getRankBadge(subject.rank || 0)}
                                <span className="text-sm">#{subject.rank}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subject-wise" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Subject Analysis
                </CardTitle>
                <CardDescription>Performance breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Array.from(new Set(currentYearResults.flatMap((r) => r.subjects.map((s) => s.subject)))).map(
                    (subjectName) => {
                      const subjectResults = currentYearResults.flatMap((r) =>
                        r.subjects.filter((s) => s.subject === subjectName),
                      )
                      const averagePercentage =
                        subjectResults.reduce((sum, s) => sum + s.percentage, 0) / subjectResults.length
                      const bestRank = Math.min(...subjectResults.map((s) => s.rank || 0))
                      const teacher = subjectResults[0]?.teacher || ""

                      return (
                        <div key={subjectName} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{subjectName}</h3>
                                <p className="text-sm text-gray-600">{teacher}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{averagePercentage.toFixed(1)}%</div>
                              <div className="text-sm text-gray-500">Average</div>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-3">
                            {subjectResults.map((subject, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">
                                    {currentYearResults.find((r) => r.subjects.includes(subject))?.termName}
                                  </span>
                                  <Badge variant="outline" className={getGradeColor(subject.grade)}>
                                    {subject.grade}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Score:</span>
                                    <span className="font-semibold">{subject.percentage}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Rank:</span>
                                    <span>#{subject.rank}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentYearResults.map((result, index) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{result.termName}</div>
                        <div className="text-sm text-gray-500">
                          {result.percentage}% • CGPA: {result.cgpa}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">#{result.rank}</div>
                        <div className="text-sm text-gray-500">Rank</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Class Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentYearResults.map((result) => (
                    <div key={result.id} className="p-3 border rounded-lg">
                      <div className="font-medium mb-2">{result.termName}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Your Score:</span>
                          <span className="font-semibold">{result.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Class Average:</span>
                          <span>{result.classAverage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>School Average:</span>
                          <span>{result.schoolAverage}%</span>
                        </div>
                        <Progress value={result.percentage} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Simplified Result Details Dialog */}
        {selectedResult && (
          <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  {selectedResult.termName} - {selectedResult.termType}
                </DialogTitle>
                <DialogDescription>Detailed result for {selectedResult.academicYear}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Result Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Marks:</span>
                        <span className="font-semibold">{selectedResult.totalMarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Obtained:</span>
                        <span className="font-semibold">{selectedResult.obtainedMarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Percentage:</span>
                        <span className="font-semibold">{selectedResult.percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CGPA:</span>
                        <span className="font-semibold">{selectedResult.cgpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rank:</span>
                        <span className="font-semibold">#{selectedResult.rank}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Performance:</span>
                        <Badge variant="outline" className={getPerformanceColor(selectedResult.performance)}>
                          {selectedResult.performance}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Class Average:</span>
                        <span>{selectedResult.classAverage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Attendance:</span>
                        <span>{selectedResult.attendance}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Subject Details</h3>
                  <div className="space-y-3">
                    {selectedResult.subjects.map((subject) => (
                      <div key={subject.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={subject.teacherAvatar || "/placeholder.svg"} alt={subject.teacher} />
                              <AvatarFallback>
                                {subject.teacher
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{subject.subject}</div>
                              <div className="text-sm text-gray-500">{subject.teacher}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{subject.percentage}%</div>
                            <Badge variant="outline" className={getGradeColor(subject.grade)}>
                              {subject.grade}
                            </Badge>
                          </div>
                        </div>
                        {subject.remarks && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <strong>Remarks:</strong> {subject.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
