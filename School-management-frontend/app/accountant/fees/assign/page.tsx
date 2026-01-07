"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Handshake,
  Calculator,
  Save,
  Users,
  CheckCircle,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Info,
} from "lucide-react"

// Mock data with assignment status
const mockClasses = [
  { id: "1", name: "Class 10-A", students: 35, assignedStudents: 28 },
  { id: "2", name: "Class 9-B", students: 32, assignedStudents: 15 },
  { id: "3", name: "Class 11-C", students: 28, assignedStudents: 28 },
]

const mockStudents = [
  {
    id: "1",
    name: "John Doe",
    rollNo: "001",
    class: "Class 10-A",
    classId: "1",
    assigned: true,
    feePlan: "Standard Plan",
    amount: 55000,
    dueDate: "2024-03-15",
    status: "paid",
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNo: "002",
    class: "Class 10-A",
    classId: "1",
    assigned: true,
    feePlan: "Transport Plan",
    amount: 64000,
    dueDate: "2024-03-15",
    status: "pending",
  },
  {
    id: "3",
    name: "Mike Johnson",
    rollNo: "003",
    class: "Class 9-B",
    classId: "2",
    assigned: false,
    feePlan: null,
    amount: 0,
    dueDate: null,
    status: "unassigned",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    rollNo: "004",
    class: "Class 10-A",
    classId: "1",
    assigned: false,
    feePlan: null,
    amount: 0,
    dueDate: null,
    status: "unassigned",
  },
  {
    id: "5",
    name: "David Brown",
    rollNo: "005",
    class: "Class 9-B",
    classId: "2",
    assigned: true,
    feePlan: "Hostel Plan",
    amount: 132000,
    dueDate: "2024-03-15",
    status: "overdue",
  },
  {
    id: "6",
    name: "Emily Davis",
    rollNo: "006",
    class: "Class 11-C",
    classId: "3",
    assigned: true,
    feePlan: "Standard Plan",
    amount: 55000,
    dueDate: "2024-03-15",
    status: "paid",
  },
  {
    id: "7",
    name: "Alex Turner",
    rollNo: "007",
    class: "Class 9-B",
    classId: "2",
    assigned: false,
    feePlan: null,
    amount: 0,
    dueDate: null,
    status: "unassigned",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    rollNo: "008",
    class: "Class 11-C",
    classId: "3",
    assigned: true,
    feePlan: "Transport Plan",
    amount: 64000,
    dueDate: "2024-03-15",
    status: "pending",
  },
]

const mockFeePlans = [
  {
    id: "1",
    name: "Standard Plan",
    description: "Basic tuition with library and sports",
    fees: [
      { name: "Tuition Fee", amount: 50000 },
      { name: "Library Fee", amount: 2000 },
      { name: "Sports Fee", amount: 3000 },
    ],
  },
  {
    id: "2",
    name: "Transport Plan",
    description: "Standard plan with transport facility",
    fees: [
      { name: "Tuition Fee", amount: 50000 },
      { name: "Library Fee", amount: 2000 },
      { name: "Transport Fee", amount: 12000 },
    ],
  },
  {
    id: "3",
    name: "Hostel Plan",
    description: "Standard plan with hostel accommodation",
    fees: [
      { name: "Tuition Fee", amount: 50000 },
      { name: "Library Fee", amount: 2000 },
      { name: "Hostel Fee", amount: 80000 },
    ],
  },
]

