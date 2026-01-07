import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { setupSwagger } from './utils/swagger'

import authRoutes from './routes/auth'
import studentRoutes from './routes/students'
import classRoutes from './routes/classes'
import attendanceRoutes from './routes/attendance'
import feeRoutes from './routes/fees'
import teacherRoutes from './routes/teachers'
import notificationRoutes from './routes/notifications'
import dashboardRoutes from './routes/dashboard'
import eventRoutes from './routes/events'
import examRoutes from './routes/exams'
import timetableRoutes from './routes/timetable'
import logRoutes from './routes/logs'
import admissionRoutes from './routes/admissions'

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
app.use('/api/teachers', teacherRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/timetable', timetableRoutes)
app.use('/api/logs', logRoutes)
app.use('/api/admissions', admissionRoutes)

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
