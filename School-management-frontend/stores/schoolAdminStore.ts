import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { authApi, studentsApi, classesApi, attendanceApi, feesApi, teachersApi, notificationsApi, dashboardApi, admissionsApi } from '@/lib/api'

// Types for different sections
interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface Notification {
  id: string
  title: string
  content: string
  type: "info" | "success" | "warning" | "error"
  priority: "low" | "medium" | "high" | "urgent"
  audience: Array<"School Admin" | "Teacher" | "Parent" | "Student" | "All">
  scheduledDate: Date
  status: "draft" | "scheduled" | "sent" | "failed"
  isRead: boolean
  readCount: number
  totalRecipients: number
  sentBy?: string
  createdAt: Date
  updatedAt: Date
  actionLink?: string
  actionText?: string
}

interface Student {
  id: string
  name: string
  email: string
  phone: string
  class: string
  rollNumber: string
  gender: string
  dateOfBirth: string
  admissionDate: string
  status: string
  parentName: string
  parentContact: string
  parentPhone: string
  parentEmail: string
  emergencyContact: string
  bloodGroup: string
  address: string
  remarks: string
  attendance: number
  performance: number
  grade?: string
  fees: {
    total: number
    paid: number
    due: number
    dueDate: string
  }
}

interface Teacher {
  id: string
  name: string
  email: string
  subject: string
  department: string
  status: string
  joinDate: string
  phone: string
  experience: number
  qualification: string
  role?: string
}

interface Class {
  id: string
  name: string
  section: string
  grade: string
  capacity: number
  enrolled: number
  classTeacher: string
  subjects: string[]
  department: string
  roomNo: string
  schedule: string
  status: string
  averageAttendance: number
  performance: number
  academicYear: string
  createdAt: string
}

interface Fee {
  id: string
  studentId: string
  student: string
  class: string
  feeType: string
  amount: number
  paid: number
  due: number
  status: 'Paid' | 'Partial' | 'Due' | 'Overdue'
  dueDate: string
  lastPayment?: string
  paymentMethod?: string
  installments?: number
  currentInstallment?: number
  lateFee?: number
  discount?: number
  scholarshipAmount?: number
  parentContact?: string
  notes?: string
}

interface Salary {
  id: string
  staffId: string
  period: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
  paidDate?: string
  remarks?: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'
  audience: 'Students' | 'Teachers' | 'Parents' | 'All'
  createdBy?: string
  createdAt?: string
  type: 'Academic' | 'Sports' | 'Cultural' | 'Meeting' | 'Holiday' | 'Other'
  priority: 'Low' | 'Medium' | 'High'
  capacity?: number
  registeredCount?: number
}

interface Admission {
  id: string
  applicantName: string
  gradeApplyingFor: string
  applicationDate: string
  status: string
  contact: string
  notes?: string
  statusHistory?: { status: string; date: string; by: string; note?: string }[]
  schoolId: string
  createdAt: string
  updatedAt: string
}

interface LogEntry {
  id: string
  timestamp: Date
  user: string
  userName: string
  role: string
  module: string
  action: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  ipAddress: string
  userAgent: string
  sessionId: string
  details: string
  status: 'success' | 'failed' | 'pending'
}

interface DashboardMetric {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  description: string
  icon: any
  href: string
  gradient: string
  target: number
  current: number
  details: string
}

interface DashboardMetrics {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalRevenue: number
  pendingAdmissions: number
  attendanceRate: number
  performanceAverage: number
  upcomingEvents: number
  metrics: DashboardMetric[]
}

// UI State interfaces
interface UIState {
  isLoading: boolean
  selectedItems: string[]
  currentPage: number
  pageSize: number
  searchTerm: string
  sortBy: string
  sortDirection: 'asc' | 'desc'
  filters: Record<string, any>
}

interface ModalState {
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  isPreviewModalOpen: boolean
  isDeleteModalOpen: boolean
  selectedItem: any
  editingItem: any
}

// Main Store Interface
interface SchoolAdminStore {
  // User & Auth
  currentUser: User | null
  isAuthenticated: boolean

  // Data States
  notifications: Notification[]
  students: Student[]
  teachers: Teacher[]
  classes: Class[]
  fees: Fee[]
  salaries: Salary[]
  events: Event[]
  admissions: Admission[]
  logs: LogEntry[]
  dashboardMetrics: DashboardMetrics

