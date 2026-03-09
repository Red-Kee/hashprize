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
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
            HashPrize is a no-loss yield lottery platform built on the Hedera network. 
            Users can stake HBAR to participate in drawings that reward HBAR to the winner.
            HashPrize uses indirect staking, a native feature of Hedera, so that no HBAR ever has to leave your account to participate.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Why is it called a no-loss yield lottery?</Typography>
          </Box>
          <Typography paragraph>
            There is no entry fee or tickets to buy so users do not lose any funds from their account.
            Prizes are funded by pooling the staking rewards/yield of all users.
            Prize-linked savings accounts are a similar concept in which interest from all accounts fund prize drawings.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">What is indirect staking?</Typography>
          </Box>
          <Typography paragraph>
            Indirect staking is a unique feature of the Hedera network that allows users to stake to another account instead of a node. 
            The account they stake to then receives their staking rewards, while users keep their HBAR in their own wallets.
            Other crypto no-loss yield lotteries require users to transfer and lock-up their tokens in a smart contract to participate but Hashprize does not require that thanks to indirect staking.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip label="Prizes" color="primary" sx={{ mr: 1, mb: 1 }} />
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
                secondary="Click button and sign transaction to stake to the HashPrize pool account. This uses Hedera's native indirect staking feature. Your staking rewards help fund the prizes."
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
                primary="Win Prizes!" 
                secondary="You are done! As long as you remain staked to Hashprize, you are automatically entered into the regular prize drawings. No claims are needed. HBAR will be transferred automatically to winners."
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
                secondary="Your chances are proportional to the amout you stake to HashPrize: (Your HBAR)/(Total HBAR Staked to HashPrize)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Random Selection" 
                secondary="Winners are selected using cryptographically secure random numbers generated by Hedera"
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
                secondary="All drawing results are publicly verifiable on the Hedera DLT and shown on the past winners page (under construction)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Automatic Rewards" 
                secondary="Winners automatically receive their HBAR prize - no claims or other actions required"
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
