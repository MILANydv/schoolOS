"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, Download, Search, Users, UserCheck, UserX, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { CRUDTable } from "@/components/table/crud-table"
import { MOCK_USERS, MOCK_SCHOOLS } from "@/lib/constants"
import { AddUserForm } from "@/components/forms/add-user-form"

type User = (typeof MOCK_USERS)[number]

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  suspended: "bg-gray-100 text-gray-800 border-gray-200",
}

const roleColors = {
  super_admin: "bg-purple-100 text-purple-800 border-purple-200",
  school_admin: "bg-blue-100 text-blue-800 border-blue-200",
  teacher: "bg-green-100 text-green-800 border-green-200",
  student: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function SuperAdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>(MOCK_USERS)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<string[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [schoolFilter, setSchoolFilter] = React.useState<string>("all")
  const { toast } = useToast()

  // Filter users based on search and filters
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      const matchesSchool = schoolFilter === "all" || user.schoolId === schoolFilter

      return matchesSearch && matchesRole && matchesStatus && matchesSchool
    })
  }, [users, searchTerm, roleFilter, statusFilter, schoolFilter])

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.status === "active").length
    const inactive = users.filter((u) => u.status === "inactive").length
    const admins = users.filter((u) => u.role === "SUPER_ADMIN" || u.role === "SCHOOL_ADMIN").length

    return { total, active, inactive, admins }
  }, [users])

  const handleAddUser = (newUser: User) => {
    const userWithId = { ...newUser, id: Date.now().toString() }
    setUsers((prev) => [...prev, userWithId])
    setIsAddDialogOpen(false)
    toast({
      title: "User Added",
      description: `${newUser.name} has been successfully added.`,
    })
  }

  const handleEditUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setIsEditDialogOpen(false)
    setSelectedUser(null)
    toast({
      title: "User Updated",
      description: `${updatedUser.name} has been successfully updated.`,
    })
  }

  const handleDeleteUsers = (ids: string[]) => {
    setUsers((prev) => prev.filter((u) => !ids.includes(u.id)))
    setDeleteDialogOpen(false)
    setUserToDelete([])
    toast({
      title: "Users Deleted",
      description: `${ids.length} user(s) have been successfully deleted.`,
      variant: "destructive",
    })
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus as any } : u)))
    const user = users.find((u) => u.id === userId)
    toast({
      title: "Status Updated",
      description: `${user?.name}'s status has been changed to ${newStatus}.`,
    })
  }

  const handleBulkStatusChange = (selectedIds: string[], newStatus: string) => {
    setUsers((prev) => prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: newStatus as any } : u)))
    toast({
      title: "Bulk Status Update",
      description: `${selectedIds.length} user(s) status changed to ${newStatus}.`,
    })
  }

  const exportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Role", "School", "Status", "Last Login"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.role.replace(/_/g, " "),
        MOCK_SCHOOLS.find((s) => s.id === user.schoolId)?.name || "N/A",
        user.status,
        new Date(user.lastLogin).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Users data has been exported to CSV.",
    })
  }

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {row.getValue<string>("name").charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as keyof typeof roleColors
        return (
          <Badge variant="outline" className={roleColors[role]}>
            {String(role).replace(/_/g, " ")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "schoolId",
      header: "School",
      cell: ({ row }) => {
        const schoolId = row.getValue("schoolId") as string | null
        const school = MOCK_SCHOOLS.find((s) => s.id === schoolId)
        return <div className="text-sm">{school ? school.name : "N/A"}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => {
        const lastLogin = row.getValue("lastLogin") as string
        return <div className="text-sm text-muted-foreground">{new Date(lastLogin).toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy User ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setIsEditDialogOpen(true)
                }}
              >
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")}
              >
                {user.status === "active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>Suspend User</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setUserToDelete([user.id])
                  setDeleteDialogOpen(true)
                }}
              >
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all users across the platform</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account with the specified details.</DialogDescription>
              </DialogHeader>
              <AddUserForm onSubmit={handleAddUser} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="school_admin">School Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {MOCK_SCHOOLS.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <CRUDTable
            columns={columns}
            data={filteredUsers}
            filterColumn=""
            // onAdd={() => setIsAddDialogOpen(true)}
            onEdit={handleEditUser}
            onDelete={handleDeleteUsers}
            addForm={null}
            editForm={null}
            addFormTitle=""
            addFormDescription=""
            editFormTitle=""
            editFormDescription=""
            selectedItem={null}
            bulkActions={
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        const selectedIds = Object.keys({}).filter((id) => true) // This would be from table selection
                        handleBulkStatusChange(selectedIds, "active")
                      }}
                    >
                      Activate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const selectedIds = Object.keys({}).filter((id) => true)
                        handleBulkStatusChange(selectedIds, "inactive")
                      }}
                    >
                      Deactivate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const selectedIds = Object.keys({}).filter((id) => true)
                        handleBulkStatusChange(selectedIds, "suspended")
                      }}
                    >
                      Suspend Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        const selectedIds = Object.keys({}).filter((id) => true)
                        setUserToDelete(selectedIds)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user's information and settings.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <AddUserForm
              initialData={selectedUser}
              onSubmit={handleEditUser}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedUser(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {userToDelete.length} user(s) and remove their
              data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete([])}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteUsers(userToDelete)} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
