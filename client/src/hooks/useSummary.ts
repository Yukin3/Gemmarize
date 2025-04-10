import { useEffect, useState } from "react"
import { getPaperById, Paper } from "./usePapers"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

export interface Summary {
  _id: string
  paperId: string
  title: string
  summary: string
}

export function useSummary(paperId?: string) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!paperId) {
      setError("Missing paper ID")
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        const [summaryRes, paperRes] = await Promise.all([
          fetch(`${API_URL}/summaries/${paperId}`),
          getPaperById(paperId as string),
        ])

        if (!summaryRes.ok) throw new Error("Failed to fetch summary")
        const summaryData = await summaryRes.json()

        setSummary(summaryData)
        setPaper(paperRes)
      } catch (err) {
        console.error("Error in useSummary:", err)
        setError("Could not load summary or paper info")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [paperId])

  return { summary, paper, loading, error }
}
