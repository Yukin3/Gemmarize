"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface Summary {
  paperId: string
  title: string
  summary: string
}

export default function SummariesPage() {
  const { paperId } = useParams()
  const navigate = useNavigate()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

  useEffect(() => {
    async function fetchSummary() {
      try {
        if (!paperId) {
          setError("No paper ID provided")
          setLoading(false)
          return
        }

        const response = await fetch(`${API_URL}/summaries/${paperId}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch summary")
        }

        const data = await response.json()
        setSummary(data)
      } catch (err) {
        console.error("Error fetching summary:", err)
        setError("Failed to load summary. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [paperId, API_URL])

  return (
    <div className="container max-w-4xl min-h-screen py-6 flex flex-col">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Summary</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading summary...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/summarize")}
            >
              Back to Upload
            </Button>
          </div>
        ) : summary ? (
          <div className="w-full max-w-3xl">
            <Card className="mb-8 shadow-md">
              <CardHeader className="bg-primary/5 pb-3">
                <h2 className="text-xl font-medium">{summary.title}</h2>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  {summary.summary.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => navigate("/summarize")}
                className="mr-2"
              >
                New Summary
              </Button>
              <Button onClick={() => window.print()}>
                Save as PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No summary found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/summarize")}
            >
              Back to Upload
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
