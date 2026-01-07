"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Send,
  Archive,
  Trash2,
  Copy,
  Calendar,
  MessageSquare,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Bold,
  Italic,
  List,
  Link,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MOCK_NOTIFICATIONS } from "@/lib/constants"

type Announcement = (typeof MOCK_NOTIFICATIONS)[number]

// Status Badge Component
interface StatusBadgeProps {
  status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 hover:bg-green-100",
        }
      case "draft":
        return {
          variant: "secondary" as const,
          icon: Clock,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        }
      case "archived":
        return {
          variant: "outline" as const,
          icon: Archive,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        }
      default:
        return {
          variant: "secondary" as const,
          icon: Clock,
          className: "",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

// Rich Text Editor Component
interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

function RichTextEditor({ value, onChange, placeholder, rows = 5 }: RichTextEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 border rounded-t-md bg-muted/50">
        <Button type="button" variant="ghost" size="sm" onClick={() => insertText("**", "**")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertText("*", "*")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertText("- ")} className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText("[", "](url)")}
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-t-none"
      />
    </div>
  )
}

// Form Input Component
interface FormInputProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string
  placeholder?: string
}

function FormInput({ id, label, value, onChange, required, type = "text", placeholder }: FormInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} />
    </div>
  )
}

// Form Select Component
interface FormSelectProps {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  required?: boolean
  placeholder?: string
}

