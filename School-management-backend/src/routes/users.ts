import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkRole, ROLES } from '../middleware/rbac'
import bcrypt from 'bcryptjs'

const router = Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users across all schools (Super Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 */
router.get('/', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { role, schoolId, status } = req.query

    const where: any = {}
    if (role) where.role = role
    if (schoolId) where.schoolId = schoolId
    if (status) where.status = status

    const users = await prisma.user.findMany({
      where,
      include: {
        school: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ success: true, data: users })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch users' })
  }
})

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    // If not super admin, can only view self or users in same school (depending on roles)
    // For now, let's keep it simple for super admin
    if (req.user.role !== ROLES.SUPER_ADMIN && req.user.id !== id) {
       // Additional checks could be added here
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        school: true
      }
    })

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' })
  }
})

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (Super Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, phone, status, role } = req.body

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(status && { status }),
        ...(role && { role })
      }
    })

    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' })
  }
})

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (Super Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    if (user.role === ROLES.SUPER_ADMIN) {
      return res.status(400).json({ success: false, error: 'Cannot delete super admin' })
    }

    await prisma.user.delete({ where: { id } })

    res.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete user' })
  }
})

/**
 * @swagger
 * /api/users/{id}/reset-password:
 *   post:
 *     summary: Reset user password (Super Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/reset-password', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params
    const { newPassword } = req.body

    if (!newPassword) {
      return res.status(400).json({ success: false, error: 'New password is required' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    })

    res.json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reset password' })
  }
})

export default router
