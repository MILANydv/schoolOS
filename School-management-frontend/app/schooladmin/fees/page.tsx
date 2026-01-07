"use client"

import * as React from "react"
import { 
  Download, 
  ReceiptText, 
  DollarSign,
  TrendingUp, 
  AlertCircle, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Calculator,
  BookOpen,
  Star,
  Send,
  ChevronLeft,
  ChevronRight,
  Filter,
  BarChart3,
  School,
  Zap,
  Mail
} from "lucide-react"
import { MOCK_STUDENTS, MOCK_CLASSES } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { EnhancedTable } from "@/components/table/enhanced-table"

/* -------------------------------------------------------------------------- */
/*                              Types & Interfaces                            */
/* -------------------------------------------------------------------------- */

interface StudentFee {
  id: string
  studentId: string
  student: string
  class: string
  feeType: string
  amount: number
  paid: number
  due: number
  status: 'Paid' | 'Partial' | 'Due' | 'Overdue'
  dueDate: string
  lastPayment?: string
  paymentMethod?: string
  installments?: number
  currentInstallment?: number
  lateFee?: number
  discount?: number
  scholarshipAmount?: number
  parentContact?: string
  notes?: string
}

/* -------------------------------------------------------------------------- */
/*                              Enhanced Mock Data                            */
/* -------------------------------------------------------------------------- */

// Generate comprehensive mock student fees
const generateMockStudentFees = (): StudentFee[] => {
  const feeTypes = ['Annual Tuition', 'Monthly Tuition', 'Transport Fee', 'Activity Fee', 'Exam Fee', 'Lab Fee', 'Library Fee', 'Hostel Fee']
  const statuses: StudentFee['status'][] = ['Paid', 'Partial', 'Due', 'Overdue']
  const paymentMethods = ['Cash', 'Bank Transfer', 'Card', 'Online', 'Cheque']
  
  return MOCK_STUDENTS.slice(0, 150).map((student, index) => {
    const feeType = feeTypes[index % feeTypes.length]
    const amount = Math.floor(Math.random() * 15000) + 5000
    const paidPercentage = Math.random()
    const paid = Math.floor(amount * paidPercentage)
    const due = amount - paid
    
    let status: StudentFee['status']
    if (due === 0) status = 'Paid'
    else if (paid > 0) status = 'Partial'
    else if (Math.random() > 0.7) status = 'Overdue'
    else status = 'Due'
    
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 30)
    
    return {
      id: `fee${(index + 1).toString().padStart(3, '0')}`,
      studentId: student.id,
      student: student.name,
      class: student.class,
      feeType,
      amount,
      paid,
      due,
      status,
      dueDate: dueDate.toISOString().split('T')[0],
      lastPayment: paid > 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      paymentMethod: paid > 0 ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
      lateFee: status === 'Overdue' ? Math.floor(Math.random() * 500) + 100 : 0,
      discount: Math.random() > 0.8 ? Math.floor(Math.random() * 2000) + 500 : 0,
      scholarshipAmount: Math.random() > 0.9 ? Math.floor(Math.random() * 5000) + 1000 : 0,
      parentContact: `parent${index + 1}@example.com`,
      notes: Math.random() > 0.7 ? `Additional notes for ${student.name}` : undefined
    }
  })
}

const mockStudentFees = generateMockStudentFees()

/* -------------------------------------------------------------------------- */

