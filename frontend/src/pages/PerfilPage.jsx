import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Typography,
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Person,
  LockOutlined,
  DeleteForever,
  CalendarMonth,
  SportsTennis,
  PhotoCamera,
  Edit,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { jogadoresService } from '../features/jogadores/services/jogadoresService';
import { reservasService } from '../features/reservas/services/reservasService';
import FormJogador from '../features/jogadores/components/FormJogador';

const InfoRow = ({ label, value }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
      {value || '-'}
    </Typography>
  </Box>
);

const FormPerfilEdit = ({ dadosIniciais, onSalvar, onCancelar, salvando }) => {
  const [dados, setDados] = useState(dadosIniciais);

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ mb: 3, maxWidth: 420 }}>
        
        {/* Reutilizando o seu componente aqui! */}
        <FormJogador 
          formData={dados} 
          onChange={handleChange} 
          disabled={salvando} 
        />

      </Box>
      <Stack direction="row" spacing={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => onSalvar(dados)} 
          disabled={salvando || !dados.nome || !dados.email}
        >
          {salvando ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button variant="outlined" color="inherit" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </Button>
      </Stack>
    </Box>
  );
};

export default function PerfilPage() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => authService.getCurrentUser(), []);

  // Estados Gerais
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  // Estados do Perfil
  const [isEditing, setIsEditing] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  // Estados de Senha
  const [openSenhaModal, setOpenSenhaModal] = useState(false);
  const [senhas, setSenhas] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  // Estados de Exclusão e Reservas
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [totalReservas, setTotalReservas] = useState(0);
  const [ultimasReservas, setUltimasReservas] = useState([]);

  // Função para mostrar feedback na tela
  const mostrarFeedback = useCallback((message, severity = 'success') => {
    setFeedback({ open: true, message, severity });
  }, []);

  const handleCloseFeedback = () => setFeedback(prev => ({ ...prev, open: false }));

  const carregarDadosPerfil = useCallback(async () => {
    try {
      setLoading(true);

      // Carregar foto do LocalStorage
      const fotoSalva = localStorage.getItem(`profile_pic_${currentUser.id}`);
      if (fotoSalva) {
        setFotoPerfil(fotoSalva);
      }

      // Buscar dados do banco
      const jogador = await jogadoresService.getById(currentUser.id);
      setDadosPessoais({
        nome: jogador.nome,
        email: jogador.email,
        telefone: jogador.telefone
      });

      // Buscar histórico de reservas
      const reservasData = await reservasService.getByJogador(currentUser.id, 1, 3);
      setUltimasReservas(reservasData.data);
      setTotalReservas(reservasData.pagination.total);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      mostrarFeedback('Não foi possível carregar os dados do perfil.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser.id, mostrarFeedback]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarDadosPerfil();
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [carregarDadosPerfil]);

  // --- Handlers da Foto de Perfil (LocalStorage) ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFotoPerfil(base64String);
        localStorage.setItem(`profile_pic_${currentUser.id}`, base64String);

        window.dispatchEvent(new Event('profilePictureUpdated'));

        mostrarFeedback('Foto de perfil atualizada com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarDados = async (novosDados) => {
    try {
      setSalvando(true);
      await jogadoresService.update(currentUser.id, novosDados);

      setDadosPessoais(novosDados);


      setIsEditing(false);
      mostrarFeedback('Dados atualizados com sucesso!');
    } catch (error) {
      mostrarFeedback(error.response?.data?.error || 'Erro ao atualizar dados.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelarEdicao = () => {
    setIsEditing(false);
    carregarDadosPerfil(); // Reseta para os dados originais
  };

  // --- Handlers de Senha ---
  const handleSenhasChange = (e) => {
    setSenhas({ ...senhas, [e.target.name]: e.target.value });
  };

  const handleSalvarSenha = async () => {
    if (senhas.novaSenha !== senhas.confirmarSenha) {
      mostrarFeedback('A nova senha e a confirmação não coincidem.', 'error');
      return;
    }
    try {
      setSalvando(true);
      await jogadoresService.updateSenha(currentUser.id, {
        senhaAtual: senhas.senhaAtual,
        novaSenha: senhas.novaSenha
      });
      setSenhas({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      setOpenSenhaModal(false);
      mostrarFeedback('Senha alterada com sucesso!');
    } catch (error) {
      mostrarFeedback(error.response?.data?.error || 'Erro ao alterar a senha.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  // --- Handlers de Exclusão de Conta ---
  const handleDeleteAccount = async () => {
    try {
      setSalvando(true);
      await jogadoresService.delete(currentUser.id);
      localStorage.removeItem(`profile_pic_${currentUser.id}`); // Limpa a foto ao deletar
      authService.logout();
      navigate('/login');
    } catch (error) {
      mostrarFeedback(error.response?.data?.error || 'Erro ao excluir conta.', 'error');
      setSalvando(false);
      setOpenDeleteModal(false);
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const data = new Date(dataStr);
    const userTimezoneOffset = data.getTimezoneOffset() * 60000;
    return new Date(data.getTime() + userTimezoneOffset).toLocaleDateString('pt-BR');
  };

  const formatarDataHora = (dataStr) => {
    if (!dataStr) return '-';
    return new Date(dataStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {isEditing ? 'Editar Perfil' : 'Perfil'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Gerencie suas informações pessoais e credenciais.
      </Typography>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4, border: '1px solid #DAD7CD' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 4, md: 6 }
          }}
        >
          {/* Lado Esquerdo: Foto */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, flexShrink: 0 }}>
            <Box
              sx={{
                width: 240,
                maxWidth: '100%',
                aspectRatio: '1/1',
                bgcolor: '#F3F4F6',
                borderRadius: '16px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                flexShrink: 0
              }}
            >
              {fotoPerfil ? (
                <Box component="img" src={fotoPerfil} alt="Perfil" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Person sx={{ fontSize: 100, color: '#A0AAB4' }} />
              )}

              {/* Botão Flutuante de Câmera */}
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  bgcolor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                <PhotoCamera sx={{ color: '#4A5568', fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {isEditing ? (
            <FormPerfilEdit 
              dadosIniciais={dadosPessoais}
              onSalvar={handleSalvarDados}
              onCancelar={() => setIsEditing(false)}
              salvando={salvando}
            />
          ) : (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ mb: 3, maxWidth: 420 }}>
                <InfoRow label="Nome:" value={dadosPessoais.nome} />
                <InfoRow label="Email:" value={dadosPessoais.email} />
                <InfoRow label="Telefone:" value={dadosPessoais.telefone} />
              </Box>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="primary" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          alignItems: 'stretch',
          gap: 4
        }}
      >
        {/* Ações de Conta */}
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'rgba(58, 90, 64, 0.1)', color: 'primary.main' }}>
                <CalendarMonth />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Reservas realizadas
                </Typography>
                <Typography variant="h3" sx={{ fontSize: '1.6rem', lineHeight: 1.2 }}>
                  {totalReservas}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Trocar Senha */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(58, 90, 64, 0.1)', color: 'primary.main' }}>
                <LockOutlined />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontSize: '1.1rem' }}>Segurança</Typography>
                <Typography variant="body2" color="text.secondary">Mantenha sua conta protegida.</Typography>
              </Box>
            </Stack>
            <Button fullWidth variant="outlined" onClick={() => setOpenSenhaModal(true)}>
              Trocar Senha
            </Button>
          </Paper>

          {/* Deletar Conta */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #ffcdd2', bgcolor: '#fffafa' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', color: 'error.main' }}>
                <DeleteForever />
              </Avatar>
              <Box>
                <Typography variant="h3" color="error" sx={{ fontSize: '1.1rem' }}>Zona de Perigo</Typography>
                <Typography variant="body2" color="text.secondary">Excluir conta definitivamente.</Typography>
              </Box>
            </Stack>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={() => setOpenDeleteModal(true)}
              disabled={currentUser?.isAdmin}
            >
              Deletar Conta
            </Button>
          </Paper>
        </Stack>

        {/* Histórico de Reservas */}
        <Paper
          elevation={0}
          sx={{
            p: 0,
            border: '1px solid #DAD7CD',
            overflow: 'hidden',
            height: { xs: 'auto', md: '100%' },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DAD7CD', bgcolor: '#F6F7F4', flexShrink: 0 }}>
            <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>
              Últimas Reservas
            </Typography>
          </Box>

          <List sx={{ p: 0, overflowY: 'auto', flex: 1, minHeight: 200 }}>
            {ultimasReservas.length === 0 ? (
              <ListItem sx={{ p: 4, justifyContent: 'center' }}>
                <Typography color="text.secondary">Você ainda não fez nenhuma reserva.</Typography>
              </ListItem>
            ) : (
              ultimasReservas.map((reserva, index) => (
                <Box key={reserva.id}>
                  <ListItem sx={{ py: 2.5, px: 3 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'rgba(58, 90, 64, 0.10)', color: 'primary.main', mr: 3 }}>
                        <SportsTennis />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={reserva.quadra?.nome}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                            {`Reserva: ${formatarData(reserva.data)} • ${new Date(reserva.horarioInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às ${new Date(reserva.horarioFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {`Feita em: ${formatarDataHora(reserva.createdAt)}`}
                          </Typography>
                        </>
                      }
                      primaryTypographyProps={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}
                    />
                  </ListItem>
                  {index < ultimasReservas.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </List>
        </Paper>
      </Box>

      {/* 1. Modal Trocar Senha */}
      <Dialog open={openSenhaModal} onClose={() => !salvando && setOpenSenhaModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: 'primary.main' }}>Alterar Senha</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Senha Atual"
              name="senhaAtual"
              type="password"
              value={senhas.senhaAtual}
              onChange={handleSenhasChange}
              disabled={salvando}
              fullWidth
            />
            <TextField
              label="Nova Senha"
              name="novaSenha"
              type="password"
              value={senhas.novaSenha}
              onChange={handleSenhasChange}
              disabled={salvando}
              fullWidth
            />
            <TextField
              label="Confirmar Nova Senha"
              name="confirmarSenha"
              type="password"
              value={senhas.confirmarSenha}
              onChange={handleSenhasChange}
              disabled={salvando}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenSenhaModal(false)} color="inherit" disabled={salvando}>Cancelar</Button>
          <Button
            onClick={handleSalvarSenha}
            variant="contained"
            color="primary"
            disabled={salvando || !senhas.senhaAtual || !senhas.novaSenha || !senhas.confirmarSenha}
          >
            {salvando ? 'Salvando...' : 'Atualizar Senha'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. Modal Confirmar Exclusão */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar sua conta? Esta ação apagará permanentemente todos os seus dados e o seu histórico de reservas do sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteModal(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleDeleteAccount} variant="contained" color="error" disabled={salvando}>
            {salvando ? 'Deletando...' : 'Sim, deletar conta'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. Snackbar de Feedback */}
      <Snackbar open={feedback.open} autoHideDuration={5000} onClose={handleCloseFeedback} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={feedback.severity} variant="filled" onClose={handleCloseFeedback}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}