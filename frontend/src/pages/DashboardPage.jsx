import { Typography, Paper, Box } from '@mui/material';
import { authService } from '../services/authService';

function DashboardPage() {
  const user = authService.getCurrentUser();

  return (
    <Box>
      <Typography variant="h2" color="primary" gutterBottom>
        Resumo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Bem-vindo(a), {user?.nome || 'Jogador'}! Navegue pelo menu lateral.
      </Typography>
      
      {/* Exemplo de card vazio para futura métricas */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD' }}>
        <Typography variant="body1">
          Conteúdo do dashboard entrará aqui.
        </Typography>
      </Paper>
    </Box>
  );
}

export default DashboardPage;