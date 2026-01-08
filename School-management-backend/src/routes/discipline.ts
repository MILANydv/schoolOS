import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.query

    const disciplineLogs = await prisma.disciplineLog.findMany({
      where: studentId ? { studentId: studentId as string } : undefined,
      include: {
        student: {
          include: {
            class: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    disciplineLogs.forEach(log => {
      if (log.student.schoolId !== req.user.schoolId) {
        return res.status(403).json({ success: false, error: 'Access denied' })
      }
    })

    res.json({ success: true, data: disciplineLogs })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch discipline logs' })
  }
})

router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.studentId }
    })

    if (!student || student.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Student not found' })
    }

    const disciplineLogs = await prisma.disciplineLog.findMany({
      where: { studentId: req.params.studentId },
      orderBy: { date: 'desc' }
    })

    res.json({ success: true, data: disciplineLogs })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch discipline logs' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const disciplineLog = await prisma.disciplineLog.findUnique({
      where: { id: req.params.id },
      include: {
        student: {
          include: {
            class: true
          }
        }
      }
    })

    if (!disciplineLog) {
      return res.status(404).json({ success: false, error: 'Discipline log not found' })
    }

    if (disciplineLog.student.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    res.json({ success: true, data: disciplineLog })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch discipline log' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_discipline'), async (req, res) => {
  try {
    const { studentId, date, incident, action } = req.body

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student || student.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Student not found' })
    }

    const disciplineLog = await prisma.disciplineLog.create({
      data: {
        studentId,
        date: new Date(date),
        incident,
        action,
        reportedBy: req.user.id
      },
      include: {
        student: {
          include: {
            class: true
          }
        }
      }
    })

    res.json({ success: true, data: disciplineLog })
  } catch (error) {
    console.error('Create discipline log error:', error)
    res.status(500).json({ success: false, error: 'Failed to create discipline log' })
  }
})

router.put('/:id', authMiddleware, checkPermission('manage_discipline'), async (req, res) => {
  try {
    const existing = await prisma.disciplineLog.findUnique({
      where: { id: req.params.id },
      include: { student: true }
    })

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Discipline log not found' })
    }

    if (existing.student.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    const disciplineLog = await prisma.disciplineLog.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
      },
      include: {
        student: {
          include: {
            class: true
          }
        }
      }
    })

    res.json({ success: true, data: disciplineLog })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update discipline log' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_discipline'), async (req, res) => {
  try {
    const existing = await prisma.disciplineLog.findUnique({
      where: { id: req.params.id },
      include: { student: true }
    })

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Discipline log not found' })
    }

    if (existing.student.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    await prisma.disciplineLog.delete({ where: { id: req.params.id } })

    res.json({ success: true, message: 'Discipline log deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete discipline log' })
  }
})

export default router
