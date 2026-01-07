import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, error, className, type = "text", ...props }, ref) => {
    return (
      <div className="grid gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} type={type} className={cn(error && "border-destructive", className)} ref={ref} {...props} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)
FormInput.displayName = "FormInput"

export { FormInput }
