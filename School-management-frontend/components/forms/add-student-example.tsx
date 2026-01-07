"use client"

import * as React from "react"
import { AddStudentModal } from "./add-student-modal"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Example: Class Management Section
export function ClassManagementExample() {
  const [students, setStudents] = React.useState<any[]>([])

  const handleStudentAdded = (studentData: any) => {
    // Add student to the class
    const newStudent = {
      id: `student-${Date.now()}`,
      name: `${studentData.firstName} ${studentData.lastName}`,
      class: studentData.class,
      rollNumber: studentData.rollNumber,
      // ... other fields
    }
    setStudents(prev => [newStudent, ...prev])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Class 10A Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {students.length} students in this class
          </p>
          <AddStudentModal 
            trigger={
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add to Class
              </Button>
            }
            onSuccess={handleStudentAdded}
          />
        </div>
        
        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No students in this class yet</p>
            <p className="text-sm">Click "Add to Class" to add students</p>
          </div>
        ) : (
          <div className="space-y-2">
            {students.map(student => (
              <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                <span>{student.name}</span>
                <span className="text-sm text-gray-500">Roll: {student.rollNumber}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Example: Dashboard Quick Add
export function DashboardQuickAdd() {
  return (
    <div className="flex gap-2">
      <AddStudentModal 
        variant="default"
        size="sm"
        onSuccess={(student) => {
          console.log("Student added from dashboard:", student)
        }}
      />
      
      <AddStudentModal 
        trigger={
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        }
        onSuccess={(student) => {
          console.log("Student added from icon button:", student)
        }}
      />
    </div>
  )
}

// Example: Custom Trigger
export function CustomTriggerExample() {
  return (
    <AddStudentModal 
      trigger={
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors">
          <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium text-gray-600">Add New Student</p>
          <p className="text-xs text-gray-500">Click to open form</p>
        </div>
      }
      onSuccess={(student) => {
        console.log("Student added from custom trigger:", student)
      }}
    />
  )
} 