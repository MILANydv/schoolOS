
"use client"
import * as React from "react"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { classesApi, studentsApi, attendanceApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  CalendarIcon,
  Users,
  Save,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Download,
  Printer,
  UserCheck,
  UserX,
  Timer,
  Info,
  Bell,
  Loader2,
  Filter,
  X,
  BarChart3,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Target,
  Activity,
  Eye,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Undo2,
  Keyboard,
  SortAsc,
  SortDesc,
  FilterX,
} from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { cn } from "@/lib/utils"
import { toast, Toaster } from "sonner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { USER_ROLES } from "@/lib/constants"
import { useAuthStore } from "@/hooks/useAuthStore"

// Consistent spacing system
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}

// Predefined reasons for better UX
const PREDEFINED_REASONS = [
  { id: "sick", label: "Sick/Medical", category: "health" },
  { id: "family", label: "Family Emergency", category: "personal" },
  { id: "transport", label: "Transportation Issues", category: "logistics" },
  { id: "weather", label: "Weather Conditions", category: "external" },
  { id: "appointment", label: "Medical Appointment", category: "health" },
  { id: "personal", label: "Personal Reasons", category: "personal" },
  { id: "leave", label: "Leave", category: "leave" },
  { id: "other", label: "Other", category: "other" },
]



// Add a helper function for date-only comparison
function isSameOrBetween(date: Date, start: Date, end: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  return d >= s && d <= e
}

// Add a mock userRole variable for demonstration


