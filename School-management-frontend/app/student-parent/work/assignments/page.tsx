"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Download,
  FileText,
  Calendar,
  User,
  Award,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  Send,
  CalendarDays,
  Target,
  BarChart3,
  FileCheck,
  FileX,
  FileClock,
  X
} from "lucide-react"
import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns"

interface Assignment {
  id: string
  title: string
  subject: string
  teacher: string
  teacherAvatar?: string
  class: string
  description: string
  instructions: string
  dueDate: string
  assignedDate: string
  maxMarks: number
  status: "Assigned" | "Submitted" | "Graded" | "Overdue" | "Draft"
  submissionDate?: string
  marksObtained?: number
  feedback?: string
  attachments?: string[]
  submissionFiles?: string[]
  priority: "low" | "medium" | "high"
  estimatedTime: string
  tags: string[]
}

// Enhanced mock data with more realistic assignments
const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Algebra Problem Solving",
    subject: "Mathematics",
    teacher: "John Smith",
    teacherAvatar: "/placeholder-user.jpg",
    class: "Class 10-A",
    description: "Solve complex algebraic equations and word problems. Focus on quadratic equations and their applications in real-world scenarios.",
    instructions: "1. Complete all problems in the textbook (Chapter 5, Problems 1-20)\n2. Show all your work clearly\n3. Submit handwritten solutions\n4. Include a brief explanation of your approach",
    dueDate: "2025-07-25T23:59:00Z",
    assignedDate: "2025-07-20T09:00:00Z",
    maxMarks: 100,
    status: "Submitted",
    submissionDate: "2025-07-24T15:30:00Z",
    marksObtained: 85,
    feedback: "Excellent work on problem-solving approach. Good use of algebraic methods. Consider showing more intermediate steps for full credit.",
    attachments: ["algebra_problems.pdf", "solution_guide.pdf"],
    submissionFiles: ["algebra_solutions.pdf"],
    priority: "high",
    estimatedTime: "2-3 hours",
    tags: ["Algebra", "Problem Solving", "Chapter 5"]
  },
  {
    id: "2",
    title: "Physics Lab Report - Motion",
    subject: "Physics",
    teacher: "Sarah Johnson",
    teacherAvatar: "/placeholder-user.jpg",
    class: "Class 10-A",
    description: "Write a comprehensive lab report on the motion experiment conducted in class. Include data analysis, graphs, and conclusions.",
    instructions: "1. Include all experimental data\n2. Create graphs using the provided data\n3. Calculate velocity and acceleration\n4. Write a detailed conclusion\n5. Include error analysis",
    dueDate: "2025-07-28T23:59:00Z",
    assignedDate: "2025-07-22T14:00:00Z",
    maxMarks: 50,
    status: "Assigned",
    priority: "medium",
    estimatedTime: "3-4 hours",
    tags: ["Lab Report", "Motion", "Data Analysis"]
  },
  {
    id: "3",
    title: "English Essay - Shakespeare",
    subject: "English",
    teacher: "Emma Davis",
    teacherAvatar: "/placeholder-user.jpg",
    class: "Class 10-A",
    description: "Write a 1000-word essay analyzing the themes of love and betrayal in Shakespeare's 'Romeo and Juliet'.",
    instructions: "1. Choose one main theme to focus on\n2. Use specific quotes from the text\n3. Include proper citations\n4. Follow MLA formatting\n5. Submit as Word document",
    dueDate: "2025-07-30T23:59:00Z",
    assignedDate: "2025-07-23T10:00:00Z",
    maxMarks: 75,
    status: "Draft",
    priority: "medium",
    estimatedTime: "4-5 hours",
    tags: ["Essay", "Shakespeare", "Literature Analysis"]
  },
  {
    id: "4",
    title: "Chemistry Quiz Preparation",
    subject: "Chemistry",
    teacher: "Mike Wilson",
    teacherAvatar: "/placeholder-user.jpg",
    class: "Class 10-A",
    description: "Review chapters 3-5 for the upcoming chemistry quiz. Complete practice problems and study guide questions.",
    instructions: "1. Review all key concepts from chapters 3-5\n2. Complete practice problems in the workbook\n3. Study the provided flashcards\n4. Take the online practice quiz\n5. Submit completed workbook pages",
    dueDate: "2025-07-26T23:59:00Z",
    assignedDate: "2025-07-21T16:00:00Z",
    maxMarks: 30,
    status: "Overdue",
    priority: "high",
    estimatedTime: "2 hours",
    tags: ["Quiz Prep", "Review", "Chapters 3-5"]
  },
  {
    id: "5",
    title: "Computer Science Project",
    subject: "Computer Science",
    teacher: "Alex Chen",
    teacherAvatar: "/placeholder-user.jpg",
    class: "Class 10-A",
    description: "Create a simple web application using HTML, CSS, and JavaScript. The app should demonstrate basic programming concepts.",
    instructions: "1. Design a responsive website\n2. Include at least 3 interactive features\n3. Use proper HTML structure\n4. Style with CSS\n5. Add JavaScript functionality\n6. Submit code files and live demo link",
    dueDate: "2025-08-02T23:59:00Z",
    assignedDate: "2025-07-24T11:00:00Z",
    maxMarks: 100,
    status: "Assigned",
    priority: "low",
    estimatedTime: "6-8 hours",
    tags: ["Web Development", "JavaScript", "Project"]
  }
]

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [submissionData, setSubmissionData] = useState({
    files: [] as File[],
    comments: "",
    submissionType: "file"
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")

  // Calculate statistics
  const totalAssignments = mockAssignments.length
  const completedAssignments = mockAssignments.filter(a => a.status === "Graded" || a.status === "Submitted").length
  const overdueAssignments = mockAssignments.filter(a => a.status === "Overdue").length
  const pendingAssignments = mockAssignments.filter(a => a.status === "Assigned" || a.status === "Draft").length
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0

  // Filter assignments based on active tab and search
  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesTab = activeTab === "all" || assignment.status.toLowerCase() === activeTab
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = filterSubject === "all" || assignment.subject === filterSubject
    return matchesTab && matchesSearch && matchesSubject
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Graded":
        return "bg-green-100 text-green-800 border-green-200"
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "Assigned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
        return <FileCheck className="h-4 w-4 text-blue-600" />
      case "Graded":
        return <Award className="h-4 w-4 text-green-600" />
      case "Overdue":
        return <FileX className="h-4 w-4 text-red-600" />
      case "Assigned":
        return <FileClock className="h-4 w-4 text-yellow-600" />
      case "Draft":
        return <Edit3 className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = (dueDate: string) => {
    return isAfter(new Date(), parseISO(dueDate))
  }

  const getDaysRemaining = (dueDate: string) => {
    const due = parseISO(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleSubmission = (data: any) => {
    console.log("Submission data:", data)
    // Handle submission logic here
    setSelectedAssignment(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSubmissionData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setSubmissionData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const subjects = Array.from(new Set(mockAssignments.map(a => a.subject)))

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
          <p className="text-muted-foreground">Track and manage your academic assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAssignments}</div>
            <p className="text-xs text-muted-foreground">Successfully submitted</p>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueAssignments}</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({totalAssignments})</TabsTrigger>
          <TabsTrigger value="assigned">Assigned ({pendingAssignments})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({mockAssignments.filter(a => a.status === "Submitted").length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({mockAssignments.filter(a => a.status === "Graded").length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueAssignments})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Assignment Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={assignment.teacherAvatar} alt={assignment.teacher} />
                              <AvatarFallback>{assignment.teacher.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{assignment.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {assignment.subject} • {assignment.teacher}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(assignment.status)}>
                              {getStatusIcon(assignment.status)}
                              {assignment.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(assignment.priority)}>
                              {assignment.priority}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2">{assignment.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {assignment.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Due Date:</span>
                            <div className="font-medium flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(parseISO(assignment.dueDate), "MMM dd, yyyy")}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Marks:</span>
                            <div className="font-medium">{assignment.maxMarks}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Est. Time:</span>
                            <div className="font-medium">{assignment.estimatedTime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Days Left:</span>
                            <div className={`font-medium ${isOverdue(assignment.dueDate) ? 'text-red-600' : 'text-green-600'}`}>
                              {isOverdue(assignment.dueDate) 
                                ? `${Math.abs(getDaysRemaining(assignment.dueDate))} days overdue`
                                : `${getDaysRemaining(assignment.dueDate)} days left`
                              }
                            </div>
                          </div>
                        </div>

                        {assignment.status === "Graded" && assignment.marksObtained !== undefined && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-green-800">Grade Received</div>
                                <div className="text-sm text-green-600">{assignment.marksObtained}/{assignment.maxMarks} marks</div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-800">
                                  {Math.round((assignment.marksObtained / assignment.maxMarks) * 100)}%
                                </div>
                              </div>
                            </div>
                            {assignment.feedback && (
                              <div className="mt-2 text-sm text-green-700">
                                <strong>Feedback:</strong> {assignment.feedback}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 lg:w-48">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        
                        {(assignment.status === "Assigned" || assignment.status === "Draft") && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full">
                                <Upload className="mr-2 h-4 w-4" />
                                Submit Assignment
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Submit Assignment</DialogTitle>
                                <DialogDescription>
                                  Submit your work for "{assignment.title}"
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Submission Type</Label>
                                  <Select 
                                    value={submissionData.submissionType}
                                    onValueChange={(value) => setSubmissionData(prev => ({ ...prev, submissionType: value }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="file">File Upload</SelectItem>
                                      <SelectItem value="text">Text Submission</SelectItem>
                                      <SelectItem value="link">Link Submission</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {submissionData.submissionType === "file" && (
                                  <div>
                                    <Label>Upload Files</Label>
                                    <Input
                                      type="file"
                                      multiple
                                      onChange={handleFileUpload}
                                      accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                                    />
                                    {submissionData.files.length > 0 && (
                                      <div className="mt-2 space-y-2">
                                        {submissionData.files.map((file, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                            <span className="text-sm">{file.name}</span>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeFile(index)}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {submissionData.submissionType === "text" && (
                                  <div>
                                    <Label>Your Submission</Label>
                                    <Textarea
                                      placeholder="Enter your assignment content here..."
                                      value={submissionData.comments}
                                      onChange={(e) => setSubmissionData(prev => ({ ...prev, comments: e.target.value }))}
                                      rows={6}
                                    />
                                  </div>
                                )}

                                {submissionData.submissionType === "link" && (
                                  <div>
                                    <Label>Submission Link</Label>
                                    <Input
                                      placeholder="https://..."
                                      value={submissionData.comments}
                                      onChange={(e) => setSubmissionData(prev => ({ ...prev, comments: e.target.value }))}
                                    />
                                  </div>
                                )}

                                <div>
                                  <Label>Additional Comments (Optional)</Label>
                                  <Textarea
                                    placeholder="Any additional notes for your teacher..."
                                    rows={3}
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">Save Draft</Button>
                                  <Button onClick={() => handleSubmission(submissionData)}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Assignment
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {assignment.attachments && assignment.attachments.length > 0 && (
                          <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download Files ({assignment.attachments.length})
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Assignment Details Dialog */}
      {selectedAssignment && (
        <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {selectedAssignment.title}
              </DialogTitle>
              <DialogDescription>
                {selectedAssignment.subject} • {selectedAssignment.teacher}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Assignment Overview */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Assignment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className={getStatusColor(selectedAssignment.status)}>
                        {selectedAssignment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span>{format(parseISO(selectedAssignment.dueDate), "PPP 'at' p")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Marks:</span>
                      <span>{selectedAssignment.maxMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Time:</span>
                      <span>{selectedAssignment.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant="outline" className={getPriorityColor(selectedAssignment.priority)}>
                        {selectedAssignment.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssignment.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedAssignment.description}</p>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold mb-2">Instructions</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{selectedAssignment.instructions}</pre>
                </div>
              </div>

              {/* Attachments */}
              {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Assignment Files</h3>
                  <div className="space-y-2">
                    {selectedAssignment.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Details */}
              {selectedAssignment.submissionDate && (
                <div>
                  <h3 className="font-semibold mb-2">Submission Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span>{format(parseISO(selectedAssignment.submissionDate), "PPP 'at' p")}</span>
                    </div>
                    {selectedAssignment.submissionFiles && selectedAssignment.submissionFiles.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Files:</span>
                        <div className="mt-1 space-y-1">
                          {selectedAssignment.submissionFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3" />
                              {file}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Grade and Feedback */}
              {selectedAssignment.status === "Graded" && selectedAssignment.marksObtained !== undefined && (
                <div>
                  <h3 className="font-semibold mb-2">Grade & Feedback</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-semibold text-green-800">
                        {selectedAssignment.marksObtained}/{selectedAssignment.maxMarks} marks
                      </div>
                      <div className="text-2xl font-bold text-green-800">
                        {Math.round((selectedAssignment.marksObtained / selectedAssignment.maxMarks) * 100)}%
                      </div>
                    </div>
                    {selectedAssignment.feedback && (
                      <div className="text-sm text-green-700">
                        <strong>Feedback:</strong> {selectedAssignment.feedback}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
