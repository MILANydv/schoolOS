"use client"

import * as React from "react"
import { useEvents } from "@/hooks/useSchoolAdmin"
import { MOCK_EVENTS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { FormInput } from "@/components/forms/form-input"
import { FormDatePicker } from "@/components/forms/form-date-picker"
import { FormSelect } from "@/components/forms/form-select"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/toaster"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Eye,
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  Users,
  Star,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced Event interface
interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'
  audience: 'Students' | 'Teachers' | 'Parents' | 'All'
  createdBy?: string
  createdAt?: string
  type: 'Academic' | 'Sports' | 'Cultural' | 'Meeting' | 'Holiday' | 'Other'
  priority: 'Low' | 'Medium' | 'High'
  capacity?: number
  registeredCount?: number
}

// Enhanced mock data with more professional structure
const enhancedMockEvents: Event[] = [
  {
    id: "evt001",
    title: "Annual Sports Day",
    description: "Join us for our annual sports day featuring various athletic competitions for all grades. Students will participate in track and field events, team sports, and fun activities.",
    date: "2025-02-15",
    time: "08:00 AM",
    location: "School Sports Ground",
    status: "Upcoming",
    audience: "All",
    createdBy: "Principal",
    createdAt: "2025-01-15",
    type: "Sports",
    priority: "High",
    capacity: 500,
    registeredCount: 387
  },
  {
    id: "evt002", 
    title: "Parent-Teacher Conference",
    description: "Quarterly parent-teacher meetings to discuss student progress, achievements, and areas for improvement. Individual consultation sessions available.",
    date: "2025-01-25",
    time: "02:00 PM",
    location: "Main Auditorium",
    status: "Upcoming",
    audience: "Parents",
    createdBy: "Academic Coordinator",
    createdAt: "2025-01-10",
    type: "Meeting",
    priority: "High",
    capacity: 300,
    registeredCount: 245
  },
  {
    id: "evt003",
    title: "Science Exhibition",
    description: "Students showcase their innovative science projects and experiments. Interactive displays, demonstrations, and competitions for various grade levels.",
    date: "2025-02-05",
    time: "10:00 AM", 
    location: "Science Laboratory",
    status: "Upcoming",
    audience: "Students",
    createdBy: "Science Department",
    createdAt: "2025-01-05",
    type: "Academic",
    priority: "Medium",
    capacity: 200,
    registeredCount: 156
  },
  {
    id: "evt004",
    title: "Staff Training Workshop",
    description: "Professional development workshop on modern teaching methodologies and educational technology integration for all faculty members.",
    date: "2025-01-20",
    time: "09:00 AM",
    location: "Conference Room A",
    status: "Completed",
    audience: "Teachers",
    createdBy: "HR Department",
    createdAt: "2025-01-01",
    type: "Meeting",
    priority: "Medium",
    capacity: 50,
    registeredCount: 48
  },
  {
    id: "evt005",
    title: "Cultural Festival",
    description: "Celebrate diversity with performances, food stalls, art exhibitions, and cultural activities representing different communities and traditions.",
    date: "2025-03-10",
    time: "04:00 PM",
    location: "School Campus",
    status: "Upcoming",
    audience: "All",
    createdBy: "Cultural Committee",
    createdAt: "2025-01-12",
    type: "Cultural",
    priority: "High",
    capacity: 800,
    registeredCount: 234
  },
  {
    id: "evt006",
    title: "Winter Holiday",
    description: "School winter break period. Classes will resume after the holiday. Enjoy time with family and stay safe during the break.",
    date: "2025-12-25",
    time: "All Day",
    location: "School Closed",
    status: "Completed",
    audience: "All",
    createdBy: "Administration",
    createdAt: "2024-11-01",
    type: "Holiday",
    priority: "Low",
    capacity: undefined,
    registeredCount: undefined
  }
]

// Utility functions
const getEventStatusColor = (status: string) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Ongoing':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Completed':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Academic':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Sports':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'Cultural':
      return 'bg-pink-100 text-pink-800 border-pink-200'
    case 'Meeting':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Holiday':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const truncateText = (text: string, maxLength: number = 120) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

