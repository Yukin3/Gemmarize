import { Routes, Route} from "react-router-dom";
import Home from "./scenes/home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Summarize from "./scenes/summarize";
import UploadPage from "./scenes/summarize/upload-content";
import SummariesPage from "./scenes/summarize/summaries";
import ComingSoon from "./scenes/pages/coming-soon";
import PapersGridPage from "./scenes/papers/papers-grid-page";
import PaperPage from "./scenes/papers/paper-page";
import Papers from "./scenes/papers";
import Flashcards, { FlashcardPage, FlashcardsGridPage } from "./scenes/flashcards";


function AppRoutes() {

  return (
    <>
    <Navbar />
    <Routes>
    <Route path="*" element={<ComingSoon />} />
    <Route path="/" element={<Home/>} />
    <Route path="/summarize" element={<Summarize />}>
      <Route index element={<UploadPage />} />
      <Route path="paper/:paperId" element={<SummariesPage />} />
    </Route>
    <Route path="/papers" element={<Papers/>}>
      <Route index element={<PapersGridPage />} />
      <Route path=":paperId" element={<PaperPage />} />
    </Route>
    <Route path="/flashcards" element={<Flashcards/>}>
      <Route index element={<FlashcardsGridPage />} />
      <Route path="paper/:paperId" element={<FlashcardPage />} />
    </Route>
    </Routes>
      <Footer />
    </>
  );
}

export default AppRoutes;
