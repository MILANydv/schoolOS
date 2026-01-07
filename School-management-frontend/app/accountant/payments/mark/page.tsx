"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Receipt,
  Upload,
  Save,
  Calculator,
  CheckCircle,
  AlertCircle,
  Percent,
  IndianRupee,
  FileText,
  User,
} from "lucide-react"

// Mock data with more details
const mockStudents = [
  {
    id: "1",
    name: "John Doe",
    rollNo: "001",
    class: "Class 10-A",
    outstandingAmount: 15000,
    lastPayment: "2024-01-15",
    totalFees: 50000,
    paidAmount: 35000,
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNo: "002",
    class: "Class 10-A",
    outstandingAmount: 25000,
    lastPayment: "2024-01-10",
    totalFees: 45000,
    paidAmount: 20000,
  },
  {
    id: "3",
    name: "Mike Johnson",
    rollNo: "003",
    class: "Class 9-B",
    outstandingAmount: 8000,
    lastPayment: "2024-01-20",
    totalFees: 40000,
    paidAmount: 32000,
  },
]

const paymentModes = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "cheque", label: "Cheque", icon: "📝" },
  { value: "online", label: "Online Payment", icon: "💻" },
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "credit_card", label: "Credit Card", icon: "💳" },
  { value: "debit_card", label: "Debit Card", icon: "💳" },
]

const discountTiers = [
  { threshold: 100, discount: 10, label: "Full Payment Bonus" },
  { threshold: 80, discount: 5, label: "Early Payment Discount" },
  { threshold: 50, discount: 2, label: "Partial Payment Incentive" },
]

