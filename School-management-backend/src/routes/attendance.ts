import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get all attendance records
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all attendance records
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { schoolId: req.user.schoolId },
      include: { student: true, class: true }
    })
    res.json({ success: true, data: attendance })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch attendance' })
  }
})

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Mark attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               classId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, LATE]
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const attendance = await prisma.attendance.create({
      data: { ...req.body, schoolId: req.user.schoolId }
    })
    res.json({ success: true, data: attendance })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark attendance' })
  }
})

/**
 * @swagger
 * /api/attendance/student/{studentId}:
 *   get:
 *     summary: Get attendance for a specific student
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student attendance records
 */
router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: req.params.studentId }
    })
    res.json({ success: true, data: attendance })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student attendance' })
  }
})

export default router
