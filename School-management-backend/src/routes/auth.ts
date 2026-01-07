import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@demohighschool.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         role:
 *                           type: string
 *                         schoolId:
 *                           type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }
    
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { school: true }
    })
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    
    if (user.status !== 'ACTIVE') {
      return res.status(401).json({ success: false, error: 'Account is inactive. Please contact administrator.' })
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        schoolId: user.schoolId 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          schoolId: user.schoolId,
          schoolName: user.school.name
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: 'Login failed' })
  }
})

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        status: true,
        schoolId: true,
        school: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' })
  }
})

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout from the system
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

export default router
