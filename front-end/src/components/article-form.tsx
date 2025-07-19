import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image } from "lucide-react";
import { type TArticleInput, type TArticleResponse, ARTICLE_CATEGORIES } from "@/types/article";

interface ArticleFormProps {
  initialData?: TArticleResponse;
  onSubmit: (data: TArticleInput, image: File | null) => Promise<void>;
  isSubmitting: boolean;
}

export function ArticleForm({ initialData, onSubmit, isSubmitting }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [images, setImages] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category || "");
      setTags(initialData.tags?.join(", ") || "");
      setImages(null);
      setImagePreview(null);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
      setImages(null);
      setImagePreview(null);
      setError(null);
      return;
    }
    
    if (!validImageTypes.includes(file.type)) {
      setError("Only .jpg, .jpeg, and .png files are allowed.");
      setImages(null);
      setImagePreview(null);
      return;
    }
    
    if (file.size > maxFileSize) {
      setError("Image must be less than 5MB.");
      setImages(null);
      setImagePreview(null);
      return;
    }

    setImages(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImages(null);
    setImagePreview(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (title.length > 100) {
      setError("Title must be less than 100 characters.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (description.length > 5000) {
      setError("Description must be less than 5000 characters.");
      return;
    }
    if (!category) {
      setError("Category is required.");
      return;
    }
    
    const tagArray = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    if (tagArray.length > 10) {
      setError("Maximum 10 tags allowed.");
      return;
    }
    
    if (!images && !initialData?.images?.length) {
      setError("At least one image is required.");
      return;
    }
    
    if (error) return;

    const articleData: TArticleInput = {
      title,
      description,
      category,
      tags: tagArray,
    };

    await onSubmit(articleData, images);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {initialData ? "Edit Article" : "Create New Article"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Enter article title"
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[150px] w-full resize-none"
                  placeholder="Write your article content here..."
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/5000 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="cursor-pointer">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full"
                  placeholder="e.g., tech, AI, future"
                />
                <p className="text-xs text-muted-foreground">
                  {tags.split(",").filter(Boolean).length}/10 tags
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images" className="text-sm font-medium">
                  Upload Image *
                </Label>
                
                {!imagePreview && !initialData?.images?.length && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <div className="mx-auto w-12 h-12 text-muted-foreground mb-4">
                      <Upload className="w-full h-full" />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer text-primary hover:text-primary/80 font-medium"
                      >
                        Click to upload image
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground">
                        Max 1 image, less than 5MB (.jpg, .jpeg, .png only)
                      </p>
                    </div>
                  </div>
                )}

                {(imagePreview || initialData?.images?.length) && (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      ) : initialData?.images && initialData.images.length > 0 ? (
                        <img
                          src={`https://article-feed-web-application.onrender.com/uploads/${initialData.images[0]}`}
                          alt="Current Article Image"
                          className="w-32 h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            console.log("Image load error", e);
                            // Hide the image container if it fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-32 h-32 bg-muted rounded-lg border flex items-center justify-center">
                          <Image className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    <div>
                      <Label
                        htmlFor="image-replace"
                        className="cursor-pointer text-primary hover:text-primary/80 font-medium text-sm"
                      >
                        Replace image
                      </Label>
                      <Input
                        id="image-replace"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}

                { initialData?.images && initialData.images.length> 0 && !images && (
                  <p className="text-sm text-muted-foreground">
                    Existing image will be replaced when you upload a new one
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !!error}
              >
                {isSubmitting ? "Saving..." : initialData ? "Update Article" : "Create Article"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}