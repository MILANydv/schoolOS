"use client"

import * as React from "react"
import {
  type ColumnDef,
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
  PlusCircle,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Download,
  X,
  RefreshCw,
  Settings,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { FormDialog } from "@/components/feedback/form-dialog"

interface CRUDTable<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  filterColumn?: string
  searchPlaceholder?: string
  onAdd?: () => void
  onEdit?: (item: TData) => void
  onDelete?: (ids: string[]) => void
  onRefresh?: () => void
  onExport?: () => void
  addForm?: React.ReactNode
  editForm?: React.ReactNode
  addFormTitle?: string
  addFormDescription?: string
  editFormTitle?: string
  editFormDescription?: string
  selectedItem?: TData | null
  bulkActions?: React.ReactNode
  enableSearch?: boolean
  enableColumnVisibility?: boolean
  enableExport?: boolean
  enableRefresh?: boolean
  viewMode?: "table" | "grid"
  onViewModeChange?: (mode: "table" | "grid") => void
}

export function CRUDTable<TData extends { id: string }, TValue>({
  columns,
  data,
  loading = false,
  filterColumn,
  searchPlaceholder = "Search...",
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  onExport,
  addForm,
  editForm,
  addFormTitle,
  addFormDescription,
  editFormTitle,
  editFormDescription,
  selectedItem,
  bulkActions,
  enableSearch = true,
  enableColumnVisibility = true,
  enableExport = true,
  enableRefresh = true,
  viewMode = "table",
  onViewModeChange,
}: CRUDTable<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  React.useEffect(() => {
    setIsEditModalOpen(!!selectedItem)
  }, [selectedItem])

  const handleDeleteSelected = () => {
    const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id)
    if (onDelete && selectedIds.length > 0) {
      onDelete(selectedIds)
      table.toggleAllRowsSelected(false)
    }
  }

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length
  const totalRows = table.getFilteredRowModel().rows.length
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const pageSize = table.getState().pagination.pageSize

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: pageSize }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full space-y-4">
      {/* Enhanced Header Controls */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Search and Filters */}
        <div className="flex flex-1 items-center space-x-2">
          {enableSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setGlobalFilter("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Active Filters Display */}
          {(globalFilter || selectedRowsCount > 0) && (
            <div className="flex items-center space-x-2">
              {globalFilter && (
                <Badge variant="secondary" className="gap-1">
                  Search: {globalFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setGlobalFilter("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedRowsCount > 0 && (
                <Badge variant="outline" className="gap-1">
                  {selectedRowsCount} selected
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Bulk Actions */}
          {selectedRowsCount > 0 && (
            <>
              <Button variant="destructive" size="sm" onClick={handleDeleteSelected} className="h-8">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedRowsCount})
              </Button>
              <Separator orientation="vertical" className="h-6" />
            </>
          )}

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2 rounded-r-none"
                onClick={() => onViewModeChange("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2 rounded-l-none"
                onClick={() => onViewModeChange("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Utility Actions */}
          <div className="flex items-center space-x-1">
            {enableRefresh && onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="h-8 px-2 bg-transparent"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            )}

            {enableExport && onExport && (
              <Button variant="outline" size="sm" onClick={onExport} className="h-8 px-2 bg-transparent">
                <Download className="h-4 w-4" />
              </Button>
            )}

            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        <div className="flex items-center">
                          {column.getIsVisible() ? (
                            <Eye className="mr-2 h-4 w-4" />
                          ) : (
                            <EyeOff className="mr-2 h-4 w-4" />
                          )}
                          {String(column.id)
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                        </div>
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Add Button */}
          {onAdd && (
            <FormDialog
              open={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
              title={addFormTitle || "Add New Item"}
              description={addFormDescription || "Enter details for the new item."}
              trigger={
                <Button size="sm" className="h-8 gap-1 shadow-sm">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New</span>
                </Button>
              }
            >
              {addForm}
            </FormDialog>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkActions && selectedRowsCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                {selectedRowsCount} items selected
              </Badge>
            </div>
            {bulkActions}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="p-4">
            <LoadingSkeleton />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-12 px-6 text-left align-middle font-semibold text-gray-900 bg-gray-50/80"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/20"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                        <Search className="h-8 w-8 text-gray-300" />
                        <p className="text-sm font-medium">No results found</p>
                        <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Enhanced Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  Showing {Math.min((currentPage - 1) * pageSize + 1, totalRows)} to{" "}
                  {Math.min(currentPage * pageSize, totalRows)} of {totalRows} results
                </span>
                {selectedRowsCount > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {selectedRowsCount} selected
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-6">
                {/* Rows per page */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Rows per page</span>
                  <Select value={`${pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
                    <SelectTrigger className="h-8 w-[70px] border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50, 100].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Page navigation */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-transparent"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Dialog */}
      {onEdit && editForm && (
        <FormDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          title={editFormTitle || "Edit Item"}
          description={editFormDescription || "Update details for the selected item."}
        >
          {editForm}
        </FormDialog>
      )}
    </div>
  )
}
