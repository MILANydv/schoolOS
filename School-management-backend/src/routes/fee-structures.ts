import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { grade, academicYear } = req.query

    const where: any = { schoolId: req.user.schoolId }
    if (grade) where.grade = grade
    if (academicYear) where.academicYear = academicYear

    const feeStructures = await prisma.feeStructure.findMany({
      where,
      orderBy: { grade: 'asc' }
    })

    res.json({ success: true, data: feeStructures })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch fee structures' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: req.params.id }
    })

    if (!feeStructure || feeStructure.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Fee structure not found' })
    }

    res.json({ success: true, data: feeStructure })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch fee structure' })
  }
})

router.post('/', authMiddleware, checkPermission('manage_fees'), async (req, res) => {
  try {
    const {
      name,
      grade,
      academicYear,
      amount,
      frequency,
      description
    } = req.body

    const feeStructure = await prisma.feeStructure.create({
      data: {
        schoolId: req.user.schoolId,
        name,
        grade,
        academicYear,
        amount: Number(amount),
        frequency,
        description
      }
    })

    res.json({ success: true, data: feeStructure })
  } catch (error) {
    console.error('Create fee structure error:', error)
    res.status(500).json({ success: false, error: 'Failed to create fee structure' })
  }
})

router.put('/:id', authMiddleware, checkPermission('manage_fees'), async (req, res) => {
  try {
    const existing = await prisma.feeStructure.findUnique({
      where: { id: req.params.id }
    })

    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Fee structure not found' })
    }

    const feeStructure = await prisma.feeStructure.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.json({ success: true, data: feeStructure })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update fee structure' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_fees'), async (req, res) => {
  try {
    const existing = await prisma.feeStructure.findUnique({
      where: { id: req.params.id }
    })

    if (!existing || existing.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Fee structure not found' })
    }

    await prisma.feeStructure.delete({ where: { id: req.params.id } })

    res.json({ success: true, message: 'Fee structure deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete fee structure' })
  }
})

export default router
