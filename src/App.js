// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search/SearchPage";
import { ShelfProvider } from "./context/ContextShelf";

function App() {
  return (
    <ShelfProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </ShelfProvider>
  );
}

export default App;
