"use client"

import * as React from "react"
import { AddStudentForm } from "@/components/forms/add-student-form"
import { useRouter } from "next/navigation"
import { useCreateStudent } from "@/hooks"
import type { CreateStudentPayload } from "@/lib/api-types"

export default function AddStudentPage() {
  const router = useRouter()
  const createStudentMutation = useCreateStudent()

  const handleSuccess = (payload: CreateStudentPayload) => {
    createStudentMutation.mutate(payload, {
      onSuccess: () => {
        router.push("/schooladmin/students")
      },
    })
  }

  return (
    <AddStudentForm 
      mode="page"
      onSuccess={handleSuccess}
    />
  )
}
