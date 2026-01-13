import apiClient from './api-client'

export interface LoginCredentials {
    email: string
    password: string
}

export interface LoginResponse {
    success: boolean
    data: {
        token: string
        user: {
            id: string
            email: string
            firstName: string
            lastName: string
            role: string
            schoolId: string
            schoolName: string
        }
    }
}

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    schoolId: string
    phone?: string
    status: string
    school: {
        id: string
        name: string
        email: string
    }
}

// Authentication API
export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiClient.post('/auth/login', credentials)
        return response.data
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
        const response = await apiClient.get('/auth/me')
        return response.data
    },
}

// Students API
export const studentsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/students', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/students/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/students', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/students/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/students/${id}`)
        return response.data
    },

    importFromAdmission: async (admissionId: string, data: { classId: string; rollNumber: string; section?: string }) => {
        const response = await apiClient.post(`/students/import-from-admission/${admissionId}`, data)
        return response.data
    },
}

// Classes API
export const classesApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/classes', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/classes/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/classes', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/classes/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/classes/${id}`)
        return response.data
    },
}

// Subjects API
export const subjectsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/subjects', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/subjects/${id}`)
        return response.data
    },

    getByClass: async (classId: string) => {
        const response = await apiClient.get(`/subjects/class/${classId}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/subjects', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/subjects/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/subjects/${id}`)
        return response.data
    },

    assignToClass: async (data: { classId: string; subjectId: string; teacherId?: string | null }) => {
        const response = await apiClient.post('/subjects/class-subject', data)
        return response.data
    },

    removeFromClass: async (classSubjectId: string) => {
        const response = await apiClient.delete(`/subjects/class-subject/${classSubjectId}`)
        return response.data
    },
}

// Attendance API
export const attendanceApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/attendance', { params })
        return response.data
    },

    mark: async (data: any) => {
        const response = await apiClient.post('/attendance', data)
        return response.data
    },

    getByStudent: async (studentId: string) => {
        const response = await apiClient.get(`/attendance/student/${studentId}`)
        return response.data
    },

    getByClass: async (classId: string, params?: Record<string, any>) => {
        const response = await apiClient.get(`/attendance/class/${classId}`, { params })
        return response.data
    },
}

// Fees API
export const feesApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/fees', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/fees/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/fees', data)
        return response.data
    },

    recordPayment: async (feeId: string, data: any) => {
        const response = await apiClient.post(`/fees/${feeId}/payment`, data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/fees/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/fees/${id}`)
        return response.data
    },
}

// Fee Structures API
export const feeStructuresApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/fee-structures', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/fee-structures/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/fee-structures', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/fee-structures/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/fee-structures/${id}`)
        return response.data
    },
}

// Teachers API
export const teachersApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/teachers', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/teachers/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/teachers', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/teachers/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/teachers/${id}`)
        return response.data
    },
}

// Staff API
export const staffApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/staff', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/staff/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/staff', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/staff/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/staff/${id}`)
        return response.data
    },

    getSalary: async (staffId: string) => {
        const response = await apiClient.get(`/staff/${staffId}/salary`)
        return response.data
    },
}

// Notifications API
export const notificationsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/notifications', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/notifications/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/notifications', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/notifications/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/notifications/${id}`)
        return response.data
    },
}

// Events API
export const eventsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/events', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/events/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/events', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/events/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/events/${id}`)
        return response.data
    },
}

// Logs API
export const logsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/logs', { params })
        return response.data
    },
}

// Exams API
export const examsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/exams', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/exams/${id}`)
        return response.data
    },

    getByClass: async (classId: string) => {
        const response = await apiClient.get(`/exams/class/${classId}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/exams', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/exams/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/exams/${id}`)
        return response.data
    },

    getResults: async (examId: string) => {
        const response = await apiClient.get(`/exams/${examId}/results`)
        return response.data
    },

    getStudentResults: async (studentId: string) => {
        const response = await apiClient.get(`/exams/student/${studentId}/results`)
        return response.data
    },

    getMarksheet: async (studentId: string, examId: string) => {
        const response = await apiClient.get(`/exams/marksheet/${studentId}/${examId}`)
        return response.data
    },

    approveResult: async (resultId: string) => {
        const response = await apiClient.post(`/exams/results/${resultId}/approve`)
        return response.data
    },
}

// Results API
export const resultsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/results', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/results/${id}`)
        return response.data
    },

    getByStudent: async (studentId: string) => {
        const response = await apiClient.get(`/results/student/${studentId}`)
        return response.data
    },

    getByClass: async (classId: string) => {
        const response = await apiClient.get(`/results/class/${classId}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/results', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/results/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/results/${id}`)
        return response.data
    },

    getGrades: async () => {
        const response = await apiClient.get('/grades')
        return response.data
    },

    getGradeConfiguration: async () => {
        const response = await apiClient.get('/grades/configuration')
        return response.data
    },

    updateGradeConfiguration: async (data: any) => {
        const response = await apiClient.put('/grades/configuration', data)
        return response.data
    },
}

