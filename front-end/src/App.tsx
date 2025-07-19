import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/home"; 
import Settings from "@/pages/user/page";
import ArticleEdit from "@/pages/article/(UI)/edit/page";
import ArticleView from "@/pages/article/(UI)/page";
import ArticleCreation from "@/pages/article/create/page";
import MyArticles from "@/pages/article/myArticle/page";
import ErrorBoundary from "@/components/ErrorBoundary"; 
import { ProtectedUserRoute } from "./private/protectedUserRoute";
import { PublicUserRoute } from "./private/publicUserRoute";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        richColors
        position="top-right"
        toastOptions={{ className: "text-sm p-0" }}
      />

      <ErrorBoundary>
        <Routes>
          <Route
            path="/auth"
            element={
              <PublicUserRoute>
                <Auth />
              </PublicUserRoute>
            }
          />

           <Route
            path="/"
            element={
              <ProtectedUserRoute>
                <Dashboard />
              </ProtectedUserRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedUserRoute>
                <Settings />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/articles/:id/edit"
            element={
              <ProtectedUserRoute>
                <ArticleEdit />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/articles/:id"
            element={
              <ProtectedUserRoute>
                <ArticleView />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/articles/create"
            element={
              <ProtectedUserRoute>
                <ArticleCreation />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/my-articles"
            element={
              <ProtectedUserRoute>
                <MyArticles />
              </ProtectedUserRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}