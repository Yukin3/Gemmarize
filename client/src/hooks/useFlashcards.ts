export interface Flashcard {
    _id: string;
    paper_id: string;
    front: string;
    back: string;
    created_at: string;
  }
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"
  
  export async function getAllFlashcards(): Promise<Flashcard[]> {
    const res = await fetch(`${API_URL}/flashcards`)
    if (!res.ok) throw new Error("Failed to fetch flashcards");
    const data = await res.json();
    return data.flashcards;
  }
  
  export async function fetchFlashcards(paperId: string): Promise<Flashcard[]> {
    const res = await fetch(`${API_URL}/flashcards/paper/${paperId}`);

    if (!res.ok) {
      const text = await res.text(); // Debugging
      console.error("Non-200 response body:", text);
      throw new Error("Failed to fetch flashcards");
    }
    const data = await res.json();
    return data.flashcards;
  }