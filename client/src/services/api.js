import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Slider
export const getSliders = (section) =>
  api.get(`/slider${section ? `?section=${section}` : ""}`);

// Category
export const getCategories = () => api.get("/categories");

export const getCategory = (slug) => api.get(`/categories/${slug}`);

export const getCategoryProjects = (slug, params) =>
  api.get(`/categories/${slug}/projects`, { params });

// Project
export const getProjects = (params) => api.get("/projects", { params });
export const getProject = (slug) => api.get(`/projects/${slug}`);

// Search
export const search = (q) => api.get(`/search?q=${q}`);

// Auth
export const loginAdmin = (data) => api.post("/auth/login", data);
export const getAdminMe = (token) =>
  api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin Projects
export const adminGetProjects = (token, params) =>
  api.get("/projects", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminCreateProject = (token, data) =>
  api.post("/projects", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const adminUpdateProject = (token, id, data) =>
  api.put(`/projects/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const adminDeleteProject = (token, id) =>
  api.delete(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin Categories
export const adminCreateCategory = (token, data) =>
  api.post("/categories", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const adminUpdateCategory = (token, id, data) =>
  api.put(`/categories/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const adminDeleteCategory = (token, id) =>
  api.delete(`/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin Slider
export const adminCreateSlider = (token, data) =>
  api.post("/slider", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const adminUpdateSlider = (token, id, data) =>
  api.put(`/slider/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const adminDeleteSlider = (token, id) =>
  api.delete(`/slider/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
