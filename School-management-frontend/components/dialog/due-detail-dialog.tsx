"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Due {
  id: string
  studentName: string
  rollNo: string
  class: string
  feeType: string
  amount: number
  dueDate: string // ISO date string
  status: "Overdue" | "Due Soon" | "Pending"
  daysOverdue: number
  contactEmail: string
  contactPhone: string
}

interface DueDetailsDialogProps {
  due: Due | null
  isOpen: boolean
  onClose: () => void
}

export function DueDetailsDialog({ due, isOpen, onClose }: DueDetailsDialogProps) {
  if (!due) return null

  const badgeVariant = due.status === "Overdue" ? "destructive" : due.status === "Due Soon" ? "default" : "secondary"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Due Details: {due.studentName}</DialogTitle>
          <DialogDescription>Comprehensive information about the outstanding fee.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Student Name</div>
            <div className="col-span-2 text-sm font-semibold">{due.studentName}</div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Roll No.</div>
            <div className="col-span-2 text-sm">{due.rollNo}</div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Class</div>
            <div className="col-span-2 text-sm">{due.class}</div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Fee Type</div>
            <div className="col-span-2 text-sm">{due.feeType}</div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Amount</div>
            <div className="col-span-2 text-sm font-semibold">{due.amount.toLocaleString()} INR</div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Due Date</div>
            <div className="col-span-2 text-sm">{new Date(due.dueDate).toLocaleDateString()}</div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <div className="col-span-2 text-sm">
              <Badge variant={badgeVariant}>{due.status}</Badge>
              {due.daysOverdue > 0 && (
                <span className="ml-2 text-xs text-red-600">({due.daysOverdue} days overdue)</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div className="col-span-2 text-sm">{due.contactEmail}</div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">Phone</div>
            <div className="col-span-2 text-sm">{due.contactPhone}</div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
