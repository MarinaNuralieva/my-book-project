import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import GenrePage from "./pages/GenrePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ChildrenBooks from "./pages/ChildrenBooks.jsx";
import ClassicalBooks from "./pages/ClassicalBooks.jsx";
import ContemporaryBooks from "./pages/ContemporaryBooks.jsx";
import Detective from "./pages/Detective.jsx";
import EnglishBooks from "./pages/EnglishBooks.jsx";
import Fantasy from "./pages/Fantasy.jsx";
import KyrgyzBooks from "./pages/KyrgyzBooks.jsx";
import LanguageBooks from "./pages/LanguageBooks.jsx";
import Mangas from "./pages/Mangas.jsx";
import YoungAdult from "./pages/YoungAdult.jsx";
import Psychology from "./pages/Psychology.jsx";


// админские страницы
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminPromotions from "./pages/AdminPromotions.jsx";



export default function App() {
  return (
    <Layout>
      <Routes>
        {/* публичные страницы */}
        <Route path="/" element={<HomePage />} />
        <Route path="/genre/:genreName" element={<GenrePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/books/childrenbooks" element={<ChildrenBooks />} />
        <Route path="/books/classicalbooks" element={<ClassicalBooks />} />
        <Route path="/books/contemporarybooks" element={<ContemporaryBooks />} />
        <Route path="/books/detective" element={<Detective />} />
        <Route path="/books/foreignbooks" element={<EnglishBooks />} />
        <Route path="/books/fantasy" element={<Fantasy />} />
        <Route path="/books/kyrgyzbooks" element={<KyrgyzBooks />} />
        <Route path="/books/languagebooks" element={<LanguageBooks />} />
        <Route path="/books/comics" element={<Mangas />} />
        <Route path="/books/youngadult" element={<YoungAdult />} />
        <Route path="/books/psychology" element={<Psychology />} />

    
        {/* админка */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route path="/admin/promotions" element={<AdminPromotions />} />
      </Routes>
    </Layout>
  );
}



