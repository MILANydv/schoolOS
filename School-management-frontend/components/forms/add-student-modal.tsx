"use client"

import * as React from "react"
import { AddStudentForm } from "./add-student-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { CreateStudentPayload } from "@/lib/api-types"

interface AddStudentModalProps {
  trigger?: React.ReactNode;
  onSuccess?: (payload: CreateStudentPayload) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddStudentModal({ 
  trigger, 
  onSuccess, 
  className = "",
  variant = "default",
  size = "default"
}: AddStudentModalProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSuccess = (studentData: CreateStudentPayload) => {
    if (onSuccess) {
      onSuccess(studentData)
    }

    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const defaultTrigger = (
    <Button variant={variant} size={size} className={className}>
      <Plus className="h-4 w-4 mr-2" />
      Add Student
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add New Student
          </DialogTitle>
        </DialogHeader>
        <AddStudentForm
          isOpen={isOpen}
          onClose={handleClose}
          onSuccess={handleSuccess}
          mode="modal"
        />
      </DialogContent>
    </Dialog>
  )
} 