import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import "./index.css"
import App from "./App.tsx"
import { PreviewApp } from "./PreviewApp.tsx"

window.React = React

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="preview" element={<PreviewApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
