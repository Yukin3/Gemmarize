import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchQuizWithQuestions, Quiz, Question } from "@/hooks/useQuizzes"
import { Brain, Code, Globe, Atom, Music, Film, BookOpen, Dumbbell, Tv, Palette, Gamepad2, ChevronLeft, ListChecks, Tag } from "lucide-react"

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

function getIconFromTags(tags: string[] = []): React.ElementType {
  for (const [tagAliases, icon] of tagIconMap) {
    if (tags.some((tag) => tagAliases.includes(tag.toLowerCase()))) {
      return icon;
    }
  }
  return Brain; // default
}

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

export default function QuizDetailsPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuizDetails() {
      try {
        if (!quizId) {
          setError("Quiz ID is missing");
          setLoading(false);
          return;
        }

        setLoading(true);
        const data = await fetchQuizWithQuestions(quizId);
        setQuiz(data.quiz);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error loading quiz details:", err);
        setError("Failed to load quiz details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadQuizDetails();
  }, [quizId]);

  const handleStartQuiz = () => {
    if (quiz) {
      navigate(`/quizzes/paper/${quiz._id}`);
    }
  };

  const handleBackToQuizzes = () => {
    navigate("/quizzes");
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Error</CardTitle>
            <CardDescription>
              {error || "Failed to load quiz details"}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={handleBackToQuizzes}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Quizzes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const Icon = getIconFromTags(quiz.tags);
  const colorStyle = getColorFromTags(quiz.tags);

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          onClick={handleBackToQuizzes}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Quizzes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Card */}
        <div className="md:col-span-2">
          <Card className={`overflow-hidden shadow-lg border-0 ${colorStyle.bg} ${colorStyle.text}`}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-4">
                <Icon className={`h-12 w-12 ${colorStyle.icon}`} />
                <Badge className="bg-black/30 text-white border-0 font-semibold px-3 py-1 text-sm">
                  {quiz.questionCount || questions.length}+ Questions
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold mb-3">{quiz.title}</CardTitle>
              <CardDescription className={`${colorStyle.text} opacity-90 text-base`}>
                {quiz.description || "Test your knowledge with this interactive quiz."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-2 pb-6">
              {quiz.tags && quiz.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className={`h-4 w-4 ${colorStyle.icon}`} />
                    <h3 className="text-lg font-semibold">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quiz.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="capitalize bg-white/20 hover:bg-white/30 text-white border-0">
                        {tag.toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-0 pb-6">
              <Button 
                onClick={handleStartQuiz}
                className="bg-white hover:bg-white/90 text-slate-900 font-semibold"
                size="lg"
              >
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Side Info Cards */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Quiz Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                  <div className="font-medium">{quiz.questionCount || questions.length} questions</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Question Types</div>
                  <div className="font-medium flex flex-wrap gap-2 mt-1">
                    {questions.some(q => q.type === 'mcq') && (
                      <Badge variant="outline">Multiple Choice</Badge>
                    )}
                    {questions.some(q => q.type === 't/f') && (
                      <Badge variant="outline">True/False</Badge>
                    )}
                    {questions.some(q => q.type === 'short') && (
                      <Badge variant="outline">Short Answer</Badge>
                    )}
                    {!questions.some(q => ['mcq', 't/f', 'short'].includes(q.type)) && (
                      <Badge variant="outline">Multiple Choice</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="font-medium">
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {questions.length > 0 ? (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Sample Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {questions.slice(0, 3).map((question, index) => (
                    <li key={question._id} className="border-b pb-2 last:border-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {question.type === 'mcq' ? 'Multiple Choice' : 
                         question.type === 't/f' ? 'True/False' : 'Short Answer'}
                      </p>
                    </li>
                  ))}
                </ul>
                {questions.length > 3 && (
                  <p className="text-sm text-muted-foreground mt-3">
                    ...and {questions.length - 3} more questions
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-md">
              <CardContent className="py-4">
                <p className="text-muted-foreground text-sm text-center">
                  No sample questions available
                </p>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleStartQuiz}
            size="lg"
            className="mt-2 bg-violet-600 hover:bg-violet-700 text-white py-6"
          >
            Start Quiz Now
          </Button>
        </div>
      </div>
    </div>
  );
}
