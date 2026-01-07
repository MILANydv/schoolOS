"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_SCHOOLS } from "@/lib/constants"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["super_admin", "school_admin", "teacher", "accountant", "student"]),
  schoolId: z.string().optional(),
  status: z.enum(["active", "inactive", "pending", "suspended"]),
})

type FormData = z.infer<typeof formSchema>

interface AddUserFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function AddUserForm({ initialData, onSubmit, onCancel }: AddUserFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || "student",
      schoolId: initialData?.schoolId || "defaultSchoolId", // Updated default value
      status: initialData?.status || "active",
    },
  })

  const handleSubmit = (data: FormData) => {
    const userData = {
      ...data,
      id: initialData?.id || Date.now().toString(),
      lastLogin: initialData?.lastLogin || new Date().toISOString(),
    }
    onSubmit(userData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="school_admin">School Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="teacher">Accountant</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="defaultSchoolId">No School</SelectItem> {/* Updated value */}
                  {MOCK_SCHOOLS.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Leave empty if not associated with a specific school</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update User" : "Create User"}</Button>
        </div>
      </form>
    </Form>
  )
}
