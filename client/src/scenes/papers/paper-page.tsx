"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Home } from "lucide-react"
import { getPaperById, Paper } from "@/hooks/usePapers"

export default function PaperPage() {
  const { paperId } = useParams<{ paperId: string }>()
  const navigate = useNavigate()
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    async function fetchPaper() {
      try {
        if (!paperId) {
          setError("No paper ID provided")
          setLoading(false)
          return
        }

        const paperData = await getPaperById(paperId)
        setPaper(paperData)
        
        // Calculate word count
        if (paperData.content) {
          const words = paperData.content
            .trim()
            .split(/\s+/)
            .filter(word => word.length > 0)
          setWordCount(words.length)
        }
      } catch (err) {
        console.error("Error fetching paper:", err)
        setError("Failed to load paper. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPaper()
  }, [paperId])

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="container max-w-4xl min-h-screen py-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Paper</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading paper...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/papers")}
            >
              Back to Papers
            </Button>
          </div>
        ) : paper ? (
          <>
            <Card className="shadow-sm mb-4">
              <CardContent className="p-6">
                <h2 className="text-2xl font-medium mb-4">{paper.title}</h2>
                
                {paper.instructions && (
                  <div className="bg-primary/5 p-4 rounded mb-6 text-sm">
                    <strong>Instructions:</strong> {paper.instructions}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {paper.tags?.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary-foreground text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  {paper.content ? (
                    paper.content.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No content available</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                {paper.uploaded_at && (
                  <p>Uploaded: {formatDate(paper.uploaded_at)}</p>
                )}
              </div>
              <div>
                <p>Word count: {wordCount}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No paper found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/papers")}
            >
              Back to Papers
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
