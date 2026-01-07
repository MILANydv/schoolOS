import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  label: string
  id: string
  options: { value: string; label: string }[]
  error?: string
  placeholder?: string
}

const FormSelect = React.forwardRef<React.ElementRef<typeof SelectTrigger>, FormSelectProps>(
  ({ label, id, options, error, placeholder, className, ...props }, ref) => {
    return (
      <div className="grid gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Select {...props}>
          <SelectTrigger id={id} className={cn(error && "border-destructive", className)} ref={ref}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)
FormSelect.displayName = "FormSelect"

export { FormSelect }
