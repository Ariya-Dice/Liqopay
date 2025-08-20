import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BuyerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scanResult && readerRef.current) {
      setIsScanning(true);

      // ایجاد اسکنر و ذخیره در ref
      scannerRef.current = new Html5QrcodeScanner(
        readerRef.current.id,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      const onScanSuccess = (decodedText: string) => {
        // ابتدا اسکنر را پاک کن، سپس state را تغییر بده
        scannerRef.current?.clear().then(() => {
          setScanResult(decodedText);
          setIsScanning(false);
        }).catch(err => {
          console.error("Failed to clear scanner:", err);
          setScanResult(decodedText);
          setIsScanning(false);
        });
      };

      const onScanError = (errorMessage: string) => {
        console.warn('QR scan error:', errorMessage);
      };

      scannerRef.current.render(onScanSuccess, onScanError);
    }

    // Cleanup هنگام unmount
    return () => {
      scannerRef.current?.clear().catch(err => {
        console.error("Failed to clear scanner on unmount:", err);
      });
    };
  }, [scanResult]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-6 p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Buyer Page</h2>

      <div className="w-full max-w-md space-y-6">
        {/* QR Scanner Container */}
        <div
          ref={readerRef}
          id="reader"
          className="w-full h-64 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden"
        >
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
