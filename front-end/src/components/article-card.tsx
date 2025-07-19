import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Tag } from "lucide-react";
import type { TArticleResponse } from "@/types/article";

interface ArticleCardProps {
  article: TArticleResponse;
  onActionSuccess?: () => void; // Optional callback for action completion
}

export function ArticleCard({ article, onActionSuccess }: ArticleCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Article Image */}
      {article.images && article.images.length > 0 ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={`https://article-feed-web-application.onrender.com/uploads/${article.images[0]}`} // To be updated for Vercel
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="h-48 bg-muted flex items-center justify-center">
          <Eye className="h-12 w-12 text-muted-foreground/50" />
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {article.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow space-y-4 pt-0">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Tag className="h-3 w-3 mr-1" />
            {article.category}
          </span>
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-secondary text-secondary-foreground">
              #{tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{article.tags.length - 3} more</span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <time dateTime={article.createdAt}>
            {new Date(article.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </time>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Link to={`/articles/${article._id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors group"
          >
            <Eye className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Read Article
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}