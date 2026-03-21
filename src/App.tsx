import Footer from './components/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/Navbar';
import { Box, ThemeProvider } from '@mui/material';
import { AllWalletsProvider } from './services/wallets/AllWalletsProvider';
import AppRouter from './AppRouter';
import { theme } from './theme';
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AllWalletsProvider>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: '100dvh',
            backgroundColor: '#c5dbf2',
            backgroundImage:
              'linear-gradient(180deg, #b9d3eb 0%, #9cbfdd 52%, #a9d1bf 100%)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            backgroundAttachment: 'scroll'
          }}
        >
          <header>
            <NavBar />
          </header>
          <Box
            flex={1}
            p={3}
          >
            <AppRouter />
          </Box>
          <Footer />
        </Box>
      </AllWalletsProvider>
    </ThemeProvider>
  );
}

export default App;