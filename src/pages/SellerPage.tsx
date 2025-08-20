import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { convertToCrypto } from "../../modules/priceFetcher";
import { generateSvgQrCode } from "../../modules/qrCodeGenerator";

const SellerPage = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [usdAmount, setUsdAmount] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load wallet address from local storage on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setShowQr(false);

    // Save wallet address to local storage
    localStorage.setItem("walletAddress", walletAddress);

    // Validate inputs
    if (!walletAddress || !usdAmount || !currency) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      // Convert USD amount to crypto amount
      const cryptoAmount = await convertToCrypto(usdAmount, currency);

      // Create invoice data with the converted crypto amount
      const invoiceData = {
        address: walletAddress,
        currency: currency,
        amount: cryptoAmount, // Use the converted crypto amount
        network: "Ethereum", // Assuming ETH, USDT, USDC are on Ethereum for now
      };

      const qrString = JSON.stringify(invoiceData);
      setQrCodeData(generateSvgQrCode(qrString));
      setShowQr(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-6 p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Seller Page</h2>

      <form
        onSubmit={handleGenerateInvoice}
        className="w-full max-w-md space-y-6"
      >
        {/* Wallet Address Input */}
        <div>
          <label htmlFor="walletAddress" className="block text-white mb-2">
            Ethereum/Hyperliquid Wallet Address:
          </label>
          <input
            id="walletAddress"
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
          <label htmlFor="currency" className="block text-white mb-2">
            Select Payment Currency:
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="ETH">ETH</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="usdAmount" className="block text-white mb-2">
            Amount (USD):
          </label>
          <input
            id="usdAmount"
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back
          </button>

          {/* Generate Invoice Button */}
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate QR Invoice
          </button>
        </div>
      </form>

      {/* Display error message if there is one */}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      {/* QR Code display section */}
      {showQr && qrCodeData && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
          <p className="text-center text-gray-800 font-semibold mb-2">
            Scan to Pay
          </p>
          <div dangerouslySetInnerHTML={{ __html: qrCodeData }} />
        </div>
      )}
    </div>
  );
};

export default SellerPage;
