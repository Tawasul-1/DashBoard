import apiClient from "../config/apiClient";
import { handleApiError } from "../utils/handleApiErrors";

const CategoryService = {
  async getAllCategoriesWithCardCount(token) {
    try {
      // First fetch all categories
      const categoriesResponse = await apiClient.get("/cards/categories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cardsResponse = await apiClient.get("/cards/cards/?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Count cards per category
      const categories = categoriesResponse.data.results || categoriesResponse.data;
      const cards = cardsResponse.data.results || cardsResponse.data;
      console.log(cards);

      const categoriesWithCount = categories.map((category) => {
        const cardCount = cards.filter((card) => card.category.id === category.id).length;
        return {
          ...category,
          cards_count: cardCount,
        };
      });

      return { data: categoriesWithCount };
    } catch (error) {
      console.error("Error fetching categories with card count:", error);
      throw handleApiError(error);
    }
  },

  async addNewCategory({ label, label_ar, imageFile }, token) {
    try {
      const formData = new FormData();
      formData.append("label", label);
      formData.append("label_ar", label_ar);
      formData.append("image", imageFile);

      return await this.createCategory(formData, token);
    } catch (error) {
      console.error("Error adding new category:", error);
      throw error;
    }
  },

  async getAllCategories(token) {
    try {
      const response = await apiClient.get("/cards/categories/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw handleApiError(error);
    }
  },

  async createCategory(formData, token) {
    try {
      const response = await apiClient.post("/cards/categories/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error creating category:", error);
      throw handleApiError(error);
    }
  },

  async updateCategory(id, formData, token) {
    try {
      const response = await apiClient.patch(`/cards/categories/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error updating category:", error);
      throw handleApiError(error);
    }
  },

  async deleteCategory(id, token) {
    try {
      const response = await apiClient.delete(`/cards/categories/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw handleApiError(error);
    }
  },
};

export default CategoryService;