export default function AttendancePage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({})
  const [attendanceReasons, setAttendanceReasons] = useState<{ [key: string]: string }>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("attendance")
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false)
  const [selectedStudentForReason, setSelectedStudentForReason] = useState<string>("")
  const [tempReason, setTempReason] = useState("")
  const [selectedPredefinedReason, setSelectedPredefinedReason] = useState("")
  const [mounted, setMounted] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState(false)
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<any>(null)
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [actionHistory, setActionHistory] = useState<any[]>([])
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [leaveStatusFilter, setLeaveStatusFilter] = useState("all")
  const [analyticsDateRange, setAnalyticsDateRange] = useState<"thisMonth" | "lastMonth">("thisMonth")
  const [analyticsCompareBy, setAnalyticsCompareBy] = useState<"class" | "student">("class")
  const [leaveDateRange, setLeaveDateRange] = useState<"thisMonth" | "lastMonth">("thisMonth")
  const tableRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  // Fetch Classes
  const { data: classesData, isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll
  })
  const classes = classesData?.data || []

  // Fetch Students
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.getAll
  })
  const allStudents = studentsData?.data || []

  // Filter students by selected class
  const students = useMemo(() => {
    if (selectedClass === 'all') return allStudents
    return allStudents.filter((s: any) => s.classId === selectedClass || (s.grade + '-' + s.section) === selectedClass)
  }, [allStudents, selectedClass])

  const isLoading = classesLoading || studentsLoading

  // Save Attendance Mutation
  const saveAttendanceMutation = useMutation({
    mutationFn: async () => {
      const promises = Object.entries(attendance).map(([studentId, status]) => {
        // Find student to get classId if needed
        const student = allStudents.find((s: any) => s.id === studentId)
        return attendanceApi.mark({
          studentId,
          status: status.toUpperCase(),
          date: selectedDate.toISOString(),
          classId: student?.classId
        })
      })
      return Promise.all(promises)
    },
    onSuccess: () => {
      toast.success("Attendance saved successfully")
      setLastSaved(new Date())
    },
    onError: (error: any) => {
      toast.error("Failed to save attendance")
      console.error(error)
    }
  })

  const handleSaveAttendance = (silent = false) => {
    if (Object.keys(attendance).length === 0) return

    if (!silent) {
      toast.promise(saveAttendanceMutation.mutateAsync(), {
        loading: 'Saving attendance...',
        success: 'Attendance saved',
        error: 'Failed to save'
      })
    } else {
      saveAttendanceMutation.mutate()
    }
  }

  // Enhanced filtering and sorting
  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student: any) => {
      // Class filter is already applied in 'students' memo, but double check if 'all' was selected
      const classMatch = selectedClass === "all" || student.classId === selectedClass || (student.grade + '-' + student.section) === selectedClass

      const searchMatch =
        (student.firstName + ' ' + student.lastName).toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (student.rollNumber || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase())

      const currentStatus = attendance[student.id] || student.status || 'present' // Default to present if unknown
      const statusMatch = statusFilter === "all" || currentStatus === statusFilter

      return classMatch && searchMatch && statusMatch
    })

    // Sorting
    filtered.sort((a: any, b: any) => {
      let aValue: any = a[sortField as keyof typeof a]
      let bValue: any = b[sortField as keyof typeof b]

      if (sortField === "name") {
        aValue = a.firstName + ' ' + a.lastName
        bValue = b.firstName + ' ' + b.lastName
      }

      if (sortField === "status") {
        aValue = attendance[a.id] || a.status || 'present'
        bValue = attendance[b.id] || b.status || 'present'
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [selectedClass, debouncedSearchTerm, statusFilter, attendance, sortField, sortDirection, students])

  useEffect(() => {
    setMounted(true)
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth"
  }, [])

  // Debounced search for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Debounce batching for auto-save
  useEffect(() => {
    if (!autoSaveEnabled) return
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    if (Object.keys(attendance).length > 0) {
      saveTimeout.current = setTimeout(() => {
        handleSaveAttendance(true)
      }, 2000)
    }
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [attendance, autoSaveEnabled])

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            handleSaveAttendance()
            break
          case "f":
            e.preventDefault()
            searchInputRef.current?.focus()
            break
          case "1":
            e.preventDefault()
            setActiveTab("attendance")
            break
          case "2":
            e.preventDefault()
            setActiveTab("leaves")
            break
          case "3":
            e.preventDefault()
            setActiveTab("analytics")
            break
          case "a":
            e.preventDefault()
            handleSelectAll(!selectedStudents.length)
            break
          case "k":
            e.preventDefault()
            setShowKeyboardShortcuts(true)
            break
        }
      }
      // ESC key handling
      if (e.key === "Escape") {
        setSelectedStudents([])
        setSearchTerm("")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [selectedStudents])

  // Enhance scrolling: smooth scroll and auto-scroll to first student row after class select
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.style.scrollBehavior = "smooth"
      // Auto-scroll to first row
      const firstRow = tableRef.current.querySelector("tbody tr")
      if (firstRow) (firstRow as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [selectedClass])

  // Keyboard navigation for table
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement && (document.activeElement as HTMLElement).tagName === "TEXTAREA") return
      // Only handle if table is in view
      if (!tableRef.current) return
      const rows = Array.from(tableRef.current.querySelectorAll("tbody tr"))
      if (!rows.length) return

      let focusedIndex = rows.findIndex((row) => row.classList.contains("ring-2"))
      if (focusedIndex === -1) focusedIndex = 0

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const next = Math.min(focusedIndex + 1, rows.length - 1)
        rows.forEach((row) => row.classList.remove("ring-2", "ring-indigo-500"))
        rows[next].classList.add("ring-2", "ring-indigo-500")
        rows[next].scrollIntoView({ behavior: "smooth", block: "center" })
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = Math.max(focusedIndex - 1, 0)
        rows.forEach((row) => row.classList.remove("ring-2", "ring-indigo-500"))
        rows[prev].classList.add("ring-2", "ring-indigo-500")
        rows[prev].scrollIntoView({ behavior: "smooth", block: "center" })
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault()
        const row = rows[focusedIndex]
        if (!row) return
        const toggles = Array.from(row.querySelectorAll('[role="button"]'))
        const current = toggles.findIndex((btn) => btn === document.activeElement)
        let nextIdx = current
        if (e.key === "ArrowRight") nextIdx = Math.min(current + 1, toggles.length - 1)
        if (e.key === "ArrowLeft") nextIdx = Math.max(current - 1, 0)
        if (toggles[nextIdx]) (toggles[nextIdx] as HTMLElement).focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // On client, update leaveRequests to use dynamic dates for demo
  useEffect(() => {
    // Only run on client
    const today = new Date()
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === "1"
          ? {
            ...leave,
            startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
              .toISOString()
              .slice(0, 10),
            endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().slice(0, 10),
          }
          : leave,
      ),
    )
  }, [])

  const handleMarkAll = useCallback(
    (status: string) => {
      const newAttendance: { [key: string]: string } = {}
      filteredAndSortedStudents.forEach((student: any) => {
        newAttendance[student.id] = status
      })
      setAttendance((prev) => ({ ...prev, ...newAttendance }))
      toast.success(`Marked all ${filteredAndSortedStudents.length} students as ${status} `, {
        icon: <Sparkles className="h-4 w-4" />,
      })
    },
    [filteredAndSortedStudents],
  )

  const handleAttendanceChange = useCallback(
    (studentId: string, status: string) => {
      setActionHistory((prev) => [
        ...prev.slice(-9),
        {
          type: "attendance_change",
          studentId,
          oldStatus: attendance[studentId],
          newStatus: status,
          timestamp: new Date(),
        },
      ])
      setAttendance((prev) => ({
        ...prev,
        [studentId]: status,
      }))
      if (status === "absent" || status === "late" || status === "leave") {
        setSelectedStudentForReason(studentId)
        setTempReason(attendanceReasons[studentId] || "")
        setSelectedPredefinedReason("")
        setIsReasonDialogOpen(true)
      }
      if ("vibrate" in navigator) {
        navigator.vibrate(50)
      }
    },
    [attendanceReasons, attendance],
  )

  const handleReasonSave = useCallback(() => {
    if (selectedStudentForReason) {
      const finalReason = selectedPredefinedReason
        ? PREDEFINED_REASONS.find((r) => r.id === selectedPredefinedReason)?.label || tempReason
        : tempReason.trim()
      if (finalReason) {
        setAttendanceReasons((prev) => ({
          ...prev,
          [selectedStudentForReason]: finalReason,
        }))
        toast.success("Reason saved successfully", {
          icon: <CheckCircle2 className="h-4 w-4" />,
        })
      }
    }
    setIsReasonDialogOpen(false)
    setSelectedStudentForReason("")
    setTempReason("")
    setSelectedPredefinedReason("")
  }, [selectedStudentForReason, tempReason, selectedPredefinedReason])

  const handleBulkAction = useCallback(
    (status: string) => {
      if (selectedStudents.length === 0) {
        toast.error("Please select students first")
        return
      }
      const newAttendance = { ...attendance }
      selectedStudents.forEach((studentId) => {
        newAttendance[studentId] = status
      })
      setAttendance(newAttendance)
      setSelectedStudents([])
      toast.success(`Marked ${selectedStudents.length} students as ${status} `, {
        icon: <Target className="h-4 w-4" />,
      })
    },
    [selectedStudents, attendance],
  )

  // Pagination
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedStudents.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedStudents, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage)

  const selectedClassData = classes.find((c: any) => c.id === selectedClass)

  // Attendance Stats
  const total = filteredAndSortedStudents.length
  const present = filteredAndSortedStudents.filter((s: any) => (attendance[s.id] || s.status) === "present").length
  const absent = filteredAndSortedStudents.filter((s: any) => (attendance[s.id] || s.status) === "absent").length
  const late = filteredAndSortedStudents.filter((s: any) => (attendance[s.id] || s.status) === "late").length
  const attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0

  // Filtered Leaves (based on selectedClass, leaveStatusFilter, and leaveDateRange)
  const filteredLeaves = useMemo(() => {
    return leaveRequests.filter((leave) => {
      const classMatch = selectedClass === "all" || leave.class === selectedClass
      const statusMatch = leaveStatusFilter === "all" || leave.status === leaveStatusFilter
      // For demo, filter by startDate month
      const date = new Date(leave.startDate)
      const now = new Date()
      const monthMatch =
        leaveDateRange === "thisMonth"
          ? date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          : date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear()
      return classMatch && statusMatch && monthMatch
    })
  }, [leaveRequests, selectedClass, leaveStatusFilter, leaveDateRange])

  const pendingLeavesCount = filteredLeaves.filter((leave) => leave.status === "pending").length
  const approvedLeavesCount = filteredLeaves.filter((leave) => leave.status === "approved").length
  const rejectedLeavesCount = filteredLeaves.filter((leave) => leave.status === "rejected").length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <UserCheck className="h-4 w-4 text-emerald-600" />
      case "absent":
        return <UserX className="h-4 w-4 text-red-500" />
      case "late":
        return <Timer className="h-4 w-4 text-amber-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium px-3 py-1 rounded-full border transition-all duration-200"
    switch (status) {
      case "present":
        return `${baseClasses} bg - emerald - 100 text - emerald - 800 border - emerald - 300 shadow - sm`
      case "absent":
        return `${baseClasses} bg - red - 100 text - red - 800 border - red - 300 shadow - sm`
      case "late":
        return `${baseClasses} bg - amber - 100 text - amber - 800 border - amber - 300 shadow - sm`
      default:
        return `${baseClasses} bg - gray - 100 text - gray - 800 border - gray - 300 shadow - sm`
    }
  }

  const getLeaveStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium px-3 py-1 rounded-full border transition-all duration-200"
    switch (status) {
      case "approved":
        return `${baseClasses} bg - emerald - 100 text - emerald - 800 border - emerald - 300 shadow - sm`
      case "rejected":
        return `${baseClasses} bg - red - 100 text - red - 800 border - red - 300 shadow - sm`
      case "pending":
        return `${baseClasses} bg - amber - 100 text - amber - 800 border - amber - 300 shadow - sm`
      default:
        return `${baseClasses} bg - gray - 100 text - gray - 800 border - gray - 300 shadow - sm`
    }
  }

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "text-xs font-medium px-2 py-1 rounded-full"
    switch (priority) {
      case "high":
        return `${baseClasses} bg - red - 100 text - red - 700`
      case "medium":
        return `${baseClasses} bg - yellow - 100 text - yellow - 700`
      case "low":
        return `${baseClasses} bg - green - 100 text - green - 700`
      default:
        return `${baseClasses} bg - gray - 100 text - gray - 700`
    }
  }

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return "text-emerald-600"
    if (rate >= 75) return "text-amber-600"
    return "text-red-600"
  }

  const handleExportCSV = useCallback(() => {
    const csvData = [
      ["Student Name", "Roll Number", "Class", "Status", "Reason", "Date", "Attendance Rate", "Email", "Phone"].join(
        ",",
      ),
      ...filteredAndSortedStudents.map((student: any) => {
        const status = attendance[student.id] || student.status
        const reason = attendanceReasons[student.id] || student.reason || ""
        return [
          student.name,
          student.rollNumber,
          student.class,
          status,
          reason,
          format(selectedDate, "yyyy-MM-dd"),
          `${student.attendanceRate}% `,
          student.email,
          student.phone,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance - ${format(selectedDate, "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Attendance exported successfully!", {
      icon: <Download className="h-4 w-4" />,
    })
  }, [filteredAndSortedStudents, attendance, attendanceReasons, selectedDate])

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId])
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(paginatedStudents.map((s: any) => s.id))
    } else {
      setSelectedStudents([])
    }
  }

  const openStudentProfile = (student: any) => {
    setSelectedStudentProfile(student)
    setIsStudentProfileOpen(true)
  }


  const handleLeaveAction = useCallback((leaveId: string, action: "approve" | "reject") => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId ? { ...leave, status: action === "approve" ? "approved" : "rejected" } : leave,
      ),
    )
    toast.success(`Leave request ${action}d successfully`, {
      icon: action === "approve" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />,
    })
  }, [])

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortField(field)
        setSortDirection("asc")
      }
    },
    [sortField, sortDirection],
  )

  const handleUndo = useCallback(() => {
    if (actionHistory.length === 0) return
    const lastAction = actionHistory[actionHistory.length - 1]
    if (lastAction.type === "attendance_change") {
      setAttendance((prev) => ({
        ...prev,
        [lastAction.studentId]: lastAction.oldStatus || "present",
      }))
      setActionHistory((prev) => prev.slice(0, -1))
      toast.success("Action undone", {
        icon: <Undo2 className="h-4 w-4" />,
      })
    }
  }, [actionHistory])

  // Analytics tab: filter analytics data/cards by selected class, date range, and compare-by
  const analyticsClassData = useMemo(() => {
    // Mock: filter by selectedClass and analyticsDateRange
    const all = [
      { class: "10-A", percent: 93, present: 28, absent: 2, late: 1, trend: [90, 92, 93, 94, 93, 92, 93] },
      { class: "10-B", percent: 83, present: 25, absent: 5, late: 0, trend: [80, 82, 85, 83, 84, 83, 83] },
      { class: "9-A", percent: 100, present: 30, absent: 0, late: 0, trend: [100, 100, 100, 100, 100, 100, 100] },
      { class: "8-C", percent: 71, present: 20, absent: 8, late: 2, trend: [70, 72, 71, 73, 71, 70, 71] },
      { class: "7-B", percent: 90, present: 27, absent: 3, late: 0, trend: [88, 89, 90, 91, 90, 90, 90] },
    ]
    let filtered = all
    if (selectedClass !== "all")
      filtered = filtered.filter((c) => c.class === classes.find((cls: any) => cls.id === selectedClass)?.name)
    // For demo, just swap data for lastMonth
    if (analyticsDateRange === "lastMonth") filtered = filtered.map((c) => ({ ...c, percent: c.percent - 5 }))
    return filtered
  }, [selectedClass, analyticsDateRange, classes])

  const analyticsStudentData = useMemo(() => {
    // Mock: per-student analytics for selected class/date range
    const all = [
      { name: "John Smith", class: "10-B", percent: 68 },
      { name: "Priya Patel", class: "10-A", percent: 72 },
      { name: "Amit Kumar", class: "8-C", percent: 69 },
      { name: "Sara Lee", class: "7-B", percent: 74 },
    ]
    return selectedClass === "all"
      ? all
      : all.filter((s) => s.class === classes.find((cls: any) => cls.id === selectedClass)?.name)
  }, [selectedClass, classes])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading attendance system...</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Toaster position="top-right" richColors />
      {/* Enhanced Fixed Header */}
      <Card className="sticky top-0 z-50 w-full bg-white/95 border-b border-gray-200 shadow-sm print:hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1"></div>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Always show class selector */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-64 bg-white border-gray-200 hover:bg-gray-50">
                  <SelectValue>
                    {classes.find((cls: any) => cls.id === selectedClass)?.name || "Select Class"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Attendance tab filters */}
            {activeTab === "attendance" && (
              <>
                {/* Date selector */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="font-medium bg-white border-gray-200 hover:bg-gray-50 min-w-[180px] justify-start"
                      >
                        <span className="mr-2">
                          {isToday(selectedDate)
                            ? "Today"
                            : isYesterday(selectedDate)
                              ? "Yesterday"
                              : format(selectedDate, "MMM dd, yyyy")}
                        </span>
                        {isToday(selectedDate) && (
                          <Badge variant="secondary" className="ml-auto">
                            Live
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={isToday(selectedDate) ? "default" : "outline"}
                        onClick={() => setSelectedDate(new Date())}
                        className="bg-indigo-500 text-white hover:bg-indigo-600"
                      >
                        Today
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Jump to today (Ctrl+T)</TooltipContent>
                  </Tooltip>
                </div>
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search students, roll numbers, emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500"
                  />
                  {searchTerm && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {/* Status filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-white border-gray-200">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
                {(searchTerm || statusFilter !== "all") && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("")
                          setStatusFilter("all")
                        }}
                      >
                        <FilterX className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear filters</TooltipContent>
                  </Tooltip>
                )}
              </>
            )}
            {/* Analytics tab filters */}
            {activeTab === "analytics" && (
              <>
                {/* Date range selector (mock) */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Select
                    value={analyticsDateRange}
                    onValueChange={(val) =>
                      setAnalyticsDateRange(val === "thisMonth" || val === "lastMonth" ? val : "thisMonth")
                    }
                  >
                    <SelectTrigger className="min-w-[180px] bg-white border-gray-200 hover:bg-gray-50">
                      <SelectValue>{analyticsDateRange === "thisMonth" ? "This Month" : "Last Month"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Compare by: class or student */}
                <Select
                  value={analyticsCompareBy}
                  onValueChange={(val) =>
                    setAnalyticsCompareBy(val === "class" || val === "student" ? val : "class")
                  }
                >
                  <SelectTrigger className="w-40 bg-white border-gray-200">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <SelectValue>
                      Compare by: {analyticsCompareBy.charAt(0).toUpperCase() + analyticsCompareBy.slice(1)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            {/* Leave Requests tab filters */}
            {activeTab === "leaves" && (
              <>
                {/* Status filter */}
                <Select value={leaveStatusFilter} onValueChange={setLeaveStatusFilter}>
                  <SelectTrigger className="w-40 bg-white border-gray-200">
                    <Bell className="h-4 w-4 mr-2" />
                    <SelectValue>{leaveStatusFilter.charAt(0).toUpperCase() + leaveStatusFilter.slice(1)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {/* Date range selector (mock) */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Select
                    value={leaveDateRange}
                    onValueChange={(val) =>
                      setLeaveDateRange(val === "thisMonth" || val === "lastMonth" ? val : "thisMonth")
                    }
                  >
                    <SelectTrigger className="min-w-[180px] bg-white border-gray-200 hover:bg-gray-50">
                      <SelectValue>
                        {leaveDateRange === "thisMonth" ? "This Month" : "Last Month"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          {/* Context-aware summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
            {activeTab === "attendance" ? (
              <>
                {/* Attendance tab: show today's/selected date stats */}
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm font-medium">
                          Total Students <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">Today</span>
                        </p>
                        <p className="text-3xl font-bold">{total}</p>
                        <p className="text-indigo-200 text-sm">{selectedClassData?.name || "All Classes"}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <Users className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">
                          Present <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">Today</span>
                        </p>
                        <p className="text-3xl font-bold">{present}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={attendancePercentage} className="w-16 h-2 bg-emerald-400" />
                          <span className="text-emerald-200 text-sm">{attendancePercentage}%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <UserCheck className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm font-medium">
                          Absent <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">Today</span>
                        </p>
                        <p className="text-3xl font-bold">{absent}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={total > 0 ? (absent / total) * 100 : 0} className="w-16 h-2 bg-red-400" />
                          <span className="text-red-200 text-sm">
                            {total > 0 ? ((absent / total) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <UserX className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm font-medium">
                          Late <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">Today</span>
                        </p>
                        <p className="text-3xl font-bold">{late}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={total > 0 ? (late / total) * 100 : 0} className="w-16 h-2 bg-amber-400" />
                          <span className="text-amber-200 text-sm">
                            {total > 0 ? ((late / total) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <Timer className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : activeTab === "analytics" ? (
              <>
                {/* Analytics tab: show analytics context stats (mock data for this month) */}
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm font-medium">
                          Total Students{" "}
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                            {analyticsDateRange === "thisMonth" ? "This Month" : "Last Month"}
                          </span>
                        </p>
                        <p className="text-3xl font-bold">150</p>
                        <p className="text-indigo-200 text-sm">All Classes</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <Users className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">
                          Avg. Attendance{" "}
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                            {analyticsDateRange === "thisMonth" ? "This Month" : "Last Month"}
                          </span>
                        </p>
                        <p className="text-3xl font-bold">91%</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={91} className="w-16 h-2 bg-emerald-400" />
                          <span className="text-emerald-200 text-sm">91%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <UserCheck className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm font-medium">
                          Total Absences{" "}
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                            {analyticsDateRange === "thisMonth" ? "This Month" : "Last Month"}
                          </span>
                        </p>
                        <p className="text-3xl font-bold">18</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={12} className="w-16 h-2 bg-red-400" />
                          <span className="text-red-200 text-sm">12%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <UserX className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm font-medium">
                          Total Late{" "}
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                            {analyticsDateRange === "thisMonth" ? "This Month" : "Last Month"}
                          </span>
                        </p>
                        <p className="text-3xl font-bold">7</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={5} className="w-16 h-2 bg-amber-400" />
                          <span className="text-amber-200 text-sm">5%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <Timer className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Leave Requests tab: show leave-related stats */}
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm font-medium">
                          Total Leave Requests{" "}
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                            {leaveDateRange === "thisMonth" ? "This Month" : "Last Month"}
                          </span>
                        </p>
                        <p className="text-3xl font-bold">{filteredLeaves.length}</p>
                        <p className="text-indigo-200 text-sm">{selectedClassData?.name || "All Classes"}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <FileText className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm font-medium">
                          Pending{" "}
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                            {leaveDateRange === "thisMonth" ? "This Month" : "Last Month"}
                          </span>
                        </p>
                        <p className="text-3xl font-bold">{pendingLeavesCount}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <Bell className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">
                          Approved{" "}
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                            {leaveDateRange === "thisMonth" ? "This Month" : "Last Month"}
                          </span>
                        </p>
                        <p className="text-3xl font-bold">{approvedLeavesCount}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm font-medium">
                          Rejected{" "}
                          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">
                            {leaveDateRange === "thisMonth" ? "This Month" : "Last Month"}
                          </span>
                        </p>
                        <p className="text-3xl font-bold">{rejectedLeavesCount}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <XCircle className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          {/* Enhanced Tabs moved below overview cards */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger
                value="attendance"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
              >
                <Users className="h-4 w-4" />
                <span className="font-medium">Attendance</span>
                <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
                  {total}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="leaves"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
              >
                <FileText className="h-4 w-4" />
                <span className="font-medium">Leave Requests</span>
                <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
                  {filteredLeaves.length}
                </Badge>
                {pendingLeavesCount > 0 && <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>}
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="font-medium">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      {/* Main Content: scrollable table below sticky filter */}
      <div className="w-full print:block print:w-full print:bg-white print:border-none print:shadow-none">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-8">
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto w-full">
              {/* If 'All Classes' is selected, show message and summary, disable marking */}
              {selectedClass === "all" ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a class to mark attendance</h3>
                  <p className="text-gray-500">
                    Attendance marking is only available for a specific class. Use 'All Classes' to view summary or
                    analytics.
                  </p>
                  {/* Optionally, show a summary table or stats here */}
                </div>
              ) : (
                <Card className="border-0 shadow-lg w-full">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        Students ({total})
                        {selectedStudents.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedStudents.length} selected
                          </Badge>
                        )}
                      </CardTitle>
                      {/* Quick Actions in table header */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAll("present")}
                          className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Mark All Present
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportCSV}
                          className="hover:bg-blue-50 bg-transparent"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                          className="hover:bg-purple-50"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                        {/* Save Attendance button, right-aligned */}
                        <Button
                          onClick={() => handleSaveAttendance()}
                          disabled={isLoading}
                          className="ml-auto bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg transition-all duration-200"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Attendance
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 w-full">
                    {/* Scrollable table container, sticky table header */}
                    <div ref={tableRef} className="overflow-hidden border rounded-lg w-full">
                      <div className="overflow-x-auto w-full">
                        <div className="max-h-[calc(100vh-220px)] overflow-y-auto w-full">
                          <table className="w-full">
                            <thead className="sticky top-0 z-30 bg-white border-b">
                              <tr>
                                <th className="px-6 py-4 text-left w-12">
                                  <Checkbox
                                    checked={
                                      selectedStudents.length === paginatedStudents.length &&
                                      paginatedStudents.length > 0
                                    }
                                    onCheckedChange={handleSelectAll}
                                  />
                                </th>
                                <th className="px-6 py-4 text-left">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort("name")}
                                    className="font-semibold text-gray-600 hover:text-gray-900 p-0 h-auto"
                                  >
                                    Student
                                    {sortField === "name" && (
                                      <span className="ml-1">
                                        {sortDirection === "asc" ? (
                                          <SortAsc className="h-3 w-3" />
                                        ) : (
                                          <SortDesc className="h-3 w-3" />
                                        )}
                                      </span>
                                    )}
                                  </Button>
                                </th>
                                <th className="px-6 py-4 text-left">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort("class")}
                                    className="font-semibold text-gray-600 hover:text-gray-900 p-0 h-auto"
                                  >
                                    Class & Performance
                                    {sortField === "class" && (
                                      <span className="ml-1">
                                        {sortDirection === "asc" ? (
                                          <SortAsc className="h-3 w-3" />
                                        ) : (
                                          <SortDesc className="h-3 w-3" />
                                        )}
                                      </span>
                                    )}
                                  </Button>
                                </th>
                                <th className="px-6 py-4 text-left">
                                  <span className="font-semibold text-gray-600">Contact</span>
                                </th>
                                <th className="px-6 py-4 text-left">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort("status")}
                                    className="font-semibold text-gray-600 hover:text-gray-900 p-0 h-auto"
                                  >
                                    Status
                                    {sortField === "status" && (
                                      <span className="ml-1">
                                        {sortDirection === "asc" ? (
                                          <SortAsc className="h-3 w-3" />
                                        ) : (
                                          <SortDesc className="h-3 w-3" />
                                        )}
                                      </span>
                                    )}
                                  </Button>
                                </th>
                                <th className="px-6 py-4 text-left">
                                  <span className="font-semibold text-gray-600">Actions</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {paginatedStudents.map((student, index) => {
                                const isOnApprovedLeave = leaveRequests.some(
                                  (leave) =>
                                    leave.studentId === student.id &&
                                    leave.status === "approved" &&
                                    isSameOrBetween(selectedDate, new Date(leave.startDate), new Date(leave.endDate)),
                                )
                                const status = attendance[student.id] || (isOnApprovedLeave ? "leave" : "")
                                const reason = attendanceReasons[student.id] || student.reason
                                const isSelected = selectedStudents.includes(student.id)
                                const pendingOrRejectedLeave = leaveRequests.find(
                                  (leave) =>
                                    leave.studentId === student.id &&
                                    (leave.status === "pending" || leave.status === "rejected") &&
                                    isSameOrBetween(selectedDate, new Date(leave.startDate), new Date(leave.endDate)),
                                )
                                return (
                                  <tr
                                    key={student.id}
                                    className={cn(
                                      "hover:bg-gray-50 transition-all duration-200 group",
                                      isSelected && "bg-indigo-50 border-indigo-200",
                                    )}
                                  >
                                    <td className="px-6 py-4">
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) =>
                                          handleStudentSelect(student.id, checked as boolean)
                                        }
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-4">
                                        <div className="relative">
                                          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                                              {student.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div
                                            className={cn(
                                              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                                              status === "present"
                                                ? "bg-emerald-500"
                                                : status === "absent"
                                                  ? "bg-red-500"
                                                  : status === "late"
                                                    ? "bg-amber-500"
                                                    : "bg-gray-400",
                                            )}
                                          ></div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                                              {student.name}
                                            </h4>
                                            {pendingOrRejectedLeave && (
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <span>
                                                    {pendingOrRejectedLeave.status === "pending" ? (
                                                      <Info className="h-3 w-3 text-amber-500" />
                                                    ) : (
                                                      <Info className="h-3 w-3 text-red-500" />
                                                    )}
                                                  </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  {pendingOrRejectedLeave.status === "pending"
                                                    ? "Leave request pending approval."
                                                    : "Leave request was rejected."}
                                                </TooltipContent>
                                              </Tooltip>
                                            )}
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openStudentProfile(student)}
                                              className="h-6 w-6 p-0 hover:bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                          </div>
                                          <p className="text-sm text-gray-500">Roll: {student.rollNumber}</p>
                                          {reason && (
                                            <div className="flex items-center gap-1 mt-1">
                                              <Info className="h-3 w-3 text-amber-500" />
                                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full truncate max-w-32">
                                                {reason}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="space-y-2">
                                        <Badge variant="outline" className="font-medium">
                                          {student.class}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                          <div className="flex items-center gap-1">
                                            <Activity className="h-3 w-3 text-gray-400" />
                                            <span
                                              className={cn(
                                                "text-sm font-medium",
                                                getAttendanceRateColor(student.attendanceRate),
                                              )}
                                            >
                                              {student.attendanceRate}%
                                            </span>
                                          </div>
                                          <Progress value={student.attendanceRate} className="w-16 h-2" />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          Last: {format(new Date(student.lastAttendance), "MMM dd")}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                          <Mail className="h-3 w-3" />
                                          <span className="truncate max-w-32">{student.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                          <Phone className="h-3 w-3" />
                                          <span>{student.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <MapPin className="h-3 w-3" />
                                          <span className="truncate max-w-32">{student.address}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        {getStatusIcon(status)}
                                        <span className={getStatusBadge(status)}>
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <ToggleGroup
                                        type="single"
                                        value={isOnApprovedLeave ? "leave" : status}
                                        onValueChange={(val) => {
                                          if (!val || isOnApprovedLeave) return
                                          handleAttendanceChange(student.id, val)
                                        }}
                                        className="gap-1"
                                        size="sm"
                                        disabled={isOnApprovedLeave}
                                      >
                                        <ToggleGroupItem
                                          value="present"
                                          aria-label="Mark Present"
                                          className={
                                            status === "present"
                                              ? "bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700"
                                              : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                                          }
                                        >
                                          <UserCheck className="h-4 w-4" />
                                          Present
                                        </ToggleGroupItem>
                                        <ToggleGroupItem
                                          value="absent"
                                          aria-label="Mark Absent"
                                          className={
                                            status === "absent"
                                              ? "bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700"
                                              : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                                          }
                                        >
                                          <UserX className="h-4 w-4" />
                                          Absent
                                        </ToggleGroupItem>
                                        <ToggleGroupItem
                                          value="late"
                                          aria-label="Mark Late"
                                          className={
                                            status === "late"
                                              ? "bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700"
                                              : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                                          }
                                        >
                                          <Timer className="h-4 w-4" />
                                          Late
                                        </ToggleGroupItem>
                                        <ToggleGroupItem
                                          value="leave"
                                          aria-label="Mark Leave"
                                          className={
                                            status === "leave"
                                              ? "bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700"
                                              : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                                          }
                                        >
                                          <FileText className="h-4 w-4" />
                                          Leave
                                        </ToggleGroupItem>
                                      </ToggleGroup>
                                      {isOnApprovedLeave && (
                                        <span className="ml-2 text-xs text-blue-600 font-semibold">
                                          On Approved Leave
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, total)} of{" "}
                      {total} students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
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
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          {/* Enhanced Leave Requests Tab */}
          <TabsContent value="leaves" className="space-y-6">
            {/* Leave request cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-4">
              {filteredLeaves.map((leave) => (
                <div key={leave.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 relative border">
                  {/* Status badge */}
                  <span
                    className={`absolute top - 4 right - 4 px - 3 py - 1 rounded - full text - xs font - semibold shadow ${leave.status === "approved"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : leave.status === "pending"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                      } `}
                  >
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                  {/* Student info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                        {leave.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-lg">{leave.studentName}</div>
                      <div className="text-sm text-gray-500">
                        {leave.class} • Roll: {leave.rollNumber}
                      </div>
                    </div>
                  </div>
                  {/* Dates and reason */}
                  <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                    <CalendarDays className="h-4 w-4 text-indigo-500" />
                    <span>
                      {leave.startDate} to {leave.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Info className="h-4 w-4 text-amber-500" />
                    <span className="truncate" title={leave.reason}>
                      {leave.reason}
                    </span>
                  </div>
                  {/* Contact info */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                    <Mail className="h-3 w-3" /> <span>{leave.studentId}@school.edu</span>
                    <Phone className="h-3 w-3 ml-4" /> <span>{leave.parentContact}</span>
                  </div>
                  {/* Attachment */}
                  {leave.documents && leave.documents.length > 0 && (
                    <Button size="sm" variant="outline" className="mt-2 w-fit bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      {leave.documents.length} Attachment{leave.documents.length > 1 ? "s" : ""}
                    </Button>
                  )}
                  {/* Approve/Reject for admin & pending */}
                  {leave.status === "pending" && user?.role === "admin" && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLeaveAction(leave.id, "approve")}
                        className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLeaveAction(leave.id, "reject")}
                        className="hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                  {leave.status === "pending" && user?.role !== "admin" && (
                    <div className="text-xs text-gray-500 italic mt-4">
                      Only school admins can approve or reject leave requests.
                    </div>
                  )}
                </div>
              ))}
              {/* Empty state */}
              {filteredLeaves.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-400">
                  <FileText className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
                  <p>Try adjusting your filters or check back later.</p>
                </div>
              )}
            </div>
          </TabsContent>
          {/* Enhanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto w-full px-2 md:px-4 space-y-10 mt-4">
              {/* 1. Attendance Trends (chart) */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Attendance Trends (Last 7 Days)</h2>
                <div className="w-full flex items-end gap-3 h-32">
                  {[93, 91, 88, 95, 90, 87, 92].map((val, i) => (
                    <div key={i} className="flex flex-col items-center justify-end h-full">
                      <div
                        className={val >= 90 ? "bg-green-500" : val >= 75 ? "bg-amber-500" : "bg-red-500"}
                        style={{ height: `${val}% `, width: "22px", borderRadius: "8px" }}
                        title={`Day ${i + 1}: ${val}% `}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">D{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* 2. Class/Student Comparison (cards) */}
              <h2 className="text-lg font-semibold mt-8 mb-4">
                {analyticsCompareBy === "class" ? "Class Comparison" : "Student Comparison"}
              </h2>
              {analyticsCompareBy === "class" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsClassData.map((row, i) => (
                    <div key={i} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{row.class}</span>
                        <span
                          className={
                            row.percent >= 90 ? "text-green-600" : row.percent >= 75 ? "text-amber-600" : "text-red-600"
                          }
                        >
                          {row.percent}%
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm mt-2">
                        <span className="text-emerald-700">Present: {row.present}</span>
                        <span className="text-red-700">Absent: {row.absent}</span>
                        <span className="text-amber-700">Late: {row.late}</span>
                      </div>
                      {/* Mini trend sparkline (mock) */}
                      <div className="flex items-end gap-1 h-8 mt-2">
                        {row.trend.map((v, j) => (
                          <div
                            key={j}
                            className={v >= 90 ? "bg-green-400" : v >= 75 ? "bg-amber-400" : "bg-red-400"}
                            style={{ height: `${v / 4} px`, width: "6px", borderRadius: "2px" }}
                            title={`Day ${j + 1}: ${v}% `}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {analyticsStudentData.map((row, i) => (
                    <div
                      key={i}
                      className="min-w-[220px] bg-white rounded-xl shadow p-5 flex flex-col gap-2 items-start"
                    >
                      <span className="font-semibold text-lg">{row.name}</span>
                      <span className="text-sm text-gray-500">{row.class}</span>
                      <span className="text-red-600 font-bold text-xl">{row.percent}%</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Low</span>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Contact
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Enhanced Reason Dialog */}
      <Dialog open={isReasonDialogOpen} onOpenChange={setIsReasonDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Add Reason for {(() => {
                if (attendance[selectedStudentForReason] === "absent") return "Absence"
                if (attendance[selectedStudentForReason] === "late") return "Lateness"
                if (attendance[selectedStudentForReason] === "leave") return "Leave"
                return "Status"
              })()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Predefined Reasons */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quick Select Reason</Label>
              <div className="grid grid-cols-2 gap-2">
                {PREDEFINED_REASONS.map((reason) => (
                  <Button
                    key={reason.id}
                    variant={selectedPredefinedReason === reason.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedPredefinedReason(reason.id)
                      setTempReason(reason.label)
                    }}
                    className="justify-start text-xs h-8"
                  >
                    {reason.label}
                  </Button>
                ))}
              </div>
            </div>
            <Separator />
            {/* Custom Reason */}
            <div>
              <Label htmlFor="reason" className="text-sm font-medium">
                Custom Reason (Optional)
              </Label>
              <Textarea
                id="reason"
                placeholder="Enter a detailed reason..."
                value={tempReason}
                onChange={(e) => {
                  setTempReason(e.target.value)
                  setSelectedPredefinedReason("")
                }}
                className="mt-2 min-h-[80px] resize-none"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">{tempReason.length}/200 characters</p>
                {tempReason.length > 150 && <p className="text-xs text-amber-600">Consider keeping it concise</p>}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsReasonDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleReasonSave}
                disabled={!tempReason.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Reason
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Enhanced Student Profile Dialog */}
      <Dialog open={isStudentProfileOpen} onOpenChange={setIsStudentProfileOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                  {selectedStudentProfile?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              Student Profile
            </DialogTitle>
          </DialogHeader>
          {selectedStudentProfile && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Personal Information
                    </h3>
                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="text-gray-900">{selectedStudentProfile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Roll Number:</span>
                        <span className="text-gray-900">{selectedStudentProfile.rollNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Class:</span>
                        <Badge variant="outline">{selectedStudentProfile.class}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="text-gray-900 truncate">{selectedStudentProfile.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span className="text-gray-900">{selectedStudentProfile.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Address:</span>
                        <span className="text-gray-900 text-right">{selectedStudentProfile.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Attendance Summary
                    </h3>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Overall Rate</span>
                          <span
                            className={cn(
                              "text-sm font-bold",
                              getAttendanceRateColor(selectedStudentProfile.attendanceRate),
                            )}
                          >
                            {selectedStudentProfile.attendanceRate}%
                          </span>
                        </div>
                        <Progress value={selectedStudentProfile.attendanceRate} className="w-full h-3" />
                      </div>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Last Attendance:</span>
                          <span className="text-gray-900">
                            {format(new Date(selectedStudentProfile.lastAttendance), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Parent Contact:</span>
                          <span className="text-gray-900">{selectedStudentProfile.parentPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span>Save attendance</span>
                <Badge variant="outline" className="font-mono">
                  Ctrl+S
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Focus search</span>
                <Badge variant="outline" className="font-mono">
                  Ctrl+F
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Select all students</span>
                <Badge variant="outline" className="font-mono">
                  Ctrl+A
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Switch to Attendance</span>
                <Badge variant="outline" className="font-mono">
                  Ctrl+1
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Switch to Leaves</span>
                <Badge variant="outline" className="font-mono">
                  Ctrl+2
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Switch to Analytics</span>
                <Badge variant="outline" className="font-mono">
                  Ctrl+3
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Show shortcuts</span>
                <Badge variant="outline" className="font-mono">
                  Ctrl+K
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Clear selection</span>
                <Badge variant="outline" className="font-mono">
                  Esc
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <style jsx global>{`
@media print {
          .print\\:hidden {
    display: none!important;
  }
          .print\\:block {
    display: block!important;
  }
          .print\\: w - full {
    width: 100 % !important;
  }
          .print\\: border - none {
    border: none!important;
  }
          .print\\: shadow - none {
    box - shadow: none!important;
  }
          .print\\: bg - white {
    background: #fff!important;
  }
}
`}</style>
    </TooltipProvider>
  )
}
