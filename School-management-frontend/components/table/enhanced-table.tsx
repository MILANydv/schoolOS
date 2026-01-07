"use client"

import * as React from "react"
import { 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Search, 
  Filter, 
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Plus,
  FileText,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormSelect } from "@/components/forms/form-select"
import { FormDatePicker } from "@/components/forms/form-date-picker"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  cell?: (item: T, index: number) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string
  className?: string
}

export interface TableFilter {
  key: string
  type: 'text' | 'select' | 'date' | 'dateRange'
  label: string
  options?: { value: string; label: string }[]
  placeholder?: string
}

export interface TableAction<T> {
  key: string
  label: string
  icon?: React.ReactNode
  onClick: (item: T) => void
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  className?: string
}

export interface EnhancedTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  title?: string
  description?: string
  filters?: TableFilter[]
  actions?: TableAction<T>[]
  bulkActions?: TableAction<T[]>[]
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (ids: string[]) => void
  onExport?: () => void
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  pageSize?: number
  pageSizeOptions?: number[]
  showPagination?: boolean
  showSearch?: boolean
  showFilters?: boolean
  showBulkActions?: boolean
  showExport?: boolean
  loading?: boolean
  emptyState?: React.ReactNode
  className?: string
  idField?: keyof T
  onRowClick?: (item: T) => void
  onSelectionChange?: (selectedIds: string[]) => void
  selectedIds?: string[]
  sortable?: boolean
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
  sortKey?: keyof T
  sortDirection?: 'asc' | 'desc'
  showSerialNumbers?: boolean
}

