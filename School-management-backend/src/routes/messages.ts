import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/inbox', authMiddleware, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        receiverId: req.user.id,
        schoolId: req.user.schoolId
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch inbox' })
  }
})

router.get('/sent', authMiddleware, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        senderId: req.user.id,
        schoolId: req.user.schoolId
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sent messages' })
  }
})

router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { receiverId, subject, content } = req.body

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver || receiver.schoolId !== req.user.schoolId) {
      return res.status(404).json({ success: false, error: 'Receiver not found' })
    }

    const message = await prisma.message.create({
      data: {
        schoolId: req.user.schoolId,
        senderId: req.user.id,
        receiverId,
        subject,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    })

    res.json({ success: true, data: message })
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ success: false, error: 'Failed to send message' })
  }
})

router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await prisma.message.findUnique({
      where: { id: req.params.id }
    })

    if (!message || message.receiverId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Message not found' })
    }

    const updatedMessage = await prisma.message.update({
      where: { id: req.params.id },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    res.json({ success: true, data: updatedMessage })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark message as read' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await prisma.message.findUnique({
      where: { id: req.params.id }
    })

    if (!message || (message.senderId !== req.user.id && message.receiverId !== req.user.id)) {
      return res.status(404).json({ success: false, error: 'Message not found' })
    }

    await prisma.message.delete({
      where: { id: req.params.id }
    })

    res.json({ success: true, message: 'Message deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete message' })
  }
})

export default router
