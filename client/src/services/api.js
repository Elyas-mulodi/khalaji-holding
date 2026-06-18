import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Slider
export const getSliders = (section) =>
  api.get(`/slider${section ? `section=${section}` : ""}`);

// Category
export const getCategories = () => api.get("/categories");

export const getCategory = (slug) => api.get(`categories/${slug}`);

export const getCategoryProjects = (slug, params) =>
  api.get(`/categories/${slug}/projects`, { params });

// Project
export const getProjects = (params) => api.get("/projects", { params });
export const getProject = (slug) => api.get(`/projects/${slug}`);

// Search
export const search = (q) => api.get(`search?q=${q}`);
