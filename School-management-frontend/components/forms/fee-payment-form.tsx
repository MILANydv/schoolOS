"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const paymentModes = ["Cash", "Bank Transfer", "Cheque", "Online Payment", "UPI", "Credit Card", "Debit Card"]

const feePaymentSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  paymentMode: z.enum(["Cash", "Bank Transfer", "Cheque", "Online Payment", "UPI", "Credit Card", "Debit Card"], {
    required_error: "Payment mode is required.",
  }),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
  receiptFile: z.any().optional(), // For file input, validation will be manual or handled by server
})

type FeePaymentFormValues = z.infer<typeof feePaymentSchema>

interface FeePaymentFormProps {
  onSubmit: (data: FeePaymentFormValues) => void
  onCancel: () => void
  initialData?: Partial<FeePaymentFormValues>
}

export function FeePaymentForm({ onSubmit, onCancel, initialData }: FeePaymentFormProps) {
  const { toast } = useToast()

  const form = useForm<FeePaymentFormValues>({
    resolver: zodResolver(feePaymentSchema),
    defaultValues: initialData,
  })

  const handleSubmit = (values: FeePaymentFormValues) => {
    // Simulate API call
    console.log("Submitting fee payment:", values)
    setTimeout(() => {
      onSubmit(values)
      toast({
        title: "Payment Recorded!",
        description: "The fee payment has been successfully recorded.",
        variant: "default",
      })
      form.reset()
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter payment amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID / Reference (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter transaction ID or reference" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter any additional notes about this payment..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File upload field - simplified for mock, actual implementation needs more */}
        <FormItem>
          <FormLabel>Attach Receipt (Optional)</FormLabel>
          <FormControl>
            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
