import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./components/style.css";

import App from "./components/App.jsx";
import Landpage from "./components/landpage.tsx";
// import Login from "./components/login.jsx";
// import Signup from "./components/signup.jsx";
import ErrorBoundary from "./ErrorBoundary";

function Root() {
  return (
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landpage />} />
            <Route path="/app" element={<App />} />
            {/* <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact  />} /> */}
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
