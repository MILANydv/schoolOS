"use client"

import * as React from "react"
import { AddStudentForm } from "@/components/forms/add-student-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function AddStudentPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSuccess = (studentData: any) => {
    // Handle successful student addition
    toast({
      title: "Student Added Successfully!",
      description: `${studentData.firstName} ${studentData.lastName} has been added to the system.`,
    })
    
    // Redirect to students list
    router.push("/schooladmin/students")
  }

  return (
    <AddStudentForm 
      mode="page"
      onSuccess={handleSuccess}
    />
  )
}
