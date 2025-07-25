import apiClient from "../config/apiClient";
import { handleApiError } from "../utils/handleApiErrors";

const CardService = {
  async addNewCard(formData, token) {
    try {
      const response = await apiClient.post("/cards/cards/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error adding new card:", error);
      throw handleApiError(error);
    }
  },

  async deleteCard(cardId, token) {
    try {
      const response = await apiClient.delete(`/cards/cards/${cardId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error deleting card:", error);
      throw handleApiError(error);
    }
  },

  async getUserCards(token) {
    try {
      const response = await apiClient.get("/cards/cards/?limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching user cards:", error);
      throw handleApiError(error);
    }
  },
  async getUserDefaultCards(token) {
    try {
      const response = await apiClient.get("/cards/default/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching user cards:", error);
      throw handleApiError(error);
    }
  },

  async updateCard(cardId, formData, token) {
    try {
      const response = await apiClient.patch(`/cards/cards/${cardId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error updating card:", error);
      throw handleApiError(error);
    }
  },

  async getAppStats(token) {
    try {
      const response = await apiClient.get("/cards/stats/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching app stats:", error);
      throw handleApiError(error);
    }
  },
};

export default CardService;