  // UI States for different sections
  notificationsUI: UIState & ModalState
  studentsUI: UIState & ModalState
  teachersUI: UIState & ModalState
  classesUI: UIState & ModalState
  feesUI: UIState & ModalState
  salariesUI: UIState & ModalState
  eventsUI: UIState & ModalState
  admissionsUI: UIState & ModalState
  logsUI: UIState & ModalState

  // Actions
  // Auth Actions
  setCurrentUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void

  // Notification Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  updateNotification: (id: string, updates: Partial<Notification>) => void
  deleteNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
  bulkMarkNotificationsAsRead: (ids: string[]) => void
  bulkDeleteNotifications: (ids: string[]) => void

  // Student Actions
  setStudents: (students: Student[]) => void
  addStudent: (student: Student) => void
  updateStudent: (id: string, updates: Partial<Student>) => void
  deleteStudent: (id: string) => void
  bulkDeleteStudents: (ids: string[]) => void

  // Teacher Actions
  setTeachers: (teachers: Teacher[]) => void
  addTeacher: (teacher: Teacher) => void
  updateTeacher: (id: string, updates: Partial<Teacher>) => void
  deleteTeacher: (id: string) => void
  bulkDeleteTeachers: (ids: string[]) => void

  // Class Actions
  setClasses: (classes: Class[]) => void
  addClass: (classItem: Class) => void
  updateClass: (id: string, updates: Partial<Class>) => void
  deleteClass: (id: string) => void
  bulkDeleteClasses: (ids: string[]) => void

  // Fee Actions
  setFees: (fees: Fee[]) => void
  addFee: (fee: Fee) => void
  updateFee: (id: string, updates: Partial<Fee>) => void
  deleteFee: (id: string) => void
  recordPayment: (id: string, amount: number, method: string) => void

  // Salary Actions
  setSalaries: (salaries: Salary[]) => void
  addSalary: (salary: Salary) => void
  updateSalary: (id: string, updates: Partial<Salary>) => void
  deleteSalary: (id: string) => void
  markSalaryPaid: (id: string, paidDate: string, remarks?: string) => void

  // Event Actions
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void
  bulkDeleteEvents: (ids: string[]) => void

  // Admission Actions
  setAdmissions: (admissions: Admission[]) => void
  addAdmission: (admission: Admission) => void
  updateAdmission: (id: string, updates: Partial<Admission>) => void
  deleteAdmission: (id: string) => void
  bulkDeleteAdmissions: (ids: string[]) => void

  // Log Actions
  setLogs: (logs: LogEntry[]) => void
  addLog: (log: LogEntry) => void
  clearLogs: () => void

  // Dashboard Actions
  setDashboardMetrics: (metrics: DashboardMetrics) => void
  refreshDashboardData: () => Promise<void>

  // UI Actions - Generic for all sections
  setUIState: (section: keyof Pick<SchoolAdminStore, 'notificationsUI' | 'studentsUI' | 'teachersUI' | 'classesUI' | 'feesUI' | 'salariesUI' | 'eventsUI' | 'logsUI' | 'admissionsUI'>, updates: Partial<UIState>) => void
  setModalState: (section: keyof Pick<SchoolAdminStore, 'notificationsUI' | 'studentsUI' | 'teachersUI' | 'classesUI' | 'feesUI' | 'salariesUI' | 'eventsUI' | 'logsUI' | 'admissionsUI'>, updates: Partial<ModalState>) => void
  setSelectedItems: (section: keyof Pick<SchoolAdminStore, 'notificationsUI' | 'studentsUI' | 'teachersUI' | 'classesUI' | 'feesUI' | 'salariesUI' | 'eventsUI' | 'logsUI' | 'admissionsUI'>, items: string[]) => void
  setSearchTerm: (section: keyof Pick<SchoolAdminStore, 'notificationsUI' | 'studentsUI' | 'teachersUI' | 'classesUI' | 'feesUI' | 'salariesUI' | 'eventsUI' | 'logsUI' | 'admissionsUI'>, term: string) => void
  setFilters: (section: keyof Pick<SchoolAdminStore, 'notificationsUI' | 'studentsUI' | 'teachersUI' | 'classesUI' | 'feesUI' | 'salariesUI' | 'eventsUI' | 'logsUI' | 'admissionsUI'>, filters: Record<string, any>) => void
  setPagination: (section: keyof Pick<SchoolAdminStore, 'notificationsUI' | 'studentsUI' | 'teachersUI' | 'classesUI' | 'feesUI' | 'salariesUI' | 'eventsUI' | 'logsUI' | 'admissionsUI'>, page: number, pageSize?: number) => void

