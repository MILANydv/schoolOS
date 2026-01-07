"use client"

import { useState, useMemo, useCallback } from "react"

interface UseCRUDTableOptions<T> {
  data: T[]
  initialSortBy?: keyof T
  initialSortDirection?: "asc" | "desc"
  initialPageSize?: number
}

export function useCRUDTable<T extends { id: string }>(options: UseCRUDTableOptions<T>) {
  const { data, initialSortBy, initialSortDirection = "asc", initialPageSize = 10 } = options

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<keyof T | null>(initialSortBy || null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialSortDirection)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return data.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(lowerCaseSearchTerm)),
    )
  }, [data, searchTerm])

  const sortedData = useMemo(() => {
    if (!sortBy) {
      return filteredData
    }
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      // Fallback for other types, convert to string
      const aStr = String(aValue)
      const bStr = String(bValue)
      return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }, [filteredData, sortBy, sortDirection])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, pageSize])

  const totalPages = useMemo(() => Math.ceil(sortedData.length / pageSize), [sortedData.length, pageSize])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page on search
  }, [])

  const handleSort = useCallback((column: keyof T) => {
    setSortBy((prevSortBy) => {
      if (prevSortBy === column) {
        setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"))
      } else {
        setSortDirection("asc")
      }
      return column
    })
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page on page size change
  }, [])

  return {
    paginatedData,
    searchTerm,
    sortBy,
    sortDirection,
    currentPage,
    pageSize,
    totalPages,
    totalItems: sortedData.length,
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
  }
}
