import { useToast } from "@/hooks/use-toast";

export function useQuizGenerator() {
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  const generateQuiz = async (
    sourceId: string,
    content: string,
    sourceType: string = "text",
    instructions = "",
    tags: string[] = []
  ) => {
      try {
      toast({
        title: "Generating Quiz",
        description: "Gemini is crafting your quiz questions... ✍️",
      });

      const response = await fetch(`${API_URL}/quizzes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_id: sourceId, source_type: sourceType, instructions, content, tags }),
    });

      if (!response.ok) throw new Error("Failed to generate quiz");

      const result = await response.json();

      toast({
        title: "Quiz Ready!",
        description: "Your quiz has been generated successfully.",
      });

      return result; // Return the full quiz payload (quiz + questions)
    } catch (err) {
      console.error("Quiz generation failed:", err);
      toast({
        title: "Quiz Generation Failed",
        description: "Something went wrong while generating your quiz.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { generateQuiz };
}
