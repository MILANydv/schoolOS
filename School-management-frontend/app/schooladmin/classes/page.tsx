"use client";

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { classesApi } from "@/lib/api"
import { GraduationCap, Users, BookOpen, Clock, AlertTriangle, Download, Upload, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, User, Building, UserPlus, Calendar, TrendingUp, Target, Users2, BookMarked, MapPin, Search, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedTable, TableColumn, TableFilter, TableAction } from "@/components/table/enhanced-table"
import { MOCK_CLASSES } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { FormSelect } from "@/components/forms/form-select"
import { FormInput } from "@/components/forms/form-input"
import { FormDatePicker } from "@/components/forms/form-date-picker"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid'

interface Class {
  id: string
  name: string
  section: string
  grade: string
  capacity: number
  enrolled: number
  classTeacher: string
  subjects: string[]
  department: string
  roomNo: string
  schedule: string
  status: string
  averageAttendance: number
  performance: number
  academicYear: string
  createdAt: string
  updatedAt?: string // Added for last updated date
}

export default function ClassManagementPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // React Query for data fetching
  const { data: classesData, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll
  })

  const classes = classesData?.data || []

  // Mutations
  const createClassMutation = useMutation({
    mutationFn: classesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast({ title: "Success", description: "Class created successfully" })
      setAddClassOpen(false)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create class",
        variant: "destructive"
      })
    }
  })

  const updateClassMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => classesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast({ title: "Success", description: "Class updated successfully" })
      setEditClassOpen(false)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update class",
        variant: "destructive"
      })
    }
  })

  const deleteClassMutation = useMutation({
    mutationFn: classesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast({ title: "Success", description: "Class deleted successfully" })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete class",
        variant: "destructive"
      })
    }
  })
  const [selectedClass, setSelectedClass] = React.useState<Class | null>(null)
  const [classDialogOpen, setClassDialogOpen] = React.useState(false)
  const [selectedClassIds, setSelectedClassIds] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")
  const [gradeFilter, setGradeFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [addClassOpen, setAddClassOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [editClassOpen, setEditClassOpen] = React.useState(false)
  const [classForm, setClassForm] = React.useState({
    name: '',
    grade: '',
    section: '',
    capacity: 0,
    roomNo: '',
    department: '',
    classTeacher: '',
    status: 'Active',
    schedule: '',
    academicYear: '2024-25',
    startDate: '',
    endDate: '',
    classCode: '',
    floor: '',
    description: '',
    requirements: '',
  })

  // Class Analytics
  const totalClasses = classes.length
  const activeClasses = classes.filter(c => c.status === "Active").length
  const totalStudents = classes.reduce((sum, c) => sum + c.enrolled, 0)
  const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0)
  const averageAttendance = classes.reduce((sum, c) => sum + (c.averageAttendance || 0), 0) / classes.length
  const averagePerformance = classes.reduce((sum, c) => sum + (c.performance || 0), 0) / classes.length

  // Class filter logic
  const filteredClasses = classes
    .filter(c => statusFilter === "all" || c.status === statusFilter)
    .filter(c => gradeFilter === "all" || c.grade === gradeFilter)
    .filter(c => {
      return c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.classTeacher.toLowerCase().includes(search.toLowerCase()) ||
        c.department.toLowerCase().includes(search.toLowerCase())
    })

  // Add Class Handler
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault()
    if (!classForm.name || !classForm.grade || !classForm.section || !classForm.capacity || !classForm.department || !classForm.classTeacher) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' })
      return
    }

    const apiPayload = {
      name: classForm.name,
      grade: classForm.grade,
      section: classForm.section,
      capacity: parseInt(classForm.capacity.toString()),
      roomNo: classForm.roomNo,
      department: classForm.department,
      classTeacher: classForm.classTeacher,
      status: classForm.status,
      academicYear: classForm.academicYear || "2024-25",
      schedule: classForm.schedule || (parseInt(classForm.grade) >= 11 ? 'Morning Shift' : 'Afternoon Shift'),
    }

    createClassMutation.mutate(apiPayload)

    // Reset form
    setClassForm({
      name: '',
      grade: '',
      section: '',
      capacity: 0,
      roomNo: '',
      department: '',
      classTeacher: '',
      status: 'Active',
      schedule: '',
      academicYear: '2024-25',
      startDate: '',
      endDate: '',
      classCode: '',
      floor: '',
      description: '',
      requirements: '',
    })
  }

  const handleEditClass = (classData: any) => {
    const apiPayload = {
      name: classData.name,
      grade: classData.grade,
      section: classData.section,
      capacity: parseInt(classData.capacity.toString()),
      roomNo: classData.roomNo,
      department: classData.department,
      classTeacher: classData.classTeacher,
      status: classData.status,
      academicYear: classData.academicYear,
      schedule: classData.schedule
    }

    updateClassMutation.mutate({ id: classData.id, data: apiPayload })
    setSelectedClass(null)
  }

  const handleDeleteClasses = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} class(es)?`)) {
      ids.forEach(id => deleteClassMutation.mutate(id))
    }
    setSelectedClassIds([])
  }

  // Enhanced Table columns for classes
  const classColumns: TableColumn<Class>[] = [
    {
      key: "name",
      header: "Class",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-blue-100">
            <AvatarFallback className="text-blue-600 font-semibold">
              {item.grade}{item.section}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-slate-900 text-sm cursor-pointer hover:text-blue-600 transition-colors">
              {item.name}
            </div>
            <div className="text-xs text-slate-500">{item.department}</div>
          </div>
        </div>
      )
    },
    {
      key: "classTeacher",
      header: "Class Teacher",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{item.classTeacher}</span>
        </div>
      )
    },
    {
      key: "enrolled",
      header: "Students",
      sortable: true,
      cell: (item) => (
        <div className="text-center">
          <div className="font-bold text-slate-900">{item.enrolled}</div>
          <div className="text-xs text-slate-500">of {item.capacity}</div>
        </div>
      )
    },
    {
      key: "roomNo",
      header: "Room",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium">{item.roomNo}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (item) => {
        const color = item.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
        return <Badge className={`text-xs font-medium ${color}`}>{item.status}</Badge>
      }
    },
    {
      key: "averageAttendance",
      header: "Attendance",
      sortable: true,
      cell: (item) => (
        <div className="text-center">
          <div className="font-bold text-slate-900">{item.averageAttendance}%</div>
          <div className="text-xs text-slate-500">Average</div>
        </div>
      )
    },
    {
      key: "performance",
      header: "Performance",
      sortable: true,
      cell: (item) => (
        <div className="text-center">
          <div className="font-bold text-slate-900">{item.performance}%</div>
          <div className="text-xs text-slate-500">Class Avg</div>
        </div>
      )
    },
    {
      key: "schedule",
      header: "Schedule",
      sortable: true,
      cell: (item) => (
        <div className="text-sm text-slate-600">
          {item.schedule}
        </div>
      )
    }
  ]

  // Table filters
  const classFilters: TableFilter[] = [
    {
      key: "grade",
      type: "select",
      label: "Grade",
      options: [
        { value: "8", label: "Grade 8" },
        { value: "9", label: "Grade 9" },
        { value: "10", label: "Grade 10" },
        { value: "11", label: "Grade 11" },
        { value: "12", label: "Grade 12" }
      ]
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" }
      ]
    },
    {
      key: "department",
      type: "select",
      label: "Department",
      options: [
        { value: "Science", label: "Science" },
        { value: "Mathematics", label: "Mathematics" },
        { value: "English", label: "English" },
        { value: "History", label: "History" },
        { value: "Computer Science", label: "Computer Science" },
        { value: "Economics", label: "Economics" },
        { value: "Business", label: "Business" }
      ]
    }
  ]

  // Table actions
  const classActions: TableAction<Class>[] = [
    {
      key: "view",
      label: "Quick View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item) => {
        setSelectedClass(item)
        setProfileOpen(true)
      },
      variant: "ghost"
    },
    {
      key: "edit",
      label: "Edit Class",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item) => {
        setSelectedClass(item)
        setEditClassOpen(true)
      },
      variant: "ghost"
    },
    {
      key: "delete",
      label: "Delete Class",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item) => {
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
          handleDeleteClasses([item.id])
        }
      },
      variant: "destructive"
    }
  ]

  return (
    <div className="w-full">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          {/* Main Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Side - Title and Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
              <p className="text-gray-600">Manage classes, teachers, and student enrollment across your school</p>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setAddClassOpen(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Add New Class
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
              <input
                type="text"
                placeholder="Search classes by name, teacher, or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3">
              {/* Grade Filter */}
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="all">All Grades</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Department Filter */}
              <select className="w-40 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors">
                <option value="">All Departments</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Economics">Economics</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setGradeFilter("all")
                  setStatusFilter("all")
                }}
                className="h-10 px-4 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const csv = [["Class", "Teacher", "Students", "Room", "Status", "Department"],
                  ...filteredClasses.map(c => [c.name, c.classTeacher, `${c.enrolled}/${c.capacity}`, c.roomNo, c.status, c.department])]
                  const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `classes-export-${Date.now()}.csv`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast({ title: "Export Complete", description: "Class data exported successfully." })
                }}
                className="h-10 px-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(search || gradeFilter !== "all" || statusFilter !== "all") && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                {search && (
                  <Badge variant="outline" className="text-xs h-6">
                    Search: "{search}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setSearch("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {gradeFilter !== "all" && (
                  <Badge variant="outline" className="text-xs h-6">
                    Grade: {gradeFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setGradeFilter("all")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="outline" className="text-xs h-6">
                    Status: {statusFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setStatusFilter("all")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Total Classes Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-100">Total Classes</p>
                  <p className="text-3xl font-bold text-white">{totalClasses}</p>
                  <p className="text-xs text-blue-200">
                    Active sections
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Classes Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-100">Active Classes</p>
                  <p className="text-3xl font-bold text-white">{activeClasses}</p>
                  <p className="text-xs text-emerald-200">
                    Currently running
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Students Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-100">Total Students</p>
                  <p className="text-3xl font-bold text-white">{totalStudents}</p>
                  <p className="text-xs text-purple-200">
                    Enrolled students
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-100">Capacity</p>
                  <p className="text-3xl font-bold text-white">{totalCapacity}</p>
                  <p className="text-xs text-orange-200">
                    Total seats
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-teal-100">Attendance</p>
                  <p className="text-3xl font-bold text-white">{averageAttendance.toFixed(1)}%</p>
                  <p className="text-xs text-teal-200">
                    Class average
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-indigo-100">Performance</p>
                  <p className="text-3xl font-bold text-white">{averagePerformance.toFixed(1)}%</p>
                  <p className="text-xs text-indigo-200">
                    Class average
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Class Table */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <style jsx>{`
              .scrollbar-thin::-webkit-scrollbar {
                height: 8px;
              }
              .scrollbar-thin::-webkit-scrollbar-track {
                background: #f3f4f6;
                border-radius: 4px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 4px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: #9ca3af;
              }
              .table-focus-ring:focus-within {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
              }
              .table-row-hover:hover {
                background-color: #f8fafc;
              }
              .table-row-selected {
                background-color: #eff6ff;
                border-left: 3px solid #3b82f6;
              }
            `}</style>
            <EnhancedTable
              data={filteredClasses}
              columns={classColumns}
              title="Class Records"
              description=""
              actions={classActions}
              bulkActions={[
                {
                  key: "activate",
                  label: "Activate All",
                  icon: <Users className="h-4 w-4" />,
                  onClick: (items) => {
                    const ids = items.map(item => item.id)
                    setClasses(prev => prev.map(c => ids.includes(c.id) ? { ...c, status: "Active" } : c))
                    toast({ title: "Classes Activated", description: `${ids.length} classes activated.` })
                  }
                },
                {
                  key: "deactivate",
                  label: "Deactivate All",
                  icon: <AlertTriangle className="h-4 w-4" />,
                  onClick: (items) => {
                    const ids = items.map(item => item.id)
                    setClasses(prev => prev.map(c => ids.includes(c.id) ? { ...c, status: "Inactive" } : c))
                    toast({ title: "Classes Deactivated", description: `${ids.length} classes deactivated.` })
                  }
                },
                {
                  key: "delete",
                  label: "Delete All",
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: (items) => {
                    const ids = items.map(item => item.id)
                    handleDeleteClasses(ids)
                  },
                  variant: "destructive"
                }
              ]}
              onAdd={undefined}
              onEdit={(item) => {
                setSelectedClass(item)
                setEditClassOpen(true)
              }}
              onDelete={handleDeleteClasses}
              onExport={() => {
                const csv = [["Class", "Teacher", "Students", "Room", "Status", "Department"],
                ...filteredClasses.map(c => [c.name, c.classTeacher, `${c.enrolled}/${c.capacity}`, c.roomNo, c.status, c.department])]
                const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `classes-export-${Date.now()}.csv`
                a.click()
                URL.revokeObjectURL(url)
                toast({ title: "Export Complete", description: "Class data exported successfully." })
              }}
              searchPlaceholder="Search classes by name, teacher, or department..."
              searchKeys={["name", "classTeacher", "department"]}
              pageSize={15}
              pageSizeOptions={[10, 15, 25, 50, 100]}
              showPagination={true}
              showSearch={false}
              showFilters={false}
              showBulkActions={true}
              showExport={false}
              onRowClick={(item) => {
                setSelectedClass(item)
                setProfileOpen(true)
              }}
              onSelectionChange={setSelectedClassIds}
              selectedIds={selectedClassIds}
              sortable={true}
              sortKey="name"
              sortDirection="asc"
              loading={false}
              emptyState={
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No classes found</h3>
                  <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
                  <Button onClick={() => setAddClassOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Class
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Class Dialog */}
      <Dialog open={addClassOpen || editClassOpen} onOpenChange={(open) => {
        if (!open) {
          setAddClassOpen(false)
          setEditClassOpen(false)
          setSelectedClass(null)
          setClassForm({
            name: '',
            grade: '',
            section: '',
            capacity: 0,
            roomNo: '',
            department: '',
            classTeacher: '',
            status: 'Active',
            schedule: '',
            academicYear: '2024-25',
            startDate: '',
            endDate: '',
            classCode: '',
            floor: '',
            description: '',
            requirements: '',
          })
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl">
                <GraduationCap className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {editClassOpen ? 'Edit Class' : 'Add New Class'}
                </DialogTitle>
                <DialogDescription className="text-base text-slate-600 mt-1">
                  {editClassOpen ? 'Update the class details' : 'Create a comprehensive class profile with all necessary details'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={editClassOpen ? (e) => {
            e.preventDefault()
            handleEditClass({
              ...selectedClass,
              ...classForm
            })
          } : handleAddClass} className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Class Information */}
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-lg">
                      <Building className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
                      <p className="text-sm text-slate-600">Essential details for class identification</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <FormInput
                      id="name"
                      label="Class Name"
                      value={classForm.name}
                      onChange={e => setClassForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g., Class 10A"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormSelect
                        id="grade"
                        label="Grade"
                        value={classForm.grade}
                        onValueChange={v => setClassForm(f => ({ ...f, grade: v }))}
                        options={[
                          { value: "8", label: "Grade 8" },
                          { value: "9", label: "Grade 9" },
                          { value: "10", label: "Grade 10" },
                          { value: "11", label: "Grade 11" },
                          { value: "12", label: "Grade 12" }
                        ]}
                        required
                      />
                      <FormSelect
                        id="section"
                        label="Section"
                        value={classForm.section}
                        onValueChange={v => setClassForm(f => ({ ...f, section: v }))}
                        options={[
                          { value: "A", label: "Section A" },
                          { value: "B", label: "Section B" },
                          { value: "C", label: "Section C" },
                          { value: "D", label: "Section D" },
                          { value: "E", label: "Section E" },
                          { value: "F", label: "Section F" }
                        ]}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        id="capacity"
                        label="Student Capacity"
                        type="number"
                        value={classForm.capacity}
                        onChange={e => setClassForm(f => ({ ...f, capacity: Number(e.target.value) }))}
                        placeholder="40"
                        min="1"
                        max="100"
                        required
                      />
                      <FormInput
                        id="roomNo"
                        label="Room Number"
                        value={classForm.roomNo}
                        onChange={e => setClassForm(f => ({ ...f, roomNo: e.target.value }))}
                        placeholder="e.g., 101, 2A, Lab-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Details */}
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-lg">
                      <BookOpen className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Academic Details</h3>
                      <p className="text-sm text-slate-600">Educational structure and staff assignment</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <FormSelect
                      id="department"
                      label="Department"
                      value={classForm.department}
                      onValueChange={v => setClassForm(f => ({ ...f, department: v }))}
                      options={[
                        { value: "Science", label: "Science" },
                        { value: "Mathematics", label: "Mathematics" },
                        { value: "English", label: "English" },
                        { value: "History", label: "History" },
                        { value: "Geography", label: "Geography" },
                        { value: "Computer Science", label: "Computer Science" },
                        { value: "Economics", label: "Economics" },
                        { value: "Business", label: "Business" },
                        { value: "Arts", label: "Arts" },
                        { value: "Physical Education", label: "Physical Education" }
                      ]}
                      required
                    />
                    <FormInput
                      id="classTeacher"
                      label="Class Teacher"
                      value={classForm.classTeacher}
                      onChange={e => setClassForm(f => ({ ...f, classTeacher: e.target.value }))}
                      placeholder="e.g., Mr. John Doe"
                      required
                    />
                    <FormSelect
                      id="status"
                      label="Class Status"
                      value={classForm.status}
                      onValueChange={v => setClassForm(f => ({ ...f, status: v }))}
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                        { value: 'Planning', label: 'Planning' }
                      ]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Additional Information */}
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-lg">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Schedule & Timing</h3>
                      <p className="text-sm text-slate-600">Class schedule and academic calendar</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <FormSelect
                      id="schedule"
                      label="Class Schedule"
                      value={classForm.schedule || ""}
                      onValueChange={v => setClassForm(f => ({ ...f, schedule: v }))}
                      options={[
                        { value: "Morning Shift", label: "Morning Shift (8:00 AM - 2:00 PM)" },
                        { value: "Afternoon Shift", label: "Afternoon Shift (2:00 PM - 8:00 PM)" },
                        { value: "Full Day", label: "Full Day (8:00 AM - 4:00 PM)" },
                        { value: "Evening", label: "Evening (4:00 PM - 8:00 PM)" }
                      ]}
                    />
                    <FormInput
                      id="academicYear"
                      label="Academic Year"
                      value={classForm.academicYear || "2024-25"}
                      onChange={e => setClassForm(f => ({ ...f, academicYear: e.target.value }))}
                      placeholder="e.g., 2024-25"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        id="startDate"
                        label="Class Start Date"
                        type="date"
                        value={classForm.startDate || ""}
                        onChange={e => setClassForm(f => ({ ...f, startDate: e.target.value }))}
                      />
                      <FormInput
                        id="endDate"
                        label="Class End Date"
                        type="date"
                        value={classForm.endDate || ""}
                        onChange={e => setClassForm(f => ({ ...f, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-lg">
                      <BookMarked className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Additional Information</h3>
                      <p className="text-sm text-slate-600">Extra details and special requirements</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        id="classCode"
                        label="Class Code"
                        value={classForm.classCode || ""}
                        onChange={e => setClassForm(f => ({ ...f, classCode: e.target.value }))}
                        placeholder="e.g., CLS10A2024"
                      />
                      <FormInput
                        id="floor"
                        label="Floor/Level"
                        value={classForm.floor || ""}
                        onChange={e => setClassForm(f => ({ ...f, floor: e.target.value }))}
                        placeholder="e.g., Ground Floor, 1st Floor"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Class Description
                      </label>
                      <Textarea
                        placeholder="Enter any additional details about the class, special requirements, or notes..."
                        className="min-h-[80px] resize-none"
                        value={classForm.description || ""}
                        onChange={e => setClassForm(f => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Special Requirements
                      </label>
                      <Textarea
                        placeholder="Any special equipment, facilities, or requirements for this class..."
                        className="min-h-[60px] resize-none"
                        value={classForm.requirements || ""}
                        onChange={e => setClassForm(f => ({ ...f, requirements: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3 pt-6 border-t border-slate-200">
              <Button variant="outline" type="button" onClick={() => {
                setAddClassOpen(false)
                setEditClassOpen(false)
                setSelectedClass(null)
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editClassOpen ? 'Update Class' : 'Create Class'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={editClassOpen} onOpenChange={setEditClassOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update the details for this class.</DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <form onSubmit={(e) => {
              e.preventDefault()
              handleEditClass({
                ...selectedClass,
                name: classForm.name || selectedClass.name,
                grade: classForm.grade || selectedClass.grade,
                section: classForm.section || selectedClass.section,
                capacity: classForm.capacity || selectedClass.capacity,
                roomNo: classForm.roomNo || selectedClass.roomNo,
                department: classForm.department || selectedClass.department,
                classTeacher: classForm.classTeacher || selectedClass.classTeacher,
                status: classForm.status as "Active" | "Inactive" || selectedClass.status,
              })
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="name"
                  label="Class Name"
                  value={classForm.name || selectedClass.name}
                  onChange={e => setClassForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Class 10A"
                  required
                />
                <FormSelect
                  id="grade"
                  label="Grade"
                  value={classForm.grade || selectedClass.grade}
                  onValueChange={v => setClassForm(f => ({ ...f, grade: v }))}
                  options={[
                    { value: "8", label: "Grade 8" },
                    { value: "9", label: "Grade 9" },
                    { value: "10", label: "Grade 10" },
                    { value: "11", label: "Grade 11" },
                    { value: "12", label: "Grade 12" }
                  ]}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  id="section"
                  label="Section"
                  value={classForm.section || selectedClass.section}
                  onValueChange={v => setClassForm(f => ({ ...f, section: v }))}
                  options={[
                    { value: "A", label: "Section A" },
                    { value: "B", label: "Section B" },
                    { value: "C", label: "Section C" },
                    { value: "D", label: "Section D" }
                  ]}
                  required
                />
                <FormInput
                  id="capacity"
                  label="Capacity"
                  type="number"
                  value={classForm.capacity || selectedClass.capacity}
                  onChange={e => setClassForm(f => ({ ...f, capacity: Number(e.target.value) }))}
                  placeholder="40"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="roomNo"
                  label="Room Number"
                  value={classForm.roomNo || selectedClass.roomNo}
                  onChange={e => setClassForm(f => ({ ...f, roomNo: e.target.value }))}
                  placeholder="e.g., 101"
                />
                <FormSelect
                  id="department"
                  label="Department"
                  value={classForm.department || selectedClass.department}
                  onValueChange={v => setClassForm(f => ({ ...f, department: v }))}
                  options={[
                    { value: "Science", label: "Science" },
                    { value: "Mathematics", label: "Mathematics" },
                    { value: "English", label: "English" },
                    { value: "History", label: "History" },
                    { value: "Computer Science", label: "Computer Science" },
                    { value: "Economics", label: "Economics" },
                    { value: "Business", label: "Business" }
                  ]}
                />
              </div>
              <FormInput
                id="classTeacher"
                label="Class Teacher"
                value={classForm.classTeacher || selectedClass.classTeacher}
                onChange={e => setClassForm(f => ({ ...f, classTeacher: e.target.value }))}
                placeholder="e.g., Mr. John Doe"
              />
              <FormSelect
                id="status"
                label="Status"
                value={classForm.status || selectedClass.status}
                onValueChange={v => setClassForm(f => ({ ...f, status: v }))}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
                required
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => {
                  setSelectedClass(null)
                  setEditClassOpen(false)
                }}>Cancel</Button>
                <Button type="submit">Update Class</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Class Detail Sheet */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="w-[500px] max-w-[90vw] overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-gray-200">
            <SheetTitle className="text-xl font-bold text-gray-900">Class Details</SheetTitle>
            <SheetDescription className="text-gray-600">
              Comprehensive information about the selected class
            </SheetDescription>
          </SheetHeader>

          {selectedClass && (
            <div className="py-4 space-y-6">
              {/* Header Section */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <Avatar className="h-16 w-16 bg-blue-100 flex-shrink-0">
                  <AvatarFallback className="text-blue-600 font-semibold text-lg">
                    {selectedClass.grade}{selectedClass.section}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-bold text-gray-900 mb-1">{selectedClass.name}</div>
                  <div className="text-gray-600 mb-2">{selectedClass.department}</div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={selectedClass.status === "Active"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {selectedClass.status}
                    </Badge>
                    <span className="text-sm text-gray-500">• {selectedClass.academicYear}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Students</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedClass.enrolled}/{selectedClass.capacity}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round((selectedClass.enrolled / selectedClass.capacity) * 100)}% capacity
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Room</div>
                  <div className="text-lg font-semibold text-gray-900">{selectedClass.roomNo}</div>
                  <div className="text-xs text-gray-500">Class location</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Attendance</div>
                  <div className="text-lg font-semibold text-gray-900">{selectedClass.averageAttendance}%</div>
                  <div className="text-xs text-gray-500">Class average</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Performance</div>
                  <div className="text-lg font-semibold text-gray-900">{selectedClass.performance}%</div>
                  <div className="text-xs text-gray-500">Class average</div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Class Teacher
                  </h4>
                  <div className="text-gray-700">{selectedClass.classTeacher}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    Schedule & Timing
                  </h4>
                  <div className="text-gray-700">{selectedClass.schedule}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    Academic Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{new Date(selectedClass.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">{new Date(selectedClass.updatedAt || selectedClass.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedClass(selectedClass)
                    setEditClassOpen(true)
                    setProfileOpen(false)
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Class
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Open email client for teacher contact
                    const subject = `Regarding ${selectedClass.name} - ${selectedClass.department}`
                    const body = `Hello ${selectedClass.classTeacher},\n\nI hope this email finds you well. I would like to discuss matters related to ${selectedClass.name}.\n\nBest regards,\nSchool Administrator`
                    window.open(`mailto:${selectedClass.classTeacher}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
                  }}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Teacher
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
