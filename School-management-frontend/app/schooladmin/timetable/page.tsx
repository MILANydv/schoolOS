"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  Users,
  BookOpen,
  AlertCircle,
  Settings,
  Coffee,
  Bell,
  CheckCircle,
  XCircle,
  LayoutGrid,
  List,
  AlertTriangle,
  Menu,
  FileText,
  Save,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Filter,
  MoreHorizontal,
  Zap,
  Target,
  Sparkles,
  MousePointer,
  Keyboard,
  Eye,
  EyeOff,
  RotateCcw,
  Play,
  Shuffle,
  Wand2,
  BarChart3,
  CalendarDays,
  UserCheck,
  Building2,
  Timer,
  TrendingUp,
  Shield,
  Lightbulb,
  Star,
  Heart,
  Zap as ZapIcon
} from "lucide-react"
import { MOCK_CLASSES, MOCK_SUBJECTS, MOCK_USERS, USER_ROLES } from "@/lib/constants"
import { toast } from "sonner"

// Time slot configuration
interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  period: number
  isBreak: boolean
  breakType?: 'short' | 'lunch' | 'assembly'
  duration: number
}

interface SchoolTiming {
  id: string
  name: string
  timeSlots: TimeSlot[]
  totalPeriods: number
  schoolStartTime: string
  schoolEndTime: string
}

// Simple, fixed school timings - no complex shift management needed
const defaultSchoolTimings: SchoolTiming[] = [
  {
    id: "morning-shift",
    name: "Morning (8:00-3:00)",
    schoolStartTime: "08:00",
    schoolEndTime: "15:00",
    totalPeriods: 8,
    timeSlots: [
      { id: "m1", startTime: "08:00", endTime: "08:45", period: 1, isBreak: false, duration: 45 },
      { id: "m2", startTime: "08:45", endTime: "09:30", period: 2, isBreak: false, duration: 45 },
      { id: "m3", startTime: "09:30", endTime: "10:15", period: 3, isBreak: false, duration: 45 },
      { id: "mbreak1", startTime: "10:15", endTime: "10:30", period: 0, isBreak: true, breakType: 'short', duration: 15 },
      { id: "m4", startTime: "10:30", endTime: "11:15", period: 4, isBreak: false, duration: 45 },
      { id: "m5", startTime: "11:15", endTime: "12:00", period: 5, isBreak: false, duration: 45 },
      { id: "mlunch", startTime: "12:00", endTime: "12:45", period: 0, isBreak: true, breakType: 'lunch', duration: 45 },
      { id: "m6", startTime: "12:45", endTime: "13:30", period: 6, isBreak: false, duration: 45 },
      { id: "m7", startTime: "13:30", endTime: "14:15", period: 7, isBreak: false, duration: 45 },
      { id: "m8", startTime: "14:15", endTime: "15:00", period: 8, isBreak: false, duration: 45 },
    ]
  },
  {
    id: "afternoon-shift",
    name: "Afternoon (1:00-8:00)",
    schoolStartTime: "13:00",
    schoolEndTime: "20:00",
    totalPeriods: 7,
    timeSlots: [
      { id: "a1", startTime: "13:00", endTime: "13:50", period: 1, isBreak: false, duration: 50 },
      { id: "a2", startTime: "13:50", endTime: "14:40", period: 2, isBreak: false, duration: 50 },
      { id: "abreak1", startTime: "14:40", endTime: "15:00", period: 0, isBreak: true, breakType: 'short', duration: 20 },
      { id: "a3", startTime: "15:00", endTime: "15:50", period: 3, isBreak: false, duration: 50 },
      { id: "a4", startTime: "15:50", endTime: "16:40", period: 4, isBreak: false, duration: 50 },
      { id: "alunch", startTime: "16:40", endTime: "17:20", period: 0, isBreak: true, breakType: 'lunch', duration: 40 },
      { id: "a5", startTime: "17:20", endTime: "18:10", period: 5, isBreak: false, duration: 50 },
      { id: "a6", startTime: "18:10", endTime: "19:00", period: 6, isBreak: false, duration: 50 },
      { id: "a7", startTime: "19:00", endTime: "19:50", period: 7, isBreak: false, duration: 50 },
    ]
  }
]

// Class-specific timing assignments
interface ClassTimingAssignment {
  classId: string
  timingId: string
  customName?: string
}

const defaultClassTimings: ClassTimingAssignment[] = [
  { classId: "1", timingId: "morning-shift", customName: "Grade 10-A" },
  { classId: "2", timingId: "afternoon-shift", customName: "Grade 10-B" },
  { classId: "3", timingId: "morning-shift", customName: "Grade 11-A" },
  { classId: "4", timingId: "afternoon-shift", customName: "Grade 11-B" },
  { classId: "5", timingId: "morning-shift", customName: "Grade 12-A" },
]

