"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { FormDatePicker } from "@/components/forms/form-date-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { MOCK_SCHOOLS } from "@/lib/constants"

interface AddSchoolFormProps {
  initialData?: (typeof MOCK_SCHOOLS)[0]
  onSubmit: (data: (typeof MOCK_SCHOOLS)[0]) => void
  onCancel: () => void
}

export function AddSchoolForm({ initialData, onSubmit, onCancel }: AddSchoolFormProps) {
  const [name, setName] = React.useState(initialData?.name || "")
  const [address, setAddress] = React.useState(initialData?.address || "")
  const [phone, setPhone] = React.useState(initialData?.phone || "")
  const [email, setEmail] = React.useState(initialData?.email || "")
  const [website, setWebsite] = React.useState("")
  const [principal, setPrincipal] = React.useState(initialData?.principal || "")
  const [status, setStatus] = React.useState(initialData?.status || "Active")
  const [subscription, setSubscription] = React.useState(initialData?.subscription || "Basic")
  const [establishedDate, setEstablishedDate] = React.useState<Date | undefined>(
    initialData?.established ? new Date(initialData.established) : undefined,
  )
  
  // Admin fields (only for new schools)
  const [adminEmail, setAdminEmail] = React.useState("")
  const [adminPassword, setAdminPassword] = React.useState("")
  const [adminFirstName, setAdminFirstName] = React.useState("")
  const [adminLastName, setAdminLastName] = React.useState("")
  const [adminPhone, setAdminPhone] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const schoolData: any = {
      id: initialData?.id || `sch${Date.now()}`,
      name,
      address,
      phone,
      email,
      website,
      principal,
      status,
      subscription,
      established: establishedDate ? establishedDate.toISOString().split("T")[0] : "",
      students: initialData?.students || 0,
      teachers: initialData?.teachers || 0,
    }
    
    // Add admin data for new schools
    if (!initialData) {
      schoolData.adminEmail = adminEmail
      schoolData.adminPassword = adminPassword
      schoolData.adminFirstName = adminFirstName
      schoolData.adminLastName = adminLastName
      schoolData.adminPhone = adminPhone
    }
    
    onSubmit(schoolData)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-3xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit School" : "Add New School"}</CardTitle>
        <CardDescription>Fill out the form below to {initialData ? "update" : "create"} a school.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">School Information</h3>
          </div>
          <FormInput
            id="name"
            label="School Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormInput
            id="email"
            label="School Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            id="phone"
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <FormInput
            id="website"
            label="Website (Optional)"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <div className="md:col-span-2">
            <FormInput
              id="address"
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          {initialData && (
            <>
              <FormInput
                id="principal"
                label="Principal Name"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                required
              />
              <FormSelect
                id="status"
                label="Status"
                value={status}
                onValueChange={setStatus}
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                  { value: "PENDING", label: "Pending" },
                ]}
              />
            </>
          )}
          
          {!initialData && (
            <>
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold mb-4">School Admin Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create the first admin account for this school. This user will have full access to manage the school.
                </p>
              </div>
              <FormInput
                id="adminFirstName"
                label="Admin First Name"
                value={adminFirstName}
                onChange={(e) => setAdminFirstName(e.target.value)}
                required
              />
              <FormInput
                id="adminLastName"
                label="Admin Last Name"
                value={adminLastName}
                onChange={(e) => setAdminLastName(e.target.value)}
                required
              />
              <FormInput
                id="adminEmail"
                label="Admin Email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
              <FormInput
                id="adminPassword"
                label="Admin Password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
              <FormInput
                id="adminPhone"
                label="Admin Phone (Optional)"
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
              />
            </>
          )}
          
          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Create School"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
