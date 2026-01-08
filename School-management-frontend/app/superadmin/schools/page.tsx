"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, RefreshCw, Search, Eye, Edit, Trash2, MoreHorizontal, CheckCircle, AlertCircle, Clock, School as SchoolIcon, Users, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddSchoolForm } from "@/components/forms/add-school-form"
import { useSchools, useCreateSchool, useUpdateSchool, useDeleteSchool } from "@/hooks"
import { Skeleton } from "@/components/ui/skeleton"

export default function SchoolsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [showEditDialog, setShowEditDialog] = React.useState(false)
  const [selectedSchool, setSelectedSchool] = React.useState<any | null>(null)

  // Fetch schools
  const { data: schoolsData, isLoading, refetch } = useSchools({ status: statusFilter !== "all" ? statusFilter : undefined })
  const createSchool = useCreateSchool()
  const updateSchool = useUpdateSchool()
  const deleteSchool = useDeleteSchool()

  const schools = schoolsData?.data || []

  // Filter schools based on search
  const filteredSchools = React.useMemo(() => {
    if (!searchQuery) return schools
    
    return schools.filter((school: any) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        school.name?.toLowerCase().includes(searchLower) ||
        school.email?.toLowerCase().includes(searchLower) ||
        school.phone?.toLowerCase().includes(searchLower)
      )
    })
  }, [schools, searchQuery])

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalSchools = schools.length
    const activeSchools = schools.filter((s: any) => s.status === 'ACTIVE').length
    const totalStudents = schools.reduce((sum: number, school: any) => sum + (school._count?.students || 0), 0)
    const totalTeachers = schools.reduce((sum: number, school: any) => sum + (school._count?.teachers || 0), 0)

    return {
      totalSchools,
      activeSchools,
      totalStudents,
      totalTeachers,
    }
  }, [schools])

  const handleAddSchool = async (schoolData: any) => {
    try {
      await createSchool.mutateAsync(schoolData)
      setShowAddDialog(false)
    } catch (error) {
      console.error('Failed to create school:', error)
    }
  }

  const handleEditSchool = async (schoolData: any) => {
    if (!selectedSchool) return
    
    try {
      await updateSchool.mutateAsync({ id: selectedSchool.id, data: schoolData })
      setShowEditDialog(false)
      setSelectedSchool(null)
    } catch (error) {
      console.error('Failed to update school:', error)
    }
  }

  const handleDeleteSchool = async (id: string) => {
    if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      return
    }
    
    try {
      await deleteSchool.mutateAsync(id)
    } catch (error) {
      console.error('Failed to delete school:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: { variant: "default" as const, icon: CheckCircle, label: "Active" },
      INACTIVE: { variant: "secondary" as const, icon: AlertCircle, label: "Inactive" },
      PENDING: { variant: "outline" as const, icon: Clock, label: "Pending" },
    }
    const config = variants[status as keyof typeof variants] || variants.ACTIVE
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getSubscriptionBadge = (plan: string) => {
    const variants = {
      FREE: { variant: "secondary" as const, label: "Free" },
      BASIC: { variant: "outline" as const, label: "Basic" },
      STANDARD: { variant: "default" as const, label: "Standard" },
      PREMIUM: { variant: "destructive" as const, label: "Premium" },
    }
    const config = variants[plan as keyof typeof variants] || variants.FREE

    return (
      <Badge variant={config.variant} className="w-fit">
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Management</h1>
          <p className="text-muted-foreground">Manage all schools in the system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <SchoolIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">{stats.activeSchools} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSchools}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSchools > 0 ? ((stats.activeSchools / stats.totalSchools) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schools by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
          <CardDescription>
            {filteredSchools.length} school{filteredSchools.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-12">
              <SchoolIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No schools found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first school'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add School
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school: any) => {
                    const subscription = school.subscriptions?.[0]
                    return (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{school.name}</div>
                            <div className="text-sm text-muted-foreground">{school.address}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{school.email}</div>
                            <div className="text-muted-foreground">{school.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(school.status)}</TableCell>
                        <TableCell>
                          {subscription ? getSubscriptionBadge(subscription.plan) : <span className="text-muted-foreground text-sm">No subscription</span>}
                        </TableCell>
                        <TableCell>{school._count?.students || 0}</TableCell>
                        <TableCell>{school._count?.teachers || 0}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/superadmin/schools/${school.id}/stats`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSchool(school)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit School
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteSchool(school.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete School
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add School Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
            <DialogDescription>Fill in the details to register a new school in the system.</DialogDescription>
          </DialogHeader>
          <AddSchoolForm onSubmit={handleAddSchool} onCancel={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit School Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>Update the school details.</DialogDescription>
          </DialogHeader>
          <AddSchoolForm
            initialData={selectedSchool}
            onSubmit={handleEditSchool}
            onCancel={() => {
              setShowEditDialog(false)
              setSelectedSchool(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
