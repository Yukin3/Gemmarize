import { useToast } from "@/hooks/use-toast"

export function useFlashcardGenerator() {
  const { toast } = useToast()
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

  const generateFlashcards = async (paperId: string) => {
    try {
      toast({
        title: "Generating Flashcards",
        description: "Gemini is crafting your flashcards... 🧠",
      })

      const response = await fetch(`${API_URL}/flashcards/generate/${paperId}`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to generate flashcards")

      toast({
        title: "Flashcards Ready!",
        description: "Your flashcards have been generated successfully.",
      })

      return true
    } catch (err) {
      console.error("Flashcard generation failed:", err)
      toast({
        title: "Flashcard Generation Failed",
        description: "Something went wrong while generating flashcards.",
        variant: "destructive",
      })
      return false
    }
  }

  return { generateFlashcards }
}
