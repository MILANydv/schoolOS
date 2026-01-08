import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

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
    const { status, studentId } = req.query

    const where: any = { schoolId: req.user.schoolId }
    if (status) where.status = status
    if (studentId) where.studentId = studentId

    const fees = await prisma.fee.findMany({
      where,
      include: { student: true, payments: true },
      orderBy: { dueDate: 'asc' }
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
router.post('/', authMiddleware, checkPermission('manage_fees'), async (req, res) => {
  try {
    const {
      studentId,
      feeType,
      totalAmount,
      dueDate,
      academicYear,
      installments,
      discount
    } = req.body

    const fee = await prisma.fee.create({
      data: {
        schoolId: req.user.schoolId,
        studentId,
        feeType,
        totalAmount: Number(totalAmount),
        dueDate: new Date(dueDate),
        academicYear,
        installments: installments || null,
        discount: Number(discount) || 0
      },
      include: { student: true }
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

router.post('/:id/calculate-late-fee', authMiddleware, checkPermission('manage_fees'), async (req, res) => {
  try {
    const { paymentDate } = req.body

    const fee = await prisma.fee.findUnique({
      where: { id: req.params.id },
      include: { student: true }
    })

    if (!fee) {
      return res.status(404).json({ success: false, error: 'Fee not found' })
    }

    if (fee.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    const dueDate = new Date(fee.dueDate)
    const paymentDt = paymentDate ? new Date(paymentDate) : new Date()

    let lateFeeAmount = 0
    if (paymentDt > dueDate) {
      const daysLate = Math.ceil((paymentDt.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      const school = await prisma.school.findUnique({ where: { id: req.user.schoolId } })
      const lateFeeConfig = (school as any).lateFeeConfig || {
        enabled: true,
        dailyRate: 0.01,
        maxLateFee: 0.5
      }

      if (lateFeeConfig.enabled) {
        lateFeeAmount = fee.totalAmount * lateFeeConfig.dailyRate * daysLate
        if (lateFeeConfig.maxLateFee) {
          lateFeeAmount = Math.min(lateFeeAmount, fee.totalAmount * lateFeeConfig.maxLateFee)
        }
      }
    }

    res.json({
      success: true,
      data: {
        feeId: fee.id,
        totalAmount: fee.totalAmount,
        paidAmount: fee.paidAmount,
        dueDate: fee.dueDate,
        paymentDate,
        daysLate: paymentDt > dueDate ? Math.ceil((paymentDt.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        lateFeeAmount: parseFloat(lateFeeAmount.toFixed(2)),
        totalDue: fee.totalAmount - fee.paidAmount + lateFeeAmount
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate late fee' })
  }
})

router.post('/:id/installments', authMiddleware, checkPermission('manage_fees'), async (req, res) => {
  try {
    const { installments } = req.body

    if (!Array.isArray(installments)) {
      return res.status(400).json({ success: false, error: 'Installments must be an array' })
    }

    const fee = await prisma.fee.findUnique({ where: { id: req.params.id } })

    if (!fee) {
      return res.status(404).json({ success: false, error: 'Fee not found' })
    }

    if (fee.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    const totalInstallmentAmount = installments.reduce((sum: number, inst: any) => sum + Number(inst.amount), 0)
    if (Math.abs(totalInstallmentAmount - fee.totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        error: `Total installment amount (${totalInstallmentAmount}) must equal fee total amount (${fee.totalAmount})`
      })
    }

    const updatedFee = await prisma.fee.update({
      where: { id: req.params.id },
      data: { installments },
      include: { student: true }
    })

    res.json({ success: true, data: updatedFee })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update installments' })
  }
})

router.post('/:id/refund', authMiddleware, checkPermission('manage_fees'), async (req, res) => {
  try {
    const { amount, reason } = req.body

    const fee = await prisma.fee.findUnique({
      where: { id: req.params.id },
      include: { payments: true }
    })

    if (!fee) {
      return res.status(404).json({ success: false, error: 'Fee not found' })
    }

    if (fee.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    if (fee.paidAmount < amount) {
      return res.status(400).json({
        success: false,
        error: `Refund amount (${amount}) cannot exceed paid amount (${fee.paidAmount})`
      })
    }

    const newPaidAmount = fee.paidAmount - amount
    const newStatus = newPaidAmount <= 0 ? 'REFUNDED' : 'PARTIAL'

    const refundPayment = await prisma.feePayment.create({
      data: {
        feeId: req.params.id,
        amount: -amount,
        paymentMethod: 'REFUND',
        paymentDate: new Date(),
        receiptNumber: `REF-${Date.now()}`,
        gatewayResponse: { reason }
      }
    })

    const updatedFee = await prisma.fee.update({
      where: { id: req.params.id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus
      },
      include: { student: true, payments: true }
    })

    res.json({ success: true, data: { fee: updatedFee, refundPayment } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process refund' })
  }
})

router.post('/:id/payment/khalti', authMiddleware, async (req, res) => {
  try {
    const { amount, token } = req.body

    const fee = await prisma.fee.findUnique({ where: { id: req.params.id } })

    if (!fee) {
      return res.status(404).json({ success: false, error: 'Fee not found' })
    }

    if (fee.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    res.json({
      success: true,
      message: 'Khalti payment integration placeholder',
      data: {
        gateway: 'Khalti',
        amount,
        feeId: fee.id,
        token,
        note: 'This endpoint requires Khalti API integration'
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process Khalti payment' })
  }
})

router.post('/:id/payment/esewa', authMiddleware, async (req, res) => {
  try {
    const { amount, transactionId } = req.body

    const fee = await prisma.fee.findUnique({ where: { id: req.params.id } })

    if (!fee) {
      return res.status(404).json({ success: false, error: 'Fee not found' })
    }

    if (fee.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    res.json({
      success: true,
      message: 'eSewa payment integration placeholder',
      data: {
        gateway: 'eSewa',
        amount,
        feeId: fee.id,
        transactionId,
        note: 'This endpoint requires eSewa API integration'
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process eSewa payment' })
  }
})

router.delete('/:id', authMiddleware, checkPermission('manage_fees'), async (req, res) => {
  try {
    const fee = await prisma.fee.findUnique({ where: { id: req.params.id } })

    if (!fee) {
      return res.status(404).json({ success: false, error: 'Fee not found' })
    }

    if (fee.schoolId !== req.user.schoolId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    if (fee.paidAmount > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete fee with payments' })
    }

    await prisma.fee.delete({ where: { id: req.params.id } })

    res.json({ success: true, message: 'Fee deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete fee' })
  }
})

export default router