// Timetable API
export const timetableApi = {
    getTeacherTimetable: async (teacherId: string) => {
        const response = await apiClient.get(`/timetable/teacher/${teacherId}`)
        return response.data
    },

    getStudentTimetable: async (studentId: string) => {
        const response = await apiClient.get(`/timetable/student/${studentId}`)
        return response.data
    },

    getClassTimetable: async (classId: string) => {
        const response = await apiClient.get(`/timetable/class/${classId}`)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/timetable/${id}`, data)
        return response.data
    },
}

// Dashboard API
export const dashboardApi = {
    getStats: async () => {
        const response = await apiClient.get('/dashboard')
        return response.data
    },

    getOverview: async () => {
        const response = await apiClient.get('/dashboard/overview')
        return response.data
    },

    getMetrics: async () => {
        const response = await apiClient.get('/dashboard/metrics')
        return response.data
    },
}

// Admissions API
export const admissionsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/admissions', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/admissions/${id}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/admissions', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/admissions/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/admissions/${id}`)
        return response.data
    },

    approve: async (id: string, data: { classId: string; rollNumber: string; section?: string }) => {
        const response = await apiClient.post(`/admissions/${id}/approve`, data)
        return response.data
    },

    reject: async (id: string, reason?: string) => {
        const response = await apiClient.post(`/admissions/${id}/reject`, { reason })
        return response.data
    },
}

// Academic Years API
export const academicYearsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/academic-years', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/academic-years/${id}`)
        return response.data
    },

    getCurrent: async () => {
        const response = await apiClient.get('/academic-years/current')
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/academic-years', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/academic-years/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/academic-years/${id}`)
        return response.data
    },

    setCurrent: async (id: string) => {
        const response = await apiClient.post(`/academic-years/${id}/set-current`)
        return response.data
    },
}

// Leaves API
export const leavesApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/leaves', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/leaves/${id}`)
        return response.data
    },

    getPending: async () => {
        const response = await apiClient.get('/leaves/pending')
        return response.data
    },

    getByStaff: async (staffId: string) => {
        const response = await apiClient.get(`/leaves/staff/${staffId}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/leaves', data)
        return response.data
    },

    approve: async (id: string) => {
        const response = await apiClient.post(`/leaves/${id}/approve`)
        return response.data
    },

    reject: async (id: string, reason?: string) => {
        const response = await apiClient.post(`/leaves/${id}/reject`, { reason })
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/leaves/${id}`)
        return response.data
    },
}

// Discipline API
export const disciplineApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/discipline', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/discipline/${id}`)
        return response.data
    },

    getByStudent: async (studentId: string) => {
        const response = await apiClient.get(`/discipline/student/${studentId}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/discipline', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/discipline/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/discipline/${id}`)
        return response.data
    },
}

// School Config API
export const schoolConfigApi = {
    getConfig: async () => {
        const response = await apiClient.get('/school-config')
        return response.data
    },

    updateConfig: async (data: any) => {
        const response = await apiClient.put('/school-config', data)
        return response.data
    },

    getLateFeeConfig: async () => {
        const response = await apiClient.get('/school-config/late-fee')
        return response.data
    },

    updateLateFeeConfig: async (data: any) => {
        const response = await apiClient.put('/school-config/late-fee', data)
        return response.data
    },
}

// Schools API (Super Admin)
export const schoolsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/schools', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/schools/${id}`)
        return response.data
    },

    getStats: async (id: string) => {
        const response = await apiClient.get(`/schools/${id}/stats`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/schools', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/schools/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/schools/${id}`)
        return response.data
    },

    createAdmin: async (schoolId: string, data: any) => {
        const response = await apiClient.post(`/schools/${schoolId}/admins`, data)
        return response.data
    },
}

// Users API (Super Admin)
export const usersApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/users', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/users/${id}`)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/users/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/users/${id}`)
        return response.data
    },

    resetPassword: async (id: string, data: any) => {
        const response = await apiClient.post(`/users/${id}/reset-password`, data)
        return response.data
    },
}

// Subscriptions API (Super Admin)
export const subscriptionsApi = {
    getAll: async (params?: Record<string, any>) => {
        const response = await apiClient.get('/subscriptions', { params })
        return response.data
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/subscriptions/${id}`)
        return response.data
    },

    getBySchool: async (schoolId: string) => {
        const response = await apiClient.get(`/subscriptions/school/${schoolId}`)
        return response.data
    },

    create: async (data: any) => {
        const response = await apiClient.post('/subscriptions', data)
        return response.data
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/subscriptions/${id}`, data)
        return response.data
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/subscriptions/${id}`)
        return response.data
    },
}
