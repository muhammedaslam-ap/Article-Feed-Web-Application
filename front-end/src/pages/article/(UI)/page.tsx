import React, { useState, useEffect, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Ban } from "lucide-react";
import { articleService } from "@/services/articleService";
import type { TArticleResponse, TGetArticleResponse } from "@/types/article";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Adjust the import path based on your setup

const ArticleView: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const userID = user?._id; // Safely derive userID
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<TArticleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false); // State for modal

  // Fetch article data on mount
  useEffect(() => {
  const fetchArticle = async () => {
    console.log("Fetching article with id:", id); // Debug id
    setIsLoading(true);
    try {
      if (!id) {
        toast.error("Invalid article ID");
        navigate("/");
        return;
      }
      const response = await articleService.routes.getArticleById(id) as TGetArticleResponse; // Type assertion
      console.log("API Response:", response); // Debug API response
      if (!response.success || !response.article) {
        throw new Error("Invalid API response");
      }
      // Transform the article object to match TArticleResponse
      const transformedArticle: TArticleResponse = {
        _id: response.article._id.toString(),
        title: response.article.title,
        description: response.article.description,
        category: response.article.category,
        tags: response.article.tags || [],
        images: response.article.images || [],
        createdBy: {
          _id: response.article.createdBy?._id?.toString() || "",
          firstName: response.article.createdBy?.firstName || "",
          lastName: response.article.createdBy?.lastName || "",
          email: response.article.createdBy?.email || "",
        },
        likes: (response.article.likes || []).map((like) =>
          typeof like === "object" && "$oid" in like ? like : like.toString()
        ),
        dislikes: (response.article.dislikes || []).map((dislike) =>
          typeof dislike === "object" && "$oid" in dislike ? dislike : dislike.toString()
        ),
        blocks: (response.article.blocks || []).map((block) =>
          typeof block === "object" && "$oid" in block ? block : block.toString()
        ),
        createdAt: response.article.createdAt ? new Date(response.article.createdAt).toISOString() : "",
        updatedAt: response.article.updatedAt ? new Date(response.article.updatedAt).toISOString() : "",
      };
      console.log("Transformed Article - Images:", transformedArticle.images); // Debug images
      console.log("Transformed Article:", transformedArticle); // Debug transformed data
      setArticle(transformedArticle);
    } catch (error: any) {
      console.error("Error fetching article:", error); // Debug error
      toast.error( "Error fetching article",
       );
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  fetchArticle();
}, [id, navigate]);



const handleAction = async (action: "like" | "dislike" | "block") => {
  if (!article || !userID) return;
  startTransition(async () => {
    try {
      if (action === "block") {
        setIsBlockConfirmOpen(true); // Open the confirmation modal
        return; // Wait for modal confirmation
      }
      if (action === "like") {
        await articleService.routes.likeArticle(article._id.toString());
        toast.success( "Article liked!" );
      } else if (action === "dislike") {
        await articleService.routes.dislikeArticle(article._id.toString());
        toast.success("Article disliked!" );
      }
      const response = await articleService.routes.getArticleById(article._id.toString()) as TGetArticleResponse;
      if (!response.success || !response.article) {
        throw new Error("Invalid API response after action");
      }
      const transformedArticle: TArticleResponse = {
        _id: response.article._id.toString(),
        title: response.article.title,
        description: response.article.description,
        category: response.article.category,
        tags: response.article.tags || [],
        images: response.article.images || [],
        createdBy: {
          _id: response.article.createdBy?._id?.toString() || "",
          firstName: response.article.createdBy?.firstName || "",
          lastName: response.article.createdBy?.lastName || "",
          email: response.article.createdBy?.email || "",
        },
        likes: (response.article.likes || []).map((like) =>
          typeof like === "object" && "$oid" in like ? like : like.toString()
        ),
        dislikes: (response.article.dislikes || []).map((dislike) =>
          typeof dislike === "object" && "$oid" in dislike ? dislike : dislike.toString()
        ),
        blocks: (response.article.blocks || []).map((block) =>
          typeof block === "object" && "$oid" in block ? block : block.toString()
        ),
        createdAt: response.article.createdAt ? new Date(response.article.createdAt).toISOString() : "",
        updatedAt: response.article.updatedAt ? new Date(response.article.updatedAt).toISOString() : "",
      };
      setArticle(transformedArticle);
    } catch (error: any) {
      toast.error(error.message || `Error ${action}ing article`);
    }
  });
};

  const handleBlockConfirm = async (confirmed: boolean) => {
    setIsBlockConfirmOpen(false); // Close the modal
    if (!confirmed || !article || !userID) return;
    startTransition(async () => {
      try {
        await articleService.routes.blockArticle(article._id.toString());
        toast.success("Article blocked!",
          );
        navigate("/");
      } catch (error: any) {
        toast.error( "Error blocking article",
          );
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading article...</div>;
  }

  if (!article) {
    return <div className="text-center py-10 text-gray-500">Article not found.</div>;
  }

  // Render action buttons only when userID and article are available
  const renderActionButtons = () => {
    if (!userID) {
      return (
        <div className="text-center text-gray-500">
          Please log in to interact with this article.
        </div>
      );
    }

    const isLiked = article.likes.includes(userID);
    const isDisliked = article.dislikes.includes(userID);

    return (
      <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={() => handleAction("like")}
          disabled={isPending || isLiked}
          className="text-gray-600 hover:text-blue-500"
        >
          <ThumbsUp className={`h-5 w-5 mr-2 ${isLiked ? "text-blue-500" : ""}`} />{" "}
          {article.likes.length}
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleAction("dislike")}
          disabled={isPending || isDisliked}
          className="text-gray-600 hover:text-red-500"
        >
          <ThumbsDown className={`h-5 w-5 mr-2 ${isDisliked ? "text-red-500" : ""}`} />{" "}
          {article.dislikes.length}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleAction("block")}
          disabled={isPending}
          className="text-gray-600 hover:bg-red-100 border-red-300"
        >
          <Ban className="h-5 w-5 mr-2" /> Block
        </Button>
      </div>
    );
  };

  return (
    <main className="container mx-auto py-12 px-4 md:px-8 max-w-4xl bg-gray-50 min-h-screen">
      <Card className="shadow-lg bg-white border border-gray-100">
        <CardHeader className="pb-6">
          <CardTitle className="text-4xl font-bold text-gray-900 tracking-tight">{article.title}</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            By {article.createdBy?.firstName || "Unknown"} {article.createdBy?.lastName || "Author"} |{" "}
            {new Date(article.createdAt).toLocaleDateString()} | Category: {article.category} | Tags:{" "}
            {article.tags.join(", ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {article.images && article.images.length > 0 && (
            <img
              src={`http://localhost:3000/uploads/${article.images[0]}`} // Only the first image
              alt="Article Image"
              width={800}
              height={400}
              className="rounded-lg object-cover w-full max-h-96 border border-gray-200"
              onError={(e) => console.log("Image load error", e)}
            />
          )}
          <div className="prose prose-lg text-gray-800 max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{article.description}</p>
          </div>
          {renderActionButtons()}
        </CardContent>
      </Card>
      <Dialog open={isBlockConfirmOpen} onOpenChange={setIsBlockConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Confirm Block</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-gray-600">Are you sure you want to block this article? This action cannot be undone.</p>
          </div>
          <DialogFooter className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => handleBlockConfirm(false)} className="px-4 py-2">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleBlockConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default ArticleView;