  // Computed selectors
  getFilteredNotifications: () => Notification[]
  getFilteredStudents: () => Student[]
  getFilteredTeachers: () => Teacher[]
  getFilteredClasses: () => Class[]
  getFilteredFees: () => Fee[]
  getFilteredSalaries: () => Salary[]
  getFilteredEvents: () => Event[]
  getFilteredAdmissions: () => Admission[]
  getFilteredLogs: () => LogEntry[]

  // Statistics selectors
  getNotificationStats: () => {
    total: number
    sent: number
    unread: number
    drafts: number
  }
  getStudentStats: () => {
    total: number
    active: number
    inactive: number
    graduated: number
    suspended: number
    newThisMonth: number
    newThisYear: number
    averageAttendance: number
    topPerformers: number
    needsAttention: number
  }
  getTeacherStats: () => {
    total: number
    active: number
    inactive: number
    newThisMonth: number
    averageExperience: number
    byDepartment: Record<string, number>
  }
  getSalaryStats: () => {
    total: number
    totalAmount: number
    totalPaid: number
    totalPending: number
    totalOverdue: number
    paidCount: number
    pendingCount: number
    overdueCount: number
    paymentRate: number
    averageSalary: number
  }
  getClassStats: () => {
    total: number
    active: number
    averageEnrollment: number
    averageAttendance: number
    byGrade: Record<string, number>
  }
  getFeeStats: () => {
    total: number
    totalAmount: number
    totalPaid: number
    totalDue: number
    paidCount: number
    dueCount: number
    overdueCount: number
    collectionRate: number
  }
  getEventStats: () => {
    total: number
    upcoming: number
    ongoing: number
    completed: number
    cancelled: number
    byType: Record<string, number>
  }
  getLogStats: () => {
    total: number
    today: number
    thisWeek: number
    bySeverity: Record<string, number>
    byModule: Record<string, number>
  }
  getDashboardStats: () => DashboardMetrics
}

const defaultUIState: UIState = {
  isLoading: false,
  selectedItems: [],
  currentPage: 1,
  pageSize: 10,
  searchTerm: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  filters: {}
}

const defaultModalState: ModalState = {
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isPreviewModalOpen: false,
  isDeleteModalOpen: false,
  selectedItem: null,
  editingItem: null
}

