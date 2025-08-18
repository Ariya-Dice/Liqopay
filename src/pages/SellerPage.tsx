import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerPage: React.FC = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [currency, setCurrency] = useState('ETH');
  const [amount, setAmount] = useState('');

  /**
   * Handles form submission.
   * For now, it simply logs the entered data to the console.
   * In a real app, this is where you'd process or save the payment details.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wallet:', walletAddress, 'Currency:', currency, 'Amount:', amount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-6 p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Seller Page</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {/* Wallet Address Input */}
        <div>
          <label className="block text-white mb-2">Ethereum/Hyperliquid Wallet Address:</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Example: 0x..."
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        
        {/* Currency Selector */}
        <div>
          <label className="block text-white mb-2">Select Payment Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="ETH">ETH</option>
            <option value="HYPE">HYPE (Hyperliquid)</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-white mb-2">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.000001"
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerPage;
