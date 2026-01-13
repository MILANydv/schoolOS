import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkRole } from '../middleware/rbac'
import { ROLES } from '../middleware/rbac'
import bcrypt from 'bcryptjs'

const router = Router()

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Get all schools (Super Admin only)
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of schools retrieved successfully
 */
router.get('/', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { status } = req.query

    const where: any = {}
    if (status) {
      where.status = status
    }

    const schools = await prisma.school.findMany({
      where,
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            students: true,
            teachers: true,
            users: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ success: true, data: schools })
  } catch (error) {
    console.error('Get schools error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch schools' })
  }
})

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get a school by ID (Super Admin only)
 *     tags: [Schools]
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
 *         description: School retrieved successfully
 */
router.get('/:id', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        subscriptions: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            students: true,
            teachers: true,
            users: true,
            classes: true,
            fees: true
          }
        }
      }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    res.json({ success: true, data: school })
  } catch (error) {
    console.error('Get school error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch school' })
  }
})

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a new school (Super Admin only)
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *               - adminEmail
 *               - adminPassword
 *               - adminFirstName
 *               - adminLastName
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               website:
 *                 type: string
 *               adminEmail:
 *                 type: string
 *               adminPassword:
 *                 type: string
 *               adminFirstName:
 *                 type: string
 *               adminLastName:
 *                 type: string
 *               adminPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: School created successfully
 */
router.post('/', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      website,
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName,
      adminPhone
    } = req.body

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone, and address are required'
      })
    }

    if (!adminEmail || !adminPassword || !adminFirstName || !adminLastName) {
      return res.status(400).json({
        success: false,
        error: 'Admin details (email, password, first name, last name) are required'
      })
    }

    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Admin email already exists'
      })
    }

    // Hash admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Create school and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create school
      const school = await tx.school.create({
        data: {
          name,
          email,
          phone,
          address,
          website,
          status: 'ACTIVE'
        }
      })

      // Create admin user for the school
      const adminUser = await tx.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstName: adminFirstName,
          lastName: adminLastName,
          phone: adminPhone,
          role: ROLES.SCHOOL_ADMIN,
          schoolId: school.id,
          status: 'ACTIVE'
        }
      })

      return { school, adminUser }
    })

    res.status(201).json({
      success: true,
      data: {
        school: result.school,
        admin: {
          id: result.adminUser.id,
          email: result.adminUser.email,
          firstName: result.adminUser.firstName,
          lastName: result.adminUser.lastName
        }
      }
    })
  } catch (error) {
    console.error('Create school error:', error)
    res.status(500).json({ success: false, error: 'Failed to create school' })
  }
})

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Update a school (Super Admin only)
 *     tags: [Schools]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               website:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, PENDING]
 *     responses:
 *       200:
 *         description: School updated successfully
 */
router.put('/:id', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, address, website, status } = req.body

    const school = await prisma.school.findUnique({
      where: { id }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    const updatedSchool = await prisma.school.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(website !== undefined && { website }),
        ...(status && { status })
      },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            students: true,
            teachers: true,
            users: true
          }
        }
      }
    })

    res.json({ success: true, data: updatedSchool })
  } catch (error) {
    console.error('Update school error:', error)
    res.status(500).json({ success: false, error: 'Failed to update school' })
  }
})

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     summary: Delete a school (Super Admin only)
 *     tags: [Schools]
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
 *         description: School deleted successfully
 */
router.delete('/:id', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            teachers: true,
            users: true
          }
        }
      }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    // Check if school has data
    if (school._count.students > 0 || school._count.teachers > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete school with existing students or teachers. Please remove them first or set school status to INACTIVE.'
      })
    }

    await prisma.school.delete({
      where: { id }
    })

    res.json({ success: true, message: 'School deleted successfully' })
  } catch (error) {
    console.error('Delete school error:', error)
    res.status(500).json({ success: false, error: 'Failed to delete school' })
  }
})

/**
 * @swagger
 * /api/schools/{id}/stats:
 *   get:
 *     summary: Get school statistics (Super Admin only)
 *     tags: [Schools]
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
 *         description: School statistics retrieved successfully
 */
router.get('/:id/stats', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
    const { id } = req.params

    const school = await prisma.school.findUnique({
      where: { id }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalUsers,
      activeSubscription,
      totalRevenue,
      recentStudents
    ] = await Promise.all([
      prisma.student.count({ where: { schoolId: id, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId: id, status: 'ACTIVE' } }),
      prisma.class.count({ where: { schoolId: id, status: 'ACTIVE' } }),
      prisma.user.count({ where: { schoolId: id, status: 'ACTIVE' } }),
      prisma.subscription.findFirst({
        where: { schoolId: id, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.feePayment.aggregate({
        where: {
          fee: {
            schoolId: id
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.student.findMany({
        where: { schoolId: id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          createdAt: true
        }
      })
    ])

    res.json({
      success: true,
      data: {
        school,
        stats: {
          totalStudents,
          totalTeachers,
          totalClasses,
          totalUsers,
          totalRevenue: totalRevenue._sum.amount || 0,
          subscription: activeSubscription
        },
        recentStudents
      }
    })
  } catch (error) {
  console.error('Get school stats error:', error)
  res.status(500).json({ success: false, error: 'Failed to fetch school statistics' })
  }
  })

  /**
  * @swagger
  * /api/schools/{id}/admins:
  *   post:
  *     summary: Create an admin user for a school (Super Admin only)
  *     tags: [Schools]
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
  *             required:
  *               - email
  *               - password
  *               - firstName
  *               - lastName
  *             properties:
  *               email:
  *                 type: string
  *               password:
  *                 type: string
  *               firstName:
  *                 type: string
  *               lastName:
  *                 type: string
  *               phone:
  *                 type: string
  *     responses:
  *       201:
  *         description: Admin user created successfully
  */
  router.post('/:id/admins', authMiddleware, checkRole(ROLES.SUPER_ADMIN), async (req, res) => {
  try {
  const { id } = req.params
  const { email, password, firstName, lastName, phone } = req.body

  const school = await prisma.school.findUnique({
    where: { id }
  })

  if (!school) {
    return res.status(404).json({ success: false, error: 'School not found' })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return res.status(400).json({ success: false, error: 'Email already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const adminUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: ROLES.SCHOOL_ADMIN,
      schoolId: id,
      status: 'ACTIVE'
    }
  })

  res.status(201).json({
    success: true,
    data: {
      id: adminUser.id,
      email: adminUser.email,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName
    }
  })
  } catch (error) {
  console.error('Create school admin error:', error)
  res.status(500).json({ success: false, error: 'Failed to create school admin' })
  }
  })

  export default router
