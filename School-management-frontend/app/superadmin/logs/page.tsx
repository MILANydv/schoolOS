"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  User,
  AlertTriangle,
  Info,
  XCircle,
  Search,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { CRUDTable } from "@/components/table/crud-table"
import { MOCK_LOGS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type Log = (typeof MOCK_LOGS)[number]

export default function SuperAdminLogsPage() {
  const [logs, setLogs] = React.useState<Log[]>(MOCK_LOGS)
  const [filteredLogs, setFilteredLogs] = React.useState<Log[]>(MOCK_LOGS)
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [levelFilter, setLevelFilter] = React.useState<string>("all")
  const [userFilter, setUserFilter] = React.useState("")
  const [dateFilter, setDateFilter] = React.useState("")
  const { toast } = useToast()

  // Filter logs based on search and filters
  React.useEffect(() => {
    let filtered = logs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter)
    }

    // User filter
    if (userFilter) {
      filtered = filtered.filter((log) => log.user.toLowerCase().includes(userFilter.toLowerCase()))
    }

    // Date filter (simple date matching)
    if (dateFilter) {
      filtered = filtered.filter((log) => log.timestamp.startsWith(dateFilter))
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, levelFilter, userFilter, dateFilter])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLogs([...MOCK_LOGS])
    setIsLoading(false)
    toast({
      title: "Logs refreshed",
      description: "System logs have been updated successfully.",
    })
  }

  const handleExport = () => {
    const csvContent = [
      ["Timestamp", "Level", "Message", "User", "Source", "IP"],
      ...filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.level,
        log.message,
        log.user,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: "Logs have been exported to CSV file.",
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setLevelFilter("all")
    setUserFilter("")
    setDateFilter("")
  }

  const getLogStats = () => {
    const total = logs.length
    const errors = logs.filter((log) => log.level === "ERROR").length
    const warnings = logs.filter((log) => log.level === "WARN").length
    const info = logs.filter((log) => log.level === "INFO").length

    return { total, errors, warnings, info }
  }

  const stats = getLogStats()

  const columns: ColumnDef<Log>[] = [
    {
      accessorKey: "timestamp",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Timestamp</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("timestamp") as string)
        return (
          <div className="font-mono text-xs sm:text-sm">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-muted-foreground">{date.toLocaleTimeString()}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => {
        const level = row.getValue("level") as string
        let variant: "default" | "secondary" | "destructive" = "default"
        let icon = <Info className="h-3 w-3" />

        if (level === "ERROR") {
          variant = "destructive"
          icon = <XCircle className="h-3 w-3" />
        }
        if (level === "WARN") {
          variant = "secondary"
          icon = <AlertTriangle className="h-3 w-3" />
        }

        return (
          <Badge variant={variant} className="gap-1">
            {icon}
            <span className="hidden sm:inline">{level}</span>
          </Badge>
        )
      },
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <div className="max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] truncate">{row.getValue("message")}</div>
      ),
    },
    {
      accessorKey: "user",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            <User className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">User</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[120px] sm:max-w-[150px] truncate font-medium">{row.getValue("user")}</div>
      ),
    },
  ]

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">Monitor and analyze system activity and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleExport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.errors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter logs by level, user, date, or search terms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Log Level</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARN">Warning</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Input
                id="user"
                placeholder="Filter by user..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <CRUDTable columns={columns} data={filteredLogs} searchPlaceholder="Search in table..." />
        </CardContent>
      </Card>
    </div>
  )
}
