import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function DashboardPage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" color="primary" sx={{ fontFamily: '"Fraunces", serif' }}>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Bem-vindo(a), {user?.nome || 'Jogador'}! Aqui ficarão suas reservas e a agenda da quadra.
            </Typography>
          </Box>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default DashboardPage;