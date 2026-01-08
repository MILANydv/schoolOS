import { Router } from 'express'
import prisma from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkPermission } from '../middleware/rbac'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: req.user.schoolId }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    const grades = (school as any).gradeConfiguration || {
      gradingScale: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100, remarks: 'Outstanding' },
        { grade: 'A', minPercentage: 80, maxPercentage: 89.9, remarks: 'Excellent' },
        { grade: 'B+', minPercentage: 70, maxPercentage: 79.9, remarks: 'Very Good' },
        { grade: 'B', minPercentage: 60, maxPercentage: 69.9, remarks: 'Good' },
        { grade: 'C+', minPercentage: 50, maxPercentage: 59.9, remarks: 'Satisfactory' },
        { grade: 'C', minPercentage: 40, maxPercentage: 49.9, remarks: 'Fair' },
        { grade: 'D', minPercentage: 33, maxPercentage: 39.9, remarks: 'Pass' },
        { grade: 'F', minPercentage: 0, maxPercentage: 32.9, remarks: 'Fail' }
      ],
      passingPercentage: 33,
      gradingMethod: 'percentage',
      enableGPA: false,
      gpaScale: null
    }

    res.json({ success: true, data: grades })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch grade configuration' })
  }
})

router.put('/', authMiddleware, checkPermission('manage_grades'), async (req, res) => {
  try {
    const { gradingScale, passingPercentage, gradingMethod, enableGPA, gpaScale } = req.body

    const school = await prisma.school.findUnique({
      where: { id: req.user.schoolId }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    const updatedSchool = await prisma.school.update({
      where: { id: req.user.schoolId },
      data: {
        gradeConfiguration: {
          gradingScale: gradingScale || [
            { grade: 'A+', minPercentage: 90, maxPercentage: 100, remarks: 'Outstanding' },
            { grade: 'A', minPercentage: 80, maxPercentage: 89.9, remarks: 'Excellent' },
            { grade: 'B+', minPercentage: 70, maxPercentage: 79.9, remarks: 'Very Good' },
            { grade: 'B', minPercentage: 60, maxPercentage: 69.9, remarks: 'Good' },
            { grade: 'C+', minPercentage: 50, maxPercentage: 59.9, remarks: 'Satisfactory' },
            { grade: 'C', minPercentage: 40, maxPercentage: 49.9, remarks: 'Fair' },
            { grade: 'D', minPercentage: 33, maxPercentage: 39.9, remarks: 'Pass' },
            { grade: 'F', minPercentage: 0, maxPercentage: 32.9, remarks: 'Fail' }
          ],
          passingPercentage: passingPercentage || 33,
          gradingMethod: gradingMethod || 'percentage',
          enableGPA: enableGPA || false,
          gpaScale: gpaScale || null
        }
      }
    })

    res.json({ success: true, data: updatedSchool.gradeConfiguration })
  } catch (error) {
    console.error('Update grade configuration error:', error)
    res.status(500).json({ success: false, error: 'Failed to update grade configuration' })
  }
})

router.post('/calculate', authMiddleware, async (req, res) => {
  try {
    const { marksObtained, totalMarks, customGradingScale } = req.body

    const school = await prisma.school.findUnique({
      where: { id: req.user.schoolId }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    const gradeConfig = (school as any).gradeConfiguration || {
      gradingScale: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100, remarks: 'Outstanding' },
        { grade: 'A', minPercentage: 80, maxPercentage: 89.9, remarks: 'Excellent' },
        { grade: 'B+', minPercentage: 70, maxPercentage: 79.9, remarks: 'Very Good' },
        { grade: 'B', minPercentage: 60, maxPercentage: 69.9, remarks: 'Good' },
        { grade: 'C+', minPercentage: 50, maxPercentage: 59.9, remarks: 'Satisfactory' },
        { grade: 'C', minPercentage: 40, maxPercentage: 49.9, remarks: 'Fair' },
        { grade: 'D', minPercentage: 33, maxPercentage: 39.9, remarks: 'Pass' },
        { grade: 'F', minPercentage: 0, maxPercentage: 32.9, remarks: 'Fail' }
      ],
      passingPercentage: 33,
      enableGPA: false
    }

    const percentage = (marksObtained / totalMarks) * 100
    const gradingScale = customGradingScale || gradeConfig.gradingScale

    const gradeInfo = gradingScale.find(
      (g: any) => percentage >= g.minPercentage && percentage <= g.maxPercentage
    ) || { grade: 'F', remarks: 'Fail' }

    let gpa = null
    if (gradeConfig.enableGPA && gradeConfig.gpaScale) {
      const gpaInfo = gradeConfig.gpaScale.find(
        (g: any) => percentage >= g.minPercentage && percentage <= g.maxPercentage
      )
      gpa = gpaInfo ? gpaInfo.gpa : 0
    }

    res.json({
      success: true,
      data: {
        percentage: parseFloat(percentage.toFixed(2)),
        grade: gradeInfo.grade,
        remarks: gradeInfo.remarks,
        isPass: percentage >= gradeConfig.passingPercentage,
        gpa
      }
    })
  } catch (error) {
    console.error('Calculate grade error:', error)
    res.status(500).json({ success: false, error: 'Failed to calculate grade' })
  }
})

router.post('/gpa-calculate', authMiddleware, checkPermission('manage_grades'), async (req, res) => {
  try {
    const { percentages } = req.body

    if (!Array.isArray(percentages)) {
      return res.status(400).json({ success: false, error: 'Percentages must be an array' })
    }

    const school = await prisma.school.findUnique({
      where: { id: req.user.schoolId }
    })

    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' })
    }

    const gradeConfig = (school as any).gradeConfiguration

    if (!gradeConfig.enableGPA || !gradeConfig.gpaScale) {
      return res.status(400).json({ success: false, error: 'GPA is not enabled for this school' })
    }

    const gpas = percentages.map(percentage => {
      const gpaInfo = gradeConfig.gpaScale.find(
        (g: any) => percentage >= g.minPercentage && percentage <= g.maxPercentage
      )
      return gpaInfo ? gpaInfo.gpa : 0
    })

    const averageGPA = gpas.reduce((sum: number, gpa: number) => sum + gpa, 0) / gpas.length

    res.json({
      success: true,
      data: {
        gpas,
        averageGPA: parseFloat(averageGPA.toFixed(2))
      }
    })
  } catch (error) {
    console.error('Calculate GPA error:', error)
    res.status(500).json({ success: false, error: 'Failed to calculate GPA' })
  }
})

export default router
