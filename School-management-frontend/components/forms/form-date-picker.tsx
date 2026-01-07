"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface FormDatePickerProps {
  label: string
  id: string
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
  error?: string
  placeholder?: string
}

const FormDatePicker = React.forwardRef<HTMLButtonElement, FormDatePickerProps>(
  ({ label, id, selectedDate, onSelectDate, error, placeholder = "Pick a date" }, ref) => {
    return (
      <div className="grid gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                error && "border-destructive",
              )}
              ref={ref}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={selectedDate} onSelect={onSelectDate} initialFocus />
          </PopoverContent>
        </Popover>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)
FormDatePicker.displayName = "FormDatePicker"

export { FormDatePicker }
