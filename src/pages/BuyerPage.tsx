import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  /**
   * Simulates QR code scanning.
   * In a real application, you should integrate a QR scanning library
   * like `react-qr-reader` or `html5-qrcode`.
   */
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult('Sample QR Code: 0x1234567890abcdef...');
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-6 p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Buyer Page</h2>
      
      <div className="w-full max-w-md space-y-6">
        {/* QR Scanner Placeholder */}
        <div className="w-full h-64 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
          {isScanning ? (
            <div className="text-center">
              {/* Loading spinner animation */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Scanning...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-4">QR Code Scanner</p>
              <button
                onClick={handleScan}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Scanning
              </button>
            </div>
          )}
        </div>

        {/* Show scan result if available */}
        {scanResult && (
          <div className="w-full p-4 bg-gray-800 rounded-lg">
            <p className="text-white text-sm">Scan Result:</p>
            <p className="text-green-400 text-xs break-all mt-2">{scanResult}</p>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default BuyerPage;
