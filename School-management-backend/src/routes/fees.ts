import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/fees:
 *   get:
 *     summary: Get all fees
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all fees
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      where: { schoolId: req.user.schoolId },
      include: { student: true, payments: true }
    })
    res.json({ success: true, data: fees })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch fees' })
  }
})

/**
 * @swagger
 * /api/fees:
 *   post:
 *     summary: Create a new fee
 *     tags: [Fees]
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
 *               feeType:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               academicYear:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fee created successfully
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const fee = await prisma.fee.create({
      data: { ...req.body, schoolId: req.user.schoolId }
    })
    res.json({ success: true, data: fee })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create fee' })
  }
})

/**
 * @swagger
 * /api/fees/{id}/payment:
 *   post:
 *     summary: Record a fee payment
 *     tags: [Fees]
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
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [CASH, CARD, ONLINE, CHEQUE, BANK_TRANSFER]
 *               paymentDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Payment recorded successfully
 */
router.post('/:id/payment', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDate } = req.body
    const fee = await prisma.fee.findUnique({ where: { id: req.params.id } })
    
    if (!fee) {
      return res.status(404).json({ success: false, error: 'Fee not found' })
    }
    
    const payment = await prisma.feePayment.create({
      data: {
        feeId: req.params.id,
        amount,
        paymentMethod,
        paymentDate: new Date(paymentDate),
        receiptNumber: `RCP-${Date.now()}`
      }
    })
    
    const newPaidAmount = fee.paidAmount + amount
    const newStatus = newPaidAmount >= fee.totalAmount ? 'PAID' : 'PARTIAL'
    
    await prisma.fee.update({
      where: { id: req.params.id },
      data: { paidAmount: newPaidAmount, status: newStatus }
    })
    
    res.json({ success: true, data: payment })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to record payment' })
  }
})

export default router
