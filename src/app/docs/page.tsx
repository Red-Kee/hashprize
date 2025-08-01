'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';

const DocsPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'navy' }}>
          📚 HashPrize Documentation
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Your guide to understanding and using the HashPrize platform
        </Typography>
      </Box>

      {/* What is HashPrize */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">What is HashPrize?</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            HashPrize is a decentralized prize drawing platform built on the Hedera network. 
            Users can stake HBAR tokens to participate in drawings and have a chance to win prizes 
            based on their participation level.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip label="Decentralized" color="primary" sx={{ mr: 1, mb: 1 }} />
            <Chip label="Hedera Network" color="secondary" sx={{ mr: 1, mb: 1 }} />
            <Chip label="Fair Drawings" color="success" sx={{ mr: 1, mb: 1 }} />
            <Chip label="HBAR Staking" color="info" sx={{ mr: 1, mb: 1 }} />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* How to Get Started */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceWalletIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Getting Started</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Step-by-step guide:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>
                  1
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Connect Your Wallet" 
                secondary="Click 'Connect Wallet' and link your Hedera-compatible wallet"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>
                  2
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Stake HBAR" 
                secondary="Choose your staking amount to participate in drawings"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>
                  3
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Participate in Drawings" 
                secondary="Your stake automatically enters you into prize drawings"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>
                  4
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Win Prizes!" 
                secondary="Check back regularly to see if you've won any drawings"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* How Drawings Work */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">How Drawings Work</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            HashPrize uses a fair and transparent drawing system:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Weighted Participation" 
                secondary="Your chances are proportional to your stake amount"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Random Selection" 
                secondary="Winners are selected using cryptographically secure random numbers"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Regular Drawings" 
                secondary="New drawings are held at regular intervals"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Transparent Results" 
                secondary="All drawing results are publicly verifiable on the blockchain"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Security & Safety */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Security & Safety</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Your security is our top priority:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Non-Custodial" 
                secondary="You maintain full control of your funds at all times"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Smart Contracts" 
                secondary="All operations are handled by audited smart contracts"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Hedera Network" 
                secondary="Built on Hedera's secure and energy-efficient network"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Open Source" 
                secondary="Our code is open source and available for review"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Technical Information */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Technical Information</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Platform Details:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Blockchain: Hedera Hashgraph" 
                secondary="Fast, secure, and energy-efficient distributed ledger"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Token: HBAR" 
                secondary="Native cryptocurrency of the Hedera network"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Consensus: Hashgraph" 
                secondary="Asynchronous Byzantine Fault Tolerant consensus"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Frontend: React + Next.js" 
                secondary="Modern web application with server-side rendering"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Contact & Support */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" gutterBottom>
          Need Help?
        </Typography>
        <Typography paragraph>
          If you have questions or need support, we're here to help:
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            • Check our FAQ section for common questions
          </Typography>
          <Typography variant="body2">
            • Join our community Discord for real-time support
          </Typography>
          <Typography variant="body2">
            • Follow us on social media for updates and announcements
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default DocsPage;
