import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all teachers
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        schoolId: req.user.schoolId,
        role: { in: ['TEACHER', 'ACCOUNTANT', 'SCHOOL_ADMIN'] }
      },
      include: {
        teacher: true
      }
    })

    const staff = users.map(user => ({
      id: user.teacher?.id || user.id, // Use teacher ID if available, else user ID
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.status,
      // Teacher specific fields
      subject: user.teacher?.department || 'General', // Fallback
      department: user.teacher?.department || 'General',
      qualification: user.teacher?.qualification || '',
      experience: user.teacher?.experience || 0,
      joinDate: user.teacher?.joinDate || user.createdAt,
      phone: user.phone || ''
    }))

    res.json({ success: true, data: staff })
  } catch (error) {
    console.error('Get staff error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch staff' })
  }
})

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               qualification:
 *                 type: string
 *               experience:
 *                 type: number
 *               joinDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Teacher created successfully
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      department,
      qualification,
      experience,
      joinDate
    } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' })
    }

    const hashedPassword = await require('bcryptjs').hash(password || 'password123', 10)

    const result = await prisma.$transaction(async (prisma) => {
      // Create User
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: role || 'TEACHER',
          phone,
          schoolId: req.user.schoolId,
          status: 'ACTIVE'
        }
      })

      let teacher = null
      // If role is TEACHER, create Teacher record
      if (user.role === 'TEACHER') {
        teacher = await prisma.teacher.create({
          data: {
            userId: user.id,
            schoolId: req.user.schoolId,
            employeeId: `EMP-${Date.now()}`, // Simple ID generation
            department: department || 'General',
            qualification: qualification || 'Not Specified',
            experience: Number(experience) || 0,
            joinDate: joinDate ? new Date(joinDate) : new Date()
          }
        })
      }

      return { user, teacher }
    })

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Create staff error:', error)
    res.status(500).json({ success: false, error: 'Failed to create staff member' })
  }
})

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Update a teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const teacher = await prisma.teacher.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json({ success: true, data: teacher })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update teacher' })
  }
})

/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.teacher.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Teacher deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete teacher' })
  }
})

export default router
