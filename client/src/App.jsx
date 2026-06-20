import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectsDetails from "./pages/ProjectsDetails";
import OngoingProjects from "./pages/OngoingProjects";
import CategoryProjects from "./pages/CategoryProjects";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Footer from "./components/common/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar/>
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectsDetails />} />
              <Route path="/ongoing" element={<OngoingProjects />} />
              <Route path="/categories/:slug" element={<CategoryProjects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer/>
        </div>
    </BrowserRouter>
  );
}
