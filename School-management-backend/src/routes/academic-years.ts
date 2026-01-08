import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const academicYears = await prisma.academicYear.findMany({
      where: { schoolId: req.user.schoolId },
      orderBy: { startDate: 'desc' }
    })

    res.json({ success: true, data: academicYears })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch academic years' })
  }
})

router.get('/current', authMiddleware, async (req, res) => {
  try {
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: {
        schoolId: req.user.schoolId,
        isCurrent: true
      }
    })

    res.json({ success: true, data: currentAcademicYear })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch current academic year' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: req.params.id }
    })

    if (!academicYear || academicYear.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Academic year not found' })
    }

    res.json({ success: true, data: academicYear })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch academic year' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_academic_years'), async (req, res) => {
  try {
    const { name, startDate, endDate, isCurrent } = req.body

    const result = await prisma.$transaction(async (prisma) => {
      if (isCurrent) {
        await prisma.academicYear.updateMany({
          where: {
            schoolId: req.user.schoolId,
            isCurrent: true
          },
          data: { isCurrent: false }
        })
      }

      const academicYear = await prisma.academicYear.create({
        data: {
          schoolId: req.user.schoolId,
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isCurrent: isCurrent || false
        }
      })

      return academicYear
    })

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Create academic year error:', error)
    res.status(500).json({ success: false, error: 'Failed to create academic year' })
  }
})

router.put('/:id', authMiddleware, checkPermission('manage_academic_years'), async (req, res) => {
  try {
    const existing = await prisma.academicYear.findUnique({
      where: { id: req.params.id }
    })

    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Academic year not found' })
    }

    const result = await prisma.$transaction(async (prisma) => {
      if (req.body.isCurrent) {
        await prisma.academicYear.updateMany({
          where: {
            schoolId: req.user.schoolId,
            isCurrent: true,
            id: { not: req.params.id }
          },
          data: { isCurrent: false }
        })
      }

      const academicYear = await prisma.academicYear.update({
        where: { id: req.params.id },
        data: {
          ...req.body,
          startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
          endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
        }
      })

      return academicYear
    })

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update academic year' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_academic_years'), async (req, res) => {
  try {
    const existing = await prisma.academicYear.findUnique({
      where: { id: req.params.id }
    })

    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Academic year not found' })
    }

    if (existing.isCurrent) {
      return res.status(400).json({ success: false, error: 'Cannot delete current academic year' })
    }

    await prisma.academicYear.delete({ where: { id: req.params.id } })

    res.json({ success: true, message: 'Academic year deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete academic year' })
  }
})

router.post('/:id/set-current', authMiddleware, checkPermission('manage_academic_years'), async (req, res) => {
  try {
    const existing = await prisma.academicYear.findUnique({
      where: { id: req.params.id }
    })

    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Academic year not found' })
    }

    const result = await prisma.$transaction(async (prisma) => {
      await prisma.academicYear.updateMany({
        where: {
          schoolId: req.user.schoolId,
          isCurrent: true
        },
        data: { isCurrent: false }
      })

      const academicYear = await prisma.academicYear.update({
        where: { id: req.params.id },
        data: { isCurrent: true }
      })

      return academicYear
    })

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to set current academic year' })
  }
})

export default router
