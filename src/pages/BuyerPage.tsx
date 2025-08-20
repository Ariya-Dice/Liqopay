// src/pages/BuyerPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BuyerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // This effect runs only once on mount to initialize the scanner.
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false // verbose
    );

    const onScanSuccess = (decodedText: string) => {
      // The scanner instance is already available in the `scanner` closure.
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner after success:", error);
      });
      setScanResult(decodedText);
    };

    const onScanError = (errorMessage: string) => {
      // Errors can be ignored as the scanner continues to try.
    };

    // Start rendering the scanner.
    scanner.render(onScanSuccess, onScanError);

    // Cleanup function to ensure the scanner is cleared when the component unmounts.
    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner on unmount:", error);
      });
    };
  }, []); // Empty dependency array ensures this runs only once.

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-6 p-4 text-white">
      <h2 className="text-3xl font-bold mb-6">Buyer Page</h2>

      <div className="w-full max-w-md space-y-6">
        {/*
          The scanner container is now always rendered in the DOM.
          We use a conditional CSS class to hide it after a scan result is available.
          This prevents the DOM conflict between React and the scanner library.
        */}
        <div
          id="reader"
          className={scanResult ? 'hidden' : 'w-full bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 overflow-hidden'}
        />

        {/* Show scan result if available */}
        {scanResult && (
          <div className="w-full p-6 bg-gray-800 rounded-lg text-center animate-fade-in">
            <p className="text-lg font-semibold text-green-400 mb-4">Scan Successful!</p>
            <p className="text-sm text-gray-400">Scan Result:</p>
            <p className="text-xs break-all mt-2 font-mono text-green-300">{scanResult}</p>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

// Simple fade-in animation for the result
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);


export default BuyerPage;