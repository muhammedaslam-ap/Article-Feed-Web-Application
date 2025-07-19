import React, { useState, useEffect, useTransition } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { articleService } from "@/services/articleService";
import type { TArticleResponse } from "@/types/article";
import { toast } from "sonner";
import { RefreshButton } from "@/components/refresh-button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const MyArticles: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  console.log("User from Redux:", user); // Debug user state
  const userID = user?._id; // Use optional chaining
  const navigate = useNavigate();
  const [articles, setArticles] = useState<TArticleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Fetch articles on mount and when userID changes
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        if (!userID) {
          toast.error( "Authentication Error",
           );
          return;
        }
        console.log("Fetching articles for userID:", userID); // Debug userID
        const allArticles = await articleService.routes.getArticles(1, 100); // Fetch a large number
        console.log("API Response:", allArticles); // Debug API response
        const myArticles = allArticles.data.filter(
          (article) => article.createdBy._id === userID
        );
        console.log("Filtered Articles:", myArticles); // Debug filtered results
        setArticles(myArticles);
      } catch (error: any) {
        console.error("Error fetching articles:", error); // Debug error
        toast.error( "Error fetching articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [userID]); // Re-fetch if userID changes

  const handleDelete = async (articleId: string) => {
    if (isPending) return;
    startTransition(async () => {
      try {
        await articleService.routes.deleteArticle(articleId);
        toast.success( "Article deleted successfully!" );
        setArticles((prev) => prev.filter((article) => article._id !== articleId));
      } catch (error: any) {
        toast.error( error.message || "Error deleting article");
      }
    });
  };

  const handleRefresh = () => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        if (!userID) {
          toast.error( "Authentication Error");
          return;
        }
        const allArticles = await articleService.routes.getArticles(1, 100);
        const myArticles = allArticles.data.filter(
          (article) => article.createdBy._id === userID
        );
        setArticles(myArticles);
      } catch (error: any) {
        toast.error(error.message || "Error refreshing articles",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading your articles...</div>;
  }

  return (
    <main className="container mx-auto py-8 px-4 md:px-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">My Articles</h1>
      <div className="flex justify-end mb-4">
        <RefreshButton onRefresh={handleRefresh} />
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't created any articles yet.{" "}
          <Link to="/articles/create" className="underline text-blue-500 hover:text-blue-700">
            Create one!
          </Link>
        </p>
      ) : (
        <Card className="shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Your Published Articles</CardTitle>
            <CardDescription className="text-gray-500">Manage your articles: edit, delete, and view stats.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Title</TableHead>
                    <TableHead className="text-gray-700">Category</TableHead>
                    <TableHead className="text-gray-700">Likes</TableHead>
                    <TableHead className="text-gray-700">Dislikes</TableHead>
                    <TableHead className="text-gray-700">Blocks</TableHead>
                    <TableHead className="text-right text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-800">{article.title}</TableCell>
                      <TableCell className="text-gray-600">{article.category}</TableCell>
                      <TableCell className="text-gray-600">{article.likes.length}</TableCell>
                      <TableCell className="text-gray-600">{article.dislikes.length}</TableCell>
                      <TableCell className="text-gray-600">{article.blocks.length}</TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        <Link to={`/articles/${article._id}`} className="inline-block">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="View article"
                            className="text-gray-600 hover:text-blue-500 hover:border-blue-500"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/articles/${article._id}/edit`} className="inline-block">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Edit article"
                            className="text-gray-600 hover:text-green-500 hover:border-green-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(article._id.toString())}
                          disabled={isPending}
                          aria-label="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default MyArticles;