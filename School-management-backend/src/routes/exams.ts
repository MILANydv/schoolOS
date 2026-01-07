import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        class: true,
        subject: true,
        results: true
      },
      orderBy: { date: 'asc' }
    })
    res.json({ success: true, data: exams })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch exams' })
  }
})

router.get('/class/:classId', authMiddleware, async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        classId: req.params.classId,
        schoolId: req.user.schoolId
      },
      include: {
        class: true,
        subject: true,
        results: true
      },
      orderBy: { date: 'asc' }
    })
    res.json({ success: true, data: exams })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch exams' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: {
        class: true,
        subject: true,
        results: {
          include: {
            student: true
          }
        }
      }
    })
    
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' })
    }
    
    res.json({ success: true, data: exam })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch exam' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_exams'), async (req, res) => {
  try {
    const { classId, subjectId, name, date, startTime, endTime, duration, totalMarks, passingMarks, type } = req.body
    
    const exam = await prisma.exam.create({
      data: {
        schoolId: req.user.schoolId,
        classId,
        subjectId,
        name,
        date: new Date(date),
        startTime,
        endTime,
        duration,
        totalMarks,
        passingMarks,
        type
      },
      include: {
        class: true,
        subject: true
      }
    })
    
    res.json({ success: true, data: exam })
  } catch (error) {
    console.error('Create exam error:', error)
    res.status(500).json({ success: false, error: 'Failed to create exam' })
  }
})

router.put('/:id', authMiddleware, checkPermission('manage_exams'), async (req, res) => {
  try {
    const { name, date, startTime, endTime, duration, totalMarks, passingMarks, type } = req.body
    
    const exam = await prisma.exam.update({
      where: { id: req.params.id },
      data: {
        name,
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        duration,
        totalMarks,
        passingMarks,
        type
      }
    })
    
    res.json({ success: true, data: exam })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update exam' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_exams'), async (req, res) => {
  try {
    await prisma.exam.delete({
      where: { id: req.params.id }
    })
    
    res.json({ success: true, message: 'Exam deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete exam' })
  }
})

router.post('/:id/results', authMiddleware, checkPermission('enter_marks'), async (req, res) => {
  try {
    const { studentId, marksObtained, remarks } = req.body
    
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id }
    })
    
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' })
    }
    
    const percentage = (marksObtained / exam.totalMarks) * 100
    
    let grade = 'F'
    if (percentage >= 90) grade = 'A+'
    else if (percentage >= 80) grade = 'A'
    else if (percentage >= 70) grade = 'B+'
    else if (percentage >= 60) grade = 'B'
    else if (percentage >= 50) grade = 'C+'
    else if (percentage >= 40) grade = 'C'
    else if (percentage >= 33) grade = 'D'
    
    const result = await prisma.result.create({
      data: {
        examId: req.params.id,
        studentId,
        marksObtained,
        grade,
        percentage,
        remarks,
        isPublished: false
      },
      include: {
        student: true,
        exam: true
      }
    })
    
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Create result error:', error)
    res.status(500).json({ success: false, error: 'Failed to create result' })
  }
})

router.put('/results/:resultId', authMiddleware, checkPermission('enter_marks'), async (req, res) => {
  try {
    const { marksObtained, remarks } = req.body
    
    const existingResult = await prisma.result.findUnique({
      where: { id: req.params.resultId },
      include: { exam: true }
    })
    
    if (!existingResult) {
      return res.status(404).json({ success: false, error: 'Result not found' })
    }
    
    const percentage = (marksObtained / existingResult.exam.totalMarks) * 100
    
    let grade = 'F'
    if (percentage >= 90) grade = 'A+'
    else if (percentage >= 80) grade = 'A'
    else if (percentage >= 70) grade = 'B+'
    else if (percentage >= 60) grade = 'B'
    else if (percentage >= 50) grade = 'C+'
    else if (percentage >= 40) grade = 'C'
    else if (percentage >= 33) grade = 'D'
    
    const result = await prisma.result.update({
      where: { id: req.params.resultId },
      data: {
        marksObtained,
        grade,
        percentage,
        remarks
      }
    })
    
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update result' })
  }
})

router.post('/:id/publish', authMiddleware, checkPermission('manage_exams'), async (req, res) => {
  try {
    await prisma.result.updateMany({
      where: { examId: req.params.id },
      data: { isPublished: true }
    })
    
    res.json({ success: true, message: 'Results published' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to publish results' })
  }
})

router.get('/student/:studentId/results', authMiddleware, async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      where: {
        studentId: req.params.studentId,
        isPublished: true
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
    
    res.json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student results' })
  }
})

export default router
