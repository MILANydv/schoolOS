"use client"

import * as React from "react"
import { MOCK_CLASSES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  Mail,
  Edit,
  Trash2,
  Plus,
  Download,
  BookOpen,
  FileText,
  Phone,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Star,
  Search,
  RefreshCw,
  X
} from "lucide-react"
import { format } from "date-fns"
import { EnhancedTable } from "@/components/table/enhanced-table"
import { useSchoolAdmin } from "@/hooks/useSchoolAdmin"
import { admissionsApi } from "@/lib/api"

interface Admission {
  id: string
  applicantName: string
  gradeApplyingFor: string
  applicationDate: string
  status: string
  contact: string
  notes?: string
  statusHistory?: { status: string; date: string; by: string; note?: string }[]
}

function exportToCSV(admissions: Admission[]) {
  const headers = ["Applicant Name", "Grade", "Date", "Status", "Contact", "Notes"]
  const rows = admissions.map(a => [a.applicantName, a.gradeApplyingFor, a.applicationDate, a.status, a.contact, a.notes || ""])
  const csv = [headers, ...rows].map(r => r.map(x => `"${x}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `admissions-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function SchoolAdminAdmissionsPage() {
  const {
    admissions: {
      // @ts-ignore - using store directly for now
      admissions,
      // @ts-ignore
      setAdmissions,
      // @ts-ignore
      addAdmission,
      // @ts-ignore
      updateAdmission,
      // @ts-ignore
      deleteAdmission
    }
  } = useSchoolAdmin()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [editingAdmission, setEditingAdmission] = React.useState<Admission | null>(null)
  const [detailModal, setDetailModal] = React.useState<Admission | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("")
  const [gradeFilter, setGradeFilter] = React.useState("")
  const [dateFilter, setDateFilter] = React.useState("")

  const { toast } = useToast()

  // Fetch admissions on mount
  React.useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setIsLoading(true)
        const response = await admissionsApi.getAll()
        if (response.success) {
          setAdmissions(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch admissions:", error)
        toast({ title: "Error", description: "Failed to load admissions", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdmissions()
  }, [setAdmissions, toast])

  // Analytics
  const total = admissions.length
  const pending = admissions.filter((a: Admission) => a.status === "Pending").length
  const approved = admissions.filter((a: Admission) => a.status === "Approved").length
  const rejected = admissions.filter((a: Admission) => a.status === "Rejected").length
  const waitlisted = admissions.filter((a: Admission) => a.status === "Waitlisted").length
  const underReview = admissions.filter((a: Admission) => a.status === "Under Review").length

  // Filtered admissions based on filter bar
  const filteredAdmissions = React.useMemo(() => {
    return admissions.filter((admission: Admission) => {
      // Search filter
      const matchesSearch = !searchTerm ||
        admission.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admission.contact.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = !statusFilter || admission.status === statusFilter

      // Grade filter
      const matchesGrade = !gradeFilter || admission.gradeApplyingFor === gradeFilter

      // Date filter
      const matchesDate = !dateFilter || admission.applicationDate.startsWith(dateFilter)

      return matchesSearch && matchesStatus && matchesGrade && matchesDate
    })
  }, [admissions, searchTerm, statusFilter, gradeFilter, dateFilter])

  // Modal form state
  const [form, setForm] = React.useState<Partial<Admission>>({})
  const [formError, setFormError] = React.useState("")

  const openAddModal = () => {
    setEditingAdmission(null)
    setForm({})
    setModalOpen(true)
  }
  const openEditModal = (admission: Admission) => {
    setEditingAdmission(admission)
    setForm({ ...admission, applicationDate: admission.applicationDate.split('T')[0] })
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setFormError("")
  }
  const handleFormChange = (field: keyof Admission, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    setFormError("")
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.applicantName || !form.gradeApplyingFor || !form.applicationDate || !form.status || !form.contact) {
      setFormError("All fields are required.")
      return
    }

    try {
      if (editingAdmission) {
        const response = await admissionsApi.update(editingAdmission.id, form)
        if (response.success) {
          updateAdmission(editingAdmission.id, response.data)
          toast({ title: "Admission Updated", description: `${form.applicantName} updated.` })
        }
      } else {
        const response = await admissionsApi.create(form)
        if (response.success) {
          addAdmission(response.data)
          toast({ title: "Admission Added", description: `${form.applicantName} added.` })
        }
      }
      setModalOpen(false)
      setFormError("")
    } catch (error) {
      console.error("Failed to save admission:", error)
      setFormError("Failed to save admission. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await admissionsApi.delete(id)
      if (response.success) {
        deleteAdmission(id)
        toast({ title: "Admission Deleted", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to delete admission:", error)
      toast({ title: "Error", description: "Failed to delete admission", variant: "destructive" })
    }
  }

  // Bulk actions
  const handleBulkDelete = async () => {
    // Implement bulk delete API if available, otherwise loop
    // For now, just UI update as placeholder or loop delete
    // Ideally backend should support bulk delete

    // Optimistic update for now or loop
    for (const id of selectedIds) {
      await handleDelete(id)
    }
    setSelectedIds([])
    toast({ title: "Admissions Deleted", variant: "destructive" })
  }

  const handleBulkStatus = async (status: string) => {
    // Loop update for now
    for (const id of selectedIds) {
      try {
        const admission = admissions.find((a: Admission) => a.id === id)
        if (admission) {
          const response = await admissionsApi.update(id, { ...admission, status })
          if (response.success) {
            updateAdmission(id, response.data)
          }
        }
      } catch (error) {
        console.error(`Failed to update status for ${id}`, error)
      }
    }
    setSelectedIds([])
    toast({ title: `Admissions marked as ${status}` })
  }

  // Export
  const handleExport = () => exportToCSV(admissions)

  // Detailed view modal
  const openDetailModal = (admission: Admission) => setDetailModal(admission)
  const closeDetailModal = () => setDetailModal(null)

  return (
    <div className="w-full">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          {/* Main Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Side - Title and Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Admissions Management</h1>
              <p className="text-gray-600">Manage student applications, track status, and process admissions</p>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 font-semibold px-6 py-2 rounded-lg transition"
                onClick={openAddModal}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Application
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => setIsHelpModalOpen(true)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-4 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants by name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Under Review">Under Review</option>
              </select>

              {/* Grade Filter */}
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-32 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="">All Grades</option>
                {MOCK_CLASSES.map(c => (
                  <option key={c.grade} value={c.grade}>Grade {c.grade}</option>
                ))}
              </select>

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-40 h-10 bg-gray-50 rounded-md px-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="Application Date"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("")
                  setGradeFilter("")
                  setDateFilter("")
                }}
                className="h-10 px-4 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-10 px-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(searchTerm || statusFilter || gradeFilter || dateFilter) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                {searchTerm && (
                  <Badge variant="outline" className="text-xs h-6">
                    Search: "{searchTerm}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {statusFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Status: {statusFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setStatusFilter("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {gradeFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Grade: {gradeFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setGradeFilter("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {dateFilter && (
                  <Badge variant="outline" className="text-xs h-6">
                    Date: {dateFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-gray-100"
                      onClick={() => setDateFilter("")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Applications Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-100">Total Applications</p>
                  <p className="text-3xl font-bold text-white">{total}</p>
                  <p className="text-xs text-blue-200">
                    {pending > 0 ? `${pending} pending review` : 'All applications processed'}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Review Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-100">Pending Review</p>
                  <p className="text-3xl font-bold text-white">{pending}</p>
                  <p className="text-xs text-orange-100">
                    {pending > 0 ? 'Requires attention' : 'All processed'}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-100">Approved</p>
                  <p className="text-3xl font-bold text-white">{approved}</p>
                  <p className="text-xs text-emerald-200">
                    {total > 0 ? Math.round((approved / total) * 100) : 0}% approval rate
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rejected Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-100">Rejected</p>
                  <p className="text-3xl font-bold text-white">{rejected}</p>
                  <p className="text-xs text-red-200">
                    {total > 0 ? Math.round((rejected / total) * 100) : 0}% rejection rate
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waitlisted Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-100">Waitlisted</p>
                  <p className="text-3xl font-bold text-white">{waitlisted}</p>
                  <p className="text-xs text-purple-200">
                    {total > 0 ? Math.round((waitlisted / total) * 100) : 0}% waitlist rate
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Table Component */}
        <EnhancedTable
          data={filteredAdmissions}
          columns={[
            {
              key: "applicantName",
              header: "Applicant",
              sortable: true,
              cell: (item) => (
                <div className="font-semibold text-slate-900 text-sm cursor-pointer hover:text-blue-600 transition-colors">
                  {item.applicantName}
                </div>
              )
            },
            {
              key: "gradeApplyingFor",
              header: "Grade",
              sortable: true,
              cell: (item) => (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-medium">
                  Grade {item.gradeApplyingFor}
                </Badge>
              )
            },
            {
              key: "applicationDate",
              header: "Application Date",
              sortable: true,
              cell: (item) => (
                <span className="text-sm text-slate-600">
                  {new Date(item.applicationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              )
            },
            {
              key: "status",
              header: "Status",
              sortable: true,
              cell: (item) => (
                <Badge
                  className={`text-xs font-medium ${item.status === "Approved"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : item.status === "Rejected"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : item.status === "Waitlisted"
                        ? "bg-purple-100 text-purple-800 border-purple-200"
                        : item.status === "Under Review"
                          ? "bg-orange-100 text-orange-800 border-orange-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                >
                  {item.status}
                </Badge>
              )
            },
            {
              key: "contact",
              header: "Contact",
              sortable: true,
              cell: (item) => (
                <div className="text-xs">
                  <div className="text-slate-500 flex items-center gap-1">
                    {item.contact.includes('@') ? (
                      <Mail className="h-3 w-3" />
                    ) : (
                      <Phone className="h-3 w-3" />
                    )}
                    <span className="truncate max-w-[120px]">{item.contact}</span>
                  </div>
                </div>
              )
            }
          ]}
          title="Applications List"
          description="Manage student applications and track their status"
          actions={[
            {
              key: "view",
              label: "View Details",
              icon: <Eye className="h-4 w-4" />,
              onClick: openDetailModal
            },
            {
              key: "edit",
              label: "Edit Application",
              icon: <Edit className="h-4 w-4" />,
              onClick: openEditModal
            },
            {
              key: "contact",
              label: "Contact",
              icon: <Mail className="h-4 w-4" />,
              onClick: (item) => item.contact.includes('@') ? window.open(`mailto:${item.contact}`) : window.open(`tel:${item.contact}`)
            },
            {
              key: "delete",
              label: "Delete Application",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: (item) => handleDelete(item.id),
              variant: "destructive"
            }
          ]}
          bulkActions={[
            {
              key: "approve",
              label: "Approve All",
              icon: <CheckCircle className="h-4 w-4" />,
              onClick: (items) => {
                const ids = items.map(item => item.id)
                // In a real app, this would be a bulk API call
                ids.forEach(id => {
                  const admission = admissions.find((a: Admission) => a.id === id)
                  if (admission) {
                    admissionsApi.update(id, { ...admission, status: "Approved" })
                      .then(res => {
                        if (res.success) updateAdmission(id, res.data)
                      })
                  }
                })
                toast({ title: "Applications Approved", description: `${ids.length} applications approved.` })
              }
            },
            {
              key: "reject",
              label: "Reject All",
              icon: <XCircle className="h-4 w-4" />,
              onClick: (items) => {
                const ids = items.map(item => item.id)
                ids.forEach(id => {
                  const admission = admissions.find((a: Admission) => a.id === id)
                  if (admission) {
                    admissionsApi.update(id, { ...admission, status: "Rejected" })
                      .then(res => {
                        if (res.success) updateAdmission(id, res.data)
                      })
                  }
                })
                toast({ title: "Applications Rejected", description: `${ids.length} applications rejected.` })
              }
            },
            {
              key: "delete",
              label: "Delete All",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: (items) => {
                const ids = items.map(item => item.id)
                ids.forEach(id => handleDelete(id))
                toast({ title: "Applications Deleted", description: `${ids.length} applications deleted.` })
              },
              variant: "destructive"
            }
          ]}
          onAdd={undefined}
          onEdit={openEditModal}
          onDelete={handleBulkDelete}
          onExport={handleExport}
          searchPlaceholder="Search applicants by name or contact..."
          searchKeys={["applicantName", "contact"]}
          pageSize={25}
          pageSizeOptions={[10, 25, 50, 100]}
          showPagination={true}
          showSearch={false}
          showFilters={false}
          showBulkActions={true}
          showExport={false}
          onRowClick={openDetailModal}
          onSelectionChange={setSelectedIds}
          selectedIds={selectedIds}
          sortable={true}
          onSort={(key, direction) => {
            // Handle sorting logic here
            console.log(`Sorting by ${String(key)} in ${direction} order`)
          }}
          sortKey="applicationDate"
          sortDirection="desc"
        />

        {/* Main Content Area Closing */}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAdmission ? "Edit Application" : "Add Application"}</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Applicant Name</label>
                <input
                  type="text"
                  placeholder="Enter applicant name"
                  value={form.applicantName || ""}
                  onChange={e => handleFormChange("applicantName", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Grade Applying For</label>
                <select
                  value={form.gradeApplyingFor || ""}
                  onChange={e => handleFormChange("gradeApplyingFor", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Grade</option>
                  {MOCK_CLASSES.map(c => (
                    <option key={c.grade} value={c.grade}>{c.grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Application Date</label>
                <input
                  type="date"
                  value={form.applicationDate || ""}
                  onChange={e => handleFormChange("applicationDate", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={form.status || "Pending"}
                  onChange={e => handleFormChange("status", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Waitlisted">Waitlisted</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Contact Email/Phone</label>
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={form.contact || ""}
                  onChange={e => handleFormChange("contact", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Notes/Comments</label>
                <textarea
                  placeholder="Enter any additional notes"
                  className="w-full p-2 border rounded-md min-h-[60px]"
                  value={form.notes || ""}
                  onChange={e => handleFormChange("notes", e.target.value)}
                />
              </div>
            </div>

            {formError && <div className="text-red-600 text-sm">{formError}</div>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingAdmission ? "Save Changes" : "Add Application"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detailed View Modal */}
      <Dialog open={!!detailModal} onOpenChange={closeDetailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {detailModal && (
            <div className="space-y-3">
              <div className="font-bold text-lg text-blue-900">{detailModal.applicantName}</div>
              <div className="flex gap-2 text-sm">
                <Badge>{detailModal.gradeApplyingFor}</Badge>
                <span>{format(new Date(detailModal.applicationDate), "PPP")}</span>
                <Badge variant={detailModal.status === "Approved" ? "default" : detailModal.status === "Rejected" ? "destructive" : "secondary"}>{detailModal.status}</Badge>
              </div>
              <div className="text-sm">Contact: <span className="font-medium">{detailModal.contact}</span></div>
              <div className="text-sm">Notes: <span className="font-medium">{detailModal.notes || "-"}</span></div>
              <div className="mt-4">
                <div className="font-semibold mb-2">Status History</div>
                <ul className="space-y-1">
                  {(detailModal.statusHistory || []).map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <span>{format(new Date(h.date), "PPP p")}</span>
                      <Badge variant={h.status === "Approved" ? "default" : h.status === "Rejected" ? "destructive" : "secondary"}>{h.status}</Badge>
                      <span>by {h.by}</span>
                      {h.note && <span className="italic text-muted-foreground">({h.note})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-900">
              <BookOpen className="h-5 w-5" />
              How to Use Admissions Management Page
            </DialogTitle>
            <DialogDescription>
              Learn how to effectively manage applications, view analytics, and perform various actions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Analytics Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Analytics & Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">📊 Dashboard Cards</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Hover over cards</strong> for detailed metrics</li>
                    <li>• <strong>Total Applications</strong> - View application statistics</li>
                    <li>• <strong>Pending Review</strong> - Applications awaiting processing</li>
                    <li>• <strong>Approved</strong> - Successfully approved applications</li>
                    <li>• <strong>Rejected</strong> - Applications that were declined</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🎯 Quick Actions</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Click cards</strong> to view detailed reports</li>
                    <li>• <strong>Export data</strong> for external analysis</li>
                    <li>• <strong>Process applications</strong> efficiently</li>
                    <li>• <strong>Track approval rates</strong> and trends</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Search & Filter Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Search & Filter
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🔍 Quick Search</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Search bar</strong> - Find by applicant name or contact</li>
                    <li>• <strong>Real-time results</strong> as you type</li>
                    <li>• <strong>Contact information</strong> included in search</li>
                    <li>• <strong>Case-insensitive</strong> search</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">🎛️ Advanced Filters</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• <strong>Status filter</strong> - Pending, Approved, Rejected</li>
                    <li>• <strong>Grade filter</strong> - Filter by specific grades</li>
                    <li>• <strong>Date range</strong> - Filter by application date</li>
                    <li>• <strong>Clear filters</strong> - Reset all filters quickly</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Application Management Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Application Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">📋 Application List</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• <strong>View all applications</strong> in organized table</li>
                    <li>• <strong>Status badges</strong> - Color-coded application status</li>
                    <li>• <strong>Quick actions</strong> - View, edit, contact applicants</li>
                    <li>• <strong>Responsive design</strong> for mobile devices</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">📋 Bulk Operations</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• <strong>Select multiple applications</strong> using checkboxes</li>
                    <li>• <strong>Bulk approve/reject</strong> applications</li>
                    <li>• <strong>Send notifications</strong> to multiple applicants</li>
                    <li>• <strong>Export data</strong> for selected applications</li>
                    <li>• <strong>Bulk delete</strong> (use with caution)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions & Tools Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Actions & Tools
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">👁️ Individual Actions</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• <strong>View Details</strong> - Complete application information</li>
                    <li>• <strong>Edit Application</strong> - Update application records</li>
                    <li>• <strong>Email Applicant</strong> - Send email to applicants</li>
                    <li>• <strong>Call Applicant</strong> - Direct phone call</li>
                    <li>• <strong>Delete Application</strong> - Remove from system</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">📊 Data Management</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• <strong>Add New Application</strong> - Multi-step form</li>
                    <li>• <strong>Export Reports</strong> - Various formats</li>
                    <li>• <strong>Pagination</strong> - Navigate large datasets</li>
                    <li>• <strong>Sort & Filter</strong> - Organize data</li>
                    <li>• <strong>Real-time updates</strong> - Instant changes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Pro Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">💡 Efficiency Tips</h4>
                  <ul className="space-y-1">
                    <li>• Use keyboard shortcuts for faster navigation</li>
                    <li>• Save frequently used filters for quick access</li>
                    <li>• Export data regularly for backup purposes</li>
                    <li>• Use bulk actions for time-saving operations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🔒 Best Practices</h4>
                  <ul className="space-y-1">
                    <li>• Always verify application information before processing</li>
                    <li>• Use clear, descriptive notes for applications</li>
                    <li>• Regularly update contact information</li>
                    <li>• Monitor application trends and approval rates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHelpModalOpen(false)}>
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

