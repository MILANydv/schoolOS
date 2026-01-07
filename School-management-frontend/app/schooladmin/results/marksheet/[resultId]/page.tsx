"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { MOCK_RESULTS_APPROVAL } from "@/lib/constants"
import MarkSheetView from "@/components/marksheet/marksheet-view"

export default function MarkSheetPage() {
  const params = useParams()
  const router = useRouter()
  const resultId = params?.resultId as string

  // Find the result by ID
  const result = MOCK_RESULTS_APPROVAL.find(r => r.id === resultId)
  
  if (!result) {
  return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Result Not Found</h1>
          <p className="text-slate-600 mb-6">The requested result could not be found.</p>
          <button 
            onClick={() => router.back()} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
      </div>
    </div>
  )
  }

  return <MarkSheetView result={result} />
}
