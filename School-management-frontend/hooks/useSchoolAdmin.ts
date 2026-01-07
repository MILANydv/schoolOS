import { useSchoolAdminStore } from '@/stores/schoolAdminStore'

// Import types from store
type ModalState = {
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  isPreviewModalOpen: boolean
  isDeleteModalOpen: boolean
  selectedItem: any
  editingItem: any
}

// Custom hook for easier access to specific sections
export const useNotifications = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    notifications: store.notifications,
    ui: store.notificationsUI,

    // Actions
    addNotification: store.addNotification,
    updateNotification: store.updateNotification,
    deleteNotification: store.deleteNotification,
    markAsRead: store.markNotificationAsRead,
    bulkMarkAsRead: store.bulkMarkNotificationsAsRead,
    bulkDelete: store.bulkDeleteNotifications,

    // UI Actions
    setSearchTerm: (term: string) => store.setSearchTerm('notificationsUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('notificationsUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('notificationsUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('notificationsUI', page, pageSize),
    setModalState: (updates: any) => store.setModalState('notificationsUI', updates),

    // Computed
    getFiltered: store.getFilteredNotifications,
    getStats: store.getNotificationStats,
  }
}

export const useStudents = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    students: store.students,
    ui: store.studentsUI,

    // Actions
    addStudent: store.addStudent,
    updateStudent: store.updateStudent,
    deleteStudent: store.deleteStudent,
    bulkDelete: store.bulkDeleteStudents,

    // UI Actions
    setSearchTerm: (term: string) => store.setSearchTerm('studentsUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('studentsUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('studentsUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('studentsUI', page, pageSize),
    setModalState: (updates: any) => store.setModalState('studentsUI', updates),

    // Computed
    getFiltered: store.getFilteredStudents,
    getStats: store.getStudentStats,
  }
}

export const useTeachers = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    teachers: store.teachers,
    ui: store.teachersUI,

    // Actions
    addTeacher: store.addTeacher,
    updateTeacher: store.updateTeacher,
    deleteTeacher: store.deleteTeacher,
    bulkDelete: store.bulkDeleteTeachers,

    // UI Actions
    setSearchTerm: (term: string) => store.setSearchTerm('teachersUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('teachersUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('teachersUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('teachersUI', page, pageSize),
    setModalState: (updates: any) => store.setModalState('teachersUI', updates),

    // Computed
    getFiltered: store.getFilteredTeachers,
    getStats: store.getTeacherStats,
  }
}

export const useClasses = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    classes: store.classes,
    ui: store.classesUI,

    // Actions
    addClass: store.addClass,
    updateClass: store.updateClass,
    deleteClass: store.deleteClass,
    bulkDelete: store.bulkDeleteClasses,

    // UI Actions
    setSearchTerm: (term: string) => store.setSearchTerm('classesUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('classesUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('classesUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('classesUI', page, pageSize),
    setModalState: (updates: any) => store.setModalState('classesUI', updates),

    // Computed
    getFiltered: store.getFilteredClasses,
  }
}

export const useFees = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    fees: store.fees,
    ui: store.feesUI,

    // Actions
    addFee: store.addFee,
    updateFee: store.updateFee,
    deleteFee: store.deleteFee,
    recordPayment: store.recordPayment,

    // UI Actions
    setSearchTerm: (term: string) => store.setSearchTerm('feesUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('feesUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('feesUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('feesUI', page, pageSize),
    setModalState: (updates: any) => store.setModalState('feesUI', updates),

    // Computed
    getFiltered: store.getFilteredFees,
  }
}

export const useEvents = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    events: store.events,
    ui: store.eventsUI,

    // Actions
    addEvent: store.addEvent,
    updateEvent: store.updateEvent,
    deleteEvent: store.deleteEvent,
    bulkDelete: store.bulkDeleteEvents,

    // UI Actions
    setSearchTerm: (term: string) => store.setSearchTerm('eventsUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('eventsUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('eventsUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('eventsUI', page, pageSize),
    setModalState: (updates: any) => store.setModalState('eventsUI', updates),

    // Computed
    getFiltered: store.getFilteredEvents,
    getStats: store.getEventStats,
  }
}

export const useLogs = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    logs: store.logs,
    ui: store.logsUI,

    // Actions
    addLog: store.addLog,
    clearLogs: store.clearLogs,

    // UI Actions
    setSearchTerm: (term: string) => store.setSearchTerm('logsUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('logsUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('logsUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('logsUI', page, pageSize),
    setModalState: (updates: any) => store.setModalState('logsUI', updates),

    // Computed
    getFiltered: store.getFilteredLogs,
  }
}

export const useSalaries = () => {
  const store = useSchoolAdminStore()

  return {
    salaries: store.salaries,
    salariesUI: store.salariesUI,
    addSalary: store.addSalary,
    updateSalary: store.updateSalary,
    deleteSalary: store.deleteSalary,
    markSalaryPaid: store.markSalaryPaid,
    setSearchTerm: (term: string) => store.setSearchTerm('salariesUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('salariesUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('salariesUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('salariesUI', page, pageSize),
    setModalState: (updates: Partial<ModalState>) => store.setModalState('salariesUI', updates),
    getFiltered: store.getFilteredSalaries,
    getStats: store.getSalaryStats
  }
}

export const useDashboard = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    metrics: store.dashboardMetrics,

    // Actions
    refreshData: store.refreshDashboardData,
    setMetrics: store.setDashboardMetrics,

    // Computed
    getStats: store.getDashboardStats,
  }
}

export const useAdmissions = () => {
  const store = useSchoolAdminStore()

  return {
    // Data
    admissions: store.admissions,
    ui: store.admissionsUI,

    // Actions
    setAdmissions: store.setAdmissions,
    addAdmission: store.addAdmission,
    updateAdmission: store.updateAdmission,
    deleteAdmission: store.deleteAdmission,
    bulkDelete: store.bulkDeleteAdmissions,

    // UI Actions
    setSearchTerm: (term: string) => store.setSearchTerm('admissionsUI', term),
    setFilters: (filters: Record<string, any>) => store.setFilters('admissionsUI', filters),
    setSelectedItems: (items: string[]) => store.setSelectedItems('admissionsUI', items),
    setPagination: (page: number, pageSize?: number) => store.setPagination('admissionsUI', page, pageSize),
    setModalState: (updates: any) => store.setModalState('admissionsUI', updates),

    // Computed
    getFiltered: store.getFilteredAdmissions,
  }
}

// Main hook that provides everything
export const useSchoolAdmin = () => {
  const store = useSchoolAdminStore()

  return {
    // Auth
    currentUser: store.currentUser,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    logout: store.logout,

    // Section-specific hooks
    notifications: useNotifications(),
    students: useStudents(),
    teachers: useTeachers(),
    classes: useClasses(),
    fees: useFees(),
    events: useEvents(),
    logs: useLogs(),
    admissions: useAdmissions(),
    dashboard: useDashboard(),
  }
}