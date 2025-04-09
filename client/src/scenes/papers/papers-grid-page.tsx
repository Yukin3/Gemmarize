"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Share, Bookmark, ExternalLink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllPapers, Paper } from "@/hooks/usePapers"

export default function PapersGridPage() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchPapers() {
      try {
        const paperData = await getAllPapers()
        setPapers(paperData)
      } catch (err) {
        console.error("Error fetching papers:", err)
        setError("Failed to load papers. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPapers()
  }, [])

  const getContentPreview = (content?: string) => {
    if (!content) return "No preview available"
    return content.slice(0, 150) + (content.length > 150 ? "..." : "")
  }

  const handleCardClick = (paperId: string) => {
    navigate(`/papers/${paperId}`)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Papers</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-destructive p-8">{error}</div>
      ) : papers.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No papers found</p>
          <Button onClick={() => navigate("/summarize")}>Upload a Document</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-h-[calc(100vh-12rem)] overflow-y-auto pb-4 px-1">
          {papers.map((paper) => (
            <Card 
              key={paper._id} 
              className="relative group cursor-pointer hover:shadow-md transition-shadow duration-200 h-[220px] flex flex-col"
              onClick={(e) => {
                // Prevent navigation if dropdown is clicked
                if (!(e.target as HTMLElement).closest('.dropdown-menu')) {
                  handleCardClick(paper._id)
                }
              }}
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="absolute top-2 right-2 dropdown-menu z-10">
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
                          console.log("Share", paper._id)
                        }}
                      >
                        <Share className="h-4 w-4 mr-2" />
                        <span>Share</span>
                      </DropdownMenuItem>
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
                          window.open(`/papers/${paper._id}`, '_blank')
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span>Open in New Tab</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h2 className="font-medium text-lg mb-2 line-clamp-1">{paper.title}</h2>
                <p className="text-muted-foreground text-sm line-clamp-5">
                  {getContentPreview(paper.content)}
                </p>
                <div className="mt-auto pt-2 flex flex-wrap gap-1">
                  {paper.tags && paper.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-primary/10 text-primary-foreground text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {paper.tags && paper.tags.length > 2 && (
                    <span className="inline-block text-muted-foreground text-xs px-1 py-1">
                      +{paper.tags.length - 2} more
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
