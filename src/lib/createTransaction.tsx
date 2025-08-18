// File: src/lib/createTransaction.ts
import { ethers, Signer, Contract, TransactionResponse, TransactionReceipt } from 'ethers';

// Type definition for payment information
interface PaymentInfo {
  recipient: string;
  amount: number;
  token: string;
  network: string;
  contractAddress?: string;
  tokenDecimals?: number;
}

// Token configurations for different networks
const tokenConfigs: { [key: string]: { [key: string]: { address: string; decimals: number } } } = {
    ethereum: {
      USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
      USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    },
    bsc: {
      CAKE: { address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', decimals: 18 },
    },
    hyperliquid: {},
};

// Native token symbols for each network
const nativeTokens: { [key: string]: string[] } = {
  ethereum: ['ETH'],
  bsc: ['BNB'],
  hyperliquid: ['HYPE']
};

/**
 * Creates and sends an EVM transaction using ethers v6.
 * @param {Signer} signer The ethers signer object.
 * @param {PaymentInfo} paymentInfo Payment details.
 * @returns {Promise<TransactionReceipt>} The transaction receipt.
 */
export const createTransaction = async (signer: Signer, paymentInfo: PaymentInfo): Promise<TransactionReceipt | null> => {
  const { recipient, amount, token, network } = paymentInfo;

  // In v6, utils are top-level functions (e.g., ethers.isAddress)
  if (!ethers.isAddress(recipient)) {
    throw new Error('Invalid recipient address');
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount entered');
  }

  const isNativeToken = nativeTokens[network]?.includes(token.toUpperCase());

  // Handle native token transfer
  if (isNativeToken) {
    // In v6, parseEther returns a bigint
    const value = ethers.parseEther(amount.toString());
    const balance = await signer.provider.getBalance(signer.address);

    if (balance < value) {
      throw new Error('Insufficient funds for the transaction amount.');
    }

    const txRequest = { to: recipient, value };
    const gasEstimate = await signer.provider.estimateGas(txRequest);
    
    const tx = await signer.sendTransaction({
        ...txRequest,
        gasLimit: (gasEstimate * 120n) / 100n, // Use BigInt math for gas buffer
    });
    return tx.wait(); // Wait for transaction to be mined
  }

  // Handle ERC20 token transfer
  const tokenConfig = tokenConfigs[network]?.[token.toUpperCase()];
  if (!tokenConfig) {
    throw new Error(`Token ${token} on network ${network} is not supported or misconfigured.`);
  }

  const contract = new Contract(
    tokenConfig.address,
    ['function transfer(address to, uint256 amount)', 'function balanceOf(address owner) view returns (uint256)'],
    signer
  );

  const decimals = tokenConfig.decimals;
  const parsedAmount = ethers.parseUnits(amount.toString(), decimals);
  const balance = await contract.balanceOf(await signer.getAddress());

  if (balance < parsedAmount) {
    throw new Error('Insufficient token balance.');
  }
  
  // estimateGas is now on the contract method itself
  const gasEstimate = await contract.transfer.estimateGas(recipient, parsedAmount);

  const tx: TransactionResponse = await contract.transfer(recipient, parsedAmount, {
      gasLimit: (gasEstimate * 120n) / 100n, // Use BigInt math for gas buffer
  });
  return tx.wait();
};