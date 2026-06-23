import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectsDetails from "./pages/ProjectsDetails";
import OngoingProjects from "./pages/OngoingProjects";
import CategoryProjects from "./pages/CategoryProjects";
import About from "./pages/About";
import Footer from "./components/common/Footer";
import Categories from "./pages/Categories";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./admin/context/AuthContext";
import AdminLogin from "./admin/pages/Login";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminProjects from "./admin/pages/Projects";
import AdminCategories from "./admin/pages/Categories";
import AdminSlider from "./admin/pages/Slider";
import PublicLayout from "./layouts/PublicLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* سایت اصلی */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/projects" element={<Projects />} />

            <Route path="/projects/:slug" element={<ProjectsDetails />} />

            <Route path="/ongoing" element={<OngoingProjects />} />

            <Route path="/categories" element={<Categories />} />

            <Route path="/categories/:slug" element={<CategoryProjects />} />

            <Route path="/about" element={<About />} />

            <Route path="/search" element={<SearchResults />} />
          </Route>

          {/* پنل ادمین */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="projects" element={<AdminProjects />} />

            <Route path="categories" element={<AdminCategories />} />

            <Route path="slider" element={<AdminSlider />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
