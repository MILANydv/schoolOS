"use client"

import type React from "react"
import { useState } from "react"
import { Bus, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface BusFormData {
  busNumber: string
  capacity: number
  driver: string
  route: string
  status: "Active" | "Inactive" | "Maintenance"
}

type BusFormErrors = {
  [K in keyof BusFormData]?: string
}

interface AddBusFormProps {
  drivers: Array<{ id: string; name: string; status: string }>
  routes: Array<{ id: string; name: string; status: string }>
  onSubmit: (data: BusFormData) => void
  onCancel?: () => void
  initialData?: Partial<BusFormData>
  isEdit?: boolean
}

export function AddBusForm({
  drivers,
  routes,
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}: AddBusFormProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState<BusFormData>({
    busNumber: initialData?.busNumber || "",
    capacity: initialData?.capacity || 0,
    driver: initialData?.driver || "",
    route: initialData?.route || "",
    status: initialData?.status || "Active",
  })

  const [errors, setErrors] = useState<BusFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: BusFormErrors = {}

    if (!formData.busNumber.trim()) {
      newErrors.busNumber = "Bus number is required"
    } else if (!/^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/.test(formData.busNumber)) {
      newErrors.busNumber = "Invalid format. Use: XX-XX-XX-XXXX (e.g., KA-01-AB-1234)"
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0"
    } else if (formData.capacity > 100) {
      newErrors.capacity = "Capacity cannot exceed 100"
    }

    if (!formData.driver) {
      newErrors.driver = "Driver selection is required"
    }

    if (!formData.route) {
      newErrors.route = "Route selection is required"
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
        title: isEdit ? "Bus Updated" : "Bus Added",
        description: `Bus ${formData.busNumber} has been ${isEdit ? "updated" : "added"} successfully.`,
      })

      if (!isEdit) {
        setFormData({
          busNumber: "",
          capacity: 0,
          driver: "",
          route: "",
          status: "Active",
        })
        setErrors({})
      }
    }
  }

  const handleInputChange = (field: keyof BusFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const activeDrivers = drivers.filter((driver) => driver.status === "Active")
  const activeRoutes = routes.filter((route) => route.status === "Active")

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bus className="h-5 w-5" />
          {isEdit ? "Edit Bus" : "Add New Bus"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update bus information and assignments"
            : "Enter bus details and assign driver and route"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bus Number */}
          <div className="space-y-2">
            <Label htmlFor="busNumber">
              Bus Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="busNumber"
              placeholder="e.g., KA-01-AB-1234"
              value={formData.busNumber}
              onChange={(e) => handleInputChange("busNumber", e.target.value.toUpperCase())}
              className={errors.busNumber ? "border-red-500" : ""}
            />
            {errors.busNumber && <p className="text-sm text-red-500">{errors.busNumber}</p>}
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">
              Seating Capacity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g., 50"
              min="1"
              max="100"
              value={formData.capacity || ""}
              onChange={(e) =>
                handleInputChange("capacity", Number.parseInt(e.target.value) || 0)
              }
              className={errors.capacity ? "border-red-500" : ""}
            />
            {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
          </div>

          {/* Driver */}
          <div className="space-y-2">
            <Label htmlFor="driver">
              Assigned Driver <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.driver}
              onValueChange={(value) => handleInputChange("driver", value)}
            >
              <SelectTrigger id="driver" className={errors.driver ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {activeDrivers.length > 0 ? (
                  activeDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.name}>
                      {driver.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No active drivers available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.driver && <p className="text-sm text-red-500">{errors.driver}</p>}
          </div>

          {/* Route */}
          <div className="space-y-2">
            <Label htmlFor="route">
              Assigned Route <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.route}
              onValueChange={(value) => handleInputChange("route", value)}
            >
              <SelectTrigger id="route" className={errors.route ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a route" />
              </SelectTrigger>
              <SelectContent>
                {activeRoutes.length > 0 ? (
                  activeRoutes.map((route) => (
                    <SelectItem key={route.id} value={route.name}>
                      {route.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No active routes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.route && <p className="text-sm text-red-500">{errors.route}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Active" | "Inactive" | "Maintenance") =>
                handleInputChange("status", value)
              }
            >
              <SelectTrigger id="status" className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Bus" : "Add Bus"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
