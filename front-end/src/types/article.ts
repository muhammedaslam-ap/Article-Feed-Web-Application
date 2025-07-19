export type TArticleResponse = {
  _id: string
  title: string
  description: string
  category: string
  tags: string[]
  images: string[]
  createdBy: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  likes: string[]
  dislikes: string[]
  blocks: string[]
  createdAt: string // Using string for Date objects for simplicity in frontend
  updatedAt: string // Using string for Date objects for simplicity in frontend
}

export type TArticlePaginatedResponse = {
  data: TArticleResponse[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type TArticleInput = {
  title: string
  description: string
  category: string
  tags?: string[]
  images?: string[]
}

export interface TGetArticleResponse {
  success: boolean;
  article: TArticleResponse;
}

export const ARTICLE_CATEGORIES = [
  "Sports",
  "Politics",
  "Space",
  "Technology",
  "Science",
  "Health",
  "Entertainment",
  "Business",
]
