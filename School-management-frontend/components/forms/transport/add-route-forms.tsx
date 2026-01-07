"use client"

import type React from "react"
import { useState } from "react"
import {
  RouteIcon,
  Save,
  X,
  MapPin,
  DollarSign,
  Users
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface RouteFormData {
  name: string
  stops: string
  distance: string
  fee: number
  students: number
  status: "Active" | "Inactive"
}

type RouteFormErrors = {
  [K in keyof RouteFormData]?: string
}

interface AddRouteFormProps {
  onSubmit: (data: RouteFormData) => void
  onCancel?: () => void
  initialData?: Partial<RouteFormData>
  isEdit?: boolean
}

export function AddRouteForm({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false
}: AddRouteFormProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState<RouteFormData>({
    name: initialData?.name || "",
    stops: initialData?.stops || "",
    distance: initialData?.distance || "",
    fee: initialData?.fee || 0,
    students: initialData?.students || 0,
    status: initialData?.status || "Active"
  })

  const [errors, setErrors] = useState<RouteFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: RouteFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Route name is required"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Route name must be at least 3 characters"
    }

    if (!formData.stops.trim()) {
      newErrors.stops = "Route stops are required"
    } else if (!formData.stops.includes("→")) {
      newErrors.stops = "Please separate stops with → symbol"
    } else if (formData.stops.split("→").length < 3) {
      newErrors.stops = "Route must have at least 3 stops"
    }

    if (!formData.distance.trim()) {
      newErrors.distance = "Distance is required"
    } else if (!/^\d+(\.\d+)?\s*km$/i.test(formData.distance.trim())) {
      newErrors.distance = "Invalid format. Use: XX km or XX.X km"
    }

    if (!formData.fee || formData.fee <= 0) {
      newErrors.fee = "Annual fee must be greater than 0"
    } else if (formData.fee < 1000) {
      newErrors.fee = "Annual fee must be at least ₹1,000"
    } else if (formData.fee > 50000) {
      newErrors.fee = "Annual fee cannot exceed ₹50,000"
    }

    if (formData.students < 0) {
      newErrors.students = "Number of students cannot be negative"
    } else if (formData.students > 100) {
      newErrors.students = "Number of students cannot exceed 100"
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
        title: isEdit ? "Route Updated" : "Route Added",
        description: `${formData.name} has been ${isEdit ? "updated" : "added"} successfully.`
      })

      if (!isEdit) {
        setFormData({
          name: "",
          stops: "",
          distance: "",
          fee: 0,
          students: 0,
          status: "Active"
        })
        setErrors({})
      }
    }
  }

  const handleInputChange = (field: keyof RouteFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const formatDistance = (value: string) => {
    const cleaned = value.replace(/\s*km\s*/gi, "").trim()
    if (cleaned && /^\d+(\.\d+)?$/.test(cleaned)) {
      return `${cleaned} km`
    }
    return value
  }

  const addStopSeparator = (value: string) => {
    return value.replace(/\s*->\s*/g, " → ")
  }

  const suggestedStops = [
    "Main Gate",
    "Bus Stand",
    "Railway Station",
    "City Center",
    "Market",
    "Hospital",
    "Temple",
    "Park Street",
    "Mall Road",
    "College",
    "Library",
    "School"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <RouteIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{isEdit ? "Edit Route" : "Add New Route"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Route Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            placeholder="e.g., Route A, North Route, City Center Route"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Stops */}
        <div className="space-y-2">
          <Label htmlFor="stops">
            <MapPin className="h-4 w-4 inline mr-1" />
            Route Stops <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="stops"
            placeholder="e.g., Main Gate → Bus Stand → Market → Hospital → School"
            value={formData.stops}
            onChange={(e) => handleInputChange("stops", addStopSeparator(e.target.value))}
            className={errors.stops ? "border-red-500" : ""}
            rows={3}
          />
          {errors.stops && <p className="text-sm text-red-500">{errors.stops}</p>}
          <div className="text-sm text-muted-foreground">
            <p>Separate stops with → symbol. Suggested stops:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {suggestedStops.map((stop) => (
                <button
                  key={stop}
                  type="button"
                  onClick={() => {
                    const current = formData.stops.trim()
                    const newStops = current ? `${current} → ${stop}` : stop
                    handleInputChange("stops", newStops)
                  }}
                  className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded"
                >
                  {stop}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="space-y-2">
          <Label htmlFor="distance">Total Distance <span className="text-red-500">*</span></Label>
          <Input
            id="distance"
            placeholder="e.g., 15 km"
            value={formData.distance}
            onChange={(e) => handleInputChange("distance", formatDistance(e.target.value))}
            className={errors.distance ? "border-red-500" : ""}
          />
          {errors.distance && <p className="text-sm text-red-500">{errors.distance}</p>}
        </div>

        {/* Fee */}
        <div className="space-y-2">
          <Label htmlFor="fee">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Annual Fee (₹) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fee"
            type="number"
            placeholder="e.g., 12000"
            min={1000}
            max={50000}
            step={100}
            value={formData.fee || ""}
            onChange={(e) => handleInputChange("fee", Number.parseInt(e.target.value) || 0)}
            className={errors.fee ? "border-red-500" : ""}
          />
          {errors.fee && <p className="text-sm text-red-500">{errors.fee}</p>}
        </div>

        {/* Students */}
        <div className="space-y-2">
          <Label htmlFor="students">
            <Users className="h-4 w-4 inline mr-1" />
            Current Students
          </Label>
          <Input
            id="students"
            type="number"
            placeholder="e.g., 35"
            min={0}
            max={100}
            value={formData.students || ""}
            onChange={(e) => handleInputChange("students", Number.parseInt(e.target.value) || 0)}
            className={errors.students ? "border-red-500" : ""}
          />
          {errors.students && <p className="text-sm text-red-500">{errors.students}</p>}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
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

        {/* Summary */}
        {formData.name && formData.distance && formData.fee > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Route Summary</h4>
            <div className="text-sm space-y-1">
              <p><strong>Route:</strong> {formData.name}</p>
              <p><strong>Distance:</strong> {formData.distance}</p>
              <p><strong>Annual Fee:</strong> ₹{formData.fee.toLocaleString()}</p>
              <p><strong>Monthly Fee:</strong> ₹{Math.round(formData.fee / 12).toLocaleString()}</p>
              {formData.students > 0 && (
                <p><strong>Current Students:</strong> {formData.students}</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? "Update Route" : "Add Route"}
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
