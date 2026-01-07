"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Save, X, Phone, MapPin, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DriverFormData {
  name: string
  contactNo: string
  age: number
  address: string
  licenseNo: string
  status: "Active" | "Inactive"
}

type DriverFormErrors = {
  [K in keyof DriverFormData]?: string
}

interface AddDriverFormProps {
  onSubmit: (data: DriverFormData) => void
  onCancel?: () => void
  initialData?: Partial<DriverFormData>
  isEdit?: boolean
}

export function AddDriverForm({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}: AddDriverFormProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState<DriverFormData>({
    name: initialData?.name || "",
    contactNo: initialData?.contactNo || "",
    age: initialData?.age || 0,
    address: initialData?.address || "",
    licenseNo: initialData?.licenseNo || "",
    status: initialData?.status || "Active",
  })

  const [errors, setErrors] = useState<DriverFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: DriverFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Driver name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.contactNo.trim()) {
      newErrors.contactNo = "Contact number is required"
    } else if (!/^\+91\s\d{10}$/.test(formData.contactNo)) {
      newErrors.contactNo = "Invalid format. Use: +91 XXXXXXXXXX"
    }

    if (!formData.age || formData.age <= 0) {
      newErrors.age = "Age is required"
    } else if (formData.age < 21) {
      newErrors.age = "Driver must be at least 21 years old"
    } else if (formData.age > 65) {
      newErrors.age = "Driver age cannot exceed 65 years"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please provide a complete address"
    }

    if (!formData.licenseNo.trim()) {
      newErrors.licenseNo = "License number is required"
    } else if (!/^[A-Z]{2}\d{13}$/.test(formData.licenseNo)) {
      newErrors.licenseNo = "Invalid format. Use: XX followed by 13 digits"
    }

    if (!formData.status) {
      newErrors.status = "Status is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      toast({
        title: isEdit ? "Driver Updated" : "Driver Added",
        description: `${formData.name} has been ${isEdit ? "updated" : "added"} successfully.`,
      })

      if (!isEdit) {
        setFormData({
          name: "",
          contactNo: "",
          age: 0,
          address: "",
          licenseNo: "",
          status: "Active",
        })
        setErrors({})
      }
    }
  }

  const handleInputChange = (field: keyof DriverFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const formatContactNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.startsWith("91") && digits.length === 12) {
      return `+91 ${digits.slice(2)}`
    } else if (digits.length === 10) {
      return `+91 ${digits}`
    }
    return value
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{isEdit ? "Edit Driver" : "Add New Driver"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNo">
            <Phone className="h-4 w-4 inline mr-1" />
            Contact Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactNo"
            placeholder="+91 9876543210"
            value={formData.contactNo}
            onChange={(e) => handleInputChange("contactNo", formatContactNumber(e.target.value))}
            className={errors.contactNo ? "border-red-500" : ""}
          />
          {errors.contactNo && <p className="text-sm text-red-500">{errors.contactNo}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">
            Age <span className="text-red-500">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 35"
            min="21"
            max="65"
            value={formData.age || ""}
            onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value) || 0)}
            className={errors.age ? "border-red-500" : ""}
          />
          {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
          <p className="text-sm text-muted-foreground">Must be between 21–65 years</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            <MapPin className="h-4 w-4 inline mr-1" />
            Complete Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            placeholder="e.g., 123 Main Street, Bangalore, Karnataka - 560001"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className={errors.address ? "border-red-500" : ""}
            rows={3}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseNo">
            <CreditCard className="h-4 w-4 inline mr-1" />
            Driving License Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="licenseNo"
            placeholder="e.g., KA0120230001234"
            value={formData.licenseNo}
            onChange={(e) => handleInputChange("licenseNo", e.target.value.toUpperCase())}
            className={errors.licenseNo ? "border-red-500" : ""}
          />
          {errors.licenseNo && <p className="text-sm text-red-500">{errors.licenseNo}</p>}
          <p className="text-sm text-muted-foreground">
            Format: State code + 13 digits (e.g., KA0120230001234)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: "Active" | "Inactive") => handleInputChange("status", value)}
          >
            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? "Update Driver" : "Add Driver"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
