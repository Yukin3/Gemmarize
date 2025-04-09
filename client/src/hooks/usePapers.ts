export interface Paper {
    _id: string
    title: string
    file_name?: string
    instructions?: string
    uploaded_at: string
    tags?: string[]
    content?: string // only returned in getSinglePaper
  }
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"
  
  export async function getAllPapers(): Promise<Paper[]> {
    const res = await fetch(`${API_URL}/papers`)
    if (!res.ok) throw new Error("Failed to fetch papers")
    return await res.json()
  }
  
  export async function getPaperById(id: string): Promise<Paper> {
    const res = await fetch(`${API_URL}/papers/${id}`)
    if (!res.ok) throw new Error("Failed to fetch paper")
    return await res.json()
  }
  
  export async function searchPapersByTag(query: string): Promise<Paper[]> {
    const res = await fetch(`${API_URL}/papers/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error("Search failed")
    return await res.json()
  }
  