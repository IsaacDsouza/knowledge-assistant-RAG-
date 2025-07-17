import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, IconButton, Collapse, Tooltip, Card, CardContent, useTheme, Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StorageIcon from '@mui/icons-material/Storage';
import { useAuth } from '../App';

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

const CollapsibleJSON: React.FC<{ data: any; label: string }> = ({ data, label }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <Box mb={1}>
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title={open ? 'Collapse' : 'Expand'}>
          <IconButton size="small" onClick={() => setOpen(o => !o)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Tooltip>
        <Typography variant="subtitle2">{label}</Typography>
        <Tooltip title="Copy JSON">
          <IconButton size="small" onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}><ContentCopyIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>
      <Collapse in={open}>
        <Paper variant="outlined" sx={{ p: 1, mt: 1, bgcolor: theme.palette.mode === 'dark' ? '#23272f' : '#f5f5f5', borderRadius: 2 }}>
          <pre style={{ margin: 0, fontSize: 14 }}>{JSON.stringify(data, null, 2)}</pre>
        </Paper>
      </Collapse>
    </Box>
  );
};

const NL2SQL: React.FC = () => {
  const [input, setInput] = useState('');
  const [sql, setSQL] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { token } = useAuth();

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSQL('');
    setResult(null);
    try {
      const response = await fetch('http://localhost:8000/nl2sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      setSQL(data.sql || 'No SQL generated.');
      setResult(data.result || null);
    } catch (e) {
      setSQL('Error contacting server.');
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={600} mx="auto" width="100%">
      <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <StorageIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700} color="primary.main">NL2SQL</Typography>
      </Stack>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 4,
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 16px #0006' : '0 2px 16px #1976d222',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #23272f 0%, #181a20 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
        }}
      >
        <CardContent>
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              label="Ask a database question..."
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
        </CardContent>
      </Card>
      {sql && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: theme.palette.mode === 'dark' ? '#23272f' : '#f3e5f5', borderRadius: 3, position: 'relative' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Generated SQL:</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {typeof sql === 'object' ? (
              <pre style={{ margin: 0, fontSize: 14 }}>{JSON.stringify(sql, null, 2)}</pre>
            ) : (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>{sql}</Typography>
            )}
            <Tooltip title="Copy SQL">
              <IconButton size="small" onClick={() => copyToClipboard(typeof sql === 'object' ? JSON.stringify(sql, null, 2) : sql)}><ContentCopyIcon fontSize="small" /></IconButton>
            </Tooltip>
          </Box>
        </Paper>
      )}
      {result && typeof result === 'object' && (
        <CollapsibleJSON data={result} label="Result" />
      )}
      {result && typeof result !== 'object' && (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="subtitle2">Result:</Typography>
          <Typography variant="body2">{result}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default NL2SQL; 