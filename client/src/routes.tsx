import { Routes, Route} from "react-router-dom";
import Home from "./scenes/home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import UploadPage from "./scenes/upload/upload-content";
// import ComingSoon from "./scenes/pages/coming-soon";
import PapersGridPage from "./scenes/papers/papers-grid-page";
import PaperPage from "./scenes/papers/paper-page";
import Papers from "./scenes/papers";
import Flashcards, { FlashcardPage, FlashcardsGridPage } from "./scenes/flashcards";
import Auth from "./scenes/auth";
import AuthPage from "./scenes/auth/Auth";
import Callback from "./scenes/auth/Callback";
import Quizzes from "./scenes/quiz";
import QuizzesGridPage from "./scenes/quiz/quizzes-grid-page";
import QuizPage from "./scenes/quiz/quiz-page";
import QuizDetailsPage from "./scenes/quiz/quiz-details-page";
import Uploads from "./scenes/upload";
import SummariesPage from "./scenes/summaries/summaries-page";
import SummariesGridPage from "./scenes/summaries/summaries-grid-page";
import NotFoundError from "./scenes/pages/not-found-error";
import Otp from "./scenes/auth/OTP";
// import UnauthorizedError from "./scenes/pages/unauthorized-error";


function AppRoutes() {

  return (
    <>
    <Navbar />
    <Routes>
    <Route path="*" element={<NotFoundError />} />
    <Route path="/callback" element={<Callback />} />
    <Route path="/" element={<Home/>} />
    <Route path="/upload" element={<Uploads />}>
      <Route index element={<UploadPage />} />
    </Route>
    <Route path="/summaries" element={<SummariesGridPage />}>
      <Route index element={<UploadPage />} />
      <Route path="paper/:paperId" element={<SummariesPage />} />
      <Route path="*" element={<NotFoundError />} />
    </Route>
    <Route path="/papers" element={<Papers/>}>
      <Route index element={<PapersGridPage />} />
      <Route path=":paperId" element={<PaperPage />} />
      <Route path="*" element={<NotFoundError />} />
    </Route>
    <Route path="/flashcards" element={<Flashcards/>}>
      <Route index element={<FlashcardsGridPage />} />
      <Route path="paper/:paperId" element={<FlashcardPage />} />
      <Route path="*" element={<NotFoundError />} />
    </Route>
    <Route path="/quizzes" element={<Quizzes/>}>
      <Route index element={<QuizzesGridPage />} />
      <Route path="paper/:quizId" element={<QuizPage />} />
      <Route path="details/:quizId" element={<QuizDetailsPage />} />
      <Route path="*" element={<NotFoundError />} />
    </Route>
    <Route path="/login" element={<Auth/>}>
      <Route index element={<AuthPage />} />
      <Route path="*" element={<NotFoundError />} />
      <Route path="otp" element={<Otp />} />

    </Route>
    </Routes>
      <Footer />
    </>
  );
}

export default AppRoutes;
