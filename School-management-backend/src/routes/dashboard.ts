import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: number
 *                     totalTeachers:
 *                       type: number
 *                     totalClasses:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *                     totalDue:
 *                       type: number
 *                     feeCollectionRate:
 *                       type: number
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const schoolId = req.user.schoolId

    const [totalStudents, totalTeachers, totalClasses, fees, pendingAdmissions] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.class.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.fee.findMany({ where: { schoolId } }),
      prisma.student.count({ where: { schoolId, status: 'PENDING' } })
    ])

    const totalRevenue = fees.reduce((sum, fee) => sum + fee.paidAmount, 0)
    const totalDue = fees.reduce((sum, fee) => sum + (fee.totalAmount - fee.paidAmount), 0)
    const feeCollectionRate = fees.length > 0
      ? (totalRevenue / fees.reduce((sum, fee) => sum + fee.totalAmount, 0)) * 100
      : 0

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalRevenue,
        totalDue,
        feeCollectionRate: Math.round(feeCollectionRate * 10) / 10,
        pendingAdmissions
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' })
  }
})

export default router
