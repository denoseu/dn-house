import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import LetterPage from './pages/LetterPage';
import GuestbookPage from './pages/GuestbookPage';
import MenuPage from './pages/MenuPage';
import NotFoundPage from './pages/NotFoundPage';
import UploadPhotoPage from './pages/UploadPhotoPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/letter" element={<LetterPage />} />
        <Route path="/guestbook" element={<GuestbookPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/upload" element={<UploadPhotoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;