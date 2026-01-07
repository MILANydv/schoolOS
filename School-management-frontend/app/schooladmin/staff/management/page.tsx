"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { teachersApi } from "@/lib/api"
import { useTeachers } from "@/hooks/useSchoolAdmin"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Calendar, Download, Upload, Eye, Edit, Trash2, Mail, Phone, User, Users, UserCheck, Briefcase, UserPlus, Search, RefreshCw, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EnhancedTable, TableColumn, TableFilter, TableAction } from "@/components/table/enhanced-table"
import { MOCK_STAFF, MOCK_TEACHERS, USER_ROLES } from "@/lib/constants"
import { AddUserForm } from "@/components/forms/add-user-form"
import { FormInput } from "@/components/forms/form-input"
import { useAuthStore } from "@/hooks/useAuthStore"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FormSelect } from "@/components/forms/form-select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Import Teacher type from store
interface Teacher {
  id: string
  name: string
  email: string
  subject: string
  department: string
  status: string
  joinDate: string
  phone: string
  address?: string
  experience: number
  qualification: string
  role?: string // Add role property
  // Enhanced fields for teachers
  classes?: string[] // Array of class IDs the teacher teaches
  subjects?: string[] // Array of subject names the teacher teaches
  isClassTeacher?: boolean // Whether this teacher is a class teacher
  assignedClass?: string // Class ID if this teacher is a class teacher
}

