import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Stack,
  MenuItem
} from '@mui/material';
import { Search, Edit, Delete, Add } from '@mui/icons-material';
import { authService } from '../services/authService';
import { reservasService } from '../features/reservas/services/reservasService';
import { quadrasService } from '../features/quadras/services/quadrasService';
import FormReservaDialog from '../features/reservas/components/FormReservaDIalog';

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [quadras, setQuadras] = useState([]);
  
  // Estados para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroQuadra, setFiltroQuadra] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState('');
  
  const [openModal, setOpenModal] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const currentUser = authService.getCurrentUser();

  const carregarDados = async () => {
    try {
      const [reservasData, quadrasData] = await Promise.all([
        reservasService.getByJogador(currentUser.id),
        quadrasService.getAll()
      ]);
      setReservas(reservasData);
      setQuadras(quadrasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleOpenCreate = () => {
    setReservaEditando(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (reserva) => {
    setReservaEditando(reserva);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        await reservasService.delete(id);
        carregarDados();
      } catch (error) {
        console.error('Erro ao excluir reserva:', error);
        alert(error.response?.data?.error || 'Erro ao excluir reserva.');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      const dataIso = formData.data; 
      const horarioInicioIso = new Date(`${dataIso}T${formData.horarioInicio}:00`);
      const horarioFimIso = new Date(`${dataIso}T${formData.horarioFim}:00`);

      const payload = {
        jogadorId: currentUser.id,
        quadraId: formData.quadraId,
        data: new Date(`${dataIso}T00:00:00`),
        horarioInicio: horarioInicioIso,
        horarioFim: horarioFimIso
      };

      if (reservaEditando) {
        await reservasService.update(reservaEditando.id, payload);
      } else {
        await reservasService.create(payload);
      }

      setOpenModal(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      alert(error.response?.data?.error || 'Erro ao salvar reserva.');
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const userTimezoneOffset = data.getTimezoneOffset() * 60000;
    const dataCorrigida = new Date(data.getTime() + userTimezoneOffset);
    return dataCorrigida.toLocaleDateString('pt-BR');
  };

  const formatarHorario = (inicio, fim) => {
    const tInicio = new Date(inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const tFim = new Date(fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${tInicio} - ${tFim}`;
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setFiltroQuadra('');
    setFiltroModalidade('');
  };

  // Obtém lista única de modalidades baseada nas quadras cadastradas
  const modalidades = [...new Set(quadras.map(q => q.modalidade))];

  // Aplicação de todos os filtros de forma combinada no frontend
  const reservasFiltradas = reservas.filter((r) => {
    const textoBusca = searchTerm.toLowerCase();
    const nomeQuadra = r.quadra?.nome.toLowerCase() || '';
    const modalidade = r.quadra?.modalidade.toLowerCase() || '';
    const dataFormatada = formatarData(r.data);

    const matchBusca = nomeQuadra.includes(textoBusca) || modalidade.includes(textoBusca) || dataFormatada.includes(textoBusca);
    const matchQuadra = filtroQuadra ? r.quadraId === filtroQuadra : true;
    const matchModalidade = filtroModalidade ? r.quadra?.modalidade === filtroModalidade : true;

    return matchBusca && matchQuadra && matchModalidade;
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h2" color="primary" gutterBottom>
            Minhas Reservas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Acompanhe seus horários agendados.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenCreate}>
          Nova reserva
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD' }}>
        <Typography variant="h3" color="primary" sx={{ mb: 3, fontSize: '1.2rem' }}>
          Lista de reservas
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <TextField
            select
            size="small"
            value={filtroQuadra}
            onChange={(e) => setFiltroQuadra(e.target.value)}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
          >
            <MenuItem value="">Todas as quadras</MenuItem>
            {quadras.map((q) => (
              <MenuItem key={q.id} value={q.id}>
                {q.nome}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            value={filtroModalidade}
            onChange={(e) => setFiltroModalidade(e.target.value)}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
          >
            <MenuItem value="">Todas as modalidades</MenuItem>
            {modalidades.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            variant="outlined"
            placeholder="Buscar por quadra ou data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: { xs: '100%', md: 250 }, flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Button 
            variant="text" 
            color="secondary" 
            onClick={limparFiltros}
            sx={{ minWidth: 'max-content', textDecoration: 'underline' }}
          >
            Limpar filtros
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>QUADRA</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>DATA</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>HORÁRIO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', textAlign: 'center' }}>AÇÕES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservasFiltradas.length > 0 ? (
                reservasFiltradas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {reserva.quadra?.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reserva.quadra?.modalidade}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatarData(reserva.data)}</TableCell>
                    <TableCell>{formatarHorario(reserva.horarioInicio, reserva.horarioFim)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        startIcon={<Edit />}
                        onClick={() => handleOpenEdit(reserva)}
                        sx={{ mr: 1, borderRadius: '999px' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(reserva.id)}
                        sx={{ borderRadius: '999px' }}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Nenhuma reserva encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <FormReservaDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        reservaEdicao={reservaEditando}
        quadras={quadras}
      />
    </Box>
  );
}