export function EnhancedTable<T extends { id?: string; [key: string]: any }>({
  data,
  columns,
  title = "Data Table",
  description,
  filters = [],
  actions = [],
  bulkActions = [],
  onAdd,
  onEdit,
  onDelete,
  onExport,
  searchPlaceholder = "Search...",
  searchKeys = [],
  pageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  showPagination = true,
  showSearch = true,
  showFilters = true,
  showBulkActions = true,
  showExport = true,
  loading = false,
  emptyState,
  className = "",
  idField = 'id' as keyof T,
  onRowClick,
  onSelectionChange,
  selectedIds = [],
  sortable = true,
  onSort,
  sortKey,
  sortDirection = 'asc',
  showSerialNumbers = false
}: EnhancedTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [currentPageSize, setCurrentPageSize] = React.useState(pageSize)
  const [filterValues, setFilterValues] = React.useState<Record<string, any>>({})
  const [showScrollTop, setShowScrollTop] = React.useState(false)
  const tableRef = React.useRef<HTMLDivElement>(null)

  // Filter data based on search and filters
  const filteredData = React.useMemo(() => {
    let filtered = data

    // Apply search
    if (search && searchKeys.length > 0) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(item =>
        searchKeys.some(key => {
          const value = item[key]
          return value && String(value).toLowerCase().includes(searchLower)
        })
      )
    }

    // Apply filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = item[key as keyof T]
          if (typeof value === 'string' && typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase())
          }
          return itemValue === value
        })
      }
    })

    return filtered
  }, [data, search, searchKeys, filterValues])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortKey || !onSort) return filteredData
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })
  }, [filteredData, sortKey, sortDirection, onSort])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * currentPageSize
    const endIndex = startIndex + currentPageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, currentPageSize])

  const totalPages = Math.ceil(sortedData.length / currentPageSize)

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    const newSelectedIds = checked ? paginatedData.map(item => String(item[idField])) : []
    onSelectionChange?.(newSelectedIds)
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelectedIds = checked 
      ? [...selectedIds, itemId]
      : selectedIds.filter(id => id !== itemId)
    onSelectionChange?.(newSelectedIds)
  }

  // Handle sorting
  const handleSort = (key: keyof T) => {
    if (!sortable || !onSort) return
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, newDirection)
  }

  // Scroll to top
  const scrollToTop = () => {
    tableRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    setShowScrollTop(target.scrollTop > 200)
  }

  // Clear filters
  const clearFilters = () => {
    setSearch("")
    setFilterValues({})
    setCurrentPage(1)
  }

  // Keyboard navigation
  const handleKeyNavigation = (e: React.KeyboardEvent, currentIndex: number) => {
    const totalRows = paginatedData.length
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (currentIndex < totalRows - 1) {
          const nextRow = document.querySelector(`[data-row-index="${currentIndex + 1}"]`) as HTMLElement
          nextRow?.focus()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (currentIndex > 0) {
          const prevRow = document.querySelector(`[data-row-index="${currentIndex - 1}"]`) as HTMLElement
          prevRow?.focus()
        }
        break
      case 'Home':
        e.preventDefault()
        const firstRow = document.querySelector('[data-row-index="0"]') as HTMLElement
        firstRow?.focus()
        break
      case 'End':
        e.preventDefault()
        const lastRow = document.querySelector(`[data-row-index="${totalRows - 1}"]`) as HTMLElement
        lastRow?.focus()
        break
    }
  }

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <CardTitle className="flex items-center justify-between text-slate-900">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {title}
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                {sortedData.length} items
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {onAdd && (
                <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              )}
              {showExport && onExport && (
                <Button variant="outline" onClick={onExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </CardTitle>
          {description && (
            <p className="text-slate-600 mt-1">{description}</p>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {/* Search and Filters */}
          {(showSearch || showFilters) && (
            <div className="bg-slate-50 border-b-2 border-slate-300 p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                {showSearch && (
                  <div className="flex-1 relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="h-10 pl-10 bg-white border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                )}
                
                {showFilters && filters.map(filter => (
                  <div key={filter.key} className="flex items-center gap-2">
                    {filter.type === 'select' && filter.options && (
                      <FormSelect
                        id={filter.key}
                        label=""
                        value={filterValues[filter.key] || 'all'}
                        onValueChange={value => setFilterValues(prev => ({ ...prev, [filter.key]: value }))}
                        options={[
                          { value: 'all', label: `All ${filter.label}` },
                          ...filter.options
                        ]}
                      />
                    )}
                    {filter.type === 'date' && (
                      <FormDatePicker
                        id={filter.key}
                        label={filter.label}
                        selectedDate={filterValues[filter.key]}
                        onSelectDate={date => setFilterValues(prev => ({ ...prev, [filter.key]: date }))}
                        placeholder={filter.placeholder}
                      />
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-10 px-4 bg-white border-slate-200 hover:bg-slate-50"
                  onClick={clearFilters}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                
                <div className="text-sm font-medium text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200">
                  {sortedData.length} of {data.length}
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {showBulkActions && !showSerialNumbers && selectedIds.length > 0 && (
            <div className="bg-blue-50 border-b-2 border-blue-300 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedIds.length === paginatedData.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="font-medium text-blue-900">
                    {selectedIds.length} item(s) selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {bulkActions.map(action => (
                    <Button
                      key={action.key}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={() => action.onClick(paginatedData.filter(item => 
                        selectedIds.includes(String(item[idField]))
                      ))}
                      className={action.className}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="relative">
            <div 
              ref={tableRef}
              className="max-h-[70vh] overflow-y-auto overflow-x-hidden border border-slate-200 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
              onScroll={handleScroll}
            >
              <div className="w-full">
                <div className="rounded-lg">
                  <table className="w-full table-fixed divide-y divide-slate-300">
                    <thead className="bg-slate-100 sticky top-0 z-20 shadow-md border-b-2 border-slate-300">
                      <tr>
                        {showSerialNumbers && (
                          <th className="w-12 px-3 py-4 text-center bg-slate-100 border-r border-slate-200">
                            <span className="text-xs font-semibold text-slate-800">SN</span>
                          </th>
                        )}
                        {showBulkActions && !showSerialNumbers && (
                          <th className="w-12 px-3 py-4 text-left bg-slate-100 border-r border-slate-200">
                            <Checkbox 
                              checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </th>
                        )}
                        {columns.map((column, index) => (
                          <th 
                            key={String(column.key)}
                            className={`px-4 py-4 text-left text-xs font-semibold text-slate-800 bg-slate-100 border-r border-slate-200 whitespace-nowrap ${
                              column.sortable && sortable ? 'cursor-pointer hover:bg-slate-200 transition-colors duration-200' : ''
                            } ${column.className || ''}`}
                            style={{ width: column.width }}
                            onClick={() => column.sortable && sortable && handleSort(column.key as keyof T)}
                          >
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{column.header}</span>
                              {column.sortable && sortable && (
                                <div className="flex flex-col flex-shrink-0">
                                  <ChevronUp className={`h-3 w-3 ${sortKey === column.key && sortDirection === 'asc' ? 'text-blue-600' : 'text-slate-400'}`} />
                                  <ChevronDown className={`h-3 w-3 ${sortKey === column.key && sortDirection === 'desc' ? 'text-blue-600' : 'text-slate-400'}`} />
                                </div>
                              )}
                            </div>
                          </th>
                        ))}
                        {actions.length > 0 && (
                          <th className="w-20 px-3 py-4 text-left text-xs font-semibold text-slate-800 bg-slate-100">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {paginatedData.map((item, idx) => (
                        <tr 
                          key={String(item[idField])}
                          data-row-index={idx}
                          className={`group hover:bg-slate-50 transition-all duration-200 focus-within:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-200 focus-within:ring-inset ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                          } ${selectedIds.includes(String(item[idField])) ? 'bg-blue-50 ring-2 ring-blue-200' : ''} ${
                            onRowClick ? 'cursor-pointer' : ''
                          }`}
                          tabIndex={0}
                          onClick={() => onRowClick?.(item)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              onRowClick?.(item)
                            } else {
                              handleKeyNavigation(e, idx)
                            }
                          }}
                        >
                          {showSerialNumbers && (
                            <td className="w-12 px-3 py-4 whitespace-nowrap border-r border-slate-200 text-center">
                              <div className="w-4 h-4 bg-slate-50 rounded-sm flex items-center justify-center border border-slate-200">
                                <span className="text-xs font-medium text-slate-500">{((currentPage - 1) * currentPageSize) + idx + 1}</span>
                              </div>
                            </td>
                          )}
                          {showBulkActions && !showSerialNumbers && (
                            <td className="w-12 px-3 py-4 whitespace-nowrap border-r border-slate-200">
                              <Checkbox 
                                checked={selectedIds.includes(String(item[idField]))}
                                onCheckedChange={(checked) => handleSelectItem(String(item[idField]), checked as boolean)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                          )}
                          {columns.map((column, colIdx) => (
                            <td 
                              key={String(column.key)}
                              className={`px-4 py-4 border-r border-slate-200 ${column.className || ''} ${
                                colIdx === columns.length - 1 ? 'border-r-0' : ''
                              }`}
                            >
                              <div className="min-w-0">
                                {column.cell ? column.cell(item, idx) : (
                                  <span className="truncate block" title={String(item[column.key] || '')}>
                                    {String(item[column.key] || '')}
                                  </span>
                                )}
                              </div>
                            </td>
                          ))}
                          {actions.length > 0 && (
                            <td className="w-20 px-3 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {actions.slice(0, 2).map(action => (
                                  <Button
                                    key={action.key}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      action.onClick(item)
                                    }}
                                  >
                                    {action.icon}
                                  </Button>
                                ))}
                                {actions.length > 2 && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {actions.slice(2).map(action => (
                                        <DropdownMenuItem
                                          key={action.key}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            action.onClick(item)
                                          }}
                                          className={action.variant === 'destructive' ? 'text-red-600' : ''}
                                        >
                                          {action.icon}
                                          {action.label}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                      {paginatedData.length === 0 && (
                        <tr>
                          <td colSpan={columns.length + (showSerialNumbers ? 1 : 0) + (showBulkActions && !showSerialNumbers ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="text-center py-12">
                            {emptyState || (
                              <>
                                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No items found</h3>
                                <p className="text-slate-500 mb-4">Try adjusting your search criteria or filters.</p>
                                {onAdd && (
                                  <Button onClick={onAdd} className="focus:ring-2 focus:ring-blue-500">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Item
                                  </Button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Scroll to Top Button */}
            {showScrollTop && (
              <Button
                onClick={scrollToTop}
                className="absolute bottom-4 right-4 h-10 w-10 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                title="Scroll to top"
              >
                <ChevronDown className="h-5 w-5 rotate-180" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">
                    Showing {((currentPage - 1) * currentPageSize) + 1} to {Math.min(currentPage * currentPageSize, sortedData.length)}
                  </span>
                  <span className="text-slate-500"> of {sortedData.length} items</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Items per page:</span>
                  <Select
                    value={currentPageSize.toString()}
                    onValueChange={(value) => {
                      setCurrentPageSize(parseInt(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-20 focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map(size => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 focus:ring-2 focus:ring-blue-500"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 focus:ring-2 focus:ring-blue-500"
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </Button>
                      {currentPage > 4 && <span className="text-slate-400 px-1">...</span>}
                    </>
                  )}
                  
                  {/* Current page range */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0 focus:ring-2 focus:ring-blue-500"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    }
                    return null
                  })}
                  
                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="text-slate-400 px-1">...</span>}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 focus:ring-2 focus:ring-blue-500"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 focus:ring-2 focus:ring-blue-500"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronDown className="h-4 w-4 -rotate-90 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 