export default function AssignFeesPage() {
  const [assignmentType, setAssignmentType] = useState<"class" | "student">("class")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [discount, setDiscount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "assigned" | "unassigned">("all")
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<any>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const selectedPlanData = mockFeePlans.find((p) => p.id === selectedPlan)
  const totalAmount = selectedPlanData?.fees.reduce((sum, fee) => sum + fee.amount, 0) || 0
  const discountAmount = (totalAmount * discount) / 100
  const finalAmount = totalAmount - discountAmount

  // Calculate statistics
  const totalStudents = mockStudents.length
  const assignedStudents = mockStudents.filter((s) => s.assigned).length
  const unassignedStudents = totalStudents - assignedStudents
  const assignmentProgress = (assignedStudents / totalStudents) * 100
  const totalRevenue = mockStudents.filter((s) => s.assigned).reduce((sum, s) => sum + s.amount, 0)

  // Filter students based on search and status
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "assigned" && student.assigned) ||
      (filterStatus === "unassigned" && !student.assigned)
    return matchesSearch && matchesFilter
  })

  const handleAssign = async () => {
    setIsAssigning(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const assignmentData = {
      type: assignmentType,
      target: assignmentType === "class" ? selectedClass : selectedStudent,
      plan: selectedPlan,
      discount,
      totalAmount: finalAmount,
    }

    console.log("Assigning fees:", assignmentData)

    setIsAssigning(false)
    setShowSuccess(true)

    // Reset form
    setSelectedClass("")
    setSelectedStudent("")
    setSelectedPlan("")
    setDiscount(0)

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleViewStudent = (student: any) => {
    setSelectedStudentDetails(student)
  }

  const handleEditAssignment = (studentId: string) => {
    const student = mockStudents.find((s) => s.id === studentId)
    if (student) {
      setAssignmentType("student")
      setSelectedStudent(studentId)
      setSelectedPlan(mockFeePlans.find((p) => p.name === student.feePlan)?.id || "")
    }
  }

  const handleRemoveAssignment = (studentId: string) => {
    console.log("Removing assignment for student:", studentId)
    // Implement remove logic here
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      default:
        return <Badge variant="outline">Unassigned</Badge>
    }
  }

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-sm text-muted-foreground">Assign and manage fee plans for students and classes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Compact Statistics Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Students</p>
              <p className="text-lg font-bold">{totalStudents}</p>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Assigned</p>
              <p className="text-lg font-bold text-green-600">{assignedStudents}</p>
            </div>
            <UserCheck className="h-4 w-4 text-green-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending</p>
              <p className="text-lg font-bold text-red-600">{unassignedStudents}</p>
            </div>
            <UserX className="h-4 w-4 text-red-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Revenue</p>
              <p className="text-lg font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Search, Filter and Progress in one row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Search and Filter - 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, roll number, or class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filterStatus}
                  onValueChange={(value: "all" | "assigned" | "unassigned") => setFilterStatus(value)}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({totalStudents})</SelectItem>
                    <SelectItem value="assigned">Assigned ({assignedStudents})</SelectItem>
                    <SelectItem value="unassigned">Unassigned ({unassignedStudents})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Results Info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Showing {filteredStudents.length} of {totalStudents} students
                </span>
                {searchTerm && (
                  <Badge variant="outline" className="text-xs h-5">
                    "{searchTerm}"
                  </Badge>
                )}
                {filterStatus !== "all" && (
                  <Badge variant="outline" className="text-xs h-5">
                    {filterStatus === "assigned" ? "Assigned Only" : "Unassigned Only"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Progress - 1 column */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall</span>
                <span className="font-medium">{assignmentProgress.toFixed(0)}%</span>
              </div>
              <Progress value={assignmentProgress} className="h-2" />
            </div>

            <div className="space-y-2">
              {mockClasses.map((cls) => {
                const classProgress = (cls.assignedStudents / cls.students) * 100
                return (
                  <div key={cls.id} className="flex items-center justify-between text-xs">
                    <span className="truncate">{cls.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {cls.assignedStudents}/{cls.students}
                      </span>
                      <div className="w-12">
                        <Progress value={classProgress} className="h-1" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Fees assigned successfully! Students will be notified.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="assign" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assign">Assign Fees</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Assignment Form - 2 columns */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="h-5 w-5" />
                    Fee Assignment
                  </CardTitle>
                  <CardDescription>Configure and assign fee plans to students or classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Assignment Type</Label>
                        <Select
                          value={assignmentType}
                          onValueChange={(value: "class" | "student") => setAssignmentType(value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="class">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Assign to Entire Class
                              </div>
                            </SelectItem>
                            <SelectItem value="student">
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                Assign to Individual Student
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {assignmentType === "class" ? (
                        <div>
                          <Label className="text-sm font-medium">Select Class</Label>
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Choose a class" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockClasses.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{cls.name}</span>
                                    <div className="flex gap-2 ml-4">
                                      <Badge variant="outline" className="text-xs">
                                        {cls.students} total
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {cls.assignedStudents} assigned
                                      </Badge>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div>
                          <Label className="text-sm font-medium">Select Student</Label>
                          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Choose a student" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockStudents.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {student.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">{student.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {student.rollNo} • {student.class}
                                      </div>
                                    </div>
                                    {student.assigned && (
                                      <Badge variant="outline" className="text-xs">
                                        Assigned
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Fee Plan</Label>
                        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choose a fee plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockFeePlans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                <div className="flex flex-col items-start">
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-medium">{plan.name}</span>
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                      ₹{plan.fees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{plan.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Discount (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) => setDiscount(Number.parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAssign}
                    className="w-full"
                    disabled={!selectedPlan || (!selectedClass && !selectedStudent) || isAssigning}
                  >
                    {isAssigning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Assign Fees
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Fee Calculation - 1 column */}
            {selectedPlan && selectedPlanData && (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calculator className="h-4 w-4" />
                    Fee Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Breakdown:</h4>
                    {selectedPlanData.fees.map((fee, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                        <span>{fee.name}</span>
                        <span className="font-medium">₹{fee.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%):</span>
                        <span className="font-medium">-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base border-t pt-2">
                      <span>Total:</span>
                      <span>₹{finalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {assignmentType === "class" && selectedClass && (
                    <div className="p-2 bg-blue-50 rounded text-xs text-blue-800">
                      <Info className="h-3 w-3 inline mr-1" />
                      This will be applied to {mockClasses.find((c) => c.id === selectedClass)?.students} students
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Management
              </CardTitle>
              <CardDescription>View and manage individual student fee assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{student.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {student.rollNo} • {student.class}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {student.assigned ? (
                        <div className="text-right">
                          <div className="font-medium text-sm">₹{student.amount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{student.feePlan}</div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Not Assigned</div>
                          <div className="text-xs text-muted-foreground">No fee plan</div>
                        </div>
                      )}

                      {getStatusBadge(student.status)}

                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleViewStudent(student)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Student Details</DialogTitle>
                              <DialogDescription>Complete information for {student.name}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Name:</span>
                                  <p>{student.name}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Roll No:</span>
                                  <p>{student.rollNo}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Class:</span>
                                  <p>{student.class}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span>
                                  <p>{getStatusBadge(student.status)}</p>
                                </div>
                                {student.assigned && (
                                  <>
                                    <div>
                                      <span className="font-medium">Fee Plan:</span>
                                      <p>{student.feePlan}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Amount:</span>
                                      <p>₹{student.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Due Date:</span>
                                      <p>{student.dueDate}</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {student.assigned && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleEditAssignment(student.id)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveAssignment(student.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No students found matching your criteria</p>
                    <Button
                      variant="outline"
                      className="mt-2 bg-transparent"
                      onClick={() => {
                        setSearchTerm("")
                        setFilterStatus("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
