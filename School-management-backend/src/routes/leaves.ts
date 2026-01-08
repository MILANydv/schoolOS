import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query

    const where: any = { schoolId: req.user.schoolId }

    if (req.user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findFirst({
        where: { userId: req.user.id }
      })
      if (teacher) {
        where.teacherId = teacher.id
      }
    }

    if (status) where.status = status

    const leaveRequests = await prisma.leaveRequest.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: leaveRequests })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leave requests' })
  }
})

router.get('/my-leaves', authMiddleware, async (req, res) => {
  try {
    const teacher = await prisma.teacher.findFirst({
      where: { userId: req.user.id }
    })

    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher profile not found' })
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { teacherId: teacher.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: leaveRequests })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leave requests' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: req.params.id },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    })

    if (!leaveRequest || leaveRequest.teacher.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Leave request not found' })
    }

    res.json({ success: true, data: leaveRequest })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leave request' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body

    const teacher = await prisma.teacher.findFirst({
      where: { userId: req.user.id }
    })

    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher profile not found' })
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        teacherId: teacher.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: 'PENDING'
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    })

    res.json({ success: true, data: leaveRequest })
  } catch (error) {
    console.error('Create leave request error:', error)
    res.status(500).json({ success: false, error: 'Failed to create leave request' })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.leaveRequest.findUnique({
      where: { id: req.params.id },
      include: { teacher: true }
    })

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Leave request not found' })
    }

    if (existing.teacher.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    if (existing.teacher.userId !== req.user.id && req.user.role === 'TEACHER') {
      return res.status(403).json({ success: false, error: 'Can only update your own leave requests' })
    }

    if (existing.status !== 'PENDING' && req.body.status !== undefined) {
      return res.status(400).json({ success: false, error: 'Cannot modify processed leave request' })
    }

    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    })

    res.json({ success: true, data: leaveRequest })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update leave request' })
  }
})

router.post('/:id/approve', authMiddleware, checkPermission('approve_leaves'), async (req, res) => {
  try {
    const existing = await prisma.leaveRequest.findUnique({
      where: { id: req.params.id },
      include: { teacher: true }
    })

    if (!existing || existing.teacher.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Leave request not found' })
    }

    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    })

    res.json({ success: true, data: leaveRequest })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to approve leave request' })
  }
})

router.post('/:id/reject', authMiddleware, checkPermission('approve_leaves'), async (req, res) => {
  try {
    const existing = await prisma.leaveRequest.findUnique({
      where: { id: req.params.id },
      include: { teacher: true }
    })

    if (!existing || existing.teacher.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Leave request not found' })
    }

    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    })

    res.json({ success: true, data: leaveRequest })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reject leave request' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.leaveRequest.findUnique({
      where: { id: req.params.id },
      include: { teacher: true }
    })

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Leave request not found' })
    }

    if (existing.teacher.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    if (existing.teacher.userId !== req.user.id && req.user.role === 'TEACHER') {
      return res.status(403).json({ success: false, error: 'Can only delete your own leave requests' })
    }

    if (existing.status !== 'PENDING') {
      return res.status(400).json({ success: false, error: 'Cannot delete processed leave request' })
    }

    await prisma.leaveRequest.delete({ where: { id: req.params.id } })

    res.json({ success: true, message: 'Leave request deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete leave request' })
  }
})

export default router