function FormSelect({ id, label, value, onValueChange, options, required, placeholder }: FormSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Confirmation Dialog Component
interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Add/Edit Form Component
interface AddEditAnnouncementFormProps {
  initialData?: Announcement
  onSubmit: (data: Announcement) => void
  onCancel: () => void
}

function AddEditAnnouncementForm({ initialData, onSubmit, onCancel }: AddEditAnnouncementFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || "")
  const [message, setMessage] = React.useState(initialData?.message || "")
  const [status, setStatus] = React.useState(initialData?.status || "Draft")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const statusOptions = [
    { value: "Draft", label: "Draft" },
    { value: "Sent", label: "Sent" },
    { value: "Archived", label: "Archived" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newAnnouncement: Announcement = {
        id: initialData?.id || `ann${Date.now()}`,
        title,
        message,
        date: initialData?.date || new Date().toISOString().split("T")[0],
        status,
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSubmit(newAnnouncement)
      toast({
        title: initialData ? "Announcement updated" : "Announcement created",
        description: `The announcement "${title}" has been ${initialData ? "updated" : "created"} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    toast({
      title: "Preview",
      description: "Preview functionality would open in a new dialog.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
      <div className="grid gap-4">
        <FormInput
          id="title"
          label="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a clear, descriptive title"
          required
        />

        <div className="grid gap-2">
          <Label htmlFor="message">Message Content</Label>
          <RichTextEditor
            value={message}
            onChange={setMessage}
            placeholder="Write your announcement message here. You can use markdown formatting."
            rows={6}
          />
          <p className="text-sm text-muted-foreground">
            Supports basic markdown formatting (bold, italic, lists, links)
          </p>
        </div>

        <FormSelect
          id="status"
          label="Status"
          value={status}
          onValueChange={setStatus}
          options={statusOptions}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {initialData ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>{initialData ? "Save Changes" : "Create Announcement"}</>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

// Main Component
export default function SuperAdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>(MOCK_NOTIFICATIONS)
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState<Announcement | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<{
    open: boolean
    ids: string[]
    titles: string[]
  }>({ open: false, ids: [], titles: [] })
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const { toast } = useToast()

  // Table setup
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev])
    setSelectedAnnouncement(null)
    setAddDialogOpen(false)
  }

  const handleEditAnnouncement = (updatedAnnouncement: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === updatedAnnouncement.id ? updatedAnnouncement : a)))
    setSelectedAnnouncement(null)
    setEditDialogOpen(false)
  }

  const handleDeleteAnnouncements = (ids: string[]) => {
    const titles = announcements.filter((a) => ids.includes(a.id)).map((a) => a.title)
    setDeleteConfirmation({ open: true, ids, titles })
  }

  const confirmDelete = () => {
    setAnnouncements((prev) => prev.filter((a) => !deleteConfirmation.ids.includes(a.id)))
    toast({
      title: "Announcements deleted",
      description: `${deleteConfirmation.ids.length} announcement(s) have been deleted.`,
    })
    setDeleteConfirmation({ open: false, ids: [], titles: [] })
    setRowSelection({})
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
    toast({
      title: "Status updated",
      description: `Announcement status changed to ${newStatus}.`,
    })
  }

  const getStats = () => {
    const total = announcements.length
    const sent = announcements.filter((a) => a.status === "Sent").length
    const draft = announcements.filter((a) => a.status === "Draft").length
    const archived = announcements.filter((a) => a.status === "Archived").length
    return { total, sent, draft, archived }
  }

  const stats = getStats()

  // Filter data based on global search
  const filteredData = React.useMemo(() => {
    if (!globalFilter) return announcements
    return announcements.filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        announcement.message.toLowerCase().includes(globalFilter.toLowerCase()) ||
        announcement.status.toLowerCase().includes(globalFilter.toLowerCase()),
    )
  }, [announcements, globalFilter])

  const columns: ColumnDef<Announcement>[] = [
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
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <div className="font-medium truncate">{row.getValue("title")}</div>
          <div className="text-sm text-muted-foreground truncate">
            {(row.original as Announcement).message.substring(0, 60)}...
          </div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <Calendar className="mr-2 h-4 w-4" />
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date") as string)
        return (
          <div className="flex flex-col">
            <span className="font-medium">{date.toLocaleDateString()}</span>
            <span className="text-sm text-muted-foreground">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const announcement = row.original as Announcement

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(announcement.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAnnouncement(announcement)
                  setEditDialogOpen(true)
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {announcement.status === "Draft" && (
                <DropdownMenuItem onClick={() => handleStatusChange(announcement.id, "Sent")}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </DropdownMenuItem>
              )}
              {announcement.status === "Sent" && (
                <DropdownMenuItem onClick={() => handleStatusChange(announcement.id, "Archived")}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteAnnouncements([announcement.id])}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(() => {
    if (selectedAnnouncement && Object.keys(selectedAnnouncement).length > 0 && !editDialogOpen) {
      setEditDialogOpen(true)
    }
  }, [selectedAnnouncement, editDialogOpen])

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelection = selectedRows.length > 0

  const handleBulkDelete = () => {
    const ids = selectedRows.map((row) => (row.original as any).id)
    handleDeleteAnnouncements(ids)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Create and manage system-wide announcements for all schools and users.
          </p>
        </div>

        {/* Search Filter at Top */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-1 items-center space-x-4 w-full lg:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search announcements by title, message, or status..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
                {hasSelection && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete ({selectedRows.length})
                  </Button>
                )}
              </div>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedAnnouncement({} as Announcement)
                      setAddDialogOpen(true)
                    }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Announcement</DialogTitle>
                    <DialogDescription>
                      Compose a new announcement that will be visible to all schools and users.
                    </DialogDescription>
                  </DialogHeader>
                  <AddEditAnnouncementForm
                    onSubmit={handleAddAnnouncement}
                    onCancel={() => {
                      setSelectedAnnouncement(null)
                      setAddDialogOpen(false)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <Send className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <MessageSquare className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
              <Archive className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <div className="w-full space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        {globalFilter ? "No announcements match your search." : "No announcements found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {hasSelection && (
                  <span>
                    {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                  </span>
                )}
                {globalFilter && (
                  <span className="ml-2">
                    Showing {filteredData.length} of {announcements.length} announcements
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update the details for this announcement.</DialogDescription>
          </DialogHeader>
          <AddEditAnnouncementForm
            initialData={selectedAnnouncement || undefined}
            onSubmit={handleEditAnnouncement}
            onCancel={() => {
              setSelectedAnnouncement(null)
              setEditDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmation.open}
        onOpenChange={(open) => setDeleteConfirmation((prev) => ({ ...prev, open }))}
        title="Delete Announcements"
        description={
          deleteConfirmation.ids.length === 1
            ? `Are you sure you want to delete "${deleteConfirmation.titles[0]}"? This action cannot be undone.`
            : `Are you sure you want to delete ${deleteConfirmation.ids.length} announcements? This action cannot be undone.`
        }
        onConfirm={confirmDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}
