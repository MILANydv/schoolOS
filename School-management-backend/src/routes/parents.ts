import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, checkPermission('manage_students'), async (req, res) => {
  try {
    const parents = await prisma.parent.findMany({
      where: { schoolId: req.user.schoolId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            status: true
          }
        },
        students: true
      }
    })

    res.json({ success: true, data: parents })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch parents' })
  }
})

router.get('/me/students', authMiddleware, async (req, res) => {
  try {
    const parent = await prisma.parent.findUnique({
      where: { userId: req.user.id },
      include: {
        students: {
          include: { class: true }
        }
      }
    })

    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent profile not found' })
    }

    res.json({ success: true, data: parent.students })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch linked students' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_students'), async (req, res) => {
  try {
    const { email, firstName, lastName, phone, password, occupation, address, emergencyContact } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10)

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'PARENT',
          firstName,
          lastName,
          phone,
          schoolId: req.user.schoolId,
          status: 'ACTIVE'
        }
      })

      const parent = await prisma.parent.create({
        data: {
          userId: user.id,
          schoolId: req.user.schoolId,
          occupation,
          address,
          emergencyContact
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        }
      })

      return { user, parent }
    })

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Create parent error:', error)
    res.status(500).json({ success: false, error: 'Failed to create parent' })
  }
})

router.post('/:parentId/link-student/:studentId', authMiddleware, checkPermission('manage_students'), async (req, res) => {
  try {
    const parent = await prisma.parent.findUnique({ where: { id: req.params.parentId } })
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent not found' })
    }

    const student = await prisma.student.findUnique({ where: { id: req.params.studentId } })
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' })
    }

    if (student.schoolId !== req.user.schoolId || parent.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const updatedStudent = await prisma.student.update({
      where: { id: req.params.studentId },
      data: { parentId: req.params.parentId }
    })

    res.json({ success: true, data: updatedStudent })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to link student' })
  }
})

router.post('/:parentId/unlink-student/:studentId', authMiddleware, checkPermission('manage_students'), async (req, res) => {
  try {
    const updatedStudent = await prisma.student.update({
      where: { id: req.params.studentId },
      data: { parentId: null }
    })

    res.json({ success: true, data: updatedStudent })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unlink student' })
  }
})

export default router
