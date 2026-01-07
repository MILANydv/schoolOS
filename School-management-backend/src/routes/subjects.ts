import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { schoolId: req.user.schoolId },
      include: { classSubjects: { include: { class: true, teacher: { include: { user: true } } } } },
      orderBy: { name: 'asc' }
    })
    
    res.json({ success: true, data: subjects })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch subjects' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: {
        classSubjects: {
          include: {
            class: true,
            teacher: { include: { user: true } }
          }
        }
      }
    })
    
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' })
    }
    
    res.json({ success: true, data: subject })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch subject' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_subjects'), async (req, res) => {
  try {
    const { name, code, description } = req.body
    
    const subject = await prisma.subject.create({
      data: {
        schoolId: req.user.schoolId,
        name,
        code,
        description
      }
    })
    
    res.json({ success: true, data: subject })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create subject' })
  }
})

router.put('/:id', authMiddleware, checkPermission('manage_subjects'), async (req, res) => {
  try {
    const { name, code, description } = req.body
    
    const subject = await prisma.subject.update({
      where: { id: req.params.id },
      data: { name, code, description }
    })
    
    res.json({ success: true, data: subject })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update subject' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_subjects'), async (req, res) => {
  try {
    await prisma.subject.delete({
      where: { id: req.params.id }
    })
    
    res.json({ success: true, message: 'Subject deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete subject' })
  }
})

router.post('/class-subject', authMiddleware, checkPermission('manage_subjects'), async (req, res) => {
  try {
    const { classId, subjectId, teacherId } = req.body
    
    const classSubject = await prisma.classSubject.create({
      data: {
        classId,
        subjectId,
        teacherId
      },
      include: {
        class: true,
        subject: true,
        teacher: { include: { user: true } }
      }
    })
    
    res.json({ success: true, data: classSubject })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to assign subject to class' })
  }
})

router.delete('/class-subject/:id', authMiddleware, checkPermission('manage_subjects'), async (req, res) => {
  try {
    await prisma.classSubject.delete({
      where: { id: req.params.id }
    })
    
    res.json({ success: true, message: 'Subject removed from class' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove subject from class' })
  }
})

router.get('/class/:classId', authMiddleware, async (req, res) => {
  try {
    const classSubjects = await prisma.classSubject.findMany({
      where: { classId: req.params.classId },
      include: {
        subject: true,
        teacher: { include: { user: true } }
      }
    })
    
    res.json({ success: true, data: classSubjects })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch class subjects' })
  }
})

export default router
