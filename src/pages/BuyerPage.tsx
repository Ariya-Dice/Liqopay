import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import WalletConnection from '../components/WalletConnection';
import { PaymentInfo } from '../components/WalletConnection';

const BuyerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [showPayment, setShowPayment] = useState(false);
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
          
          // Parse QR code data and create payment info
          try {
            const qrData = JSON.parse(decodedText);
            const paymentData: PaymentInfo = {
              network: 'ethereum', // Default to ethereum, can be enhanced based on QR data
              chainId: 1, // Default to mainnet
              amount: parseFloat(qrData.amount),
              recipient: qrData.address,
              token: qrData.currency,
              invoiceId: `invoice_${Date.now()}`,
            };
            
            setPaymentInfo(paymentData);
            setShowPayment(true);
          } catch (error) {
            console.error('Failed to parse QR code data:', error);
            setScanResult('Invalid QR code format');
          }
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

  const handleReset = () => {
    setScanResult('');
    setPaymentInfo(null);
    setShowPayment(false);
    setIsScanning(false);
    // Restart scanner
    if (readerRef.current) {
      setIsScanning(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-6 p-4">
      <h2 className="text-2xl font-bold mb-6">Buyer Page</h2>

      <div className="w-full max-w-md space-y-6">
        {/* QR Scanner Container - Show only when not showing payment */}
        {!showPayment && (
          <div
            ref={readerRef}
            id="reader"
            className="w-full h-64 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden"
          >
            {isScanning && !scanResult && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Scanning...</p>
              </div>
            )}
          </div>
        )}

        {/* Show scan result if available */}
        {scanResult && !showPayment && (
          <div className="w-full p-4 bg-gray-800 rounded-lg">
            <p className="text-sm">Scan Result:</p>
            <p className="text-xs break-all mt-2" style={{ color: '#00FF9F' }}>{scanResult}</p>
          </div>
        )}

        {/* Payment Section */}
        {showPayment && paymentInfo && (
          <div className="w-full p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span style={{ color: '#00FF9F' }}>{paymentInfo.amount} {paymentInfo.token}</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span className="text-xs break-all" style={{ color: '#00FF9F' }}>
                  {paymentInfo.recipient.substring(0, 6)}...{paymentInfo.recipient.substring(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span style={{ color: '#00FF9F' }}>{paymentInfo.network}</span>
              </div>
            </div>

            {/* Wallet Connection Component */}
            <WalletConnection paymentInfo={paymentInfo} />

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full mt-4 px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Scan New QR Code
            </button>
          </div>
        )}

        {/* Back button - Show only when not in payment mode */}
        {!showPayment && (
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default BuyerPage;