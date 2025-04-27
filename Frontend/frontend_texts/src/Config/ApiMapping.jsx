// src/Config/ApiMapping.js
import axios from 'axios';

const apiUrl = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
});

export default apiUrl;
