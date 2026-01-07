import { useRouter } from "next/router"
import { MOCK_RESULTS_APPROVAL } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function StudentResultsPage() {
  const router = useRouter()
  const { studentId } = router.query
  const { toast } = useToast()
  const results = MOCK_RESULTS_APPROVAL.filter(r => r.studentName.replace(/\s+/g, "").toLowerCase() === (studentId as string)?.toLowerCase())

  useEffect(() => {
    if (results.length) toast({ title: `Viewing results for ${results[0].studentName}` })
    // eslint-disable-next-line
  }, [studentId])

  if (!results.length) return <div className="p-8 text-center">No results found for this student.</div>

  // Group results by exam
  const exams = Array.from(new Set(results.map(r => r.examName)))
  const student = results[0]

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <Button onClick={() => router.back()} variant="outline" className="mb-4 hover:bg-muted focus:bg-muted outline-none">&larr; Back</Button>
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center text-xl font-bold text-blue-700">
          {student.studentName.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <div className="text-xl font-bold">{student.studentName}</div>
          <div className="text-xs text-muted-foreground">Roll No: {student.rollNumber} | Class: {student.class}</div>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {exams.map(exam => {
          const examResults = results.filter(r => r.examName === exam)
          return (
            <AccordionItem value={exam} key={exam} className="mb-4 border rounded">
              <AccordionTrigger className="px-4 py-2 bg-gray-100 text-lg font-semibold rounded-t">{exam}</AccordionTrigger>
              <AccordionContent className="p-4">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="text-left px-2 py-2">Subject</th>
                      <th className="text-left px-2 py-2">Marks</th>
                      <th className="text-left px-2 py-2">Status</th>
                      <th className="text-left px-2 py-2">Mark Sheet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examResults.map(r => (
                      <tr key={r.id} className="bg-muted/50 hover:bg-muted">
                        <td className="px-2 py-2 font-medium">{r.subject}</td>
                        <td className="px-2 py-2 font-mono">{r.marks} / {r.maxMarks}</td>
                        <td className="px-2 py-2"><Badge>{r.status}</Badge></td>
                        <td className="px-2 py-2">
                          <Button
                            size="sm"
                            className="hover:bg-muted focus:bg-muted outline-none"
                            onClick={() => {
                              toast({ title: `Viewing mark sheet for ${r.studentName}` })
                              router.push(`/schooladmin/results/marksheet/${r.id}`)
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
} 