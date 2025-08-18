import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedLogo from '../components/AnimatedLogo';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 p-4">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
        {/* Animated logo */}
        <AnimatedLogo className="w-24 h-24 md:w-28 md:h-28" />

        {/* Title in Hyperliquid green */}
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#00FF9F' }}>
          LiqoPay
        </h1>

        {/* Navigation buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/buyer')}
            className="w-64 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Buyer
          </button>

          <button
            onClick={() => navigate('/seller')}
            className="w-64 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
          >
            Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
