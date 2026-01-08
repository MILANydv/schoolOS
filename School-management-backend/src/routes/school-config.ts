import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: req.user.schoolId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        website: true,
        logo: true,
        gradeConfiguration: true,
        lateFeeConfig: true
      }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    res.json({ success: true, data: school })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch school configuration' })
  }
})

router.put('/', authMiddleware, checkPermission('manage_school'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      website,
      logo,
      gradeConfiguration,
      lateFeeConfig
    } = req.body

    const school = await prisma.school.update({
      where: { id: req.user.schoolId },
      data: {
        name,
        email,
        phone,
        address,
        website,
        logo,
        gradeConfiguration: gradeConfiguration || undefined,
        lateFeeConfig: lateFeeConfig || undefined
      }
    })

    res.json({ success: true, data: school })
  } catch (error) {
    console.error('Update school configuration error:', error)
    res.status(500).json({ success: false, error: 'Failed to update school configuration' })
  }
})

router.put('/late-fee-config', authMiddleware, checkPermission('manage_school'), async (req, res) => {
  try {
    const { enabled, dailyRate, maxLateFee, graceDays } = req.body

    const school = await prisma.school.findUnique({
      where: { id: req.user.schoolId }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    const currentConfig = (school as any).lateFeeConfig || {}

    const updatedConfig = {
      enabled: enabled !== undefined ? enabled : currentConfig.enabled ?? true,
      dailyRate: dailyRate !== undefined ? Number(dailyRate) : currentConfig.dailyRate ?? 0.01,
      maxLateFee: maxLateFee !== undefined ? Number(maxLateFee) : currentConfig.maxLateFee ?? 0.5,
      graceDays: graceDays !== undefined ? Number(graceDays) : currentConfig.graceDays ?? 0
    }

    const updatedSchool = await prisma.school.update({
      where: { id: req.user.schoolId },
      data: { lateFeeConfig: updatedConfig }
    })

    res.json({ success: true, data: (updatedSchool as any).lateFeeConfig })
  } catch (error) {
    console.error('Update late fee configuration error:', error)
    res.status(500).json({ success: false, error: 'Failed to update late fee configuration' })
  }
})

export default router
