"use client"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
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
  Plus,
  Settings,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Edit,
  Trash2,
  Copy,
  Share,
  Archive,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckSquare,
  Square,
  Minus,
  MoreHorizontal,
  ExternalLink,
  Database,
  Lock,
  Unlock,
  History,
  FileSpreadsheet,
  PieChart,
  LineChart,
  Users2,
  Building2,
  Briefcase,
  Home,
  School,
  Library,
  Bus,
  Wifi,
  ShieldCheck,
  UserCog,
  Cog,
  BellRing,
  MessageSquare,
  Send,
  Inbox,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Award,
  Trophy,
  Medal,
  Crown,
  DollarSign,
  CreditCard,
  Receipt,
  Calculator,
  Percent,
  Hash,
  HashIcon,
  AtSign,
} from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { cn } from "@/lib/utils"
import { toast, Toaster } from "sonner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MOCK_STAFF, USER_ROLES } from "@/lib/constants"

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

const mockStaff = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@school.edu",
    role: "TEACHER",
    status: "present",
    department: "Mathematics",
    lastAttendance: "2024-01-20",
    attendanceRate: 95,
    phone: "+1234567890",
    address: "123 Main St",
    profileImage: null,
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "michael.chen@school.edu",
    role: "TEACHER",
    status: "present",
    department: "Physics",
    lastAttendance: "2024-01-20",
    attendanceRate: 88,
    phone: "+1234567892",
    address: "456 Oak Ave",
    profileImage: null,
  },
  {
    id: "3",
    name: "Ms. Emily Davis",
    email: "emily.davis@school.edu",
    role: "TEACHER",
    status: "absent",
    department: "English",
    reason: "Sick",
    lastAttendance: "2024-01-18",
    attendanceRate: 78,
    phone: "+1234567894",
    address: "789 Pine Rd",
    profileImage: null,
  },
  {
    id: "4",
    name: "Mr. Robert Wilson",
    email: "robert.wilson@school.edu",
    role: "TEACHER",
    status: "present",
    department: "History",
    lastAttendance: "2024-01-20",
    attendanceRate: 97,
    phone: "+1234567896",
    address: "321 Elm St",
    profileImage: null,
  },
  {
    id: "5",
    name: "Mrs. Lisa Anderson",
    email: "lisa.anderson@school.edu",
    role: "ACCOUNTANT",
    status: "late",
    department: "Finance",
    reason: "Traffic",
    lastAttendance: "2024-01-20",
    attendanceRate: 82,
    phone: "+1234567898",
    address: "654 Maple Dr",
    profileImage: null,
  },
  {
    id: "6",
    name: "Mr. David Brown",
    email: "david.brown@school.edu",
    role: "SCHOOL_ADMIN",
    status: "present",
    department: "Administration",
    lastAttendance: "2024-01-20",
    attendanceRate: 91,
    phone: "+1234567800",
    address: "987 Cedar Ln",
    profileImage: null,
  },
  {
    id: "7",
    name: "Dr. Amanda Garcia",
    email: "amanda.garcia@school.edu",
    role: "TEACHER",
    status: "absent",
    department: "Biology",
    reason: "Family emergency",
    lastAttendance: "2024-01-19",
    attendanceRate: 85,
    phone: "+1234567802",
    address: "147 Birch St",
    profileImage: null,
  },
  {
    id: "8",
    name: "Mr. James Taylor",
    email: "james.taylor@school.edu",
    role: "TEACHER",
    status: "present",
    department: "Chemistry",
    lastAttendance: "2024-01-20",
    attendanceRate: 93,
    phone: "+1234567804",
    address: "258 Spruce Ave",
    profileImage: null,
  },
  {
    id: "9",
    name: "Ms. Rachel Lee",
    email: "rachel.lee@school.edu",
    role: "ACCOUNTANT",
    status: "late",
    department: "Finance",
    reason: "Bus delay",
    lastAttendance: "2024-01-20",
    attendanceRate: 89,
    phone: "+1234567806",
    address: "369 Willow Rd",
    profileImage: null,
  },
  {
    id: "10",
    name: "Dr. Thomas Martinez",
    email: "thomas.martinez@school.edu",
    role: "TEACHER",
    status: "present",
    department: "Computer Science",
    lastAttendance: "2024-01-20",
    attendanceRate: 96,
    phone: "+1234567808",
    address: "741 Poplar St",
    profileImage: null,
  },
]