export const useSchoolAdminStore = create<SchoolAdminStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        currentUser: null,
        isAuthenticated: false,

        notifications: [],
        students: [],
        teachers: [],
        classes: [],
        fees: [],
        salaries: [],
        events: [],
        admissions: [],
        logs: [],
        dashboardMetrics: {
          totalStudents: 0,
          totalTeachers: 0,
          totalClasses: 0,
          totalRevenue: 0,
          pendingAdmissions: 0,
          attendanceRate: 0,
          performanceAverage: 0,
          upcomingEvents: 0,
          metrics: []
        },

        // UI States
        notificationsUI: { ...defaultUIState, ...defaultModalState },
        studentsUI: { ...defaultUIState, ...defaultModalState },
        teachersUI: { ...defaultUIState, ...defaultModalState },
        classesUI: { ...defaultUIState, ...defaultModalState },
        feesUI: { ...defaultUIState, ...defaultModalState },
        salariesUI: { ...defaultUIState, ...defaultModalState },
        eventsUI: { ...defaultUIState, ...defaultModalState },
        admissionsUI: { ...defaultUIState, ...defaultModalState },
        logsUI: { ...defaultUIState, ...defaultModalState },

        // Auth Actions
        setCurrentUser: (user) => set((state) => {
          state.currentUser = user
          state.isAuthenticated = !!user
        }),

        login: async (email, password) => {
          try {
            const response = await authApi.login({ email, password })
            if (response.success) {
              const { token, user } = response.data
              localStorage.setItem('token', token)

              // Map API user to store user format
              const storeUser: User = {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role,
                avatar: '/avatars/default.png' // Default avatar
              }

              get().setCurrentUser(storeUser)
              return true
            }
            return false
          } catch (error) {
            console.error('Login failed:', error)
            return false
          }
        },

        logout: async () => {
          try {
            await authApi.logout()
          } catch (error) {
            console.error('Logout failed:', error)
          }

          set((state) => {
            state.currentUser = null
            state.isAuthenticated = false
          })
          localStorage.removeItem('token')
        },

        // Notification Actions
        setNotifications: (notifications) => set((state) => {
          state.notifications = notifications
        }),

        addNotification: (notification) => set((state) => {
          state.notifications.unshift(notification)
        }),

        updateNotification: (id, updates) => set((state) => {
          const index = state.notifications.findIndex(n => n.id === id)
          if (index !== -1) {
            state.notifications[index] = { ...state.notifications[index], ...updates, updatedAt: new Date() }
          }
        }),

        deleteNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id)
        }),

        markNotificationAsRead: (id) => set((state) => {
          const notification = state.notifications.find(n => n.id === id)
          if (notification) {
            notification.isRead = true
          }
        }),

        bulkMarkNotificationsAsRead: (ids) => set((state) => {
          ids.forEach(id => {
            const notification = state.notifications.find(n => n.id === id)
            if (notification) {
              notification.isRead = true
            }
          })
        }),

        bulkDeleteNotifications: (ids) => set((state) => {
          state.notifications = state.notifications.filter(n => !ids.includes(n.id))
        }),

        // Student Actions
        setStudents: (students) => set((state) => {
          state.students = students
        }),

        addStudent: (student) => set((state) => {
          state.students.unshift(student)
        }),

        updateStudent: (id, updates) => set((state) => {
          const index = state.students.findIndex(s => s.id === id)
          if (index !== -1) {
            state.students[index] = { ...state.students[index], ...updates }
          }
        }),

        deleteStudent: (id) => set((state) => {
          state.students = state.students.filter(s => s.id !== id)
        }),

        bulkDeleteStudents: (ids) => set((state) => {
          state.students = state.students.filter(s => !ids.includes(s.id))
        }),

        // Teacher Actions
        setTeachers: (teachers) => set((state) => {
          state.teachers = teachers
        }),

        addTeacher: (teacher) => set((state) => {
          state.teachers.unshift(teacher)
        }),

        updateTeacher: (id, updates) => set((state) => {
          const index = state.teachers.findIndex(t => t.id === id)
          if (index !== -1) {
            state.teachers[index] = { ...state.teachers[index], ...updates }
          }
        }),

        deleteTeacher: (id) => set((state) => {
          state.teachers = state.teachers.filter(t => t.id !== id)
        }),

        bulkDeleteTeachers: (ids) => set((state) => {
          state.teachers = state.teachers.filter(t => !ids.includes(t.id))
        }),

        // Class Actions
        setClasses: (classes) => set((state) => {
          state.classes = classes
        }),

        addClass: (classItem) => set((state) => {
          state.classes.unshift(classItem)
        }),

        updateClass: (id, updates) => set((state) => {
          const index = state.classes.findIndex(c => c.id === id)
          if (index !== -1) {
            state.classes[index] = { ...state.classes[index], ...updates }
          }
        }),

        deleteClass: (id) => set((state) => {
          state.classes = state.classes.filter(c => c.id !== id)
        }),

        bulkDeleteClasses: (ids) => set((state) => {
          state.classes = state.classes.filter(c => !ids.includes(c.id))
        }),

        // Fee Actions
        setFees: (fees) => set((state) => {
          state.fees = fees
        }),

        addFee: (fee) => set((state) => {
          state.fees.unshift(fee)
        }),

        updateFee: (id, updates) => set((state) => {
          const index = state.fees.findIndex(f => f.id === id)
          if (index !== -1) {
            state.fees[index] = { ...state.fees[index], ...updates }
          }
        }),

        deleteFee: (id) => set((state) => {
          state.fees = state.fees.filter(f => f.id !== id)
        }),

        recordPayment: (id, amount, method) => set((state) => {
          const fee = state.fees.find(f => f.id === id)
          if (fee) {
            fee.paid += amount
            fee.due = Math.max(0, fee.amount - fee.paid)
            fee.status = fee.due === 0 ? 'Paid' : 'Partial'
            fee.lastPayment = new Date().toISOString()
            fee.paymentMethod = method
          }
        }),

        // Salary Actions
        setSalaries: (salaries) => set((state) => {
          state.salaries = salaries
        }),

        addSalary: (salary) => set((state) => {
          state.salaries.unshift(salary)
        }),

        updateSalary: (id, updates) => set((state) => {
          const index = state.salaries.findIndex(s => s.id === id)
          if (index !== -1) {
            state.salaries[index] = { ...state.salaries[index], ...updates }
          }
        }),

        deleteSalary: (id) => set((state) => {
          state.salaries = state.salaries.filter(s => s.id !== id)
        }),

        markSalaryPaid: (id, paidDate, remarks) => set((state) => {
          const salary = state.salaries.find(s => s.id === id)
          if (salary) {
            salary.status = 'Paid'
            salary.paidDate = paidDate
            salary.remarks = remarks
          }
        }),

        // Event Actions
        setEvents: (events) => set((state) => {
          state.events = events
        }),

        addEvent: (event) => set((state) => {
          state.events.unshift(event)
        }),

        updateEvent: (id, updates) => set((state) => {
          const index = state.events.findIndex(e => e.id === id)
          if (index !== -1) {
            state.events[index] = { ...state.events[index], ...updates }
          }
        }),

        deleteEvent: (id) => set((state) => {
          state.events = state.events.filter(e => e.id !== id)
        }),

        bulkDeleteEvents: (ids) => set((state) => {
          state.events = state.events.filter(e => !ids.includes(e.id))
        }),

        // Admission Actions
        setAdmissions: (admissions) => set((state) => {
          state.admissions = admissions
        }),

        addAdmission: (admission) => set((state) => {
          state.admissions.unshift(admission)
        }),

        updateAdmission: (id, updates) => set((state) => {
          const index = state.admissions.findIndex(a => a.id === id)
          if (index !== -1) {
            state.admissions[index] = { ...state.admissions[index], ...updates }
          }
        }),

        deleteAdmission: (id) => set((state) => {
          state.admissions = state.admissions.filter(a => a.id !== id)
        }),

        bulkDeleteAdmissions: (ids) => set((state) => {
          state.admissions = state.admissions.filter(a => !ids.includes(a.id))
        }),

        // Log Actions
        setLogs: (logs) => set((state) => {
          state.logs = logs
        }),

        addLog: (log) => set((state) => {
          state.logs.unshift(log)
        }),

        clearLogs: () => set((state) => {
          state.logs = []
        }),

        // Dashboard Actions
        setDashboardMetrics: (metrics) => set((state) => {
          state.dashboardMetrics = metrics
        }),

        refreshDashboardData: async () => {
          // Mock refresh - replace with actual API calls
          const state = get()

          // Calculate basic metrics
          const totalStudents = state.students.length || 1247
          const totalTeachers = state.teachers.length || 78
          const totalRevenue = state.fees.reduce((sum, fee) => sum + fee.paid, 0) || 89500
          const pendingAdmissions = state.students.filter(s => s.status === 'Pending').length || 42
          const attendanceRate = state.students.reduce((sum, s) => sum + s.attendance, 0) / state.students.length || 94.2
          const upcomingEvents = state.events.filter(e => e.status === 'Upcoming').length || 12

          // Create dashboard metrics array
          const dashboardMetrics = [
            {
              title: "Total Students",
              value: totalStudents.toLocaleString(),
              change: "+23",
              changeType: "increase" as const,
              description: "Active enrollment",
              icon: null, // Will be set in component
              href: "/schooladmin/students",
              gradient: "from-blue-500 to-blue-600",
              target: 1300,
              current: totalStudents,
              details: `${totalStudents} enrolled • 23 new this month`
            },
            {
              title: "Active Teachers",
              value: totalTeachers.toString(),
              change: "+3",
              changeType: "increase" as const,
              description: "Faculty members",
              icon: null,
              href: "/schooladmin/staff/management",
              gradient: "from-green-500 to-green-600",
              target: 80,
              current: totalTeachers,
              details: `${totalTeachers} active • 3 new hires`
            },
            {
              title: "Fee Collection",
              value: `$${totalRevenue.toLocaleString()}`,
              change: "+12.5%",
              changeType: "increase" as const,
              description: "This month",
              icon: null,
              href: "/schooladmin/fees",
              gradient: "from-purple-500 to-purple-600",
              target: 95000,
              current: totalRevenue,
              details: `$${totalRevenue.toLocaleString()} collected • $5,500 pending`
            },
            {
              title: "Attendance Rate",
              value: `${attendanceRate.toFixed(1)}%`,
              change: "+2.1%",
              changeType: "increase" as const,
              description: "This week",
              icon: null,
              href: "/schooladmin/attendance",
              gradient: "from-orange-500 to-orange-600",
              target: 95,
              current: attendanceRate,
              details: `${attendanceRate.toFixed(1)}% average • Excellent performance`
            },
            {
              title: "Pending Admissions",
              value: pendingAdmissions.toString(),
              change: "+8",
              changeType: "increase" as const,
              description: "Awaiting review",
              icon: null,
              href: "/schooladmin/admissions",
              gradient: "from-indigo-500 to-indigo-600",
              target: 50,
              current: pendingAdmissions,
              details: `${pendingAdmissions} pending • 8 new applications`
            },
            {
              title: "Upcoming Events",
              value: upcomingEvents.toString(),
              change: "+4",
              changeType: "increase" as const,
              description: "Next 30 days",
              icon: null,
              href: "/schooladmin/events",
              gradient: "from-pink-500 to-pink-600",
              target: 15,
              current: upcomingEvents,
              details: `${upcomingEvents} scheduled • 4 newly added`
            }
          ]

          const metrics: DashboardMetrics = {
            totalStudents,
            totalTeachers,
            totalClasses: state.classes.length,
            totalRevenue,
            pendingAdmissions,
            attendanceRate,
            performanceAverage: state.students.reduce((sum, s) => sum + s.performance, 0) / state.students.length || 0,
            upcomingEvents,
            metrics: dashboardMetrics
          }

          state.setDashboardMetrics(metrics)
        },

        // UI Actions
        setUIState: (section, updates) => set((state) => {
          Object.assign(state[section], updates)
        }),

        setModalState: (section, updates) => set((state) => {
          Object.assign(state[section], updates)
        }),

        setSelectedItems: (section, items) => set((state) => {
          state[section].selectedItems = items
        }),

        setSearchTerm: (section, term) => set((state) => {
          state[section].searchTerm = term
          state[section].currentPage = 1 // Reset to first page on search
        }),

        setFilters: (section, filters) => set((state) => {
          state[section].filters = { ...state[section].filters, ...filters }
          state[section].currentPage = 1 // Reset to first page on filter change
        }),

        setPagination: (section, page, pageSize) => set((state) => {
          state[section].currentPage = page
          if (pageSize) {
            state[section].pageSize = pageSize
          }
        }),

        // Computed Selectors
        getFilteredNotifications: () => {
          const state = get()
          const { searchTerm, filters } = state.notificationsUI

          return state.notifications.filter(notification => {
            // Search filter
            const matchesSearch = !searchTerm ||
              notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              notification.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
              notification.sentBy?.toLowerCase().includes(searchTerm.toLowerCase())

            // Role filter
            const matchesRole = !filters.role || filters.role === 'all' ||
              notification.audience.includes(filters.role) ||
              notification.audience.includes('All')

            // Type filter
            const matchesType = !filters.type || filters.type === 'all' ||
              notification.type === filters.type

            // Status filter
            const matchesStatus = !filters.status || filters.status === 'all' ||
              notification.status === filters.status

            return matchesSearch && matchesRole && matchesType && matchesStatus
          })
        },

        getFilteredStudents: () => {
          const state = get()
          const { searchTerm, filters } = state.studentsUI

          return state.students.filter(student => {
            const matchesSearch = !searchTerm ||
              student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.parentName?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = !filters.status || filters.status === 'all' ||
              student.status === filters.status

            const matchesClass = !filters.class || filters.class === 'all' ||
              student.class === filters.class

            const matchesGender = !filters.gender || filters.gender === 'all' ||
              student.gender === filters.gender

            const matchesAdmissionDate = !filters.admissionDate ||
              new Date(student.admissionDate).toDateString() === new Date(filters.admissionDate).toDateString()

            return matchesSearch && matchesStatus && matchesClass && matchesGender && matchesAdmissionDate
          })
        },

        getFilteredTeachers: () => {
          const state = get()
          const { searchTerm, filters } = state.teachersUI

          return state.teachers.filter(teacher => {
            const matchesSearch = !searchTerm ||
              teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = !filters.status || filters.status === 'all' ||
              teacher.status === filters.status

            const matchesDepartment = !filters.department || filters.department === 'all' ||
              teacher.department === filters.department

            return matchesSearch && matchesStatus && matchesDepartment
          })
        },

        getFilteredClasses: () => {
          const state = get()
          const { searchTerm, filters } = state.classesUI

          return state.classes.filter(classItem => {
            const matchesSearch = !searchTerm ||
              classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              classItem.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
              classItem.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = !filters.status || filters.status === 'all' ||
              classItem.status === filters.status

            const matchesGrade = !filters.grade || filters.grade === 'all' ||
              classItem.grade === filters.grade

            return matchesSearch && matchesStatus && matchesGrade
          })
        },

        getFilteredFees: () => {
          const state = get()
          const { searchTerm, filters } = state.feesUI

          return state.fees.filter(fee => {
            const matchesSearch = !searchTerm ||
              fee.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
              fee.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
              fee.feeType.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = !filters.status || filters.status === 'all' ||
              fee.status === filters.status

            const matchesClass = !filters.class || filters.class === 'all' ||
              fee.class === filters.class

            return matchesSearch && matchesStatus && matchesClass
          })
        },

        getFilteredSalaries: () => {
          const state = get()
          const { searchTerm, filters } = state.salariesUI

          return state.salaries.filter(salary => {
            const matchesSearch = !searchTerm ||
              salary.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
              salary.period.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = !filters.status || filters.status === 'all' ||
              salary.status === filters.status

            return matchesSearch && matchesStatus
          })
        },

        getFilteredEvents: () => {
          const state = get()
          const { searchTerm, filters } = state.eventsUI

          return state.events.filter(event => {
            // Search filter
            const matchesSearch = !searchTerm ||
              event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.location.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = !filters.status || filters.status === 'all' ||
              event.status === filters.status

            const matchesType = !filters.type || filters.type === 'all' ||
              event.type === filters.type

            const matchesAudience = !filters.audience || filters.audience === 'all' ||
              event.audience === filters.audience

            return matchesSearch && matchesStatus && matchesType && matchesAudience
          })
        },

        getFilteredAdmissions: () => {
          const state = get()
          const { searchTerm, filters } = state.admissionsUI

          return state.admissions.filter(admission => {
            // Search filter
            const matchesSearch = !searchTerm ||
              admission.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              admission.contact.toLowerCase().includes(searchTerm.toLowerCase())

            // Status filter
            const matchesStatus = !filters.status || filters.status === 'all' ||
              admission.status === filters.status

            // Grade filter
            const matchesGrade = !filters.grade || filters.grade === 'all' ||
              admission.gradeApplyingFor === filters.grade

            return matchesSearch && matchesStatus && matchesGrade
          })
        },

        getFilteredLogs: () => {
          const state = get()
          const { searchTerm, filters } = state.logsUI

          return state.logs.filter(log => {
            const matchesSearch = !searchTerm ||
              log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
              log.module.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesSeverity = !filters.severity || filters.severity === 'all' ||
              log.severity === filters.severity

            const matchesModule = !filters.module || filters.module === 'all' ||
              log.module === filters.module

            const matchesStatus = !filters.status || filters.status === 'all' ||
              log.status === filters.status

            return matchesSearch && matchesSeverity && matchesModule && matchesStatus
          })
        },

        // Statistics Selectors
        getNotificationStats: () => {
          const state = get()
          const notifications = state.notifications

          return {
            total: notifications.length,
            sent: notifications.filter(n => n.status === 'sent').length,
            unread: notifications.filter(n => !n.isRead && n.status === 'sent').length,
            drafts: notifications.filter(n => n.status === 'draft').length
          }
        },

        getStudentStats: () => {
          const state = get()
          const students = state.students
          const now = new Date()
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          const thisYear = new Date(now.getFullYear(), 0, 1)

          return {
            total: students.length,
            active: students.filter(s => s.status === 'Active').length,
            inactive: students.filter(s => s.status === 'Inactive').length,
            graduated: students.filter(s => s.status === 'Graduated').length,
            suspended: students.filter(s => s.status === 'Suspended').length,
            newThisMonth: students.filter(s => new Date(s.admissionDate) >= thisMonth).length,
            newThisYear: students.filter(s => new Date(s.admissionDate) >= thisYear).length,
            averageAttendance: students.length > 0 ? students.reduce((sum, s) => sum + s.attendance, 0) / students.length : 0,
            topPerformers: students.filter(s => s.performance >= 85).length,
            needsAttention: students.filter(s => s.attendance < 75 || s.performance < 60).length
          }
        },

        getTeacherStats: () => {
          const state = get()
          const teachers = state.teachers
          const now = new Date()
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

          const byDepartment = teachers.reduce((acc, teacher) => {
            acc[teacher.department] = (acc[teacher.department] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          return {
            total: teachers.length,
            active: teachers.filter(t => t.status === 'Active').length,
            inactive: teachers.filter(t => t.status === 'Inactive').length,
            newThisMonth: teachers.filter(t => new Date(t.joinDate) >= thisMonth).length,
            averageExperience: teachers.length > 0 ? teachers.reduce((sum, t) => sum + t.experience, 0) / teachers.length : 0,
            byDepartment
          }
        },

        getSalaryStats: () => {
          const state = get()
          const salaries = state.salaries

          const totalAmount = salaries.reduce((sum, salary) => sum + salary.amount, 0)
          const totalPaid = salaries.reduce((sum, salary) => sum + (salary.status === 'Paid' ? salary.amount : 0), 0)
          const totalPending = salaries.reduce((sum, salary) => sum + (salary.status === 'Pending' ? salary.amount : 0), 0)
          const totalOverdue = salaries.reduce((sum, salary) => sum + (salary.status === 'Overdue' ? salary.amount : 0), 0)

          return {
            total: salaries.length,
            totalAmount,
            totalPaid,
            totalPending,
            totalOverdue,
            paidCount: salaries.filter(s => s.status === 'Paid').length,
            pendingCount: salaries.filter(s => s.status === 'Pending').length,
            overdueCount: salaries.filter(s => s.status === 'Overdue').length,
            paymentRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0,
            averageSalary: totalAmount / salaries.length || 0
          }
        },

        getClassStats: () => {
          const state = get()
          const classes = state.classes

          const byGrade = classes.reduce((acc, classItem) => {
            acc[classItem.grade] = (acc[classItem.grade] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          return {
            total: classes.length,
            active: classes.filter(c => c.status === 'Active').length,
            averageEnrollment: classes.length > 0 ? classes.reduce((sum, c) => sum + c.enrolled, 0) / classes.length : 0,
            averageAttendance: classes.length > 0 ? classes.reduce((sum, c) => sum + c.averageAttendance, 0) / classes.length : 0,
            byGrade
          }
        },

        getFeeStats: () => {
          const state = get()
          const fees = state.fees

          const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0)
          const totalPaid = fees.reduce((sum, fee) => sum + fee.paid, 0)
          const totalDue = fees.reduce((sum, fee) => sum + fee.due, 0)

          return {
            total: fees.length,
            totalAmount,
            totalPaid,
            totalDue,
            paidCount: fees.filter(f => f.status === 'Paid').length,
            dueCount: fees.filter(f => f.status === 'Due').length,
            overdueCount: fees.filter(f => f.status === 'Overdue').length,
            collectionRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0
          }
        },

        getEventStats: () => {
          const state = get()
          const events = state.events

          const byType = events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          return {
            total: events.length,
            upcoming: events.filter(e => e.status === 'Upcoming').length,
            ongoing: events.filter(e => e.status === 'Ongoing').length,
            completed: events.filter(e => e.status === 'Completed').length,
            cancelled: events.filter(e => e.status === 'Cancelled').length,
            byType
          }
        },

        getLogStats: () => {
          const state = get()
          const logs = state.logs
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

          const bySeverity = logs.reduce((acc, log) => {
            acc[log.severity] = (acc[log.severity] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          const byModule = logs.reduce((acc, log) => {
            acc[log.module] = (acc[log.module] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          return {
            total: logs.length,
            today: logs.filter(log => log.timestamp >= today).length,
            thisWeek: logs.filter(log => log.timestamp >= thisWeek).length,
            bySeverity,
            byModule
          }
        },

        getDashboardStats: () => {
          const state = get()
          return state.dashboardMetrics
        }
      })),
      {
        name: 'school-admin-store',
        partialize: (state) => ({
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
          // Don't persist UI states, only data
          notifications: state.notifications,
          students: state.students,
          teachers: state.teachers,
          classes: state.classes,
          fees: state.fees,
          events: state.events,
          admissions: state.admissions,
          dashboardMetrics: state.dashboardMetrics
        })
      }
    ),
    {
      name: 'school-admin-store'
    }
  )
)