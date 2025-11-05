import { Axios } from 'axios';
// import { Category } from "@/types/document";

export class Categories {
  constructor(private readonly axios: Axios) {}

  async getCategories() {
    const response = await this.axios.get('/categories');
    return response.data;
  }

  async createCategory(name: string) {
    const response = await this.axios.post('/categories', { name });
    return response.data;
  }

  async updateCategory(id: number, name: string) {
    const response = await this.axios.patch(`/categories/${id}`, { name });
    return response.data;
  }

  async deleteCategory(id: number) {
    const response = await this.axios.delete(`/categories/${id}`);
    return response.data;
  }
}
