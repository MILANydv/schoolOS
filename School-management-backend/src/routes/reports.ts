import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/attendance', authMiddleware, checkPermission('view_reports'), async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query
    
    const where: any = { schoolId: req.user.schoolId }
    
    if (classId) where.classId = classId
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    }
    
    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        student: true,
        class: true
      }
    })
    
    const summary = {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(a => a.status === 'PRESENT').length,
      absent: attendanceRecords.filter(a => a.status === 'ABSENT').length,
      late: attendanceRecords.filter(a => a.status === 'LATE').length
    }
    
    res.json({ success: true, data: { records: attendanceRecords, summary } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate attendance report' })
  }
})

router.get('/fees', authMiddleware, checkPermission('view_reports'), async (req, res) => {
  try {
    const { academicYear, status } = req.query
    
    const where: any = { schoolId: req.user.schoolId }
    
    if (academicYear) where.academicYear = academicYear
    if (status) where.status = status
    
    const fees = await prisma.fee.findMany({
      where,
      include: {
        student: {
          include: { class: true }
        },
        payments: true
      }
    })
    
    const summary = {
      totalFees: fees.length,
      totalAmount: fees.reduce((sum, f) => sum + f.totalAmount, 0),
      totalPaid: fees.reduce((sum, f) => sum + f.paidAmount, 0),
      totalPending: fees.reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0),
      paidCount: fees.filter(f => f.status === 'PAID').length,
      partialCount: fees.filter(f => f.status === 'PARTIAL').length,
      dueCount: fees.filter(f => f.status === 'DUE').length
    }
    
    res.json({ success: true, data: { records: fees, summary } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate fee report' })
  }
})

router.get('/academic/:studentId', authMiddleware, async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      where: {
        studentId: req.params.studentId,
        exam: { schoolId: req.user.schoolId }
      },
      include: {
        exam: {
          include: {
            class: true,
            subject: true
          }
        }
      },
      orderBy: { exam: { date: 'desc' } }
    })
    
    const student = await prisma.student.findUnique({
      where: { id: req.params.studentId },
      include: { class: true }
    })
    
    const summary = {
      totalExams: results.length,
      averagePercentage: results.length > 0 
        ? results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length
        : 0,
      highestMarks: Math.max(...results.map(r => r.marksObtained), 0),
      lowestMarks: Math.min(...results.map(r => r.marksObtained), 100)
    }
    
    res.json({ success: true, data: { student, results, summary } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate academic report' })
  }
})

router.get('/teacher-workload', authMiddleware, checkPermission('view_reports'), async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        timetable: {
          include: { class: true, subject: true }
        },
        classSubjects: {
          include: { class: true, subject: true }
        },
        homework: true
      }
    })
    
    const workloadData = teachers.map(teacher => ({
      teacher: {
        id: teacher.id,
        name: `${teacher.user.firstName} ${teacher.user.lastName}`,
        email: teacher.user.email,
        department: teacher.department
      },
      timetableSlots: teacher.timetable.length,
      assignedClasses: teacher.classSubjects.length,
      homeworkAssigned: teacher.homework.length
    }))
    
    res.json({ success: true, data: workloadData })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate teacher workload report' })
  }
})

router.get('/student-performance/:classId', authMiddleware, checkPermission('view_reports'), async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        classId: req.params.classId,
        schoolId: req.user.schoolId
      },
      include: {
        results: {
          include: { exam: true }
        },
        attendance: true,
        homeworkSubmissions: true
      }
    })
    
    const performanceData = students.map(student => {
      const totalAttendance = student.attendance.length
      const presentCount = student.attendance.filter(a => a.status === 'PRESENT').length
      const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0
      
      const avgMarks = student.results.length > 0
        ? student.results.reduce((sum, r) => sum + r.marksObtained, 0) / student.results.length
        : 0
      
      const submittedHomework = student.homeworkSubmissions.filter(h => h.status === 'SUBMITTED' || h.status === 'GRADED').length
      
      return {
        student: {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          rollNumber: student.rollNumber
        },
        attendance: {
          percentage: attendancePercentage.toFixed(2),
          present: presentCount,
          total: totalAttendance
        },
        academic: {
          averageMarks: avgMarks.toFixed(2),
          totalExams: student.results.length
        },
        homework: {
          submitted: submittedHomework,
          total: student.homeworkSubmissions.length
        }
      }
    })
    
    res.json({ success: true, data: performanceData })
  } catch (error) {
    console.error('Generate performance report error:', error)
    res.status(500).json({ success: false, error: 'Failed to generate student performance report' })
  }
})

router.post('/save', authMiddleware, checkPermission('view_reports'), async (req, res) => {
  try {
    const { type, name, description, filters, data } = req.body
    
    const report = await prisma.report.create({
      data: {
        schoolId: req.user.schoolId,
        type,
        name,
        description,
        filters: filters || {},
        data,
        generatedBy: req.user.id
      }
    })
    
    res.json({ success: true, data: report })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save report' })
  }
})

router.get('/saved', authMiddleware, checkPermission('view_reports'), async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      where: { schoolId: req.user.schoolId },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json({ success: true, data: reports })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch saved reports' })
  }
})

router.get('/saved/:id', authMiddleware, async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id }
    })
    
    if (!report || report.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Report not found' })
    }
    
    res.json({ success: true, data: report })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch report' })
  }
})

export default router
