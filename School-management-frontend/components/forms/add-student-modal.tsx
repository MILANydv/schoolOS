"use client"

import * as React from "react"
import { AddStudentForm } from "./add-student-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddStudentModalProps {
  trigger?: React.ReactNode;
  onSuccess?: (student: any) => void;
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
  const { toast } = useToast()

  const handleSuccess = (studentData: any) => {
    // Show success toast
    toast({
      title: "Student Added Successfully!",
      description: `${studentData.firstName} ${studentData.lastName} has been added to the system.`,
    })

    // Call parent success handler if provided
    if (onSuccess) {
      onSuccess(studentData)
    }

    // Close modal
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