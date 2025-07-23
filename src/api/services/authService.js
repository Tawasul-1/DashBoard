import axios from "axios";

const API_BASE_URL = "https://localhost:8000/api/";

export async function signup (formData) {
  const data = new FormData();
  data.append("image", formData.image);
  data.append("fullName", formData.fullName);
  data.append("email", formData.email);
  data.append("age", formData.age);
  data.append("phone", formData.phone);
  data.append("password", formData.password);


  console.log("Form Data:", data);
  const response = await axios.post(`${API_BASE_URL}/signup`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
