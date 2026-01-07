"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  User, 
  TrendingUp, 
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Edit,
  Bell,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Activity,
  Target,
  Star
} from "lucide-react"

interface StudentDetailModalProps {
  student: any
  isOpen: boolean
  onClose: () => void
  onEdit: (student: any) => void
  onMessage: (student: any) => void
  onCall: (student: any) => void
}

export function StudentDetailModal({
  student,
  isOpen,
  onClose,
  onEdit,
  onMessage,
  onCall
}: StudentDetailModalProps) {
  if (!student) return null

  // Mock performance data
  const performanceData = {
    overallGrade: "A-",
    attendance: 92,
    assignments: 85,
    exams: 88,
    participation: 90,
    subjects: [
      { name: "Mathematics", grade: "A", score: 92 },
      { name: "English", grade: "B+", score: 87 },
      { name: "Science", grade: "A-", score: 89 },
      { name: "History", grade: "B", score: 83 },
    ]
  }

  const attendanceData = {
    totalDays: 180,
    present: 165,
    absent: 10,
    late: 5,
    percentage: 92
  }

  const recentActivities = [
    { type: "assignment", title: "Math Assignment Submitted", date: "2024-01-15", status: "completed" },
    { type: "exam", title: "Science Midterm", date: "2024-01-12", status: "completed" },
    { type: "attendance", title: "Present", date: "2024-01-15", status: "present" },
    { type: "assignment", title: "English Essay Due", date: "2024-01-18", status: "pending" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
              <AvatarFallback>{student.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{student.name}</DialogTitle>
              <DialogDescription>
                {student.class} • Roll No: {student.rollNumber} • {student.status}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm font-medium">{student.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span className="text-sm font-medium">{student.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Gender:</span>
                    <span className="text-sm font-medium">{student.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date of Birth:</span>
                    <span className="text-sm font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Blood Group:</span>
                    <span className="text-sm font-medium">{student.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Admission Date:</span>
                    <span className="text-sm font-medium">{new Date(student.admissionDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Parent Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Parent Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Parent Name:</span>
                    <span className="text-sm font-medium">{student.parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Parent Contact:</span>
                    <span className="text-sm font-medium">{student.parentContact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Parent Email:</span>
                    <span className="text-sm font-medium">{student.parentEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Emergency Contact:</span>
                    <span className="text-sm font-medium">{student.emergencyContact}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Class:</span>
                    <Badge variant="outline">{student.class}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Roll Number:</span>
                    <span className="text-sm font-medium font-mono">{student.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge 
                      variant={student.status === "Active" ? "default" : "secondary"}
                      className={student.status === "Active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {student.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Overall Grade:</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {performanceData.overallGrade}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Attendance:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={attendanceData.percentage} className="w-16 h-2" />
                      <span className="text-sm font-medium">{attendanceData.percentage}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Assignments:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={performanceData.assignments} className="w-16 h-2" />
                      <span className="text-sm font-medium">{performanceData.assignments}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Participation:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={performanceData.participation} className="w-16 h-2" />
                      <span className="text-sm font-medium">{performanceData.participation}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Overall Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Overall Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{performanceData.overallGrade}</div>
                    <div className="text-sm text-gray-500">Overall Grade</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Attendance</span>
                      <div className="flex items-center gap-2">
                        <Progress value={performanceData.attendance} className="w-20" />
                        <span className="text-sm font-medium">{performanceData.attendance}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Assignments</span>
                      <div className="flex items-center gap-2">
                        <Progress value={performanceData.assignments} className="w-20" />
                        <span className="text-sm font-medium">{performanceData.assignments}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Exams</span>
                      <div className="flex items-center gap-2">
                        <Progress value={performanceData.exams} className="w-20" />
                        <span className="text-sm font-medium">{performanceData.exams}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Participation</span>
                      <div className="flex items-center gap-2">
                        <Progress value={performanceData.participation} className="w-20" />
                        <span className="text-sm font-medium">{performanceData.participation}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Subject Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceData.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-gray-500">Score: {subject.score}%</div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {subject.grade}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Attendance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Attendance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{attendanceData.percentage}%</div>
                    <div className="text-sm text-gray-500">Overall Attendance</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{attendanceData.present}</div>
                      <div className="text-xs text-gray-500">Present</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{attendanceData.absent}</div>
                      <div className="text-xs text-gray-500">Absent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{attendanceData.late}</div>
                      <div className="text-xs text-gray-500">Late</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Days</span>
                      <span className="font-medium">{attendanceData.totalDays}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Present Days</span>
                      <span className="font-medium text-green-600">{attendanceData.present}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Absent Days</span>
                      <span className="font-medium text-red-600">{attendanceData.absent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Late Days</span>
                      <span className="font-medium text-yellow-600">{attendanceData.late}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Attendance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Attendance trend chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'exam' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'assignment' ? <FileText className="h-4 w-4" /> :
                         activity.type === 'exam' ? <Award className="h-4 w-4" /> :
                         <CheckCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                      </div>
                      <Badge 
                        variant={activity.status === 'completed' || activity.status === 'present' ? 'default' : 'secondary'}
                        className={activity.status === 'completed' || activity.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onMessage(student)}>
              <Mail className="h-4 w-4 mr-2" />
              Message Parent
            </Button>
            <Button variant="outline" onClick={() => onCall(student)}>
              <Phone className="h-4 w-4 mr-2" />
              Call Parent
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit(student)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Student
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 