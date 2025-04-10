export interface Quiz {
    _id: string;
    title: string;
    description?: string;
    source_type: string;
    source_id: string;
    tags: string[];
    created_at: string;
    questionCount: number;
  }
  
  export interface Question {
    _id: string;
    quiz_id: string;
    question_number: number;
    question: string;
    answer: string;
    rationale: string;
    type: string;
    options?: string[];
    correct_option_index?: number;
    created_at: string;
  }
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  
  export async function getAllQuizzes(): Promise<Quiz[]> {
    const res = await fetch(`${API_URL}/quizzes`);
    if (!res.ok) throw new Error("Failed to fetch quizzes");
    return await res.json();
  }
  
  export async function fetchQuizWithQuestions(quizId: string): Promise<{ quiz: Quiz; questions: Question[] }> {
    const res = await fetch(`${API_URL}/quizzes/${quizId}`);
    if (!res.ok) throw new Error("Failed to fetch quiz details");
    return await res.json();
  }
  