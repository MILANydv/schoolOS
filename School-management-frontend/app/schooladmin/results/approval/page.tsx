"use client"

import * as React from "react"
import { CheckCircle, XCircle, Clock, AlertTriangle, Download, Upload, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, User, Building, UserPlus, Calendar, TrendingUp, Target, Users2, BookMarked, MapPin, FileText, Award, BarChart3, GraduationCap, CheckSquare, Grid3X3, List, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, BookOpen, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedTable, TableColumn, TableFilter, TableAction } from "@/components/table/enhanced-table"
import { MOCK_RESULTS_APPROVAL } from "@/lib/constants"
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
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid'
import MarkSheetView from "@/components/marksheet/marksheet-view"

type ResultApproval = (typeof MOCK_RESULTS_APPROVAL)[number]

export default function ResultApprovalPage() {
  const { toast } = useToast()
  const router = useRouter()
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [results, setResults] = React.useState<ResultApproval[]>(MOCK_RESULTS_APPROVAL)
  const [selectedResult, setSelectedResult] = React.useState<ResultApproval | null>(null)
  const [resultDialogOpen, setResultDialogOpen] = React.useState(false)

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [subjectFilter, setSubjectFilter] = React.useState("all")
  const [classFilter, setClassFilter] = React.useState("all")
  const [examFilter, setExamFilter] = React.useState("all")
  const [yearFilter, setYearFilter] = React.useState("all")
  const [termFilter, setTermFilter] = React.useState("all")
  const [resultTypeFilter, setResultTypeFilter] = React.useState("all")
  const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(15)
  const [approvalForm, setApprovalForm] = React.useState({
    status: 'Approved',
    remarks: '',
    approvedBy: 'School Admin',
    approvedDate: new Date().toISOString().split('T')[0],
  })

  // Class-based approval handlers
  const handleApproveClassResults = (classKey: string, remarks: string = "") => {
    const classGroup = classGroups[classKey]
    if (!classGroup) {
      toast({
        title: "Error",
        description: "Class group not found. Please try again.",
        variant: "destructive"
      })
      return
    }

    const pendingCount = results.filter(r => {
      const isInClass = r.class === classGroup.class && 
                       r.examName === classGroup.examName && 
                       r.year === classGroup.year && 
                       r.term === classGroup.term
      return isInClass && r.status === "Pending"
    }).length

    if (pendingCount === 0) {
      toast({
        title: "No Pending Results",
        description: `No pending results found for ${classGroup.class} - ${classGroup.examName}.`,
        variant: "destructive"
      })
      return
    }

    setResults(prev => prev.map(r => {
      const isInClass = r.class === classGroup.class && 
                       r.examName === classGroup.examName && 
                       r.year === classGroup.year && 
                       r.term === classGroup.term
      
      if (isInClass && r.status === "Pending") {
        return { ...r, status: "Approved", remarks: remarks || `Bulk approved for ${classGroup.class}` }
      }
      return r
    }))
    
    toast({
      title: "✅ Class Results Approved",
      description: `${pendingCount} pending results for ${classGroup.class} - ${classGroup.examName} have been approved successfully.`,
    })
  }

  const handlePublishClassResults = (classKey: string) => {
    const classGroup = classGroups[classKey]
    if (!classGroup) {
      toast({
        title: "Error",
        description: "Class group not found. Please try again.",
        variant: "destructive"
      })
      return
    }
    
    const approvedCount = results.filter(r => {
      const isInClass = r.class === classGroup.class && 
                       r.examName === classGroup.examName && 
                       r.year === classGroup.year && 
                       r.term === classGroup.term
      return isInClass && r.status === "Approved"
    }).length

    if (approvedCount === 0) {
      toast({
        title: "No Approved Results",
        description: `No approved results found for ${classGroup.class} - ${classGroup.examName}. Please approve results first.`,
        variant: "destructive"
      })
      return
    }

    setResults(prev => prev.map(r => {
      const isInClass = r.class === classGroup.class && 
                       r.examName === classGroup.examName && 
                       r.year === classGroup.year && 
                       r.term === classGroup.term
      
      if (isInClass && r.status === "Approved") {
        return { ...r, status: "Published" }
      }
      return r
    }))
    
    toast({
      title: "📤 Class Results Published",
      description: `${approvedCount} approved results for ${classGroup.class} - ${classGroup.examName} have been published to students successfully.`,
    })
  }

  // Result Analytics
  const totalResults = results.length
  const pendingResults = results.filter(r => r.status === "Pending").length
  const approvedResults = results.filter(r => r.status === "Approved").length
  const publishedResults = results.filter(r => r.status === "Published").length
  const rejectedResults = results.filter(r => r.status === "Rejected").length
  const totalStudents = Array.from(new Set(results.map(r => r.studentId))).length
  const averageMarks = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.marks, 0) / results.length) : 0
  const passRate = results.length > 0 ? Math.round((results.filter(r => r.marks >= (r.maxMarks * 0.4)).length / results.length) * 100) : 0

  // Class-based analytics
  interface ClassGroup {
    class: string
    examName: string
    year: string
    term: string
    totalResults: number
    pendingResults: number
    approvedResults: number
    publishedResults: number
    rejectedResults: number
    students: Set<string>
    results: ResultApproval[]
  }

  interface ClassGroupSummary extends Omit<ClassGroup, 'students' | 'results'> {
    students: number
    key: string
  }

  // Create unique class groups without duplicates - Improved logic
  const classGroups = React.useMemo(() => {
    const groups: Record<string, ClassGroup> = {}
    
    results.forEach((result) => {
      const key = `${result.class}-${result.examName}-${result.year}-${result.term}`
      if (!groups[key]) {
        groups[key] = {
          class: result.class,
          examName: result.examName,
          year: result.year,
          term: result.term,
          totalResults: 0,
          pendingResults: 0,
          approvedResults: 0,
          publishedResults: 0,
          rejectedResults: 0,
          students: new Set<string>(),
          results: []
        }
      }
      groups[key].totalResults++
      groups[key].students.add(result.studentId)
      groups[key].results.push(result)
      
      if (result.status === "Pending") groups[key].pendingResults++
      else if (result.status === "Approved") groups[key].approvedResults++
      else if (result.status === "Published") groups[key].publishedResults++
      else if (result.status === "Rejected") groups[key].rejectedResults++
    })
    
    return groups
  }, [results])

  const classGroupsArray: ClassGroupSummary[] = React.useMemo(() => {
    return Object.entries(classGroups)
      .map(([key, group]) => ({
        class: group.class,
        examName: group.examName,
        year: group.year,
        term: group.term,
        totalResults: group.totalResults,
        pendingResults: group.pendingResults,
        approvedResults: group.approvedResults,
        publishedResults: group.publishedResults,
        rejectedResults: group.rejectedResults,
        students: group.students.size,
        key: key
      }))
      .sort((a, b) => {
        // Sort by class first, then by exam name
        const classComparison = a.class.localeCompare(b.class)
        if (classComparison !== 0) return classComparison
        return a.examName.localeCompare(b.examName)
      })
  }, [classGroups])

  const totalClasses = classGroupsArray.length
  const classesWithPending = classGroupsArray.filter(c => c.pendingResults > 0).length

  // Result filter logic
  const filteredResults = results
    .filter(r => statusFilter === "all" || r.status === statusFilter)
    .filter(r => subjectFilter === "all" || r.subject === subjectFilter)
    .filter(r => classFilter === "all" || r.class === classFilter)
    .filter(r => examFilter === "all" || r.examName === examFilter)
    .filter(r => yearFilter === "all" || r.year === yearFilter)
    .filter(r => termFilter === "all" || r.term === termFilter)
    .filter(r => resultTypeFilter === "all" || r.resultType === resultTypeFilter)
    .filter(r => {
      return (r.studentName?.toLowerCase() || '').includes(search.toLowerCase()) || 
             (r.subject?.toLowerCase() || '').includes(search.toLowerCase()) ||
             (r.examName?.toLowerCase() || '').includes(search.toLowerCase()) ||
             (r.submittedBy?.toLowerCase() || '').includes(search.toLowerCase())
    })

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedResults = filteredResults.slice(startIndex, endIndex)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, subjectFilter, classFilter, examFilter, yearFilter, termFilter, resultTypeFilter, search])

  // Handle result action
  const handleResultAction = (result: ResultApproval, action: string) => {
    switch (action) {
      case "view":
        setSelectedResult(result)
        setProfileOpen(true)
        break
      case "approve":
        setSelectedResult(result)
        setApprovalForm({ ...approvalForm, status: 'Approved' })
        setApprovalDialogOpen(true)
        break
      case "reject":
        setSelectedResult(result)
        setApprovalForm({ ...approvalForm, status: 'Rejected' })
        setApprovalDialogOpen(true)
        break
      case "publish":
        handlePublishResult(result.id)
        break
      case "delete":
        handleDeleteResults([result.id])
        break
    }
  }

  const handleApproveResult = (resultId: string, remarks: string = "") => {
    const result = results.find(r => r.id === resultId)
    if (!result) {
      toast({
        title: "Error",
        description: "Result not found. Please try again.",
        variant: "destructive"
      })
      return
    }

    setResults(prev => prev.map(r => 
      r.id === resultId 
        ? { ...r, status: "Approved", remarks: remarks || "Approved by School Admin" }
        : r
    ))
    setApprovalDialogOpen(false)
    setSelectedResult(null)
    toast({
      title: "✅ Result Approved",
      description: `${result.studentName}'s ${result.subject} result has been approved successfully.`,
    })
  }

  const handleRejectResult = (resultId: string, remarks: string = "") => {
    const result = results.find(r => r.id === resultId)
    if (!result) {
      toast({
        title: "Error",
        description: "Result not found. Please try again.",
        variant: "destructive"
      })
      return
    }

    setResults(prev => prev.map(r => 
      r.id === resultId 
        ? { ...r, status: "Rejected", remarks: remarks || "Rejected by School Admin" }
        : r
    ))
    setApprovalDialogOpen(false)
    setSelectedResult(null)
    toast({
      title: "❌ Result Rejected",
      description: `${result.studentName}'s ${result.subject} result has been rejected.`,
      variant: "destructive"
    })
  }

  const handlePublishResult = (resultId: string) => {
    const result = results.find(r => r.id === resultId)
    if (!result) {
      toast({
        title: "Error",
        description: "Result not found. Please try again.",
        variant: "destructive"
      })
      return
    }

    if (result.status !== "Approved") {
      toast({
        title: "Cannot Publish",
        description: "Only approved results can be published. Please approve the result first.",
        variant: "destructive"
      })
      return
    }

    setResults(prev => prev.map(r => 
      r.id === resultId 
        ? { ...r, status: "Published" }
        : r
    ))
    toast({
      title: "📤 Result Published",
      description: `${result.studentName}'s ${result.subject} result has been published to students successfully.`,
    })
  }

  const handleDeleteResults = (ids: string[]) => {
    if (ids.length === 0) {
      toast({
        title: "No Results Selected",
        description: "Please select results to delete.",
        variant: "destructive"
      })
      return
    }

    const resultsToDelete = results.filter(r => ids.includes(r.id))
    const publishedCount = resultsToDelete.filter(r => r.status === "Published").length

    if (publishedCount > 0) {
      toast({
        title: "⚠️ Warning",
        description: `${publishedCount} published results will also be deleted. This action cannot be undone.`,
        variant: "destructive"
      })
    }

    setResults(prev => prev.filter(r => !ids.includes(r.id)))
    toast({ 
      title: "🗑️ Results Deleted", 
      description: `${ids.length} result(s) have been deleted successfully.` 
    })
  }

  // Enhanced Table columns for results - More compact and responsive
  const resultColumns: TableColumn<ResultApproval>[] = [
    {
      key: "studentName",
      header: "Student",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarFallback className="text-xs">{item.studentName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-900 text-xs truncate">{item.studentName}</div>
            <div className="text-xs text-slate-500 truncate">{item.rollNumber} • {item.class}</div>
          </div>
        </div>
      )
    },
    {
      key: "examName",
      header: "Exam",
      sortable: true,
      cell: (item) => (
        <div className="min-w-0">
          <div className="font-medium text-slate-900 text-xs truncate">{item.examName}</div>
          <div className="text-xs text-slate-500 truncate">{item.year} • {item.term}</div>
        </div>
      )
    },
    {
      key: "subject",
      header: "Subject",
      sortable: true,
      cell: (item) => (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5 truncate max-w-[80px]">
          {item.subject}
        </Badge>
      )
    },
    {
      key: "marks",
      header: "Marks",
      sortable: true,
      cell: (item) => (
        <div className="text-center">
          <div className="font-bold text-slate-900 text-xs">{item.marks}/{item.maxMarks}</div>
          <div className="text-xs text-slate-500">{Math.round((item.marks / item.maxMarks) * 100)}%</div>
        </div>
      )
    },
    {
      key: "submittedBy",
      header: "Teacher",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-1 min-w-0">
          <User className="h-3 w-3 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-medium text-slate-700 truncate">{item.submittedBy}</span>
          </div>
        )
      },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (item) => {
        if (item.status === "Approved") {
          return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5"><CheckCircle className="h-2.5 w-2.5 mr-1" />Approved</Badge>
        } else if (item.status === "Rejected") {
          return <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs px-2 py-0.5"><XCircle className="h-2.5 w-2.5 mr-1" />Rejected</Badge>
        } else if (item.status === "Published") {
          return <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5"><CheckSquare className="h-2.5 w-2.5 mr-1" />Published</Badge>
        } else {
          return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-2 py-0.5"><Clock className="h-2.5 w-2.5 mr-1" />Pending</Badge>
        }
      }
    }
  ]

  // Table filters
  const resultFilters: TableFilter[] = [
    {
      key: "status",
      type: "select",
      label: "Status",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
        { value: "Published", label: "Published" }
      ]
    },
    {
      key: "subject",
      type: "select",
      label: "Subject",
      options: Array.from(new Set(results.map(r => r.subject))).sort().map(s => ({ value: s, label: s }))
    },
    {
      key: "class",
      type: "select",
      label: "Class",
      options: Array.from(new Set(results.map(r => r.class))).sort().map(c => ({ value: c, label: c }))
    },
    {
      key: "examName",
      type: "select",
      label: "Exam",
      options: Array.from(new Set(results.map(r => r.examName))).sort().map(e => ({ value: e, label: e }))
    },
    {
      key: "year",
      type: "select",
      label: "Year",
      options: Array.from(new Set(results.map(r => r.year))).sort().map(y => ({ value: y, label: y }))
    }
  ]

  // Table actions
  const resultActions: TableAction<ResultApproval>[] = [
    {
      key: "view",
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item) => handleResultAction(item, "view")
    },
    {
      key: "marksheet",
      label: "View Marksheet",
      icon: <FileText className="h-4 w-4" />,
      onClick: (item) => handleViewMarksheet(item)
    },
    {
      key: "approve",
      label: "Approve Result",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (item) => handleResultAction(item, "approve")
    },
    {
      key: "reject",
      label: "Reject Result",
      icon: <XCircle className="h-4 w-4" />,
      onClick: (item) => handleResultAction(item, "reject"),
      variant: "destructive"
    },
    {
      key: "publish",
      label: "Publish Result",
      icon: <CheckSquare className="h-4 w-4" />,
      onClick: (item) => handleResultAction(item, "publish")
    },
    {
      key: "delete",
      label: "Delete Result",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item) => handleResultAction(item, "delete"),
      variant: "destructive"
    }
  ]

  // Sidebar state and handlers
  const [classSearch, setClassSearch] = React.useState("")
  const [sidebarExamFilter, setSidebarExamFilter] = React.useState("all")
  const [sidebarYearFilter, setSidebarYearFilter] = React.useState("all")
  const [sidebarTermFilter, setSidebarTermFilter] = React.useState("all")
  const [sidebarStatusFilter, setSidebarStatusFilter] = React.useState("all")

  // Marksheet modal state
  const [marksheetModalOpen, setMarksheetModalOpen] = React.useState(false)
  const [selectedMarksheetResult, setSelectedMarksheetResult] = React.useState<ResultApproval | null>(null)
  const [bulkMarksheetModalOpen, setBulkMarksheetModalOpen] = React.useState(false)
  const [selectedClassForBulk, setSelectedClassForBulk] = React.useState<string>("")

  const filteredClassGroups = React.useMemo(() => {
    return classGroupsArray.filter((group) => {
      const matchesSearch = 
        group.class.toLowerCase().includes(classSearch.toLowerCase())

      const matchesSidebarFilters = 
        (sidebarExamFilter === "all" || group.examName === sidebarExamFilter) &&
        (sidebarStatusFilter === "all" || 
         (group.pendingResults > 0 && sidebarStatusFilter === "pending") ||
         (group.approvedResults > 0 && sidebarStatusFilter === "approved") ||
         (group.publishedResults > 0 && sidebarStatusFilter === "published") ||
         (group.pendingResults === 0 && group.approvedResults === 0 && group.publishedResults === 0 && sidebarStatusFilter === "complete")
        )

      return matchesSearch && matchesSidebarFilters
    })
  }, [classGroupsArray, classSearch, sidebarExamFilter, sidebarStatusFilter])

  // Handle individual marksheet view
  const handleViewMarksheet = (result: ResultApproval) => {
    setSelectedMarksheetResult(result)
    setMarksheetModalOpen(true)
  }

  // Handle bulk marksheet view
  const handleBulkMarksheet = (classKey: string) => {
    console.log("Selected class key:", classKey)
    const classResults = getClassResults(classKey)
    console.log("Class results:", classResults)
    const students = getClassStudents(classKey)
    console.log("Class students:", students)
    setSelectedClassForBulk(classKey)
    setBulkMarksheetModalOpen(true)
  }

  // Get all results for a specific class/exam combination
  const getClassResults = (classKey: string) => {
    const parts = classKey.split('-')
    console.log("Class key parts:", parts)
    
    // Handle different formats
    if (parts.length === 4) {
      const [className, examName, year, term] = parts
      const filtered = results.filter(r => 
        r.class === className && 
        r.examName === examName && 
        r.year === year && 
        r.term === term
      )
      console.log("Filtered results:", filtered.length, "for", className, examName, year, term)
      return filtered
    } else if (parts.length === 5) {
      // Handle format like "10A-Annual Exam-2024-25-Term 1"
      const [className, examName, year, term, extra] = parts
      const fullTerm = `${term}-${extra}`
      const filtered = results.filter(r => 
        r.class === className && 
        r.examName === examName && 
        r.year === year && 
        r.term === fullTerm
      )
      console.log("Filtered results (5 parts):", filtered.length, "for", className, examName, year, fullTerm)
      return filtered
    }
    
    return []
  }

  // Get unique students for a class
  const getClassStudents = (classKey: string) => {
    const classResults = getClassResults(classKey)
    const studentIds = Array.from(new Set(classResults.map(r => r.studentId)))
    return studentIds.map(studentId => {
      const studentResults = classResults.filter(r => r.studentId === studentId)
      const firstResult = studentResults[0]
      const totalMarks = studentResults.reduce((sum, r) => sum + r.marks, 0)
      const totalMax = studentResults.reduce((sum, r) => sum + r.maxMarks, 0)
      const percentage = totalMax ? Math.round((totalMarks / totalMax) * 100) : 0
      
      return {
        studentId: firstResult.studentId,
        studentName: firstResult.studentName,
        rollNumber: firstResult.rollNumber,
        class: firstResult.class,
        examName: firstResult.examName,
        year: firstResult.year,
        term: firstResult.term,
        subjects: studentResults,
        totalMarks,
        totalMax,
        percentage
      }
    })
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Clean Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Side - Title and Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
          <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Result Approval</h1>
                  <p className="text-sm text-slate-600">Review and approve exam results submitted by teachers</p>
        </div>
              </div>
            </div>
            
            {/* Right Side - Actions and Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
          <Button 
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("Pending")
                    setSearch("")
                    toast({ 
                      title: "⏳ Pending Results", 
                      description: `Showing ${pendingResults} pending results for approval` 
                    })
                    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 h-8 text-xs"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Pending ({pendingResults})
                </Button>
                <Button 
                  onClick={() => {
                    const pendingIds = results.filter(r => r.status === "Pending").map(r => r.id)
                    if (pendingIds.length > 0) {
                      setResults(prev => prev.map(r => 
                        pendingIds.includes(r.id) ? { ...r, status: "Approved", remarks: "Bulk approved by School Admin" } : r
                      ))
                      toast({ 
                        title: "✅ Bulk Approval Complete", 
                        description: `${pendingIds.length} pending results have been approved successfully` 
                      })
                    } else {
                      toast({
                        title: "No Pending Results",
                        description: "All results have already been processed.",
                        variant: "destructive"
                      })
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md h-8 text-xs"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Approve All
                </Button>
                <Button
                  onClick={() => {
                    const approvedIds = results.filter(r => r.status === "Approved").map(r => r.id)
                    if (approvedIds.length > 0) {
                      setResults(prev => prev.map(r => 
                        approvedIds.includes(r.id) ? { ...r, status: "Published" } : r
                      ))
                    toast({ 
                        title: "📤 Bulk Publishing Complete", 
                        description: `${approvedIds.length} approved results have been published successfully` 
                      })
                    } else {
                    toast({ 
                        title: "No Approved Results",
                        description: "Please approve results first before publishing.",
                        variant: "destructive"
                    })
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md h-8 text-xs"
                >
                  <CheckSquare className="mr-1 h-3 w-3" />
                  Publish All
          </Button>
      </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-7 px-2 text-xs"
                >
                  <List className="h-3 w-3 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-7 px-2 text-xs"
                >
                  <Grid3X3 className="h-3 w-3 mr-1" />
                  Grid
                </Button>
                </div>
              </div>
              </div>
            </div>
      </div>

      {/* Main Content with Sidebar - Full Height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Clean Sidebar - Class Management */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          {/* Sidebar Header */}
          <div className="flex-shrink-0 bg-white border-b border-slate-200">
            <div className="p-4 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">Class Management</h2>
              <p className="text-xs text-slate-600 mb-3">Filter and manage results by class</p>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search classes..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                />
                <Search className="absolute right-3 top-2 h-4 w-4 text-slate-400" />
                </div>
              </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Filters</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Exam</label>
                  <select
                    value={sidebarExamFilter}
                    onChange={(e) => setSidebarExamFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Exams</option>
                    {Array.from(new Set(classGroupsArray.map(g => g.examName))).sort().map(exam => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
              </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={sidebarStatusFilter}
                    onChange={(e) => setSidebarStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Has Pending</option>
                    <option value="approved">Has Approved</option>
                    <option value="published">Has Published</option>
                  </select>
            </div>
              </div>
            </div>
          </div>

          {/* Scrollable Class List - More Compact */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Classes ({filteredClassGroups.length})</h3>
              
              {/* Group classes by class name for better organization */}
              {(() => {
                const classGroups = filteredClassGroups.reduce((acc, group) => {
                  if (!acc[group.class]) {
                    acc[group.class] = []
                  }
                  acc[group.class].push(group)
                  return acc
                }, {} as Record<string, typeof filteredClassGroups>)

                return Object.entries(classGroups).map(([className, classExams]) => (
                  <div key={className} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{className}</h4>
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        {classExams.length} exams
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {classExams.map((group) => (
                        <div 
                          key={group.key}
                          className={`p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                            classFilter === group.class && 
                            examFilter === group.examName && 
                            yearFilter === group.year && 
                            termFilter === group.term
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-md"
                              : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                          onClick={() => {
                            setClassFilter(group.class)
                            setExamFilter(group.examName)
                            setYearFilter(group.year)
                            setTermFilter(group.term)
                            setStatusFilter("all")
                            toast({ 
                              title: "🔍 Filter Applied", 
                              description: `Showing results for ${group.class} - ${group.examName} (${group.totalResults} results)` 
                            })
                            tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }}
                        >
                          {/* Compact Header */}
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="font-semibold text-slate-900 text-sm">{group.examName}</div>
                            <div className="text-xs text-slate-500">{group.students} students</div>
                          </div>
                          
                          {/* Compact Info */}
                          <div className="text-xs text-slate-600 mb-1.5">{group.year} • {group.term}</div>
                          
                          {/* Compact Status */}
            <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                {group.pendingResults > 0 && (
                                <Badge className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5">
                                  {group.pendingResults}
                                  </Badge>
                                )}
                                {group.approvedResults > 0 && (
                                <Badge className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5">
                                  {group.approvedResults}
                                  </Badge>
                                )}
                                {group.publishedResults > 0 && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5">
                                  {group.publishedResults}
                                  </Badge>
                                )}
                </div>
                            
                            {/* Compact Actions */}
                            <div className="flex gap-1">
                              {group.pendingResults > 0 && (
                                <Button
                                  size="sm"
                                  className="h-4 px-1.5 text-xs bg-green-600 hover:bg-green-700"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleApproveClassResults(group.key, `Approved ${group.class}`)
                                  }}
                                  title="Approve All"
                                >
                                  ✓
                                </Button>
                              )}
                              {group.approvedResults > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-4 px-1.5 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePublishClassResults(group.key)
                                  }}
                                  title="Publish All"
                                >
                                  📤
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-4 px-1.5 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleBulkMarksheet(group.key)
                                }}
                                title="View All Marksheets"
                              >
                                📄
                              </Button>
              </div>
              </div>
            </div>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>
          </div>

        </div>

        {/* Full Width Main Content */}
        <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 px-6 py-4">
            


            {/* Analytics Cards - Important for visual overview and quick filters */}
            <div className="pt-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="bg-gradient-to-br from-slate-600 to-slate-700 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => setStatusFilter("all")}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-90 font-medium">Total Results</p>
                        <p className="text-xl font-bold tracking-tight">{totalResults}</p>
                        <p className="text-xs opacity-75 mt-1">{totalStudents} students</p>
                      </div>
                      <FileText className="h-6 w-6 opacity-80" />
                    </div>
          </CardContent>
        </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => setStatusFilter("Pending")}>
                  <CardContent className="p-3">
            <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-90 font-medium">Pending</p>
                        <p className="text-xl font-bold tracking-tight">{pendingResults}</p>
                        <p className="text-xs opacity-75 mt-1">{classesWithPending} classes need review</p>
                </div>
                      <Clock className="h-6 w-6 opacity-80" />
              </div>
          </CardContent>
        </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => setStatusFilter("Approved")}>
                  <CardContent className="p-3">
            <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-90 font-medium">Approved</p>
                        <p className="text-xl font-bold tracking-tight">{approvedResults}</p>
                        <p className="text-xs opacity-75 mt-1">Ready to publish</p>
                </div>
                      <CheckCircle className="h-6 w-6 opacity-80" />
              </div>
          </CardContent>
      </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:scale-105 transition-transform" onClick={() => setStatusFilter("Published")}>
                  <CardContent className="p-3">
            <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-90 font-medium">Published</p>
                        <p className="text-xl font-bold tracking-tight">{publishedResults}</p>
                        <p className="text-xs opacity-75 mt-1">{passRate}% pass rate</p>
                </div>
                      <CheckSquare className="h-6 w-6 opacity-80" />
              </div>
          </CardContent>
        </Card>
              </div>
          </div>

            {/* Full-Width Results Table/Grid */}
            <div ref={tableRef} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <style jsx>{`
                .results-table table {
                  table-layout: fixed;
                }
                .results-table th:nth-child(1),
                .results-table td:nth-child(1) {
                  width: 45px;
                  min-width: 45px;
                  max-width: 45px;
                  padding: 4px 2px !important;
                }
                .results-table th:nth-child(2),
                .results-table td:nth-child(2) {
                  width: 250px;
                  min-width: 250px;
                }
                .results-table th:nth-child(3),
                .results-table td:nth-child(3) {
                  width: 140px;
                  min-width: 140px;
                }
                .results-table th:nth-child(4),
                .results-table td:nth-child(4) {
                  width: 75px;
                  min-width: 75px;
                }
                .results-table th:nth-child(5),
                .results-table td:nth-child(5) {
                  width: 75px;
                  min-width: 75px;
                }
                .results-table th:nth-child(6),
                .results-table td:nth-child(6) {
                  width: 90px;
                  min-width: 90px;
                }
                .results-table th:nth-child(7),
                .results-table td:nth-child(7) {
                  width: 110px;
                  min-width: 110px;
                }
              `}</style>
              {/* Remove duplicate status filter - cards already show this info */}
              
              {viewMode === 'table' ? (
                <div className="w-full">
                  <EnhancedTable
                    data={paginatedResults}
                    columns={resultColumns}
                    className="results-table"
                    showSerialNumbers={true}
                    title={classFilter !== "all" || examFilter !== "all" 
                      ? `${classFilter !== "all" ? classFilter : "All Classes"}${examFilter !== "all" ? ` - ${examFilter}` : ""} Results`
                      : "Result Records"
                    }
                    description={`Showing ${startIndex + 1}-${Math.min(endIndex, filteredResults.length)} of ${filteredResults.length} result records`}
                    filters={[]}
                    actions={resultActions}
          onAdd={undefined}
                    onEdit={(item) => setSelectedResult(item)}
                    onDelete={handleDeleteResults}
          onExport={() => {
                      const csv = [
                        ["S.No.", "Student", "Roll Number", "Class", "Exam", "Subject", "Marks", "Max Marks", "Percentage", "Status", "Submitted By", "Year", "Term"], 
                        ...filteredResults.map((r, index) => [
                          index + 1,
                          r.studentName, 
                          r.rollNumber, 
                          r.class, 
                          r.examName, 
                          r.subject, 
                          r.marks.toString(), 
                          r.maxMarks.toString(), 
                          `${Math.round((r.marks / r.maxMarks) * 100)}%`,
                          r.status,
                          r.submittedBy,
                          r.year,
                          r.term
                        ])
                      ]
            const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
                      a.download = `results-${Date.now()}.csv`
            a.click()
            URL.revokeObjectURL(url)
          }}
                    searchPlaceholder="Search results by student name, subject, exam, or teacher..."
                    searchKeys={["studentName", "subject", "examName", "submittedBy"]}
                    pageSize={pageSize}
          pageSizeOptions={[10, 15, 25, 50, 100]}
                    showPagination={false}
          showSearch={true}
                    showFilters={false}
                    showBulkActions={false}
          showExport={true}
                    onRowClick={(item) => handleResultAction(item, "view")}
          sortable={true}
                    sortKey="studentName"
          sortDirection="asc"
          loading={false}
          emptyState={
            <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
                        <Button onClick={() => setStatusFilter("all")} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          View All Results
              </Button>
            </div>
          }
        />
      </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (filteredResults.length === 0) {
                            toast({
                              title: "No Data to Export",
                              description: "No results found to export.",
                              variant: "destructive"
                            })
                            return
                          }

                          const csv = [
                            ["S.No.", "Student", "Roll Number", "Class", "Exam", "Subject", "Marks", "Max Marks", "Percentage", "Status", "Submitted By", "Year", "Term"], 
                            ...filteredResults.map((r, index) => [
                              index + 1,
                              r.studentName, 
                              r.rollNumber, 
                              r.class, 
                              r.examName, 
                              r.subject, 
                              r.marks.toString(), 
                              r.maxMarks.toString(), 
                              `${Math.round((r.marks / r.maxMarks) * 100)}%`,
                              r.status,
                              r.submittedBy,
                              r.year,
                              r.term
                            ])
                          ]
                          const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `results-${Date.now()}.csv`
                          a.click()
                          URL.revokeObjectURL(url)
                          
                          toast({
                            title: "📊 Export Successful",
                            description: `${filteredResults.length} results exported to CSV file.`,
                          })
                        }}
                        className="h-8 px-3 text-sm font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                      </Button>
              </div>
              </div>
                  
                  {/* Enhanced Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {paginatedResults.map((result, index) => (
                      <Card 
                        key={result.id} 
                        className="relative hover:shadow-lg transition-all duration-200 cursor-pointer border border-slate-200 hover:border-blue-300 group bg-white"
                        onClick={() => handleResultAction(result, "view")}
                      >
                        <CardContent className="p-5">
                          {/* Serial Number Badge */}
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-medium">
                              #{startIndex + index + 1}
                            </Badge>
            </div>
                          
                          {/* Header Section */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="text-sm font-semibold tracking-tight">
                                  {result.studentName.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-slate-900 text-sm tracking-tight">{result.studentName}</h3>
                                <p className="text-xs text-slate-600 font-medium">{result.class} • {result.rollNumber}</p>
              </div>
              </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.location.href = `/schooladmin/results/marksheet/${result.id}`
                                }}
                                title="View Marksheet"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleResultAction(result, "view")
                                }}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
              </div>
            </div>
                          
                          {/* Subject and Performance Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-3 py-1 font-medium">
                                <BookMarked className="h-3 w-3 mr-1" />
                                {result.subject}
                              </Badge>
                              <div className="text-right">
                                <div className="text-xl font-bold text-slate-900 tracking-tight">{result.marks}</div>
                                <div className="text-xs text-slate-500 font-medium">Marks</div>
                    </div>
                    </div>
                            
                            {/* Exam Details */}
                            <div className="bg-slate-50 rounded-lg p-3">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600 font-medium">Exam:</span>
                                  <span className="text-xs font-semibold text-slate-900">{result.examName}</span>
                  </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600 font-medium">Year:</span>
                                  <span className="text-xs font-semibold text-slate-900">{result.year}</span>
                    </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600 font-medium">Term:</span>
                                  <span className="text-xs font-semibold text-slate-900">{result.term}</span>
                    </div>
                  </div>
                </div>

                            {/* Status and Teacher */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-400" />
                                <span className="text-xs text-slate-700 font-medium">{result.submittedBy}</span>
                    </div>
                    <div>
                                {result.status === "Approved" ? (
                                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-medium">
                                    <CheckCircle className="h-2.5 w-2.5 mr-1" />Approved
                                  </Badge>
                                ) : result.status === "Rejected" ? (
                                  <Badge className="bg-red-100 text-red-800 border-red-200 text-xs font-medium">
                                    <XCircle className="h-2.5 w-2.5 mr-1" />Rejected
                                  </Badge>
                                ) : result.status === "Published" ? (
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium">
                                    <CheckSquare className="h-2.5 w-2.5 mr-1" />Published
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-medium">
                                    <Clock className="h-2.5 w-2.5 mr-1" />Pending
                                  </Badge>
                                )}
                    </div>
                  </div>
                  </div>
                          
                          {/* Action Buttons */}
                          {result.status === "Pending" && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="flex-1 h-8 text-xs text-green-700 hover:text-green-800 hover:bg-green-50 font-medium"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleResultAction(result, "approve")
                                }}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="flex-1 h-8 text-xs text-red-700 hover:text-red-800 hover:bg-red-50 font-medium"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleResultAction(result, "reject")
                                }}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                </div>
                          )}
                          {result.status === "Approved" && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-full h-8 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-50 font-medium"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleResultAction(result, "publish")
                                }}
                              >
                                <CheckSquare className="h-3 w-3 mr-1" />
                                Publish to Students
                              </Button>
              </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    </div>
                    </div>
              )}

              {/* Enhanced Pagination */}
              {filteredResults.length > 0 && (
                <div className="flex items-center justify-between py-4 px-6 border-t border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 font-medium">Show:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value))
                          setCurrentPage(1)
                        }}
                        className="border border-slate-300 rounded px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[10, 15, 25, 50, 100].map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                      <span className="text-sm text-slate-600 font-medium">per page</span>
                  </div>
                    <div className="text-sm text-slate-600 font-medium">
                      Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, filteredResults.length)}</span> of <span className="font-semibold">{filteredResults.length}</span> results
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1
                        if (totalPages <= 5) {
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="h-8 w-8 p-0 text-sm font-medium hover:bg-slate-100"
                            >
                              {pageNum}
                            </Button>
                          )
                        } else {
                          if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="h-8 w-8 p-0 text-sm font-medium hover:bg-slate-100"
                              >
                                {pageNum}
                              </Button>
                            )
                          } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                            return <span key={pageNum} className="px-2 text-slate-400 text-sm">...</span>
                          }
                          return null
                        }
                      })}
                </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                    </div>
                    </div>
              )}
                  </div>
                    </div>
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {approvalForm.status === 'Approved' ? 'Approve Result' : 'Reject Result'}
            </DialogTitle>
            <DialogDescription>
              {selectedResult && (
                <div className="space-y-2">
                  <div><strong>Student:</strong> {selectedResult.studentName}</div>
                  <div><strong>Subject:</strong> {selectedResult.subject}</div>
                  <div><strong>Marks:</strong> {selectedResult.marks}/{selectedResult.maxMarks}</div>
        </div>
      )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                Remarks (Optional)
                      </label>
                      <Textarea
                placeholder="Add any remarks or comments..."
                value={approvalForm.remarks}
                onChange={e => setApprovalForm(f => ({ ...f, remarks: e.target.value }))}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
              </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (approvalForm.status === 'Approved') {
                  handleApproveResult(selectedResult!.id, approvalForm.remarks)
                } else {
                  handleRejectResult(selectedResult!.id, approvalForm.remarks)
                }
              }}
              className={approvalForm.status === 'Approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {approvalForm.status === 'Approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clean Result Detail Sheet */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader className="pb-4 border-b border-slate-200">
            <SheetTitle className="text-xl font-semibold text-slate-900">Result Details</SheetTitle>
          </SheetHeader>
          
          {selectedResult && (
            <div className="py-4 space-y-6">
              {/* Student Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Avatar className="h-12 w-12">
                                     <AvatarFallback className="text-sm font-medium">
                     {selectedResult.studentName.split(' ').map((n: string) => n[0]).join('')}
                   </AvatarFallback>
                </Avatar>
                    <div>
                  <h3 className="font-semibold text-slate-900">{selectedResult.studentName}</h3>
                  <p className="text-sm text-slate-500">Roll: {selectedResult.rollNumber} | {selectedResult.class}</p>
                  <div className="mt-1">
                    {selectedResult.status === "Approved" ? (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />Approved
                      </Badge>
                    ) : selectedResult.status === "Rejected" ? (
                      <Badge className="bg-red-100 text-red-700 text-xs">
                        <XCircle className="h-3 w-3 mr-1" />Rejected
                      </Badge>
                    ) : selectedResult.status === "Published" ? (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        <CheckSquare className="h-3 w-3 mr-1" />Published
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 text-xs">
                        <Clock className="h-3 w-3 mr-1" />Pending
                      </Badge>
                    )}
                    </div>
                  </div>
            </div>

              {/* Exam Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Exam</span>
                  <span className="text-sm font-medium text-slate-900">{selectedResult.examName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Subject</span>
                  <span className="text-sm font-medium text-slate-900">{selectedResult.subject}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Academic Year</span>
                  <span className="text-sm font-medium text-slate-900">{selectedResult.year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Term</span>
                  <span className="text-sm font-medium text-slate-900">{selectedResult.term}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Type</span>
                  <span className="text-sm font-medium text-slate-900">{selectedResult.resultType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Submitted By</span>
                  <span className="text-sm font-medium text-slate-900">{selectedResult.submittedBy}</span>
          </div>
        </div>

              {/* Performance */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-slate-900">Performance</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{selectedResult.marks}</div>
                    <div className="text-xs text-slate-500">Marks</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{selectedResult.maxMarks}</div>
                    <div className="text-xs text-slate-500">Max</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{Math.round((selectedResult.marks / selectedResult.maxMarks) * 100)}%</div>
                    <div className="text-xs text-slate-500">Percentage</div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Performance</span>
                    <span className={`font-medium ${
                      (selectedResult.marks / selectedResult.maxMarks) >= 0.8 ? 'text-emerald-600' :
                      (selectedResult.marks / selectedResult.maxMarks) >= 0.6 ? 'text-blue-600' :
                      (selectedResult.marks / selectedResult.maxMarks) >= 0.4 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {(selectedResult.marks / selectedResult.maxMarks) >= 0.8 ? 'Excellent' :
                       (selectedResult.marks / selectedResult.maxMarks) >= 0.6 ? 'Good' :
                       (selectedResult.marks / selectedResult.maxMarks) >= 0.4 ? 'Average' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        (selectedResult.marks / selectedResult.maxMarks) >= 0.8 ? 'bg-emerald-500' :
                        (selectedResult.marks / selectedResult.maxMarks) >= 0.6 ? 'bg-blue-500' :
                        (selectedResult.marks / selectedResult.maxMarks) >= 0.4 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(selectedResult.marks / selectedResult.maxMarks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    handleViewMarksheet(selectedResult)
                    setProfileOpen(false)
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Marksheet
              </Button>
                {selectedResult.status === "Pending" && (
                  <>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setApprovalForm({ ...approvalForm, status: 'Approved' })
                        setApprovalDialogOpen(true)
                        setProfileOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Result
              </Button>
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        setApprovalForm({ ...approvalForm, status: 'Rejected' })
                        setApprovalDialogOpen(true)
                        setProfileOpen(false)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Result
                    </Button>
                  </>
                )}
                {selectedResult.status === "Approved" && (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handlePublishResult(selectedResult.id)}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Publish to Students
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setProfileOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Enhanced Individual Marksheet Modal */}
      <Dialog open={marksheetModalOpen} onOpenChange={setMarksheetModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Student Marksheet Preview</DialogTitle>
            <DialogDescription className="text-base text-slate-600">
              {selectedMarksheetResult && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {selectedMarksheetResult.studentName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-slate-900">{selectedMarksheetResult.studentName}</span>
              </div>
                  <span className="text-slate-400">•</span>
                  <span className="font-medium">{selectedMarksheetResult.class}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-medium">{selectedMarksheetResult.examName}</span>
              </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMarksheetResult && (
            <div className="space-y-6">
              <MarkSheetView 
                result={selectedMarksheetResult} 
                showActions={false}
                className="print:p-0 print:m-0"
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setMarksheetModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  router.push(`/schooladmin/results/marksheet/${selectedMarksheetResult.id}`)
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  View Full Marksheet
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Bulk Marksheet Modal */}
      <Dialog open={bulkMarksheetModalOpen} onOpenChange={setBulkMarksheetModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-200 pb-6">
            <DialogTitle className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              Class Marksheets Overview
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-600 mt-3">
              {selectedClassForBulk && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-lg">{selectedClassForBulk.split('-')[0]}</span>
                      <div className="text-sm text-slate-600">
                        {selectedClassForBulk.split('-')[1]} • {selectedClassForBulk.split('-')[2]} {selectedClassForBulk.split('-')[3]}
                  </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedClassForBulk && (
            <div className="space-y-6">
              {/* Debug Info */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-2">Debug Info:</h5>
                <p className="text-sm text-red-700">Class Key: {selectedClassForBulk}</p>
                <p className="text-sm text-red-700">Total Results Available: {results.length}</p>
                <p className="text-sm text-red-700">Available Classes: {Array.from(new Set(results.map(r => r.class))).join(', ')}</p>
                <p className="text-sm text-red-700">Available Exams: {Array.from(new Set(results.map(r => r.examName))).join(', ')}</p>
                <p className="text-sm text-red-700">Available Years: {Array.from(new Set(results.map(r => r.year))).join(', ')}</p>
                <p className="text-sm text-red-700">Available Terms: {Array.from(new Set(results.map(r => r.term))).join(', ')}</p>
                <p className="text-sm text-red-700">Class Results: {getClassResults(selectedClassForBulk).length}</p>
                <p className="text-sm text-red-700">Students: {getClassStudents(selectedClassForBulk).length}</p>
                <p className="text-sm text-red-700">Sample Student: {getClassStudents(selectedClassForBulk)[0]?.studentName || 'None'}</p>
              </div>
              {/* Enhanced Class Summary with Performance Metrics */}
              <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Class Performance Summary</h4>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                    {getClassStudents(selectedClassForBulk).length} Students
                  </Badge>
                  </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users2 className="h-5 w-5 text-blue-600" />
                    </div>
                      <div className="text-3xl font-bold text-blue-600">
                    {getClassStudents(selectedClassForBulk).length || 0}
                  </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">Total Students</div>
                    <div className="text-xs text-slate-500 mt-1">Enrolled in class</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {getClassStudents(selectedClassForBulk).filter(s => s.percentage >= 40).length || 0}
                      </div>
                  </div>
                    <div className="text-sm font-semibold text-slate-900">Passed Students</div>
                    <div className="text-xs text-slate-500 mt-1">Above 40% marks</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="text-3xl font-bold text-amber-600">
                        {getClassStudents(selectedClassForBulk).length > 0 
                          ? Math.round(getClassStudents(selectedClassForBulk).reduce((sum, s) => sum + s.percentage, 0) / getClassStudents(selectedClassForBulk).length)
                          : 0
                        }
                      </div>
                  </div>
                    <div className="text-sm font-semibold text-slate-900">Average %</div>
                    <div className="text-xs text-slate-500 mt-1">Class performance</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookMarked className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        {Array.from(new Set(getClassResults(selectedClassForBulk).map(r => r.subject))).length || 0}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">Subjects</div>
                    <div className="text-xs text-slate-500 mt-1">Total subjects</div>
                  </div>
                </div>
                
                {/* Performance Chart */}
                <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200">
                  <h5 className="text-lg font-semibold text-slate-900 mb-4">Performance Distribution</h5>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-emerald-600">
                        {getClassStudents(selectedClassForBulk).filter(s => s.percentage >= 80).length}
                      </div>
                      <div className="text-xs text-slate-600">Excellent (80%+)</div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${getClassStudents(selectedClassForBulk).length > 0 ? (getClassStudents(selectedClassForBulk).filter(s => s.percentage >= 80).length / getClassStudents(selectedClassForBulk).length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        {getClassStudents(selectedClassForBulk).filter(s => s.percentage >= 60 && s.percentage < 80).length}
                      </div>
                      <div className="text-xs text-slate-600">Good (60-79%)</div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${getClassStudents(selectedClassForBulk).length > 0 ? (getClassStudents(selectedClassForBulk).filter(s => s.percentage >= 60 && s.percentage < 80).length / getClassStudents(selectedClassForBulk).length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                    <div className="text-2xl font-bold text-amber-600">
                        {getClassStudents(selectedClassForBulk).filter(s => s.percentage >= 40 && s.percentage < 60).length}
                    </div>
                      <div className="text-xs text-slate-600">Average (40-59%)</div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${getClassStudents(selectedClassForBulk).length > 0 ? (getClassStudents(selectedClassForBulk).filter(s => s.percentage >= 40 && s.percentage < 60).length / getClassStudents(selectedClassForBulk).length) * 100 : 0}%` }}></div>
                  </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-red-600">
                        {getClassStudents(selectedClassForBulk).filter(s => s.percentage < 40).length}
                      </div>
                      <div className="text-xs text-slate-600">Below Average</div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${getClassStudents(selectedClassForBulk).length > 0 ? (getClassStudents(selectedClassForBulk).filter(s => s.percentage < 40).length / getClassStudents(selectedClassForBulk).length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Student List */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Student Marksheets</h4>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {getClassStudents(selectedClassForBulk).length} Students
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const [className, examName, year, term] = selectedClassForBulk.split('-')
                        router.push(`/schooladmin/results/marksheet/class/${className}?exam=${examName}&year=${year}&term=${term}`)
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getClassStudents(selectedClassForBulk).map((student, index) => (
                    <div key={student.studentId} className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-300 group">
                      {/* Student Header */}
                      <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-slate-200">
                              <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {student.studentName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                            <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              student.percentage >= 80 ? 'bg-emerald-500 text-white' :
                              student.percentage >= 60 ? 'bg-blue-500 text-white' :
                              student.percentage >= 40 ? 'bg-amber-500 text-white' :
                              'bg-red-500 text-white'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                    <div>
                            <div className="font-bold text-slate-900 text-base">{student.studentName}</div>
                            <div className="text-sm text-slate-600 font-medium">Roll: {student.rollNumber}</div>
                    </div>
                  </div>
                        <Badge className={`text-sm font-bold px-3 py-1 ${
                          student.percentage >= 80 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          student.percentage >= 60 ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          student.percentage >= 40 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {student.percentage}%
                        </Badge>
                    </div>
                      
                      {/* Performance Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 font-medium">Total Marks:</span>
                          <span className="font-bold text-slate-900 text-lg">{student.totalMarks}/{student.totalMax}</span>
                    </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 font-medium">Subjects:</span>
                          <span className="font-bold text-slate-900">{student.subjects.length}</span>
                    </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 font-medium">Status:</span>
                          <span className={`font-bold text-sm px-2 py-1 rounded-full ${
                            student.percentage >= 40 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.percentage >= 40 ? 'PASS' : 'FAIL'}
                          </span>
                    </div>
                    </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Performance</span>
                          <span className="font-medium">{student.percentage}%</span>
                    </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              student.percentage >= 80 ? 'bg-emerald-500' :
                              student.percentage >= 60 ? 'bg-blue-500' :
                              student.percentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.percentage}%` }}
                          ></div>
                    </div>
                    </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-slate-200">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-9 text-sm font-medium hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => {
                            const result = student.subjects[0]
                            setSelectedMarksheetResult(result)
                            setMarksheetModalOpen(true)
                            setBulkMarksheetModalOpen(false)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-9 text-sm font-medium hover:bg-green-50 hover:border-green-300"
                          onClick={() => {
                            router.push(`/schooladmin/results/marksheet/${student.subjects[0].id}`)
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          View Full
                        </Button>
                  </div>
            </div>
          ))}
                </div>
              </div>
              
              <DialogFooter className="border-t border-slate-200 pt-6">
                <Button variant="outline" onClick={() => setBulkMarksheetModalOpen(false)}>
                  Close
                    </Button>
                <Button onClick={() => {
                  const [className, examName, year, term] = selectedClassForBulk.split('-')
                  router.push(`/schooladmin/results/marksheet/class/${className}?exam=${examName}&year=${year}&term=${term}`)
                }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Download className="h-4 w-4 mr-2" />
                  View All Marksheets
                    </Button>
              </DialogFooter>
                  </div>
      )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

