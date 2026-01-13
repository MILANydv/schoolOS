"use client"

import * as React from "react"
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from "@/hooks"
import type { CreateStudentPayload } from "@/lib/api-types"
import {
  Edit,
  Trash2,
  Download,
  Mail,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Plus,
  Eye,
  FileText,
  Phone,
  BookOpen,
  Award,
  Star,
  RefreshCw,
  Grid3X3,
  List,
  Filter,
  X,
  Search,
  CreditCard
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { StudentDetailModal } from "@/components/forms/student-detail-modal"
import { AddStudentModal } from "@/components/forms/add-student-modal"
import { AddStudentForm } from "@/components/forms/add-student-form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { EnhancedTable, TableColumn, TableFilter, TableAction } from "@/components/table/enhanced-table"
import { useToast } from "@/components/ui/use-toast"

type Student = {
  id: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  rollNumber: string
  gender: string
  dateOfBirth: string
  admissionDate: string
  admissionNumber?: string | null
  status: string
  bloodGroup?: string | null

  parentName: string
  parentPhone: string
  parentEmail: string

  addressStreet: string
  addressCity: string
  addressState: string
  addressZip: string

  emergencyName: string
  emergencyPhone: string

  class?: {
    id: string
    name: string
    grade: string
    section: string
  }
}

const getStudentName = (student: Student) => `${student.firstName} ${student.lastName}`.trim()
const getStudentClassName = (student: Student) => student.class?.name || "—"

interface StudentStats {
  total: number
  active: number
  inactive: number
  graduated: number
  suspended: number
  newThisMonth: number
  newThisYear: number
  averageAttendance: number
  topPerformers: number
  needsAttention: number
}

export default function SchoolAdminStudentsPage() {
  const { toast } = useToast()

  // Pagination state moved up for better scope access
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)

  // React Query hooks with proper caching and invalidation
  const { data: studentsData, isLoading, refetch } = useStudents()

  const createStudentMutation = useCreateStudent()
  const updateStudentMutation = useUpdateStudent()
  const deleteStudentMutation = useDeleteStudent()

  const students = studentsData?.data || []

  // Local UI state
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false)
  const [localFilters, setLocalFilters] = React.useState<Record<string, any>>({})
  const [localSearch, setLocalSearch] = React.useState("")
  const [localSelectedItems, setLocalSelectedItems] = React.useState<string[]>([])

  // Apply local filtering with enhanced logic
  const filteredStudents = React.useMemo(() => {
    return students.filter((student: Student) => {
      const searchTerm = localSearch.toLowerCase().trim()
      const fullName = getStudentName(student).toLowerCase()

      const matchesSearch = !searchTerm ||
        fullName.includes(searchTerm) ||
        (student.email || "").toLowerCase().includes(searchTerm) ||
        (student.class?.name || "").toLowerCase().includes(searchTerm) ||
        (student.rollNumber || "").toLowerCase().includes(searchTerm) ||
        (student.parentName || "").toLowerCase().includes(searchTerm) ||
        (student.phone || "").toLowerCase().includes(searchTerm) ||
        (student.parentPhone || "").toLowerCase().includes(searchTerm)

      // Status filter
      const matchesStatus = !localFilters.status || localFilters.status === 'all' ||
        student.status === localFilters.status

      // Class filter
      const matchesClass = !localFilters.class || localFilters.class === 'all' ||
        student.class?.name === localFilters.class

      // Gender filter
      const matchesGender = !localFilters.gender || localFilters.gender === 'all' ||
        student.gender === localFilters.gender

      // Admission date filter - handle date comparison properly
      const matchesAdmissionDate = !localFilters.admissionDate ||
        new Date(student.admissionDate).toDateString() === new Date(localFilters.admissionDate).toDateString()

      return matchesSearch && matchesStatus && matchesClass && matchesGender && matchesAdmissionDate
    })
  }, [students, localSearch, localFilters])

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
    // Reset to first page when filters change
    setCurrentPage(1)
  }

  // Handle search change
  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    // Reset to first page when search changes
    setCurrentPage(1)

    // Show immediate feedback for search
    if (value.trim()) {
      const matchingStudents = students.filter((student: Student) => {
        const searchTerm = value.toLowerCase().trim()
        const fullName = getStudentName(student).toLowerCase()

        return fullName.includes(searchTerm) ||
          (student.email || "").toLowerCase().includes(searchTerm) ||
          (student.class?.name || "").toLowerCase().includes(searchTerm) ||
          (student.rollNumber || "").toLowerCase().includes(searchTerm) ||
          (student.parentName || "").toLowerCase().includes(searchTerm) ||
          (student.phone || "").toLowerCase().includes(searchTerm) ||
          (student.parentPhone || "").toLowerCase().includes(searchTerm)
      })

      if (matchingStudents.length === 0) {
        toast({
          title: "No Results Found",
          description: `No students match "${value}"`,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Search Results",
          description: `Found ${matchingStudents.length} student(s) matching "${value}"`,
          duration: 2000
        })
      }
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({})
    setLocalSearch("")
    setCurrentPage(1)
  }

  // Export functionality
  const handleExport = (format: 'csv' | 'excel' = 'csv') => {
    const exportData = filteredStudents.map((student: Student) => ({
      'Student ID': student.id,
      'Name': getStudentName(student),
      'Email': student.email || '',
      'Phone': student.phone || '',
      'Class': getStudentClassName(student),
      'Roll Number': student.rollNumber,
      'Gender': student.gender,
      'Date of Birth': student.dateOfBirth,
      'Admission Date': student.admissionDate,
      'Admission Number': student.admissionNumber || '',
      'Status': student.status,
      'Parent Name': student.parentName,
      'Parent Phone': student.parentPhone,
      'Parent Email': student.parentEmail,
      'Address': `${student.addressStreet}, ${student.addressCity}, ${student.addressState} ${student.addressZip}`,
    }))

    if (format === 'csv') {
      // Export as CSV
      const headers = Object.keys(exportData[0])
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => `"${(row as any)[header]}"`).join(',')
        )
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `students-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({ title: "Export Successful", description: "Student data exported as CSV" })
    }
  }


  // Paginated students
  const paginatedStudents = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredStudents.slice(startIndex, endIndex)
  }, [filteredStudents, currentPage, pageSize])

  const totalPages = Math.ceil(filteredStudents.length / pageSize)

  // Get computed stats from Zustand
  // Get computed stats from Zustand
  // const baseStats = getStats() // Removed undefined call

  // Calculate additional stats (could be moved to store later)
  const stats: StudentStats = React.useMemo(() => {
    const total = filteredStudents.length
    const active = filteredStudents.filter(s => (s.status || '').toUpperCase() === "ACTIVE").length
    const inactive = filteredStudents.filter(s => (s.status || '').toUpperCase() === "INACTIVE").length
    const graduated = filteredStudents.filter(s => (s.status || '').toUpperCase() === "GRADUATED").length
    const suspended = filteredStudents.filter(s => (s.status || '').toUpperCase() === "SUSPENDED").length
    const newThisMonth = filteredStudents.filter(s => {
      const admissionDate = new Date(s.admissionDate)
      const now = new Date()
      return admissionDate.getMonth() === now.getMonth() &&
        admissionDate.getFullYear() === now.getFullYear()
    }).length
    const newThisYear = filteredStudents.filter(s =>
      new Date(s.admissionDate).getFullYear() === new Date().getFullYear()
    ).length

    return {
      total,
      active,
      inactive,
      graduated,
      suspended,
      newThisMonth,
      newThisYear,
      averageAttendance: 0,
      topPerformers: 0,
      needsAttention: 0
    }
  }, [filteredStudents])

  // Enhanced actions
  const handleStudentAction = (student: Student, action: string) => {
    switch (action) {
      case "view":
        setSelectedStudent(student)
        setIsDetailModalOpen(true)
        break
      case "edit":
        // Open edit modal with student data
        setSelectedStudent(student)
        setIsEditModalOpen(true)
        break
      case "idCard":
        // Redirect to identity cards page with student ID
        window.location.href = `/schooladmin/students/identity-cards?studentId=${student.id}`
        break
      case "delete":
        if (confirm(`Are you sure you want to delete ${getStudentName(student)}?`)) {
          deleteStudentMutation.mutate(student.id)
        }
        break
      case "message":
        window.open(`mailto:${student.parentEmail}`)
        break
      case "call":
        window.open(`tel:${student.parentPhone}`)
        break
    }
  }

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false)
    setSelectedStudent(null)
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setSelectedStudent(null)
  }

  const handleDetailModalEdit = (student: Student) => {
    setIsDetailModalOpen(false)
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

  const handleDetailModalMessage = (student: Student) => {
    window.open(`mailto:${student.parentEmail}`)
  }

  const handleDetailModalCall = (student: Student) => {
    window.open(`tel:${student.parentPhone}`)
  }

  // Enhanced actions for different scenarios
  const handleAttendanceAction = (action: string, studentId?: string) => {
    switch (action) {
      case "mark":
        toast({ title: "Attendance Marked", description: "Student attendance has been recorded." })
        break
      case "view":
        toast({ title: "Attendance Report", description: "Opening attendance report..." })
        break
      case "export":
        toast({ title: "Export Started", description: "Attendance data export in progress..." })
        break
    }
  }

  const handlePerformanceAction = (action: string) => {
    switch (action) {
      case "view":
        toast({ title: "Performance Report", description: "Opening performance report..." })
        break
      case "export":
        toast({ title: "Export Started", description: "Performance data export in progress..." })
        break
      case "analyze":
        toast({ title: "Analysis Started", description: "Performance analysis in progress..." })
        break
    }
  }

  const handleExportAction = (type: string) => {
    switch (type) {
      case "csv":
        toast({ title: "CSV Export", description: "CSV export started..." })
        break
      case "pdf":
        toast({ title: "PDF Export", description: "PDF export started..." })
        break
      case "excel":
        toast({ title: "Excel Export", description: "Excel export started..." })
        break
    }
  }

  const handleAnalyticsAction = (action: string) => {
    switch (action) {
      case "view":
        toast({ title: "Analytics Dashboard", description: "Opening analytics dashboard..." })
        break
      case "export":
        toast({ title: "Analytics Export", description: "Analytics export started..." })
        break
      case "schedule":
        toast({ title: "Report Scheduling", description: "Setting up automated reports..." })
        break
    }
  }

  const handleNotificationAction = (type: string) => {
    switch (type) {
      case "send":
        toast({ title: "Notification Sent", description: "Notification has been sent to parents." })
        break
      case "schedule":
        toast({ title: "Notification Scheduled", description: "Notification has been scheduled." })
        break
      case "template":
        toast({ title: "Template Created", description: "Notification template has been created." })
        break
    }
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-6">
            {/* Main Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Side - Title and Description */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <p className="text-gray-600">Manage student records, track performance, and handle admissions</p>
              </div>

              {/* Right Side - Actions */}
              <div className="flex items-center gap-3">
                <AddStudentModal
                  onSuccess={(payload: CreateStudentPayload) => {
                    createStudentMutation.mutate(payload)
                  }}
                />

                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                  onClick={() => window.location.href = '/schooladmin/students/identity-cards'}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Identity Cards
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsHelpModalOpen(true)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 py-4 space-y-6">
          {/* Filter Bar */}
          <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name, email, roll number, or parent..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-10 pl-10 pr-10 bg-gray-50 focus:bg-white transition-colors"
                />
                {localSearch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearchChange("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Filters Row */}
              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <Select value={localFilters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-32 h-10 bg-gray-50 focus:bg-white transition-colors">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>

                {/* Class Filter */}
                <Select value={localFilters.class || 'all'} onValueChange={(value) => handleFilterChange('class', value)}>
                  <SelectTrigger className="w-32 h-10 bg-gray-50 focus:bg-white transition-colors">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {Array.from(new Set(students.map(s => s.class?.name))).filter(Boolean).sort().map((className: any) => (
                      <SelectItem key={className} value={className}>{className}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Gender Filter */}
                <Select value={localFilters.gender || 'all'} onValueChange={(value) => handleFilterChange('gender', value)}>
                  <SelectTrigger className="w-28 h-10 bg-gray-50 focus:bg-white transition-colors">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Gender</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Input
                  type="date"
                  value={localFilters.admissionDate || ''}
                  onChange={(e) => handleFilterChange('admissionDate', e.target.value)}
                  className="w-40 h-10 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Admission Date"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                  className="h-10 px-4"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>

                {(localSearch || Object.keys(localFilters).some(key => localFilters[key] && localFilters[key] !== 'all')) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-10 text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filter Indicators */}
            {(localSearch || Object.keys(localFilters).some(key => localFilters[key] && localFilters[key] !== 'all')) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                  {localSearch && (
                    <Badge variant="outline" className="text-xs h-6">
                      Search: "{localSearch}"
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                        onClick={() => setLocalSearch("")}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  {Object.entries(localFilters).map(([key, value]) => {
                    if (!value || value === 'all') return null
                    return (
                      <Badge key={key} variant="outline" className="text-xs h-6">
                        {key}: {value}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                          onClick={() => handleFilterChange(key, 'all')}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Students Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-100">Total Students</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                    <p className="text-xs text-blue-200">
                      {stats.newThisMonth > 0 ? `+${stats.newThisMonth} this month` : 'No new enrollments'}
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-100">Top Performers</p>
                    <p className="text-3xl font-bold text-white">{stats.topPerformers}</p>
                    <p className="text-xs text-emerald-200">
                      Top {stats.total > 0 ? Math.round((stats.topPerformers / stats.total) * 100) : 0}% performers
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-100">Attendance</p>
                    <p className="text-3xl font-bold text-white">{stats.averageAttendance}%</p>
                    <p className="text-xs text-orange-200">
                      {stats.averageAttendance >= 90 ? 'Excellent' : stats.averageAttendance >= 80 ? 'Good' : 'Needs attention'}
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Need Attention Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-100">Need Attention</p>
                    <p className="text-3xl font-bold text-white">{stats.needsAttention}</p>
                    <p className="text-xs text-red-200">
                      {stats.total > 0 ? Math.round((stats.needsAttention / stats.total) * 100) : 0}% require intervention
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>







          {/* Enhanced Table Component or Empty State */}
          {filteredStudents.length > 0 ? (
            <div className="space-y-4">
              {/* Search Results Header */}
              {localSearch && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Search Results for "{localSearch}"
                      </span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {filteredStudents.length} result{filteredStudents.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSearchChange("")}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear Search
                    </Button>
                  </div>
                </div>
              )}

              <EnhancedTable
                data={paginatedStudents as TableStudent[]}
                columns={[
                  {
                    key: "name",
                    header: "Student",
                    sortable: true,
                    cell: (item) => (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-slate-100">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name || 'Student'}`} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium">
                            {item.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{item.name || 'Unknown Student'}</div>
                          <div className="text-xs text-slate-500">{item.email || 'No Email'}</div>
                        </div>
                      </div>
                    )
                  },
                  {
                    key: "class",
                    header: "Class",
                    sortable: true,
                    cell: (item) => (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-medium">
                        {item.class?.name}
                      </Badge>
                    )
                  },
                  {
                    key: "rollNumber",
                    header: "Roll No",
                    sortable: true,
                    cell: (item) => (
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {item.rollNumber || 'N/A'}
                      </span>
                    )
                  },
                  {
                    key: "status",
                    header: "Status",
                    sortable: true,
                    cell: (item) => (
                      <Badge
                        className={`text-xs font-medium ${item.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : item.status === "Inactive"
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-red-100 text-red-800 border-red-200"
                          }`}
                      >
                        {item.status || 'Unknown'}
                      </Badge>
                    )
                  },
                  {
                    key: "parentName",
                    header: "Parent Contact",
                    sortable: true,
                    cell: (item) => (
                      <div className="text-xs">
                        <div className="font-semibold text-slate-900">{item.parentName || 'N/A'}</div>
                        <div className="text-slate-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {item.parentContact || 'N/A'}
                        </div>
                      </div>
                    )
                  }
                ]}
                title="Students List"
                description=""

                actions={[
                  {
                    key: "view",
                    label: "View Details",
                    icon: <Eye className="h-4 w-4" />,
                    onClick: (item) => handleStudentAction(item as Student, "view")
                  },
                  {
                    key: "edit",
                    label: "Edit Student",
                    icon: <Edit className="h-4 w-4" />,
                    onClick: (item) => handleStudentAction(item as Student, "edit")
                  },
                  {
                    key: "idCard",
                    label: "Generate ID Card",
                    icon: <CreditCard className="h-4 w-4" />,
                    onClick: (item) => handleStudentAction(item as Student, "idCard")
                  },
                  {
                    key: "message",
                    label: "Message Parent",
                    icon: <Mail className="h-4 w-4" />,
                    onClick: (item) => handleStudentAction(item as Student, "message")
                  },
                  {
                    key: "call",
                    label: "Call Parent",
                    icon: <Phone className="h-4 w-4" />,
                    onClick: (item) => handleStudentAction(item as Student, "call")
                  },
                  {
                    key: "delete",
                    label: "Delete Student",
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: (item) => handleStudentAction(item as Student, "delete"),
                    variant: "destructive"
                  }
                ]}
                bulkActions={[
                  {
                    key: "activate",
                    label: "Activate All",
                    icon: <CheckCircle className="h-4 w-4" />,
                    onClick: (items) => {
                      const ids = items.map(item => item.id)
                      ids.forEach(id => updateStudentMutation.mutate({ id, data: { status: "Active" } }))
                      toast({ title: "Students Activated", description: `${ids.length} students activated.` })
                    }
                  },
                  {
                    key: "deactivate",
                    label: "Deactivate All",
                    icon: <Clock className="h-4 w-4" />,
                    onClick: (items) => {
                      const ids = items.map(item => item.id)
                      ids.forEach(id => updateStudentMutation.mutate({ id, data: { status: "Inactive" } }))
                      toast({ title: "Students Deactivated", description: `${ids.length} students deactivated.` })
                    }
                  },
                  {
                    key: "delete",
                    label: "Delete All",
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: (items) => {
                      if (confirm(`Are you sure you want to delete ${items.length} students?`)) {
                        const ids = items.map(item => item.id)
                        ids.forEach(id => deleteStudentMutation.mutate(id))
                        toast({ title: "Students Deleted", description: `${ids.length} students deleted.` })
                      }
                    },
                    variant: "destructive"
                  },
                  {
                    key: "idCards",
                    label: "Generate ID Cards",
                    icon: <CreditCard className="h-4 w-4" />,
                    onClick: (items) => {
                      const ids = items.map(item => item.id).join(',')
                      window.location.href = `/schooladmin/students/identity-cards?studentIds=${ids}`
                    }
                  },
                  {
                    key: "message",
                    label: "Send Message",
                    icon: <Mail className="h-4 w-4" />,
                    onClick: (items) => {
                      toast({ title: "Message Sent", description: `Message sent to ${items.length} parents.` })
                    }
                  },
                  {
                    key: "delete",
                    label: "Delete All",
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: (items) => {
                      const ids = items.map(item => item.id)
                      bulkDelete(ids)
                      toast({ title: "Students Deleted", description: `${ids.length} students deleted.` })
                    },
                    variant: "destructive"
                  }
                ]}
                onAdd={undefined}
                onEdit={(item) => handleStudentAction(item as Student, "edit")}
                onDelete={(ids) => {
                  bulkDelete(ids)
                  toast({ title: "Students Deleted", description: `${ids.length} students deleted.` })
                }}
                onExport={() => handleExport('csv')}
                searchPlaceholder="Search students by name, email, or roll number..."
                searchKeys={["name", "email", "rollNumber", "parentName"]}
                pageSize={pageSize}
                pageSizeOptions={[10, 25, 50, 100]}
                showPagination={false}
                showSearch={false}
                showFilters={false}
                showBulkActions
                showExport={false}
                onRowClick={(item) => handleStudentAction(item as Student, "view")}
                onSelectionChange={(items) => setLocalSelectedItems(items)}
                selectedIds={localSelectedItems}
                sortable
                onSort={(key, direction) => {
                  // Handle sorting logic here
                  console.log(`Sorting by ${String(key)} in ${direction} order`)
                }}
                sortKey="name"
                sortDirection="asc"
              />
            </div>
          ) : (
            <div className="bg-white border rounded-lg shadow-sm p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500 mb-4">
                    {Object.keys(localFilters).some(key => localFilters[key] && localFilters[key] !== 'all') || localSearch
                      ? "Try adjusting your search or filter criteria"
                      : "No students have been added yet"}
                  </p>
                  {Object.keys(localFilters).some(key => localFilters[key] && localFilters[key] !== 'all') || localSearch ? (
                    <Button variant="outline" onClick={clearAllFilters}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  ) : (
                    <Button onClick={() => window.location.href = '/schooladmin/students/add'}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Student
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredStudents.length > 0 && totalPages > 1 && (
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      })}
                      {totalPages > 5 && <span className="text-gray-400">...</span>}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Page size:</span>
                    <Select value={pageSize.toString()} onValueChange={(value) => {
                      setPageSize(parseInt(value))
                      setCurrentPage(1)
                    }}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Filter Indicators */}
                  {(localSearch || Object.keys(localFilters).some(key => localFilters[key] && localFilters[key] !== 'all')) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {localSearch && (
                          <Badge variant="outline" className="text-xs">
                            Search: "{localSearch}"
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 hover:bg-gray-100"
                              onClick={() => setLocalSearch("")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        )}
                        {Object.entries(localFilters).map(([key, value]) => {
                          if (!value || value === 'all') return null
                          return (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1 hover:bg-gray-100"
                                onClick={() => handleFilterChange(key, 'all')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <StudentDetailModal
            student={selectedStudent}
            isOpen={isDetailModalOpen}
            onClose={handleDetailModalClose}
            onEdit={handleDetailModalEdit}
            onMessage={handleDetailModalMessage}
            onCall={handleDetailModalCall}
          />
        )}

        {/* Edit Student Modal */}
        {selectedStudent && (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[800px] p-0">
              <DialogHeader className="px-6 py-4 border-b border-gray-200">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Edit Student: {selectedStudent.name}
                </DialogTitle>
              </DialogHeader>
              <AddStudentForm
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                onSuccess={(studentData) => {
                  // Update the student in the list
                  const updatedStudent = {
                    ...selectedStudent,
                    name: `${studentData.firstName} ${studentData.lastName}`,
                    email: studentData.email,
                    phone: studentData.phone,
                    dateOfBirth: studentData.dateOfBirth?.toISOString() || "",
                    gender: studentData.gender,
                    bloodGroup: studentData.bloodGroup || "",
                    address: `${studentData.addressStreet}, ${studentData.addressCity}, ${studentData.addressState} ${studentData.addressZip}`,
                    class: studentData.class,
                    rollNumber: studentData.rollNumber,
                    parentName: studentData.parentName,
                    parentContact: studentData.parentContact,
                    parentPhone: studentData.parentContact,
                    parentEmail: studentData.parentEmail,
                    admissionDate: studentData.admissionDate?.toISOString() || "",
                    emergencyContact: typeof studentData.emergencyContact === 'string'
                      ? studentData.emergencyContact
                      : studentData.emergencyContact?.phone || '',
                  }
                  updateStudent(updatedStudent.id, updatedStudent)
                  setIsEditModalOpen(false)
                  setSelectedStudent(null)
                  toast({
                    title: "Student Updated Successfully!",
                    description: `${studentData.firstName} ${studentData.lastName} has been updated.`,
                  })
                }}
                mode="modal"
                isEditing={true}
                initialData={{
                  firstName: selectedStudent.name.split(' ')[0],
                  lastName: selectedStudent.name.split(' ').slice(1).join(' '),
                  email: selectedStudent.email,
                  phone: selectedStudent.phone,
                  dateOfBirth: selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth) : undefined,
                  gender: selectedStudent.gender,
                  bloodGroup: selectedStudent.bloodGroup,
                  addressStreet: selectedStudent.address.split(',')[0] || "",
                  addressCity: selectedStudent.address.split(',')[1]?.trim() || "",
                  addressState: selectedStudent.address.split(',')[2]?.trim() || "",
                  addressZip: selectedStudent.address.split(',')[3]?.trim() || "",
                  class: selectedStudent.class,
                  rollNumber: selectedStudent.rollNumber,
                  parentName: selectedStudent.parentName,
                  parentContact: selectedStudent.parentContact,
                  parentEmail: selectedStudent.parentEmail,
                  admissionDate: selectedStudent.admissionDate ? new Date(selectedStudent.admissionDate) : undefined,
                  emergencyContact: typeof selectedStudent.emergencyContact === 'string'
                    ? { name: "Emergency Contact", phone: selectedStudent.emergencyContact, relationship: "Emergency" }
                    : selectedStudent.emergencyContact,
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Help Modal */}
        <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-900">
                <BookOpen className="h-5 w-5" />
                How to Use Student Management Page
              </DialogTitle>
              <DialogDescription>
                Learn how to effectively manage students, view analytics, and perform various actions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Analytics Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Analytics & Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">📊 Dashboard Cards</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Hover over cards</strong> for detailed metrics</li>
                      <li>• <strong>Total Students</strong> - View enrollment statistics</li>
                      <li>• <strong>Top Performers</strong> - Identify high-achieving students</li>
                      <li>• <strong>Attendance</strong> - Monitor attendance rates</li>
                      <li>• <strong>Need Attention</strong> - Students requiring intervention</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">🎯 Quick Actions</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• <strong>Click cards</strong> to view detailed reports</li>
                      <li>• <strong>Export data</strong> for external analysis</li>
                      <li>• <strong>Generate alerts</strong> for at-risk students</li>
                      <li>• <strong>Schedule meetings</strong> with parents</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Search & Filter Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  Search & Filter
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">🔍 Quick Search</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• <strong>Search bar</strong> - Find by name, email, roll number</li>
                      <li>• <strong>Real-time results</strong> as you type</li>
                      <li>• <strong>Parent information</strong> included in search</li>
                      <li>• <strong>Case-insensitive</strong> search</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">🎛️ Advanced Filters</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• <strong>Status filter</strong> - Active, Inactive, Suspended, Graduated</li>
                      <li>• <strong>Class filter</strong> - Filter by specific classes</li>
                      <li>• <strong>Gender filter</strong> - Male or Female students</li>
                      <li>• <strong>Admission date</strong> - Filter by enrollment date</li>
                      <li>• <strong>Clear filters</strong> - Reset all filters quickly</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Student Management Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Student Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">📋 Student List</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• <strong>View all students</strong> in organized table</li>
                      <li>• <strong>Status badges</strong> - Color-coded student status</li>
                      <li>• <strong>Quick actions</strong> - View, edit, contact parents</li>
                      <li>• <strong>Responsive design</strong> for mobile devices</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">📋 Bulk Operations</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• <strong>Select multiple students</strong> using checkboxes</li>
                      <li>• <strong>Bulk activate/deactivate</strong> students</li>
                      <li>• <strong>Send notifications</strong> to multiple parents</li>
                      <li>• <strong>Export data</strong> for selected students</li>
                      <li>• <strong>Bulk delete</strong> (use with caution)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions & Tools Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  Actions & Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">👁️ Individual Actions</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• <strong>View Details</strong> - Complete student information</li>
                      <li>• <strong>Edit Student</strong> - Update student records</li>
                      <li>• <strong>Email Parent</strong> - Send email to parents</li>
                      <li>• <strong>Call Parent</strong> - Direct phone call</li>
                      <li>• <strong>Delete Student</strong> - Remove from system</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">📊 Data Management</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• <strong>Add New Student</strong> - Multi-step form</li>
                      <li>• <strong>Export Reports</strong> - Various formats</li>
                      <li>• <strong>Pagination</strong> - Navigate large datasets</li>
                      <li>• <strong>Sort & Filter</strong> - Organize data</li>
                      <li>• <strong>Real-time updates</strong> - Instant changes</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Pro Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-2">💡 Efficiency Tips</h4>
                    <ul className="space-y-1">
                      <li>• Use keyboard shortcuts for faster navigation</li>
                      <li>• Save frequently used filters for quick access</li>
                      <li>• Export data regularly for backup purposes</li>
                      <li>• Use bulk actions for time-saving operations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">🔒 Best Practices</h4>
                    <ul className="space-y-1">
                      <li>• Always verify student information before processing</li>
                      <li>• Use clear, descriptive notes for students</li>
                      <li>• Regularly update contact information</li>
                      <li>• Monitor student trends and performance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setIsHelpModalOpen(false)}>
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
