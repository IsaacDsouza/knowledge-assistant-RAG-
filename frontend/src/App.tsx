import React, { createContext, useContext, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, Paper, Toolbar, IconButton, Button, CssBaseline, useTheme, ThemeProvider, createTheme, Switch } from '@mui/material';
import Chat from './components/Chat';
import NL2SQL from './components/NL2SQL';
import Ingest from './components/Ingest';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Auth context
const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Navbar({ tab, setTab }: { tab: number; setTab: (v: number) => void }) {
  const { token, logout } = useAuth();
  const theme = useTheme();
  const [mode, setMode] = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide tabs/navbar on landing, login, signup
  if (["/", "/login", "/signup"].includes(location.pathname)) return null;

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 1, cursor: 'pointer' }} onClick={() => navigate('/app')}>
            Knowledge Assistant
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ ml: 2 }}
          >
            <Tab label="Chat" />
            <Tab label="NL2SQL" />
            <Tab label="Ingest" />
          </Tabs>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit" onClick={() => setMode((m: string) => (m === 'light' ? 'dark' : 'light'))}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {token && (
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout} sx={{ fontWeight: 700 }}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Color mode context
const ColorModeContext = createContext<any>(null);
export const useColorMode = () => useContext(ColorModeContext);

function MainApp() {
  const [tab, setTab] = useState(0);
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" width="100vw">
      <Navbar tab={tab} setTab={setTab} />
      <Box flex={1} display="flex" flexDirection="column" justifyContent="center" sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: 'calc(100vh - 64px)' }}>
        <Paper elevation={3} sx={{ mt: 4, flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
          <Box flex={1}>
            {tab === 0 && <Chat />}
            {tab === 1 && <NL2SQL />}
            {tab === 2 && <Ingest />}
          </Box>
        </Paper>
        <Box mt={2} textAlign="center">
          <Typography variant="caption" color="textSecondary">isaacdsouza0809@gmail.com</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#ff9800' : '#ffb74d',
      },
      background: {
        default: mode === 'light' ? '#f5f6fa' : '#181a20',
        paper: mode === 'light' ? '#fff' : '#23272f',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={[mode, setMode]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/app" element={<ProtectedRoute><MainApp /></ProtectedRoute>} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
