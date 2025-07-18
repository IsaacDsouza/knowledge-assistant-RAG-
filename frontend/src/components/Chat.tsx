import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, List, ListItem, ListItemAvatar, Avatar, CircularProgress, Card, CardContent, Drawer, IconButton, Divider, ListItemText, useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../App';

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const { token, logout } = useAuth();
  const theme = useTheme();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Load chat history on mount
  useEffect(() => {
    (async () => {
      if (!token) return;
      const res = await fetch(`${API_URL}/get_chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data.chats || []);
    })();
  }, [token]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Save chat to backend after each assistant response
  useEffect(() => {
    if (messages.length === 0 || !token) return;
    if (messages[messages.length - 1].role === 'assistant') {
      fetch(`${API_URL}/save_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages }),
      });
    }
  }, [messages, token]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: 'user', content: input }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      setMessages((msgs) => [...msgs, { role: 'assistant', content: data.result || 'No answer.' }]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Error contacting server.' }]);
    }
    setInput('');
    setLoading(false);
  };

  const handleHistoryClick = (chat: any) => {
    setMessages(chat.messages);
    setDrawerOpen(false);
  };

  // Color helpers
  const userBubble = theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)'
    : 'linear-gradient(90deg, #e3f2fd 60%, #bbdefb 100%)';
  const assistantBubble = theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, #23272f 60%, #181a20 100%)'
    : 'linear-gradient(90deg, #fffde7 60%, #fff9c4 100%)';

  return (
    <Box display="flex" flexDirection="column" height={{ xs: '80vh', md: '70vh' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
          <Typography variant="h5" fontWeight={700}>RAG Chat</Typography>
        </Box>
        <Button variant="outlined" color="secondary" startIcon={<LogoutIcon />} onClick={logout}>Logout</Button>
      </Box>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box width={300} p={2} height="100%" display="flex" flexDirection="column">
          <Typography variant="h6" mb={2}>Chat History</Typography>
          <Divider />
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {history.length === 0 && <ListItem><Typography>No history yet.</Typography></ListItem>}
            {history.map((chat, idx) => (
              <ListItem
                component="button"
                key={idx}
                onClick={() => handleHistoryClick(chat)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemText primary={`Chat #${idx + 1}`} secondary={`${chat.messages.length} messages`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minHeight: 0,
          maxHeight: { xs: 400, md: 500 },
          overflow: 'auto',
          mb: 2,
          p: { xs: 1, md: 2 },
          background: theme.palette.mode === 'dark' ? 'linear-gradient(180deg, #23272f 0%, #181a20 100%)' : 'linear-gradient(180deg, #f8fafc 0%, #e3f2fd 100%)',
          borderRadius: 3,
        }}
      >
        <List ref={listRef} sx={{ minHeight: 280 }}>
          {messages.map((msg, i) => (
            <ListItem
              key={i}
              alignItems="flex-start"
              sx={{
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                mb: 1,
                border: 'none',
                background: 'none',
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main', color: theme.palette.getContrastText(msg.role === 'user' ? theme.palette.primary.main : theme.palette.secondary.main) }}>
                  {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                </Avatar>
              </ListItemAvatar>
              <Card
                sx={{
                  background: msg.role === 'user' ? userBubble : assistantBubble,
                  boxShadow: 1,
                  maxWidth: { xs: '90%', md: '75%' },
                  ml: msg.role === 'user' ? 0 : 2,
                  mr: msg.role === 'user' ? 2 : 0,
                  borderRadius: 3,
                  color: theme.palette.text.primary,
                }}
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="caption" color="textSecondary" fontWeight={700}>
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {typeof msg.content === 'object'
                      ? <pre style={{ margin: 0, fontSize: 14 }}>{JSON.stringify(msg.content, null, 2)}</pre>
                      : msg.content}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
          {loading && (
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main', color: theme.palette.getContrastText(theme.palette.secondary.main) }}>
                  <SmartToyIcon />
                </Avatar>
              </ListItemAvatar>
              <Card sx={{ background: assistantBubble, boxShadow: 1, borderRadius: 3 }}>
                <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">Assistant is typing...</Typography>
                </CardContent>
              </Card>
            </ListItem>
          )}
        </List>
      </Paper>
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          label="Ask a question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={loading}
          size="small"
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.palette.mode === 'dark' ? '0 1px 4px #0004' : '0 1px 4px #1976d222',
          }}
        />
        <Button variant="contained" onClick={handleSend} disabled={loading || !input.trim()} size="large" sx={{ minWidth: 100 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat; 