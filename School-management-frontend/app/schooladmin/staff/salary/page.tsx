"use client"

import * as React from "react"
import { DollarSign, CheckCircle, Clock, AlertTriangle, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, User, Users, UserCheck, Briefcase, UserPlus, Calendar, Search, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedTable, TableColumn, TableFilter, TableAction } from "@/components/table/enhanced-table"
import { MOCK_STAFF, MOCK_SALARIES } from "@/lib/constants"
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
import { useSalaries } from "@/hooks/useSchoolAdmin"
import { v4 as uuidv4 } from 'uuid'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Salary type from store
interface Salary {
  id: string
  staffId: string
  period: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
  paidDate?: string
  remarks?: string
}

type Staff = (typeof MOCK_STAFF)[number]

export default function SalaryManagementPage() {
  const { toast } = useToast()
  
  // Zustand state management
  const {
    salaries,
    salariesUI,
    addSalary,
    updateSalary,
    deleteSalary,
    markSalaryPaid,
    setSearchTerm,
    setFilters,
    setSelectedItems,
    setPagination,
    setModalState,
    getFiltered,
    getStats
  } = useSalaries()

  const [staff] = React.useState<Staff[]>(MOCK_STAFF)
  const [selectedSalary, setSelectedSalary] = React.useState<Salary | null>(null)
  const [salaryDialogOpen, setSalaryDialogOpen] = React.useState(false)
  const [addSalaryOpen, setAddSalaryOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [salaryForm, setSalaryForm] = React.useState({
    staffId: '',
    period: '',
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    status: 'Pending' as 'Paid' | 'Pending' | 'Overdue',
    dueDate: '',
    paidDate: '',
    paymentMethod: '',
    remarks: ''
  })

  // Filter states
  const [localSearchTerm, setLocalSearchTerm] = React.useState("")
  const [localStatusFilter, setLocalStatusFilter] = React.useState("")
  const [localPeriodFilter, setLocalPeriodFilter] = React.useState("")
  const [localAmountFilter, setLocalAmountFilter] = React.useState("")

  // Initialize salaries data if empty
  React.useEffect(() => {
    if (salaries.length === 0) {
      MOCK_SALARIES.forEach(salary => {
        // Convert MOCK_SALARIES to match Salary interface
        const convertedSalary: Salary = {
          id: salary.id,
          staffId: salary.staffId,
          period: salary.period,
          amount: salary.amount,
          status: salary.status as 'Paid' | 'Pending' | 'Overdue',
          paidDate: salary.paidDate || undefined,
          remarks: salary.remarks || undefined
        }
        addSalary(convertedSalary)
      })
    }
  }, [salaries.length, addSalary])

  // Get computed stats and filtered data
  const salaryStats = getStats()
  const filteredSalaries = getFiltered()

  // Filtered salaries based on filter bar
  const filteredSalaryData = React.useMemo(() => {
    return salaries.filter(salary => {
      // Search filter
      const matchesSearch = !localSearchTerm || 
        staff.find(s => s.id === salary.staffId)?.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        salary.period.toLowerCase().includes(localSearchTerm.toLowerCase())

      // Status filter
      const matchesStatus = !localStatusFilter || salary.status === localStatusFilter

      // Period filter
      const matchesPeriod = !localPeriodFilter || salary.period === localPeriodFilter

      // Amount filter
      const matchesAmount = !localAmountFilter || 
        (localAmountFilter === 'low' && salary.amount < 30000) ||
        (localAmountFilter === 'medium' && salary.amount >= 30000 && salary.amount <= 50000) ||
        (localAmountFilter === 'high' && salary.amount > 50000)

      return matchesSearch && matchesStatus && matchesPeriod && matchesAmount
    })
  }, [salaries, staff, localSearchTerm, localStatusFilter, localPeriodFilter, localAmountFilter])

  // Salary Analytics
  const totalSalaryBudget = staff.reduce((sum, s) => sum + (s.salaryAmount || 0), 0)
  const totalPaid = salaryStats.totalPaid
  const totalPending = salaryStats.totalPending
  const paymentRate = salaryStats.paymentRate

  // Handle salary action
  const handleSalaryAction = (salary: Salary, action: string) => {
    switch (action) {
      case "view":
        setSelectedSalary(salary)
        setProfileOpen(true)
        break
      case "edit":
        setSelectedSalary(salary)
        setSalaryDialogOpen(true)
        break
      case "mark-paid":
        handleMarkSalaryPaid(salary.id)
        break
      case "delete":
        deleteSalary(salary.id)
        toast({ title: 'Salary Deleted', description: 'Salary record has been deleted.', variant: 'destructive' })
        break
    }
  }

  // Helper: get period options based on staff
  const getPeriodOptions = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId)
    if (!staffMember) return []
    if (staffMember.salaryType === 'monthly') {
      return [
        { value: '2024-07', label: 'July 2024' },
        { value: '2024-06', label: 'June 2024' },
        { value: '2024-05', label: 'May 2024' },
      ]
    }
    if (staffMember.salaryType === 'period') {
      return [
        { value: '2024-Q3', label: 'Q3 2024' },
        { value: '2024-Q2', label: 'Q2 2024' },
        { value: '2024-Q1', label: 'Q1 2024' },
      ]
    }
    if (staffMember.salaryType === 'term') {
      return [
        { value: '2024-Term2', label: 'Term 2 2024' },
        { value: '2024-Term1', label: 'Term 1 2024' },
      ]
    }
    return []
  }

  // Add Salary Handler
  const handleAddSalary = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation for essential fields
    if (!salaryForm.staffId || !salaryForm.period || !salaryForm.basicSalary || !salaryForm.dueDate) {
      toast({ 
        title: 'Missing Required Fields', 
        description: 'Please fill in all required fields: Staff Member, Period, Basic Salary, and Due Date.', 
        variant: 'destructive' 
      })
      return
    }

    if ((salaryForm.basicSalary || 0) <= 0) {
      toast({ 
        title: 'Invalid Basic Salary', 
        description: 'Basic salary must be greater than 0.', 
        variant: 'destructive' 
      })
      return
    }

    // Check for duplicate salary record
    if (salaries.some(s => s.staffId === salaryForm.staffId && s.period === salaryForm.period)) {
      toast({ 
        title: 'Duplicate Salary Record', 
        description: 'A salary record for this staff member and period already exists.', 
        variant: 'destructive' 
      })
      return
    }

    // Validate paid date if status is Paid
    if (salaryForm.status === 'Paid' && !salaryForm.paidDate) {
      toast({ 
        title: 'Missing Paid Date', 
        description: 'Please select a paid date when status is set to Paid.', 
        variant: 'destructive' 
      })
      return
    }

    // Calculate simple salary from basic components
      const basic = salaryForm.basicSalary || 0
      const allowances = salaryForm.allowances || 0
      const deductions = salaryForm.deductions || 0
    
    const netSalary = basic + allowances - deductions
      
      // Update the form with calculated amount
    setSalaryForm(f => ({ 
      ...f, 
      amount: netSalary
    }))
    
    const finalAmount = netSalary

    const newSalary: Salary = {
        id: uuidv4(),
        staffId: salaryForm.staffId,
        period: salaryForm.period,
      amount: finalAmount,
        status: salaryForm.status,
      paidDate: salaryForm.paidDate || undefined,
      remarks: salaryForm.remarks || undefined,
    }

    addSalary(newSalary)
    
    // Reset form
    setSalaryForm({
      staffId: '',
      period: '',
      basicSalary: 0,
      allowances: 0,
      deductions: 0,
      status: 'Pending',
      dueDate: '',
      paidDate: '',
      paymentMethod: '',
      remarks: ''
    })
    
    setAddSalaryOpen(false)
    
    // Success notification
    const staffMember = staff.find(s => s.id === salaryForm.staffId)
    toast({ 
      title: 'Salary Record Created', 
      description: `Successfully created salary record for ${staffMember?.name || 'Staff Member'} - ${salaryForm.period} (₹${finalAmount.toLocaleString()})` 
    })
  }

  const handleMarkSalaryPaid = (salaryId: string, remarks: string = "") => {
    const paidDate = new Date().toISOString().split('T')[0]
    markSalaryPaid(salaryId, paidDate, remarks)
    toast({ title: 'Salary Marked as Paid', description: 'Salary has been marked as paid successfully.' })
  }


  // Enhanced Table columns for salary
  const salaryColumns: TableColumn<Salary>[] = [
    {
      key: "staffId",
      header: "Staff Member",
      sortable: true,
      cell: (item) => {
        const staffMember = staff.find(s => s.id === item.staffId)
        if (!staffMember) return <div className="text-red-500">Unknown Staff</div>
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {staffMember.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-slate-900 text-sm">{staffMember.name}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {staffMember.role || 'Staff'}
              </div>
            </div>
          </div>
        )
      }
    },
    {
      key: "period",
      header: "Period",
      sortable: true,
      cell: (item) => (
        <div className="space-y-1">
        <div className="font-medium text-slate-900">
          {new Date(item.period + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {item.period}
          </div>
          </div>
        )
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      cell: (item) => (
        <div className="space-y-1">
          <div className="font-bold text-slate-900 text-lg">₹{item.amount.toLocaleString()}</div>
          <div className="text-xs text-slate-500">
            {item.amount >= 50000 ? 'High' : item.amount >= 30000 ? 'Medium' : 'Standard'} Salary
          </div>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (item) => {
        const statusConfig = {
          Paid: {
            badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: <CheckCircle className="h-3 w-3 mr-1" />,
            text: "Paid"
          },
          Pending: {
            badge: "bg-amber-50 text-amber-700 border-amber-200",
            icon: <Clock className="h-3 w-3 mr-1" />,
            text: "Pending"
          },
          Overdue: {
            badge: "bg-red-50 text-red-700 border-red-200",
            icon: <AlertTriangle className="h-3 w-3 mr-1" />,
            text: "Overdue"
          }
        }
        
        const config = statusConfig[item.status]
        return (
          <div className="space-y-1">
            <Badge className={`${config.badge} font-medium`}>
              {config.icon}
              {config.text}
            </Badge>
            {item.paidDate && (
              <div className="text-xs text-slate-500">
                Paid: {new Date(item.paidDate).toLocaleDateString()}
              </div>
            )}
          </div>
        )
      }
    },
    {
      key: "remarks",
      header: "Notes",
      sortable: true,
      cell: (item) => (
        <div className="space-y-1">
          <div className="text-sm text-slate-600 max-w-[200px] truncate">
            {item.remarks || "No remarks"}
          </div>
          {item.remarks && (
            <div className="text-xs text-slate-400">
              {item.remarks.length > 50 ? `${item.remarks.substring(0, 50)}...` : item.remarks}
            </div>
          )}
        </div>
      )
    }
  ]

  // Enhanced Table filters
  const salaryFilters: TableFilter[] = [
    {
      key: "status",
      type: "select",
      label: "Payment Status",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "Paid", label: "Paid" },
        { value: "Pending", label: "Pending" },
        { value: "Overdue", label: "Overdue" }
      ]
    },
    {
      key: "period",
      type: "select",
      label: "Period",
      options: [
        { value: "all", label: "All Periods" },
        // Dynamic periods from actual data
        ...Array.from(new Set(salaries.map(s => s.period))).map(period => ({
          value: period,
          label: period.includes('-') 
            ? new Date(period + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            : period
        }))
      ]
    },
    {
      key: "amount",
      type: "select",
      label: "Salary Range",
      options: [
        { value: "all", label: "All Amounts" },
        { value: "low", label: "Below ₹30,000" },
        { value: "medium", label: "₹30,000 - ₹50,000" },
        { value: "high", label: "Above ₹50,000" }
      ]
    }
  ]

  // Table actions
  const salaryActions: TableAction<Salary>[] = [
    {
      key: "view",
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item) => handleSalaryAction(item, "view")
    },
    {
      key: "edit",
      label: "Edit Salary",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item) => handleSalaryAction(item, "edit")
    },
    {
      key: "markPaid",
      label: "Mark as Paid",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (item) => handleSalaryAction(item, "mark-paid")
    },
    {
      key: "delete",
      label: "Delete Record",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item) => handleSalaryAction(item, "delete"),
      variant: "destructive"
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
              <p className="text-gray-600">Manage salary analytics, payments, and history across your school</p>
        </div>
            
            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
          <Button 
            onClick={() => setAddSalaryOpen(true)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add Salary Record
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
                placeholder="Search salaries by staff name or period..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
              {localSearchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocalSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Filters Row */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select 
                value={localStatusFilter}
                onChange={(e) => setLocalStatusFilter(e.target.value)}
                className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
              
              {/* Period Filter */}
              <select 
                value={localPeriodFilter}
                onChange={(e) => setLocalPeriodFilter(e.target.value)}
                className="w-40 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="">All Periods</option>
                {Array.from(new Set(salaries.map(s => s.period))).map(period => (
                  <option key={period} value={period}>
                    {period.includes('-') 
                      ? new Date(period + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                      : period}
                  </option>
                ))}
              </select>
              
              {/* Amount Range Filter */}
              <select 
                value={localAmountFilter}
                onChange={(e) => setLocalAmountFilter(e.target.value)}
                className="w-40 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="">All Amounts</option>
                <option value="low">Below ₹30,000</option>
                <option value="medium">₹30,000 - ₹50,000</option>
                <option value="high">Above ₹50,000</option>
              </select>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3 ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setLocalSearchTerm("")
                  setLocalStatusFilter("")
                  setLocalPeriodFilter("")
                  setLocalAmountFilter("")
                }}
                className="h-10 px-4 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              
            </div>
          </div>
          
          {/* Active Filter Indicators */}
          {(localSearchTerm || localStatusFilter || localPeriodFilter || localAmountFilter) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                {localSearchTerm && (
                  <Badge variant="outline" className="text-xs h-6">
                    Search: "{localSearchTerm}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setLocalSearchTerm("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {localStatusFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Status: {localStatusFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setLocalStatusFilter("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {localPeriodFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Period: {localPeriodFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setLocalPeriodFilter("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {localAmountFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Amount: {localAmountFilter === 'low' ? 'Below ₹30,000' : localAmountFilter === 'medium' ? '₹30,000 - ₹50,000' : 'Above ₹50,000'}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setLocalAmountFilter("")}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Salaries Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-100">Total Salaries</p>
                  <p className="text-3xl font-bold text-white">{salaryStats.total}</p>
                  <p className="text-xs text-blue-200">
                          ₹{salaryStats.totalAmount.toLocaleString()} total budget
                        </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
              </div>
              </div>
          </CardContent>
        </Card>

          {/* Pending Payments Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-100">Pending Payments</p>
                  <p className="text-3xl font-bold text-white">{salaryStats.pendingCount}</p>
                  <p className="text-xs text-orange-100">
                    ₹{salaryStats.totalPending.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
              </div>
              </div>
          </CardContent>
        </Card>

          {/* Paid Records Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-100">Paid Records</p>
                  <p className="text-3xl font-bold text-white">{salaryStats.paidCount}</p>
                  <p className="text-xs text-emerald-200">
                    {salaryStats.paymentRate.toFixed(1)}% payment rate
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-white" />
              </div>
              </div>
          </CardContent>
        </Card>

          {/* Overdue Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                  <p className="text-sm font-medium text-red-100">Overdue</p>
                  <p className="text-3xl font-bold text-white">{salaryStats.overdueCount}</p>
                  <p className="text-xs text-red-200">
                    ₹{salaryStats.totalOverdue.toLocaleString()}
                  </p>
      </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-white" />
              </div>
                    </div>
                </CardContent>
              </Card>

          {/* Quick Add Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setAddSalaryOpen(true)}>
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-100">Quick Add</p>
                  <p className="text-3xl font-bold text-white">+</p>
                  <p className="text-xs text-purple-200">
                    New salary record
                  </p>
                      </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <UserPlus className="h-6 w-6 text-white" />
                    </div>
              </div>
          </CardContent>
        </Card>
              </div>

        {/* Results Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Showing {filteredSalaryData.length} of {salaries.length} salary records
              </span>
              {(localSearchTerm || localStatusFilter || localPeriodFilter || localAmountFilter) && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Filtered
                </Badge>
              )}
            </div>
            {filteredSalaryData.length !== salaries.length && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocalSearchTerm("")
                  setLocalStatusFilter("")
                  setLocalPeriodFilter("")
                  setLocalAmountFilter("")
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div>
          </div>

        {/* Salary Table */}
        <div className="bg-white rounded-lg shadow border">
        <EnhancedTable
            data={filteredSalaryData}
              columns={salaryColumns}
          title="Salary Records"
            description={`Showing ${filteredSalaryData.length} of ${salaries.length} salary records`}
          actions={salaryActions}
          onAdd={undefined}
          onEdit={(item) => {
            setSelectedSalary(item)
            setSalaryDialogOpen(true)
          }}
          onDelete={(ids) => {
            ids.forEach(id => deleteSalary(id))
            toast({ title: "Salaries Deleted", description: `${ids.length} salaries deleted.` })
          }}
          searchPlaceholder="Search salaries by staff name or period..."
          searchKeys={["staffId", "period"]}
          pageSize={15}
          pageSizeOptions={[10, 15, 25, 50]}
          showPagination={true}
            showSearch={false}
            showFilters={false}
          showBulkActions={false}
            showExport={false}
          onRowClick={(item) => handleSalaryAction(item, "view")}
          onSelectionChange={setSelectedItems}
          selectedIds={salariesUI.selectedItems}
          sortable={true}
          sortKey="period"
          sortDirection="desc"
            />
        </div>
          </div>

      {/* Add Salary Dialog */}
      <Dialog open={addSalaryOpen} onOpenChange={setAddSalaryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Salary Record</DialogTitle>
            <DialogDescription>
              Create a new salary record for staff members with comprehensive details.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddSalary} className="space-y-6 py-4">
            {/* Staff Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Staff Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="staffId"
                label="Staff Member *"
              value={salaryForm.staffId}
                  onValueChange={v => {
                    const selectedStaff = staff.find(s => s.id === v)
                    setSalaryForm(f => ({ 
                      ...f, 
                      staffId: v,
                      basicSalary: selectedStaff?.salaryAmount || 0
                    }))
                  }}
                options={staff.map(s => ({ 
                  value: s.id, 
                  label: `${s.name} (${s.role || 'Staff'}) - ${s.department || 'General'}` 
                }))}
              required
            />
              <div className="space-y-2">
                  <label className="text-sm font-medium">Current Base Salary</label>
                  <div className="text-lg font-semibold text-blue-600">
                  ₹{staff.find(s => s.id === salaryForm.staffId)?.salaryAmount?.toLocaleString() || '0'}
                </div>
                  <div className="text-xs text-gray-500">
                    This will be pre-filled as Basic Salary
                  </div>
              </div>
              </div>

            </div>

            {/* Salary Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Salary Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                  id="basicSalary"
                  label="Basic Salary *"
                type="number"
                  placeholder="40000"
                  value={salaryForm.basicSalary}
                  onChange={e => setSalaryForm(f => ({ 
                    ...f, 
                    basicSalary: Number(e.target.value) || 0
                  }))}
                required
                min="0"
                step="100"
              />
                <FormInput
                  id="allowances"
                  label="Allowances"
                  type="number"
                  placeholder="5000"
                  value={salaryForm.allowances}
                  onChange={e => setSalaryForm(f => ({ 
                    ...f, 
                    allowances: Number(e.target.value) || 0
                  }))}
                  min="0"
                  step="100"
                />
                <FormInput
                  id="deductions"
                  label="Deductions"
                  type="number"
                  placeholder="2000"
                  value={salaryForm.deductions}
                  onChange={e => setSalaryForm(f => ({ 
                    ...f, 
                    deductions: Number(e.target.value) || 0
                  }))}
                  min="0"
                  step="100"
                />
              </div>
            </div>



            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              id="period"
                label="Payment Period *"
              value={salaryForm.period}
              onValueChange={v => setSalaryForm(f => ({ ...f, period: v }))}
              options={getPeriodOptions(salaryForm.staffId)}
              required
              disabled={!salaryForm.staffId}
            />
            <FormSelect
              id="status"
                label="Payment Status *"
              value={salaryForm.status}
              onValueChange={(v: 'Paid' | 'Pending' | 'Overdue') => setSalaryForm(f => ({ ...f, status: v }))}
              options={[
                { value: 'Pending', label: 'Pending' },
                  { value: 'Paid', label: 'Paid' },
                { value: 'Overdue', label: 'Overdue' }
              ]}
                required
              />
                <FormInput
                id="dueDate"
                  label="Due Date *"
                  type="date"
                  value={salaryForm.dueDate}
                  onChange={e => setSalaryForm(f => ({ ...f, dueDate: e.target.value }))}
                  required
                />
              </div>
            {salaryForm.status === 'Paid' && (
              <FormDatePicker
                id="paidDate"
                  label="Paid Date *"
                selectedDate={salaryForm.paidDate ? new Date(salaryForm.paidDate) : new Date()}
                  onSelectDate={date => setSalaryForm(f => ({ 
                    ...f, 
                    paidDate: date ? date.toISOString().split('T')[0] : '' 
                  }))}
                  required
                />
              )}
            </div>

            {/* Payment Method & Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Method & Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  id="paymentMethod"
                  label="Payment Method"
                  value={salaryForm.paymentMethod}
                  onValueChange={v => setSalaryForm(f => ({ ...f, paymentMethod: v }))}
                  options={[
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Check', label: 'Check' },
                    { value: 'Online Payment', label: 'Online Payment' }
                  ]}
                />
                <Textarea
                  id="remarks"
                  placeholder="Additional notes or payment instructions..."
                  value={salaryForm.remarks}
                  onChange={e => setSalaryForm(f => ({ ...f, remarks: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
              </div>






              
              {/* Salary Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Salary Summary</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary:</span>
                    <span className="font-medium">₹{salaryForm.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allowances:</span>
                    <span className="font-medium text-green-600">+₹{salaryForm.allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductions:</span>
                    <span className="font-medium text-red-600">-₹{salaryForm.deductions.toLocaleString()}</span>
                    </div>
                  </div>
                <div className="border-t pt-2 mt-3 flex justify-between">
                  <span className="text-gray-700 font-medium">Net Salary:</span>
                    <span className="text-lg font-bold text-blue-600">
                    ₹{(salaryForm.basicSalary + salaryForm.allowances - salaryForm.deductions).toLocaleString()}
                    </span>
                  </div>
                {salaryForm.staffId && (
                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Base Salary:</span>
                      <span className="font-medium">₹{staff.find(s => s.id === salaryForm.staffId)?.salaryAmount?.toLocaleString() || '0'}</span>
                </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Difference:</span>
                      <span className={`font-medium ${(salaryForm.basicSalary - (staff.find(s => s.id === salaryForm.staffId)?.salaryAmount || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {((salaryForm.basicSalary - (staff.find(s => s.id === salaryForm.staffId)?.salaryAmount || 0)) >= 0 ? '+' : '')}₹{(salaryForm.basicSalary - (staff.find(s => s.id === salaryForm.staffId)?.salaryAmount || 0)).toLocaleString()}
                      </span>
            </div>
            </div>
                  )}
                </div>
              </div>



            <DialogFooter className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setAddSalaryOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!salaryForm.staffId || !salaryForm.period || !salaryForm.basicSalary || !salaryForm.dueDate}
              >
                Create Salary Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Salary Payment Dialog */}
      <Dialog open={salaryDialogOpen} onOpenChange={setSalaryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Salary as Paid</DialogTitle>
            <DialogDescription>
              Record salary payment for {selectedSalary && staff.find(s => s.id === selectedSalary.staffId)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <div className="text-lg font-bold">₹{selectedSalary?.amount.toLocaleString()}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Period</label>
                <div>{selectedSalary && new Date(selectedSalary.period + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Date</label>
              <FormDatePicker
                id="paymentDate"
                label="Payment Date"
                selectedDate={new Date()}
                onSelectDate={() => {}}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Remarks (Optional)</label>
              <Textarea placeholder="Add any notes about this payment..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSalaryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleMarkSalaryPaid(selectedSalary!.id, "Payment recorded")
              setSalaryDialogOpen(false)
            }}>
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Salary Detail Sheet */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Salary Details</SheetTitle>
            <SheetDescription>
              {selectedSalary && (
                <React.Fragment>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>
                        {staff.find(s => s.id === selectedSalary.staffId)?.name.split(' ').map(n => n[0]).join('') || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl font-bold">{staff.find(s => s.id === selectedSalary.staffId)?.name}</div>
                      <div className="text-muted-foreground">{staff.find(s => s.id === selectedSalary.staffId)?.role}</div>
                      <Badge className="mt-2">{selectedSalary.status}</Badge>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Amount:</div>
                      <div className="font-bold">₹{selectedSalary.amount.toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Period:</div>
                      <div>{new Date(selectedSalary.period + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Status:</div>
                      <Badge>{selectedSalary.status}</Badge>
                    </div>
                    {selectedSalary.paidDate && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Paid Date:</div>
                        <div>{new Date(selectedSalary.paidDate).toLocaleDateString()}</div>
                      </div>
                    )}
                    {selectedSalary.remarks && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Remarks:</div>
                        <div className="text-sm">{selectedSalary.remarks}</div>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4" />

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={() => handleSalaryAction(selectedSalary, "edit")}>
                      <Edit className="h-4 w-4 mr-1" />Edit
                    </Button>
                    {selectedSalary.status === "Pending" && (
                      <Button variant="outline" onClick={() => handleSalaryAction(selectedSalary, "markPaid")}>
                        <CheckCircle className="h-4 w-4 mr-1" />Mark Paid
                      </Button>
                    )}
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