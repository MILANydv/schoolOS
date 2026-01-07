"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns"
import { useSchoolAdminStore } from "@/stores/schoolAdminStore"
import {
  Bell,
  BellRing,
  Search,
  Filter,
  Eye,
  Trash2,
  Plus,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Users,
  Clock,
  Send,
  Edit,
  Copy,
  Archive,
  RefreshCw,
  X,
  ChevronDown,
  User,
  GraduationCap,
  UserCheck,
  TrendingUp
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

// Enhanced notification schema
const notificationSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["info", "success", "warning", "error"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  audience: z.array(z.enum(["School Admin", "Teacher", "Parent", "Student", "All"])).min(1, "Audience is required"),
  scheduledDate: z.date({ required_error: "Scheduled date is required" }),
  status: z.enum(["draft", "scheduled", "sent", "failed"]),
  isRead: z.boolean().default(false),
  readCount: z.number().default(0),
  totalRecipients: z.number().default(0),
  sentBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  actionLink: z.string().optional(),
  actionText: z.string().optional(),
})

type NotificationFormValues = z.infer<typeof notificationSchema>

// Enhanced mock data with more realistic notifications
const mockNotifications: NotificationFormValues[] = [
  {
    id: "notif001",
    title: "School Reopening Notice",
    content: "Dear parents and students, we are excited to announce that school will reopen on August 15th after the summer break. Please ensure all students are prepared with their uniforms and supplies.",
    type: "info",
    priority: "high",
    audience: ["All"],
    scheduledDate: new Date("2024-08-01"),
    status: "sent",
    isRead: false,
    readCount: 245,
    totalRecipients: 320,
    sentBy: "Principal Johnson",
    createdAt: new Date("2024-07-25"),
    updatedAt: new Date("2024-07-25"),
    actionLink: "/schooladmin/calendar",
    actionText: "View Calendar"
  },
  {
    id: "notif002",
    title: "Exam Schedule Updated",
    content: "Important: The mid-term exam schedule has been revised. New dates have been assigned for Math and Science subjects. Please check the updated timetable.",
    type: "warning",
    priority: "urgent",
    audience: ["Teacher", "Student", "Parent"],
    scheduledDate: new Date("2024-07-15"),
    status: "sent",
    isRead: true,
    readCount: 156,
    totalRecipients: 180,
    sentBy: "Academic Coordinator",
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2024-07-12"),
    actionLink: "/schooladmin/exams",
    actionText: "View Schedule"
  },
  {
    id: "notif003",
    title: "Parent-Teacher Meeting",
    content: "Monthly PTM scheduled for this Saturday. Please confirm your attendance and review your child's progress report beforehand.",
    type: "info",
    priority: "medium",
    audience: ["Parent"],
    scheduledDate: new Date("2024-07-20"),
    status: "scheduled",
    isRead: false,
    readCount: 0,
    totalRecipients: 95,
    sentBy: "Class Teacher",
    createdAt: new Date("2024-07-18"),
    updatedAt: new Date("2024-07-18"),
    actionLink: "/schooladmin/meetings",
    actionText: "Join Meeting"
  },
  {
    id: "notif004",
    title: "Fee Payment Reminder",
    content: "This is a friendly reminder that the quarterly fee payment is due by the end of this month. Please make the payment to avoid late fees.",
    type: "warning",
    priority: "medium",
    audience: ["Parent"],
    scheduledDate: new Date("2024-07-28"),
    status: "sent",
    isRead: false,
    readCount: 78,
    totalRecipients: 120,
    sentBy: "Finance Office",
    createdAt: new Date("2024-07-25"),
    updatedAt: new Date("2024-07-25"),
    actionLink: "/schooladmin/fees",
    actionText: "Pay Now"
  },
  {
    id: "notif005",
    title: "Sports Day Registration",
    content: "Annual Sports Day is approaching! Registration is now open for all sporting events. Encourage your children to participate and showcase their talents.",
    type: "success",
    priority: "low",
    audience: ["All"],
    scheduledDate: new Date("2024-08-05"),
    status: "draft",
    isRead: false,
    readCount: 0,
    totalRecipients: 0,
    sentBy: "Sports Coordinator",
    createdAt: new Date("2024-07-30"),
    updatedAt: new Date("2024-07-30"),
    actionLink: "/schooladmin/events",
    actionText: "Register Now"
  },
  {
    id: "notif006",
    title: "System Maintenance Alert",
    content: "The school management system will undergo scheduled maintenance this weekend. Some services may be temporarily unavailable.",
    type: "error",
    priority: "high",
    audience: ["School Admin", "Teacher"],
    scheduledDate: new Date("2024-08-03"),
    status: "scheduled",
    isRead: false,
    readCount: 0,
    totalRecipients: 25,
    sentBy: "IT Administrator",
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-01")
  }
]

