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
  const [principal, setPrincipal] = React.useState(initialData?.principal || "")
  const [status, setStatus] = React.useState(initialData?.status || "Active")
  const [subscription, setSubscription] = React.useState(initialData?.subscription || "Basic")
  const [establishedDate, setEstablishedDate] = React.useState<Date | undefined>(
    initialData?.established ? new Date(initialData.established) : undefined,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSchool = {
      id: initialData?.id || `sch${Date.now()}`,
      name,
      address,
      phone,
      email,
      principal,
      status,
      subscription,
      established: establishedDate ? establishedDate.toISOString().split("T")[0] : "",
      students: initialData?.students || 0,
      teachers: initialData?.teachers || 0,
    }
    onSubmit(newSchool)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-3xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit School" : "Add New School"}</CardTitle>
        <CardDescription>Fill out the form below to {initialData ? "update" : "create"} a school.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="name"
            label="School Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormInput
            id="address"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
              { value: "Trial", label: "Trial" },
              { value: "Pending", label: "Pending" },
            ]}
          />
          <FormSelect
            id="subscription"
            label="Subscription Plan"
            value={subscription}
            onValueChange={setSubscription}
            options={[
              { value: "Basic", label: "Basic" },
              { value: "Standard", label: "Standard" },
              { value: "Premium", label: "Premium" },
              { value: "Free", label: "Free" },
            ]}
          />
          <FormDatePicker
            id="establishedDate"
            label="Established Date"
            selectedDate={establishedDate}
            onSelectDate={setEstablishedDate}
          />
          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Add School"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
