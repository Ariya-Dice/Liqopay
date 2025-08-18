import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SellerPage from './pages/SellerPage';
import BuyerPage from './pages/BuyerPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/buyer" element={<BuyerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;