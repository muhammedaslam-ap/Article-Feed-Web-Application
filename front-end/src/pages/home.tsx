"use client"

import type React from "react"
import { useState, useEffect, useTransition } from "react"
import { useNavigate } from "react-router-dom"
import { articleService } from "@/services/articleService"
import { ArticleCard } from "@/components/article-card"
import { userService } from "@/services/userService"
import { RefreshButton } from "@/components/refresh-button"
import { toast } from "sonner"
import type { TArticleResponse } from "@/types/article"
import { userAuthService } from "@/services/authServices"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

// Shadcn UI imports
import { Button } from "@/components/ui/button"

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const userID = user?._id
  const navigate = useNavigate()
  const [articles, setArticles] = useState<TArticleResponse[]>([])
  const [initialUserPreferences, setInitialUserPreferences] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!userID) {
      toast.error("User not authenticated. Please log in.")
      navigate("/auth")
      return
    }
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        const userProfile = await userService.getUserProfile(userID)
        setInitialUserPreferences(userProfile.preferences || [])
        // Keeping the original logic as requested, even if initialUserPreferences might not be immediately updated here.
        if (userProfile.preferences && userProfile.preferences.length > 0) {
          const response = await articleService.routes.getArticles(1, 50, userProfile.preferences)
          const filteredArticles = response.data.filter((article) => !article.blocks.includes(userID))
          setArticles(filteredArticles)
        } else {
          setArticles([])
          toast.warning("No preferences set. Update your profile to see relevant articles.")
        }
      } catch (error: any) {
        toast.error(error.message || "Error fetching articles by preferences")
        setArticles([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchInitialData()
  }, [userID, navigate]) // Added initialUserPreferences to dependency array as it was used in the effect.

  const fetchArticles = async () => {
    if (!userID || initialUserPreferences.length === 0) return
    setIsLoading(true)
    try {
      const response = await articleService.routes.getArticles(1, 50, initialUserPreferences)
      const filteredArticles = response.data.filter((article) => !article.blocks.includes(userID))
      setArticles(filteredArticles)
    } catch (error: any) {
      toast.error(error.message || "Error refreshing articles")
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionSuccess = () => {
    startTransition(() => {
      fetchArticles()
    })
  }

  const handleLogout = async () => {
    try {
      await userAuthService.logoutUser()
      toast.success("Logged out successfully")
      navigate("/auth")
    } catch (error: any) {
      toast.error(error.message || "Logout failed")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Article Hub</h1>
          <nav className="flex items-center space-x-2 md:space-x-4">
            <Button onClick={() => navigate("/articles/create")} variant="default" size="sm">
              Add New Article
            </Button>
            <Button onClick={() => navigate("/my-articles")} variant="outline" size="sm">
              My Articles
            </Button>
            <Button onClick={() => navigate("/settings")} variant="outline" size="sm">
              See Profile
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex-1 py-8 px-4 md:px-6">
        <div className="flex justify-end mb-8">
          <RefreshButton onRefresh={fetchArticles} />
        </div>
        {isLoading && <p className="text-center text-muted-foreground">Loading articles...</p>}
        {!isLoading && articles.length === 0 && (
          <p className="text-center text-muted-foreground">No articles found matching your preferences.</p>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!isLoading &&
            articles.map((article) => (
              <ArticleCard key={article._id?.toString()} article={article} onActionSuccess={handleActionSuccess} />
            ))}
        </div>
      </main>
      <footer className="border-t bg-background py-4">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Article Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
