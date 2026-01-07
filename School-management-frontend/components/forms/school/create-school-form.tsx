"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { School, Mail, MapPin } from "lucide-react"

interface CreateSchoolFormProps {
  onSuccess: () => void
}

export default function CreateSchoolForm({ onSuccess }: CreateSchoolFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    schoolName: "",
    adminEmail: "",
    adminName: "",
    phone: "",
    address: "",

    subscriptionPlan: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    onSuccess()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* School Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <School className="h-5 w-5" />
          School Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name *</Label>
            <Input
              id="schoolName"
              value={formData.schoolName}
              onChange={(e) => handleInputChange("schoolName", e.target.value)}
              placeholder="Enter school name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscriptionPlan">Subscription Plan *</Label>
            <Select
              value={formData.subscriptionPlan}
              onValueChange={(value) => handleInputChange("subscriptionPlan", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic - $99/month</SelectItem>
                <SelectItem value="standard">Standard - $199/month</SelectItem>
                <SelectItem value="premium">Premium - $299/month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Brief description about the school"
            rows={3}
          />
        </div>
      </div>

      {/* Admin Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Admin Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="adminName">Admin Name *</Label>
            <Input
              id="adminName"
              value={formData.adminName}
              onChange={(e) => handleInputChange("adminName", e.target.value)}
              placeholder="Enter admin full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email *</Label>
            <Input
              id="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleInputChange("adminEmail", e.target.value)}
              placeholder="admin@school.edu"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </h3>
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="123 School Street"
          />
        </div>

      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating School..." : "Create School"}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
