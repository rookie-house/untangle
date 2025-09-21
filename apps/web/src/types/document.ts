export interface Document {
  id: number;
  title: string;
  type: "image" | "pdf" | "other";
  url: string;
  userId: number;
  categoryId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
