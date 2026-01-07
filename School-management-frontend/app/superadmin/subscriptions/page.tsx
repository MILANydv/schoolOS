"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Calendar, DollarSign, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CRUDTable } from "@/components/table/crud-table"
import { MOCK_SUBSCRIPTIONS, MOCK_SCHOOLS } from "@/lib/constants"
import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { FormDatePicker } from "@/components/forms/form-date-picker"
import { toast } from "@/hooks/use-toast"

type Subscription = (typeof MOCK_SUBSCRIPTIONS)[number]

interface AddEditSubscriptionFormProps {
  initialData?: Subscription
  onSubmit: (data: Subscription) => void
  onCancel: () => void
}

function AddEditSubscriptionForm({ initialData, onSubmit, onCancel }: AddEditSubscriptionFormProps) {
  const [schoolId, setSchoolId] = React.useState(initialData?.schoolName || "")
  const [plan, setPlan] = React.useState(initialData?.plan || "Basic")
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    initialData?.startDate ? new Date(initialData.startDate) : undefined,
  )
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    initialData?.endDate ? new Date(initialData.endDate) : undefined,
  )
  const [status, setStatus] = React.useState(initialData?.status || "Active")
  const [price, setPrice] = React.useState(initialData?.price || 0)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const schoolOptions = MOCK_SCHOOLS.map((school) => ({
    value: school.name,
    label: school.name,
  }))

  const planOptions = [
    { value: "Basic", label: "Basic - $99/year" },
    { value: "Standard", label: "Standard - $199/year" },
    { value: "Premium", label: "Premium - $299/year" },
    { value: "Free", label: "Free - $0/year" },
  ]

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Expired", label: "Expired" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Pending", label: "Pending" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!schoolId) newErrors.schoolId = "School is required"
    if (!plan) newErrors.plan = "Plan is required"
    if (!startDate) newErrors.startDate = "Start date is required"
    if (!endDate) newErrors.endDate = "End date is required"
    if (startDate && endDate && startDate >= endDate) {
      newErrors.endDate = "End date must be after start date"
    }
    if (!status) newErrors.status = "Status is required"
    if (price < 0) newErrors.price = "Price cannot be negative"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    const newSubscription: Subscription = {
      id: initialData?.id || `sub${Date.now()}`,
      schoolName: schoolId,
      plan,
      startDate: startDate ? startDate.toISOString().split("T")[0] : "",
      endDate: endDate ? endDate.toISOString().split("T")[0] : "",
      status,
      price,
    }

    onSubmit(newSubscription)
    toast({
      title: initialData ? "Subscription Updated" : "Subscription Created",
      description: `Subscription for ${schoolId} has been ${initialData ? "updated" : "created"} successfully.`,
    })
  }

  // Auto-set price based on plan
  React.useEffect(() => {
    const planPrices = {
      Basic: 99,
      Standard: 199,
      Premium: 299,
      Free: 0,
    }
    setPrice(planPrices[plan as keyof typeof planPrices] || 0)
  }, [plan])

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <FormSelect
        id="schoolName"
        label="School"
        value={schoolId}
        onValueChange={setSchoolId}
        options={schoolOptions}
        placeholder="Select a school"
        required
        error={errors.schoolId}
      />
      <FormSelect
        id="plan"
        label="Subscription Plan"
        value={plan}
        onValueChange={setPlan}
        options={planOptions}
        required
        error={errors.plan}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormDatePicker
          id="startDate"
          label="Start Date"
          selectedDate={startDate}
          onSelectDate={setStartDate}
          required
          error={errors.startDate}
        />
        <FormDatePicker
          id="endDate"
          label="End Date"
          selectedDate={endDate}
          onSelectDate={setEndDate}
          required
          error={errors.endDate}
        />
      </div>
      <FormSelect
        id="status"
        label="Status"
        value={status}
        onValueChange={setStatus}
        options={statusOptions}
        required
        error={errors.status}
      />
      <FormInput
        id="price"
        label="Price (USD)"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
        error={errors.price}
      />
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Save Changes" : "Add Subscription"}</Button>
      </div>
    </form>
  )
}

