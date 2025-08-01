'use client';

import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'
import { theme } from '../theme'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import AllWalletsProvider to avoid SSR issues with crypto module
const AllWalletsProvider = dynamic(
  () => import('../services/wallets/AllWalletsProvider').then(mod => ({ default: mod.AllWalletsProvider })),
  { ssr: false }
)

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#87CEEB',
          backgroundImage: 'url(/images/pool-party-background.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {isClient ? (
          <AllWalletsProvider>
            {children}
          </AllWalletsProvider>
        ) : (
          children
        )}
      </Box>
    </ThemeProvider>
  )
}
