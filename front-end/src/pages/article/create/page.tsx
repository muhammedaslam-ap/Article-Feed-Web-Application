import React, { useTransition } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArticleForm } from "@/components/article-form";
import { articleService } from "@/services/articleService";
import type { TArticleInput } from "@/types/article";
import { toast } from "sonner";

const ArticleCreation: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, startTransition] = useTransition();

  const handleSubmit = async (data: TArticleInput, image: File | null) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("tags", JSON.stringify(data.tags)); // ✅ fix here
    if (image) {
      formData.append("image", image); // Only append if image exists
    }

    startTransition(async () => {
      try {
        await articleService.routes.createArticle(formData);
        toast.success("Article created successfully!");
        navigate("/my-articles");
      } catch (error: any) {
        toast.error(error.message || "Error creating article");
      }
    });
  };

  return (
    <main className="container mx-auto py-8 px-4 md:px-6 max-w-2xl bg-gray-50 min-h-screen">
      <Card className="shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Create New Article
          </CardTitle>
          <CardDescription className="text-gray-500">
            Fill in the details to publish a new article.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </main>
  );
};

export default ArticleCreation;