const mockDepartments = [
  { id: "all", name: "All Departments", staff: 25, avgAttendance: 92 },
  { id: "mathematics", name: "Mathematics", staff: 5, avgAttendance: 94 },
  { id: "physics", name: "Physics", staff: 4, avgAttendance: 88 },
  { id: "english", name: "English", staff: 6, avgAttendance: 95 },
  { id: "history", name: "History", staff: 3, avgAttendance: 85 },
  { id: "finance", name: "Finance", staff: 3, avgAttendance: 87 },
  { id: "administration", name: "Administration", staff: 2, avgAttendance: 91 },
  { id: "biology", name: "Biology", staff: 2, avgAttendance: 90 },
]

// Enhanced mock data for school admin features
const mockLeaveRequests = [
  {
    id: "1",
    staffId: "3",
    staffName: "Ms. Emily Davis",
    department: "Academics",
    position: "English Literature Teacher",
    startDate: "2024-01-25",
    endDate: "2024-01-26",
    reason: "Medical appointment",
    status: "pending",
    leaveType: "sick",
    appliedDate: "2024-01-20",
    documents: ["medical_certificate.pdf"],
    priority: "high",
  },
  {
    id: "2",
    staffId: "5",
    staffName: "Dr. Amanda Garcia",
    department: "Academics",
    position: "Biology Teacher",
    startDate: "2024-01-30",
    endDate: "2024-02-02",
    reason: "Family emergency",
    status: "approved",
    leaveType: "personal",
    appliedDate: "2024-01-25",
    documents: [],
    priority: "medium",
  },
  {
    id: "3",
    staffId: "15",
    staffName: "Mr. Kevin Johnson",
    department: "Administration",
    position: "Administrative Assistant",
    startDate: "2024-02-05",
    endDate: "2024-02-07",
    reason: "Conference attendance",
    status: "rejected",
    leaveType: "professional",
    appliedDate: "2024-01-28",
    documents: ["conference_invitation.pdf"],
    priority: "low",
  },
  {
    id: "4",
    staffId: "21",
    staffName: "Mrs. Lisa Anderson",
    department: "Finance & Accounts",
    position: "Senior Accountant",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    reason: "Personal vacation",
    status: "pending",
    leaveType: "vacation",
    appliedDate: "2024-02-01",
    documents: [],
    priority: "medium",
  },
  {
    id: "5",
    staffId: "28",
    staffName: "Mr. David Kim",
    department: "Information Technology",
    position: "Network Engineer",
    startDate: "2024-02-15",
    endDate: "2024-02-16",
    reason: "Medical checkup",
    status: "approved",
    leaveType: "sick",
    appliedDate: "2024-02-05",
    documents: ["appointment_letter.pdf"],
    priority: "high",
  },
]

const mockNotifications = [
  {
    id: "1",
    type: "absence_alert",
    title: "Unexpected Absence",
    message: "Dr. Sarah Johnson is absent today without prior notice",
    timestamp: "2024-01-20T08:30:00Z",
    read: false,
    priority: "high",
  },
  {
    id: "2",
    type: "leave_reminder",
    title: "Leave Reminder",
    message: "Ms. Emily Davis has a pending leave request for approval",
    timestamp: "2024-01-20T09:15:00Z",
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "low_attendance",
    title: "Low Attendance Warning",
    message: "Mr. James Taylor has attendance rate below 80%",
    timestamp: "2024-01-20T10:00:00Z",
    read: true,
    priority: "medium",
  },
]

const mockReports = [
  {
    id: "1",
    name: "Monthly Attendance Report",
    type: "monthly",
    period: "January 2024",
    status: "generated",
    downloadUrl: "/reports/monthly-jan-2024.pdf",
    generatedAt: "2024-01-31T23:59:59Z",
  },
  {
    id: "2",
    name: "Department Performance Report",
    type: "department",
    period: "Q4 2023",
    status: "generated",
    downloadUrl: "/reports/dept-q4-2023.pdf",
    generatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "3",
    name: "Leave Analysis Report",
    type: "leave",
    period: "2023",
    status: "pending",
    downloadUrl: null,
    generatedAt: null,
  },
]

const mockAuditLogs = [
  {
    id: "1",
    action: "attendance_marked",
    staffId: "1",
    staffName: "Dr. Sarah Johnson",
    oldValue: null,
    newValue: "present",
    timestamp: "2024-01-20T08:00:00Z",
    performedBy: "School Admin",
  },
  {
    id: "2",
    action: "leave_approved",
    staffId: "7",
    staffName: "Dr. Amanda Garcia",
    oldValue: "pending",
    newValue: "approved",
    timestamp: "2024-01-20T09:30:00Z",
    performedBy: "School Admin",
  },
  {
    id: "3",
    action: "staff_added",
    staffId: "11",
    staffName: "New Staff Member",
    oldValue: null,
    newValue: "active",
    timestamp: "2024-01-19T14:20:00Z",
    performedBy: "School Admin",
  },
]

