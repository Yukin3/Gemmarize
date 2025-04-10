import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Code, Globe, Atom, Music, Film, BookOpen, Dumbbell, Tv, Palette, Gamepad2, ExternalLink } from "lucide-react"
import { getAllQuizzes } from "@/hooks/useQuizzes"

const tagIconMap: [string[], React.ElementType][] = [
  [["science"], Atom],
  [["history"], BookOpen],
  [["geography"], Globe],
  [["general"], Brain],
  [["code", "programming", "ai", "nlp", "ml"], Code],
  [["music"], Music],
  [["film", "movies"], Film],
  [["tv"], Tv],
  [["sports", "fitness"], Dumbbell],
  [["art", "drawing", "design"], Palette],
  [["gaming", "games"], Gamepad2],
];

// Utility to find the first match
function getIconFromTags(tags: string[] = []): React.ElementType {
  for (const [tagAliases, icon] of tagIconMap) {
    if (tags.some((tag) => tagAliases.includes(tag.toLowerCase()))) {
      return icon;
    }
  }
  return Brain; // default
}

// Enhanced color map with more vibrant background colors
const tagColorMap: Record<string, { bg: string, text: string, icon: string }> = {
  science: { 
    bg: "bg-green-600", 
    text: "text-white",
    icon: "text-green-200"
  },
  history: { 
    bg: "bg-amber-700", 
    text: "text-white",
    icon: "text-amber-200"
  },
  geography: { 
    bg: "bg-blue-700", 
    text: "text-white",
    icon: "text-blue-200"
  },
  general: { 
    bg: "bg-teal-600", 
    text: "text-white",
    icon: "text-teal-200"
  },
  code: { 
    bg: "bg-purple-700", 
    text: "text-white",
    icon: "text-purple-200"
  },
  music: { 
    bg: "bg-pink-700", 
    text: "text-white",
    icon: "text-pink-200"
  },
  film: { 
    bg: "bg-red-700", 
    text: "text-white",
    icon: "text-red-200"
  },
  tv: { 
    bg: "bg-rose-800", 
    text: "text-white",
    icon: "text-rose-200"
  },
  sports: { 
    bg: "bg-orange-700", 
    text: "text-white",
    icon: "text-orange-200"
  },
  art: { 
    bg: "bg-rose-700", 
    text: "text-white",
    icon: "text-rose-200"
  },
  gaming: { 
    bg: "bg-yellow-700", 
    text: "text-white",
    icon: "text-yellow-200"
  },
  entertainment: { 
    bg: "bg-red-800", 
    text: "text-white",
    icon: "text-red-200"
  },
};

// Enhanced function to get color styles from tags
function getColorFromTags(tags: string[] = []): { bg: string, text: string, icon: string } {
  for (const tag of tags) {
    const key = tag.toLowerCase();
    if (tagColorMap[key]) return tagColorMap[key];
  }
  // Default style
  return { 
    bg: "bg-slate-700", 
    text: "text-white",
    icon: "text-slate-200"
  };
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  questionCount: number;
}

export default function QuizzesGridPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadQuizzes() {
      try {
        setLoading(true);
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  const handleViewDetails = (quizId: string) => {
    navigate(`/quizzes/details/${quizId}`);
  };

  const handleStartQuiz = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/quizzes/paper/${quizId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="container max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Quizzes</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from a variety of quizzes to test your knowledge and challenge yourself with Gemma-generated question sets.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-destructive p-8">{error}</div>
          ) : quizzes.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground mb-4">No quizzes found</p>
              <Button onClick={() => navigate("/summarize")}>Create a Quiz</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {quizzes.map((quiz) => {
                const Icon = getIconFromTags(quiz.tags);
                const colorStyle = getColorFromTags(quiz.tags);

                return (
                  <Card 
                    key={quiz._id} 
                    className={`overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 border-0 h-[320px] cursor-pointer flex flex-col ${colorStyle.bg}`}
                    onClick={() => handleViewDetails(quiz._id)}
                  >
                    <div className="flex flex-col h-full">
                      <CardHeader className={`${colorStyle.text} pb-3`}>
                        <div className="flex justify-between items-start">
                          <Icon className={`h-8 w-8 ${colorStyle.icon}`} />
                          <Badge className="bg-black/30 hover:bg-black/40 text-white border-0 font-semibold">
                            {quiz.questionCount || 0}+ Questions
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold mt-3 line-clamp-2">
                          {quiz.title}
                        </CardTitle>
                        <CardDescription className={`${colorStyle.text} opacity-90 line-clamp-2 mt-1 text-sm`}>
                          {quiz.description || "Test your knowledge with this interactive quiz."}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className={`pt-0 px-6 flex-grow ${colorStyle.text}`}>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {quiz.tags && quiz.tags.length > 0 ? (
                            quiz.tags.slice(0, 3).map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className={`capitalize border-white/30 ${colorStyle.text} text-xs`}
                              >
                                {tag.toLowerCase()}
                              </Badge>
                            ))
                          ) : (
                            <Badge 
                              variant="outline" 
                              className={`border-white/30 ${colorStyle.text} text-xs`}
                            >
                              General
                            </Badge>
                          )}
                          {quiz.tags && quiz.tags.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className={`border-white/30 ${colorStyle.text} text-xs`}
                            >
                              +{quiz.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="mt-auto p-4 pt-0 flex flex-col gap-2">
                        <Button
                          className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                          onClick={(e) => handleStartQuiz(quiz._id, e)}
                        >
                          Start Quiz
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full bg-black/20 hover:bg-black/30 text-white text-xs border-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(quiz._id);
                          }}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          View Details
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
