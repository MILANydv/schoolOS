"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/hooks/useAuthStore"
import { authApi } from "@/lib/api"
import { toast } from "react-hot-toast"
import { USER_ROLES } from "@/lib/constants"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authApi.login({ email, password })

      if (response.success) {
        const { token, user } = response.data

        // Update store
        login(token, {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role as any
        })

        // Set cookie for middleware
        document.cookie = `userRole=${user.role}; path=/; max-age=604800` // 7 days
        localStorage.setItem('token', token)

        toast.success("Login successful!")

        // Redirect based on role
        let dashboardPath = ""
        if (user.role === USER_ROLES.STUDENT_PARENT) {
          dashboardPath = "/student-parent/dashboard"
        } else {
          dashboardPath = `/${user.role.toLowerCase().replace("_", "")}/dashboard`
        }
        router.push(dashboardPath)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.error || "Login failed. Please check your credentials."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login to SchoolWise Pro</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
