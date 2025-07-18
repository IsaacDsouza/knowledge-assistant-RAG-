import React, { useState, useRef } from 'react';
import {
  Box, Typography, Button, Paper, MenuItem, Select, InputLabel, FormControl, LinearProgress, Alert, useTheme, Stack, IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const Ingest: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<'pdf' | 'text'>('pdf');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);
    try {
      const response = await fetch(`${API_URL}/ingest`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setStatus(data.message || 'Upload complete.');
    } catch (e) {
      setStatus('Error uploading file.');
    }
    setLoading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" width="100%">
      <Typography variant="h5" fontWeight={700} gutterBottom color="primary.main">Ingest Document</Typography>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 4 },
          mb: 2,
          borderRadius: 4,
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 16px #0006' : '0 2px 16px #1976d222',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #23272f 0%, #181a20 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
        }}
      >
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="doc-type-label">Document Type</InputLabel>
          <Select
            labelId="doc-type-label"
            value={docType}
            label="Document Type"
            onChange={e => setDocType(e.target.value as 'pdf' | 'text')}
          >
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="text">Text</MenuItem>
          </Select>
        </FormControl>
        <Box
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: dragActive ? `2px dashed ${theme.palette.primary.main}` : '2px dashed #bbb',
            borderRadius: 3,
            p: 3,
            mb: 2,
            textAlign: 'center',
            background: dragActive
              ? (theme.palette.mode === 'dark' ? '#23272f' : '#e3f2fd')
              : 'transparent',
            transition: 'background 0.2s, border 0.2s',
            cursor: 'pointer',
          }}
          onClick={() => inputRef.current?.click()}
        >
          <Stack alignItems="center" spacing={1}>
            <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="body1" color="textSecondary">
              Drag & drop a file here, or <span style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>browse</span>
            </Typography>
            {file && (
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <InsertDriveFileIcon color="action" />
                <Typography variant="body2">{file.name}</Typography>
                <IconButton size="small" onClick={e => { e.stopPropagation(); setFile(null); }}>
                  ×
                </IconButton>
              </Box>
            )}
            <input
              ref={inputRef}
              type="file"
              hidden
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </Stack>
        </Box>
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || loading}
            startIcon={<CloudUploadIcon />}
            sx={{ minWidth: 120, fontWeight: 700 }}
          >
            Upload
          </Button>
        </Box>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
        {status && <Alert sx={{ mt: 2 }} severity={status.startsWith('Error') ? 'error' : 'success'}>{status}</Alert>}
      </Paper>
    </Box>
  );
};

export default Ingest; 