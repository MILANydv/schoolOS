"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Bus,
  Edit,
  Plus,
  RouteIcon,
  Trash2,
  User,
  Phone,
  MapPin,
  CreditCard,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { CRUDTable } from "@/components/table/crud-table"
import { AddBusForm } from "@/components/forms/transport/add-bus-form"
import { AddDriverForm } from "@/components/forms/transport/add-driver-form"
import { AddRouteForm } from "@/components/forms/transport/add-route-forms"

/* -------------------------------------------------------------------------- */
/*                              Domain Types                                  */
/* -------------------------------------------------------------------------- */
interface DriverType {
  id: string
  name: string
  contactNo: string
  age: number
  address: string
  licenseNo: string
  status: "Active" | "Inactive"
}

interface BusType {
  id: string
  busNumber: string
  capacity: number
  driver: string
  route: string
  status: "Active" | "Inactive" | "Maintenance"
}

interface RouteType {
  id: string
  name: string
  stops: string
  distance: string
  fee: number
  students: number
  status: "Active" | "Inactive"
}

interface PaymentType {
  id: string
  studentName: string
  rollNo: string
  class: string
  route: string
  amount: number
  status: "Paid" | "Pending" | "Overdue"
  paidDate: string | null
}

/* -------------------------------------------------------------------------- */
/*                                 Mock Data                                  */
/* -------------------------------------------------------------------------- */
const mockDrivers: DriverType[] = [
  {
    id: "1",
    name: "John Driver",
    contactNo: "+91 9876543210",
    age: 35,
    address: "123 Main Street, Bangalore",
    licenseNo: "KA0120230001234",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Driver",
    contactNo: "+91 9876543211",
    age: 42,
    address: "456 Park Avenue, Bangalore",
    licenseNo: "KA0120230005678",
    status: "Active",
  },
  {
    id: "3",
    name: "Mike Wilson",
    contactNo: "+91 9876543212",
    age: 38,
    address: "789 Oak Street, Bangalore",
    licenseNo: "KA0120230009012",
    status: "Inactive",
  },
]

const mockBuses: BusType[] = [
  { id: "1", busNumber: "KA-01-AB-1234", capacity: 50, driver: "John Driver", route: "Route A", status: "Active" },
  { id: "2", busNumber: "KA-01-CD-5678", capacity: 45, driver: "Jane Driver", route: "Route B", status: "Active" },
  { id: "3", busNumber: "KA-01-EF-9012", capacity: 40, driver: "Mike Wilson", route: "Route C", status: "Maintenance" },
]

const mockRoutes: RouteType[] = [
  {
    id: "1",
    name: "Route A",
    stops: "Main Gate → Park Street → Mall Road → Hospital → School",
    distance: "15 km",
    fee: 12000,
    students: 35,
    status: "Active",
  },
  {
    id: "2",
    name: "Route B",
    stops: "Bus Stand → Market → Temple → College → School",
    distance: "12 km",
    fee: 10000,
    students: 28,
    status: "Active",
  },
  {
    id: "3",
    name: "Route C",
    stops: "Railway Station → City Center → Library → School",
    distance: "18 km",
    fee: 15000,
    students: 22,
    status: "Inactive",
  },
]

const mockTransportPayments: PaymentType[] = [
  {
    id: "1",
    studentName: "John Doe",
    rollNo: "001",
    class: "Class 10-A",
    route: "Route A",
    amount: 12000,
    status: "Paid",
    paidDate: "2024-01-15",
  },
  {
    id: "2",
    studentName: "Jane Smith",
    rollNo: "002",
    class: "Class 10-A",
    route: "Route B",
    amount: 10000,
    status: "Pending",
    paidDate: null,
  },
  {
    id: "3",
    studentName: "Mike Johnson",
    rollNo: "003",
    class: "Class 9-B",
    route: "Route A",
    amount: 12000,
    status: "Overdue",
    paidDate: null,
  },
  {
    id: "4",
    studentName: "Sarah Wilson",
    rollNo: "004",
    class: "Class 11-A",
    route: "Route C",
    amount: 15000,
    status: "Paid",
    paidDate: "2024-01-20",
  },
]

