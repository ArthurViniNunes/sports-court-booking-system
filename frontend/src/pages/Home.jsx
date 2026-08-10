import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontFamily: '"Fraunces", serif', color: 'primary.main', fontWeight: 700 }}
          >
            QuadraFácil
          </Typography>
          <Button 
            component={RouterLink} 
            to="/login" 
            variant="contained" 
            color="primary"
          >
            Entrar
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h2" color="primary" gutterBottom>
          Sua quadra, sem conflito de horário.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          O sistema de agendamento comunitário pensado para times, escolinhas e vizinhos.
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;