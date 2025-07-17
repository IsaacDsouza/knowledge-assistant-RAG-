import React from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import StorageIcon from '@mui/icons-material/Storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Box maxWidth="900px" width="100%" textAlign="center" px={2}>
        <Typography variant="h3" fontWeight={800} color="primary.main" gutterBottom>
          Enterprise Knowledge Assistant
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Unlock the power of your enterprise data with RAG, NL2SQL, and multi-modal document search.
        </Typography>

        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 3,
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.02)' },
          }}
        >
          <List>
            <ListItem>
              <ListItemIcon>
                <ChatIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="RAG Chat"
                secondary="Ask questions and get instant answers from your knowledge base."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StorageIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary="NL2SQL"
                secondary="Query your database using natural language and see the generated SQL."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CloudUploadIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Document Ingestion"
                secondary="Upload PDFs or text files to expand your knowledge base."
              />
            </ListItem>
          </List>
        </Paper>

        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/app')}
          sx={{ borderRadius: 2, px: 4 }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
