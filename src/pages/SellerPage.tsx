// src/pages/SellerPage.tsx

import React, { useState, useEffect, useRef } from "react";
// Note: In a real application, you would use 'react-router-dom'.
// For this self-contained example, we'll simulate the navigation.
// import { useNavigate } from "react-router-dom";

// Changed the import to use the locally installed package instead of a CDN.
import { QRCodeCanvas as QRCode } from "qrcode.react";

// This is a placeholder for the external price conversion module.
// In a real app, this would fetch live prices from an API.
const convertToCrypto = async (usdAmount, currency) => {
  console.log(`Converting ${usdAmount} USD to ${currency}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Placeholder conversion rates
  const rates = {
    ETH: 0.00028, // 1 USD = 0.00028 ETH
    USDT: 1,      // 1 USD = 1 USDT
    USDC: 1,      // 1 USD = 1 USDC
  };

  const rate = rates[currency];
  if (!rate) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  const cryptoAmount = parseFloat(usdAmount) * rate;
  // Return the amount with a reasonable number of decimal places
  return cryptoAmount.toFixed(6);
};


const SellerPage = () => {
  // const navigate = useNavigate(); // Deactivated for this example
  const [walletAddress, setWalletAddress] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [usdAmount, setUsdAmount] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef < HTMLDivElement > (null); // Ref for QRCodeCanvas wrapper to enable download

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
    setIsGenerating(true);

    localStorage.setItem("walletAddress", walletAddress);

    if (!walletAddress || !usdAmount || !currency) {
      setErrorMessage("Please fill in all fields.");
      setIsGenerating(false);
      return;
    }

    try {
      const cryptoAmount = await convertToCrypto(usdAmount, currency);
      const invoiceData = {
        address: walletAddress,
        currency: currency,
        amount: cryptoAmount,
        network: "Ethereum",
      };
      const qrString = JSON.stringify(invoiceData);
      setQrCodeData(qrString);
      setShowQr(true);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to download QR code
  const downloadQRCode = (format = "png") => {
    // Find the canvas element within the ref'd div
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const mimeType = `image/${format}`;
      // Create a data URL for the image
      const url = canvas
        .toDataURL(mimeType)
        .replace(mimeType, "image/octet-stream");
      // Create a link to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `qrcode.${format}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-6 p-4 font-sans">
      <h2 className="text-3xl font-bold text-white mb-6">Seller Page</h2>

      <form
        onSubmit={handleGenerateInvoice}
        className="w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-xl shadow-2xl"
      >
        {/* Wallet Address Input */}
        <div>
          <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300 mb-2">
            Ethereum Wallet Address
          </label>
          <input
            id="walletAddress"
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none transition"
            required
          />
        </div>

        {/* Currency Selector */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-2">
            Payment Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none transition"
          >
            <option value="ETH">ETH</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="usdAmount" className="block text-sm font-medium text-gray-300 mb-2">
            Amount (USD)
          </label>
          <input
            id="usdAmount"
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none transition"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="button"
            onClick={() => alert("Navigate back to home page.")}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200 ease-in-out shadow-md"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-md flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate QR Invoice"
            )}
          </button>
        </div>
      </form>

      {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}

      {/* QR Code display section */}
      {showQr && qrCodeData && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-2xl animate-fade-in text-center">
          <p className="text-gray-800 font-semibold mb-4">
            Scan to Pay
          </p>
          <div ref={qrRef}>
            <QRCode value={qrCodeData} size={256} level={"H"} bgColor={"#ffffff"} fgColor={"#000000"} />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => downloadQRCode('png')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download as PNG
            </button>
            <button
              onClick={() => downloadQRCode('jpeg')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download as JPG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// A simple fade-in animation for the QR code
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default SellerPage;