/* -------------------------------------------------------------------------- */
/*                              Column Definitions                            */
/* -------------------------------------------------------------------------- */
const driverColumns: ColumnDef<DriverType>[] = [
  {
    accessorKey: "name",
    header: "Driver Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "contactNo",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.contactNo}</span>
      </div>
    ),
  },
  { accessorKey: "age", header: "Age" },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ getValue }) => (
      <div className="max-w-xs truncate flex items-center gap-2" title={getValue<string>()}>
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span>{getValue<string>()}</span>
      </div>
    ),
  },
  { accessorKey: "licenseNo", header: "License No." },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue<DriverType["status"]>()
      return <Badge variant={value === "Active" ? "default" : "secondary"}>{value}</Badge>
    },
  },
]

const busColumns: ColumnDef<BusType>[] = [
  {
    accessorKey: "busNumber",
    header: "Bus Number",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Bus className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.original.busNumber}</span>
      </div>
    ),
  },
  { accessorKey: "capacity", header: "Capacity" },
  { accessorKey: "driver", header: "Driver" },
  { accessorKey: "route", header: "Route" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue<BusType["status"]>()
      const variant = value === "Active" ? "default" : value === "Maintenance" ? "destructive" : "secondary"
      return <Badge variant={variant}>{value}</Badge>
    },
  },
]

const routeColumns: ColumnDef<RouteType>[] = [
  {
    accessorKey: "name",
    header: "Route Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <RouteIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "stops",
    header: "Stops",
    cell: ({ getValue }) => (
      <div className="max-w-xs truncate" title={getValue<string>()}>
        {getValue<string>()}
      </div>
    ),
  },
  { accessorKey: "distance", header: "Distance" },
  {
    accessorKey: "fee",
    header: "Annual Fee",
    cell: ({ getValue }) => `₹${getValue<number>().toLocaleString()}`,
  },
  { accessorKey: "students", header: "Students" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue<RouteType["status"]>()
      return <Badge variant={value === "Active" ? "default" : "secondary"}>{value}</Badge>
    },
  },
]

