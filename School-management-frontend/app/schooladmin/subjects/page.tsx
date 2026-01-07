"use client"

import * as React from "react"
import { BookOpen, Users, Award, Clock, AlertTriangle, Download, Upload, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, User, Building, UserPlus, Calendar, TrendingUp, Target, Users2, BookMarked, MapPin, GraduationCap, CheckCircle, Search, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedTable, TableColumn, TableFilter, TableAction } from "@/components/table/enhanced-table"
import { MOCK_SUBJECTS, MOCK_CLASSES } from "@/lib/constants"
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

type Subject = (typeof MOCK_SUBJECTS)[number]
type Class = (typeof MOCK_CLASSES)[number]

export default function SubjectManagementPage() {
  const { toast } = useToast()
  const [subjects, setSubjects] = React.useState<Subject[]>(MOCK_SUBJECTS)
  const [classes] = React.useState<Class[]>(MOCK_CLASSES)
  const [selectedSubject, setSelectedSubject] = React.useState<Subject | null>(null)
  const [subjectDialogOpen, setSubjectDialogOpen] = React.useState(false)
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")
  const [gradeFilter, setGradeFilter] = React.useState("all")
  const [teacherFilter, setTeacherFilter] = React.useState("all")
  const [addSubjectOpen, setAddSubjectOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [editSubjectOpen, setEditSubjectOpen] = React.useState(false)
  const [subjectForm, setSubjectForm] = React.useState({
    name: '',
    code: '',
    grade: '',
    teacher: '',
    credits: 0,
    description: '',
    classId: '',
    department: '',
    status: 'Active',
    academicYear: '2024-25',
    startDate: '',
    endDate: '',
    subjectCode: '',
    prerequisites: '',
    objectives: '',
  })

  // Subject Analytics
  const totalSubjects = subjects.length
  const activeSubjects = subjects.length // All subjects are considered active
  const totalCredits = subjects.reduce((sum, s) => sum + (s.credits || 0), 0)
  const uniqueGrades = Array.from(new Set(subjects.map(s => s.grade))).length
  const uniqueTeachers = Array.from(new Set(subjects.map(s => s.teacher))).length
  const averageCredits = subjects.length > 0 ? totalCredits / subjects.length : 0

  // Subject filter logic
  const filteredSubjects = subjects
    .filter(s => gradeFilter === "all" || s.grade === gradeFilter)
    .filter(s => teacherFilter === "all" || s.teacher === teacherFilter)
    .filter(s => {
      return s.name.toLowerCase().includes(search.toLowerCase()) || 
             s.code.toLowerCase().includes(search.toLowerCase()) ||
             s.teacher.toLowerCase().includes(search.toLowerCase())
    })

  // Add Subject Handler
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectForm.name || !subjectForm.code || !subjectForm.grade || !subjectForm.teacher || !subjectForm.credits) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' })
      return
    }
    
    const newSubject: Subject = {
      id: uuidv4(),
      name: subjectForm.name,
      code: subjectForm.code,
      grade: subjectForm.grade,
      teacher: subjectForm.teacher,
      credits: subjectForm.credits,
      description: subjectForm.description,
    }
    
    setSubjects(prev => [...prev, newSubject])
    setAddSubjectOpen(false)
    setSubjectForm({ 
      name: '', 
      code: '', 
      grade: '', 
      teacher: '', 
      credits: 0, 
      description: '',
      classId: '',
      department: '',
      status: 'Active',
      academicYear: '2024-25',
      startDate: '',
      endDate: '',
      subjectCode: '',
      prerequisites: '',
      objectives: '',
    })
    toast({ title: 'Subject Added', description: 'Subject has been created successfully.' })
  }

  const handleEditSubject = (subjectData: any) => {
    setSubjects(prev => prev.map(s => s.id === subjectData.id ? { ...s, ...subjectData } : s))
    setSelectedSubject(null)
    setEditSubjectOpen(false)
    toast({ title: 'Subject Updated', description: 'Subject has been updated successfully.' })
  }

  const handleDeleteSubjects = (ids: string[]) => {
    setSubjects(prev => prev.filter(s => !ids.includes(s.id)))
    setSelectedSubjectIds([])
    toast({ title: 'Subjects Deleted', description: `${ids.length} subject(s) have been deleted.` })
  }

  // Handle subject action
  const handleSubjectAction = (subject: Subject, action: string) => {
    switch (action) {
      case "view":
        setSelectedSubject(subject)
        setProfileOpen(true)
        break
      case "edit":
        setSelectedSubject(subject)
        setEditSubjectOpen(true)
        break
    }
  }

  // Enhanced Table columns for subjects
  const subjectColumns: TableColumn<Subject>[] = [
    {
      key: "name",
      header: "Subject",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-purple-100">
            <AvatarFallback className="text-purple-600 font-semibold">
              {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
            <div className="text-xs text-slate-500">{item.code}</div>
          </div>
        </div>
      )
    },
    {
      key: "teacher",
      header: "Teacher",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{item.teacher}</span>
        </div>
      )
    },
    {
      key: "grade",
      header: "Grade",
      sortable: true,
      cell: (item) => (
        <div className="text-center">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <Award className="h-3 w-3 mr-1" />
            Grade {item.grade}
          </Badge>
        </div>
      )
    },
    {
      key: "credits",
      header: "Credits",
      sortable: true,
      cell: (item) => (
        <div className="text-center">
          <div className="font-bold text-slate-900">{item.credits}</div>
          <div className="text-xs text-slate-500">Credit Hours</div>
        </div>
      )
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
      cell: (item) => (
        <div className="text-sm text-slate-500 max-w-[200px] truncate">
          {item.description || "No description available"}
        </div>
      )
    }
  ]

  // Table filters
  const subjectFilters: TableFilter[] = [
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
      key: "teacher",
      type: "select",
      label: "Teacher",
      options: Array.from(new Set(subjects.map(s => s.teacher))).map(t => ({ value: t, label: t }))
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
  const subjectActions: TableAction<Subject>[] = [
    {
      key: "view",
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item) => handleSubjectAction(item, "view")
    },
    {
      key: "edit",
      label: "Edit Subject",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item) => handleSubjectAction(item, "edit")
    },

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
              <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
              <p className="text-gray-600">Manage subjects, curriculum, and teacher assignments across your school</p>
            </div>
            
            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setAddSubjectOpen(true)}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Add New Subject
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
                placeholder="Search subjects by name, code, or teacher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-gray-50 rounded-md focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors"
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
                className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors"
              >
                <option value="all">All Grades</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
              
              {/* Teacher Filter */}
              <select 
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="w-40 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors"
              >
                <option value="all">All Teachers</option>
                {Array.from(new Set(subjects.map(s => s.teacher))).map(teacher => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
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
                  setTeacherFilter("all")
                }}
                className="h-10 px-4 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              

            </div>
          </div>
          
          {/* Active Filter Indicators */}
          {(search || gradeFilter !== "all" || teacherFilter !== "all") && (
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
                {teacherFilter !== "all" && (
                  <Badge variant="outline" className="text-xs h-6">
                    Teacher: {teacherFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setTeacherFilter("all")}
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
          {/* Total Subjects Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-100">Total Subjects</p>
                  <p className="text-3xl font-bold text-white">{totalSubjects}</p>
                  <p className="text-xs text-purple-200">Active curriculum</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Subjects Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-100">Active Subjects</p>
                  <p className="text-3xl font-bold text-white">{activeSubjects}</p>
                  <p className="text-xs text-emerald-200">Currently offered</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Credits Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-100">Total Credits</p>
                  <p className="text-3xl font-bold text-white">{totalCredits}</p>
                  <p className="text-xs text-blue-200">Credit hours</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grade Levels Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-100">Grade Levels</p>
                  <p className="text-3xl font-bold text-white">{uniqueGrades}</p>
                  <p className="text-xs text-orange-200">Different grades</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                  <p className="text-sm font-medium text-teal-100">Teachers</p>
                  <p className="text-3xl font-bold text-white">{uniqueTeachers}</p>
                  <p className="text-xs text-teal-200">Assigned teachers</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
              </div>
              </div>
          </CardContent>
        </Card>

          {/* Average Credits Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                  <p className="text-sm font-medium text-indigo-100">Avg Credits</p>
                  <p className="text-3xl font-bold text-white">{averageCredits.toFixed(1)}</p>
                  <p className="text-xs text-indigo-200">Per subject</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
              </div>
              </div>
          </CardContent>
        </Card>
          </div>

      {/* Enhanced Subject Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <EnhancedTable
          data={filteredSubjects}
          columns={subjectColumns}
          title="Subject Records"
          description=""
          actions={subjectActions}
          bulkActions={[]}
          onAdd={undefined}
          onEdit={(item) => {
            setSelectedSubject(item)
            setEditSubjectOpen(true)
          }}
          onDelete={handleDeleteSubjects}
          onExport={() => {
            const csv = [["Subject", "Code", "Teacher", "Grade", "Credits"], 
              ...filteredSubjects.map(s => [s.name, s.code, s.teacher, s.grade, s.credits.toString()])]
            const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `subjects-export-${Date.now()}.csv`
            a.click()
            URL.revokeObjectURL(url)
          }}
          pageSize={15}
          pageSizeOptions={[10, 15, 25, 50, 100]}
          showPagination={true}
          showSearch={false}
          showFilters={false}
          showBulkActions={true}
          showExport={true}
          onRowClick={(item) => handleSubjectAction(item, "view")}
          onSelectionChange={setSelectedSubjectIds}
          selectedIds={selectedSubjectIds}
          sortable={true}
          sortKey="name"
          sortDirection="asc"
          loading={false}
          emptyState={
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No subjects found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
              <Button onClick={() => setAddSubjectOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Subject
            </Button>
            </div>
          }
        />
      </div>

      {/* Enhanced Add Subject Dialog */}
      <Dialog open={addSubjectOpen} onOpenChange={setAddSubjectOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {/* Fixed Header */}
          <DialogHeader className="px-0 py-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-900">Add New Subject</DialogTitle>
                <DialogDescription className="text-base text-slate-600 mt-1">
                  Create a comprehensive subject profile with curriculum details and teacher assignments.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {/* Scrollable Form Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6">
            <form id="add-subject-form" onSubmit={handleAddSubject} className="py-6 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Subject Information */}
              <div className="space-y-8">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Basic Subject Information</h3>
                      <p className="text-sm text-slate-600">Essential details for subject identification</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <FormInput
                      id="name"
                      label="Subject Name"
                      value={subjectForm.name}
                      onChange={e => setSubjectForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g., Advanced Mathematics"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        id="code"
                        label="Subject Code"
                        value={subjectForm.code}
                        onChange={e => setSubjectForm(f => ({ ...f, code: e.target.value }))}
                        placeholder="e.g., MATH101"
                        required
                      />
                      <FormSelect
                        id="grade"
                        label="Grade Level"
                        value={subjectForm.grade}
                        onValueChange={v => setSubjectForm(f => ({ ...f, grade: v }))}
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
                      <FormInput
                        id="credits"
                        label="Credit Hours"
                        type="number"
                        value={subjectForm.credits}
                        onChange={e => setSubjectForm(f => ({ ...f, credits: Number(e.target.value) }))}
                        placeholder="3"
                        min="1"
                        max="10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Details */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                        <Users className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Academic Details</h3>
                      <p className="text-sm text-slate-600">Teacher assignment and department</p>
          </div>
        </div>
                  <div className="space-y-4">
                    <FormInput
                      id="teacher"
                      label="Assigned Teacher"
                      value={subjectForm.teacher}
                      onChange={e => setSubjectForm(f => ({ ...f, teacher: e.target.value }))}
                      placeholder="e.g., Mr. John Doe"
                      required
                    />
          <FormSelect
                      id="department"
                      label="Department"
                      value={subjectForm.department}
                      onValueChange={v => setSubjectForm(f => ({ ...f, department: v }))}
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
          />
          <FormSelect
                      id="classId"
                      label="Assigned Class"
                      value={subjectForm.classId}
                      onValueChange={v => setSubjectForm(f => ({ ...f, classId: v }))}
                      options={classes.map(c => ({ value: c.id, label: c.name }))}
                    />
                  </div>
                </div>
              </div>

              {/* Curriculum & Additional Information */}
              <div className="space-y-8">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Academic Schedule</h3>
                      <p className="text-sm text-slate-600">Subject timeline and academic year</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <FormInput
                      id="academicYear"
                      label="Academic Year"
                      value={subjectForm.academicYear || "2024-25"}
                      onChange={e => setSubjectForm(f => ({ ...f, academicYear: e.target.value }))}
                      placeholder="e.g., 2024-25"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        id="startDate"
                        label="Start Date"
                        type="date"
                        value={subjectForm.startDate || ""}
                        onChange={e => setSubjectForm(f => ({ ...f, startDate: e.target.value }))}
          />
          <FormInput
                        id="endDate"
                        label="End Date"
                        type="date"
                        value={subjectForm.endDate || ""}
                        onChange={e => setSubjectForm(f => ({ ...f, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                        <BookMarked className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Curriculum Details</h3>
                      <p className="text-sm text-slate-600">Subject description and requirements</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <FormInput
                      id="subjectCode"
                      label="Internal Code"
                      value={subjectForm.subjectCode || ""}
                      onChange={e => setSubjectForm(f => ({ ...f, subjectCode: e.target.value }))}
                      placeholder="e.g., SUB101"
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subject Description
                      </label>
                      <Textarea
                        placeholder="Enter a detailed description of the subject, learning objectives, and course content..."
                        className="min-h-[80px] resize-none"
                        value={subjectForm.description || ""}
                        onChange={e => setSubjectForm(f => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prerequisites
                      </label>
                      <Textarea
                        placeholder="Any prerequisites or required knowledge for this subject..."
                        className="min-h-[60px] resize-none"
                        value={subjectForm.prerequisites || ""}
                        onChange={e => setSubjectForm(f => ({ ...f, prerequisites: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Learning Objectives
                      </label>
                      <Textarea
                        placeholder="Key learning objectives and expected outcomes..."
                        className="min-h-[60px] resize-none"
                        value={subjectForm.objectives || ""}
                        onChange={e => setSubjectForm(f => ({ ...f, objectives: e.target.value }))}
                      />
                    </div>
        </div>
        </div>
        </div>
              </div>
            </form>
          </div>

          {/* Fixed Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4">
            <DialogFooter className="flex gap-3">
              <Button variant="outline" type="button" onClick={() => setAddSubjectOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="add-subject-form" className="bg-purple-600 hover:bg-purple-700">
                Create Subject
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={editSubjectOpen} onOpenChange={setEditSubjectOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {/* Fixed Header */}
          <DialogHeader className="px-0 py-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-900">Edit Subject</DialogTitle>
                <DialogDescription className="text-base text-slate-600 mt-1">
                  Update the subject profile with curriculum details and teacher assignments.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {/* Scrollable Form Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6">
          {selectedSubject && (
              <form id="edit-subject-form" onSubmit={(e) => {
              e.preventDefault()
              handleEditSubject({
                ...selectedSubject,
                name: subjectForm.name || selectedSubject.name,
                code: subjectForm.code || selectedSubject.code,
                grade: subjectForm.grade || selectedSubject.grade,
                teacher: subjectForm.teacher || selectedSubject.teacher,
                credits: subjectForm.credits || selectedSubject.credits,
                description: subjectForm.description || selectedSubject.description,
                })
              }} className="py-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Subject Information */}
                  <div className="space-y-8">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Basic Subject Information</h3>
                          <p className="text-sm text-slate-600">Essential details for subject identification</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                <FormInput
                  id="name"
                  label="Subject Name"
                  value={subjectForm.name || selectedSubject.name}
                  onChange={e => setSubjectForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="e.g., Advanced Mathematics"
                  required
                />
                        <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="code"
                  label="Subject Code"
                  value={subjectForm.code || selectedSubject.code}
                  onChange={e => setSubjectForm(f => ({ ...f, code: e.target.value }))}
                            placeholder="e.g., MATH101"
                  required
                />
                <FormSelect
                  id="grade"
                  label="Grade Level"
                  value={subjectForm.grade || selectedSubject.grade}
                  onValueChange={v => setSubjectForm(f => ({ ...f, grade: v }))}
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
                <FormInput
                  id="credits"
                  label="Credit Hours"
                  type="number"
                  value={subjectForm.credits || selectedSubject.credits}
                  onChange={e => setSubjectForm(f => ({ ...f, credits: Number(e.target.value) }))}
                            placeholder="3"
                            min="1"
                            max="10"
                  required
                />
              </div>
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                          <Users className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Academic Details</h3>
                          <p className="text-sm text-slate-600">Teacher assignment and department</p>
                        </div>
                      </div>
                      <div className="space-y-4">
              <FormInput
                id="teacher"
                label="Assigned Teacher"
                value={subjectForm.teacher || selectedSubject.teacher}
                onChange={e => setSubjectForm(f => ({ ...f, teacher: e.target.value }))}
                          placeholder="e.g., Mr. John Doe"
                required
              />
              <FormSelect
                          id="department"
                          label="Department"
                          value={subjectForm.department || ""}
                          onValueChange={v => setSubjectForm(f => ({ ...f, department: v }))}
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
                        />
                        <FormSelect
                          id="classId"
                          label="Assigned Class"
                          value={subjectForm.classId || ""}
                          onValueChange={v => setSubjectForm(f => ({ ...f, classId: v }))}
                          options={classes.map(c => ({ value: c.id, label: c.name }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Curriculum & Additional Information */}
                  <div className="space-y-8">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Academic Schedule</h3>
                          <p className="text-sm text-slate-600">Subject timeline and academic year</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <FormInput
                          id="academicYear"
                          label="Academic Year"
                          value={subjectForm.academicYear || "2024-25"}
                          onChange={e => setSubjectForm(f => ({ ...f, academicYear: e.target.value }))}
                          placeholder="e.g., 2024-25"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput
                            id="startDate"
                            label="Start Date"
                            type="date"
                            value={subjectForm.startDate || ""}
                            onChange={e => setSubjectForm(f => ({ ...f, startDate: e.target.value }))}
                          />
                          <FormInput
                            id="endDate"
                            label="End Date"
                            type="date"
                            value={subjectForm.endDate || ""}
                            onChange={e => setSubjectForm(f => ({ ...f, endDate: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                          <BookMarked className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Curriculum Details</h3>
                          <p className="text-sm text-slate-600">Subject description and requirements</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <FormInput
                          id="subjectCode"
                          label="Internal Code"
                          value={subjectForm.subjectCode || ""}
                          onChange={e => setSubjectForm(f => ({ ...f, subjectCode: e.target.value }))}
                          placeholder="e.g., SUB101"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                            Subject Description
                </label>
                <Textarea
                            placeholder="Enter a detailed description of the subject, learning objectives, and course content..."
                  className="min-h-[80px] resize-none"
                            value={subjectForm.description || selectedSubject.description || ""}
                            onChange={e => setSubjectForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Prerequisites
                          </label>
                          <Textarea
                            placeholder="Any prerequisites or required knowledge for this subject..."
                            className="min-h-[60px] resize-none"
                            value={subjectForm.prerequisites || ""}
                            onChange={e => setSubjectForm(f => ({ ...f, prerequisites: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Learning Objectives
                          </label>
                          <Textarea
                            placeholder="Key learning objectives and expected outcomes..."
                            className="min-h-[60px] resize-none"
                            value={subjectForm.objectives || ""}
                            onChange={e => setSubjectForm(f => ({ ...f, objectives: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4">
            <DialogFooter className="flex gap-3">
                <Button variant="outline" type="button" onClick={() => {
                  setSelectedSubject(null)
                  setEditSubjectOpen(false)
              }}>
                Cancel
              </Button>
              <Button type="submit" form="edit-subject-form" className="bg-purple-600 hover:bg-purple-700">
                Update Subject
              </Button>
              </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subject Detail Sheet */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Subject Details</SheetTitle>
            <SheetDescription>
              {selectedSubject && (
                <React.Fragment>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 bg-purple-100">
                      <AvatarFallback className="text-purple-600 font-semibold text-lg">
                        {selectedSubject.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl font-bold">{selectedSubject.name}</div>
                      <div className="text-muted-foreground">{selectedSubject.code}</div>
                      <Badge className="mt-2">Active</Badge>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Teacher:</div>
                      <div className="font-semibold">{selectedSubject.teacher}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Grade:</div>
                      <div>Grade {selectedSubject.grade}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Credits:</div>
                      <div>{selectedSubject.credits} hours</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Department:</div>
                      <div>General</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Status:</div>
                      <Badge>Active</Badge>
                    </div>
                    {selectedSubject.description && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Description:</div>
                        <div className="text-sm">{selectedSubject.description}</div>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4" />

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={() => {
                      setSelectedSubject(selectedSubject)
                      setEditSubjectOpen(true)
                      setProfileOpen(false)
                    }}>
                      <Edit className="h-4 w-4 mr-1" />Edit
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`mailto:${selectedSubject.teacher}`)}>
                      <Mail className="h-4 w-4 mr-1" />Contact Teacher
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
    </div>
  )
}