export default function SchoolAdminStaffPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // React Query for data fetching
  const { data: teachersData, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: teachersApi.getAll
  })

  const teachers = teachersData?.data || []

  // Mutations
  const createTeacherMutation = useMutation({
    mutationFn: teachersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast({ title: "Success", description: "Staff member added successfully" })
      setAddTeacherOpen(false)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add staff member",
        variant: "destructive"
      })
    }
  })

  const updateTeacherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => teachersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast({ title: "Success", description: "Staff member updated successfully" })
      setEditTeacherOpen(false)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update staff member",
        variant: "destructive"
      })
    }
  })

  const deleteTeacherMutation = useMutation({
    mutationFn: teachersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast({ title: "Success", description: "Staff member deleted successfully" })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete staff member",
        variant: "destructive"
      })
    }
  })

  // Zustand state management (keeping for UI state)
  const {
    ui,
    setSearchTerm,
    setFilters,
    setSelectedItems,
    setPagination,
    setModalState,
    getStats
  } = useTeachers()

  const { user: loggedInUser } = useAuthStore()

  // Local UI state (component-specific)
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [editTeacherOpen, setEditTeacherOpen] = React.useState(false)
  const [addTeacherOpen, setAddTeacherOpen] = React.useState(false)

  // Teacher form state
  const [teacherForm, setTeacherForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    role: 'TEACHER' as string
  })

  // Filter states
  const [localSearchTerm, setLocalSearchTerm] = React.useState("")
  const [localRoleFilter, setLocalRoleFilter] = React.useState("")
  const [localStatusFilter, setLocalStatusFilter] = React.useState("")
  const [localDepartmentFilter, setLocalDepartmentFilter] = React.useState("")

  // Get computed stats
  const teacherStats = getStats()
  const filteredTeachers = teachers // Simplified for now

  // Filtered staff based on filter bar
  const filteredStaff = React.useMemo(() => {
    return teachers.filter(teacher => {
      // Search filter
      const matchesSearch = !localSearchTerm ||
        teacher.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(localSearchTerm.toLowerCase())

      // Role filter
      const matchesRole = !localRoleFilter || teacher.role === localRoleFilter

      // Status filter
      const matchesStatus = !localStatusFilter || teacher.status === localStatusFilter

      // Department filter
      const matchesDepartment = !localDepartmentFilter || teacher.department === localDepartmentFilter

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment
    })
  }, [teachers, localSearchTerm, localRoleFilter, localStatusFilter, localDepartmentFilter])

  // Use Zustand stats instead of manual calculations
  const total = teacherStats.total
  const teachersCount = teacherStats.byDepartment?.Teachers || 0
  const accountants = teacherStats.byDepartment?.Accountants || 0
  const admins = teacherStats.byDepartment?.School_Admins || 0
  const inactive = teacherStats.inactive
  const newThisYear = teacherStats.newThisMonth // Using monthly as approximation

  // Helper: Map teacher to AddUserForm shape
  const teacherToUser = (teacher: Teacher): any => ({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    role: "TEACHER", // Default role since Teacher interface doesn't have role
    schoolId: "", // Default since Teacher interface doesn't have schoolId
    status: teacher.status,
    lastLogin: new Date().toISOString(), // Default since Teacher interface doesn't have lastLogin
    department: teacher.department, // Use department as subject
    phone: teacher.phone,
    dateJoined: teacher.joinDate, // Map joinDate back to dateJoined for form
    experience: teacher.experience,
    qualification: teacher.qualification
  })

  // Helper: Merge AddUserForm result with teacher fields
  const mergeUserToTeacher = (user: any, prev?: Teacher): Teacher => ({
    ...prev,
    id: user.id,
    name: user.name,
    email: user.email,
    subject: user.department || prev?.subject || "General",
    department: user.department || prev?.department || "",
    status: user.status,
    joinDate: user.dateJoined || prev?.joinDate || new Date().toISOString(),
    phone: user.phone || prev?.phone || "",
    experience: user.experience || prev?.experience || 5,
    qualification: user.qualification || prev?.qualification || "Bachelor's Degree"
  })

  // Unused handler removed
  // const handleAddTeacher = (user: any) => { ... }

  // Enhanced Add Teacher handler with basic fields
  const handleAddTeacherEnhanced = () => {
    // Validation
    if (!teacherForm.name || !teacherForm.email || !teacherForm.role) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in name, email, and select a role.',
        variant: 'destructive'
      })
      return
    }

    const [firstName, ...lastNameParts] = teacherForm.name.split(' ')
    const lastName = lastNameParts.join(' ') || ''

    const apiPayload = {
      firstName,
      lastName,
      email: teacherForm.email,
      password: "password123", // Default password
      phone: teacherForm.phone,
      address: teacherForm.address,
      role: teacherForm.role,
      department: 'General',
      subject: 'General',
      qualification: teacherForm.qualification || 'Not specified',
      experience: 0,
      joinDate: new Date().toISOString()
    }

    createTeacherMutation.mutate(apiPayload)

    // Reset form
    setTeacherForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      qualification: '',
      role: 'TEACHER'
    })
  }

  // Edit Teacher handler
  const handleEditTeacher = (user: any) => {
    const [firstName, ...lastNameParts] = user.name.split(' ')
    const lastName = lastNameParts.join(' ') || ''

    const apiPayload = {
      firstName,
      lastName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      status: user.status,
      qualification: user.qualification,
      experience: user.experience
    }

    updateTeacherMutation.mutate({ id: user.id, data: apiPayload })
    setSelectedTeacher(null)
  }

  const handleDeleteTeachers = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} staff member(s)?`)) {
      ids.forEach(id => deleteTeacherMutation.mutate(id))
    }
  }

  // Handle teacher action
  const handleTeacherAction = (teacher: Teacher, action: string) => {
    switch (action) {
      case "view":
        setSelectedTeacher(teacher)
        setProfileOpen(true)
        break
      case "edit":
        setSelectedTeacher(teacher)
        setEditTeacherOpen(true)
        break
      case "email":
        window.open(`mailto:${teacher.email}`)
        break
      case "call":
        if (teacher.phone) {
          window.open(`tel:${teacher.phone}`)
        }
        break
      case "delete":
        handleDeleteTeachers([teacher.id])
        break
    }
  }

  // Simplified Table columns for teachers
  const teacherColumns: TableColumn<Teacher>[] = [
    {
      key: "name",
      header: "Staff Member",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{item.name?.split(' ').map((n: string) => n[0]).join('') || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-slate-900">{item.name}</div>
            <div className="text-xs text-slate-500">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      cell: (item) => (
        <Badge className={`text-xs font-medium ${item.role === "TEACHER"
          ? "bg-blue-100 text-blue-800"
          : item.role === "ACCOUNTANT"
            ? "bg-green-100 text-green-800"
            : "bg-purple-100 text-purple-800"
          }`}>
          {item.role || "Teacher"}
        </Badge>
      )
    },
    {
      key: "subject",
      header: "Subject/Department",
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-medium text-sm">{item.subject}</div>
          <div className="text-xs text-slate-500">{item.department}</div>
        </div>
      )
    },
    {
      key: "classes",
      header: "Classes & Subjects",
      sortable: false,
      cell: (item) => {
        if (item.role === 'TEACHER') {
          return (
            <div className="space-y-1">
              {item.subjects && item.subjects.length > 0 && (
                <div className="text-xs">
                  <span className="font-medium text-slate-700">Subjects:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.subjects.slice(0, 3).map((subject, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                        {subject}
                      </Badge>
                    ))}
                    {item.subjects.length > 3 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{item.subjects.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              {item.classes && item.classes.length > 0 && (
                <div className="text-xs">
                  <span className="font-medium text-slate-700">Classes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.classes.slice(0, 2).map((classId, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                        Class {classId}
                      </Badge>
                    ))}
                    {item.classes.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{item.classes.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              {item.isClassTeacher && item.assignedClass && (
                <div className="text-xs">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Class Teacher: Class {item.assignedClass}
                  </Badge>
                </div>
              )}
            </div>
          )
        }
        return (
          <div className="text-xs text-slate-500">
            {item.department || 'N/A'}
          </div>
        )
      }
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (item) => (
        <Badge className={`text-xs font-medium ${item.status === "Active"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
          }`}>
          {item.status}
        </Badge>
      )
    },
    {
      key: "joinDate",
      header: "Join Date",
      sortable: true,
      cell: (item) => {
        try {
          const date = new Date(item.joinDate)
          return (
            <div className="text-sm">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          )
        } catch (error) {
          return <div className="text-sm text-slate-500">{item.joinDate}</div>
        }
      }
    }
  ]

  // Dynamic Table filters based on actual data
  const teacherFilters: TableFilter[] = [
    {
      key: "role",
      type: "select",
      label: "Role",
      options: [
        { value: "all", label: "All Roles" },
        // Dynamic roles from actual data
        ...Array.from(new Set(teachers.map(t => t.role).filter((role): role is string => Boolean(role)))).map(role => ({
          value: role,
          label: role === "TEACHER" ? "Teachers" :
            role === "ACCOUNTANT" ? "Accountants" :
              role === "SCHOOL_ADMIN" ? "School Admins" : role
        }))
      ]
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      options: [
        { value: "all", label: "All Statuses" },
        // Dynamic statuses from actual data
        ...Array.from(new Set(teachers.map(t => t.status))).map(status => ({
          value: status,
          label: status
        }))
      ]
    }
  ]

  // Simplified Table actions
  const teacherActions: TableAction<Teacher>[] = [
    {
      key: "view",
      label: "View Profile",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item) => handleTeacherAction(item, "view")
    },
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item) => handleTeacherAction(item, "edit")
    },
    {
      key: "email",
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
      onClick: (item) => handleTeacherAction(item, "email")
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item) => handleTeacherAction(item, "delete"),
      variant: "destructive"
    }
  ]

  // Helper: get period options based on staff
  const getPeriodOptions = (staffId: string) => {
    const staffMember = MOCK_STAFF.find(s => s.id === staffId)
    if (!staffMember) return []
    if (staffMember.salaryType === 'monthly') {
      return [
        { value: '2024-07', label: 'July 2024' },
        { value: '2024-06', label: 'June 2024' },
        { value: '2024-05', label: 'May 2024' },
      ]
    }
    if (staffMember.salaryType === 'period') {
      return [
        { value: '2024-Q3', label: 'Q3 2024' },
        { value: '2024-Q2', label: 'Q2 2024' },
        { value: '2024-Q1', label: 'Q1 2024' },
      ]
    }
    if (staffMember.salaryType === 'term') {
      return [
        { value: '2024-Term2', label: 'Term 2 2024' },
        { value: '2024-Term1', label: 'Term 1 2024' },
      ]
    }
    return []
  }




  return (
    <div className="w-full">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          {/* Main Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Side - Title and Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600">Manage staff members, roles, and department assignments</p>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setAddTeacherOpen(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Add Staff Member
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
                placeholder="Search staff by name, email, or department..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
              {localSearchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocalSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3">
              {/* Role Filter */}
              <select
                value={localRoleFilter}
                onChange={(e) => setLocalRoleFilter(e.target.value)}
                className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="">All Roles</option>
                <option value="TEACHER">Teachers</option>
                <option value="ACCOUNTANT">Accountants</option>
                <option value="SCHOOL_ADMIN">School Admins</option>
              </select>

              {/* Status Filter */}
              <select
                value={localStatusFilter}
                onChange={(e) => setLocalStatusFilter(e.target.value)}
                className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Department Filter */}
              <select
                value={localDepartmentFilter}
                onChange={(e) => setLocalDepartmentFilter(e.target.value)}
                className="w-40 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="">All Departments</option>
                <option value="Academic">Academic</option>
                <option value="Finance">Finance</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocalSearchTerm("")
                  setLocalRoleFilter("")
                  setLocalStatusFilter("")
                  setLocalDepartmentFilter("")
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
                  // Handle export with filtered data
                  const csv = [["Name", "Email", "Role", "Subject", "Department", "Status", "Join Date"],
                  ...filteredStaff.map(t => [t.name, t.email, t.role, t.subject, t.department, t.status, t.joinDate])]
                  const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `staff-export-${Date.now()}.csv`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast({
                    title: "Export Complete",
                    description: `Exported ${filteredStaff.length} staff members${filteredStaff.length !== teachers.length ? ' (filtered)' : ''}.`
                  })
                }}
                className="h-10 px-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(localSearchTerm || localRoleFilter || localStatusFilter || localDepartmentFilter) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                {localSearchTerm && (
                  <Badge variant="outline" className="text-xs h-6">
                    Search: "{localSearchTerm}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setLocalSearchTerm("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {localRoleFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Role: {localRoleFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setLocalRoleFilter("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {localStatusFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Status: {localStatusFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setLocalStatusFilter("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {localDepartmentFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Department: {localDepartmentFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setLocalDepartmentFilter("")}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Staff Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-100">Total Staff</p>
                  <p className="text-3xl font-bold text-white">{filteredStaff.length}</p>
                  <p className="text-xs text-blue-200">
                    {filteredStaff.length !== teachers.length ? 'Filtered results' : 'All staff members'}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Staff Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-100">Active Staff</p>
                  <p className="text-3xl font-bold text-white">{filteredStaff.filter(s => s.status === "Active").length}</p>
                  <p className="text-xs text-emerald-200">
                    {filteredStaff.length > 0 ? Math.round((filteredStaff.filter(s => s.status === "Active").length / filteredStaff.length) * 100) : 0}% active rate
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-100">Teachers</p>
                  <p className="text-3xl font-bold text-white">{filteredStaff.filter(s => s.role === "TEACHER").length}</p>
                  <p className="text-xs text-orange-200">
                    {filteredStaff.length > 0 ? Math.round((filteredStaff.filter(s => s.role === "TEACHER").length / filteredStaff.length) * 100) : 0}% of filtered staff
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New This Month Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-100">New This Month</p>
                  <p className="text-3xl font-bold text-white">{filteredStaff.filter(s => {
                    const joinDate = new Date(s.joinDate)
                    const now = new Date()
                    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
                  }).length}</p>
                  <p className="text-xs text-purple-200">
                    Recent hires in filtered results
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Showing {filteredStaff.length} of {teachers.length} staff members
              </span>
              {(localSearchTerm || localRoleFilter || localStatusFilter || localDepartmentFilter) && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Filtered
                </Badge>
              )}
            </div>
            {filteredStaff.length !== teachers.length && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocalSearchTerm("")
                  setLocalRoleFilter("")
                  setLocalStatusFilter("")
                  setLocalDepartmentFilter("")
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg shadow border">
          <EnhancedTable
            data={filteredStaff}
            columns={teacherColumns}
            title="Staff Members"
            description={`Showing ${filteredStaff.length} of ${teachers.length} staff members`}
            actions={teacherActions}
            bulkActions={[
              {
                key: "activate",
                label: "Activate Selected",
                icon: <UserCheck className="h-4 w-4" />,
                onClick: (items) => {
                  const ids = items.map(item => item.id)
                  ids.forEach(id => updateTeacherMutation.mutate({ id, data: { status: "Active" } }))
                  toast({ title: "Staff Activated", description: `${ids.length} staff members activated.` })
                }
              },
              {
                key: "delete",
                label: "Delete Selected",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: (items) => {
                  const ids = items.map(item => item.id)
                  handleDeleteTeachers(ids)
                  toast({ title: "Staff Deleted", description: `${ids.length} staff members deleted.` })
                },
                variant: "destructive"
              }
            ]}
            onAdd={undefined}
            onEdit={(item) => {
              setSelectedTeacher(item)
              setEditTeacherOpen(true)
            }}
            onDelete={handleDeleteTeachers}
            onExport={() => {
              const csv = [["Name", "Email", "Role", "Subject", "Department", "Status", "Join Date"],
              ...filteredStaff.map(t => [t.name, t.email, t.role, t.subject, t.department, t.status, t.joinDate])]
              const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `staff-export-${Date.now()}.csv`
              a.click()
              URL.revokeObjectURL(url)
              toast({ title: "Export Complete", description: "Staff data exported successfully." })
            }}
            searchPlaceholder="Search staff by name, email, or department..."
            searchKeys={["name", "email", "department", "subject"]}
            pageSize={15}
            pageSizeOptions={[10, 15, 25, 50]}
            showPagination={true}
            showSearch={false}
            showFilters={false}
            showBulkActions={true}
            showExport={false}
            onRowClick={(item) => handleTeacherAction(item, "view")}
            onSelectionChange={setSelectedItems}
            selectedIds={ui.selectedItems}
            sortable={true}
            sortKey="name"
            sortDirection="asc"
          />
        </div>
      </div>

      {/* Enhanced Add Staff Dialog */}
      <Dialog open={addTeacherOpen} onOpenChange={setAddTeacherOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Staff Member</DialogTitle>
            <DialogDescription>
              Enter the basic information for the new staff member. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="name"
                  label="Full Name *"
                  placeholder="Enter full name"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                <FormInput
                  id="email"
                  label="Email Address *"
                  type="email"
                  placeholder="staff@school.com"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
                <FormInput
                  id="phone"
                  label="Contact Number"
                  placeholder="+91 98765 43210"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm(f => ({ ...f, phone: e.target.value }))}
                />
                <FormSelect
                  id="role"
                  label="Staff Role *"
                  value={teacherForm.role}
                  onValueChange={(value) => setTeacherForm(f => ({ ...f, role: value }))}
                  options={[
                    { value: "TEACHER", label: "Teacher" },
                    { value: "ACCOUNTANT", label: "Accountant" },
                    { value: "SCHOOL_ADMIN", label: "School Admin" }
                  ]}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="qualification"
                  label="Qualification"
                  placeholder="e.g., Bachelor's Degree, Master's Degree"
                  value={teacherForm.qualification}
                  onChange={(e) => setTeacherForm(f => ({ ...f, qualification: e.target.value }))}
                />
                <div className="md:col-span-2">
                  <FormInput
                    id="address"
                    label="Address"
                    placeholder="Enter full address"
                    value={teacherForm.address}
                    onChange={(e) => setTeacherForm(f => ({ ...f, address: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setAddTeacherOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTeacherEnhanced}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!teacherForm.name || !teacherForm.email || !teacherForm.role}
            >
              Add Staff Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={editTeacherOpen} onOpenChange={setEditTeacherOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update the details for this staff member.
            </DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <AddUserForm
              initialData={teacherToUser(selectedTeacher)}
              onSubmit={(userData) => {
                const updatedTeacher = mergeUserToTeacher(userData, selectedTeacher)
                handleEditTeacher(updatedTeacher)
                setSelectedTeacher(null)
                setEditTeacherOpen(false)
                toast({ title: "Staff Updated", description: "Staff member has been updated successfully." })
              }}
              onCancel={() => {
                setSelectedTeacher(null)
                setEditTeacherOpen(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Drawer */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Staff Profile</SheetTitle>
            <SheetDescription>
              {selectedTeacher && selectedTeacher.name ? (
                <React.Fragment>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>{(selectedTeacher?.name ?? '').split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl font-bold">{selectedTeacher.name}</div>
                      <div className="text-muted-foreground">{selectedTeacher.email}</div>
                      <Badge className="mt-2">{selectedTeacher.role || 'Staff'}</Badge>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Status:</div>
                      <Badge>{selectedTeacher.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Date Joined:</div>
                      <div>{typeof selectedTeacher.joinDate === 'string' ? new Date(selectedTeacher.joinDate).toLocaleDateString() : "-"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Department:</div>
                      <div>{selectedTeacher.department}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Experience:</div>
                      <div>{selectedTeacher.experience} years</div>
                    </div>
                    {selectedTeacher.phone && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Phone:</div>
                        <div>{selectedTeacher.phone}</div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Qualification:</div>
                      <div>{selectedTeacher.qualification}</div>
                    </div>
                    {selectedTeacher.address && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Address:</div>
                        <div className="text-sm">{selectedTeacher.address}</div>
                      </div>
                    )}

                    {/* Teacher-specific information */}
                    {selectedTeacher.role === 'TEACHER' && (
                      <>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                          <div className="font-medium text-sm text-slate-700">Teaching Information</div>

                          {selectedTeacher.subjects && selectedTeacher.subjects.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-slate-600">Subjects:</div>
                              <div className="flex flex-wrap gap-1">
                                {selectedTeacher.subjects.map((subject, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {subject}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedTeacher.classes && selectedTeacher.classes.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-slate-600">Classes:</div>
                              <div className="flex flex-wrap gap-1">
                                {selectedTeacher.classes.map((classId, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    Class {classId}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedTeacher.isClassTeacher && selectedTeacher.assignedClass && (
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-slate-600">Class Teacher:</div>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Class {selectedTeacher.assignedClass}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <Separator className="my-4" />

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={() => window.open(`mailto:${selectedTeacher.email}`)}>
                      <Mail className="h-4 w-4 mr-1" />Email
                    </Button>
                    {selectedTeacher.phone ? (
                      <Button variant="outline" onClick={() => window.open(`tel:${selectedTeacher.phone}`)}>
                        <Phone className="h-4 w-4 mr-1" />Call
                      </Button>
                    ) : null}
                  </div>
                </React.Fragment>
              ) : null}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>


    </div>
  )
}