export default function SchoolAdminStaffAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({})
  const [attendanceReasons, setAttendanceReasons] = useState<{ [key: string]: string }>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("attendance")
  const [mounted, setMounted] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isStaffProfileOpen, setIsStaffProfileOpen] = useState(false)
  const [selectedStaffProfile, setSelectedStaffProfile] = useState<any>(null)
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [actionHistory, setActionHistory] = useState<any[]>([])
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false)
  const [selectedStaffForReason, setSelectedStaffForReason] = useState<string>("")
  const [tempReason, setTempReason] = useState("")
  const [selectedPredefinedReason, setSelectedPredefinedReason] = useState("")
  
  // Enhanced state for school admin features
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [reports, setReports] = useState(mockReports)
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [showReportsPanel, setShowReportsPanel] = useState(false)
  const [showAuditPanel, setShowAuditPanel] = useState(false)
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  // Dynamic analytics data based on active tab
  const getAnalyticsData = useCallback(() => {
    switch (activeTab) {
      case 'attendance':
        return {
          total: mockStaff.length,
          present: mockStaff.filter(s => s.status === 'present').length,
          absent: mockStaff.filter(s => s.status === 'absent').length,
          late: mockStaff.filter(s => s.status === 'late').length,
          avgRate: Math.round(mockStaff.reduce((acc, s) => acc + s.attendanceRate, 0) / mockStaff.length)
        }
      case 'leaves':
        return {
          total: leaveRequests.length,
          pending: leaveRequests.filter(l => l.status === 'pending').length,
          approved: leaveRequests.filter(l => l.status === 'approved').length,
          rejected: leaveRequests.filter(l => l.status === 'rejected').length,
          avgRate: Math.round(leaveRequests.filter(l => l.status === 'approved').length / leaveRequests.length * 100)
        }
      case 'notifications':
        return {
          total: notifications.length,
          unread: unreadNotifications,
          read: notifications.filter(n => n.read).length,
          high: notifications.filter(n => n.priority === 'high').length,
          avgRate: Math.round((notifications.length - unreadNotifications) / notifications.length * 100)
        }
      case 'reports':
        return {
          total: reports.length,
          generated: reports.filter(r => r.status === 'generated').length,
          pending: reports.filter(r => r.status === 'pending').length,
          failed: reports.filter(r => r.status === 'failed').length,
          avgRate: Math.round(reports.filter(r => r.status === 'generated').length / reports.length * 100)
        }
      case 'analytics':
        return {
          total: mockStaff.length,
          departments: mockDepartments.length - 1, // Exclude "All Departments"
          avgAttendance: Math.round(mockStaff.reduce((acc, s) => acc + s.attendanceRate, 0) / mockStaff.length),
          activeStaff: mockStaff.filter(s => s.status === 'present').length,
          avgRate: Math.round(mockStaff.reduce((acc, s) => acc + s.attendanceRate, 0) / mockStaff.length)
        }
      default:
        return {
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          avgRate: 0
        }
    }
  }, [activeTab, leaveRequests, notifications, unreadNotifications, reports])
  
  const tableRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  // Enhanced filtering and sorting
  const filteredAndSortedStaff = useMemo(() => {
    const filtered = mockStaff.filter((staff) => {
      const departmentMatch = selectedDepartment === "all" || staff.department.toLowerCase() === selectedDepartment
      const searchMatch =
        staff.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const currentStatus = attendance[staff.id] || staff.status
      const statusMatch = statusFilter === "all" || currentStatus === statusFilter
      return departmentMatch && searchMatch && statusMatch
    })

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof typeof a]
      let bValue: any = b[sortField as keyof typeof b]

      if (sortField === "status") {
        aValue = attendance[a.id] || a.status
        bValue = attendance[b.id] || b.status
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
  }, [selectedDepartment, debouncedSearchTerm, statusFilter, attendance, sortField, sortDirection])

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
            setActiveTab("analytics")
            break
          case "a":
            e.preventDefault()
            handleSelectAll(!selectedStaff.length)
            break
          case "k":
            e.preventDefault()
            setShowKeyboardShortcuts(true)
            break
        }
      }
      // ESC key handling
      if (e.key === "Escape") {
        setSelectedStaff([])
        setSearchTerm("")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [selectedStaff])

  // Enhance scrolling: smooth scroll and auto-scroll to first staff row after department select
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.style.scrollBehavior = "smooth"
      // Auto-scroll to first row
      const firstRow = tableRef.current.querySelector("tbody tr")
      if (firstRow) (firstRow as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [selectedDepartment])

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

  const handleMarkAll = useCallback(
    (status: string) => {
      const newAttendance: { [key: string]: string } = {}
      filteredAndSortedStaff.forEach((staff) => {
        newAttendance[staff.id] = status
      })
      setAttendance((prev) => ({ ...prev, ...newAttendance }))
      toast.success(`Marked all ${filteredAndSortedStaff.length} staff as ${status}`, {
        icon: <Sparkles className="h-4 w-4" />,
      })
    },
    [filteredAndSortedStaff],
  )

  const handleAttendanceChange = useCallback(
    (staffId: string, status: string) => {
      setActionHistory((prev) => [
        ...prev.slice(-9),
        {
          type: "attendance_change",
          staffId,
          oldStatus: attendance[staffId],
          newStatus: status,
          timestamp: new Date(),
        },
      ])
      setAttendance((prev) => ({
        ...prev,
        [staffId]: status,
      }))
      if (status === "absent" || status === "late" || status === "leave") {
        setSelectedStaffForReason(staffId)
        setTempReason(attendanceReasons[staffId] || "")
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
    if (selectedStaffForReason) {
      const finalReason = selectedPredefinedReason
        ? PREDEFINED_REASONS.find((r) => r.id === selectedPredefinedReason)?.label || tempReason
        : tempReason.trim()
      if (finalReason) {
        setAttendanceReasons((prev) => ({
          ...prev,
          [selectedStaffForReason]: finalReason,
        }))
        toast.success("Reason saved successfully", {
          icon: <CheckCircle2 className="h-4 w-4" />,
        })
      }
    }
    setIsReasonDialogOpen(false)
    setSelectedStaffForReason("")
    setTempReason("")
    setSelectedPredefinedReason("")
  }, [selectedStaffForReason, tempReason, selectedPredefinedReason])

  const handleBulkAction = useCallback(
    (status: string) => {
      if (selectedStaff.length === 0) {
        toast.error("Please select staff first")
        return
      }
      const newAttendance = { ...attendance }
      selectedStaff.forEach((staffId) => {
        newAttendance[staffId] = status
      })
      setAttendance(newAttendance)
      setSelectedStaff([])
      toast.success(`Marked ${selectedStaff.length} staff as ${status}`, {
        icon: <Target className="h-4 w-4" />,
      })
    },
    [selectedStaff, attendance],
  )

  // Pagination
  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedStaff.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedStaff, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedStaff.length / itemsPerPage)

  const selectedDepartmentData = mockDepartments.find((d) => d.id === selectedDepartment)

  // Attendance Stats
  const total = filteredAndSortedStaff.length
  const present = filteredAndSortedStaff.filter((s) => (attendance[s.id] || s.status) === "present").length
  const absent = filteredAndSortedStaff.filter((s) => (attendance[s.id] || s.status) === "absent").length
  const late = filteredAndSortedStaff.filter((s) => (attendance[s.id] || s.status) === "late").length
  const attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0

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
        return `${baseClasses} bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm`
      case "absent":
        return `${baseClasses} bg-red-100 text-red-800 border-red-300 shadow-sm`
      case "late":
        return `${baseClasses} bg-amber-100 text-amber-800 border-amber-300 shadow-sm`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border-gray-300 shadow-sm`
    }
  }

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return "text-emerald-600"
    if (rate >= 75) return "text-amber-600"
    return "text-red-600"
  }

  const handleExportCSV = useCallback(() => {
    const csvData = [
      ["Staff Name", "Email", "Department", "Status", "Reason", "Date", "Attendance Rate", "Phone", "Address"].join(
        ",",
      ),
      ...filteredAndSortedStaff.map((staff) => {
        const status = attendance[staff.id] || staff.status
        const reason = attendanceReasons[staff.id] || staff.reason || ""
        return [
          staff.name,
          staff.email,
          staff.department,
          status,
          reason,
          format(selectedDate, "yyyy-MM-dd"),
          `${staff.attendanceRate}%`,
          staff.phone,
          staff.address,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `staff-attendance-${format(selectedDate, "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Staff attendance exported successfully!", {
      icon: <Download className="h-4 w-4" />,
    })
  }, [filteredAndSortedStaff, attendance, attendanceReasons, selectedDate])

  const handleStaffSelect = (staffId: string, checked: boolean) => {
    if (checked) {
      setSelectedStaff((prev) => [...prev, staffId])
    } else {
      setSelectedStaff((prev) => prev.filter((id) => id !== staffId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStaff(paginatedStaff.map((s) => s.id))
    } else {
      setSelectedStaff([])
    }
  }

  const openStaffProfile = (staff: any) => {
    setSelectedStaffProfile(staff)
    setIsStaffProfileOpen(true)
  }

  const handleSaveAttendance = useCallback(
    async (isAutoSave = false) => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setLastSaved(new Date())
      setIsLoading(false)
      if (isAutoSave) {
        toast.success("Auto-saved", {
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 1500,
        })
      } else {
        toast.success("Staff attendance saved successfully!", {
          icon: <Save className="h-4 w-4" />,
        })
      }
    },
    [attendance, paginatedStaff, selectedDate],
  )

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
        [lastAction.staffId]: lastAction.oldStatus || "present",
      }))
      setActionHistory((prev) => prev.slice(0, -1))
      toast.success("Action undone", {
        icon: <Undo2 className="h-4 w-4" />,
      })
    }
  }, [actionHistory])

  // Enhanced handlers for school admin features
  const handleLeaveAction = useCallback((leaveId: string, action: "approve" | "reject") => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId ? { ...leave, status: action === "approve" ? "approved" : "rejected" } : leave,
      ),
    )
    
    // Add to audit logs
    const leave = leaveRequests.find(l => l.id === leaveId)
    if (leave) {
      setAuditLogs((prev) => [
        ...prev,
        {
          id: `audit-${Date.now()}`,
          action: `leave_${action}ed`,
          staffId: leave.staffId,
          staffName: leave.staffName,
          oldValue: leave.status,
          newValue: action === "approve" ? "approved" : "rejected",
          timestamp: new Date().toISOString(),
          performedBy: "School Admin",
        },
      ])
    }
    
    toast.success(`Leave request ${action}d successfully`, {
      icon: action === "approve" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />,
    })
  }, [leaveRequests])

  const handleNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    )
    setUnreadNotifications((prev) => Math.max(0, prev - 1))
  }, [])

  const handleGenerateReport = useCallback((reportId: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: "generated",
              downloadUrl: `/reports/${report.type}-${Date.now()}.pdf`,
              generatedAt: new Date().toISOString(),
            }
          : report,
      ),
    )
    toast.success("Report generated successfully", {
      icon: <FileSpreadsheet className="h-4 w-4" />,
    })
  }, [])

  const handleAddStaff = useCallback(() => {
    setShowStaffModal(true)
    toast.success("Staff management modal opened", {
      icon: <UserPlus className="h-4 w-4" />,
    })
  }, [])

  const handleSystemSettings = useCallback(() => {
    setShowSettingsModal(true)
    toast.success("Settings modal opened", {
      icon: <Settings className="h-4 w-4" />,
    })
  }, [])

  if (!mounted) {
  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading staff attendance system...</p>
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
            {/* Always show department selector */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-64 bg-white border-gray-200 hover:bg-gray-50">
                  <SelectValue>
                    {mockDepartments.find((dept) => dept.id === selectedDepartment)?.name || "Select Department"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
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
                    placeholder="Search staff, emails, departments..."
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
          </div>
          {/* Dynamic Context-aware summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
            {(() => {
              const data = getAnalyticsData()
              const cardConfig = {
                attendance: [
                  {
                    title: "Total Staff",
                    subtitle: "Today",
                    value: data.total,
                    icon: Users,
                    gradient: "from-indigo-500 to-indigo-600",
                    textColor: "text-indigo-100",
                    subtitleColor: "text-indigo-200",
                    progress: null,
                    progressValue: null
                  },
                  {
                    title: "Present",
                    subtitle: "Today",
                    value: data.present || 0,
                    icon: UserCheck,
                    gradient: "from-emerald-500 to-emerald-600",
                    textColor: "text-emerald-100",
                    subtitleColor: "text-emerald-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.present || 0) / data.total) * 100 : 0
                  },
                  {
                    title: "Absent",
                    subtitle: "Today",
                    value: data.absent || 0,
                    icon: UserX,
                    gradient: "from-red-500 to-red-600",
                    textColor: "text-red-100",
                    subtitleColor: "text-red-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.absent || 0) / data.total) * 100 : 0
                  },
                  {
                    title: "Late",
                    subtitle: "Today",
                    value: data.late || 0,
                    icon: Timer,
                    gradient: "from-amber-500 to-amber-600",
                    textColor: "text-amber-100",
                    subtitleColor: "text-amber-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.late || 0) / data.total) * 100 : 0
                  }
                ],
                leaves: [
                  {
                    title: "Total Requests",
                    subtitle: "All Time",
                    value: data.total,
                    icon: FileText,
                    gradient: "from-indigo-500 to-indigo-600",
                    textColor: "text-indigo-100",
                    subtitleColor: "text-indigo-200",
                    progress: null,
                    progressValue: null
                  },
                  {
                    title: "Pending",
                    subtitle: "Awaiting",
                    value: data.pending || 0,
                    icon: Clock,
                    gradient: "from-amber-500 to-amber-600",
                    textColor: "text-amber-100",
                    subtitleColor: "text-amber-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.pending || 0) / data.total) * 100 : 0
                  },
                  {
                    title: "Approved",
                    subtitle: "Accepted",
                    value: data.approved || 0,
                    icon: CheckCircle,
                    gradient: "from-emerald-500 to-emerald-600",
                    textColor: "text-emerald-100",
                    subtitleColor: "text-emerald-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.approved || 0) / data.total) * 100 : 0
                  },
                  {
                    title: "Rejected",
                    subtitle: "Declined",
                    value: data.rejected || 0,
                    icon: XCircle,
                    gradient: "from-red-500 to-red-600",
                    textColor: "text-red-100",
                    subtitleColor: "text-red-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.rejected || 0) / data.total) * 100 : 0
                  }
                ],
                notifications: [
                  {
                    title: "Total Notifications",
                    subtitle: "All Time",
                    value: data.total,
                    icon: Bell,
                    gradient: "from-indigo-500 to-indigo-600",
                    textColor: "text-indigo-100",
                    subtitleColor: "text-indigo-200",
                    progress: null,
                    progressValue: null
                  },
                  {
                    title: "Unread",
                    subtitle: "New",
                    value: data.unread || 0,
                    icon: AlertCircle,
                    gradient: "from-red-500 to-red-600",
                    textColor: "text-red-100",
                    subtitleColor: "text-red-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.unread || 0) / data.total) * 100 : 0
                  },
                  {
                    title: "Read",
                    subtitle: "Viewed",
                    value: data.read || 0,
                    icon: CheckCircle,
                    gradient: "from-emerald-500 to-emerald-600",
                    textColor: "text-emerald-100",
                    subtitleColor: "text-emerald-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.read || 0) / data.total) * 100 : 0
                  },
                  {
                    title: "High Priority",
                    subtitle: "Urgent",
                    value: data.high || 0,
                    icon: AlertTriangle,
                    gradient: "from-orange-500 to-orange-600",
                    textColor: "text-orange-100",
                    subtitleColor: "text-orange-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.high || 0) / data.total) * 100 : 0
                  }
                ],
                reports: [
                  {
                    title: "Total Reports",
                    subtitle: "All Time",
                    value: data.total,
                    icon: FileSpreadsheet,
                    gradient: "from-indigo-500 to-indigo-600",
                    textColor: "text-indigo-100",
                    subtitleColor: "text-indigo-200",
                    progress: null,
                    progressValue: null
                  },
                  {
                    title: "Generated",
                    subtitle: "Completed",
                    value: data.generated || 0,
                    icon: CheckCircle,
                    gradient: "from-emerald-500 to-emerald-600",
                    textColor: "text-emerald-100",
                    subtitleColor: "text-emerald-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.generated || 0) / data.total) * 100 : 0
                  },
                  {
                    title: "Pending",
                    subtitle: "In Progress",
                    value: data.pending || 0,
                    icon: Clock,
                    gradient: "from-amber-500 to-amber-600",
                    textColor: "text-amber-100",
                    subtitleColor: "text-amber-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.pending || 0) / data.total) * 100 : 0
                  },
                  {
                    title: "Failed",
                    subtitle: "Errors",
                    value: data.failed || 0,
                    icon: XCircle,
                    gradient: "from-red-500 to-red-600",
                    textColor: "text-red-100",
                    subtitleColor: "text-red-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.failed || 0) / data.total) * 100 : 0
                  }
                ],
                analytics: [
                  {
                    title: "Total Staff",
                    subtitle: "All Departments",
                    value: data.total,
                    icon: Users,
                    gradient: "from-indigo-500 to-indigo-600",
                    textColor: "text-indigo-100",
                    subtitleColor: "text-indigo-200",
                    progress: null,
                    progressValue: null
                  },
                  {
                    title: "Departments",
                    subtitle: "Active",
                    value: data.departments,
                    icon: Building2,
                    gradient: "from-purple-500 to-purple-600",
                    textColor: "text-purple-100",
                    subtitleColor: "text-purple-200",
                    progress: null,
                    progressValue: null
                  },
                  {
                    title: "Avg Attendance",
                    subtitle: "Overall",
                    value: `${data.avgAttendance}%`,
                    icon: TrendingUp,
                    gradient: "from-emerald-500 to-emerald-600",
                    textColor: "text-emerald-100",
                    subtitleColor: "text-emerald-200",
                    progress: true,
                    progressValue: data.avgAttendance
                  },
                  {
                    title: "Active Staff",
                    subtitle: "Present Today",
                    value: data.activeStaff || 0,
                    icon: Activity,
                    gradient: "from-cyan-500 to-cyan-600",
                    textColor: "text-cyan-100",
                    subtitleColor: "text-cyan-200",
                    progress: true,
                    progressValue: data.total > 0 ? ((data.activeStaff || 0) / data.total) * 100 : 0
                  }
                ]
              }

              const currentCards = cardConfig[activeTab as keyof typeof cardConfig] || cardConfig.attendance

              return currentCards.map((card, index) => {
                const IconComponent = card.icon
                return (
                  <Card key={index} className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${card.gradient} text-white`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${card.textColor} text-sm font-medium`}>
                            {card.title} <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded">{card.subtitle}</span>
                          </p>
                          <p className="text-3xl font-bold">{card.value}</p>
                          {card.progress && card.progressValue !== null && (
                            <div className="flex items-center gap-2 mt-1">
                              <Progress 
                                value={card.progressValue} 
                                className={`w-16 h-2 ${card.gradient.includes('emerald') ? 'bg-emerald-400' : card.gradient.includes('red') ? 'bg-red-400' : card.gradient.includes('amber') ? 'bg-amber-400' : card.gradient.includes('orange') ? 'bg-orange-400' : 'bg-cyan-400'}`} 
                              />
                              <span className={`${card.subtitleColor} text-sm`}>
                                {typeof card.value === 'string'
                                  ? card.value
                                  : card.progressValue !== undefined
                                    ? `${card.progressValue.toFixed(1)}%`
                                    : ''}
                              </span>
        </div>
                          )}
                            <p className={`${card.subtitleColor} text-sm`}>
                              {activeTab === 'attendance' ? (selectedDepartmentData?.name || "All Departments") : card.subtitle}
                            </p>
                          
      </div>
                        <div className="p-3 bg-white/20 rounded-full">
                          <IconComponent className="h-8 w-8" />
        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            })()}
          </div>
          {/* Enhanced Tabs moved below overview cards */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-5 gap-1 bg-gray-100 p-1 rounded-xl">
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
                <span className="font-medium">Leave Management</span>
                <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
                  {leaveRequests.filter(l => l.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                <span className="font-medium">Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 px-2 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="font-medium">Reports</span>
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
              {/* If 'All Departments' is selected, show message and summary, disable marking */}
              {selectedDepartment === "all" ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a department to mark attendance</h3>
                  <p className="text-gray-500">
                    Attendance marking is only available for a specific department. Use 'All Departments' to view summary or
                    analytics.
                  </p>
        </div>
      ) : (
                <Card className="border-0 shadow-lg w-full">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        Staff ({total})
                        {selectedStaff.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedStaff.length} selected
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
                                      selectedStaff.length === paginatedStaff.length &&
                                      paginatedStaff.length > 0
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
                                    Staff
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
                                    onClick={() => handleSort("department")}
                                    className="font-semibold text-gray-600 hover:text-gray-900 p-0 h-auto"
                                  >
                                    Department & Performance
                                    {sortField === "department" && (
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
                              {paginatedStaff.map((staff, index) => {
                                const status = attendance[staff.id] || staff.status
                                const reason = attendanceReasons[staff.id] || staff.reason
                                const isSelected = selectedStaff.includes(staff.id)
                    return (
                                  <tr
                                    key={staff.id}
                                    className={cn(
                                      "hover:bg-gray-50 transition-all duration-200 group",
                                      isSelected && "bg-indigo-50 border-indigo-200",
                                    )}
                                  >
                                    <td className="px-6 py-4">
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) =>
                                          handleStaffSelect(staff.id, checked as boolean)
                                        }
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-4">
                                        <div className="relative">
                                          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                                              {staff.name
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
                                              {staff.name}
                                            </h4>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openStaffProfile(staff)}
                                              className="h-6 w-6 p-0 hover:bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                          </div>
                                          <p className="text-sm text-gray-500">{staff.email}</p>
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
                                          {staff.department}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                          <div className="flex items-center gap-1">
                                            <Activity className="h-3 w-3 text-gray-400" />
                                  <span
                                              className={cn(
                                                "text-sm font-medium",
                                                getAttendanceRateColor(staff.attendanceRate),
                                              )}
                                            >
                                              {staff.attendanceRate}%
                                  </span>
                            </div>
                                          <Progress value={staff.attendanceRate} className="w-16 h-2" />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          Last: {format(new Date(staff.lastAttendance), "MMM dd")}
                                        </p>
                                      </div>
                        </td>
                                    <td className="px-6 py-4">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                          <Mail className="h-3 w-3" />
                                          <span className="truncate max-w-32">{staff.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                          <Phone className="h-3 w-3" />
                                          <span>{staff.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <MapPin className="h-3 w-3" />
                                          <span className="truncate max-w-32">{staff.address}</span>
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
                                        value={status}
                                        onValueChange={(val) => {
                                          if (!val) return
                                          handleAttendanceChange(staff.id, val)
                                        }}
                                        className="gap-1"
                                        size="sm"
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
                                      </ToggleGroup>
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
                      {total} staff
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
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto w-full px-2 md:px-4 space-y-10 mt-4">
              {/* 1. Attendance Trends (chart) */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Staff Attendance Trends (Last 7 Days)</h2>
                <div className="w-full flex items-end gap-3 h-32">
                  {[93, 91, 88, 95, 90, 87, 92].map((val, i) => (
                    <div key={i} className="flex flex-col items-center justify-end h-full">
                      <div
                        className={val >= 90 ? "bg-green-500" : val >= 75 ? "bg-amber-500" : "bg-red-500"}
                        style={{ height: `${val}%`, width: "22px", borderRadius: "8px" }}
                        title={`Day ${i + 1}: ${val}%`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">D{i + 1}</span>
              </div>
                  ))}
                </div>
              </div>
              {/* 2. Department Comparison (cards) */}
              <h2 className="text-lg font-semibold mt-8 mb-4">Department Comparison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDepartments.slice(1).map((dept, i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{dept.name}</span>
                      <span
                        className={
                          dept.avgAttendance >= 90 ? "text-green-600" : dept.avgAttendance >= 75 ? "text-amber-600" : "text-red-600"
                        }
                      >
                        {dept.avgAttendance}%
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm mt-2">
                      <span className="text-emerald-700">Staff: {dept.staff}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Leave Management Tab */}
          <TabsContent value="leaves" className="space-y-6">
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto w-full px-2 md:px-4 space-y-6">

              {/* Leave Requests Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Leave Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaveRequests.map((leave) => (
                      <div key={leave.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {leave.staffName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{leave.staffName}</h4>
                              <p className="text-sm text-gray-600">{leave.department}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              leave.status === 'approved' ? 'default' : 
                              leave.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                            </Badge>
                            {leave.status === 'pending' && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => handleLeaveAction(leave.id, 'approve')}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleLeaveAction(leave.id, 'reject')}>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
            </div>
          )}
              </div>
            </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">{leave.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto w-full px-2 md:px-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                    {unreadNotifications > 0 && (
                      <Badge variant="destructive">{unreadNotifications}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`border rounded-lg p-4 ${!notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'} transition-colors`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${notification.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                              {notification.type === 'absence_alert' && <AlertTriangle className="h-4 w-4" />}
                              {notification.type === 'leave_reminder' && <Clock className="h-4 w-4" />}
                              {notification.type === 'low_attendance' && <TrendingDown className="h-4 w-4" />}
              </div>
                            <div>
                              <h4 className="font-semibold">{notification.title}</h4>
                              <p className="text-sm text-gray-600">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(notification.timestamp), 'MMM dd, yyyy HH:mm')}
                              </p>
            </div>
                          </div>
                          {!notification.read && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
          )}
        </div>
        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto w-full px-2 md:px-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{report.name}</h4>
                            <p className="text-sm text-gray-600">{report.period}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {report.generatedAt ? `Generated: ${format(new Date(report.generatedAt), 'MMM dd, yyyy')}` : 'Not generated yet'}
                            </p>
                          </div>
                          <Badge variant={report.status === 'generated' ? 'default' : 'secondary'}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="mt-4 flex gap-2">
                          {report.downloadUrl && (
                            <Button size="sm" variant="outline" onClick={() => window.open(report.downloadUrl, '_blank')}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
          </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                if (attendance[selectedStaffForReason] === "absent") return "Absence"
                if (attendance[selectedStaffForReason] === "late") return "Lateness"
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
                    onClick={() => setSelectedPredefinedReason(reason.id)}
                    className="justify-start"
                  >
                    {reason.label}
                  </Button>
                ))}
        </div>
    </div>
            {/* Custom Reason */}
            <div>
              <Label htmlFor="custom-reason" className="text-sm font-medium mb-2 block">
                Custom Reason
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Enter custom reason..."
                value={tempReason}
                onChange={(e) => setTempReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReasonDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReasonSave}>Save Reason</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
