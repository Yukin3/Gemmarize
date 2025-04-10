"use client"

// import type React from "react"

import {
  useRef,
  //  useEffect,
    useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
 Upload,
     MessageSquareWarning,
       MailWarning } from "lucide-react"
import { summarizeContent } from "@/hooks/summarizer"
import { useFlashcardGenerator } from "@/hooks/flashcardGenerator"
import { useToast } from "@/hooks/use-toast"
import UploadProgress from "@/components/upload-progress"
import { useQuizGenerator } from "@/hooks/quizGenerator"




export default function UploadPage() {
  const [activeTab, setActiveTab] = useState("document")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [textContent, setTextContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [instructions, setInstructions] = useState("")
  const { toast } = useToast()
  const generationOptions = ["summaries", "flashcards", "quizzes"] as const
  type GenerationType = (typeof generationOptions)[number]
  const [selectedOptions, setSelectedOptions] = useState<GenerationType[]>([])
  const { generateFlashcards } = useFlashcardGenerator()
  const { generateQuiz } = useQuizGenerator();
  const [showResultCards, setShowResultCards] = useState(false)
  const [lastPaperId, setLastPaperId] = useState<string | null>(null)
  const [lastGeneratedQuizId, setLastGeneratedQuizId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Preparing the Gemmarization...");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);


  const funnyMessages = [
    "Thinking very hard...",
    "Pretending to understand...",
    "Asking people on Reddit...",
    "Consulting the ancient scrolls...",
    "Summoning Gemini's brainpower...",
    "Reading the footnotes...",
    "Highlighting every third word...",
    "Generating knowledge from chaos...",
  ];
  




  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }



  // const simulateUploadProgress = () => {
  //   setIsUploading(true);
  //   setUploadProgress(0);
  
  //   const interval = setInterval(() => {
  //     setUploadProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval);
  //         return 100;
  //       }
  //       return prev + 5;
  //     });
  //   }, 300);
  
  //   progressIntervalRef.current = interval;
  // };
  
  // const messageInterval = setInterval(() => {
  //   setLoadingMessage((prev) => {
  //     let next;
  //     do {
  //       next = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  //     } while (next === prev); // Avoid repeating the same message
  //     return next;
  //   });
  // }, 500);
  

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
  
    // Simulate fake progress
    progressIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  
    // Funny message interval
    messageIntervalRef.current = setInterval(() => {
      setLoadingMessage((prev) => {
        let next;
        do {
          next = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        } while (next === prev);
        return next;
      });
    }, 1200);
  
    try {
      let content: string | File | undefined;
      let contentType: "text" | "email" | "document" | undefined;
  
      if (activeTab === "document") {
        if (!selectedFile) {
          toast({
            title: "No file selected",
            description: "Please select a PDF or Word document.",
            variant: "destructive",
          });
          return cleanUpUpload();
        }
        content = selectedFile;
        contentType = "document";
      } else if (activeTab === "text" || activeTab === "email") {
        if (!textContent.trim()) {
          toast({
            title: "No content provided",
            description: `Please enter any ${activeTab} content to Gemmarize`,
            variant: "destructive",
          });
          return cleanUpUpload();
        }
        content = textContent;
        contentType = activeTab;
      }
  
      if (!content || !contentType) {
        toast({
          title: "Unsupported content",
          description: "Only text, tweet, and email are supported for now.",
          variant: "destructive",
        });
        return cleanUpUpload();
      }
  
      let result: { paperId: string; summary?: string } | null = null;
      const shouldGenerateSummary = selectedOptions.includes("summaries") || selectedOptions.length === 0;
  
      result = await summarizeContent(content, contentType, instructions);
      setLastPaperId(result.paperId);
  
      if (shouldGenerateSummary) {
        toast({
          title: "Gemmary Complete",
          description: `Gemmary for: paperID: ${result.paperId} | ${result.summary}`,
        });
        console.log("SUMMARY TEXT:", result.summary);
      }
  
      setShowResultCards(true);
  
      if (selectedOptions.includes("flashcards") && result.paperId) {
        await generateFlashcards(result.paperId);
      }
  
      if (selectedOptions.includes("quizzes") && result.paperId) {
        const rawText = typeof content === "string" ? content : await content.text();
        const quizRes = await generateQuiz(result.paperId, rawText, contentType, instructions);
  
        if (quizRes?.quiz?._id) {
          setLastGeneratedQuizId(quizRes.quiz._id);
          console.log("🎉 Generated quiz with ID:", quizRes.quiz._id);
        }
      }
  
      // Finish up after delay
      setTimeout(() => {
        cleanUpUpload();
        setUploadProgress(100);
  
        setTimeout(() => {
          setSelectedFile(null);
          setTextContent("");
          toast({
            title: "Upload successful",
            description: "Your content has been submitted for moderation",
          });
        }, 500);
      }, 1000);
    } catch (err) {
      console.error("Upload failed:", err);
      cleanUpUpload();
      toast({
        title: "Upload failed",
        description: "There was an error uploading your content",
        variant: "destructive",
      });
    }
  };
  
  // Clean-up helper
  const cleanUpUpload = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    setIsUploading(false);
  };
  
  const handleOptionToggle = (option: GenerationType) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    )
  }



  const handleResultCardClick = (type: GenerationType) => {
    if (type === "quizzes") {
      const url = `/${type}/details/${lastPaperId}`;
      window.open(url, "_blank");
      if (!lastGeneratedQuizId) return;
      return;
    }
  
    if (!lastPaperId) return;
    const url = `/${type}/paper/${lastPaperId}`;
    window.open(url, "_blank");
  };
  
  
  

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Content to Gemmarize</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload Content</CardTitle>
          <CardDescription>Paste or uploads tweets, texts, or emails to scan for potential threats.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* //TODO: FIX(UI): fix grid cols to match # of active triggers */}
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="document" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>File</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <MessageSquareWarning className="h-4 w-4" />
                <span>Text</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <MailWarning className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="document" className="mt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium mb-2">Selected file:</p>
                    <p className="text-sm text-gray-500">{selectedFile.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="mt-2">
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mb-4 text-gray-400" />
                    <p className="text-sm font-medium mb-1">Upload a document (.pdf or .docx)</p>
                    <p className="text-xs text-gray-500 mb-4">Max size: 10MB</p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                        <span>Browse files</span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                File will be Gemmarized....
              </p>
              <div className="mt-6">
                <Textarea
                  placeholder="Include custom instructions for Gemma (e.g., 'Focus on methodology only', 'Use bullet points', 'Highlight key points')"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  These instructions will be passed to the model to guide the processing.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-6">
              <Textarea
                placeholder="Submit text message for Gemmaarization..."
                className="min-h-[200px]"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Text will be Gemmarized....
              </p>
              <div className="mt-6">
                <Textarea
                  placeholder="Include custom instructions for Gemma (e.g., 'Focus on methodology only', 'Use bullet points', 'Highlight key points')"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  These instructions will be passed to Gemma.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="email" className="mt-6">
              <Textarea
                placeholder="Submit email for Gemmarization..."
                className="min-h-[200px]"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Email will be Gemmarized....
              </p>
              <div className="mt-6">
                <Textarea
                  placeholder="Include custom instructions for Gemma (e.g., 'Focus on methodology only', 'Use bullet points', 'Highlight key points')"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  These instructions will be passed to Gemini to guide the Gemmarization.
                </p>
              </div>

            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-8 justify-center">
            {generationOptions.map((option) => (
              <label
                key={option}
                className={`cursor-pointer px-4 py-2 rounded-full border ${
                  selectedOptions.includes(option)
                    ? "bg-primary text-white border-primary"
                    : "bg-muted text-muted-foreground"
                } transition-colors`}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionToggle(option)}
                  className="hidden"
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>


          {isUploading && (
            <div className="mt-6">
              <UploadProgress progress={uploadProgress} />
              <p className="text-center text-muted-foreground mt-2">{loadingMessage}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <div className="flex space-x-4">
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Gemmarizing..." : "Gemmarize"}
          </Button>
          </div>
        </CardFooter>
      </Card>

      {showResultCards && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-center">Your Results</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {selectedOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleResultCardClick(option)}
                className="w-[250px] h-[160px] bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl hover:ring-2 hover:ring-primary hover:scale-[1.03] transition-all duration-200 cursor-pointer flex items-center justify-center text-lg font-medium"
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

