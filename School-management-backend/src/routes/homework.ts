import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { classId, subjectId, teacherId } = req.query
    
    const where: any = { schoolId: req.user.schoolId }
    
    if (classId) where.classId = classId
    if (subjectId) where.subjectId = subjectId
    if (teacherId) where.teacherId = teacherId
    
    const homework = await prisma.homework.findMany({
      where,
      include: {
        class: true,
        subject: true,
        teacher: { include: { user: true } },
        submissions: true
      },
      orderBy: { dueDate: 'asc' }
    })
    
    res.json({ success: true, data: homework })
  } catch (error) {
    console.error('Fetch homework error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch homework' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const homework = await prisma.homework.findUnique({
      where: { id: req.params.id },
      include: {
        class: true,
        subject: true,
        teacher: { include: { user: true } },
        submissions: {
          include: {
            student: true
          }
        }
      }
    })
    
    if (!homework) {
      return res.status(404).json({ success: false, error: 'Homework not found' })
    }
    
    res.json({ success: true, data: homework })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch homework' })
  }
})

router.post('/', authMiddleware, checkPermission('create_homework'), async (req, res) => {
  try {
    const { classId, subjectId, title, description, dueDate, attachments } = req.body
    
    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.user.id }
    })
    
    if (!teacher) {
      return res.status(403).json({ success: false, error: 'Only teachers can create homework' })
    }
    
    const homework = await prisma.homework.create({
      data: {
        schoolId: req.user.schoolId,
        classId,
        subjectId,
        teacherId: teacher.id,
        title,
        description,
        dueDate: new Date(dueDate),
        attachments
      },
      include: {
        class: true,
        subject: true,
        teacher: { include: { user: true } }
      }
    })
    
    res.json({ success: true, data: homework })
  } catch (error) {
    console.error('Create homework error:', error)
    res.status(500).json({ success: false, error: 'Failed to create homework' })
  }
})

router.put('/:id', authMiddleware, checkPermission('create_homework'), async (req, res) => {
  try {
    const { title, description, dueDate, attachments } = req.body
    
    const homework = await prisma.homework.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        attachments
      }
    })
    
    res.json({ success: true, data: homework })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update homework' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('create_homework'), async (req, res) => {
  try {
    await prisma.homework.delete({
      where: { id: req.params.id }
    })
    
    res.json({ success: true, message: 'Homework deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete homework' })
  }
})

router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { content, attachments } = req.body
    
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    })
    
    if (!student) {
      return res.status(403).json({ success: false, error: 'Only students can submit homework' })
    }
    
    const submission = await prisma.homeworkSubmission.create({
      data: {
        homeworkId: req.params.id,
        studentId: student.id,
        content,
        attachments,
        submittedAt: new Date(),
        status: 'SUBMITTED'
      }
    })
    
    res.json({ success: true, data: submission })
  } catch (error) {
    console.error('Submit homework error:', error)
    res.status(500).json({ success: false, error: 'Failed to submit homework' })
  }
})

router.put('/submission/:submissionId/grade', authMiddleware, checkPermission('grade_homework'), async (req, res) => {
  try {
    const { grade, marks, feedback } = req.body
    
    const submission = await prisma.homeworkSubmission.update({
      where: { id: req.params.submissionId },
      data: {
        grade,
        marks,
        feedback,
        status: 'GRADED'
      },
      include: {
        student: true,
        homework: true
      }
    })
    
    res.json({ success: true, data: submission })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to grade submission' })
  }
})

router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const submissions = await prisma.homeworkSubmission.findMany({
      where: { studentId: req.params.studentId },
      include: {
        homework: {
          include: {
            class: true,
            subject: true,
            teacher: { include: { user: true } }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    })
    
    res.json({ success: true, data: submissions })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student homework' })
  }
})

export default router
