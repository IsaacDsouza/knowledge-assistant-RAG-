import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>Signup successful! Redirecting...</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>Sign Up</Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">Already have an account? <Link component={RouterLink} to="/login">Login</Link></Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup; 