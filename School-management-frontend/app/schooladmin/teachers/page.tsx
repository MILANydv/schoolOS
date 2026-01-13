'use client'

import * as React from 'react'
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  Mail,
  Phone,
  UserCheck,
  XCircle,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EnhancedTable, TableColumn, TableFilter, TableAction } from '@/components/table/enhanced-table'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  qualification?: string
  department?: string
  joiningDate?: string
  status: string
  subjects?: string[]
  classTeacher?: string
}

export default function SchoolAdminTeachersPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // React Query hooks
  const { data: teachersData, isLoading, refetch } = useTeachers()
  const createTeacherMutation = useCreateTeacher()
  const updateTeacherMutation = useUpdateTeacher()
  const deleteTeacherMutation = useDeleteTeacher()

  const teachers = teachersData?.data || []

  // UI State
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [showEditDialog, setShowEditDialog] = React.useState(false)
  const [selectedTeacher, setSelectedTeacher] = React.useState<any>(null)
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    qualification: '',
    department: '',
    joiningDate: '',
    status: 'active',
  })

  // Filter teachers
  const filteredTeachers = React.useMemo(() => {
    return teachers.filter((teacher: any) => {
      const matchesSearch = !searchQuery || 
        teacher.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [teachers, searchQuery, statusFilter])

  // Handle create teacher
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTeacherMutation.mutateAsync(formData)
      setShowAddDialog(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        qualification: '',
        department: '',
        joiningDate: '',
        status: 'active',
      })
      toast({ title: 'Teacher created successfully' })
    } catch (error) {
      toast({
        title: 'Failed to create teacher',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    }
  }

  // Handle update teacher
  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeacher) return
    
    try {
      await updateTeacherMutation.mutateAsync({
        id: selectedTeacher.id,
        data: formData,
      })
      setShowEditDialog(false)
      setSelectedTeacher(null)
      toast({ title: 'Teacher updated successfully' })
    } catch (error) {
      toast({
        title: 'Failed to update teacher',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    }
  }

  // Handle delete teacher
  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return
    
    try {
      await deleteTeacherMutation.mutateAsync(id)
      toast({ title: 'Teacher deleted successfully' })
    } catch (error) {
      toast({
        title: 'Failed to delete teacher',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    }
  }

  // Open edit dialog
  const openEditDialog = (teacher: any) => {
    setSelectedTeacher(teacher)
    setFormData({
      firstName: teacher.firstName || '',
      lastName: teacher.lastName || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      qualification: teacher.qualification || '',
      department: teacher.department || '',
      joiningDate: teacher.joiningDate || '',
      status: teacher.status || 'active',
    })
    setShowEditDialog(true)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, label: 'Active' },
      inactive: { variant: 'secondary' as const, label: 'Inactive' },
      on_leave: { variant: 'outline' as const, label: 'On Leave' },
    }
    const config = variants[status as keyof typeof variants] || variants.active
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Define table columns
  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'department', header: 'Department' },
    { key: 'qualification', header: 'Qualification' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' },
  ]

  // Define table actions
  const actions: TableAction[] = [
    {
      label: 'View',
      icon: Eye,
      onClick: (row) => console.log('View teacher:', row.id),
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (row) => openEditDialog(row),
    },
    {
      label: 'Email',
      icon: Mail,
      onClick: (row) => window.open(`mailto:${row.email}`),
    },
    {
      label: 'Call',
      icon: Phone,
      onClick: (row) => window.open(`tel:${row.phone}`),
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (row) => handleDeleteTeacher(row.id),
      variant: 'destructive',
    },
  ]

  // Define filters
  const filters: TableFilter[] = [
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { value: 'all', label: 'All Departments' },
        { value: 'Mathematics', label: 'Mathematics' },
        { value: 'Science', label: 'Science' },
        { value: 'English', label: 'English' },
        { value: 'Social Studies', label: 'Social Studies' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'on_leave', label: 'On Leave' },
      ],
    },
  ]

  // Map data for enhanced table
  const tableData = {
    data: filteredTeachers.map((teacher: any) => ({
      id: teacher.id,
      name: `${teacher.firstName} ${teacher.lastName}`,
      email: teacher.email,
      phone: teacher.phone || 'N/A',
      department: teacher.department || 'N/A',
      qualification: teacher.qualification || 'N/A',
      status: getStatusBadge(teacher.status),
    })),
    total: filteredTeachers.length,
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Management</h1>
          <p className="text-muted-foreground">Manage faculty and teaching staff</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.filter((t: any) => t.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {teachers.length > 0 
                ? Math.round((teachers.filter((t: any) => t.status === 'active').length / teachers.length) * 100)
                : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.filter((t: any) => t.status === 'on_leave').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently unavailable</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(teachers.map((t: any) => t.department).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">Active departments</p>
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
                placeholder="Search teachers by name, email, or department..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Members</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedTable
            columns={columns}
            data={tableData.data}
            pagination={{ total: tableData.total }}
            actions={actions}
            filters={filters}
            onRowClick={(row) => console.log('Row clicked:', row)}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Add Teacher Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>Fill in the details to register a new teacher.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTeacher} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Qualification</label>
                <Input
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Joining Date</label>
              <Input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTeacherMutation.isPending}>
                {createTeacherMutation.isPending ? 'Creating...' : 'Create Teacher'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>Update teacher details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTeacher} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Qualification</label>
                <Input
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Joining Date</label>
              <Input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateTeacherMutation.isPending}>
                {updateTeacherMutation.isPending ? 'Updating...' : 'Update Teacher'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}