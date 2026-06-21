export interface Document {
  documents: {
    id: string;
    title: string;
    type: string;
    url: string;
    userId: number;
    sessionId: string | null;
    updatedAt: string;
    createdAt: string;
  };
  sessions: {
    id: string;
    title: string;
    userId: number;
    updatedAt: string;
    createdAt: string;
  } | null;
}

export interface Category {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