const paymentColumns: ColumnDef<PaymentType>[] = [
  {
    accessorKey: "studentName",
    header: "Student",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.studentName}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.rollNo} • {row.original.class}
        </div>
      </div>
    ),
  },
  { accessorKey: "route", header: "Route" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => `₹${getValue<number>().toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue<PaymentType["status"]>()
      const variant = value === "Paid" ? "default" : value === "Overdue" ? "destructive" : "secondary"
      return <Badge variant={variant}>{value}</Badge>
    },
  },
  {
    accessorKey: "paidDate",
    header: "Paid Date",
    cell: ({ getValue }) => {
      const date = getValue<string | null>()
      return date ? new Date(date).toLocaleDateString() : "-"
    },
  },
]

/* -------------------------------------------------------------------------- */
/*                             Page Implementation                            */
/* -------------------------------------------------------------------------- */
export default function TransportPage() {
  /* ---------------------------------- State --------------------------------- */
  const [drivers, setDrivers] = useState<DriverType[]>(mockDrivers)
  const [buses, setBuses] = useState<BusType[]>(mockBuses)
  const [routes, setRoutes] = useState<RouteType[]>(mockRoutes)
  const [transportPayments] = useState<PaymentType[]>(mockTransportPayments)

  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false)
  const [isBusDialogOpen, setIsBusDialogOpen] = useState(false)
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false)

  const [editingDriver, setEditingDriver] = useState<DriverType | null>(null)
  const [editingBus, setEditingBus] = useState<BusType | null>(null)
  const [editingRoute, setEditingRoute] = useState<RouteType | null>(null)

  /* ------------------------------ Driver Handlers ----------------------------- */
  const handleCreateDriver = (data: Omit<DriverType, "id">) => {
    const newDriver: DriverType = { id: Date.now().toString(), ...data }
    setDrivers((prev) => [...prev, newDriver])
    setIsDriverDialogOpen(false)
  }

  const handleEditDriver = (driver: DriverType) => {
    setEditingDriver(driver)
    setIsDriverDialogOpen(true)
  }

  const handleUpdateDriver = (data: Omit<DriverType, "id">) => {
    setDrivers((prev) => prev.map((d) => (d.id === editingDriver?.id ? { ...d, ...data } : d)))
    setEditingDriver(null)
    setIsDriverDialogOpen(false)
  }

  const handleDeleteDriver = (id: string) => setDrivers((prev) => prev.filter((d) => d.id !== id))

  const handleDriverDialogClose = () => {
    setIsDriverDialogOpen(false)
    setEditingDriver(null)
  }

  /* ------------------------------- Bus Handlers ------------------------------ */
  const handleCreateBus = (data: Omit<BusType, "id">) => {
    const newBus: BusType = { id: Date.now().toString(), ...data }
    setBuses((prev) => [...prev, newBus])
    setIsBusDialogOpen(false)
  }

  const handleEditBus = (bus: BusType) => {
    setEditingBus(bus)
    setIsBusDialogOpen(true)
  }

  const handleUpdateBus = (data: Omit<BusType, "id">) => {
    setBuses((prev) => prev.map((b) => (b.id === editingBus?.id ? { ...b, ...data } : b)))
    setEditingBus(null)
    setIsBusDialogOpen(false)
  }

  const handleDeleteBus = (id: string) => setBuses((prev) => prev.filter((b) => b.id !== id))

  const handleBusDialogClose = () => {
    setIsBusDialogOpen(false)
    setEditingBus(null)
  }

  /* ------------------------------ Route Handlers ----------------------------- */
  const handleCreateRoute = (data: Omit<RouteType, "id">) => {
    const newRoute: RouteType = { id: Date.now().toString(), ...data }
    setRoutes((prev) => [...prev, newRoute])
    setIsRouteDialogOpen(false)
  }

  const handleEditRoute = (route: RouteType) => {
    setEditingRoute(route)
    setIsRouteDialogOpen(true)
  }

  const handleUpdateRoute = (data: Omit<RouteType, "id">) => {
    setRoutes((prev) => prev.map((r) => (r.id === editingRoute?.id ? { ...r, ...data } : r)))
    setEditingRoute(null)
    setIsRouteDialogOpen(false)
  }

  const handleDeleteRoute = (id: string) => setRoutes((prev) => prev.filter((r) => r.id !== id))

  const handleRouteDialogClose = () => {
    setIsRouteDialogOpen(false)
    setEditingRoute(null)
  }

  // Enhanced columns with edit/delete actions
  const enhancedDriverColumns: ColumnDef<DriverType>[] = [
    ...driverColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleEditDriver(row.original)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="destructive" size="icon" onClick={() => handleDeleteDriver(row.original.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const enhancedBusColumns: ColumnDef<BusType>[] = [
    ...busColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleEditBus(row.original)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="destructive" size="icon" onClick={() => handleDeleteBus(row.original.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const enhancedRouteColumns: ColumnDef<RouteType>[] = [
    ...routeColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleEditRoute(row.original)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="destructive" size="icon" onClick={() => handleDeleteRoute(row.original.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]

  // Calculate stats
  const totalStudents = routes.reduce((sum, route) => sum + route.students, 0)
  const totalRevenue = transportPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const paidStudents = transportPayments.filter((p) => p.status === "Paid").length
  const pendingPayments = transportPayments.filter((p) => p.status === "Pending").length
  const overduePayments = transportPayments.filter((p) => p.status === "Overdue").length
  const activeBuses = buses.filter((b) => b.status === "Active").length
  const activeRoutes = routes.filter((r) => r.status === "Active").length
  const activeDrivers = drivers.filter((d) => d.status === "Active").length

  /* ---------------------------------- View ---------------------------------- */
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
          <p className="text-muted-foreground">Comprehensive transport system management</p>
        </div>
      </header>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <div className="text-2xl font-bold">{totalStudents}</div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Buses</p>
                <div className="text-2xl font-bold">{activeBuses}</div>
              </div>
              <Bus className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Routes</p>
                <div className="text-2xl font-bold">{activeRoutes}</div>
              </div>
              <RouteIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="drivers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* ------------------------------- Drivers Tab ------------------------------ */}
        <TabsContent value="drivers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Driver Management</h2>
              <p className="text-muted-foreground">Manage driver information and licenses</p>
            </div>
            <Button onClick={() => setIsDriverDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Driver
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Drivers</p>
                    <div className="text-2xl font-bold">{activeDrivers}</div>
                  </div>
                  <User className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Drivers</p>
                    <div className="text-2xl font-bold">{drivers.length}</div>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Age</p>
                    <div className="text-2xl font-bold">
                      {Math.round(drivers.reduce((sum, d) => sum + d.age, 0) / drivers.length)}
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                All Drivers
              </CardTitle>
              <CardDescription>Manage driver information and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <CRUDTable
                data={drivers}
                columns={enhancedDriverColumns}
                filterColumn="name"
                onDelete={(ids) => ids.forEach(handleDeleteDriver)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------- Buses Tab ------------------------------ */}
        <TabsContent value="buses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Bus Management</h2>
              <p className="text-muted-foreground">Manage school buses and their assignments</p>
            </div>
            <Button onClick={() => setIsBusDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Bus
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Buses</p>
                    <div className="text-2xl font-bold text-green-600">{activeBuses}</div>
                  </div>
                  <Bus className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Under Maintenance</p>
                    <div className="text-2xl font-bold text-red-600">
                      {buses.filter((b) => b.status === "Maintenance").length}
                    </div>
                  </div>
                  <Bus className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                    <div className="text-2xl font-bold">{buses.reduce((sum, b) => sum + b.capacity, 0)}</div>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                All Buses
              </CardTitle>
              <CardDescription>Manage school buses and their assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <CRUDTable
                data={buses}
                columns={enhancedBusColumns}
                filterColumn="busNumber"
                onDelete={(ids) => ids.forEach(handleDeleteBus)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------ Routes Tab ----------------------------- */}
        <TabsContent value="routes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Route Management</h2>
              <p className="text-muted-foreground">Manage transport routes and fees</p>
            </div>
            <Button onClick={() => setIsRouteDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Route
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Routes</p>
                    <div className="text-2xl font-bold text-green-600">{activeRoutes}</div>
                  </div>
                  <RouteIcon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                    <div className="text-2xl font-bold">
                      {routes.reduce((sum, r) => sum + Number.parseInt(r.distance), 0)} km
                    </div>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Fee</p>
                    <div className="text-2xl font-bold">
                      ₹{Math.round(routes.reduce((sum, r) => sum + r.fee, 0) / routes.length).toLocaleString()}
                    </div>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RouteIcon className="h-5 w-5" />
                All Routes
              </CardTitle>
              <CardDescription>Manage transport routes and fees</CardDescription>
            </CardHeader>
            <CardContent>
              <CRUDTable
                data={routes}
                columns={enhancedRouteColumns}
                filterColumn="name"
                onDelete={(ids) => ids.forEach(handleDeleteRoute)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------------------- Payments Tab ---------------------------- */}
        <TabsContent value="payments" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Student Transport Payments</h2>
            <p className="text-muted-foreground">Monitor and manage transport fee payments</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paid Students</p>
                    <div className="text-2xl font-bold text-green-600">{paidStudents}</div>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
                  </div>
                  <CreditCard className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                    <div className="text-2xl font-bold text-red-600">{overduePayments}</div>
                  </div>
                  <CreditCard className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transport Payment Status
              </CardTitle>
              <CardDescription>View and manage student transport payment records</CardDescription>
            </CardHeader>
            <CardContent>
              <CRUDTable data={transportPayments} columns={paymentColumns} filterColumn="studentName" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --------------------------- Driver Dialog --------------------------- */}
      <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AddDriverForm
            onSubmit={editingDriver ? handleUpdateDriver : handleCreateDriver}
            onCancel={handleDriverDialogClose}
            initialData={editingDriver ?? undefined}
            isEdit={!!editingDriver}
          />
        </DialogContent>
      </Dialog>

      {/* --------------------------- Bus Dialog --------------------------- */}
      <Dialog open={isBusDialogOpen} onOpenChange={setIsBusDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AddBusForm
            drivers={drivers}
            routes={routes}
            onSubmit={editingBus ? handleUpdateBus : handleCreateBus}
            onCancel={handleBusDialogClose}
            initialData={editingBus ?? undefined}
            isEdit={!!editingBus}
          />
        </DialogContent>
      </Dialog>

      {/* --------------------------- Route Dialog --------------------------- */}
      <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AddRouteForm
            onSubmit={editingRoute ? handleUpdateRoute : handleCreateRoute}
            onCancel={handleRouteDialogClose}
            initialData={editingRoute ?? undefined}
            isEdit={!!editingRoute}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
