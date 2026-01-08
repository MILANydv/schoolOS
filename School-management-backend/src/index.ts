import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { setupSwagger } from './utils/swagger'

import authRoutes from './routes/auth'
import studentRoutes from './routes/students'
import classRoutes from './routes/classes'
import attendanceRoutes from './routes/attendance'
import feeRoutes from './routes/fees'
import feeStructureRoutes from './routes/fee-structures'
import academicYearRoutes from './routes/academic-years'
import teacherRoutes from './routes/teachers'
import leaveRoutes from './routes/leaves'
import disciplineRoutes from './routes/discipline'
import gradeRoutes from './routes/grades'
import schoolConfigRoutes from './routes/school-config'
import notificationRoutes from './routes/notifications'
import dashboardRoutes from './routes/dashboard'
import eventRoutes from './routes/events'
import examRoutes from './routes/exams'
import timetableRoutes from './routes/timetable'
import logRoutes from './routes/logs'
import admissionRoutes from './routes/admissions'
import homeworkRoutes from './routes/homework'
import libraryRoutes from './routes/library'
import subjectRoutes from './routes/subjects'
import parentRoutes from './routes/parents'
import certificateRoutes from './routes/certificates'
import messageRoutes from './routes/messages'
import reportRoutes from './routes/reports'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Setup Swagger documentation
setupSwagger(app)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/fees', feeRoutes)
app.use('/api/fee-structures', feeStructureRoutes)
app.use('/api/academic-years', academicYearRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/leaves', leaveRoutes)
app.use('/api/discipline', disciplineRoutes)
app.use('/api/grades', gradeRoutes)
app.use('/api/school-config', schoolConfigRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/timetable', timetableRoutes)
app.use('/api/logs', logRoutes)
app.use('/api/admissions', admissionRoutes)
app.use('/api/homework', homeworkRoutes)
app.use('/api/library', libraryRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/parents', parentRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/reports', reportRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'School Management API is running' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 School Management API - Phase 1 MVP`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`)
})
