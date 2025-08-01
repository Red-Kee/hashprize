import { useContext, useEffect, useState } from "react"
import { WalletConnectContext } from "../../contexts/WalletConnectContext";

// Purpose: This hook is used to determine which wallet interface to use
// Example: const { accountId, walletInterface } = useWalletInterface();
// Returns: { accountId: string | null, walletInterface: WalletInterface | null }
export const useWalletInterface = () => {
  const walletConnectCtx = useContext(WalletConnectContext);
  const [walletInterface, setWalletInterface] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    if (walletConnectCtx.accountId && !walletInterface) {
      import("./walletconnect/walletConnectClient").then(module => {
        setWalletInterface(module.walletConnectWallet);
      });
    }
  }, [walletConnectCtx.accountId, walletInterface]);

  if (walletConnectCtx.accountId) {
    return {
      accountId: walletConnectCtx.accountId,
      walletInterface: walletInterface
    }
  } else {
    return {
      accountId: null,
      walletInterface: null
    };
  }
}