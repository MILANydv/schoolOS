"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BellRing, 
  Mail, 
  Megaphone, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Star,
  Bookmark,
  Trash2,
  Archive,
  RefreshCw,
  Settings,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Pin,
  Unpin,
  ChevronRight,
  ExternalLink,
  FileText,
  Image,
  Video,
  Link as LinkIcon
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

// Enhanced notification interface with more features
interface Notification {
  id: string
  type: "announcement" | "alert" | "message" | "reminder" | "achievement" | "update"
  title: string
  content: string
  date: string
  read: boolean
  pinned: boolean
  archived: boolean
  category: "General" | "Academic" | "Financial" | "Event" | "Sports" | "Library" | "Transport"
  priority: "low" | "medium" | "high" | "urgent"
  sender: {
    name: string
    role: string
    avatar?: string
  }
  attachments?: {
    type: "file" | "image" | "video" | "link"
    name: string
    url: string
    size?: string
  }[]
  actions?: {
    label: string
    action: string
    url?: string
  }[]
  expiresAt?: string
  tags?: string[]
  relatedTo?: {
    type: "assignment" | "exam" | "fee" | "event" | "attendance"
    id: string
    title: string
  }
}

// Enhanced mock data with real school scenarios
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "announcement",
    title: "Annual Sports Day - Important Update",
    content: "Due to weather conditions, the Annual Sports Day has been rescheduled to August 15th, 2025. All events will now take place in the indoor sports complex. Please update your calendars accordingly.",
    date: "2025-07-20T10:00:00Z",
    read: false,
    pinned: true,
    archived: false,
    category: "Event",
    priority: "high",
    sender: {
      name: "Principal's Office",
      role: "School Administration",
      avatar: "/placeholder-user.jpg"
    },
    attachments: [
      {
        type: "file",
        name: "Sports_Day_Schedule.pdf",
        url: "#",
        size: "2.3 MB"
      }
    ],
    actions: [
      { label: "View Schedule", action: "view", url: "/student-parent/events" },
      { label: "RSVP", action: "rsvp", url: "/student-parent/events/rsvp" }
    ],
    tags: ["Sports", "Event", "Rescheduled"],
    relatedTo: {
      type: "event",
      id: "sports-day-2025",
      title: "Annual Sports Day 2025"
    }
  },
  {
    id: "2",
    type: "alert",
    title: "Tuition Fee Payment Overdue",
    content: "Your tuition fee payment of ₹15,000 for August 2025 is now overdue. Late fees of ₹500 have been applied. Please make the payment immediately to avoid any academic restrictions.",
    date: "2025-07-18T14:30:00Z",
    read: false,
    pinned: false,
    archived: false,
    category: "Financial",
    priority: "urgent",
    sender: {
      name: "Accounts Department",
      role: "Finance Team",
      avatar: "/placeholder-user.jpg"
    },
    actions: [
      { label: "Pay Now", action: "pay", url: "/student-parent/fees" },
      { label: "View Details", action: "view", url: "/student-parent/fees" }
    ],
    tags: ["Payment", "Overdue", "Urgent"],
    relatedTo: {
      type: "fee",
      id: "tuition-aug-2025",
      title: "August 2025 Tuition Fee"
    }
  },
  {
    id: "3",
    type: "achievement",
    title: "Congratulations! Top Performer Award",
    content: "Emma Watson has been awarded the 'Top Performer' certificate for achieving the highest score in Physics Mid-Term examination. This recognition will be presented during the upcoming assembly.",
    date: "2025-07-17T09:15:00Z",
    read: true,
    pinned: false,
    archived: false,
    category: "Academic",
    priority: "medium",
    sender: {
      name: "Academic Department",
      role: "Teaching Staff",
      avatar: "/placeholder-user.jpg"
    },
    attachments: [
      {
        type: "image",
        name: "Certificate.jpg",
        url: "#",
        size: "1.2 MB"
      }
    ],
    actions: [
      { label: "View Certificate", action: "view", url: "/student-parent/results" },
      { label: "Share Achievement", action: "share", url: "#" }
    ],
    tags: ["Achievement", "Physics", "Award"],
    relatedTo: {
      type: "exam",
      id: "physics-midterm",
      title: "Physics Mid-Term Examination"
    }
  },
  {
    id: "4",
    type: "reminder",
    title: "Library Books Due Tomorrow",
    content: "You have 3 library books due for return tomorrow. Please return them to avoid late fees. Books: 'Advanced Mathematics', 'Physics Concepts', 'English Literature'.",
    date: "2025-07-16T11:00:00Z",
    read: false,
    pinned: false,
    archived: false,
    category: "Library",
    priority: "medium",
    sender: {
      name: "Library Staff",
      role: "Library Department",
      avatar: "/placeholder-user.jpg"
    },
    actions: [
      { label: "View Books", action: "view", url: "/student-parent/library" },
      { label: "Renew Books", action: "renew", url: "/student-parent/library/renew" }
    ],
    tags: ["Library", "Books", "Due Date"],
    relatedTo: {
      type: "event",
      id: "library-return",
      title: "Library Book Return"
    }
  },
  {
    id: "5",
    type: "message",
    title: "New Assignment: Mathematics Chapter 5",
    content: "A new assignment 'Quadratic Equations Practice' has been assigned for Mathematics. Due date: July 25th, 2025. Maximum marks: 25. Please submit through the online portal.",
    date: "2025-07-15T16:00:00Z",
    read: true,
    pinned: false,
    archived: false,
    category: "Academic",
    priority: "high",
    sender: {
      name: "Mr. John Smith",
      role: "Mathematics Teacher",
      avatar: "/placeholder-user.jpg"
    },
    attachments: [
      {
        type: "file",
        name: "Assignment_Chapter5.pdf",
        url: "#",
        size: "856 KB"
      },
      {
        type: "link",
        name: "Online Practice Portal",
        url: "https://practice.math.com"
      }
    ],
    actions: [
      { label: "View Assignment", action: "view", url: "/student-parent/work/assignments" },
      { label: "Submit Work", action: "submit", url: "/student-parent/work/assignments/submit" }
    ],
    tags: ["Assignment", "Mathematics", "Due Soon"],
    relatedTo: {
      type: "assignment",
      id: "math-ch5",
      title: "Quadratic Equations Practice"
    }
  },
  {
    id: "6",
    type: "update",
    title: "Transport Route Change Effective Monday",
    content: "Due to road construction, the transport route for Route 3 has been modified. New pickup time: 7:15 AM. Updated route details are available in the transport section.",
    date: "2025-07-14T13:30:00Z",
    read: true,
    pinned: false,
    archived: false,
    category: "Transport",
    priority: "medium",
    sender: {
      name: "Transport Department",
      role: "Transport Team",
      avatar: "/placeholder-user.jpg"
    },
    actions: [
      { label: "View Route", action: "view", url: "/student-parent/transport" },
      { label: "Update Preferences", action: "update", url: "/student-parent/transport/preferences" }
    ],
    tags: ["Transport", "Route Change", "Schedule"],
    relatedTo: {
      type: "event",
      id: "transport-route-3",
      title: "Transport Route 3 Update"
    }
  },
  {
    id: "7",
    type: "announcement",
    title: "Parent-Teacher Meeting Schedule",
    content: "The annual parent-teacher meeting is scheduled for August 10th, 2025, from 2:00 PM to 5:00 PM. Please book your slot through the online portal. Limited slots available.",
    date: "2025-07-13T10:00:00Z",
    read: false,
    pinned: false,
    archived: false,
    category: "Academic",
    priority: "high",
    sender: {
      name: "Academic Department",
      role: "School Administration",
      avatar: "/placeholder-user.jpg"
    },
    actions: [
      { label: "Book Slot", action: "book", url: "/student-parent/meetings" },
      { label: "View Schedule", action: "view", url: "/student-parent/meetings/schedule" }
    ],
    tags: ["Meeting", "Academic", "Important"],
    relatedTo: {
      type: "event",
      id: "ptm-aug-2025",
      title: "Parent-Teacher Meeting August 2025"
    }
  },
  {
    id: "8",
    type: "reminder",
    title: "School Uniform Check Tomorrow",
    content: "Tomorrow is the monthly uniform check day. Please ensure your child is wearing the complete school uniform including proper shoes and accessories.",
    date: "2025-07-12T15:00:00Z",
    read: true,
    pinned: false,
    archived: false,
    category: "General",
    priority: "low",
    sender: {
      name: "Discipline Committee",
      role: "School Administration",
      avatar: "/placeholder-user.jpg"
    },
    tags: ["Uniform", "Discipline", "Reminder"]
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [showArchived, setShowArchived] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "priority" | "category">("date")

  const unreadCount = notifications.filter((n) => !n.read && !n.archived).length
  const pinnedCount = notifications.filter((n) => n.pinned && !n.archived).length

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter((n) => {
    // Skip archived notifications unless showArchived is true
    if (!showArchived && n.archived) return false
    
    // Filter by tab
    if (activeTab === "unread" && n.read) return false
    if (activeTab === "pinned" && !n.pinned) return false
    if (activeTab !== "all" && activeTab !== "unread" && activeTab !== "pinned") {
      if (n.category.toLowerCase() !== activeTab) return false
    }
    
    // Filter by search query
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !n.content.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    // Filter by category
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false
    
    // Filter by priority
    if (selectedPriority !== "all" && n.priority !== selectedPriority) return false
    
    return true
  })

  // Sort notifications
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "category":
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const togglePin = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))
  }

  const toggleArchive = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, archived: !n.archived } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIconForType = (type: Notification["type"]) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="h-5 w-5 text-blue-500" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "message":
        return <Mail className="h-5 w-5 text-green-500" />
      case "reminder":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "achievement":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "update":
        return <Info className="h-5 w-5 text-purple-500" />
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryBadgeVariant = (category: Notification["category"]) => {
    switch (category) {
      case "General":
        return "outline"
      case "Academic":
        return "default"
      case "Financial":
        return "destructive"
      case "Event":
        return "secondary"
      case "Sports":
        return "default"
      case "Library":
        return "outline"
      case "Transport":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "file":
        return <FileText className="h-4 w-4" />
      case "image":
        return <Image className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "link":
        return <LinkIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with school announcements and important alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
        {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm px-3 py-1">
            {unreadCount} Unread
          </Badge>
        )}
            {pinnedCount > 0 && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                {pinnedCount} Pinned
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "priority" | "category")}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="pinned">Pinned ({pinnedCount})</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="event">Event</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {/* Pinned Notifications */}
            {activeTab === "all" && pinnedCount > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Pin className="h-5 w-5 text-blue-500" />
                  Pinned Notifications
                </h3>
                {sortedNotifications
                  .filter(n => n.pinned && !n.archived)
                  .map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onTogglePin={togglePin}
                      onToggleArchive={toggleArchive}
                      onDelete={deleteNotification}
                      getIconForType={getIconForType}
                      getPriorityColor={getPriorityColor}
                      getCategoryBadgeVariant={getCategoryBadgeVariant}
                      getAttachmentIcon={getAttachmentIcon}
                    />
                  ))}
              </div>
            )}

            {/* Regular Notifications */}
            <div className="space-y-3">
              {activeTab === "all" && pinnedCount > 0 && (
                <h3 className="text-lg font-semibold">Recent Notifications</h3>
              )}
              {sortedNotifications
                .filter(n => activeTab === "all" ? !n.pinned : true)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onTogglePin={togglePin}
                    onToggleArchive={toggleArchive}
                    onDelete={deleteNotification}
                    getIconForType={getIconForType}
                    getPriorityColor={getPriorityColor}
                    getCategoryBadgeVariant={getCategoryBadgeVariant}
                    getAttachmentIcon={getAttachmentIcon}
                  />
                ))}
                        </div>

            {sortedNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== "all" || selectedPriority !== "all"
                      ? "Try adjusting your filters to see more notifications."
                      : "You're all caught up! Check back later for new updates."}
                      </p>
            </CardContent>
          </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Separate Notification Card Component for better organization
interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onTogglePin: (id: string) => void
  onToggleArchive: (id: string) => void
  onDelete: (id: string) => void
  getIconForType: (type: Notification["type"]) => React.ReactNode
  getPriorityColor: (priority: Notification["priority"]) => string
  getCategoryBadgeVariant: (category: Notification["category"]) => string
  getAttachmentIcon: (type: string) => React.ReactNode
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onTogglePin,
  onToggleArchive,
  onDelete,
  getIconForType,
  getPriorityColor,
  getCategoryBadgeVariant,
  getAttachmentIcon
}: NotificationCardProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      !notification.read ? "border-blue-200 bg-blue-50/50" : "hover:bg-muted/50"
    } ${notification.pinned ? "border-l-4 border-l-blue-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon and Avatar */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              {getIconForType(notification.type)}
              <Avatar className="h-8 w-8">
                <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                <AvatarFallback className="text-xs">
                  {notification.sender.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-semibold text-lg ${!notification.read ? "text-blue-900" : ""}`}>
                    {notification.title}
                  </h3>
                  {notification.pinned && (
                    <Pin className="h-4 w-4 text-blue-500" />
                  )}
                  {!notification.read && (
                    <Badge variant="destructive" className="text-xs">New</Badge>
                  )}
                </div>
                
                <p className={`text-sm mb-3 ${!notification.read ? "text-blue-800" : "text-muted-foreground"}`}>
                  {notification.content}
                </p>

                {/* Sender Info */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">{notification.sender.name}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{notification.sender.role}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                  </span>
                </div>

                {/* Tags and Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant={getCategoryBadgeVariant(notification.category)} className="text-xs">
                    {notification.category}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                    {notification.priority}
                  </Badge>
                  {notification.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Attachments */}
                {notification.attachments && notification.attachments.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {notification.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                        {getAttachmentIcon(attachment.type)}
                        <span>{attachment.name}</span>
                        {attachment.size && (
                          <span className="text-muted-foreground">({attachment.size})</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {notification.actions.map((action, index) => (
                      <Button key={index} size="sm" variant="outline" asChild>
                        <a href={action.url || "#"}>
                          {action.label}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Menu */}
              <div className="flex-shrink-0 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActions(!showActions)}
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                
                {showActions && (
                  <div className="absolute right-0 top-8 z-50 w-48 bg-background border rounded-md shadow-lg">
                    <div className="p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        {notification.read ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {notification.read ? "Mark as unread" : "Mark as read"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onTogglePin(notification.id)}
                      >
                        {notification.pinned ? <Unpin className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
                        {notification.pinned ? "Unpin" : "Pin"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onToggleArchive(notification.id)}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        {notification.archived ? "Unarchive" : "Archive"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={() => onDelete(notification.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