// Utility function to validate notification dates
const validateNotificationDates = (notification: NotificationFormValues) => ({
  ...notification,
  scheduledDate: notification.scheduledDate instanceof Date && !isNaN(notification.scheduledDate.getTime())
    ? notification.scheduledDate
    : new Date(),
  createdAt: notification.createdAt instanceof Date && !isNaN(notification.createdAt.getTime())
    ? notification.createdAt
    : new Date(),
  updatedAt: notification.updatedAt instanceof Date && !isNaN(notification.updatedAt.getTime())
    ? notification.updatedAt
    : new Date()
})

// Utility functions
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    case "error":
      return <AlertCircle className="w-5 h-5 text-red-600" />
    default:
      return <Info className="w-5 h-5 text-blue-600" />
  }
}

const getNotificationBadgeVariant = (type: string) => {
  switch (type) {
    case "success":
      return "default"
    case "warning":
      return "secondary"
    case "error":
      return "destructive"
    default:
      return "outline"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "text-red-600 bg-red-50 border-red-200"
    case "high":
      return "text-orange-600 bg-orange-50 border-orange-200"
    case "medium":
      return "text-blue-600 bg-blue-50 border-blue-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

const getAudienceIcon = (audience: string) => {
  switch (audience) {
    case "School Admin":
      return <UserCheck className="w-4 h-4" />
    case "Teacher":
      return <GraduationCap className="w-4 h-4" />
    case "Parent":
      return <Users className="w-4 h-4" />
    case "Student":
      return <User className="w-4 h-4" />
    default:
      return <Users className="w-4 h-4" />
  }
}

const formatNotificationDate = (date: Date | string | null | undefined) => {
  // Handle invalid or missing dates
  if (!date) {
    return "No date"
  }

  // Convert string to Date if needed
  let dateObj: Date
  try {
    dateObj = date instanceof Date ? date : new Date(date)

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date passed to formatNotificationDate:', date)
      return "Invalid date"
    }
  } catch (error) {
    console.warn('Error parsing date in formatNotificationDate:', error, 'Date value:', date)
    return "Invalid date"
  }

  try {
    if (isToday(dateObj)) {
      return `Today, ${format(dateObj, 'h:mm a')}`
    } else if (isYesterday(dateObj)) {
      return `Yesterday, ${format(dateObj, 'h:mm a')}`
    } else {
      return format(dateObj, 'MMM d, h:mm a')
    }
  } catch (formatError) {
    console.warn('Error formatting date in formatNotificationDate:', formatError, 'Date object:', dateObj)
    return "Date error"
  }
}

export default function SchoolAdminNotificationsPage() {
  // Zustand store
  const {
    notifications,
    notificationsUI,
    setNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead,
    bulkMarkNotificationsAsRead,
    bulkDeleteNotifications,
    setModalState,
    setSelectedItems,
    setSearchTerm,
    setFilters,
    setPagination,
    getFilteredNotifications,
    getNotificationStats
  } = useSchoolAdminStore()

  const { toast } = useToast()

  // Initialize notifications if empty
  React.useEffect(() => {
    if (notifications.length === 0) {
      // Ensure all dates are valid before setting notifications
      const validatedNotifications = mockNotifications.map(validateNotificationDates)
      setNotifications(validatedNotifications)
    }
  }, [notifications.length, setNotifications])

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema) as any,
    defaultValues: {
      id: "",
      title: "",
      content: "",
      type: "info" as const,
      priority: "medium" as const,
      audience: [],
      status: "draft" as const,
      isRead: false,
      readCount: 0,
      totalRecipients: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  // Computed values from Zustand
  const { total: totalNotifications, sent: sentNotifications, unread: unreadCount, drafts: draftNotifications } = getNotificationStats()

  // Get filtered notifications from Zustand
  const filteredNotifications = getFilteredNotifications()

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / notificationsUI.pageSize)
  const paginatedNotifications = filteredNotifications.slice(
    (notificationsUI.currentPage - 1) * notificationsUI.pageSize,
    notificationsUI.currentPage * notificationsUI.pageSize
  )

  // Handlers using Zustand
  const handleAddNotification = () => {
    setModalState('notificationsUI', { editingItem: null })
    form.reset({
      id: `notif${Date.now()}`,
      title: "",
      content: "",
      type: "info",
      priority: "medium",
      audience: [],
      status: "draft",
      isRead: false,
      readCount: 0,
      totalRecipients: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setModalState('notificationsUI', { isCreateModalOpen: true })
  }

  const handleEditNotification = (notification: NotificationFormValues) => {
    // Ensure dates are valid before editing
    const validatedNotification = validateNotificationDates(notification)

    setModalState('notificationsUI', { editingItem: validatedNotification })
    form.reset(validatedNotification)
    setModalState('notificationsUI', { isCreateModalOpen: true })
  }

  const handleDeleteNotification = (notification: NotificationFormValues) => {
    // Ensure dates are valid before deleting
    const validatedNotification = validateNotificationDates(notification)

    deleteNotification(validatedNotification.id)
    toast({
      title: "Notification Deleted",
      description: `"${validatedNotification.title}" has been deleted successfully.`,
      variant: "destructive"
    })
  }

  const handleMarkAsRead = (notification: NotificationFormValues) => {
    // Ensure dates are valid before marking as read
    const validatedNotification = validateNotificationDates(notification)

    markNotificationAsRead(validatedNotification.id)
    toast({
      title: "Marked as Read",
      description: `"${validatedNotification.title}" marked as read.`
    })
  }

  const handlePreviewNotification = (notification: NotificationFormValues) => {
    // Ensure dates are valid before previewing
    const validatedNotification = validateNotificationDates(notification)

    setModalState('notificationsUI', { selectedItem: validatedNotification, isPreviewModalOpen: true })
  }

  const handleBulkMarkAsRead = () => {
    bulkMarkNotificationsAsRead(notificationsUI.selectedItems)
    setSelectedItems('notificationsUI', [])
    toast({
      title: "Bulk Action Complete",
      description: `${notificationsUI.selectedItems.length} notifications marked as read.`
    })
  }

  const handleBulkDelete = () => {
    bulkDeleteNotifications(notificationsUI.selectedItems)
    setSelectedItems('notificationsUI', [])
    toast({
      title: "Bulk Delete Complete",
      description: `${notificationsUI.selectedItems.length} notifications deleted.`,
      variant: "destructive"
    })
  }

  const onSubmit = (data: NotificationFormValues) => {
    // Ensure all dates are valid
    const validatedData = {
      ...validateNotificationDates(data),
      updatedAt: new Date() // Always use current time for updates
    }

    if (notificationsUI.editingItem) {
      updateNotification(notificationsUI.editingItem.id, validatedData)
      toast({
        title: "Notification Updated",
        description: `"${data.title}" has been updated successfully.`
      })
    } else {
      addNotification(validatedData)
      toast({
        title: "Notification Created",
        description: `"${data.title}" has been created successfully.`
      })
    }
    setModalState('notificationsUI', { isCreateModalOpen: false })
    form.reset()
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 space-y-4">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="w-8 h-8 text-blue-600" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">Manage and send notifications to different user roles</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Ensure all dates are valid when refreshing
                    const validatedNotifications = mockNotifications.map(validateNotificationDates)
                    setNotifications(validatedNotifications)
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button
                  onClick={handleAddNotification}
                  className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Notification
                </Button>
              </div>
            </div>

            {/* Enhanced Analytics Cards - Matching Dashboard Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                      <CardContent className="relative p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-white/90">Total Notifications</p>
                            <p className="text-3xl font-bold">{totalNotifications}</p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                            <Bell className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium text-white">+12.5%</span>
                          <span className="text-xs text-white/80">from last month</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20"></div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">Total Notifications</p>
                      <p className="text-xs">All notifications in the system</p>
                      <p className="text-xs">Includes drafts, sent, and scheduled</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                      <CardContent className="relative p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-white/90">Sent Successfully</p>
                            <p className="text-3xl font-bold">{sentNotifications}</p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                            <Send className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium text-white">{Math.round((sentNotifications / totalNotifications) * 100)}% delivery rate</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20"></div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">Sent Notifications</p>
                      <p className="text-xs">Successfully delivered notifications</p>
                      <p className="text-xs">High delivery success rate</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                      <CardContent className="relative p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-white/90">Unread Messages</p>
                            <p className="text-3xl font-bold">{unreadCount}</p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                            <BellRing className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium text-white">
                            {unreadCount > 0 ? 'Needs attention' : 'All caught up'}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20"></div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">Unread Notifications</p>
                      <p className="text-xs">Messages awaiting user attention</p>
                      <p className="text-xs">Keep track of engagement</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                      <CardContent className="relative p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-white/90">Draft Messages</p>
                            <p className="text-3xl font-bold">{draftNotifications}</p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                            <Edit className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium text-white">
                            {draftNotifications > 0 ? 'Ready to send' : 'No drafts'}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20"></div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">Draft Notifications</p>
                      <p className="text-xs">Unsent messages in preparation</p>
                      <p className="text-xs">Review and schedule for sending</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Enhanced Search and Filters */}
            <Card className="border shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  Search & Filter Notifications
                </CardTitle>
                <CardDescription>
                  Find specific notifications using search and filters
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search notifications by title, content, or sender..."
                      value={notificationsUI.searchTerm}
                      onChange={(e) => setSearchTerm('notificationsUI', e.target.value)}
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select
                      value={notificationsUI.filters.role || 'all'}
                      onValueChange={(value) => setFilters('notificationsUI', { role: value })}
                    >
                      <SelectTrigger className="w-[150px] h-11 border-gray-300">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="School Admin">School Admin</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={notificationsUI.filters.type || 'all'}
                      onValueChange={(value) => setFilters('notificationsUI', { type: value })}
                    >
                      <SelectTrigger className="w-[120px] h-11 border-gray-300">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={notificationsUI.filters.status || 'all'}
                      onValueChange={(value) => setFilters('notificationsUI', { status: value })}
                    >
                      <SelectTrigger className="w-[120px] h-11 border-gray-300">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Bulk Actions */}
            {notificationsUI.selectedItems.length > 0 && (
              <Card className="border border-blue-200 bg-blue-50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-800">
                          {notificationsUI.selectedItems.length} notification{notificationsUI.selectedItems.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkMarkAsRead}
                        className="text-blue-700 border-blue-300 hover:bg-blue-100 bg-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkDelete}
                        className="text-red-700 border-red-300 hover:bg-red-100 bg-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedItems('notificationsUI', [])}
                        className="text-gray-600 hover:bg-white/50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {paginatedNotifications.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Bell className="w-16 h-16 text-gray-300" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
                    <p className="text-gray-600 mb-4">
                      {notificationsUI.searchTerm || (notificationsUI.filters.role && notificationsUI.filters.role !== "all") || (notificationsUI.filters.type && notificationsUI.filters.type !== "all") || (notificationsUI.filters.status && notificationsUI.filters.status !== "all")
                        ? "Try adjusting your search or filters"
                        : "Create your first notification to get started"
                      }
                    </p>
                    <Button onClick={handleAddNotification} className="bg-blue-600 text-white hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Notification
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {paginatedNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-all duration-300 hover:shadow-xl cursor-pointer border-l-4 group ${notification.isRead
                        ? 'border-l-gray-300 bg-white hover:bg-gray-50'
                        : 'border-l-blue-500 bg-blue-50/50 hover:bg-blue-50/80'
                      } ${notificationsUI.selectedItems.includes(notification.id) ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' : 'shadow-sm'}`}
                    onClick={() => handlePreviewNotification(notification)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Selection Checkbox */}
                        <div className="flex items-center pt-1">
                          <input
                            type="checkbox"
                            checked={notificationsUI.selectedItems.includes(notification.id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              if (e.target.checked) {
                                setSelectedItems('notificationsUI', [...notificationsUI.selectedItems, notification.id])
                              } else {
                                setSelectedItems('notificationsUI', notificationsUI.selectedItems.filter(id => id !== notification.id))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                        </div>

                        {/* Enhanced Notification Icon */}
                        <div className={`flex-shrink-0 pt-1 p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${notification.type === 'success' ? 'bg-green-100' :
                            notification.type === 'warning' ? 'bg-yellow-100' :
                              notification.type === 'error' ? 'bg-red-100' :
                                'bg-blue-100'
                          }`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className={`font-semibold text-gray-900 truncate text-lg group-hover:text-blue-700 transition-colors ${!notification.isRead ? 'font-bold' : ''
                                  }`}>
                                  {notification.title}
                                </h3>
                                <Badge
                                  variant={getNotificationBadgeVariant(notification.type)}
                                  className="text-xs font-medium"
                                >
                                  {notification.type}
                                </Badge>
                                <Badge
                                  className={`text-xs font-medium border ${getPriorityColor(notification.priority)}`}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 line-clamp-2 mb-3 leading-relaxed">
                                {notification.content}
                              </p>
                              <div className="flex items-center gap-5 text-xs text-gray-500">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span className="font-medium">{formatNotificationDate(notification.scheduledDate)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5" />
                                  <span>{notification.audience.join(", ")}</span>
                                </div>
                                {notification.sentBy && (
                                  <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" />
                                    <span>{notification.sentBy}</span>
                                  </div>
                                )}
                                {notification.status === "sent" && (
                                  <div className="flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span className="font-medium">{notification.readCount}/{notification.totalRecipients} read</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Enhanced Status and Actions */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    notification.status === "sent" ? "default" :
                                      notification.status === "scheduled" ? "secondary" :
                                        notification.status === "failed" ? "destructive" :
                                          "outline"
                                  }
                                  className="text-xs font-medium px-2.5 py-1"
                                >
                                  {notification.status}
                                </Badge>

                                {!notification.isRead && notification.status === "sent" && (
                                  <div className="relative">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
                                    <div className="absolute inset-0 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
                                  </div>
                                )}
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 w-9 p-0 hover:bg-gray-100 group-hover:bg-blue-50 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handlePreviewNotification(notification)
                                  }}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditNotification(notification)
                                  }}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  {!notification.isRead && notification.status === "sent" && (
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      handleMarkAsRead(notification)
                                    }}>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Mark as Read
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    // Handle duplicate
                                  }}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteNotification(notification)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <Card className="border shadow-sm mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-700 font-medium">
                        Showing {((notificationsUI.currentPage - 1) * notificationsUI.pageSize) + 1} to {Math.min(notificationsUI.currentPage * notificationsUI.pageSize, filteredNotifications.length)} of {filteredNotifications.length} notifications
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination('notificationsUI', Math.max(1, notificationsUI.currentPage - 1))}
                        disabled={notificationsUI.currentPage === 1}
                        className="h-9 px-3"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <Button
                              key={page}
                              variant={notificationsUI.currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPagination('notificationsUI', page)}
                              className="w-9 h-9 p-0"
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination('notificationsUI', Math.min(totalPages, notificationsUI.currentPage + 1))}
                        disabled={notificationsUI.currentPage === totalPages}
                        className="h-9 px-3"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={notificationsUI.isCreateModalOpen} onOpenChange={(open) => setModalState('notificationsUI', { isCreateModalOpen: open })}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {notificationsUI.editingItem ? "Edit Notification" : "Create New Notification"}
              </DialogTitle>
              <DialogDescription>
                {notificationsUI.editingItem
                  ? "Update the notification details below."
                  : "Fill in the details to create a new notification."
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Enter notification title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={form.watch("type")}
                    onValueChange={(value) => form.setValue("type", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={form.watch("priority")}
                    onValueChange={(value) => form.setValue("priority", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(value) => form.setValue("status", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  {...form.register("content")}
                  placeholder="Enter notification content"
                  rows={4}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Audience *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["School Admin", "Teacher", "Parent", "Student", "All"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={role}
                        checked={form.watch("audience")?.includes(role as any) || false}
                        onChange={(e) => {
                          const currentAudience = form.watch("audience") || []
                          if (e.target.checked) {
                            form.setValue("audience", [...currentAudience, role as any])
                          } else {
                            form.setValue("audience", currentAudience.filter(a => a !== role))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor={role} className="text-sm font-normal cursor-pointer">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.audience && (
                  <p className="text-sm text-red-600">{form.formState.errors.audience.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    {...form.register("scheduledDate", {
                      setValueAs: (value) => value ? new Date(value) : undefined
                    })}
                  />
                  {form.formState.errors.scheduledDate && (
                    <p className="text-sm text-red-600">{form.formState.errors.scheduledDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sentBy">Sent By</Label>
                  <Input
                    id="sentBy"
                    {...form.register("sentBy")}
                    placeholder="Enter sender name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="actionText">Action Button Text</Label>
                  <Input
                    id="actionText"
                    {...form.register("actionText")}
                    placeholder="e.g., View Details"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actionLink">Action Link</Label>
                  <Input
                    id="actionLink"
                    {...form.register("actionLink")}
                    placeholder="e.g., /schooladmin/events"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalState('notificationsUI', { isCreateModalOpen: false })}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {notificationsUI.editingItem ? "Update" : "Create"} Notification
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={notificationsUI.isPreviewModalOpen} onOpenChange={(open) => setModalState('notificationsUI', { isPreviewModalOpen: open })}>
          <DialogContent className="max-w-2xl">
            {notificationsUI.selectedItem && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(notificationsUI.selectedItem.type)}
                    <div>
                      <DialogTitle className="text-xl">{notificationsUI.selectedItem.title}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Badge variant={getNotificationBadgeVariant(notificationsUI.selectedItem.type)}>
                          {notificationsUI.selectedItem.type}
                        </Badge>
                        <Badge className={getPriorityColor(notificationsUI.selectedItem.priority)}>
                          {notificationsUI.selectedItem.priority}
                        </Badge>
                        <Badge
                          variant={
                            notificationsUI.selectedItem.status === "sent" ? "default" :
                              notificationsUI.selectedItem.status === "scheduled" ? "secondary" :
                                notificationsUI.selectedItem.status === "failed" ? "destructive" :
                                  "outline"
                          }
                        >
                          {notificationsUI.selectedItem.status}
                        </Badge>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Content</h4>
                    <p className="text-gray-700 leading-relaxed">{notificationsUI.selectedItem.content}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Audience</h4>
                      <div className="flex flex-wrap gap-2">
                        {notificationsUI.selectedItem.audience.map((role: string) => (
                          <div key={role} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md">
                            {getAudienceIcon(role)}
                            <span className="text-sm">{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Scheduled: {formatNotificationDate(notificationsUI.selectedItem.scheduledDate)}</span>
                        </div>
                        {notificationsUI.selectedItem.sentBy && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Sent by: {notificationsUI.selectedItem.sentBy}</span>
                          </div>
                        )}
                        {notificationsUI.selectedItem.status === "sent" && (
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Read by: {notificationsUI.selectedItem.readCount}/{notificationsUI.selectedItem.totalRecipients}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {notificationsUI.selectedItem.actionText && notificationsUI.selectedItem.actionLink && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Action</h4>
                        <Button variant="outline" className="w-full">
                          {notificationsUI.selectedItem.actionText}
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter>
                  <div className="flex items-center gap-2">
                    {!notificationsUI.selectedItem.isRead && notificationsUI.selectedItem.status === "sent" && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleMarkAsRead(notificationsUI.selectedItem)
                          setModalState('notificationsUI', { isPreviewModalOpen: false })
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setModalState('notificationsUI', { isPreviewModalOpen: false })
                        handleEditNotification(notificationsUI.selectedItem)
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setModalState('notificationsUI', { isPreviewModalOpen: false })}
                    >
                      Close
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
