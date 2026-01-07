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
    getAll: async () => {
        const response = await apiClient.get('/students')
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
}

// Classes API
export const classesApi = {
    getAll: async () => {
        const response = await apiClient.get('/classes')
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

// Attendance API
export const attendanceApi = {
    getAll: async () => {
        const response = await apiClient.get('/attendance')
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
}

// Fees API
export const feesApi = {
    getAll: async () => {
        const response = await apiClient.get('/fees')
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
}

// Teachers API
export const teachersApi = {
    getAll: async () => {
        const response = await apiClient.get('/teachers')
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

// Notifications API
export const notificationsApi = {
    getAll: async () => {
        const response = await apiClient.get('/notifications')
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
    getAll: async () => {
        const response = await apiClient.get('/events')
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
    getAll: async () => {
        const response = await apiClient.get('/logs')
        return response.data
    },
}

// Exams API
export const examsApi = {
    getAll: async () => {
        const response = await apiClient.get('/exams')
        return response.data
    },

    getByClass: async (classId: string) => {
        const response = await apiClient.get(`/exams/class/${classId}`)
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
}

// Dashboard API
export const dashboardApi = {
    getStats: async () => {
        const response = await apiClient.get('/dashboard')
        return response.data
    },
}

// Admissions API
export const admissionsApi = {
    getAll: async () => {
        const response = await apiClient.get('/admissions')
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
}
