import apiClient from "../config/apiClient";
import { handleApiError } from "../utils/handleApiErrors";

const CardService = {
  async addNewCard(formData) {
    try {
      const response = await apiClient.post("/cards/cards/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error adding new card:", error);
      throw handleApiError(error);
    }
  },

  async deleteCard(cardId) {
    try {
      const response = await apiClient.delete(`/cards/cards/${cardId}/`);
      return response;
    } catch (error) {
      console.error("Error deleting card:", error);
      throw handleApiError(error);
    }
  },

  async getUserCards() {
    try {
      const response = await apiClient.get("/cards/cards/");
      return response;
    } catch (error) {
      console.error("Error fetching user cards:", error);
      throw handleApiError(error);
    }
  },

  async getAppStats(token) {
    try {
      const response = await apiClient.get("/cards/stats/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      console.error("Error fetching app stats:", error);
      throw handleApiError(error);
    }
  },
};

export default CardService; 