export default function EnhancedMarkPaymentsPage() {
  const [selectedStudent, setSelectedStudent] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMode, setPaymentMode] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [notes, setNotes] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [applyDiscount, setApplyDiscount] = useState(true)
  const [customDiscount, setCustomDiscount] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const selectedStudentData = mockStudents.find((s) => s.id === selectedStudent)

  // Calculate discount based on payment percentage
  const calculateDiscount = () => {
    if (!selectedStudentData || !paymentAmount) return { discount: 0, amount: 0 }

    const paymentNum = Number.parseFloat(paymentAmount)
    const outstandingAmount = selectedStudentData.outstandingAmount
    const paymentPercentage = (paymentNum / outstandingAmount) * 100

    if (customDiscount) {
      const customDiscountNum = Number.parseFloat(customDiscount)
      return {
        discount: customDiscountNum,
        amount: (paymentNum * customDiscountNum) / 100,
      }
    }

    if (!applyDiscount) return { discount: 0, amount: 0 }

    for (const tier of discountTiers) {
      if (paymentPercentage >= tier.threshold) {
        return {
          discount: tier.discount,
          amount: (paymentNum * tier.discount) / 100,
        }
      }
    }

    return { discount: 0, amount: 0 }
  }

  const discountInfo = calculateDiscount()
  const finalAmount = Number.parseFloat(paymentAmount || "0") - discountInfo.amount
  const isFullPayment =
    selectedStudentData && Number.parseFloat(paymentAmount || "0") >= selectedStudentData.outstandingAmount

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setReceiptFile(file)
    }
  }

  const handleQuickAmount = (percentage: number) => {
    if (selectedStudentData) {
      const amount = (selectedStudentData.outstandingAmount * percentage) / 100
      setPaymentAmount(amount.toString())
    }
  }

  const handleSubmit = () => {
    if (!showConfirmation) {
      setShowConfirmation(true)
      return
    }

    const paymentData = {
      studentId: selectedStudent,
      amount: finalAmount,
      originalAmount: Number.parseFloat(paymentAmount),
      discountApplied: discountInfo.amount,
      discountPercentage: discountInfo.discount,
      mode: paymentMode,
      transactionId,
      notes,
      receiptFile: receiptFile?.name,
      date: new Date().toISOString(),
    }

    console.log("Recording payment:", paymentData)
    alert("Payment recorded successfully!")

    // Reset form
    setSelectedStudent("")
    setPaymentAmount("")
    setPaymentMode("")
    setTransactionId("")
    setNotes("")
    setReceiptFile(null)
    setCustomDiscount("")
    setShowConfirmation(false)
  }

  const resetForm = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mark Payments</h1>
          <p className="text-muted-foreground mt-2">Record manual payments with smart discount calculations</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Receipt className="h-4 w-4 mr-1" />
          Payment Entry
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Payment Form */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <User className="h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>Enter payment information and attach receipt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Student Selection */}
              <div>
                <Label htmlFor="student-select" className="text-sm font-medium text-gray-700">
                  Select Student
                </Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student-select" className="mt-1">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {student.name} ({student.rollNo})
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {student.class}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Student Info Card */}
              {selectedStudentData && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{selectedStudentData.name}</h4>
                        <p className="text-sm text-gray-600">
                          {selectedStudentData.class} • Roll No: {selectedStudentData.rollNo}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Last Payment: {selectedStudentData.lastPayment}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Outstanding Amount</div>
                        <div className="text-xl font-bold text-red-600 flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {selectedStudentData.outstandingAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Paid: ₹{selectedStudentData.paidAmount.toLocaleString()} / ₹
                          {selectedStudentData.totalFees.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Amount Buttons */}
              {selectedStudentData && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Quick Amount Selection</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(25)}
                      className="flex-1"
                    >
                      25%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(50)}
                      className="flex-1"
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(75)}
                      className="flex-1"
                    >
                      75%
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => handleQuickAmount(100)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Full Amount
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Amount and Mode */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="payment-amount" className="text-sm font-medium text-gray-700">
                    Payment Amount (₹)
                  </Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter payment amount"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="payment-mode" className="text-sm font-medium text-gray-700">
                    Payment Mode
                  </Label>
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger id="payment-mode" className="mt-1">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentModes.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          <span className="flex items-center gap-2">
                            <span>{mode.icon}</span>
                            {mode.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Discount Section */}
              {paymentAmount && selectedStudentData && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Percent className="h-4 w-4" />
                        Discount Calculation
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="apply-discount"
                          checked={applyDiscount}
                          onChange={(e) => setApplyDiscount(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="apply-discount" className="text-xs">
                          Auto Discount
                        </Label>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <Label className="text-xs text-gray-600">Custom Discount (%)</Label>
                        <Input
                          type="number"
                          value={customDiscount}
                          onChange={(e) => setCustomDiscount(e.target.value)}
                          placeholder="Enter custom discount"
                          className="mt-1 h-8"
                          max="50"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Original Amount:</span>
                          <span>₹{Number.parseFloat(paymentAmount || "0").toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({discountInfo.discount}%):</span>
                          <span>-₹{discountInfo.amount.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Final Amount:</span>
                          <span>₹{finalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {isFullPayment && (
                      <Alert className="mt-3 border-green-300 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          🎉 Full payment detected! Maximum discount applied.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Transaction Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="transaction-id" className="text-sm font-medium text-gray-700">
                    Transaction ID / Reference
                  </Label>
                  <Input
                    id="transaction-id"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="receipt-upload" className="text-sm font-medium text-gray-700">
                    Attach Receipt
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="receipt-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" className="px-3 bg-transparent">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {receiptFile && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {receiptFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any additional notes about this payment..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Calculator className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {selectedStudentData && paymentAmount ? (
                <>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student:</span>
                      <span className="font-medium">{selectedStudentData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Outstanding:</span>
                      <span className="text-red-600">₹{selectedStudentData.outstandingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span>₹{Number.parseFloat(paymentAmount).toLocaleString()}</span>
                    </div>
                    {discountInfo.amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-₹{discountInfo.amount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Final Amount:</span>
                      <span className="text-blue-600">₹{finalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="text-orange-600">
                        ₹
                        {Math.max(
                          0,
                          selectedStudentData.outstandingAmount - Number.parseFloat(paymentAmount),
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">Select student and enter amount to see summary</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!showConfirmation ? (
              <Button
                onClick={handleSubmit}
                className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedStudent || !paymentAmount || !paymentMode}
                size="lg"
              >
                <Save className="h-4 w-4" />
                Record Payment
              </Button>
            ) : (
              <div className="space-y-2">
                <Alert className="border-orange-300 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Confirm payment of ₹{finalAmount.toLocaleString()} for {selectedStudentData?.name}?
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={resetForm} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Discount Tiers Info */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-gray-800">
                <Percent className="h-4 w-4" />
                Discount Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {discountTiers.map((tier, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">{tier.threshold}% payment:</span>
                    <Badge variant="secondary" className="text-xs">
                      {tier.discount}% off
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
