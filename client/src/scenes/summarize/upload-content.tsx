"use client"

// import type React from "react"

import {
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




export default function UploadPage() {
  const [activeTab, setActiveTab] = useState("document")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [textContent, setTextContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [instructions, setInstructions] = useState("")
  const { toast } = useToast()
  const generationOptions = ["summary", "flashcards", "quizzes"] as const
  type GenerationType = (typeof generationOptions)[number]
  const [selectedOptions, setSelectedOptions] = useState<GenerationType[]>([])
  const { generateFlashcards } = useFlashcardGenerator()
  const [showResultCards, setShowResultCards] = useState(false)
  const [lastPaperId, setLastPaperId] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState("Preparing the Gemmarization...");

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



  const simulateUploadProgress = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    return interval
  }

  const messageInterval = setInterval(() => {
    setLoadingMessage((prev) => {
      let next;
      do {
        next = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
      } while (next === prev); // Avoid repeating the same message
      return next;
    });
  }, 500);
  

  const handleUpload = async () => {
    const progressInterval = simulateUploadProgress()

    try {
        let content: string | File | undefined
        let contentType:"text" | "email" | "document" | undefined

      if (activeTab === "document") {
        if (!selectedFile) {
          toast({
            title: "No file selected",
            description: "Please select a PDF or Word document.",
            variant: "destructive",
          })
          clearInterval(progressInterval)
          setIsUploading(false)
          return
        }
        content = selectedFile
        contentType = "document"
      } else if (activeTab === "text" || activeTab === "email") {
        if (!textContent.trim()) {
          toast({
            title: "No content provided",
            description: `Please enter any ${activeTab} content to Gemmarize`,
            variant: "destructive",
          })
          clearInterval(progressInterval)
          setIsUploading(false)
          return
        }
        content = textContent
        contentType = activeTab as "text" | "email"
    }


    if (!content || !contentType) {
      toast({
          title: "Unsupported content",
          description: "Only text, tweet, and email are supported for now.",
          variant: "destructive",
        })
        clearInterval(progressInterval)
        setIsUploading(false)
        return
      }
  

      //TODO: FIX(API): fix api call
      const result = await summarizeContent(content, contentType, instructions);
      setLastPaperId(result.paperId);
      toast({
        title: "Gemmary Complete",
        description: `Gemmary for: paperID: ${result.paperId} |  ${result.summary}`,
      })
      
      console.log("SUMMARY TEXT:", result.summary)

      setShowResultCards(true) //TODO: fix(UI): handle results display
      // Generate flashcards if selected
      if (selectedOptions.includes("flashcards") && result.paperId) {
        await generateFlashcards(result.paperId)
      }
      //TODO: fix(UI): generate quizzes


      
      // Ensure progress completes
      setTimeout(() => {
        clearInterval(progressInterval)
        setUploadProgress(100)
        clearInterval(messageInterval);


        setTimeout(() => {
          setIsUploading(false)
          setSelectedFile(null)
          setTextContent("")


          toast({
            title: "Upload successful",
            description: "Your content has been submitted for moderation",
          })
        }, 500)
      }, 1000)
    } catch (err) {
        console.error("Upload failed:", err)
      clearInterval(progressInterval)
      clearInterval(messageInterval);
      setIsUploading(false)

      toast({
        title: "Upload failed",
        description: "There was an error uploading your content",
        variant: "destructive",
      })
    }
  }

  const handleOptionToggle = (option: GenerationType) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    )
  }



  const handleResultCardClick = (type: GenerationType) => {  
    if (type === "summary") {
     const url = `/summarize/paper/${lastPaperId}`;
      // Open in a new tab
       window.open(url, '_blank');
    } else {
      const url = `/flashcards/paper/${lastPaperId}`;
      // Open in a new tab
      window.open(url, '_blank');
    }
  };
  

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Content for Gemmarization</h1>

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
                  placeholder="Include custom instructions for the Gemmary (e.g., 'Focus on methodology only', 'Use bullet points', 'Highlight key points')"
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
                  placeholder="Include custom instructions for the Gemmary (e.g., 'Focus on methodology only', 'Use bullet points', 'Highlight key points')"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  These instructions will be passed to Gemini to guide the Gemmarization.
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
                  placeholder="Include custom instructions for the Gemmary (e.g., 'Focus on methodology only', 'Use bullet points', 'Highlight key points')"
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

