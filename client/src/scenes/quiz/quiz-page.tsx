"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Home, Flag, Clock, Brain, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { fetchQuizWithQuestions, Quiz, Question } from "@/hooks/useQuizzes"

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({})
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds per question
  const [isFinished, setIsFinished] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    async function fetchQuiz() {
      try {
        if (!quizId) {
          setError("No quiz ID provided")
          setLoading(false)
          return
        }

        const data = await fetchQuizWithQuestions(quizId)
        setQuiz(data.quiz)
        setQuestions(data.questions)
      } catch (err) {
        console.error("Error fetching quiz:", err)
        setError("Failed to load quiz. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    // Reset timer when changing questions
    setTimeLeft(60)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex])

  const handleNextQuestion = () => {
    // Save current answer if selected
    if (selectedOption !== null && currentQuestion) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestion._id]: selectedOption
      })
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
    } else {
      // End of quiz
      setIsFinished(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      // Restore previous answer if it exists
      const prevQuestionId = questions[currentQuestionIndex - 1]._id
      const prevAnswer = userAnswers[prevQuestionId]
      setSelectedOption(typeof prevAnswer === 'number' ? prevAnswer : null)
    }
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleSubmitQuiz = () => {
    // Save final answer if needed
    if (selectedOption !== null && currentQuestion) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestion._id]: selectedOption
      })
    }

    // Calculate score
    let finalScore = 0
    questions.forEach(question => {
      const userAnswer = userAnswers[question._id]
      if (
        (question.type === 'mcq' && userAnswer === question.correct_option_index) ||
        (question.type === 't/f' && userAnswer === question.correct_option_index)
      ) {
        finalScore++
      }
    })

    setScore(finalScore)
    setQuizCompleted(true)
  }

  const handleNewQuiz = () => {
    navigate('/quizzes')
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / questions.length) * 100
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  // Determine the most common question type
  const getQuizDifficulty = () => {
    if (!questions || questions.length === 0) return 'Medium'
    
    // This is a simplified logic - in reality, you might want to base this on actual quiz metadata
    if (questions.length > 15) return 'Hard'
    if (questions.length < 5) return 'Easy'
    return 'Medium'
  }

  if (quizCompleted) {
    return (
      <div className="container max-w-4xl min-h-screen py-6 flex flex-col">
        <main className="flex-1 py-6">
          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden shadow-lg">
              <div className="bg-primary h-2" style={{ width: `${percentage}%` }}></div>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  {percentage >= 70 ? (
                    <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Brain className="h-12 w-12 text-amber-500" />
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold">Your Score</h3>
                  <p className="text-5xl font-bold my-4">
                    {score} / {questions.length}
                    <span className="text-lg text-muted-foreground ml-2">({percentage}%)</span>
                  </p>
                  <p className="text-muted-foreground">
                    {percentage >= 90
                      ? "Outstanding! You're a true expert!"
                      : percentage >= 70
                        ? "Great job! You know your stuff!"
                        : percentage >= 50
                          ? "Good effort! Keep learning!"
                          : "Keep practicing! You'll improve with time!"}
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-semibold mb-2">Quiz Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Category:</div>
                    <div className="font-medium capitalize">{quiz?.tags?.length ? quiz.tags[0] : 'General'}</div>
                    <div>Difficulty:</div>
                    <div className="font-medium capitalize">{getQuizDifficulty()}</div>
                    <div>Questions:</div>
                    <div className="font-medium">{questions.length}</div>
                    <div>Time Limit:</div>
                    <div className="font-medium">60 seconds per question</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleNewQuiz}>
                  New Quiz
                </Button>
                <Button className="w-full sm:w-auto bg-primary" onClick={() => navigate("/quizzes")}>
                  Back to Quizzes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl min-h-screen py-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/quizzes")}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold truncate max-w-[250px] sm:max-w-md">
            {quiz?.title || "Quiz"}
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

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/quizzes")}
          >
            Back to Quizzes
          </Button>
        </div>
      ) : isFinished ? (
        <div className="flex flex-col items-center justify-center py-8">
          <h2 className="text-2xl font-bold mb-6">Quiz Complete!</h2>
          <p className="text-lg mb-6">You've answered all questions.</p>
          <Button onClick={handleSubmitQuiz} className="bg-primary">Submit Quiz</Button>
        </div>
      ) : currentQuestion ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm px-3 py-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <Progress value={progress} className="w-24 sm:w-32 h-2" />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{timeLeft}s</span>
            </div>
          </div>

          <Card className="mb-8 shadow-sm">
            <CardHeader>
              <div className="flex justify-between">
                <Badge 
                  variant="outline" 
                  className={
                    currentQuestion.type === 'mcq' 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" 
                      : currentQuestion.type === 't/f' 
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  }
                >
                  {currentQuestion.type === 'mcq' 
                    ? 'Multiple Choice' 
                    : currentQuestion.type === 't/f' 
                      ? 'True / False'
                      : 'Short Answer'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  #{currentQuestion.question_number}
                </span>
              </div>
              <CardTitle className="text-xl font-semibold mt-2">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentQuestion.type === 'mcq' && currentQuestion.options ? (
                <div className="flex flex-col gap-2 mt-2">
                  {currentQuestion.options.map((option, index) => (
                    <div 
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      className={`
                        p-4 rounded-md border cursor-pointer transition-all
                        ${selectedOption === index 
                          ? 'border-primary bg-primary/10' 
                          : 'border-muted-foreground/20 hover:border-muted-foreground/40'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          h-6 w-6 rounded-full flex items-center justify-center text-xs
                          ${selectedOption === index 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'}
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentQuestion.type === 't/f' ? (
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <div 
                    onClick={() => handleOptionSelect(0)}
                    className={`
                      p-4 rounded-md border cursor-pointer flex-1 transition-all text-center
                      ${selectedOption === 0 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-muted-foreground/20 hover:border-muted-foreground/40'}
                    `}
                  >
                    True
                  </div>
                  <div 
                    onClick={() => handleOptionSelect(1)}
                    className={`
                      p-4 rounded-md border cursor-pointer flex-1 transition-all text-center
                      ${selectedOption === 1 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-muted-foreground/20 hover:border-muted-foreground/40'}
                    `}
                  >
                    False
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Enter your answer:</p>
                  <textarea 
                    className="w-full p-3 border rounded-md resize-none min-h-[100px]" 
                    placeholder="Type your answer here..."
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button 
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    Finish
                    <Flag className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No questions found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/quizzes")}
          >
            Back to Quizzes
          </Button>
        </div>
      )}
    </div>
  )
}
