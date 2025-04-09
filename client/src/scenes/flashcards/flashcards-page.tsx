"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Home, Repeat } from "lucide-react"
import { fetchFlashcards, Flashcard } from "@/hooks/useFlashcards"
import { getPaperById, Paper } from "@/hooks/usePapers"

// CSS for card flip
import "./flashcards.css"

export default function FlashcardPage() {
  const { paperId } = useParams<{ paperId: string }>()
  const navigate = useNavigate()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [paper, setPaper] = useState<Paper | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFlashcards() {
      try {
        if (!paperId) {
          setError("No paper ID provided")
          setLoading(false)
          return
        }

        // Fetch the paper details
        const paperData = await getPaperById(paperId)
        setPaper(paperData)

        // Fetch flashcards for this paper
        const flashcardsData = await fetchFlashcards(paperId)
        
        if (flashcardsData.length === 0) {
          setError("No flashcards found for this paper")
          setLoading(false)
          return
        }
        
        setFlashcards(flashcardsData)
      } catch (err) {
        console.error("Error fetching flashcards:", err)
        setError("Failed to load flashcards. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadFlashcards()
  }, [paperId])

  const handleFlip = () => {
    setIsFlipped(prev => !prev)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1))
  }

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev < flashcards.length - 1 ? prev + 1 : 0))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious()
    } else if (event.key === 'ArrowRight') {
      handleNext()
    } else if (event.key === ' ' || event.key === 'Spacebar') {
      handleFlip()
      event.preventDefault() // Prevent scrolling with spacebar
    }
  }

  const currentFlashcard = flashcards[currentIndex]
  
  return (
    <div 
      className="container max-w-4xl min-h-screen py-6 flex flex-col" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/flashcards")}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold truncate max-w-[250px] sm:max-w-md">
            {paper?.title || "Flashcards"}
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>
      </div>

      {paper && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {paper.instructions}
          </p>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading flashcards...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/flashcards")}
            >
              Back to Flashcard Sets
            </Button>
          </div>
        ) : currentFlashcard ? (
          <>
            <div className="flex-1 flex flex-col items-center justify-center mb-8">
              <div className="w-full max-w-xl h-[250px] sm:h-[300px] md:h-[350px] flashcard-perspective">
                <Card 
                  className={`relative w-full h-full flashcard-3d transition-transform duration-500 cursor-pointer ${
                    isFlipped ? "flashcard-rotate" : ""
                  }`}
                  onClick={handleFlip}
                >
                  {/* Front */}
                  <CardContent className="absolute inset-0 flashcard-face p-4 sm:p-6 flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-xl sm:text-2xl font-medium text-center">{currentFlashcard.front}</p>
                    </div>
                    <div className="mt-auto text-center text-xs text-muted-foreground">
                      Tap to reveal answer
                    </div>
                  </CardContent>
                  
                  {/* Back */}
                  <CardContent className="absolute inset-0 flashcard-face flashcard-back p-4 sm:p-6 flex flex-col bg-primary/5">
                    <div className="flex-1 flex items-center justify-center overflow-y-auto">
                      <p className="text-lg sm:text-xl text-center">{currentFlashcard.back}</p>
                    </div>
                    <div className="mt-auto text-center text-xs text-muted-foreground">
                      Tap to see question
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePrevious}
                className="h-10 w-10"
                aria-label="Previous card"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                onClick={handleFlip}
                className="flex items-center gap-2 px-4 sm:px-6"
                aria-label="Flip card"
              >
                <Repeat className="h-4 w-4" />
                <span>Flip</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleNext}
                className="h-10 w-10"
                aria-label="Next card"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground mb-2">
              <p>Tip: Use arrow keys to navigate and spacebar to flip</p>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No flashcards found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/flashcards")}
            >
              Back to Flashcard Sets
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
