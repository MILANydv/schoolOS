"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const assignmentSubmissionSchema = z.object({
  submissionText: z.string().optional(),
  submissionFile: z.any().optional(), // For file input, validation will be manual or handled by server
})

type AssignmentSubmissionFormValues = z.infer<typeof assignmentSubmissionSchema>

interface AssignmentSubmissionFormProps {
  onSubmit: (data: AssignmentSubmissionFormValues) => void
  onCancel: () => void
  initialData?: Partial<AssignmentSubmissionFormValues>
}

export function AssignmentSubmissionForm({ onSubmit, onCancel, initialData }: AssignmentSubmissionFormProps) {
  const { toast } = useToast()

  const form = useForm<AssignmentSubmissionFormValues>({
    resolver: zodResolver(assignmentSubmissionSchema),
    defaultValues: initialData,
  })

  const handleSubmit = (values: AssignmentSubmissionFormValues) => {
    // Simulate API call
    console.log("Submitting assignment:", values)
    setTimeout(() => {
      onSubmit(values)
      toast({
        title: "Assignment Submitted!",
        description: "Your assignment has been successfully submitted.",
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
          name="submissionText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submission Text (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your submission here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File upload field - simplified for mock, actual implementation needs more */}
        <FormItem>
          <FormLabel>Attach File (Optional)</FormLabel>
          <FormControl>
            <Input type="file" accept=".pdf,.doc,.docx,.zip" />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Submit Assignment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
