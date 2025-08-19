import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BuyerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5QrcodeScanner: Html5QrcodeScanner | null = null;
    if (!scanResult) {
      setIsScanning(true);
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      const onScanSuccess = (decodedText: string) => {
        // Handle the decoded text from the QR code
        setScanResult(decodedText);
        setIsScanning(false);
        if (html5QrcodeScanner) {
          html5QrcodeScanner.clear();
        }
      };

      const onScanError = (errorMessage: string) => {
        // Log error, don't update state to avoid showing it to the user
        console.warn('QR scan error:', errorMessage);
      };

      html5QrcodeScanner.render(onScanSuccess, onScanError);
    }
    
    // Cleanup function to stop the scanner
    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear scanner:", error);
        });
      }
    };
  }, [scanResult]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-6 p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Buyer Page</h2>

      <div className="w-full max-w-md space-y-6">
        {/* QR Scanner Container */}
        <div id="reader" className="w-full h-64 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
          {isScanning && !scanResult && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Scanning...</p>
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