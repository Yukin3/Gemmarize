import { Outlet } from "react-router-dom";
import FlashcardsGridPage from "./flashcards-grid-page"
import FlashcardPage from "./flashcards-page"

export { FlashcardsGridPage, FlashcardPage }

export default function Flashcards() {
  return (
    <div className="relative min-h-screen">
      <main className="p-4 pt-24 flex items-center justify-center">
      <Outlet /> {/* Child (flashcards) pages */}
      </main>

    </div>
  );
}
