// File: src/lib/hyperliquid.ts

// This function seems to be a remnant of an older implementation.
// The main transaction logic is now handled in `createTransaction.ts` and `WalletConnection.tsx`.
// It's better to remove this or keep it for reference if needed elsewhere.

/*
export async function sendPayment(
  sender: string,
  recipient: string,
  amount: number
): Promise<string> {
  const tx = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: sender,
        to: recipient,
        value: `0x${(amount * 1e18).toString(16)}`,
      },
    ],
  });
  return tx as string;
}
*/