export default function SchoolAdminFeesPage() {
  // State Management
  const [studentFees, setStudentFees] = React.useState<StudentFee[]>([...mockStudentFees])
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [receiptData, setReceiptData] = React.useState<StudentFee | null>(null)
  const [paymentModal, setPaymentModal] = React.useState<StudentFee | null>(null)
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false)
  const [reminderModal, setReminderModal] = React.useState<StudentFee[] | null>(null)
  const [selectedClass, setSelectedClass] = React.useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [classSearchQuery, setClassSearchQuery] = React.useState("")
  
  const { toast } = useToast()

  // Keyboard shortcuts and refs
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSidebarCollapsed(prev => !prev)
      }
      if (e.key === 'Escape') {
        if (selectedClass) {
          setSelectedClass(null)
        } else if (classSearchQuery) {
          setClassSearchQuery("")
        }
      }
      if (e.key === 'f' && (e.metaKey || e.ctrlKey) && !sidebarCollapsed) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedClass, classSearchQuery, sidebarCollapsed])

  // Class-wise Analytics with Search
  const classAnalytics = React.useMemo(() => {
    const classFees: Record<string, StudentFee[]> = {}
    
    // Group fees by class
    studentFees.forEach(fee => {
      if (!classFees[fee.class]) {
        classFees[fee.class] = []
      }
      classFees[fee.class].push(fee)
    })
    
    // Calculate analytics for each class
    const classStats = Object.entries(classFees).map(([className, fees]) => {
      const totalExpected = fees.reduce((sum, fee) => sum + fee.amount, 0)
      const totalCollected = fees.reduce((sum, fee) => sum + fee.paid, 0)
      const totalDue = fees.reduce((sum, fee) => sum + fee.due, 0)
      const overdueCount = fees.filter(fee => fee.status === 'Overdue').length
      const partialCount = fees.filter(fee => fee.status === 'Partial').length
      const paidCount = fees.filter(fee => fee.status === 'Paid').length
      const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0
      
      return {
        className,
        totalExpected,
        totalCollected,
        totalDue,
        overdueCount,
        partialCount,
        paidCount,
        collectionRate,
        totalStudents: fees.length,
        urgencyScore: (overdueCount * 3) + (partialCount * 1), // Higher score = more urgent
        fees
      }
    }).sort((a, b) => b.urgencyScore - a.urgencyScore) // Sort by urgency
    
    return classStats
  }, [studentFees])

  // Filtered classes based on search query
  const filteredClassAnalytics = React.useMemo(() => {
    if (!classSearchQuery.trim()) return classAnalytics
    
    return classAnalytics.filter(classData => 
      classData.className.toLowerCase().includes(classSearchQuery.toLowerCase())
    )
  }, [classAnalytics, classSearchQuery])

  // Filtered data based on selected class
  const filteredStudentFees = React.useMemo(() => {
    if (!selectedClass) return studentFees
    return studentFees.filter(fee => fee.class === selectedClass)
  }, [studentFees, selectedClass])

  // Overall Analytics (for selected class or all)
  const analytics = React.useMemo(() => {
    const dataToAnalyze = filteredStudentFees
    const totalExpected = dataToAnalyze.reduce((sum, fee) => sum + fee.amount, 0)
    const totalCollected = dataToAnalyze.reduce((sum, fee) => sum + fee.paid, 0)
    const totalDue = dataToAnalyze.reduce((sum, fee) => sum + fee.due, 0)
    const overdueAmount = dataToAnalyze.filter(fee => fee.status === 'Overdue').reduce((sum, fee) => sum + fee.due, 0)
    const overdueCount = dataToAnalyze.filter(fee => fee.status === 'Overdue').length
    const partialCount = dataToAnalyze.filter(fee => fee.status === 'Partial').length
    const paidCount = dataToAnalyze.filter(fee => fee.status === 'Paid').length
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0
    
    return {
      totalExpected,
      totalCollected,
      totalDue,
      overdueAmount,
      overdueCount,
      partialCount,
      paidCount,
      collectionRate,
      totalStudents: dataToAnalyze.length
    }
  }, [filteredStudentFees])

  // Event Handlers
  const handlePaymentRecord = (fee: StudentFee, amount: number, method: string, reference?: string) => {
    const updatedFees = studentFees.map(f => {
      if (f.id === fee.id) {
        const newPaid = f.paid + amount
        const newDue = f.amount - newPaid
        const newStatus: StudentFee['status'] = newDue <= 0 ? 'Paid' : newPaid > 0 ? 'Partial' : f.status
        
        return {
          ...f,
          paid: newPaid,
          due: Math.max(0, newDue),
          status: newStatus,
          lastPayment: new Date().toISOString().split('T')[0],
          paymentMethod: method
        }
      }
      return f
    })
    
    setStudentFees(updatedFees)
    setPaymentModal(null)
    toast({
      title: "Payment Recorded",
      description: `Payment of $${amount.toLocaleString()} recorded for ${fee.student}`,
    })
  }

  const handleBulkReminder = (fees: StudentFee[]) => {
    setReminderModal(fees)
  }

  const handleSendReminder = (fees: StudentFee[], message: string) => {
    toast({
      title: "Reminders Sent",
      description: `Payment reminders sent to ${fees.length} students`,
    })
    setReminderModal(null)
  }

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Clean Class Analytics Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 bg-slate-50 border-r border-slate-200 flex flex-col h-screen`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-base font-medium text-slate-900 flex items-center gap-2">
                  <School className="h-4 w-4 text-slate-600" />
                  Classes
                </h2>
                <p className="text-xs text-slate-500 mt-1">Fee collection overview</p>
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600"
                  >
                    {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{sidebarCollapsed ? 'Expand' : 'Collapse'} sidebar (⌘+B)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Search Input */}
          {!sidebarCollapsed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search classes..."
                      value={classSearchQuery}
                      onChange={(e) => setClassSearchQuery(e.target.value)}
                      className="pl-8 pr-4 h-8 text-sm bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-300"
                    />
                    <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
                      <Filter className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    {classSearchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setClassSearchQuery("")}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-200"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Search classes (⌘+F)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Class List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {/* All Classes Option */}
            {!classSearchQuery && (
              <div 
                onClick={() => {
                  setSelectedClass(null)
                  setClassSearchQuery("")
                }}
                className={`cursor-pointer rounded-lg transition-all duration-200 ${
                  selectedClass === null 
                    ? 'bg-slate-100 border border-slate-300' 
                    : 'bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {sidebarCollapsed ? (
                  <div className="p-3 text-center">
                    <BarChart3 className="h-5 w-5 mx-auto text-slate-600" />
                  </div>
                ) : (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-slate-900 flex items-center gap-2 text-sm">
                        <BarChart3 className="h-3.5 w-3.5 text-slate-600" />
                        All Classes
                      </h3>
                      <Badge className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5">
                        {classAnalytics.length}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>{studentFees.length} students</span>
                        <span className="font-medium">
                          {Math.round((studentFees.reduce((sum, fee) => sum + fee.paid, 0) / studentFees.reduce((sum, fee) => sum + fee.amount, 0)) * 100)}% collected
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Search Results Info */}
            {classSearchQuery && (
              <div className="px-2 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-md mb-2">
                <div className="flex items-center justify-between">
                  <span>
                    <strong>{filteredClassAnalytics.length}</strong> class{filteredClassAnalytics.length !== 1 ? 'es' : ''} found
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClassSearchQuery("")}
                    className="h-5 w-5 p-0 hover:bg-slate-200"
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Individual Class Cards */}
            {filteredClassAnalytics.length > 0 ? (
              filteredClassAnalytics.map((classData) => (
                <div
                  key={classData.className}
                  onClick={() => {
                    setSelectedClass(classData.className)
                    setClassSearchQuery("")
                  }}
                  className={`cursor-pointer rounded-lg transition-all duration-200 ${
                    selectedClass === classData.className
                      ? 'bg-slate-100 border border-slate-300'
                      : 'bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {sidebarCollapsed ? (
                    <div className="p-3 text-center">
                      <div className="text-xs font-medium text-slate-700 mb-1">
                        {classData.className.split(' ')[1] || classData.className.charAt(0)}
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full mx-auto ${
                        classData.collectionRate >= 90 ? 'bg-emerald-500' :
                        classData.collectionRate >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  ) : (
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900 text-sm">{classData.className}</h3>
                        <Badge 
                          className={`text-xs px-2 py-0.5 ${
                            classData.collectionRate >= 90 ? 'bg-emerald-100 text-emerald-700' :
                            classData.collectionRate >= 70 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}
                        >
                          {classData.collectionRate}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress 
                          value={classData.collectionRate} 
                          className="h-1.5" 
                        />
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                          <div>
                            <span className="font-medium">{classData.totalStudents}</span> students
                          </div>
                          <div>
                            <span className="font-medium">${classData.totalCollected.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {(classData.overdueCount > 0 || classData.partialCount > 0) && (
                          <div className="flex gap-1 mt-1">
                            {classData.overdueCount > 0 && (
                              <Badge className="bg-red-50 text-red-600 text-xs px-1.5 py-0 border-red-200">
                                {classData.overdueCount}
                              </Badge>
                            )}
                            {classData.partialCount > 0 && (
                              <Badge className="bg-amber-50 text-amber-600 text-xs px-1.5 py-0 border-amber-200">
                                {classData.partialCount}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : classSearchQuery ? (
              /* No Search Results */
              <div className="text-center py-6">
                <div className="text-slate-300 mb-2">
                  <Filter className="h-6 w-6 mx-auto" />
                </div>
                <p className="text-sm text-slate-500">No classes found</p>
                <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Fee Management
                  {selectedClass && (
                    <>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                      <span className="text-blue-600">{selectedClass}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedClass(null)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Clear selection (Esc)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedClass 
                    ? `Managing fee collections for ${selectedClass} students` 
                    : 'Comprehensive student fee tracking, payment processing, and analytics'
                  }
                </p>
                
                <div className="flex items-center gap-4 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => setIsHelpModalOpen(true)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    How to use this page
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Essential Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Expected Revenue */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-blue-100 mb-1">Total Expected</p>
                          <p className="text-4xl font-bold text-white mb-2">${analytics.totalExpected.toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-blue-100">{analytics.totalStudents} students</p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                          <Calculator className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-400"></div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Total Fee Collection Target</p>
                    <p className="text-xs">Expected: ${analytics.totalExpected.toLocaleString()}</p>
                    <p className="text-xs">Students: {analytics.totalStudents}</p>
                    <p className="text-xs">Collection Rate: {analytics.collectionRate}%</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Collection Performance */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-emerald-100 mb-1">Collection Performance</p>
                          <p className="text-4xl font-bold text-white mb-2">{analytics.collectionRate}%</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-emerald-100">${analytics.totalCollected.toLocaleString()} collected</p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                          <TrendingUp className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Payment Collection Status</p>
                    <p className="text-xs">Collected: ${analytics.totalCollected.toLocaleString()}</p>
                    <p className="text-xs">Rate: {analytics.collectionRate}%</p>
                    <p className="text-xs">Completed: {analytics.paidCount} students</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Action Required */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-red-100 mb-1">Action Required</p>
                          <p className="text-4xl font-bold text-white mb-2">{analytics.overdueCount + analytics.partialCount}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <p className="text-xs text-red-100">{analytics.overdueCount} overdue, {analytics.partialCount} partial</p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                          <AlertCircle className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-400"></div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Students Requiring Follow-up</p>
                    <p className="text-xs">Overdue: {analytics.overdueCount} students</p>
                    <p className="text-xs">Partial: {analytics.partialCount} students</p>
                    <p className="text-xs">Outstanding: ${analytics.totalDue.toLocaleString()}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Enhanced Table */}
          <EnhancedTable
            data={filteredStudentFees}
            columns={[
              {
                key: "student",
                header: "Student",
                sortable: true,
                cell: (item) => (
                  <div className="font-semibold text-slate-900 text-sm cursor-pointer hover:text-blue-600 transition-colors truncate" title={item.student}>
                    {item.student}
                  </div>
                )
              },
              {
                key: "class", 
                header: "Class",
                sortable: true,
                cell: (item) => (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-medium">
                    {item.class}
                  </Badge>
                )
              },
              {
                key: "feeType",
                header: "Fee Type", 
                sortable: true,
                cell: (item) => (
                  <span className="text-sm text-slate-600 font-medium truncate block" title={item.feeType}>
                    {item.feeType}
                  </span>
                )
              },
              {
                key: "amount",
                header: "Amount",
                sortable: true,
                cell: (item) => (
                  <span className="font-semibold text-slate-900 text-sm">
                    ${item.amount.toLocaleString()}
                  </span>
                )
              },
              {
                key: "paid",
                header: "Paid",
                sortable: true,
                cell: (item) => (
                  <span className="font-semibold text-green-600 text-sm">
                    ${item.paid.toLocaleString()}
                  </span>
                )
              },
              {
                key: "due",
                header: "Due",
                sortable: true,
                cell: (item) => (
                  <span className={`font-semibold text-sm ${item.due > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    ${item.due.toLocaleString()}
                  </span>
                )
              },
              {
                key: "dueDate",
                header: "Due Date",
                sortable: true,
                cell: (item) => (
                  <span className="text-sm text-slate-600">
                    {new Date(item.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit'
                    })}
                  </span>
                )
              },
              {
                key: "status",
                header: "Status",
                sortable: true,
                cell: (item) => (
                  <Badge 
                    className={`text-xs font-medium ${
                      item.status === "Paid" 
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                        : item.status === "Partial"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : item.status === "Overdue"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                  >
                    {item.status}
                  </Badge>
                )
              }
            ]}
            title={selectedClass ? `${selectedClass} Fee Records` : "Student Fee Records"}
            description={
              selectedClass 
                ? `Managing fee collections for ${selectedClass} students` 
                : "Manage student fees, record payments, and track collection status"
            }
            filters={[
              {
                key: "status",
                type: "select",
                label: "Status",
                options: [
                  { value: "Paid", label: "Paid" },
                  { value: "Partial", label: "Partial" },
                  { value: "Due", label: "Due" },
                  { value: "Overdue", label: "Overdue" }
                ]
              },
              {
                key: "feeType",
                type: "select",
                label: "Fee Type",
                options: [
                  { value: "Annual Tuition", label: "Annual Tuition" },
                  { value: "Monthly Tuition", label: "Monthly Tuition" },
                  { value: "Transport Fee", label: "Transport Fee" },
                  { value: "Activity Fee", label: "Activity Fee" },
                  { value: "Exam Fee", label: "Exam Fee" },
                  { value: "Lab Fee", label: "Lab Fee" }
                ]
              },
              {
                key: "dueDate",
                type: "date",
                label: "",
                placeholder: "Select due date"
              }
            ]}
            actions={[
              {
                key: "view",
                label: "View Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: (item) => setReceiptData(item)
              },
              {
                key: "payment",
                label: "Record Payment",
                icon: <CreditCard className="h-4 w-4" />,
                onClick: (item) => setPaymentModal(item)
              },
              {
                key: "receipt",
                label: "Generate Receipt",
                icon: <ReceiptText className="h-4 w-4" />,
                onClick: (item) => setReceiptData(item)
              },
              {
                key: "contact",
                label: "Contact Parent",
                icon: <Mail className="h-4 w-4" />,
                onClick: (item) => window.open(`mailto:${item.parentContact}`)
              }
            ]}
            bulkActions={[
              {
                key: "reminder",
                label: "Send Reminders",
                icon: <Send className="h-4 w-4" />,
                onClick: (items) => handleBulkReminder(items)
              },
              {
                key: "export",
                label: "Export Selected",
                icon: <Download className="h-4 w-4" />,
                onClick: (items) => handleExport('csv')
              }
            ]}
            searchPlaceholder="Search by student name, class, or fee type..."
            searchKeys={["student", "class", "feeType"]}
            pageSize={15}
            pageSizeOptions={[10, 15, 25, 50]}
            showPagination={true}
            showSearch={true}
            showFilters={true}
            showBulkActions={true}
            showSerialNumbers={true}
            showExport={true}
            onRowClick={(item) => setReceiptData(item)}
            onSelectionChange={setSelectedIds}
            selectedIds={selectedIds}
            sortable={true}
            onSort={(key, direction) => {
              console.log(`Sorting by ${String(key)} in ${direction} order`)
            }}
            sortKey="dueDate"
            sortDirection="desc"
          />
        </div>
      </div>

      {/* Enhanced Receipt Modal */}
      {receiptData && (
        <Dialog open={!!receiptData} onOpenChange={() => setReceiptData(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Fee Receipt - {receiptData.student}</DialogTitle>
              <DialogDescription>
                Detailed fee information and payment history
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Student:</span> {receiptData.student}</div>
                <div><span className="font-medium">Class:</span> {receiptData.class}</div>
                <div><span className="font-medium">Fee Type:</span> {receiptData.feeType}</div>
                <div><span className="font-medium">Total Amount:</span> ${receiptData.amount.toLocaleString()}</div>
                <div><span className="font-medium">Amount Paid:</span> <span className="text-green-600 font-semibold">${receiptData.paid.toLocaleString()}</span></div>
                <div><span className="font-medium">Amount Due:</span> <span className="text-red-600 font-semibold">${receiptData.due.toLocaleString()}</span></div>
                <div><span className="font-medium">Due Date:</span> {receiptData.dueDate}</div>
                <div><span className="font-medium">Status:</span> 
                  <Badge className={`ml-2 ${
                    receiptData.status === "Paid" ? "bg-green-100 text-green-800" :
                    receiptData.status === "Partial" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {receiptData.status}
                  </Badge>
                </div>
              </div>
              
              {receiptData.lastPayment && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Recent Payment</h4>
                  <div className="text-sm text-gray-600">
                    <p>Last Payment: {receiptData.lastPayment}</p>
                    <p>Method: {receiptData.paymentMethod}</p>
                  </div>
                </div>
              )}

              {receiptData.notes && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">{receiptData.notes}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setReceiptData(null)}>
                Close
              </Button>
              <Button onClick={() => {
                window.print()
              }}>
                <ReceiptText className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
              {receiptData.due > 0 && (
                <Button onClick={() => {
                  setPaymentModal(receiptData)
                  setReceiptData(null)
                }}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Recording Modal */}
      {paymentModal && (
        <Dialog open={!!paymentModal} onOpenChange={() => setPaymentModal(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record Payment - {paymentModal.student}</DialogTitle>
              <DialogDescription>
                Record a new payment for {paymentModal.feeType}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Total Amount: <span className="font-semibold">${paymentModal.amount.toLocaleString()}</span></div>
                  <div>Already Paid: <span className="font-semibold text-green-600">${paymentModal.paid.toLocaleString()}</span></div>
                  <div>Amount Due: <span className="font-semibold text-red-600">${paymentModal.due.toLocaleString()}</span></div>
                  <div>Due Date: <span className="font-semibold">{paymentModal.dueDate}</span></div>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const amount = Number(formData.get('amount'))
                const method = formData.get('method') as string
                const reference = formData.get('reference') as string
                
                if (amount > 0 && amount <= paymentModal.due) {
                  handlePaymentRecord(paymentModal, amount, method, reference)
                } else {
                  toast({
                    title: "Invalid Amount",
                    description: "Please enter a valid payment amount",
                    variant: "destructive"
                  })
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Payment Amount ($)</label>
                    <Input
                      name="amount"
                      type="number"
                      placeholder="Enter payment amount"
                      max={paymentModal.due}
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Payment Method</label>
                    <select name="method" className="w-full p-2 border rounded-md" required>
                      <option value="">Select method</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Reference Number (Optional)</label>
                    <Input
                      name="reference"
                      type="text"
                      placeholder="Transaction reference or receipt number"
                    />
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setPaymentModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reminder Modal */}
      {reminderModal && (
        <Dialog open={!!reminderModal} onOpenChange={() => setReminderModal(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Payment Reminders</DialogTitle>
              <DialogDescription>
                Send payment reminders to {reminderModal.length} selected students
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const message = formData.get('message') as string
              handleSendReminder(reminderModal, message)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Reminder Message</label>
                  <textarea
                    name="message"
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    placeholder="Enter reminder message for parents..."
                    defaultValue="Dear Parent, this is a friendly reminder that your child's school fees are due. Please make the payment at your earliest convenience."
                    required
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Students to be notified:</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {reminderModal.slice(0, 5).map(fee => (
                      <div key={fee.id} className="text-sm text-gray-600">
                        {fee.student} - ${fee.due.toLocaleString()} due
                      </div>
                    ))}
                    {reminderModal.length > 5 && (
                      <div className="text-sm text-gray-500">
                        ...and {reminderModal.length - 5} more students
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setReminderModal(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminders
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Help Modal */}
      <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-900">
              <BookOpen className="h-5 w-5" />
              Fee Management System Guide
            </DialogTitle>
            <DialogDescription>
              Comprehensive guide for managing student fees, payments, and financial tracking
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Fee Management Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💰 Financial Analytics</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Real-time collection tracking</strong></li>
                    <li>• <strong>Overdue payment monitoring</strong></li>
                    <li>• <strong>Collection rate analytics</strong></li>
                    <li>• <strong>Payment trend analysis</strong></li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">📊 Payment Processing</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Record multiple payment methods</strong></li>
                    <li>• <strong>Partial payment tracking</strong></li>
                    <li>• <strong>Receipt generation</strong></li>
                    <li>• <strong>Payment history logs</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Payment Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">💳 Record Payments</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• <strong>Cash, card, online payments</strong></li>
                    <li>• <strong>Bank transfer tracking</strong></li>
                    <li>• <strong>Reference number logging</strong></li>
                    <li>• <strong>Automatic status updates</strong></li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">📧 Communication Tools</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• <strong>Bulk payment reminders</strong></li>
                    <li>• <strong>Email/SMS notifications</strong></li>
                    <li>• <strong>Parent contact integration</strong></li>
                    <li>• <strong>Custom reminder messages</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Pro Tips for Efficient Fee Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">💡 Best Practices</h4>
                  <ul className="space-y-1">
                    <li>• Use class sidebar for quick navigation</li>
                    <li>• Monitor overdue payments daily</li>
                    <li>• Send bulk reminders efficiently</li>
                    <li>• Export data for reporting</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">⌨️ Shortcuts</h4>
                  <ul className="space-y-1">
                    <li>• Cmd/Ctrl + B: Toggle sidebar</li>
                    <li>• Cmd/Ctrl + F: Search classes</li>
                    <li>• Escape: Clear selections</li>
                    <li>• Click cards for detailed views</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHelpModalOpen(false)}>
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
