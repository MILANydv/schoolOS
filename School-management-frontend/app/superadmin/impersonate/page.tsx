"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormSelect } from "@/components/forms/form-select"
import { MOCK_USERS, USER_ROLES } from "@/lib/constants"
import { useAuthStore } from "@/hooks/useAuthStore"
import { useImpersonationStore } from "@/hooks/useImpersonationStore"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default function ImpersonatePage() {
  const [selectedUserId, setSelectedUserId] = React.useState("")
  const { user: currentUser, setRole: setAuthStoreRole } = useAuthStore()
  const { isImpersonating, startImpersonation, stopImpersonation } = useImpersonationStore()
  const router = useRouter()

  const availableUsers = MOCK_USERS.filter((u) => u.role !== USER_ROLES.SUPER_ADMIN) // Super Admin cannot impersonate themselves

  const userOptions = availableUsers.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.role.replace("_", " ")}) - ${user.email}`,
  }))

  const handleImpersonate = () => {
    const userToImpersonate = availableUsers.find((u) => u.id === selectedUserId)
    if (userToImpersonate) {
      startImpersonation(userToImpersonate)
      setAuthStoreRole(userToImpersonate.role) // Update the main auth store role
      
      let dashboardPath = ""
      if (userToImpersonate.role === USER_ROLES.STUDENT_PARENT) {
        dashboardPath = "/student-parent/dashboard"
      } else {
        dashboardPath = `/${userToImpersonate.role.toLowerCase().replace("_", "")}/dashboard`
      }
      router.push(dashboardPath)
    } else {
      alert("Please select a valid user to impersonate.")
    }
  }

  const handleStopImpersonation = () => {
    stopImpersonation()
    setAuthStoreRole(USER_ROLES.SUPER_ADMIN) // Restore original role
    router.push("/superadmin/dashboard")
  }

  if (isImpersonating) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Stop Impersonation</CardTitle>
          <CardDescription>You are currently impersonating another user.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Impersonating!</AlertTitle>
            <AlertDescription>
              You are currently logged in as {useImpersonationStore.getState().impersonatedUser?.name} (
              {useImpersonationStore.getState().impersonatedUser?.role}).
            </AlertDescription>
          </Alert>
          <Button onClick={handleStopImpersonation} className="w-full">
            Stop Impersonating
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Impersonate User</CardTitle>
        <CardDescription>Temporarily log in as another user for support or testing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormSelect
          id="user-select"
          label="Select User to Impersonate"
          options={userOptions}
          value={selectedUserId}
          onValueChange={setSelectedUserId}
          placeholder="Choose a user"
        />
        <Button onClick={handleImpersonate} disabled={!selectedUserId} className="w-full">
          Impersonate
        </Button>
      </CardContent>
    </Card>
  )
}
