"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Bookmark, Share, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllPapers, Paper } from "@/hooks/usePapers"

// CSS classes for 3D card flipping
import "./flashcards.css"

export default function FlashcardsGridPage() {
  const [paperSets, setPaperSets] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchPaperSets() {
      try {
        const papers = await getAllPapers()
        // Filter papers that have flashcards (in a real app, you might have a dedicated API endpoint for this)
        setPaperSets(papers)
      } catch (err) {
        console.error("Error fetching flashcard sets:", err)
        setError("Failed to load flashcard sets. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPaperSets()
  }, [])

  const handleReviewClick = (paperId: string) => {
    navigate(`/flashcards/paper/${paperId}`)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Flashcard Sets</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-destructive p-8">{error}</div>
      ) : paperSets.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No flashcard sets found</p>
          <Button onClick={() => navigate("/summarize")}>Create Flashcards</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[calc(100vh-12rem)] overflow-y-auto pb-4 px-1">
          {paperSets.map((paper) => (
            <Card 
              key={paper._id} 
              className="relative group cursor-pointer hover:shadow-md transition-shadow duration-200 h-[350px] sm:h-[380px] flex flex-col"
            >
              <CardContent className="p-5 flex flex-col h-full">
                <div className="absolute top-2 right-2 z-10 dropdown-menu">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("Bookmark", paper._id)
                        }}
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        <span>Bookmark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("Share", paper._id)
                        }}
                      >
                        <Share className="h-4 w-4 mr-2" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("Copy", paper._id)
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        <span>Copy</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h2 className="font-medium text-lg mb-3 line-clamp-2">{paper.title}</h2>
                
                {paper.tags && paper.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {paper.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-block bg-primary/10 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {paper.tags.length > 3 && (
                      <span className="inline-block text-muted-foreground text-xs px-1 py-1">
                        +{paper.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-muted-foreground text-sm line-clamp-7 flex-grow overflow-y-auto">
                  {paper.instructions || "No instructions provided"}
                </p>
                
                <div className="mt-auto pt-4">
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReviewClick(paper._id)
                    }}
                  >
                    Review Flashcards
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
