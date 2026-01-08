import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkRole } from '../middleware/rbac'
import { ROLES } from '../middleware/rbac'

const router = Router()

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get all subscriptions (Super Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         description: Filter by school ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, EXPIRED, CANCELLED, PENDING]
 *         description: Filter by status
 *       - in: query
 *         name: plan
 *         schema:
 *           type: string
 *         description: Filter by plan
 *     responses:
 *       200:
 *         description: List of subscriptions retrieved successfully
 */
router.get('/', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { schoolId, status, plan } = req.query

    const where: any = {}
    if (schoolId) {
      where.schoolId = schoolId
    }
    if (status) {
      where.status = status
    }
    if (plan) {
      where.plan = plan
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ success: true, data: subscriptions })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch subscriptions' })
  }
})

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Get a subscription by ID (Super Admin only)
 *     tags: [Subscriptions]
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
 *         description: Subscription retrieved successfully
 */
router.get('/:id', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        school: true
      }
    })

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' })
    }

    res.json({ success: true, data: subscription })
  } catch (error) {
    console.error('Get subscription error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch subscription' })
  }
})

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription (Super Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - plan
 *               - startDate
 *               - endDate
 *               - price
 *             properties:
 *               schoolId:
 *                 type: string
 *               plan:
 *                 type: string
 *                 enum: [FREE, BASIC, STANDARD, PREMIUM]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *               features:
 *                 type: object
 *     responses:
 *       201:
 *         description: Subscription created successfully
 */
router.post('/', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { schoolId, plan, startDate, endDate, price, features } = req.body

    // Validate required fields
    if (!schoolId || !plan || !startDate || !endDate || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'School ID, plan, start date, end date, and price are required'
      })
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      })
    }

    // Check if school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    // Deactivate existing active subscriptions for this school
    await prisma.subscription.updateMany({
      where: {
        schoolId,
        status: 'ACTIVE'
      },
      data: {
        status: 'EXPIRED'
      }
    })

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        schoolId,
        plan: plan.toUpperCase(),
        startDate: start,
        endDate: end,
        price,
        features,
        status: 'ACTIVE'
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.status(201).json({ success: true, data: subscription })
  } catch (error) {
    console.error('Create subscription error:', error)
    res.status(500).json({ success: false, error: 'Failed to create subscription' })
  }
})

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Update a subscription (Super Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, EXPIRED, CANCELLED, PENDING]
 *               price:
 *                 type: number
 *               features:
 *                 type: object
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 */
router.put('/:id', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params
    const { plan, startDate, endDate, status, price, features } = req.body

    const subscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' })
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start >= end) {
        return res.status(400).json({
          success: false,
          error: 'End date must be after start date'
        })
      }
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...(plan && { plan: plan.toUpperCase() }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status }),
        ...(price !== undefined && { price }),
        ...(features && { features })
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.json({ success: true, data: updatedSubscription })
  } catch (error) {
    console.error('Update subscription error:', error)
    res.status(500).json({ success: false, error: 'Failed to update subscription' })
  }
})

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription (Super Admin only)
 *     tags: [Subscriptions]
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
 *         description: Subscription deleted successfully
 */
router.delete('/:id', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params

    const subscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' })
    }

    await prisma.subscription.delete({
      where: { id }
    })

    res.json({ success: true, message: 'Subscription deleted successfully' })
  } catch (error) {
    console.error('Delete subscription error:', error)
    res.status(500).json({ success: false, error: 'Failed to delete subscription' })
  }
})

/**
 * @swagger
 * /api/subscriptions/school/{schoolId}:
 *   get:
 *     summary: Get active subscription for a school
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Active subscription retrieved successfully
 */
router.get('/school/:schoolId', authMiddleware, async (req, res) => {
  try {
    const { schoolId } = req.params

    // Only super admins or users from the same school can access
    if (req.user.role !== ROLES.SUPER_ADMIN && req.user.schoolId !== schoolId) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        schoolId,
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'No active subscription found' })
    }

    res.json({ success: true, data: subscription })
  } catch (error) {
    console.error('Get school subscription error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch school subscription' })
  }
})

export default router
