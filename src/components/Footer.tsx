'use client';

import { Box } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        className='footer'
      >
          <img 
            src="/images/built-on-hedera.svg"
            alt='An upper case H with a line through the top and the text Build on Hedera'
            className='builtOnHederaSVG'
          />
      </Box>
    </Box>
  );
}