export default function SchoolAdminEventsPage() {
  // Zustand state management
  const {
    events,
    ui,
    addEvent,
    updateEvent,
    deleteEvent,
    setSearchTerm,
    setFilters,
    setPagination,
    getFiltered,
    getStats
  } = useEvents()

  // Local UI state (component-specific)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null)
  const [deleteConfirm, setDeleteConfirm] = React.useState<Event | null>(null)
  const [previewEvent, setPreviewEvent] = React.useState<Event | null>(null)
  const { toast } = useToast()

  // Initialize events data if empty
  React.useEffect(() => {
    if (events.length === 0) {
      // This would be replaced with actual API call
      enhancedMockEvents.forEach(event => addEvent(event))
    }
  }, [events.length, addEvent])

  // Get computed stats and filtered data
  const eventStats = getStats()
  const filteredEvents = getFiltered()

  // Event handlers
  const handleAddEvent = () => {
    setEditingEvent(null)
    setIsDialogOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsDialogOpen(true)
  }

  const handleDeleteEvent = (event: Event) => {
    setDeleteConfirm(event)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteEvent(deleteConfirm.id)
      toast({
        title: "Event Deleted",
        description: `"${deleteConfirm.title}" has been deleted successfully.`,
        variant: "destructive",
      })
      setDeleteConfirm(null)
    }
  }

  const handleSubmitEvent = (eventData: Partial<Event>) => {
    if (editingEvent) {
      // Update existing event
      updateEvent(editingEvent.id, eventData)
      toast({
        title: "Event Updated",
        description: "Event has been updated successfully.",
      })
    } else {
      // Add new event
      const newEvent: Event = {
        id: `evt${Date.now()}`,
        ...eventData,
        createdAt: new Date().toISOString(),
        createdBy: "School Admin",
      } as Event
      addEvent(newEvent)
      toast({
        title: "Event Created",
        description: "New event has been created successfully.",
      })
    }
    setIsDialogOpen(false)
    setEditingEvent(null)
  }

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ui.pageSize)
  const currentPage = ui.currentPage
  const itemsPerPage = ui.pageSize

  // Filter handlers
  const handleStatusFilter = (value: string) => {
    setFilters({ status: value })
  }

  const handleTypeFilter = (value: string) => {
    setFilters({ type: value })
  }

  const handleAudienceFilter = (value: string) => {
    setFilters({ audience: value })
  }

  const handlePaginationChange = (page: number) => {
    setPagination(page)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Fixed Header and Analytics Section */}
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          {/* Header Section */}
          <div className="p-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
                <h1 className="text-4xl font-bold tracking-tight">Events Management</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Create, manage, and track all school events and activities
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleAddEvent} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <Plus className="w-5 h-5" />
                  Create Event
                </Button>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-100">Total Events</p>
                      <p className="text-2xl font-bold text-white">{eventStats.total}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-100">Upcoming</p>
                      <p className="text-2xl font-bold text-white">{eventStats.upcoming}</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-100">Ongoing</p>
                      <p className="text-2xl font-bold text-white">{eventStats.ongoing}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-100">Completed</p>
                      <p className="text-2xl font-bold text-white">{eventStats.completed}</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-100">Cancelled</p>
                      <p className="text-2xl font-bold text-white">{eventStats.cancelled}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-indigo-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters Section */}
          <div className="px-6 pb-6">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
                      placeholder="Search events by title, description, or location..."
            value={ui.searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-3">
                    <Select value={ui.filters.status || "all"} onValueChange={handleStatusFilter}>
                      <SelectTrigger className="w-32 h-11">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Upcoming">🔜 Upcoming</SelectItem>
                        <SelectItem value="Ongoing">🟢 Ongoing</SelectItem>
                        <SelectItem value="Completed">✅ Completed</SelectItem>
                        <SelectItem value="Cancelled">❌ Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={ui.filters.type || "all"} onValueChange={handleTypeFilter}>
                      <SelectTrigger className="w-32 h-11">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Academic">📚 Academic</SelectItem>
                        <SelectItem value="Sports">⚽ Sports</SelectItem>
                        <SelectItem value="Cultural">🎭 Cultural</SelectItem>
                        <SelectItem value="Meeting">🤝 Meeting</SelectItem>
                        <SelectItem value="Holiday">🏖️ Holiday</SelectItem>
                        <SelectItem value="Other">📋 Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={ui.filters.audience || "all"} onValueChange={handleAudienceFilter}>
                      <SelectTrigger className="w-32 h-11">
                        <Users className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Audiences</SelectItem>
                        <SelectItem value="Students">👨‍🎓 Students</SelectItem>
                        <SelectItem value="Teachers">👨‍🏫 Teachers</SelectItem>
                        <SelectItem value="Parents">👨‍👩‍👧‍👦 Parents</SelectItem>
                        <SelectItem value="All">🌍 Everyone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {/* Events Grid */}
              {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No events found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {ui.searchTerm || ui.filters.status !== "all" || ui.filters.type !== "all" || ui.filters.audience !== "all"
                  ? "Try adjusting your filters to see more events."
                  : "Create your first event to get started managing school activities."}
              </p>
              <Button onClick={handleAddEvent} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="w-5 h-5" />
                Create Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card
                      key={event.id}
                  className="border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
                  onClick={() => setPreviewEvent(event)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className={cn("capitalize text-xs", getEventTypeColor(event.type))}>
                          {event.type}
                        </Badge>
                        <Badge className={cn("capitalize text-xs", getPriorityColor(event.priority))} variant="outline">
                          {event.priority}
                        </Badge>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                          <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-blue-100 hover:text-blue-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewEvent(event)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-yellow-100 hover:text-yellow-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditEvent(event)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Event</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-red-100 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteEvent(event)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Event</TooltipContent>
                          </Tooltip>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {truncateText(event.description)}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{event.audience}</span>
                        {event.capacity && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{event.registeredCount}/{event.capacity} registered</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={cn("capitalize", getEventStatusColor(event.status))}>
                        {event.status}
                      </Badge>
                      {event.createdBy && (
                        <span className="text-xs text-gray-500">
                          by {event.createdBy}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePaginationChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePaginationChange(page)}
                          className={cn(
                            "w-10 h-10",
                            currentPage === page && "bg-blue-600 hover:bg-blue-700 text-white"
                          )}
                        >
                          {page}
            </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePaginationChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
              </CardContent>
      </Card>
          )}
        </div>
      </div>

      {/* Event Preview Modal */}
      {previewEvent && (
        <Dialog open={!!previewEvent} onOpenChange={() => setPreviewEvent(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", getPriorityColor(previewEvent.priority))} />
                {previewEvent.title}
              </DialogTitle>
              <DialogDescription>
                Event details and information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Status and Type Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={cn("capitalize", getEventStatusColor(previewEvent.status))}>
                  {previewEvent.status}
                </Badge>
                <Badge className={cn("capitalize", getEventTypeColor(previewEvent.type))}>
                  {previewEvent.type}
                </Badge>
                <Badge className={cn("capitalize", getPriorityColor(previewEvent.priority))} variant="outline">
                  {previewEvent.priority} Priority
                </Badge>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date & Time</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(previewEvent.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{previewEvent.time}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{previewEvent.location}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Target Audience</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{previewEvent.audience}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {previewEvent.capacity && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration</label>
                      <div className="mt-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{previewEvent.registeredCount} registered</span>
                          <span>{previewEvent.capacity} capacity</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (previewEvent.registeredCount! / previewEvent.capacity) * 100)}%` }}
                          />
                        </div>
              </div>
            </div>
                  )}

                  {previewEvent.createdBy && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Created By</label>
                      <p className="text-sm mt-1">{previewEvent.createdBy}</p>
                    </div>
                  )}

                  {previewEvent.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Created Date</label>
                      <p className="text-sm mt-1">
                        {new Date(previewEvent.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-sm mt-2 text-gray-700 leading-relaxed">
                  {previewEvent.description}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setPreviewEvent(null)
                  handleEditEvent(previewEvent)
                }}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setPreviewEvent(null)
                  handleDeleteEvent(previewEvent)
                }}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Event
              </Button>
          </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create/Edit Event Modal */}
      <EventFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        event={editingEvent}
        onSubmit={handleSubmitEvent}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Delete Event
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-1">{deleteConfirm.title}</h4>
                <div className="text-sm text-red-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(deleteConfirm.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {deleteConfirm.location}
                  </div>
                </div>
          </div>
        </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Toaster />
    </TooltipProvider>
  )
}

// Event Form Modal Component
interface EventFormModalProps {
  isOpen: boolean
  onClose: () => void
  event?: Event | null
  onSubmit: (eventData: Partial<Event>) => void
}

function EventFormModal({ isOpen, onClose, event, onSubmit }: EventFormModalProps) {
  const [formData, setFormData] = React.useState<{
    title: string
    description: string
    date: string
    time: string
    location: string
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'
    audience: 'All' | 'Students' | 'Teachers' | 'Parents'
    type: 'Academic' | 'Sports' | 'Cultural' | 'Meeting' | 'Holiday' | 'Other'
    priority: 'Low' | 'Medium' | 'High'
    capacity: string
  }>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    status: 'Upcoming',
    audience: 'All',
    type: 'Other',
    priority: 'Medium',
    capacity: '',
  })

  React.useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        status: event.status || 'Upcoming',
        audience: event.audience || 'All',
        type: event.type || 'Other',
        priority: event.priority || 'Medium',
        capacity: event.capacity ? String(event.capacity) : '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        status: 'Upcoming',
        audience: 'All',
        type: 'Other',
        priority: 'Medium',
        capacity: '',
      })
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      registeredCount: event?.registeredCount || 0,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update event details and information.' : 'Fill in the details to create a new event.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormInput
                label="Event Title"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter event description..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Time</label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>

            <div>
              <FormInput
                label="Location"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter event location..."
                required
              />
            </div>

            <div>
              <FormInput
                label="Capacity (Optional)"
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="Enter max capacity..."
              />
            </div>

            <div>
              <FormSelect
                label="Event Type"
                id="type"
                options={[
                  { value: 'Academic', label: '📚 Academic' },
                  { value: 'Sports', label: '⚽ Sports' },
                  { value: 'Cultural', label: '🎭 Cultural' },
                  { value: 'Meeting', label: '🤝 Meeting' },
                  { value: 'Holiday', label: '🏖️ Holiday' },
                  { value: 'Other', label: '📋 Other' },
                ]}
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              />
            </div>

            <div>
              <FormSelect
                label="Target Audience"
                id="audience"
                options={[
                  { value: 'All', label: '🌍 Everyone' },
                  { value: 'Students', label: '👨‍🎓 Students' },
                  { value: 'Teachers', label: '👨‍🏫 Teachers' },
                  { value: 'Parents', label: '👨‍👩‍👧‍👦 Parents' },
                ]}
                value={formData.audience}
                onValueChange={(value) => setFormData(prev => ({ ...prev, audience: value as any }))}
              />
            </div>

            <div>
              <FormSelect
                label="Priority"
                id="priority"
                options={[
                  { value: 'Low', label: '🔵 Low' },
                  { value: 'Medium', label: '🟡 Medium' },
                  { value: 'High', label: '🔴 High' },
                ]}
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
              />
            </div>

            <div>
              <FormSelect
                label="Status"
                id="status"
                options={[
                  { value: 'Upcoming', label: '🔜 Upcoming' },
                  { value: 'Ongoing', label: '🟢 Ongoing' },
                  { value: 'Completed', label: '✅ Completed' },
                  { value: 'Cancelled', label: '❌ Cancelled' },
                ]}
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              />
            </div>
    </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
