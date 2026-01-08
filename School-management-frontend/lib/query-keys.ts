// ============================================
// Query Keys Constants for React Query
// ============================================

// Base keys for all entities
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
    profile: ['auth', 'profile'] as const,
  },

  // Students
  students: {
    all: ['students'] as const,
    list: (filters?: Record<string, unknown>) => ['students', 'list', filters] as const,
    detail: (id: string) => ['students', 'detail', id] as const,
    stats: ['students', 'stats'] as const,
    attendance: (id: string) => ['students', 'attendance', id] as const,
    fees: (id: string) => ['students', 'fees', id] as const,
    performance: (id: string) => ['students', 'performance', id] as const,
  },

  // Teachers
  teachers: {
    all: ['teachers'] as const,
    list: (filters?: Record<string, unknown>) => ['teachers', 'list', filters] as const,
    detail: (id: string) => ['teachers', 'detail', id] as const,
    stats: ['teachers', 'stats'] as const,
    attendance: (id: string) => ['teachers', 'attendance', id] as const,
    timetable: (id: string) => ['teachers', 'timetable', id] as const,
    leave: (id: string) => ['teachers', 'leave', id] as const,
  },

  // Staff
  staff: {
    all: ['staff'] as const,
    list: (filters?: Record<string, unknown>) => ['staff', 'list', filters] as const,
    detail: (id: string) => ['staff', 'detail', id] as const,
    salary: (id: string) => ['staff', 'salary', id] as const,
  },

  // Classes
  classes: {
    all: ['classes'] as const,
    list: (filters?: Record<string, unknown>) => ['classes', 'list', filters] as const,
    detail: (id: string) => ['classes', 'detail', id] as const,
    students: (id: string) => ['classes', 'students', id] as const,
    timetable: (id: string) => ['classes', 'timetable', id] as const,
  },

  // Subjects
  subjects: {
    all: ['subjects'] as const,
    list: (filters?: Record<string, unknown>) => ['subjects', 'list', filters] as const,
    detail: (id: string) => ['subjects', 'detail', id] as const,
  },

  // Attendance
  attendance: {
    all: ['attendance'] as const,
    list: (filters?: Record<string, unknown>) => ['attendance', 'list', filters] as const,
    byDate: (date: string) => ['attendance', 'byDate', date] as const,
    byStudent: (studentId: string) => ['attendance', 'byStudent', studentId] as const,
    byClass: (classId: string, date?: string) => ['attendance', 'byClass', classId, date] as const,
    staff: ['attendance', 'staff'] as const,
    staffByDate: (date: string) => ['attendance', 'staffByDate', date] as const,
    summary: (filters?: Record<string, unknown>) => ['attendance', 'summary', filters] as const,
  },

  // Fees
  fees: {
    all: ['fees'] as const,
    list: (filters?: Record<string, unknown>) => ['fees', 'list', filters] as const,
    byStudent: (studentId: string) => ['fees', 'byStudent', studentId] as const,
    byClass: (classId: string) => ['fees', 'byClass', classId] as const,
    stats: ['fees', 'stats'] as const,
    analytics: ['fees', 'analytics'] as const,
    structure: ['fees', 'structure'] as const,
    structureDetail: (id: string) => ['fees', 'structure', id] as const,
  },

  // Examinations
  exams: {
    all: ['exams'] as const,
    list: (filters?: Record<string, unknown>) => ['exams', 'list', filters] as const,
    detail: (id: string) => ['exams', 'detail', id] as const,
    byClass: (classId: string) => ['exams', 'byClass', classId] as const,
    results: (examId: string) => ['exams', 'results', examId] as const,
    studentResults: (studentId: string) => ['exams', 'studentResults', studentId] as const,
    marksheet: (studentId: string, examId: string) => ['exams', 'marksheet', studentId, examId] as const,
    approval: ['exams', 'approval'] as const,
  },

  // Results
  results: {
    all: ['results'] as const,
    list: (filters?: Record<string, unknown>) => ['results', 'list', filters] as const,
    detail: (id: string) => ['results', 'detail', id] as const,
    byStudent: (studentId: string) => ['results', 'byStudent', studentId] as const,
    byClass: (classId: string) => ['results', 'byClass', classId] as const,
    grades: ['results', 'grades'] as const,
    configuration: ['results', 'configuration'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (filters?: Record<string, unknown>) => ['notifications', 'list', filters] as const,
    detail: (id: string) => ['notifications', 'detail', id] as const,
    unread: ['notifications', 'unread'] as const,
    stats: ['notifications', 'stats'] as const,
  },

  // Events
  events: {
    all: ['events'] as const,
    list: (filters?: Record<string, unknown>) => ['events', 'list', filters] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
    upcoming: ['events', 'upcoming'] as const,
    calendar: (month: string) => ['events', 'calendar', month] as const,
    stats: ['events', 'stats'] as const,
  },

  // Admissions
  admissions: {
    all: ['admissions'] as const,
    list: (filters?: Record<string, unknown>) => ['admissions', 'list', filters] as const,
    detail: (id: string) => ['admissions', 'detail', id] as const,
    stats: ['admissions', 'stats'] as const,
  },

  // Dashboard
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    metrics: ['dashboard', 'metrics'] as const,
    recentActivities: ['dashboard', 'recentActivities'] as const,
    alerts: ['dashboard', 'alerts'] as const,
    overview: ['dashboard', 'overview'] as const,
  },

  // Timetable
  timetable: {
    all: ['timetable'] as const,
    teacher: (teacherId: string) => ['timetable', 'teacher', teacherId] as const,
    student: (studentId: string) => ['timetable', 'student', studentId] as const,
    class: (classId: string) => ['timetable', 'class', classId] as const,
  },

  // Logs
  logs: {
    all: ['logs'] as const,
    list: (filters?: Record<string, unknown>) => ['logs', 'list', filters] as const,
    stats: ['logs', 'stats'] as const,
  },

  // Academic Years
  academicYears: {
    all: ['academicYears'] as const,
    list: (filters?: Record<string, unknown>) => ['academicYears', 'list', filters] as const,
    current: ['academicYears', 'current'] as const,
    detail: (id: string) => ['academicYears', 'detail', id] as const,
  },

  // Leave Management
  leaves: {
    all: ['leaves'] as const,
    list: (filters?: Record<string, unknown>) => ['leaves', 'list', filters] as const,
    detail: (id: string) => ['leaves', 'detail', id] as const,
    pending: ['leaves', 'pending'] as const,
    byStaff: (staffId: string) => ['leaves', 'byStaff', staffId] as const,
  },

  // Discipline
  discipline: {
    all: ['discipline'] as const,
    list: (filters?: Record<string, unknown>) => ['discipline', 'list', filters] as const,
    detail: (id: string) => ['discipline', 'detail', id] as const,
    byStudent: (studentId: string) => ['discipline', 'byStudent', studentId] as const,
  },

  // School Configuration
  school: {
    config: ['school', 'config'] as const,
    detail: (id: string) => ['school', 'detail', id] as const,
  },

  // Schools (Super Admin)
  schools: {
    all: ['schools'] as const,
    list: (filters?: Record<string, unknown>) => ['schools', 'list', filters] as const,
    detail: (id: string) => ['schools', 'detail', id] as const,
    stats: (id: string) => ['schools', 'stats', id] as const,
  },

  // Subscriptions (Super Admin)
  subscriptions: {
    all: ['subscriptions'] as const,
    list: (filters?: Record<string, unknown>) => ['subscriptions', 'list', filters] as const,
    detail: (id: string) => ['subscriptions', 'detail', id] as const,
    bySchool: (schoolId: string) => ['subscriptions', 'bySchool', schoolId] as const,
  },
}

// Helper type for query key arrays
export type QueryKey = readonly [string, ...readonly (string | number | boolean | null | undefined | Record<string, unknown>)[]]
