"use client"

import type * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FormDialogProps {
  title: string
  description: string
  children: React.ReactNode
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FormDialog({ title, description, children, trigger, open, onOpenChange }: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
