"use client"

import * as React from "react"
import { ClipboardList, Award, Clock, AlertTriangle, Download, Eye, Edit, Trash2, Calendar, Target, GraduationCap, CheckCircle, FileText, Search, RefreshCw, X, UserPlus, Mail, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedTable, TableColumn, TableAction } from "@/components/table/enhanced-table"
import { MOCK_EXAMS, MOCK_CLASSES, MOCK_SUBJECTS } from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { FormSelect } from "@/components/forms/form-select"
import { FormInput } from "@/components/forms/form-input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid'

type Exam = (typeof MOCK_EXAMS)[number]
type Class = (typeof MOCK_CLASSES)[number]
type Subject = (typeof MOCK_SUBJECTS)[number]

export default function ExamManagementPage() {
  // Custom scrollbar styles for better table experience
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        height: 12px;
        width: 12px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f8fafc;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #f59e0b, #f97316);
        border-radius: 6px;
        border: 1px solid #fbbf24;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #d97706, #ea580c);
      }
      .custom-scrollbar::-webkit-scrollbar-corner {
        background: #f8fafc;
      }
      
      /* Ensure form select dropdowns are properly visible */
      .form-select-dropdown {
        min-width: 200px !important;
        max-width: 300px !important;
      }
      
      .form-select-dropdown .form-select-trigger {
        min-height: 40px !important;
        padding: 8px 12px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      
      .form-select-dropdown .form-select-content {
        min-width: 200px !important;
        max-width: 300px !important;
      }
      
      .form-select-dropdown .form-select-item {
        padding: 8px 12px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      
      /* Ensure table content stays within bounds */
      .exam-table-container {
        overflow-x: auto;
        overflow-y: hidden;
      }
      
      .exam-table-container table {
        min-width: 100%;
        table-layout: fixed;
      }
      
      .exam-table-container th,
      .exam-table-container td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const { toast } = useToast()
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [exams, setExams] = React.useState<Exam[]>(MOCK_EXAMS)
  const [classes] = React.useState<Class[]>(MOCK_CLASSES)
  const [subjects] = React.useState<Subject[]>(MOCK_SUBJECTS)
  const [selectedExam, setSelectedExam] = React.useState<Exam | null>(null)
  const [examDialogOpen, setExamDialogOpen] = React.useState(false)

  const [search, setSearch] = React.useState("")
  const [classFilter, setClassFilter] = React.useState("")
  const [subjectFilter, setSubjectFilter] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("")
  const [examTypeFilter, setExamTypeFilter] = React.useState("")
  const [academicYearFilter, setAcademicYearFilter] = React.useState("")
  const [addExamOpen, setAddExamOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [editExamOpen, setEditExamOpen] = React.useState(false)
  const [examForm, setExamForm] = React.useState({
    name: '',
    class: '',
    subject: '',
    date: '',
    maxMarks: 0,
    duration: '',
    status: 'Planning',
    examType: 'Regular',
    academicYear: '2024-25',
    term: 'Term 1',
    startTime: '',
    endTime: '',
    room: '',
    instructions: '',
    passingMarks: 0,
    totalQuestions: 0,
    examCode: '',
    invigilator: '',
  })

  // Exam filter logic - updated to work with custom filters
  const filteredExams = React.useMemo(() => {
    return exams.filter(e => {
      // Search filter
      const matchesSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.class.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        (e.examCode && e.examCode.toLowerCase().includes(search.toLowerCase())) ||
        (e.invigilator && e.invigilator.toLowerCase().includes(search.toLowerCase())) ||
        (e.examType && e.examType.toLowerCase().includes(search.toLowerCase())) ||
        (e.academicYear && e.academicYear.toLowerCase().includes(search.toLowerCase()))

      // Class filter
      const matchesClass = !classFilter || e.class === classFilter

      // Subject filter
      const matchesSubject = !subjectFilter || e.subject === subjectFilter

      // Status filter
      const matchesStatus = !statusFilter || e.status === statusFilter

      // Exam type filter
      const matchesExamType = !examTypeFilter || e.examType === examTypeFilter

      // Academic year filter
      const matchesAcademicYear = !academicYearFilter || e.academicYear === academicYearFilter

      return matchesSearch && matchesClass && matchesSubject && matchesStatus && matchesExamType && matchesAcademicYear
    })
  }, [exams, search, classFilter, subjectFilter, statusFilter, examTypeFilter, academicYearFilter])

  // Exam Analytics - Updated to use filtered results for dynamic updates
  const totalExams = filteredExams.length
  const planningExams = filteredExams.filter(e => e.status === "Planning").length
  const scheduledExams = filteredExams.filter(e => e.status === "Scheduled").length
  const completedExams = filteredExams.filter(e => e.status === "Completed").length
  const cancelledExams = filteredExams.filter(e => e.status === "Cancelled").length
  const totalMarks = filteredExams.reduce((sum, e) => sum + (e.maxMarks || 0), 0)
  const uniqueClasses = Array.from(new Set(filteredExams.map(e => e.class))).length
  const uniqueSubjects = Array.from(new Set(filteredExams.map(e => e.subject))).length
  const averageMarks = filteredExams.length > 0 ? totalMarks / filteredExams.length : 0

  // Add Exam Handler
  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!examForm.name || !examForm.class || !examForm.subject || !examForm.date || !examForm.maxMarks) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' })
      return
    }

    const newExam: Exam = {
      id: uuidv4(),
      name: examForm.name,
      class: examForm.class,
      subject: examForm.subject,
      date: examForm.date,
      maxMarks: examForm.maxMarks,
      duration: examForm.duration,
      status: examForm.status as "Scheduled" | "Completed" | "Cancelled",
      examType: examForm.examType,
      academicYear: examForm.academicYear,
      term: examForm.term,
      startTime: examForm.startTime,
      endTime: examForm.endTime,
      room: examForm.room,
      instructions: examForm.instructions,
      passingMarks: examForm.passingMarks,
      totalQuestions: examForm.totalQuestions,
      examCode: examForm.examCode,
      invigilator: examForm.invigilator,
      year: examForm.academicYear,
    }

    setExams(prev => [...prev, newExam])
    setAddExamOpen(false)
    setExamForm({
      name: '',
      class: '',
      subject: '',
      date: '',
      maxMarks: 0,
      duration: '',
      status: 'Planning',
      examType: 'Regular',
      academicYear: '2024-25',
      term: 'Term 1',
      startTime: '',
      endTime: '',
      room: '',
      instructions: '',
      passingMarks: 0,
      totalQuestions: 0,
      examCode: '',
      invigilator: '',
    })
    toast({ title: 'Exam Added', description: 'Exam has been created successfully.' })
  }

  const handleEditExam = (examData: any) => {
    setExams(prev => prev.map(e => e.id === examData.id ? { ...e, ...examData } : e))
    setSelectedExam(null)
    setEditExamOpen(false)
    toast({ title: 'Exam Updated', description: 'Exam has been updated successfully.' })
  }

  const handleDeleteExams = (ids: string[]) => {
    setExams(prev => prev.filter(e => !ids.includes(e.id)))

    toast({ title: 'Exams Deleted', description: `${ids.length} exam(s) have been deleted.` })
  }

  // Handle exam action
  const handleExamAction = (exam: Exam, action: string) => {
    switch (action) {
      case "view":
        setSelectedExam(exam)
        setProfileOpen(true)
        break
      case "edit":
        setSelectedExam(exam)
        // Populate form with exam data
        setExamForm({
          name: exam.name || '',
          class: exam.class || '',
          subject: exam.subject || '',
          date: exam.date || '',
          maxMarks: exam.maxMarks || 0,
          duration: exam.duration || '',
          status: exam.status || 'Planning',
          examType: exam.examType || 'Regular',
          academicYear: exam.academicYear || '2024-25',
          term: exam.term || 'Term 1',
          startTime: exam.startTime || '',
          endTime: exam.endTime || '',
          room: exam.room || '',
          instructions: exam.instructions || '',
          passingMarks: exam.passingMarks || 0,
          totalQuestions: exam.totalQuestions || 0,
          examCode: exam.examCode || '',
          invigilator: exam.invigilator || '',
        })
        setEditExamOpen(true)
        break
      case "delete":
        handleDeleteExams([exam.id])
        break
    }
  }

  // Enhanced Table columns for exams - More Focused and Professional
  const examColumns: TableColumn<Exam>[] = [
    {
      key: "name",
      header: "Exam Details",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-3 py-2 w-96">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm flex-shrink-0">
            <AvatarFallback className="text-white font-bold text-sm">
              {item.name.split(' ').map((n, index) => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-900 text-sm truncate">{item.name}</div>
            <div className="text-xs text-slate-500 font-mono truncate">{item.examCode || item.id}</div>
          </div>
        </div>
      )
    },
    {
      key: "class",
      header: "Class",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-2 py-2 w-32">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg flex-shrink-0">
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-slate-700 truncate">{item.class}</span>
        </div>
      )
    },
    {
      key: "subject",
      header: "Subject",
      sortable: true,
      cell: (item) => (
        <div className="flex justify-center py-2 w-28">
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-sm px-2 py-1 text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            <span className="truncate">{item.subject}</span>
          </Badge>
        </div>
      )
    },
    {
      key: "date",
      header: "Date & Time",
      sortable: true,
      cell: (item) => (
        <div className="text-center py-2 w-36">
          <div className="font-bold text-slate-900 text-sm">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full inline-block truncate">
            {item.startTime || "TBD"}
          </div>
        </div>
      )
    },
    {
      key: "maxMarks",
      header: "Marks",
      sortable: true,
      cell: (item) => (
        <div className="text-center py-2 w-24">
          <div className="font-bold text-slate-900 text-lg">{item.maxMarks}</div>
          <div className="text-xs text-slate-500 bg-emerald-50 px-2 py-1 rounded-full">Max</div>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (item) => {
        const statusConfig = {
          "Planning": { bg: "bg-gradient-to-r from-amber-500 to-orange-500", text: "text-white", border: "border-0" },
          "Scheduled": { bg: "bg-gradient-to-r from-blue-500 to-blue-600", text: "text-white", border: "border-0" },
          "Completed": { bg: "bg-gradient-to-r from-emerald-500 to-green-500", text: "text-white", border: "border-0" },
          "Cancelled": { bg: "bg-gradient-to-r from-red-500 to-rose-500", text: "text-white", border: "border-0" }
        }
        const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig["Scheduled"]
        return (
          <div className="flex justify-center py-2 w-28">
            <Badge className={`${config.bg} ${config.text} ${config.border} shadow-sm px-2 py-1 font-medium text-xs`}>
              {item.status || "Scheduled"}
            </Badge>
          </div>
        )
      }
    }
  ]

  // Table filters - removed as we're using custom filter section

  // Table actions
  const examActions: TableAction<Exam>[] = [
    {
      key: "view",
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item) => handleExamAction(item, "view")
    },
    {
      key: "edit",
      label: "Edit Exam",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item) => handleExamAction(item, "edit")
    },
    {
      key: "delete",
      label: "Delete Exam",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item) => handleExamAction(item, "delete"),
      variant: "destructive"
    }
  ]

  return (
    <div className="w-full max-w-none space-y-6 p-6 overflow-hidden min-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Management</h1>
          <p className="text-base text-muted-foreground mt-1">Manage exams, schedules, and academic assessments across your school</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("Planning")
              setSearch("")
              setClassFilter("")
              setSubjectFilter("")
              setExamTypeFilter("")
              setAcademicYearFilter("")
              toast({ title: "Quick Filter", description: "Showing exams in planning phase" })
              tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            size="lg"
          >
            <Target className="mr-2 h-5 w-5" />
            Planning Exams
          </Button>
          <Button
            onClick={() => setAddExamOpen(true)}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Schedule New Exam
          </Button>
        </div>
      </div>

      {/* Custom Filter Section - Positioned above analytics for better focus */}
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-6 w-full max-w-none min-w-full">

        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exams by name, code, class, subject, invigilator, type, or year..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-10 bg-gray-50 rounded-md focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3">
            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
            >
              <option value="">All Classes</option>
              {Array.from(new Set(exams.map(e => e.class).filter(Boolean))).sort().map(c => (
                <option key={c || 'unknown'} value={c}>{c}</option>
              ))}
            </select>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
            >
              <option value="">All Subjects</option>
              {Array.from(new Set(exams.map(e => e.subject).filter(Boolean))).sort().map(s => (
                <option key={s || 'unknown'} value={s}>{s}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
            >
              <option value="">All Status</option>
              <option value="Planning">Planning</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Exam Type Filter */}
            <select
              value={examTypeFilter}
              onChange={(e) => setExamTypeFilter(e.target.value)}
              className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
            >
              <option value="">All Types</option>
              {Array.from(new Set(exams.map(e => e.examType).filter(Boolean))).sort().map(t => (
                <option key={t || 'unknown'} value={t}>{t}</option>
              ))}
            </select>

            {/* Academic Year Filter */}
            <select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
              className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
            >
              <option value="">All Years</option>
              {Array.from(new Set(exams.map(e => e.academicYear).filter(Boolean))).sort().map(y => (
                <option key={y || 'unknown'} value={y}>{y}</option>
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
                setClassFilter("")
                setSubjectFilter("")
                setStatusFilter("")
                setExamTypeFilter("")
                setAcademicYearFilter("")
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
                const csv = [
                  ["Exam Name", "Exam Code", "Class", "Subject", "Date", "Start Time", "Max Marks", "Duration", "Status", "Room", "Invigilator", "Exam Type", "Academic Year", "Term"],
                  ...filteredExams.map(e => [
                    e.name,
                    e.examCode || "",
                    e.class,
                    e.subject,
                    e.date,
                    e.startTime || "",
                    e.maxMarks.toString(),
                    e.duration,
                    e.status || "Scheduled",
                    e.room || "",
                    e.invigilator || "",
                    e.examType || "",
                    e.academicYear || "",
                    e.term || ""
                  ])
                ]
                const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `exams-${Date.now()}.csv`
                a.click()
                URL.revokeObjectURL(url)
                toast({ title: "Export Successful", description: `${filteredExams.length} exams exported to CSV.` })
              }}
              className="h-10 px-4"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(search || classFilter || subjectFilter || statusFilter || examTypeFilter || academicYearFilter) && (
          <div className="mt-6 pt-4 border-t border-gray-100">
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
              {classFilter && (
                <Badge variant="outline" className="text-xs h-6">
                  Class: {classFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                    onClick={() => setClassFilter("")}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {subjectFilter && (
                <Badge variant="outline" className="text-xs h-6">
                  Subject: {subjectFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                    onClick={() => setSubjectFilter("")}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="outline" className="text-xs h-6">
                  Status: {statusFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                    onClick={() => setStatusFilter("")}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {examTypeFilter && (
                <Badge variant="outline" className="text-xs h-6">
                  Type: {examTypeFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                    onClick={() => setExamTypeFilter("")}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {academicYearFilter && (
                <Badge variant="outline" className="text-xs h-6">
                  Year: {academicYearFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                    onClick={() => setAcademicYearFilter("")}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Essential Exam Analytics - Focused & Necessary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-none min-w-full">
        <Card
          className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group"
          onClick={() => {
            setStatusFilter("all")
            setSearch("")
            toast({ title: "Viewing All Exams", description: "Showing all exam records" })
            tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-100 mb-2">Total Exams</p>
                <p className="text-3xl font-bold text-white mb-2">{totalExams}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-orange-100">
                    {totalExams === exams.length ? 'All exams' : `${totalExams} of ${exams.length} exams`}
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                <ClipboardList className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-orange-400"></div>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group"
          onClick={() => {
            setStatusFilter("Planning")
            setSearch("")
            toast({ title: "Planning Exams", description: `Showing ${planningExams} exams in planning phase` })
            tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-100 mb-2">Planning</p>
                <p className="text-3xl font-bold text-white mb-2">{planningExams}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-amber-100">In planning phase</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                <Target className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-400"></div>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group"
          onClick={() => {
            setStatusFilter("Scheduled")
            setSearch("")
            toast({ title: "Scheduled Exams", description: `Showing ${scheduledExams} upcoming exams` })
            tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-100 mb-2">Scheduled</p>
                <p className="text-3xl font-bold text-white mb-2">{scheduledExams}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-blue-100">Upcoming exams</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                <Calendar className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
          </CardContent>
        </Card>








      </div>

      {/* Full Width Exam Table - Properly Contained */}
      <div className="mt-6 mb-4 w-full">
        <div ref={tableRef} className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-full">


          {/* Table Content - Properly Contained */}
          <div className="p-6 w-full exam-table-container">
            <EnhancedTable
              data={filteredExams}
              columns={examColumns}
              actions={examActions}
              onAdd={undefined}
              onEdit={(item) => {
                setSelectedExam(item)
                setEditExamOpen(true)
              }}
              onDelete={handleDeleteExams}
              pageSize={15}
              pageSizeOptions={[10, 15, 25, 50]}
              showPagination={true}
              showSearch={false}
              showFilters={false}
              showBulkActions={false}
              showExport={false}
              showSerialNumbers={true}
              onRowClick={(item) => handleExamAction(item, "view")}
              sortable={true}
              sortKey="date"
              sortDirection="desc"
              loading={false}
              emptyState={
                <div className="text-center py-16">
                  <ClipboardList className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-3">No exams found</h3>
                  <p className="text-slate-500 mb-6 text-lg">Try adjusting your search or filter criteria above</p>
                  <Button onClick={() => setAddExamOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Schedule First Exam
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Simple Add Exam Dialog */}
      <Dialog open={addExamOpen} onOpenChange={setAddExamOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="sticky top-0 z-10 bg-white border-b border-slate-200 px-0 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-900">Schedule New Exam</DialogTitle>
                <DialogDescription className="text-sm text-slate-600 mt-1">
                  Create a new exam schedule with essential details.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={handleAddExam} className="py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
                    </div>
                    <div className="space-y-5">
                      <FormInput
                        id="name"
                        label="Exam Name"
                        value={examForm.name}
                        onChange={e => setExamForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g., Mid-Term Mathematics"
                        required
                      />
                      <div className="grid grid-cols-2 gap-5">
                        <FormInput
                          id="examCode"
                          label="Exam Code"
                          value={examForm.examCode}
                          onChange={e => setExamForm(f => ({ ...f, examCode: e.target.value }))}
                          placeholder="e.g., MATH101-MT"
                        />
                        <FormSelect
                          id="examType"
                          label="Exam Type"
                          value={examForm.examType}
                          onValueChange={v => setExamForm(f => ({ ...f, examType: v }))}
                          options={[
                            { value: "Regular", label: "Regular" },
                            { value: "Mid-Term", label: "Mid-Term" },
                            { value: "Final", label: "Final" },
                            { value: "Quiz", label: "Quiz" },
                            { value: "Assignment", label: "Assignment" }
                          ]}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <FormSelect
                          id="class"
                          label="Class"
                          value={examForm.class}
                          onValueChange={v => setExamForm(f => ({ ...f, class: v }))}
                          options={classes.map(c => ({ value: c.name, label: c.name, key: c.name || 'unknown' }))}
                          required
                        />
                        <FormSelect
                          id="subject"
                          label="Subject"
                          value={examForm.subject}
                          onValueChange={v => setExamForm(f => ({ ...f, subject: v }))}
                          options={Array.from(new Set(subjects.map(s => s.name).filter(Boolean))).sort().map(subjectName => ({
                            value: subjectName,
                            label: subjectName,
                            key: subjectName
                          }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Details Section */}
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-slate-800">Academic Details</h3>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <FormInput
                          id="maxMarks"
                          label="Maximum Marks"
                          type="number"
                          value={examForm.maxMarks}
                          onChange={e => setExamForm(f => ({ ...f, maxMarks: Number(e.target.value) }))}
                          placeholder="100"
                          min="1"
                          max="200"
                          required
                        />
                        <FormInput
                          id="passingMarks"
                          label="Passing Marks"
                          type="number"
                          value={examForm.passingMarks}
                          onChange={e => setExamForm(f => ({ ...f, passingMarks: Number(e.target.value) }))}
                          placeholder="40"
                          min="1"
                          max="100"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <FormSelect
                          id="duration"
                          label="Duration"
                          value={examForm.duration}
                          onValueChange={v => setExamForm(f => ({ ...f, duration: v }))}
                          options={[
                            { value: "30 minutes", label: "30 minutes" },
                            { value: "1 hour", label: "1 hour" },
                            { value: "1.5 hours", label: "1.5 hours" },
                            { value: "2 hours", label: "2 hours" },
                            { value: "2.5 hours", label: "2.5 hours" },
                            { value: "3 hours", label: "3 hours" }
                          ]}
                          required
                        />
                        <FormInput
                          id="totalQuestions"
                          label="Total Questions"
                          type="number"
                          value={examForm.totalQuestions}
                          onChange={e => setExamForm(f => ({ ...f, totalQuestions: Number(e.target.value) }))}
                          placeholder="50"
                          min="1"
                          max="200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Schedule & Timing Section */}
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-slate-800">Schedule & Timing</h3>
                    </div>
                    <div className="space-y-5">
                      <FormInput
                        id="date"
                        label="Exam Date"
                        type="date"
                        value={examForm.date}
                        onChange={e => setExamForm(f => ({ ...f, date: e.target.value }))}
                        required
                      />
                      <div className="grid grid-cols-2 gap-5">
                        <FormInput
                          id="startTime"
                          label="Start Time"
                          type="time"
                          value={examForm.startTime}
                          onChange={e => setExamForm(f => ({ ...f, startTime: e.target.value }))}
                        />
                        <FormInput
                          id="endTime"
                          label="End Time"
                          type="time"
                          value={examForm.endTime}
                          onChange={e => setExamForm(f => ({ ...f, endTime: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <FormSelect
                          id="academicYear"
                          label="Academic Year"
                          value={examForm.academicYear}
                          onValueChange={v => setExamForm(f => ({ ...f, academicYear: v }))}
                          options={[
                            { value: "2024-25", label: "2024-25" },
                            { value: "2025-26", label: "2025-26" },
                            { value: "2026-27", label: "2026-27" }
                          ]}
                        />
                        <FormSelect
                          id="term"
                          label="Term"
                          value={examForm.term}
                          onValueChange={v => setExamForm(f => ({ ...f, term: v }))}
                          options={[
                            { value: "Term 1", label: "Term 1" },
                            { value: "Term 2", label: "Term 2" },
                            { value: "Term 3", label: "Term 3" }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details Section */}
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-slate-800">Additional Details</h3>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <FormInput
                          id="room"
                          label="Exam Room"
                          value={examForm.room}
                          onChange={e => setExamForm(f => ({ ...f, room: e.target.value }))}
                          placeholder="e.g., Room 101"
                        />
                        <FormInput
                          id="invigilator"
                          label="Invigilator"
                          value={examForm.invigilator}
                          onChange={e => setExamForm(f => ({ ...f, invigilator: e.target.value }))}
                          placeholder="e.g., Mr. John Doe"
                        />
                      </div>
                      <FormSelect
                        id="status"
                        label="Exam Status"
                        value={examForm.status}
                        onValueChange={v => setExamForm(f => ({ ...f, status: v }))}
                        options={[
                          { value: 'Planning', label: 'Planning' },
                          { value: 'Scheduled', label: 'Scheduled' },
                          { value: 'Completed', label: 'Completed' },
                          { value: 'Cancelled', label: 'Cancelled' }
                        ]}
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Special Instructions
                        </label>
                        <Textarea
                          placeholder="Enter any special instructions for students, exam rules, or additional notes..."
                          className="min-h-[80px] resize-none"
                          value={examForm.instructions}
                          onChange={e => setExamForm(f => ({ ...f, instructions: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="sticky bottom-0 z-10 bg-white border-t border-slate-200 px-6 py-4">
                <Button variant="outline" type="button" onClick={() => setAddExamOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  Schedule Exam
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Exam Dialog - Using Same Form Structure */}
      <Dialog open={editExamOpen} onOpenChange={setEditExamOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="sticky top-0 z-10 bg-white border-b border-slate-200 px-0 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                <Edit className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-900">Edit Exam</DialogTitle>
                <DialogDescription className="text-sm text-slate-600 mt-1">
                  Update the exam details and configuration.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {selectedExam && (
              <form onSubmit={(e) => {
                e.preventDefault()
                handleEditExam({
                  ...selectedExam,
                  name: examForm.name || selectedExam.name,
                  class: examForm.class || selectedExam.class,
                  subject: examForm.subject || selectedExam.subject,
                  date: examForm.date || selectedExam.date,
                  maxMarks: examForm.maxMarks || selectedExam.maxMarks,
                  duration: examForm.duration || selectedExam.duration,
                  status: examForm.status as "Planning" | "Scheduled" | "Completed" | "Cancelled" || selectedExam.status,
                  examType: examForm.examType || selectedExam.examType,
                  academicYear: examForm.academicYear || selectedExam.academicYear,
                  term: examForm.term || selectedExam.term,
                  startTime: examForm.startTime || selectedExam.startTime,
                  endTime: examForm.endTime || selectedExam.endTime,
                  room: examForm.room || selectedExam.room,
                  instructions: examForm.instructions || selectedExam.instructions,
                  passingMarks: examForm.passingMarks || selectedExam.passingMarks,
                  totalQuestions: examForm.totalQuestions || selectedExam.totalQuestions,
                  examCode: examForm.examCode || selectedExam.examCode,
                  invigilator: examForm.invigilator || selectedExam.invigilator,
                })
              }} className="py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
                      </div>
                      <div className="space-y-5">
                        <FormInput
                          id="name"
                          label="Exam Name"
                          value={examForm.name || selectedExam.name}
                          onChange={e => setExamForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="e.g., Mid-Term Mathematics"
                          required
                        />
                        <div className="grid grid-cols-2 gap-5">
                          <FormInput
                            id="examCode"
                            label="Exam Code"
                            value={examForm.examCode || selectedExam.examCode}
                            onChange={e => setExamForm(f => ({ ...f, examCode: e.target.value }))}
                            placeholder="e.g., MATH101-MT"
                          />
                          <FormSelect
                            id="examType"
                            label="Exam Type"
                            value={examForm.examType || selectedExam.examType}
                            onValueChange={v => setExamForm(f => ({ ...f, examType: v }))}
                            options={[
                              { value: "Regular", label: "Regular" },
                              { value: "Mid-Term", label: "Mid-Term" },
                              { value: "Final", label: "Final" },
                              { value: "Quiz", label: "Quiz" },
                              { value: "Assignment", label: "Assignment" }
                            ]}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <FormSelect
                            id="class"
                            label="Class"
                            value={examForm.class || selectedExam.class}
                            onValueChange={v => setExamForm(f => ({ ...f, class: v }))}
                            options={classes.map(c => ({ value: c.name, label: c.name, key: c.name || 'unknown' }))}
                            required
                          />
                          <FormSelect
                            id="subject"
                            label="Subject"
                            value={examForm.subject || selectedExam.subject}
                            onValueChange={v => setExamForm(f => ({ ...f, subject: v }))}
                            options={Array.from(new Set(subjects.map(s => s.name).filter(Boolean))).sort().map(subjectName => ({
                              value: subjectName,
                              label: subjectName,
                              key: subjectName
                            }))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Academic Details Section */}
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-slate-800">Academic Details</h3>
                      </div>
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          <FormInput
                            id="maxMarks"
                            label="Maximum Marks"
                            type="number"
                            value={examForm.maxMarks || selectedExam.maxMarks}
                            onChange={e => setExamForm(f => ({ ...f, maxMarks: Number(e.target.value) }))}
                            placeholder="100"
                            min="1"
                            max="200"
                            required
                          />
                          <FormInput
                            id="passingMarks"
                            label="Passing Marks"
                            type="number"
                            value={examForm.passingMarks || selectedExam.passingMarks}
                            onChange={e => setExamForm(f => ({ ...f, passingMarks: Number(e.target.value) }))}
                            placeholder="40"
                            min="1"
                            max="100"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <FormSelect
                            id="duration"
                            label="Duration"
                            value={examForm.duration || selectedExam.duration}
                            onValueChange={v => setExamForm(f => ({ ...f, duration: v }))}
                            options={[
                              { value: "30 minutes", label: "30 minutes" },
                              { value: "1 hour", label: "1 hour" },
                              { value: "1.5 hours", label: "1.5 hours" },
                              { value: "2 hours", label: "2 hours" },
                              { value: "2.5 hours", label: "2.5 hours" },
                              { value: "3 hours", label: "3 hours" }
                            ]}
                            required
                          />
                          <FormInput
                            id="totalQuestions"
                            label="Total Questions"
                            type="number"
                            value={examForm.totalQuestions || selectedExam.totalQuestions}
                            onChange={e => setExamForm(f => ({ ...f, totalQuestions: Number(e.target.value) }))}
                            placeholder="50"
                            min="1"
                            max="200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Schedule & Timing Section */}
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-slate-800">Schedule & Timing</h3>
                      </div>
                      <div className="space-y-5">
                        <FormInput
                          id="date"
                          label="Exam Date"
                          type="date"
                          value={examForm.date || selectedExam.date}
                          onChange={e => setExamForm(f => ({ ...f, date: e.target.value }))}
                          required
                        />
                        <div className="grid grid-cols-2 gap-5">
                          <FormInput
                            id="startTime"
                            label="Start Time"
                            type="time"
                            value={examForm.startTime || selectedExam.startTime}
                            onChange={e => setExamForm(f => ({ ...f, startTime: e.target.value }))}
                          />
                          <FormInput
                            id="endTime"
                            label="End Time"
                            type="time"
                            value={examForm.endTime || selectedExam.endTime}
                            onChange={e => setExamForm(f => ({ ...f, endTime: e.target.value }))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <FormSelect
                            id="academicYear"
                            label="Academic Year"
                            value={examForm.academicYear || selectedExam.academicYear}
                            onValueChange={v => setExamForm(f => ({ ...f, academicYear: v }))}
                            options={[
                              { value: "2024-25", label: "2024-25" },
                              { value: "2025-26", label: "2025-26" },
                              { value: "2026-27", label: "2026-27" }
                            ]}
                          />
                          <FormSelect
                            id="term"
                            label="Term"
                            value={examForm.term || selectedExam.term}
                            onValueChange={v => setExamForm(f => ({ ...f, term: v }))}
                            options={[
                              { value: "Term 1", label: "Term 1" },
                              { value: "Term 2", label: "Term 2" },
                              { value: "Term 3", label: "Term 3" }
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Details Section */}
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-slate-800">Additional Details</h3>
                      </div>
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          <FormInput
                            id="room"
                            label="Exam Room"
                            value={examForm.room || selectedExam.room}
                            onChange={e => setExamForm(f => ({ ...f, room: e.target.value }))}
                            placeholder="e.g., Room 101"
                          />
                          <FormInput
                            id="invigilator"
                            label="Invigilator"
                            value={examForm.invigilator || selectedExam.invigilator}
                            onChange={e => setExamForm(f => ({ ...f, invigilator: e.target.value }))}
                            placeholder="e.g., Mr. John Doe"
                          />
                        </div>
                        <FormSelect
                          id="status"
                          label="Exam Status"
                          value={examForm.status || selectedExam.status}
                          onValueChange={v => setExamForm(f => ({ ...f, status: v }))}
                          options={[
                            { value: 'Planning', label: 'Planning' },
                            { value: 'Scheduled', label: 'Scheduled' },
                            { value: 'Completed', label: 'Completed' },
                            { value: 'Cancelled', label: 'Cancelled' }
                          ]}
                          required
                        />
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Special Instructions
                          </label>
                          <Textarea
                            placeholder="Enter any special instructions for students, exam rules, or additional notes..."
                            className="min-h-[80px] resize-none"
                            value={examForm.instructions || selectedExam.instructions}
                            onChange={e => setExamForm(f => ({ ...f, instructions: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="sticky bottom-0 z-10 bg-white border-t border-slate-200 px-6 py-4">
                  <Button variant="outline" type="button" onClick={() => {
                    setSelectedExam(null)
                    setEditExamOpen(false)
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Update Exam
                  </Button>
                </DialogFooter>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Exam Detail Sheet */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Exam Details</SheetTitle>
            <SheetDescription>
              {selectedExam && (
                <React.Fragment>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 bg-orange-100">
                      <AvatarFallback className="text-orange-600 font-semibold text-lg">
                        {selectedExam.name.split(' ').map((n, index) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl font-bold">{selectedExam.name}</div>
                      <div className="text-muted-foreground">{selectedExam.examCode || selectedExam.id}</div>
                      <Badge className="mt-2">{selectedExam.status || "Scheduled"}</Badge>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Class:</div>
                      <div className="font-semibold">{selectedExam.class}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Subject:</div>
                      <div>{selectedExam.subject}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Date:</div>
                      <div>{new Date(selectedExam.date).toLocaleDateString()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Max Marks:</div>
                      <div>{selectedExam.maxMarks}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Duration:</div>
                      <div>{selectedExam.duration}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Status:</div>
                      <Badge>{selectedExam.status || "Scheduled"}</Badge>
                    </div>
                    {selectedExam.room && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Room:</div>
                        <div>{selectedExam.room}</div>
                      </div>
                    )}
                    {selectedExam.instructions && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Instructions:</div>
                        <div className="text-sm">{selectedExam.instructions}</div>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4" />

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={() => {
                      setSelectedExam(selectedExam)
                      setEditExamOpen(true)
                      setProfileOpen(false)
                    }}>
                      <Edit className="h-4 w-4 mr-1" />Edit
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`mailto:${selectedExam.invigilator}`)}>
                      <Mail className="h-4 w-4 mr-1" />Contact Invigilator
                    </Button>
                  </div>
                </React.Fragment>
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>

  )
}
