"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, BarChart3, Search, X, User, ChevronDown, ChevronUp, AlertCircle, GraduationCap, TrendingUp, Clock, Mail, Hash, Activity } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { TeacherHeader } from "@/app/components/ui/teacher-header"

// Generate 10 classes
const mockClasses = Array.from({ length: 10 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Class ${i + 1}${String.fromCharCode(65 + (i % 5))}`,
  subject: ["Mathematics", "Physics", "Chemistry", "Biology", "English"][i % 5],
  students: 30,
  schedule: [
    "Mon, Wed, Fri - 09:00 AM",
    "Tue, Thu - 10:30 AM",
    "Mon, Wed, Fri - 02:00 PM",
    "Tue, Thu - 01:00 PM",
    "Mon, Wed, Fri - 11:00 AM"
  ][i % 5],
  room: `Room ${101 + i}`,
}))

// Generate 30 students per class (300 total)
const mockStudents = mockClasses.flatMap((cls, ci) =>
  Array.from({ length: 30 }, (_, si) => {
    const id = `${cls.id}-${si + 1}`
    return {
      id,
      name: `Student ${String.fromCharCode(65 + (si % 26))}${si + 1} (${cls.name})`,
      rollNo: `${ci + 1}${(si + 1).toString().padStart(2, "0")}`,
      attendance: 70 + ((si * 7 + ci * 3) % 31), // 70-100
      classId: cls.id,
    }
  })
)

// Enhance mockStudents with email and lastLogin
const getRandomDate = () => {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  const date = new Date(now)
  date.setDate(now.getDate() - daysAgo)
  return date
}
const enhancedMockStudents = mockStudents.map(s => ({
  ...s,
  email: `student${s.rollNo}@school.com`,
  lastLogin: getRandomDate(),
}))

function getAttendanceStatus(att: number) {
  if (att >= 90) return { label: "Excellent", color: "bg-green-100 text-green-800 border border-green-200" }
  if (att >= 80) return { label: "Good", color: "bg-blue-100 text-blue-800 border border-blue-200" }
  return { label: "Needs Improvement", color: "bg-red-100 text-red-800 border border-red-200" }
}

function getSubjectColor(subject: string) {
  if (subject === "Mathematics") return "bg-blue-100 text-blue-800"
  if (subject === "Physics") return "bg-green-100 text-green-800"
  if (subject === "Chemistry") return "bg-purple-100 text-purple-800"
  return "bg-gray-100 text-gray-800"
}

const attendanceStatusOptions = [
  { value: "all", label: "All" },
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Needs Improvement", label: "Needs Improvement" },
]

export default function ClassesPage() {
  const [search, setSearch] = useState("")
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<"name" | "rollNo" | "class" | "attendance">("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [attendanceFilter, setAttendanceFilter] = useState("all")
  const [seeMoreClassId, setSeeMoreClassId] = useState<string | null>(null)
  const [seeMoreSearch, setSeeMoreSearch] = useState("")
  const [mainPage, setMainPage] = useState(1)
  const [seeMorePage, setSeeMorePage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const PAGE_SIZE = 20

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  // Calculate stats
  const totalStudents = enhancedMockStudents.length
  const avgAttendance = totalStudents
    ? (enhancedMockStudents.reduce((sum, s) => sum + s.attendance, 0) / totalStudents).toFixed(1)
    : "0"
  
  // Calculate additional stats for better insights
  const excellentStudents = enhancedMockStudents.filter(s => s.attendance >= 90).length
  const needsImprovement = enhancedMockStudents.filter(s => s.attendance < 80).length
  const totalClasses = mockClasses.length

  // Filtered students by search, selected class, and attendance status
  let filteredStudents = enhancedMockStudents.filter(
    (s) =>
      (!selectedClassId || s.classId === selectedClassId) &&
      (
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.includes(search) ||
        (mockClasses.find((c) => c.id === s.classId)?.name.toLowerCase() || "").includes(search.toLowerCase())
      )
  )
  if (attendanceFilter !== "all") {
    filteredStudents = filteredStudents.filter(
      (s) => getAttendanceStatus(s.attendance).label === attendanceFilter
    )
  }

  // Sorting logic
  filteredStudents = [...filteredStudents].sort((a, b) => {
    let valA: any, valB: any
    if (sortKey === "name") {
      valA = a.name.toLowerCase(); valB = b.name.toLowerCase()
    } else if (sortKey === "rollNo") {
      valA = a.rollNo; valB = b.rollNo
    } else if (sortKey === "class") {
      valA = mockClasses.find(c => c.id === a.classId)?.name || ""
      valB = mockClasses.find(c => c.id === b.classId)?.name || ""
    } else if (sortKey === "attendance") {
      valA = a.attendance; valB = b.attendance
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1
    if (valA > valB) return sortDir === "asc" ? 1 : -1
    return 0
  })

  // Pagination for main table
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE)
  const paginatedStudents = filteredStudents.slice((mainPage - 1) * PAGE_SIZE, mainPage * PAGE_SIZE)

  // Reset pagination to page 1 when filters/search/class change
  useEffect(() => { setMainPage(1) }, [search, attendanceFilter, selectedClassId])

  // See More modal logic
  const seeMoreClass = mockClasses.find(c => c.id === seeMoreClassId)
  const seeMoreStudentsAll = enhancedMockStudents.filter(s => s.classId === seeMoreClassId && (
    s.name.toLowerCase().includes(seeMoreSearch.toLowerCase()) ||
    s.rollNo.includes(seeMoreSearch)
  ))
  const seeMoreTotalPages = Math.ceil(seeMoreStudentsAll.length / PAGE_SIZE)
  const seeMoreStudents = seeMoreStudentsAll.slice((seeMorePage - 1) * PAGE_SIZE, seeMorePage * PAGE_SIZE)

  // Download CSV handler
  const handleDownloadCSV = () => {
    const rows = ["Name,Roll No,Class,Attendance (%)"]
    filteredStudents.forEach((s) => {
      const className = mockClasses.find((c) => c.id === s.classId)?.name || "-"
      rows.push(`${s.name},${s.rollNo},${className},${s.attendance}`)
    })
    const csv = rows.join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Sorting UI helper
  const renderSortArrow = (key: string) => {
    if (sortKey !== key) return null
    return sortDir === "asc" ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
  }

  // Helper: is any filter/search active?
  const isFilterActive = search || attendanceFilter !== "all" || selectedClassId

  // Pagination controls component
  function Pagination({ page, totalPages, setPage }: { page: number, totalPages: number, setPage: (p: number) => void }) {
    if (totalPages <= 1) return null
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return (
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1} aria-label="Previous page">Prev</Button>
        {pages.map((p, idx) =>
          p === '...'
            ? <span key={idx} className="px-2 text-gray-400">…</span>
            : <Button
                key={p}
                size="sm"
                variant={p === page ? "default" : "outline"}
                aria-current={p === page ? "page" : undefined}
                onClick={() => setPage(Number(p))}
                className={p === page ? "font-bold ring-2 ring-blue-400" : ""}
              >{p}</Button>
        )}
        <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page === totalPages} aria-label="Next page">Next</Button>
      </nav>
    )
  }

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [search, attendanceFilter, selectedClassId])

  // Enhanced motivational badge
  const getMotivationalBadge = () => {
    if (excellentStudents > totalStudents * 0.7) return "Excellent attendance across all classes! 🎉"
    if (needsImprovement < totalStudents * 0.1) return "Outstanding performance this week! ⭐"
    return `${excellentStudents} students with excellent attendance`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="w-full">
        <TeacherHeader name="Ms. Sarah Johnson" badge={getMotivationalBadge()} />
        
        <div className="flex flex-col lg:flex-row gap-2 p-2 w-full">
        {/* Enhanced Sidebar */}
        <aside className="lg:w-72 w-full lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)] flex-shrink-0 z-30">
          <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                My Classes
              </h2>
              <p className="text-blue-100 text-xs mt-1">Manage your teaching schedule</p>
            </div>
            
            <div className="p-3 space-y-1">
              {/* Mobile dropdown */}
              <div className="lg:hidden mb-3">
                <select
                  value={selectedClassId || ""}
                  onChange={e => setSelectedClassId(e.target.value || null)}
                  className="w-full border-2 border-blue-200 rounded-lg p-2 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  aria-label="Select class"
                >
                  <option value="">All Classes</option>
                  {mockClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name} ({cls.subject})</option>
                  ))}
                </select>
              </div>
              
              {/* Desktop class list */}
              <div className="hidden lg:block space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm relative group ${
                    !selectedClassId 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                      : "hover:bg-blue-50 text-gray-700 border border-transparent hover:border-blue-200"
                  }`}
                  onClick={() => setSelectedClassId(null)}
                  aria-label="Show all classes"
                >
                  {!selectedClassId && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">All Classes</span>
                    <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                      {totalStudents}
                    </Badge>
                  </div>
                </button>
                
                {mockClasses.map(cls => (
                  <button
                    key={cls.id}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm relative group ${
                      selectedClassId === cls.id 
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                        : "hover:bg-blue-50 text-gray-700 border border-transparent hover:border-blue-200"
                    }`}
                    onClick={() => setSelectedClassId(cls.id)}
                    aria-label={`Show students in ${cls.name}`}
                  >
                    {selectedClassId === cls.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-semibold">{cls.name}</div>
                        <div className="text-xs opacity-80">{cls.subject}</div>
                      </div>
                      <Badge variant="secondary" className={selectedClassId === cls.id ? "bg-white/20 text-white text-xs" : "bg-blue-100 text-blue-700 text-xs"}>
                        {cls.students}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 min-w-0 space-y-4 w-full">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-medium">Total Classes</p>
                    <p className="text-2xl font-bold">{totalClasses}</p>
                    <p className="text-blue-200 text-xs">Active classes</p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-full">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-xs font-medium">Total Students</p>
                    <p className="text-2xl font-bold">{totalStudents}</p>
                    <p className="text-emerald-200 text-xs">Enrolled students</p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-full">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-xs font-medium">Avg Attendance</p>
                    <p className="text-2xl font-bold">{avgAttendance}%</p>
                    <p className="text-amber-200 text-xs">Class average</p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-full">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs font-medium">Excellent</p>
                    <p className="text-2xl font-bold">{excellentStudents}</p>
                    <p className="text-purple-200 text-xs">90%+ attendance</p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-full">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Table Section */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                  <div className="relative max-w-sm w-full">
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search students..."
                      className="pl-9 pr-8 py-2 rounded-lg border-2 border-gray-200 bg-white w-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      aria-label="Search students"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label htmlFor="attendance-filter" className="text-sm font-medium text-gray-700">Status:</label>
                    <select
                      id="attendance-filter"
                      value={attendanceFilter}
                      onChange={e => setAttendanceFilter(e.target.value)}
                      className="border-2 border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      aria-label="Filter by attendance status"
                    >
                      {attendanceStatusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {isFilterActive && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setSearch(""); setAttendanceFilter("all"); setSelectedClassId(null); setMainPage(1); }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
                      aria-label="Reset all filters"
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
                
                <Button 
                  onClick={handleDownloadCSV} 
                  variant="outline" 
                  className="flex items-center gap-2 whitespace-nowrap border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                  aria-label="Download CSV"
                >
                  <BarChart3 className="h-4 w-4" /> 
                  Export Data
                </Button>
              </div>
            </div>

            <div className="p-2">
              {/* Premium Enhanced Table */}
              <div className="overflow-hidden rounded-3xl border-0 bg-white shadow-2xl w-full">
                <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
                  <table className="w-full table-fixed">
                    <thead className="sticky top-0 z-20 bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 shadow-xl">
                      <tr className="text-slate-800">
                        <th className="px-3 py-3 text-center font-bold text-sm w-10">#</th>
                        <th
                          className="px-3 py-3 text-left font-bold cursor-pointer select-none text-sm hover:bg-blue-200/50 transition-all duration-300"
                          onClick={() => {
                            if (sortKey === "name") setSortDir(sortDir === "asc" ? "desc" : "asc")
                            else { setSortKey("name"); setSortDir("asc") }
                          }}
                          aria-sort={sortKey === "name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                        >
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-600" />
                            Student {renderSortArrow("name")}
                          </div>
                        </th>
                        <th className="px-3 py-3 text-left font-bold text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-indigo-600" />
                            Email
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 text-center font-bold cursor-pointer select-none text-sm hover:bg-blue-200/50 transition-all duration-300 w-16"
                          onClick={() => {
                            if (sortKey === "rollNo") setSortDir(sortDir === "asc" ? "desc" : "asc")
                            else { setSortKey("rollNo"); setSortDir("asc") }
                          }}
                          aria-sort={sortKey === "rollNo" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Hash className="h-4 w-4 text-purple-600" />
                            Roll {renderSortArrow("rollNo")}
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 text-center font-bold cursor-pointer select-none text-sm hover:bg-blue-200/50 transition-all duration-300 w-20"
                          onClick={() => {
                            if (sortKey === "class") setSortDir(sortDir === "asc" ? "desc" : "asc")
                            else { setSortKey("class"); setSortDir("asc") }
                          }}
                          aria-sort={sortKey === "class" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <BookOpen className="h-4 w-4 text-green-600" />
                            Class {renderSortArrow("class")}
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 text-center font-bold cursor-pointer select-none text-sm hover:bg-blue-200/50 transition-all duration-300 w-20"
                          onClick={() => {
                            if (sortKey === "attendance") setSortDir(sortDir === "asc" ? "desc" : "asc")
                            else { setSortKey("attendance"); setSortDir("asc") }
                          }}
                          aria-sort={sortKey === "attendance" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <BarChart3 className="h-4 w-4 text-orange-600" />
                            Att. {renderSortArrow("attendance")}
                          </div>
                        </th>
                        <th className="px-3 py-3 text-center font-bold text-sm w-24">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-4 w-4 text-gray-600" />
                            Last Login
                          </div>
                        </th>
                        <th className="px-3 py-3 text-center font-bold text-sm w-20">
                          <div className="flex items-center justify-center gap-1">
                            <Activity className="h-4 w-4 text-red-600" />
                            Status
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {isLoading ? (
                        // Enhanced loading skeleton
                        Array.from({ length: 8 }).map((_, idx) => (
                          <tr key={idx} className="animate-pulse">
                            <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-lg w-8 mx-auto"></div></td>
                            <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-lg w-32"></div></td>
                            <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-lg w-40"></div></td>
                            <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-lg w-16 mx-auto"></div></td>
                            <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-lg w-20 mx-auto"></div></td>
                            <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-lg w-16 mx-auto"></div></td>
                            <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-lg w-24 mx-auto"></div></td>
                            <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-lg w-20 mx-auto"></div></td>
                          </tr>
                        ))
                      ) : (
                        paginatedStudents.map((student, idx) => {
                          const className = mockClasses.find(c => c.id === student.classId)?.name || "-"
                          const status = getAttendanceStatus(student.attendance)
                          const isEven = idx % 2 === 0
                          return (
                            <tr
                              key={student.id}
                              className={`group hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer ${
                                isEven ? 'bg-white' : 'bg-slate-50'
                              }`}
                              tabIndex={0}
                            >
                              <td className="px-3 py-3 text-center">
                                <span className="text-slate-600 font-bold text-sm">
                                  {(mainPage - 1) * PAGE_SIZE + idx + 1}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300 shadow-md">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs">
                                      {student.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-sm truncate">
                                      {student.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <span className="text-slate-600 text-sm font-medium truncate block">{student.email}</span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className="text-slate-700 font-mono font-bold text-sm">
                                  {student.rollNo}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className="text-green-700 font-semibold text-sm">
                                  {className}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`text-sm font-bold ${
                                  student.attendance >= 90 ? 'text-green-700' :
                                  student.attendance >= 85 ? 'text-blue-700' :
                                  'text-red-700'
                                }`}>
                                  {student.attendance}%
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <div className="flex items-center justify-center gap-1 text-slate-500 text-sm font-medium">
                                  <Clock className="h-4 w-4" />
                                  {format(student.lastLogin, "MMM d")}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`text-sm font-semibold ${
                                  status.label === 'Excellent' ? 'text-green-700' :
                                  status.label === 'Good' ? 'text-blue-700' :
                                  'text-red-700'
                                }`}>
                                  {status.label}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                      )}
                      
                      {!isLoading && paginatedStudents.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center py-16">
                            <div className="flex flex-col items-center gap-4">
                              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full shadow-lg">
                                <AlertCircle className="h-12 w-12 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No students found</h3>
                                <p className="text-slate-500 text-base">Try adjusting your search or filters</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Enhanced Pagination */}
              <div className="flex justify-center items-center mt-4">
                <Pagination page={mainPage} totalPages={totalPages} setPage={setMainPage} />
              </div>
            </div>
          </Card>
        </main>
      </div>

      {/* Enhanced Modal */}
      <Dialog open={!!seeMoreClassId} onOpenChange={open => { if (!open) setSeeMoreClassId(null) }}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              All Students in {seeMoreClass?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={seeMoreSearch}
                onChange={e => { setSeeMoreSearch(e.target.value); setSeeMorePage(1) }}
                placeholder="Search students in this class..."
                className="pl-9 pr-4 py-2 rounded-lg border-2 border-gray-200 bg-white w-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                aria-label="Search students in modal"
              />
            </div>
            
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
              <div className="max-h-72 overflow-y-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-blue-50/50">
                    <tr className="text-gray-700">
                      <th className="px-3 py-2 text-left font-semibold text-xs">Student</th>
                      <th className="px-3 py-2 text-right font-semibold text-xs">Roll No</th>
                      <th className="px-3 py-2 text-right font-semibold text-xs">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {seeMoreStudents.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">
                                {student.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 text-sm">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-gray-700 text-sm">{student.rollNo}</td>
                        <td className="px-3 py-2 text-right">
                          <Badge variant={student.attendance >= 85 ? "default" : "destructive"} className="text-xs">
                            {student.attendance}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {seeMoreStudents.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-gray-500 text-sm">
                          No students found in this class.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Enhanced Modal Pagination */}
            {seeMoreTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-3 border-t border-gray-100">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSeeMorePage(p => Math.max(1, p - 1))} 
                  disabled={seeMorePage === 1}
                  className="border-2 hover:border-blue-300 hover:bg-blue-50 text-xs"
                >
                  Previous
                </Button>
                <span className="text-xs font-medium text-gray-700">
                  Page {seeMorePage} of {seeMoreTotalPages}
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSeeMorePage(p => Math.min(seeMoreTotalPages, p + 1))} 
                  disabled={seeMorePage === seeMoreTotalPages}
                  className="border-2 hover:border-blue-300 hover:bg-blue-50 text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
          transform: scale(1.1);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f8fafc;
        }
      `}</style>
        </div>
      </div>
    
  )
}
