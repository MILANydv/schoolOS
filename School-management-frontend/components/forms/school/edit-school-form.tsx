"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { School, Mail, MapPin, Settings } from "lucide-react"

interface EditSchoolFormProps {
  school: any
  onSuccess: () => void
}

export default function EditSchoolForm({ school, onSuccess }: EditSchoolFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    schoolName: school.name || "",
    adminEmail: "admin@" + school.name.toLowerCase().replace(/\s+/g, "") + ".edu",
    adminName: "Dr. Admin",
    phone: "+1 (555) 123-4567",
    address: "123 Education Street",
    city: "Learning City",
    state: "CA",
    zipCode: "12345",
    subscriptionPlan: school.plan.toLowerCase() || "standard",
    description: "A leading educational institution focused on excellence.",
    isActive: true,
    maxUsers: school.users + 50,
    features: {
      analytics: true,
      messaging: true,
      reports: school.plan === "Premium",
      api: school.plan === "Premium",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("School updated:", formData)
    setIsLoading(false)
    onSuccess()
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureChange = (feature: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: { ...prev.features, [feature]: value },
    }))
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxUsers">Maximum Users</Label>
            <Input
              id="maxUsers"
              type="number"
              value={formData.maxUsers}
              onChange={(e) => handleInputChange("maxUsers", e.target.value)}
              placeholder="Maximum number of users"
            />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive">School is Active</Label>
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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="City name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="State"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      {/* Features & Permissions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Features & Permissions
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="analytics"
              checked={formData.features.analytics}
              onCheckedChange={(checked) => handleFeatureChange("analytics", checked)}
            />
            <Label htmlFor="analytics">Analytics Dashboard</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="messaging"
              checked={formData.features.messaging}
              onCheckedChange={(checked) => handleFeatureChange("messaging", checked)}
            />
            <Label htmlFor="messaging">Messaging System</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="reports"
              checked={formData.features.reports}
              onCheckedChange={(checked) => handleFeatureChange("reports", checked)}
            />
            <Label htmlFor="reports">Advanced Reports</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="api"
              checked={formData.features.api}
              onCheckedChange={(checked) => handleFeatureChange("api", checked)}
            />
            <Label htmlFor="api">API Access</Label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Updating School..." : "Update School"}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
