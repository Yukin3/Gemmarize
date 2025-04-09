import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Bot, PencilRuler, Rocket, BrainCircuit } from "lucide-react"
import { IconNeedleThread, IconDatabase } from '@tabler/icons-react';


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 -z-10" />
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">

            <div className="md:w-1/2 relative">
              <div className="relative w-full h-[400px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden">
                <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-lg shadow-lg p-4 rotate-6 animate-float">
                  <div className="h-4 w-32 bg-primary/20 rounded mb-2"></div>
                  <div className="h-3 w-28 bg-primary/20 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-accent/30 rounded"></div>
                    <div className="h-3 w-full bg-accent/30 rounded"></div>
                    <div className="h-3 w-full bg-accent/30 rounded"></div>
                  </div>
                </div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-lg shadow-lg p-4 -rotate-3 animate-bounce-slow">
                  <div className="h-4 w-32 bg-primary/20 rounded mb-2"></div>
                  <div className="h-3 w-28 bg-primary/20 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 w-full bg-accent/30 rounded"></div>
                    <div className="h-8 w-full bg-accent/30 rounded"></div>
                    <div className="h-8 w-full bg-accent/30 rounded"></div>
                    <div className="h-8 w-full bg-accent/30 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Bot className="h-16 w-16 text-black dark:text-purple-500" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Digest content and make information understandable with <span className="text-primary">Gemmarize</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Gemmarize generates high quality summarizations of content ranging from documents, to emails, to entire webpages. By conforming to your
                instructions, Gemma creates the best possible way for you process information.
              </p>
              <div className="flex gap-4 pt-4">
                <Link to="/summarize">
                  <Button size="lg" className="gap-2" onClick={() => console.log("Start Quiz button clicked")}>
                    <Rocket className="h-5 w-5" />
                        Gemmarize Now
                  </Button>
                </Link>
                <Link to="/flashcards" target="_blank">
                  <Button size="lg" variant="outline">
                    Explore Capabilities
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Limitless Possibilities</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gemmarize combines powerful NLP technology with an extensive dataset of references and source material to deliver insights in any format you require, helping you understand information like never before.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow quiz-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconNeedleThread className="h-6 w-6 text-primary dark:text-cyan-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
                <p className="text-muted-foreground">
                  Our AI recommends topics that suit your niche user profile best, pushing content related to fields of interest to expand on learing and increase motivation.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow quiz-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6 text-primary dark:text-pink-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gemma's NLP Technology</h3>
                <p className="text-muted-foreground">
                Powered by Gemma - a powerful, fine-tuned version of Google's Gemini model- our AI understands and processes content with incredible accuracy and precision, enabling you to gain deep insights from any material.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow quiz-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconDatabase className="h-6 w-6 text-primary dark:text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Over 250,000 records</h3>
                <p className="text-muted-foreground">
                With Gemmarize, you gain access to our database of ______ learning resources (and counting), making it easier than ever before to dive into challenging concepts and learn from a endless pool of knowledge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to learn more effieinctly than ever?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Make your first Gemmary now and discover the power of AI-assisted learning
            </p>
            <Link to="/summarize" target="_blank">
              <Button size="lg" variant="secondary" className="gap-2">
                <PencilRuler className="h-5 w-5" />
                Gemmarize Anything
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

