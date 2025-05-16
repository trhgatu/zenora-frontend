// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7293/api", // hoặc domain backend thật
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
