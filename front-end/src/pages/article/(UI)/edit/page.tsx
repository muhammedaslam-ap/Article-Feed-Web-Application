import React, { useState, useEffect, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArticleForm } from "@/components/article-form";
import { articleService } from "@/services/articleService";
import type { TArticleInput, TArticleResponse } from "@/types/article";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ArticleEdit: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const userID = user?._id; // Safely derive userID, will be undefined if user or _id is null
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<TArticleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, startTransition] = useTransition();

  // Fetch article data on mount
  useEffect(() => {
    const fetchArticle = async () => {
      console.log("Fetching article with id:", id); // Debug id
      setIsLoading(true);
      try {
        if (!id) {
          toast.error( "Invalid article ID");
          navigate("/my-articles"); // Redirect to a valid page
          return;
        }
        const response = await articleService.routes.getArticleById(id);
        console.log("API Response:", response); // Debug full response
        // Check if response contains nested article object
        const fetchedArticle = response.article || response; // Adjust based on API structure
        if (!fetchedArticle || !fetchedArticle._id) {
          throw new Error("Article data is invalid or not found.");
        }
        // Ensure userID is defined before comparison
        if (!userID) {
          toast.error( "Unauthorized");
          navigate("/my-articles");
          return;
        }
        // Compare creator ID (convert to string for consistency)
        if (fetchedArticle.createdBy?._id?.toString() !== userID) {
          toast.error( "Unauthorized");
          navigate("/my-articles");
          return;
        }
        // Transform to match TArticleResponse if needed
        const transformedArticle: TArticleResponse = {
          _id: fetchedArticle._id.toString(),
          title: fetchedArticle.title,
          description: fetchedArticle.description,
          category: fetchedArticle.category,
          tags: fetchedArticle.tags || [],
          images: fetchedArticle.images || [],
          createdBy: {
            _id: fetchedArticle.createdBy?._id?.toString() || "",
            firstName: fetchedArticle.createdBy?.firstName || "",
            lastName: fetchedArticle.createdBy?.lastName || "",
            email: fetchedArticle.createdBy?.email || "",
          },
          likes: fetchedArticle.likes || [],
          dislikes: fetchedArticle.dislikes || [],
          blocks: fetchedArticle.blocks || [],
          createdAt: fetchedArticle.createdAt ? new Date(fetchedArticle.createdAt).toISOString() : "",
          updatedAt: fetchedArticle.updatedAt ? new Date(fetchedArticle.updatedAt).toISOString() : "",
        };
        console.log("Transformed Article:", transformedArticle); // Debug transformed data
        setArticle(transformedArticle);
      } catch (error: any) {
        console.error("Error fetching article:", error); // Debug error
        toast.error( "Error fetching article");
        navigate("/my-articles"); // Redirect to a valid page
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate, userID]);

 const handleSubmit = async (data: TArticleInput, image: File | null) => {
  if (!article) return;
  startTransition(async () => {
    try {
      console.log("Submitting data:", data, "Image:", image); // Debug submitted data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tags", JSON.stringify(data.tags));
      if (image) {
        formData.append("image", image);
      } else if (article.images && article.images.length > 0) {
        formData.append("removeImages", "true"); // Optional: signal to remove existing image
      }
      console.log("Submitting formData:", [...formData.entries()]); // Debug form data
      await articleService.routes.updateArticle(article._id.toString(), formData);
      toast.success("Article updated successfully!");
      navigate("/my-articles"); // Redirect to user's articles list
    } catch (error: any) {
      console.error("Error updating article:", error); // Debug error
      toast.error("Error updating article");
      // Stay on page for debugging, remove this line if redirect is preferred
      // navigate("/my-articles");
    }
  });
};

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading article for editing...</div>;
  }

  if (!article) {
    return <div className="text-center py-10 text-gray-500">Article not found.</div>;
  }

  return (
    <main className="container mx-auto py-8 px-4 md:px-6 max-w-2xl bg-gray-50 min-h-screen">
      <Card className="shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Edit Article</CardTitle>
          <CardDescription className="text-gray-500">Update the details of your article.</CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleForm
            initialData={article}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default ArticleEdit;