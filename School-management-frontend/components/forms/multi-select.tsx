"use client"

import * as React from "react"
import { X, Check, ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface MultiSelectProps {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
  id?: string
  error?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  label,
  id,
  error,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
    onChange(newSelected)
  }

  const handleClearAll = () => {
    onChange([])
  }

  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between h-auto min-h-[36px] flex-wrap", error && "border-destructive")}
            id={id}
          >
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selected.map((value) => {
                  const option = options.find((o) => o.value === value)
                  return (
                    <Badge key={value} variant="secondary" className="flex items-center gap-1">
                      {option?.label || value}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelect(value)
                        }}
                      />
                    </Badge>
                  )
                })}
              </div>
            )}
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              {selected.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={handleClearAll} className="justify-center text-center">
                      Clear all
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