function getStatusBadge(status: string) {
  const variants = {
    Active: "default",
    Expired: "destructive",
    Cancelled: "secondary",
    Pending: "outline",
  } as const

  return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
}

function getPlanBadge(plan: string) {
  const variants = {
    Free: "secondary",
    Basic: "outline",
    Standard: "default",
    Premium: "default",
  } as const

  const colors = {
    Free: "bg-gray-100 text-gray-800",
    Basic: "bg-blue-100 text-blue-800",
    Standard: "bg-green-100 text-green-800",
    Premium: "bg-purple-100 text-purple-800",
  } as const

  return (
    <Badge
      variant={variants[plan as keyof typeof variants] || "default"}
      className={colors[plan as keyof typeof colors]}
    >
      {plan}
    </Badge>
  )
}

export default function SuperAdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>(MOCK_SUBSCRIPTIONS)
  const [selectedSubscription, setSelectedSubscription] = React.useState<Subscription | null>(null)

  const handleAddSubscription = (newSubscription: Subscription) => {
    setSubscriptions((prev) => [...prev, newSubscription])
    setSelectedSubscription(null)
  }

  const handleEditSubscription = (updatedSubscription: Subscription) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === updatedSubscription.id ? updatedSubscription : s)))
    setSelectedSubscription(null)
  }

  const handleDeleteSubscriptions = (ids: string[]) => {
    setSubscriptions((prev) => prev.filter((s) => !ids.includes(s.id)))
    toast({
      title: "Subscriptions Deleted",
      description: `${ids.length} subscription(s) have been deleted successfully.`,
    })
  }

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalSubscriptions = subscriptions.length
    const activeSubscriptions = subscriptions.filter((s) => s.status === "Active").length
    const totalRevenue = subscriptions.reduce((sum, s) => sum + s.price, 0)
    const averagePrice = totalSubscriptions > 0 ? totalRevenue / totalSubscriptions : 0

    return {
      totalSubscriptions,
      activeSubscriptions,
      totalRevenue,
      averagePrice,
    }
  }, [subscriptions])

  const columns: ColumnDef<Subscription>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "schoolName",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          School Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("schoolName")}</div>,
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => getPlanBadge(row.getValue("plan")),
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("startDate") as string).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("endDate") as string).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">${(row.getValue("price") as number).toLocaleString()}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const subscription = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(subscription.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedSubscription(subscription)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the subscription for{" "}
                      {subscription.schoolName}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteSubscriptions([subscription.id])}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">Manage school subscriptions, plans, and billing information</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">{stats.activeSubscriptions} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeSubscriptions / stats.totalSubscriptions) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Annual subscription revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averagePrice.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Per subscription</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>
            A comprehensive list of all school subscriptions with their details and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CRUDTable
            columns={columns}
            data={subscriptions}
            filterColumn="schoolName"
            onAdd={() => setSelectedSubscription({} as Subscription)}
            onEdit={handleEditSubscription}
            onDelete={handleDeleteSubscriptions}
            addForm={
              <AddEditSubscriptionForm
                onSubmit={handleAddSubscription}
                onCancel={() => setSelectedSubscription(null)}
              />
            }
            editForm={
              <AddEditSubscriptionForm
                initialData={selectedSubscription || undefined}
                onSubmit={handleEditSubscription}
                onCancel={() => setSelectedSubscription(null)}
              />
            }
            addFormTitle="Add New Subscription"
            addFormDescription="Create a new subscription for a school with plan details and billing information."
            editFormTitle="Edit Subscription"
            editFormDescription="Update the subscription details, plan, or billing information."
            selectedItem={selectedSubscription}
          />
        </CardContent>
      </Card>
    </div>
  )
}
