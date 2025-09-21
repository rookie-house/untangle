import { Axios } from "axios";
import { Document } from "@/types/document";

export class Documents {
  constructor(private readonly axios: Axios) {}

  async getDocuments(params?: { pageSize?: number; offset?: number }) {
    const response = await this.axios.get("/documents/all", { params });
    return response.data;
  }

  async getDocumentById(id: number) {
    const response = await this.axios.get(`/documents/${id}`);
    return response.data;
  }

  async getDocumentsBySession(sessionId: string) {
    const response = await this.axios.get(`/documents/session/${sessionId}`);
    return response.data;
  }

  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.axios.put("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async updateDocumentCategory(documentId: number, categoryId: number | null) {
    const response = await this.axios.patch(`/documents/${documentId}`, {
      categoryId,
    });
    return response.data;
  }
}