const mockTimetableData = [
  {
    id: "1",
    classId: "1",
    className: "Class 10-A",
    day: "Monday" as const,
    timeSlotId: "1",
    startTime: "08:00",
    endTime: "08:45",
    subjectId: "1",
    subjectName: "Mathematics",
    teacherId: "1",
    teacherName: "John Smith",
    room: "Room 101",
    color: "bg-gray-50 text-gray-900 border-gray-200",
    isBreak: false
  }
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
type Day = typeof days[number]

interface TimetableEntry {
  id: string
  classId: string
  className: string
  day: Day
  timeSlotId: string
  startTime: string
  endTime: string
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  room: string
  color: string
  isBreak: boolean
  breakType?: 'short' | 'lunch' | 'assembly'
}

// Workflow state
type WorkflowStep = 'setup' | 'configure' | 'create' | 'manage'

interface WorkflowState {
  currentStep: WorkflowStep
  timingConfigured: boolean
  hasClasses: boolean
  setupComplete: boolean
}






// Shift management removed - not needed for simple school timetables

// Simple and Convenient Quick Add Form
const QuickAddForm: React.FC<{
  onSave: (subject: string, teacher: string, room: string) => void
  onCancel: () => void
  subjectSuggestions: string[]
  teacherSuggestions: string[]
  roomSuggestions: string[]
}> = ({ onSave, onCancel, subjectSuggestions, teacherSuggestions, roomSuggestions }) => {
  const [subject, setSubject] = React.useState("")
  const [teacher, setTeacher] = React.useState("")
  const [room, setRoom] = React.useState("")
  const [showSubjectDropdown, setShowSubjectDropdown] = React.useState(false)
  const [showTeacherDropdown, setShowTeacherDropdown] = React.useState(false)
  const [showRoomDropdown, setShowRoomDropdown] = React.useState(false)

  // Close all dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.relative')) {
        setShowSubjectDropdown(false)
        setShowTeacherDropdown(false)
        setShowRoomDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subject.trim() || !teacher.trim() || !room.trim()) {
      return
    }
    
    onSave(subject.trim(), teacher.trim(), room.trim())
    // Reset form and close dropdowns
    setSubject("")
    setTeacher("")
    setRoom("")
    setShowSubjectDropdown(false)
    setShowTeacherDropdown(false)
    setShowRoomDropdown(false)
  }

  const handleCancel = () => {
    setSubject("")
    setTeacher("")
    setRoom("")
    setShowSubjectDropdown(false)
    setShowTeacherDropdown(false)
    setShowRoomDropdown(false)
    onCancel()
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-3 bg-white border border-slate-200 rounded-lg shadow-sm z-50 min-w-[400px] max-w-[500px]">
        {/* Simple Header */}
        <div className="px-3 py-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center">
              <Plus className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">Add New Entry</div>
              <div className="text-xs text-slate-500">Fill in the details below</div>
            </div>
          </div>
        </div>

                {/* Form Content */}
        <div className="p-3 space-y-3">
          {/* Subject Input with Searchable Dropdown */}
          <div className="relative">
            <Label htmlFor="subject" className="text-xs font-medium text-slate-700 mb-1 block text-left">
              Subject <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="subject"
                placeholder="Search or type subject name..."
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  setShowSubjectDropdown(true)
                }}
                onFocus={() => setShowSubjectDropdown(true)}
                className="h-8 text-sm border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors pr-8"
                autoFocus
                maxLength={50}
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            </div>
            {/* Subject Suggestions Dropdown */}
            {showSubjectDropdown && subject && subjectSuggestions.filter(s => 
              s.toLowerCase().includes(subject.toLowerCase())
            ).length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                {subjectSuggestions
                  .filter(s => s.toLowerCase().includes(subject.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer border-b border-slate-100 last:border-b-0"
                      onClick={() => {
                        setSubject(suggestion)
                        setShowSubjectDropdown(false)
                      }}
                    >
                      {suggestion}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
      
          {/* Teacher Input with Searchable Dropdown */}
          <div className="relative">
            <Label htmlFor="teacher" className="text-xs font-medium text-slate-700 mb-1 block text-left">
              Teacher <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="teacher"
                placeholder="Search or type teacher name..."
                value={teacher}
                onChange={(e) => {
                  setTeacher(e.target.value)
                  setShowTeacherDropdown(true)
                }}
                onFocus={() => setShowTeacherDropdown(true)}
                className="h-8 text-sm border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors pr-8"
                maxLength={50}
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            </div>
            {/* Teacher Suggestions Dropdown */}
            {showTeacherDropdown && teacher && teacherSuggestions.filter(t => 
              t.toLowerCase().includes(teacher.toLowerCase())
            ).length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                {teacherSuggestions
                  .filter(t => t.toLowerCase().includes(teacher.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer border-b border-slate-100 last:border-b-0"
                      onClick={() => {
                        setTeacher(suggestion)
                        setShowTeacherDropdown(false)
                      }}
                    >
                      {suggestion}
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* Room Input with Searchable Dropdown */}
          <div className="relative">
            <Label htmlFor="room" className="text-xs font-medium text-slate-700 mb-1 block text-left">
              Room <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="room"
                placeholder="Search or type room number..."
                value={room} 
                onChange={(e) => {
                  setRoom(e.target.value)
                  setShowRoomDropdown(true)
                }}
                onFocus={() => setShowRoomDropdown(true)}
                className="h-8 text-sm border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors pr-8"
                maxLength={20}
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            </div>
            {/* Room Suggestions Dropdown */}
            {showRoomDropdown && room && roomSuggestions.filter(r => 
              r.toLowerCase().includes(room.toLowerCase())
            ).length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                {roomSuggestions
                  .filter(r => r.toLowerCase().includes(room.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer border-b border-slate-100 last:border-b-0"
                      onClick={() => {
                        setRoom(suggestion)
                        setShowRoomDropdown(false)
                      }}
                    >
                      {suggestion}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
        
                {/* Form Actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-200">
          <Button 
            type="submit" 
            size="default" 
            className="flex-1 h-8 bg-slate-700 text-white text-sm"
            disabled={!subject.trim() || !teacher.trim() || !room.trim()}
          >
            <Plus className="h-3 w-3 mr-2" />
            Add Entry
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="default" 
            onClick={handleCancel} 
            className="h-8 px-4 border-slate-200"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

// Quick Edit Form Component  
const QuickEditForm: React.FC<{
  entry: TimetableEntry
  onSave: (updates: Partial<TimetableEntry>) => void
  onCancel: () => void
}> = ({ entry, onSave, onCancel }) => {
  const [subject, setSubject] = React.useState(entry.subjectName)
  const [teacher, setTeacher] = React.useState(entry.teacherName)
  const [room, setRoom] = React.useState(entry.room)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      subjectName: subject,
      teacherName: teacher,
      room: room
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div>
        <Label className="text-xs font-medium text-slate-700 mb-1 block">Subject</Label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-8 text-xs border-slate-200 focus:border-slate-500 focus:ring-slate-500"
          autoFocus
        />
      </div>
      <div>
        <Label className="text-xs font-medium text-slate-700 mb-1 block">Teacher</Label>
        <Input
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          className="h-8 text-xs border-slate-200 focus:border-slate-500 focus:ring-slate-500"
        />
      </div>
      <div>
        <Label className="text-xs font-medium text-slate-700 mb-1 block">Room</Label>
        <Input
          value={room} 
          onChange={(e) => setRoom(e.target.value)} 
          className="h-8 text-xs border-slate-200 focus:border-slate-500 focus:ring-slate-500"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" className="h-7 px-3 text-xs bg-slate-700 hover:bg-slate-800 text-white">
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel} className="h-7 px-3 text-xs border-slate-200 hover:bg-slate-100">
          <XCircle className="h-3 w-3 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  )
}

// Removed TimingAssignmentDialog - simplified approach
// Removed state variables

// Removed entire broken TimingAssignmentDialog component - simplified approach

// Enhanced Time Configuration Component with Fixed Header
const TimeConfigurationDialog: React.FC<{
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  timing: SchoolTiming
  onSave: (timing: SchoolTiming) => void
  onAddSlot: (afterSlotId?: string) => void
  onAddBreakSlot: (afterSlotId: string, breakType?: 'short' | 'lunch' | 'assembly') => void
  onUpdateSlot: (slotId: string, updates: Partial<TimeSlot>) => void
  onDeleteSlot: (slotId: string) => void
}> = ({ isOpen, onOpenChange, timing, onSave, onAddSlot, onAddBreakSlot, onUpdateSlot, onDeleteSlot }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)
  const [newlyAddedSlotId, setNewlyAddedSlotId] = React.useState<string | null>(null)
  const [isAddingSlot, setIsAddingSlot] = React.useState(false)
  const [addingSlotType, setAddingSlotType] = React.useState<'period' | 'break' | null>(null)

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await onSave(timing)
      setHasChanges(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving timing configuration:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSlotUpdate = (slotId: string, updates: Partial<TimeSlot>) => {
    onUpdateSlot(slotId, updates)
    setHasChanges(true)
  }

  const handleAddSlot = (afterSlotId?: string) => {
    setIsAddingSlot(true)
    setAddingSlotType('period')
    
    // Call the parent function
    onAddSlot(afterSlotId)
    setHasChanges(true)
    
    // Get the newly added slot ID (we'll need to track this)
    setTimeout(() => {
      const newSlot = timing.timeSlots.find(s => !s.id.startsWith('slot-') || s.id.includes(Date.now().toString()))
      if (newSlot) {
        setNewlyAddedSlotId(newSlot.id)
        // Remove highlight after 5 seconds
        setTimeout(() => setNewlyAddedSlotId(null), 5000)
      }
      setIsAddingSlot(false)
      setAddingSlotType(null)
    }, 1000)
  }

  const handleAddBreakSlot = (afterSlotId: string, breakType: 'short' | 'lunch' | 'assembly' = 'short') => {
    setIsAddingSlot(true)
    setAddingSlotType('break')
    
    // Call the parent function
    onAddBreakSlot(afterSlotId, breakType)
    setHasChanges(true)
    
    // Get the newly added slot ID
    setTimeout(() => {
      const newSlot = timing.timeSlots.find(s => !s.id.startsWith('break-') || s.id.includes(Date.now().toString()))
      if (newSlot) {
        setNewlyAddedSlotId(newSlot.id)
        // Remove highlight after 5 seconds
        setTimeout(() => setNewlyAddedSlotId(null), 5000)
      }
      setIsAddingSlot(false)
      setAddingSlotType(null)
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-slate-900">Time Configuration</div>
              <div className="text-sm text-slate-500">Configure daily schedule</div>
            </div>
            <div className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
              ⌘+S to save
            </div>
          </div>

          {/* Enhanced Actions Bar */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
            <Button 
              size="sm" 
              onClick={() => handleAddSlot()}
              disabled={isAddingSlot}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 transition-all duration-200 hover:scale-105 shadow-md"
            >
              {isAddingSlot && addingSlotType === 'period' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isAddingSlot && addingSlotType === 'period' ? 'Adding Period...' : 'Add Period'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleAddBreakSlot(timing.timeSlots[timing.timeSlots.length - 1]?.id, 'short')}
              disabled={isAddingSlot}
              className="border-orange-300 hover:bg-orange-50 text-orange-700 font-medium px-4 py-2 transition-all duration-200 hover:scale-105"
            >
              {isAddingSlot && addingSlotType === 'break' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Coffee className="h-4 w-4 mr-2" />
              )}
              {isAddingSlot && addingSlotType === 'break' ? 'Adding Break...' : 'Add Break'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleAddBreakSlot(timing.timeSlots[timing.timeSlots.length - 1]?.id, 'lunch')}
              disabled={isAddingSlot}
              className="border-amber-300 hover:bg-amber-50 text-amber-700 font-medium px-4 py-2 transition-all duration-200 hover:scale-105"
            >
              <span className="mr-2">🍽️</span>
              Lunch Break
            </Button>
            <div className="ml-auto flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-slate-200">
                <BookOpen className="h-3 w-3 text-slate-600" />
                <span className="font-medium text-slate-700">{timing.timeSlots.filter(s => !s.isBreak).length}</span>
                <span className="text-slate-500">periods</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-slate-200">
                <Coffee className="h-3 w-3 text-slate-600" />
                <span className="font-medium text-slate-700">{timing.timeSlots.filter(s => s.isBreak).length}</span>
                <span className="text-slate-500">breaks</span>
              </div>
              
              {/* Loading Indicator */}
              {isAddingSlot && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs font-medium">
                    Adding {addingSlotType === 'period' ? 'period' : 'break'}...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Success Notification */}
        {newlyAddedSlotId && (
          <div className="fixed top-20 right-8 z-50 bg-white border border-green-200 rounded-lg shadow-xl p-4 max-w-sm animate-in slide-in-from-right-5 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-green-800">Slot Added Successfully!</div>
                <div className="text-sm text-green-600">
                  {timing.timeSlots.find(s => s.id === newlyAddedSlotId)?.isBreak ? 'Break' : 'Period'} has been added to your configuration.
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNewlyAddedSlotId(null)}
                className="h-6 w-6 text-green-600 hover:bg-green-50"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Scrollable Content with Better Scrolling */}
        <div className="overflow-y-auto p-6 pt-4 space-y-6 max-h-[calc(90vh-200px)] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">

                    {/* Clean Time Slots Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">Time Slots</h3>
              <p className="text-xs text-slate-600 mt-1">Configure periods and breaks</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                                 <thead className="bg-slate-50">
                   <tr>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Type</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Start Time</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">End Time</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Duration</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Details</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
                   </tr>
                 </thead>
                <tbody className="divide-y divide-slate-100">
                  {timing.timeSlots.map((slot, index) => (
                    <tr 
                      key={slot.id} 
                      className={`hover:bg-slate-50 transition-all duration-500 ${
                        newlyAddedSlotId === slot.id 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 shadow-lg scale-[1.01] animate-pulse ring-2 ring-green-200 ring-opacity-50' 
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${
                            slot.isBreak 
                              ? 'bg-slate-100 text-slate-600' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {slot.isBreak ? (
                              <Coffee className="h-3 w-3" />
                            ) : (
                              <BookOpen className="h-3 w-3" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {slot.isBreak ? 'Break' : 'Period'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {slot.isBreak ? 'Rest' : 'Learning'}
                            </div>
                          </div>
                        </div>
                        
                        {/* New Slot Indicator */}
                        {newlyAddedSlotId === slot.id && (
                          <div className="mt-2 flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                            <CheckCircle className="h-3 w-3" />
                            Newly Added
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleSlotUpdate(slot.id, { startTime: e.target.value })}
                          className="w-28 h-8 border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleSlotUpdate(slot.id, { endTime: e.target.value })}
                          className="w-28 h-8 border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={slot.duration}
                            onChange={(e) => handleSlotUpdate(slot.id, { duration: parseInt(e.target.value) })}
                            className="w-16 h-8 border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded text-sm text-center"
                            min="5"
                            max="120"
                          />
                          <span className="text-xs text-slate-500">min</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {slot.isBreak ? (
                          <Select
                            value={slot.breakType || 'short'}
                            onValueChange={(value) => handleSlotUpdate(slot.id, { breakType: value as 'short' | 'lunch' | 'assembly' })}
                          >
                            <SelectTrigger className="w-28 h-8 border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short</SelectItem>
                              <SelectItem value="lunch">Lunch</SelectItem>
                              <SelectItem value="assembly">Assembly</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-2 py-0.5 text-xs">
                              Period {slot.period}
                            </Badge>
                            <span className="text-xs text-slate-500">#{index + 1}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddSlot(slot.id)}
                            disabled={isAddingSlot}
                            className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-200"
                            title="Add period after this slot"
                          >
                            {isAddingSlot && addingSlotType === 'period' ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </Button>
                          {!slot.isBreak && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAddBreakSlot(slot.id)}
                              disabled={isAddingSlot}
                              className="h-7 w-7 p-0 hover:bg-orange-100 hover:text-orange-700 hover:scale-110 transition-all duration-200"
                              title="Add break after this slot"
                          >
                            {isAddingSlot && addingSlotType === 'break' ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Coffee className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { onDeleteSlot(slot.id); setHasChanges(true) }}
                          className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 text-slate-400 hover:text-red-600"
                          title="Delete this slot"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

          {/* Clean Save Section */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {hasChanges && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Unsaved changes</span>
                  </div>
                )}
                <div className="text-sm text-slate-600">
                  <span className="font-medium">{timing.timeSlots.length}</span> total slots configured
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="h-11 px-6 border-slate-300 hover:bg-slate-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!hasChanges || isSubmitting}
                  className="h-11 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SchoolAdminTimetablePage() {
  const [timetable, setTimetable] = React.useState<TimetableEntry[]>(mockTimetableData)
  const [selectedClass, setSelectedClass] = React.useState("1")
  const [selectedEntry, setSelectedEntry] = React.useState<TimetableEntry | null>(null)
  const [isTimingDialogOpen, setIsTimingDialogOpen] = React.useState(false)
  // Removed timing assignment - simplified approach

  const [isSetupWizardOpen, setIsSetupWizardOpen] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<"weekly" | "list">("weekly")
  // Simplified - removed complex timing assignments
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const [editingCell, setEditingCell] = React.useState<{day: Day, slotId: string} | null>(null)
  const [quickAddMode, setQuickAddMode] = React.useState(false)
  
  // Enhanced UX states
  const [searchTerm, setSearchTerm] = React.useState("")
  const [draggedEntry, setDraggedEntry] = React.useState<TimetableEntry | null>(null)
  const [dragOverCell, setDragOverCell] = React.useState<{day: Day, slotId: string} | null>(null)
  const [showConflicts, setShowConflicts] = React.useState(true)
  const [showEmptySlots, setShowEmptySlots] = React.useState(true)
  const [recentActions, setRecentActions] = React.useState<any[]>([])
  const [contextMenu, setContextMenu] = React.useState<{x: number, y: number, entry: TimetableEntry} | null>(null)
  const [showShortcuts, setShowShortcuts] = React.useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = React.useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [newlyAddedSlot, setNewlyAddedSlot] = React.useState<string | null>(null)
  const [isAddingSlot, setIsAddingSlot] = React.useState(false)
  const [addingSlotType, setAddingSlotType] = React.useState<'period' | 'break' | null>(null)
  
  // Smart suggestions
  const [subjectSuggestions] = React.useState([
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 
    'Geography', 'Computer Science', 'Physical Education', 'Art', 'Music'
  ])
  const [teacherSuggestions] = React.useState([
    'John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'Robert Wilson',
    'Lisa Anderson', 'David Brown', 'Amanda Garcia', 'James Taylor', 'Rachel Lee'
  ])
  const [roomSuggestions] = React.useState([
    'Room 101', 'Room 102', 'Lab A', 'Lab B', 'Library', 'Gym', 'Art Room', 'Music Room'
  ])

  // Simplified - use default timing for all classes
  const [selectedTiming, setSelectedTiming] = React.useState<SchoolTiming>(defaultSchoolTimings[0])
  
  // Workflow state
  const [workflowState, setWorkflowState] = React.useState<WorkflowState>({
    currentStep: 'setup',
    timingConfigured: true,
    hasClasses: MOCK_CLASSES.length > 0,
    setupComplete: true
  })

  const handleAddEntry = (newEntry: TimetableEntry) => {
    setTimetable((prev) => [...prev, newEntry])
    toast.success("Entry added successfully!")
  }

  const handleEditEntry = (updatedEntry: TimetableEntry) => {
    setTimetable((prev) => prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e)))
    setSelectedEntry(null)
    toast.success("Entry updated successfully!")
  }

  const handleDeleteEntry = (id: string) => {
    setTimetable((prev) => prev.filter((e) => e.id !== id))
    toast.success("Entry deleted successfully!")
  }

  // Quick add/edit functions for table
  const handleQuickAdd = (day: Day, slotId: string, subject: string, teacher: string, room: string) => {
    const slot = selectedTiming.timeSlots.find(s => s.id === slotId)
    if (!slot || slot.isBreak) return

    const newEntry: TimetableEntry = {
      id: `entry-${Date.now()}-${Math.random()}`,
      classId: selectedClass,
      className: MOCK_CLASSES.find(c => c.id === selectedClass)?.name || "",
      day,
      timeSlotId: slotId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subjectId: Math.random().toString(),
      subjectName: subject,
      teacherId: Math.random().toString(),
      teacherName: teacher,
      room,
      color: getRandomColor(),
      isBreak: false
    }
    setTimetable(prev => [...prev, newEntry])
    setEditingCell(null)
    toast.success("Entry added successfully!")
  }

  const handleQuickEdit = (entryId: string, updates: Partial<TimetableEntry>) => {
    setTimetable(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, ...updates } : entry
    ))
    setEditingCell(null)
    toast.success("Entry updated!")
  }

  const getRandomColor = () => {
    const colors = [
      "bg-gray-50 text-gray-900 border-gray-200",
      "bg-slate-50 text-slate-900 border-slate-200", 
      "bg-zinc-50 text-zinc-900 border-zinc-200",
      "bg-neutral-50 text-neutral-900 border-neutral-200"
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Time management helpers
  const addTimeSlot = (afterSlotId?: string) => {
    setIsAddingSlot(true)
    setAddingSlotType('period')
    
    // Calculate proper time for new slot
    let startTime = "09:00"
    let endTime = "09:45"
    
    if (afterSlotId) {
      const afterSlot = selectedTiming.timeSlots.find(s => s.id === afterSlotId)
      if (afterSlot) {
        startTime = afterSlot.endTime
        // Calculate end time (45 minutes later)
        const [hours, minutes] = startTime.split(':').map(Number)
        const endDate = new Date()
        endDate.setHours(hours, minutes + 45, 0, 0)
        endTime = endDate.toTimeString().slice(0, 5)
      }
    } else {
      // Add at the end
      const lastSlot = selectedTiming.timeSlots[selectedTiming.timeSlots.length - 1]
      if (lastSlot) {
        startTime = lastSlot.endTime
        const [hours, minutes] = startTime.split(':').map(Number)
        const endDate = new Date()
        endDate.setHours(hours, minutes + 45, 0, 0)
        endTime = endDate.toTimeString().slice(0, 5)
      }
    }
    
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime,
      endTime, 
      period: selectedTiming.timeSlots.filter(s => !s.isBreak).length + 1,
      isBreak: false,
      duration: 45
    }
    
    const updatedSlots = afterSlotId 
      ? insertAfterSlot(selectedTiming.timeSlots, newSlot, afterSlotId)
      : [...selectedTiming.timeSlots, newSlot]
    
    // Update local state with visual feedback
    const updatedTiming = {
      ...selectedTiming,
      timeSlots: updatedSlots,
      totalPeriods: updatedSlots.filter(s => !s.isBreak).length
    }
    
    // Update the selectedTiming state to trigger re-render
    setSelectedTiming(updatedTiming)
    
    // Enhanced visual feedback - longer highlight and better animation
    setNewlyAddedSlot(newSlot.id)
    
    // Scroll to the new slot for better visibility
    setTimeout(() => {
      const element = document.getElementById(`time-slot-${newSlot.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    
    // Remove highlight after 5 seconds for better visibility
    setTimeout(() => setNewlyAddedSlot(null), 5000)
    
    // Enhanced user feedback with better toast
    toast.success("New Period Added! 🎉", {
      description: `Period ${newSlot.period} added at ${newSlot.startTime}-${newSlot.endTime}`,
      duration: 4000,
      icon: <BookOpen className="h-4 w-4" />,
      action: {
        label: "View",
        onClick: () => {
          const element = document.getElementById(`time-slot-${newSlot.id}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }
    })
    
    // Trigger auto-save
    triggerAutoSave()
    
    // Reset loading state after a short delay for visual feedback
    setTimeout(() => {
      setIsAddingSlot(false)
      setAddingSlotType(null)
    }, 800)
  }

  const addBreakSlot = (afterSlotId: string, breakType: 'short' | 'lunch' | 'assembly' = 'short') => {
    setIsAddingSlot(true)
    setAddingSlotType('break')
    
    // Calculate proper time for new break
    let startTime = "10:00"
    let endTime = "10:15"
    let duration = 15
    
    if (afterSlotId) {
      const afterSlot = selectedTiming.timeSlots.find(s => s.id === afterSlotId)
      if (afterSlot) {
        startTime = afterSlot.endTime
        // Calculate end time based on break type
        if (breakType === 'lunch') duration = 45
        else if (breakType === 'assembly') duration = 30
        else duration = 15
        
        const [hours, minutes] = startTime.split(':').map(Number)
        const endDate = new Date()
        endDate.setHours(hours, minutes + duration, 0, 0)
        endTime = endDate.toTimeString().slice(0, 5)
      }
    }
    
    const newBreak: TimeSlot = {
      id: `break-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime,
      endTime,
      period: 0,
      isBreak: true,
      breakType,
      duration
    }
    
    const updatedSlots = insertAfterSlot(selectedTiming.timeSlots, newBreak, afterSlotId)
    
    // Update local state with visual feedback
    const updatedTiming = {
      ...selectedTiming,
      timeSlots: updatedSlots
    }
    
    // Update the selectedTiming state to trigger re-render
    setSelectedTiming(updatedTiming)
    
    // Enhanced visual feedback - longer highlight and better animation
    setNewlyAddedSlot(newBreak.id)
    
    // Scroll to the new break for better visibility
    setTimeout(() => {
      const element = document.getElementById(`time-slot-${newBreak.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    
    // Remove highlight after 5 seconds for better visibility
    setTimeout(() => setNewlyAddedSlot(null), 5000)
    
    // Enhanced user feedback with better toast
    const breakEmoji = breakType === 'lunch' ? '🍽️' : breakType === 'assembly' ? '📢' : '☕'
    toast.success(`${breakType.charAt(0).toUpperCase() + breakType.slice(1)} Break Added! ${breakEmoji}`, {
      description: `${breakType.charAt(0).toUpperCase() + breakType.slice(1)} break added at ${newBreak.startTime}-${newBreak.endTime}`,
      duration: 4000,
      icon: <Coffee className="h-4 w-4" />,
      action: {
        label: "View",
        onClick: () => {
          const element = document.getElementById(`time-slot-${newBreak.id}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }
    })
    
    // Trigger auto-save
    triggerAutoSave()
    
    // Reset loading state after a short delay for visual feedback
    setTimeout(() => {
      setIsAddingSlot(false)
      setAddingSlotType(null)
    }, 800)
  }

  const insertAfterSlot = (slots: TimeSlot[], newSlot: TimeSlot, afterId: string): TimeSlot[] => {
    const index = slots.findIndex(s => s.id === afterId)
    return [...slots.slice(0, index + 1), newSlot, ...slots.slice(index + 1)]
  }

  const updateTimeSlot = (slotId: string, updates: Partial<TimeSlot>) => {
    const updatedSlots = selectedTiming.timeSlots.map(slot => 
      slot.id === slotId ? { ...slot, ...updates } : slot
    )
    
    // Update local state with visual feedback
    const updatedTiming = {
      ...selectedTiming,
      timeSlots: updatedSlots
    }
    
    // Update the selectedTiming state to trigger re-render
    setSelectedTiming(updatedTiming)
    
    // Trigger auto-save for time updates
    triggerAutoSave()
  }

  const deleteTimeSlot = (slotId: string) => {
    setIsAddingSlot(true)
    
    const slotToDelete = selectedTiming.timeSlots.find(slot => slot.id === slotId)
    const updatedSlots = selectedTiming.timeSlots.filter(slot => slot.id !== slotId)
    
    // Update local state with visual feedback
    const updatedTiming = {
      ...selectedTiming,
      timeSlots: updatedSlots,
      totalPeriods: updatedSlots.filter(s => !s.isBreak).length
    }
    
    // Update the selectedTiming state to trigger re-render
    setSelectedTiming(updatedTiming)
    
    // Remove related timetable entries
    setTimetable(prev => prev.filter(entry => entry.timeSlotId !== slotId))
    
    // Enhanced user feedback
    if (slotToDelete) {
      const slotType = slotToDelete.isBreak ? 'break' : 'period'
      const slotName = slotToDelete.isBreak ? slotToDelete.breakType : `Period ${slotToDelete.period}`
      
      toast.success(`${slotName} deleted successfully!`, {
        description: `${slotType.charAt(0).toUpperCase() + slotType.slice(1)} removed from schedule`,
        duration: 3000,
        icon: <Trash2 className="h-4 w-4" />
      })
    }
    
    // Trigger auto-save
    triggerAutoSave()
    
    // Reset loading state after a short delay for visual feedback
    setTimeout(() => setIsAddingSlot(false), 500)
  }

  // Simplified - removed complex timing management functions



  // Enhanced UX functions
  
  // Smart auto-save with visual feedback
  const triggerAutoSave = React.useCallback(() => {
        setAutoSaveStatus('saving')
        setTimeout(() => {
          setAutoSaveStatus('saved')
      toast.success("Auto-saved", { 
        duration: 1000,
        icon: <Sparkles className="h-4 w-4" />
      })
        }, 800)
  }, [])

  // Drag and drop handlers
  const handleDragStart = (entry: TimetableEntry, e: React.DragEvent) => {
    setDraggedEntry(entry)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', entry.id)
  }

  const handleDragOver = (day: Day, slotId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCell({ day, slotId })
  }

  const handleDragLeave = () => {
    setDragOverCell(null)
  }

  const handleDrop = (day: Day, slotId: string, e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedEntry) return

    const slot = selectedTiming.timeSlots.find(s => s.id === slotId)
    if (!slot || slot.isBreak) return

    // Move entry to new position
    const updatedEntry = {
      ...draggedEntry,
      day,
      timeSlotId: slotId,
      startTime: slot.startTime,
      endTime: slot.endTime
    }

    setTimetable(prev => prev.map(entry => 
      entry.id === draggedEntry.id ? updatedEntry : entry
    ))

    setDraggedEntry(null)
    setDragOverCell(null)
    triggerAutoSave()
    toast.success("Entry moved successfully!")
  }

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, entry: TimetableEntry) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      entry
    })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }



  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            setShowShortcuts(true)
            break
          case 'f':
            e.preventDefault()
            document.getElementById('search-input')?.focus()
            break
          case 'q':
            e.preventDefault()
            setQuickAddMode(!quickAddMode)
            break
          case 'h':
            e.preventDefault()
            setShowConflicts(!showConflicts)
            break
          case 'e':
            e.preventDefault()
            setShowEmptySlots(!showEmptySlots)
            break
        }
      }
      if (e.key === 'Escape') {
        setEditingCell(null)
        setContextMenu(null)
        setShowShortcuts(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', closeContextMenu)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', closeContextMenu)
    }
  }, [quickAddMode, showConflicts, showEmptySlots])

  // Auto-save trigger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (autoSaveStatus === 'unsaved') {
        triggerAutoSave()
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [timetable, autoSaveStatus, triggerAutoSave])

  // Mark as unsaved when data changes
  React.useEffect(() => {
    setAutoSaveStatus('unsaved')
  }, [timetable])

  const filteredTimetable = React.useMemo(() => {
    return timetable.filter(entry => {
      const matchesClass = entry.classId === selectedClass
      const matchesSearch = searchTerm === "" || 
        entry.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.room.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesClass && matchesSearch
    })
  }, [timetable, selectedClass, searchTerm])

  // Smart conflict detection
  const detectConflicts = React.useMemo(() => {
    const conflicts: string[] = []
    const teacherSchedule = new Map<string, Set<string>>()
    const roomSchedule = new Map<string, Set<string>>()

    filteredTimetable.forEach(entry => {
      if (entry.isBreak) return
      
      const timeKey = `${entry.day}-${entry.timeSlotId}`
      
      // Teacher conflicts
      if (!teacherSchedule.has(entry.teacherId)) {
        teacherSchedule.set(entry.teacherId, new Set())
      }
      if (teacherSchedule.get(entry.teacherId)!.has(timeKey)) {
        conflicts.push(`${entry.teacherName} has overlapping classes`)
      }
      teacherSchedule.get(entry.teacherId)!.add(timeKey)

      // Room conflicts  
      if (!roomSchedule.has(entry.room)) {
        roomSchedule.set(entry.room, new Set())
      }
      if (roomSchedule.get(entry.room)!.has(timeKey)) {
        conflicts.push(`${entry.room} is double-booked`)
      }
      roomSchedule.get(entry.room)!.add(timeKey)
    })

    return conflicts
  }, [filteredTimetable])
  
  // Group by day for weekly view
  const weeklyData = days.reduce((acc, day) => {
    acc[day] = selectedTiming.timeSlots.map(timeSlot => {
      const entry = filteredTimetable.find(e => e.day === day && e.timeSlotId === timeSlot.id)
      return entry || {
        id: `empty-${day}-${timeSlot.id}`,
        classId: selectedClass,
        className: "",
        day: day as Day,
        timeSlotId: timeSlot.id,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        subjectId: "",
        subjectName: timeSlot.isBreak ? `${timeSlot.breakType} Break` : "",
        teacherId: "",
        teacherName: "",
        room: "",
        color: timeSlot.isBreak ? "bg-gray-100 text-gray-700 border-gray-200" : "bg-gray-50",
        isBreak: timeSlot.isBreak,
        breakType: timeSlot.breakType
      }
    })
    return acc
  }, {} as Record<Day, TimetableEntry[]>)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Clean Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} border-r border-slate-200 bg-white transition-all duration-300 flex flex-col`}>
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {sidebarOpen ? (
            <div className="space-y-6">
              {/* View Mode Toggle */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-700">View Mode</div>
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === "weekly" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewMode("weekly")}
                    className="flex-1"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Weekly
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="flex-1"
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>

              {/* Class Selection */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-700">Classes</div>
                <div className="space-y-2">
                  {MOCK_CLASSES.map((cls) => {
                    const isSelected = selectedClass === cls.id
                    return (
                      <Button
                        key={cls.id}
                        variant="ghost"
                        onClick={() => setSelectedClass(cls.id)}
                        className={`w-full justify-start p-3 h-auto ${
                          isSelected 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            isSelected 
                              ? "bg-blue-600 text-white" 
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {cls.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <div className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                              {cls.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {selectedTiming.schoolStartTime}-{selectedTiming.schoolEndTime}
                            </div>
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Simple Stats */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-700">Quick Stats</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Entries</span>
                    <span className="font-medium">{filteredTimetable.length}</span>
                  </div>
                  {detectConflicts.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-red-600">Conflicts</span>
                      <span className="font-medium text-red-600">{detectConflicts.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_CLASSES.map((cls) => (
                <Button
                  key={cls.id}
                  variant={selectedClass === cls.id ? "default" : "ghost"}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`w-14 h-14 p-0 rounded-lg ${
                    selectedClass === cls.id 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-slate-100"
                  }`}
                >
                  <span className="text-lg font-bold">{cls.name.charAt(0)}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col">
                {/* Main Header with Sidebar Toggle */}
        <div className="bg-white border-b border-slate-200">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Sidebar Toggle Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-slate-600 hover:bg-slate-100"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* Timetable Title and Icon */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-slate-900">Timetable Management</h1>
                    <div className="text-sm text-slate-500">
                      {MOCK_CLASSES.find(c => c.id === selectedClass)?.name} • {selectedTiming.schoolStartTime}-{selectedTiming.schoolEndTime}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Class Info */}
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{filteredTimetable.filter(e => !e.isBreak).length} Periods</span>
                  </div>
                  {detectConflicts.length > 0 && showConflicts && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{detectConflicts.length} Conflicts</span>
                    </div>
                  )}
                </div>
                
                {/* Auto-save status */}
                <div className="flex items-center gap-2 text-sm">
                  {autoSaveStatus === 'saving' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                      <CheckCircle className="h-4 w-4" />
                      <span>Saved</span>
                    </div>
                  )}
                  {autoSaveStatus === 'unsaved' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                      <Clock className="h-4 w-4" />
                      <span>Unsaved</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant={quickAddMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => {
                    if (quickAddMode) {
                      setQuickAddMode(false)
                      setEditingCell(null)
                    } else {
                      setQuickAddMode(true)
                    }
                  }}
                  className={quickAddMode ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {quickAddMode ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Exit Quick Add
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Quick Add
                    </>
                  )}
                </Button>
                {/* Removed Assign Shifts - Not needed for most schools */}

                <Button variant="outline" size="sm" onClick={() => setIsTimingDialogOpen(true)} className="hover:bg-slate-100">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Times
                </Button>
              </div>
            </div>
          </div>

          {/* Compact Search Bar */}
          <div className="px-4 pb-4 border-t border-slate-200 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
            {/* Compact Status Indicators */}
            <div className="flex items-center gap-2 py-2 mb-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span className="text-xs text-slate-600">Ready</span>
              </div>
              {detectConflicts.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-md">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600">{detectConflicts.length} conflicts</span>
                </div>
              )}
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-md">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-600">Auto-save</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-6">
                {/* Compact Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <Input
                    id="search-input"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-9 text-sm"
                  />
                  {searchTerm && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
                    >
                      <XCircle className="h-2 w-2" />
                    </Button>
                  )}
                </div>

                {/* Compact View Options */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConflicts(!showConflicts)}
                    className={`text-xs px-2 py-1 rounded-md transition-all ${
                      showConflicts 
                        ? "bg-red-50 text-red-700 border border-red-200" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {showConflicts ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    <span className="text-xs">Conflicts</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmptySlots(!showEmptySlots)}
                    className={`text-xs px-2 py-1 rounded-md transition-all ${
                      showEmptySlots 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {showEmptySlots ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    <span className="text-xs">Empty</span>
                  </Button>
                </div>
              </div>

              {/* Compact Stats */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md border border-slate-200">
                  <BarChart3 className="h-3 w-3 text-slate-600" />
                  <span className="text-slate-700">{filteredTimetable.length}</span>
                </div>
                {detectConflicts.length > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-md border border-red-200">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{detectConflicts.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
                    {/* Enhanced Quick Add Mode Bar */}
          {quickAddMode && (
            <div className="px-4 pb-3 border-t border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 text-sm text-emerald-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Quick Add Mode</div>
                    <div className="text-xs text-emerald-600">Add periods and breaks instantly</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => addTimeSlot()}
                    className="hover:bg-emerald-100 border-emerald-200 h-8 px-4 text-sm font-medium transition-all duration-200 hover:scale-105"
                    disabled={isAddingSlot}
                  >
                    {isAddingSlot ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Period
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      const lastSlot = selectedTiming.timeSlots[selectedTiming.timeSlots.length - 1]
                      addBreakSlot(lastSlot.id, 'short')
                    }}
                    className="hover:bg-orange-100 border-orange-200 h-8 px-4 text-sm font-medium transition-all duration-200 hover:scale-105"
                    disabled={isAddingSlot}
                  >
                    {isAddingSlot ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Coffee className="h-4 w-4 mr-2" />
                    )}
                    Add Break
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      const lastSlot = selectedTiming.timeSlots[selectedTiming.timeSlots.length - 1]
                      addBreakSlot(lastSlot.id, 'lunch')
                    }}
                    className="hover:bg-amber-100 border-amber-200 h-8 px-4 text-sm font-medium transition-all duration-200 hover:scale-105"
                    disabled={isAddingSlot}
                  >
                    {isAddingSlot ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <span className="mr-2">🍽️</span>
                    )}
                    Lunch
                  </Button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-xs text-emerald-600 pt-2 border-t border-emerald-200">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{selectedTiming.timeSlots.filter(s => !s.isBreak).length} Periods</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coffee className="h-3 w-3" />
                  <span>{selectedTiming.timeSlots.filter(s => s.isBreak).length} Breaks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{selectedTiming.timeSlots.length} Total Slots</span>
                </div>
              </div>
              
              {/* Loading Indicator */}
              {isAddingSlot && (
                <div className="flex items-center gap-2 text-sm text-emerald-700 pt-2 border-t border-emerald-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    Adding {addingSlotType === 'period' ? 'new period' : 'new break'}...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compact Timetable Content */}
        <div className="flex-1 overflow-auto p-4 relative">
          {/* Success Notification for New Slots */}
          {newlyAddedSlot && (
            <div className="fixed top-20 right-8 z-50 bg-white border border-green-200 rounded-lg shadow-xl p-4 max-w-sm animate-in slide-in-from-right-5 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">Slot Added Successfully!</div>
                  <div className="text-sm text-green-600">
                    {selectedTiming.timeSlots.find(s => s.id === newlyAddedSlot)?.isBreak ? 'Break' : 'Period'} has been added to your timetable.
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNewlyAddedSlot(null)}
                  className="h-6 w-6 text-green-600 hover:bg-green-50"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Floating Action Button */}
          <div className="fixed bottom-8 right-8 z-40">
            <div className="flex flex-col gap-3">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                onClick={() => {
                  if (quickAddMode) {
                    setQuickAddMode(false)
                    setEditingCell(null) // Close any open forms when exiting quick add mode
                  } else {
                    setQuickAddMode(true)
                  }
                }}
                title={quickAddMode ? "Exit Quick Add Mode" : "Enable Quick Add Mode"}
              >
                {quickAddMode ? <XCircle className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
              </Button>
              {quickAddMode && (
                <div className="bg-white rounded-full p-3 shadow-lg border border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              )}
            </div>
          </div>
          {viewMode === "weekly" ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Compact Progress Bar */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-3 border-b border-slate-200 relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium text-slate-700">Completion</div>
                  <div className="text-xs text-slate-600">
                    {Math.round((filteredTimetable.filter(e => !e.isBreak).length / (selectedTiming.timeSlots.filter(s => !s.isBreak).length * days.length)) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.round((filteredTimetable.filter(e => !e.isBreak).length / (selectedTiming.timeSlots.filter(s => !s.isBreak).length * days.length)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Compact Mobile View */}
                  <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {days.map(day => (
                      <div key={day} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-3 border-b border-slate-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-base text-slate-900">{day}</h3>
                              <div className="text-xs text-slate-600 mt-1">
                                {weeklyData[day].filter(e => e.subjectName && !e.isBreak).length} periods
                              </div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <CalendarDays className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          {selectedTiming.timeSlots.map(slot => {
                            const entry = weeklyData[day].find(e => e.timeSlotId === slot.id)
                            return (
                              <div key={slot.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.01]">
                                <div className="text-xs font-mono text-slate-600 w-16 text-center font-bold">
                                  {slot.startTime}
                                </div>
                                <div className="flex-1">
                                  {entry?.subjectName ? (
                                    <div>
                                      <div className="font-bold text-slate-900 text-sm">{entry.subjectName}</div>
                                      {!entry.isBreak && (
                                        <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                                          <Users className="h-2 w-2 text-slate-500" />
                                          {entry.teacherName}
                                          <span className="text-slate-400">•</span>
                                          <Building2 className="h-2 w-2 text-slate-500" />
                                          {entry.room}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                      Free
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Desktop Table */}
                  <div className="hidden lg:block">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-50 to-blue-50 relative z-10">
                        <tr>
                          <th className="p-4 text-left text-sm font-semibold text-slate-700 w-32 border-r border-slate-200">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-sm font-bold">Time</span>
                            </div>
                          </th>
                          {days.map(day => (
                            <th key={day} className="p-4 text-center text-sm font-semibold text-slate-700">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-bold">{day}</span>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium text-xs px-1 py-0">
                                  {weeklyData[day].filter(e => e.subjectName && !e.isBreak).length}
                                </Badge>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedTiming.timeSlots.map((slot, index) => (
                          <tr 
                            key={slot.id} 
                            id={`time-slot-${slot.id}`}
                            className={`hover:bg-slate-50/50 group transition-all duration-500 ${
                              newlyAddedSlot === slot.id 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 shadow-xl scale-[1.02] animate-bounce ring-2 ring-green-200 ring-opacity-50' 
                                : ''
                            }`}
                          >
                            {/* Compact Time Column */}
                            <td className="p-3 bg-slate-50/30 border-r border-slate-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    {slot.isBreak ? (
                                      <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                                        <Coffee className="h-3 w-3 text-orange-600" />
                                      </div>
                                    ) : (
                                      <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                                        <BookOpen className="h-3 w-3 text-blue-600" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-sm font-bold text-slate-900">
                                        {slot.startTime}-{slot.endTime}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {slot.isBreak ? `${slot.breakType} Break` : `P${slot.period}`} • {slot.duration}m
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => addTimeSlot(slot.id)}
                                    className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-700 hover:scale-110 transition-all duration-200"
                                    title="Add period after this slot"
                                    disabled={isAddingSlot}
                                  >
                                    {isAddingSlot ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Plus className="h-3 w-3" />
                                    )}
                                  </Button>
                                  {!slot.isBreak && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => addBreakSlot(slot.id)}
                                      className="h-6 w-6 p-0 hover:bg-orange-100 hover:text-orange-700 hover:scale-110 transition-all duration-200"
                                      title="Add break after this slot"
                                      disabled={isAddingSlot}
                                    >
                                      {isAddingSlot ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Coffee className="h-3 w-3" />
                                      )}
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteTimeSlot(slot.id)}
                                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-700 hover:scale-110 transition-all duration-200"
                                    title="Delete this slot"
                                    disabled={isAddingSlot}
                                  >
                                    {isAddingSlot ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </td>
                            
                            {/* Enhanced Timetable Cells */}
                            {days.map(day => {
                              const entry = weeklyData[day].find(e => e.timeSlotId === slot.id)
                              const isEditing = editingCell?.day === day && editingCell?.slotId === slot.id

                              return (
                                <td key={day} className="p-2 relative">
                                  {slot.isBreak ? (
                                    <div className="p-2 text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                                      <Coffee className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                                      <div className="text-xs font-bold text-orange-800">
                                        {slot.breakType}
                                      </div>
                                    </div>
                                  ) : entry?.subjectName && !entry.isBreak ? (
                                    // Enhanced Existing Entry
                                    <div 
                                      className={`p-2 rounded-lg border-2 cursor-move hover:shadow-md transition-all duration-200 group/cell relative overflow-hidden ${
                                        draggedEntry?.id === entry.id ? 'opacity-50 scale-95' : 'hover:scale-105'
                                      } ${entry.color}`}
                                      draggable={!isEditing}
                                      onDragStart={(e) => handleDragStart(entry, e)}
                                      onClick={() => !quickAddMode && !isEditing && setEditingCell({day, slotId: slot.id})}
                                      onContextMenu={(e) => handleContextMenu(e, entry)}
                                    >
                                      {/* Visual indicator for entry type */}
                                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-blue-500"></div>
                                      <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                                      {isEditing ? (
                                        <QuickEditForm 
                                          entry={entry}
                                          onSave={(updates) => handleQuickEdit(entry.id, updates)}
                                          onCancel={() => setEditingCell(null)}
                                        />
                                      ) : (
                                        <>
                                          <div className="font-bold text-slate-900 text-sm mb-1">{entry.subjectName}</div>
                                          <div className="text-xs text-slate-700 mb-1 flex items-center gap-1">
                                            <Users className="h-2 w-2 text-slate-500" />
                                            {entry.teacherName}
                                          </div>
                                          <div className="text-xs text-slate-600 flex items-center gap-1">
                                            <Building2 className="h-2 w-2 text-slate-500" />
                                            {entry.room}
                                          </div>
                                          <div className="flex gap-1 mt-2 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setEditingCell({day, slotId: slot.id})
                                              }}
                                              className="h-5 w-5 p-0 hover:bg-blue-100 hover:text-blue-700"
                                              title="Edit entry"
                                            >
                                              <Edit className="h-2 w-2" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteEntry(entry.id)
                                              }}
                                              className="h-5 w-5 p-0 hover:bg-red-100 hover:text-red-700"
                                              title="Delete entry"
                                            >
                                              <Trash2 className="h-2 w-2" />
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    // Enhanced Empty Cell
                                    <div 
                                      className={`p-2 text-center border-2 border-dashed rounded-lg transition-all duration-200 relative group ${
                                        quickAddMode 
                                          ? 'border-slate-300 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-slate-400 hover:scale-105 hover:shadow-md' 
                                          : showEmptySlots
                                            ? 'border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:shadow-sm'
                                            : 'border-transparent'
                                      } ${
                                        dragOverCell?.day === day && dragOverCell?.slotId === slot.id
                                          ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg'
                                          : ''
                                      }`}
                                      onClick={() => {
                                        if (quickAddMode) {
                                          setEditingCell({day, slotId: slot.id})
                                        }
                                      }}
                                      onDragOver={(e) => handleDragOver(day, slot.id, e)}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDrop(day, slot.id, e)}
                                    >
                                      {isEditing ? (
                                        <QuickAddForm 
                                          onSave={(subject, teacher, room) => handleQuickAdd(day, slot.id, subject, teacher, room)}
                                          onCancel={() => setEditingCell(null)}
                                          subjectSuggestions={subjectSuggestions}
                                          teacherSuggestions={teacherSuggestions}
                                          roomSuggestions={roomSuggestions}
                                        />
                                      ) : (
                                        <>
                                          {dragOverCell?.day === day && dragOverCell?.slotId === slot.id ? (
                                            <>
                                              <Target className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                                              <div className="text-xs font-medium text-blue-700">
                                                Drop here
                                              </div>
                                            </>
                                          ) : quickAddMode ? (
                                            <>
                                              <Plus className="h-4 w-4 mx-auto mb-1 text-slate-500" />
                                              <div className="text-xs font-medium text-slate-600">
                                                Click to add
                                              </div>
                                            </>
                                          ) : showEmptySlots ? (
                                            <>
                                              <div className="text-xs text-slate-400">
                                                Free
                                              </div>
                                            </>
                                          ) : (
                                            <div className="h-12"></div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Compact List View
            <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-4">
              <div className="space-y-4">
                {days.map(day => {
                  const dayEntries = filteredTimetable
                    .filter(e => e.day === day)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  
                  if (dayEntries.length === 0) return null
                  
                  return (
                    <div key={day}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <CalendarDays className="h-3 w-3 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{day}</h3>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-1 py-0">
                          {dayEntries.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {dayEntries.map(entry => (
                          <div key={entry.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-mono text-slate-600 w-20 text-center">
                                {entry.startTime}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">{entry.subjectName}</div>
                                {!entry.isBreak && (
                                  <div className="text-xs text-slate-600 mt-1">
                                    {entry.teacherName} • {entry.room}
                                  </div>
                                )}
                              </div>
                            </div>
                            {!entry.isBreak && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedEntry(entry)}
                                  className="hover:bg-blue-100 hover:text-blue-700 h-7 text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="hover:bg-red-100 hover:text-red-700 h-7 text-xs"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Removed Class Timing Assignment Dialog - simplified approach */}



      {/* Enhanced Time Configuration Dialog */}
      <TimeConfigurationDialog 
        isOpen={isTimingDialogOpen}
        onOpenChange={setIsTimingDialogOpen}
        timing={selectedTiming}
        onSave={(timing) => {
          // Simplified - just show success message
          // In a real app, you'd call an API here
          toast.success("Timing configuration saved!")
        }}
        onAddSlot={addTimeSlot}
        onAddBreakSlot={addBreakSlot}
        onUpdateSlot={updateTimeSlot}
        onDeleteSlot={deleteTimeSlot}
      />



      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Power user shortcuts to work faster
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                <h4 className="font-medium text-sm">Navigation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Search</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+F</kbd>
                          </div>
                  <div className="flex justify-between">
                    <span>Quick Add</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Q</kbd>
                            </div>
                  <div className="flex justify-between">
                    <span>Shortcuts</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+K</kbd>
                            </div>
                            </div>
                            </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">View Options</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Toggle Conflicts</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+H</kbd>
                          </div>
                  <div className="flex justify-between">
                    <span>Toggle Empty</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+E</kbd>
                        </div>
                  <div className="flex justify-between">
                    <span>Close Dialog</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                        </div>
                      </div>
                    </div>
                </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Pro Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Drag and drop entries to move them between time slots</li>
                <li>• Right-click entries for quick actions</li>
                <li>• Use search to quickly find specific entries</li>
                <li>• Auto-save keeps your changes safe</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowShortcuts(false)}>
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed bg-white border rounded-lg shadow-xl py-2 z-50 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              setEditingCell({
                day: contextMenu.entry.day,
                slotId: contextMenu.entry.timeSlotId
              })
              closeContextMenu()
            }}
          >
            <Edit className="h-4 w-4" />
            Edit Entry
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              // Duplicate entry logic
              const newEntry = {
                ...contextMenu.entry,
                id: `entry-${Date.now()}-copy`,
                day: 'Monday' as Day // Default to Monday for duplication
              }
              setTimetable(prev => [...prev, newEntry])
              closeContextMenu()
              toast.success("Entry duplicated!")
            }}
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </button>
          <div className="border-t my-1"></div>
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            onClick={() => {
              handleDeleteEntry(contextMenu.entry.id)
              closeContextMenu()
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete Entry
          </button>
                </div>
              )}

      {/* Edit Entry Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timetable Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={() => {
              if (selectedEntry) {
                handleEditEntry({ ...selectedEntry, subjectName: "Updated Subject" })
              }
            }}>
              Update Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 