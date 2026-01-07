import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all notifications
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { schoolId: req.user.schoolId }
    })
    res.json({ success: true, data: notifications })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' })
  }
})

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *               priority:
 *                 type: string
 *               audience:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Notification created successfully
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const notification = await prisma.notification.create({
      data: { ...req.body, schoolId: req.user.schoolId }
    })
    res.json({ success: true, data: notification })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create notification' })
  }
})

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Update a notification
 *     tags: [Notifications]
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
 *         description: Notification updated successfully
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json({ success: true, data: notification })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update notification' })
  }
})

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
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
 *         description: Notification deleted successfully
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Notification deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete notification' })
  }
})

export default router
