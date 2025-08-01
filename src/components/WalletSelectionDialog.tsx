'use client';

import { Button, Dialog, Stack } from "@mui/material";


interface WalletSelectionDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
  const { onClose, open, setOpen } = props;

  const handleWalletConnectClick = async () => {
    // Dynamic import to avoid SSR issues
    const { openWalletConnectModal } = await import("../services/wallets/walletconnect/walletConnectClient");
    openWalletConnectModal();
    setOpen(false);
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <Stack p={2} gap={1}>
        <Button
          variant="contained"
          onClick={handleWalletConnectClick}
        >
          <img
            src="/images/walletconnect-logo.svg"
            alt='walletconnect logo'
            className='walletLogoImage'
            style={{
              marginLeft: '-6px'
            }}
          />
          WalletConnect
        </Button>
      </Stack>
    </Dialog>
  );
}
