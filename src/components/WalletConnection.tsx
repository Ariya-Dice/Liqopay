// File: src/components/WalletConnection.tsx
'use client';

import React, { useState, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import { createTransaction } from '../lib/createTransaction';
import styles from '../pages/Buyer.module.css';

// Exporting the PaymentInfo type
export interface PaymentInfo {
  network: 'ethereum' | 'bsc' | 'hyperliquid' | 'tron' | 'solana' | 'bitcoin' | 'base';
  chainId?: number;
  amount: number;
  recipient: string;
  token: string;
  invoiceId?: string;
  contractAddress?: string;
  tokenDecimals?: number;
}

// EVM Network configurations (chainId in hex string format)
const EVM_NETWORKS: { [key: number]: any } = {
  1: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_ID'], // Remember to replace YOUR_INFURA_ID
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://etherscan.io'],
  },
  999: {
    chainId: '0x3e7',
    chainName: 'Hyperliquid L1', // FIX: Updated to official name
    rpcUrls: ['https://api.hyperliquid.xyz/evm'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, // FIX: Native currency is ETH, not HYPE
    blockExplorerUrls: ['https://explorer.hyperliquid.xyz/'],
  },
  8453: {
    chainId: '0x2105',
    chainName: 'Base Mainnet',
    rpcUrls: ['https://mainnet.base.org'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://basescan.org'],
  },
};

interface WalletConnectionProps {
  paymentInfo: PaymentInfo | null;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ paymentInfo }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);

  const handleError = useCallback((err: any) => {
    let errorMessage = 'An unexpected error occurred.';
    if (err.code === 4001 || err.code === 'ACTION_REJECTED' || err.message?.includes('rejected')) {
      errorMessage = 'You rejected the request.';
    } else if (err.code === -32002) {
      errorMessage = 'A connection request is already pending in your wallet.';
    } else if (err.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient funds for this transaction.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    setError(errorMessage);
    console.error('WalletConnection Error:', err);
  }, []);

  const connectAndPay = useCallback(async () => {
    if (!paymentInfo) {
      setError('Payment information is missing.');
      return;
    }

    setError(null);
    setTxStatus(null);
    setTxHash(null);
    setExplorerUrl(null);
    setIsLoading(true);

    try {
      const { chainId } = paymentInfo;

      if (!chainId || !EVM_NETWORKS[chainId]) {
        throw new Error(`Unsupported network with chainId: ${chainId}`);
      }

      const metamaskProvider = await detectEthereumProvider({ mustBeMetaMask: true });
      if (!metamaskProvider) {
        setError('MetaMask not detected. Please install it to proceed.');
        setIsLoading(false);
        return;
      }

      const provider = new BrowserProvider(metamaskProvider as Eip1193Provider);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const currentAccount = await signer.getAddress();

      const networkConfig = EVM_NETWORKS[chainId];
      const chainIdHex = networkConfig.chainId;

      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: chainIdHex }]);
      } catch (switchError: any) {
        if (switchError.error?.code === 4902) {
          try {
            console.warn(`Network ${chainIdHex} not found. Adding to MetaMask...`);
            await provider.send('wallet_addEthereumChain', [networkConfig]);
            await provider.send('wallet_switchEthereumChain', [{ chainId: chainIdHex }]);
          } catch (addError) {
            console.error('Failed to add the new network to MetaMask.', addError);
            throw new Error('Failed to add the required network to your wallet.');
          }
        } else {
          throw switchError;
        }
      }

      setAccount(currentAccount);
      setTxStatus('Processing transaction...');

      const receipt = await createTransaction(signer, paymentInfo);
      if (receipt && receipt.hash) {
        const base = networkConfig.blockExplorerUrls?.[0];
        const normalizedBase = base ? base.replace(/\/$/, '') : undefined;
        const url = normalizedBase ? `${normalizedBase}/tx/${receipt.hash}` : null;
        setTxHash(receipt.hash);
        setExplorerUrl(url);
      }
      setTxStatus('Transaction successful!');

    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [paymentInfo, handleError]);

  return (
    <div className={styles.walletContainer}>
      <button
        onClick={connectAndPay}
        className={styles.connectButton}
        disabled={isLoading || !paymentInfo}
      >
        {isLoading ? 'Processing...' : account ? `Pay as ${account.substring(0, 6)}...` : 'Connect Wallet & Pay'}
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {txStatus && (
        <p className={styles.successMessage}>
          {txStatus}
          {txHash && explorerUrl && (
            <>
              {' '}
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                View on Explorer
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default WalletConnection;