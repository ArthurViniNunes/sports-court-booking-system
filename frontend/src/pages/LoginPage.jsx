import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Stack 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.senha);
        navigate('/dashboard');
      } else {
        await authService.register({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          senha: formData.senha
        });
        
        await authService.login(formData.email, formData.senha);
        navigate('/dashboard');
      }
    }catch (error) {
        console.log(error);       
        setErrorMsg(error.response?.data?.error || 'Ocorreu um erro ao conectar ao servidor.');
    }finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        {/* Título da Aplicação */}
        <Typography variant="h1" align="center" gutterBottom color="primary">
          QuadraFácil
        </Typography>
        
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 5 }, mt: 2 }}>
          <Typography variant="overline" color="secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            {isLogin ? 'ACESSO' : 'CADASTRO'}
          </Typography>
          
          <Typography variant="h3" sx={{ mt: 1, mb: 4 }}>
            {isLogin ? 'Entrar no Quadra Fácil' : 'Crie sua conta de jogador'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {errorMsg && (
                <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                  {errorMsg}
                </Typography>
              )}

              {/* Campos exclusivos do Registro */}
              {!isLogin && (
                <>
                  <TextField
                    label="Nome completo"
                    name="nome"
                    placeholder="Ex: João da Silva"
                    value={formData.nome}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Telefone"
                    name="telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </>
              )}

              {/* Campos comuns (Login e Registro) */}
              <TextField
                label="E-mail"
                name="email"
                type="email"
                placeholder="voce@email.com"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                fullWidth
                required
              />

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? (isLogin ? 'Entrando...' : 'Cadastrando...') : (isLogin ? 'Entrar' : 'Cadastrar')}
              </Button>

              <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  {isLogin ? 'Ainda não é jogador? ' : 'Já possui conta? '}
                  <Link 
                    component="button" 
                    type="button"
                    variant="body2" 
                    onClick={() => {
                      setErrorMsg('');
                      setIsLogin(!isLogin);
                    }}
                    sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {isLogin ? 'Cadastre-se' : 'Entrar'}
                  </Link>
                </Typography>
              </Box>
              
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;