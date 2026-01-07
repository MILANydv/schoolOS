import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all classes
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      where: { schoolId: req.user.schoolId }
    })
    res.json({ success: true, data: classes })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch classes' })
  }
})

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               section:
 *                 type: string
 *               grade:
 *                 type: string
 *               academicYear:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Class created successfully
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const classData = await prisma.class.create({
      data: { ...req.body, schoolId: req.user.schoolId }
    })
    res.json({ success: true, data: classData })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create class' })
  }
})

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Update a class
 *     tags: [Classes]
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
 *         description: Class updated successfully
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const classData = await prisma.class.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json({ success: true, data: classData })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update class' })
  }
})

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
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
 *         description: Class deleted successfully
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.class.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Class deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete class' })
  }
})

export default router
