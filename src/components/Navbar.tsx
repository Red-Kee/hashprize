'use client'

import { AppBar, Button, Toolbar, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { WalletSelectionDialog } from './WalletSelectionDialog';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();
  const pathname = usePathname();

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId])

  return (
    <AppBar position='relative'>
      <Toolbar sx={{ overflow: 'visible' }}>
        <img
          src="/images/HashPrizeLogo-TransparentBG.png"
          alt='HashPrize logo'
          style={{
            height: 64,
            width: 'auto',
            display: 'block',
            transform: 'scale(2)',
            transformOrigin: 'left center'
          }}
        />
        
        <Box sx={{ ml: 12, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            href="/"
            sx={{ 
              textDecoration: 'none',
              backgroundColor: pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/docs"
            sx={{ 
              textDecoration: 'none',
              backgroundColor: pathname === '/docs' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Documentation
          </Button>
        </Box>

        <Button
          variant='contained'
          sx={{
            ml: "auto"
          }}
          onClick={handleConnect}
        >
          {accountId ? `Connected: ${accountId}` : 'Connect Wallet'}
        </Button>
      </Toolbar>
      <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
    </AppBar>
  )
}