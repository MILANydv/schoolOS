"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  Bar,
  Pie,
  Cell,
  Tooltip,
} from "recharts"
import {
  School,
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Activity,
  AlertTriangle,
  ArrowLeft,
  User,
} from "lucide-react"
import { MOCK_SCHOOLS } from "@/lib/constants"
import { useParams, useRouter } from "next/navigation"

// Enhanced mock data
const studentEnrollmentData = [
  { month: "Jan", students: 1000, target: 1050 },
  { month: "Feb", students: 1020, target: 1050 },
  { month: "Mar", students: 1050, target: 1050 },
  { month: "Apr", students: 1080, target: 1100 },
  { month: "May", students: 1100, target: 1150 },
  { month: "Jun", students: 1150, target: 1200 },
  { month: "Jul", students: 1200, target: 1250 },
]

const feeCollectionData = [
  { month: "Jan", collected: 50000, expected: 55000 },
  { month: "Feb", collected: 52000, expected: 55000 },
  { month: "Mar", collected: 55000, expected: 55000 },
  { month: "Apr", collected: 53000, expected: 58000 },
  { month: "May", collected: 58000, expected: 60000 },
  { month: "Jun", collected: 60000, expected: 62000 },
  { month: "Jul", collected: 62000, expected: 65000 },
]

const gradeDistribution = [
  { grade: "K-2", students: 300, color: "#8884d8" },
  { grade: "3-5", students: 350, color: "#82ca9d" },
  { grade: "6-8", students: 280, color: "#ffc658" },
  { grade: "9-12", students: 270, color: "#ff7300" },
]

const performanceMetrics = [
  { subject: "Math", score: 85, benchmark: 80 },
  { subject: "Science", score: 78, benchmark: 75 },
  { subject: "English", score: 92, benchmark: 85 },
  { subject: "History", score: 88, benchmark: 82 },
  { subject: "Arts", score: 95, benchmark: 90 },
]

export default function SchoolStatsPage() {
  const params = useParams()
  const router = useRouter()
  const schoolId = params.id as string
  const school = MOCK_SCHOOLS.find((s) => s.id === schoolId)

  if (!school) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>School Not Found</AlertTitle>
          <AlertDescription>School with ID "{schoolId}" could not be found in the system.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "default",
      Inactive: "secondary",
      Trial: "outline",
      Pending: "destructive",
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const getSubscriptionBadge = (subscription: string) => {
    const variants = {
      Free: "secondary",
      Basic: "outline",
      Standard: "default",
      Premium: "destructive",
    } as const
    return <Badge variant={variants[subscription as keyof typeof variants] || "secondary"}>{subscription}</Badge>
  }

  const studentTeacherRatio = Math.round(school.students / school.teachers)
  const establishedYears = new Date().getFullYear() - new Date(school.established).getFullYear()

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <School className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{school.name}</h1>
              <p className="text-muted-foreground">Comprehensive School Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(school.status)}
            {getSubscriptionBadge(school.subscription)}
          </div>
        </div>
      </div>

      {/* School Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            School Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Principal
              </div>
              <p className="font-medium">{school.principal}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="font-medium">{school.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                Phone
              </div>
              <p className="font-medium">{school.phone}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Established
              </div>
              <p className="font-medium">{establishedYears} years ago</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              Address
            </div>
            <p className="font-medium">{school.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.students.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Staff</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.teachers}</div>
            <p className="text-xs text-muted-foreground">Ratio: 1:{studentTeacherRatio} (students per teacher)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$62,000</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <Progress value={87.5} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="enrollment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Enrollment Trend</CardTitle>
                <CardDescription>Monthly student count vs targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={studentEnrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#8884d8" name="Actual" />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Students by grade level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="students"
                      label={({ grade, students }) => `${grade}: ${students}`}
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Collection Analysis</CardTitle>
              <CardDescription>Monthly collection vs expected amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={feeCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                  <Legend />
                  <Bar dataKey="collected" fill="#8884d8" name="Collected" />
                  <Bar dataKey="expected" fill="#82ca9d" name="Expected" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Subject-wise performance vs benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{metric.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {metric.score}% (Benchmark: {metric.benchmark}%)
                      </span>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Demographics</CardTitle>
                <CardDescription>Breakdown by various categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Male Students</span>
                    <span className="font-medium">52% (624)</span>
                  </div>
                  <Progress value={52} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Female Students</span>
                    <span className="font-medium">48% (576)</span>
                  </div>
                  <Progress value={48} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Information</CardTitle>
                <CardDescription>Teaching and administrative staff</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{school.teachers}</div>
                    <p className="text-sm text-muted-foreground">Teachers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-sm text-muted-foreground">Admin Staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
