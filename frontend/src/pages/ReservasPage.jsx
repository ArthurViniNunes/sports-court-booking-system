
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
  MenuItem,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { Search, Edit, Delete, Add } from '@mui/icons-material';
import { authService } from '../services/authService';
import { reservasService } from '../features/reservas/services/reservasService';
import { quadrasService } from '../features/quadras/services/quadrasService';
import FormReservaDialog from '../features/reservas/components/FormReservaDIalog';

export default function ReservasPage() {
  //loading tabela
  const [loading, setLoading] = useState(false); 


  const [reservas, setReservas] = useState([]);
  const [quadras, setQuadras] = useState([]);

  //Detalhes modal

  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [detalhesReserva, setDetalhesReserva] = useState(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  
  // Estados de paginação
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalReservas, setTotalReservas] = useState(0);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroQuadra, setFiltroQuadra] = useState('todas');
  const [filtroModalidade, setFiltroModalidade] = useState('todas');
  const [filtroData, setFiltroData] = useState('');
  
  //Edit modal
  const [openModal, setOpenModal] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  
  const currentUser = authService.getCurrentUser();

  const carregarDados = async () => {
    try {
      setLoading(true); 
      const filtros = {
        quadraId: filtroQuadra === 'todas' ? '' : filtroQuadra,
        modalidade: filtroModalidade === 'todas' ? '' : filtroModalidade,
        data: filtroData,
        searchTerm: searchTerm
      };

      const [reservasResponse, quadrasData] = await Promise.all([
        reservasService.getByJogador(currentUser.id, page + 1, rowsPerPage, filtros),
        quadrasService.getAll()
      ]);
      
      setReservas(reservasResponse.data);
      setTotalReservas(reservasResponse.pagination.total);
      setQuadras(quadrasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // pequeno timeout (debounce) para não enviar requisição a cada tecla digitada na busca
    const delayDebounceFn = setTimeout(() => {
      carregarDados();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, rowsPerPage, searchTerm, filtroQuadra, filtroModalidade, filtroData]);

  // Handlers de Mudança
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(0); 
  };

  const handleAbrirDetalhes = async (reservaId) => {
    setModalDetalhesOpen(true);
    setLoadingDetalhes(true);
    try {
      const data = await reservasService.getById(reservaId);
      setDetalhesReserva(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes da reserva", error);
    } finally {
      setLoadingDetalhes(false);
    }
  };

  const handleFecharDetalhes = () => {
    setModalDetalhesOpen(false);
    setDetalhesReserva(null);
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setFiltroQuadra('todas');
    setFiltroModalidade('todas');
    setFiltroData('');
    setPage(0);
  };

  const handleOpenCreate = () => { setReservaEditando(null); setOpenModal(true); };
  const handleOpenEdit = (e, reserva) => {
     e.stopPropagation(); 
    setReservaEditando(reserva); 
    setOpenModal(true);
    };
  
  const handleDelete = async (e, id) => {
    e.stopPropagation();
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

  const modalidades = [...new Set(quadras.map(q => q.modalidade))];

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
            onChange={handleFilterChange(setFiltroQuadra)}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (selected === 'todas') {
                  return 'Todas as quadras';
                }
                const quadra = quadras.find((q) => q.id === selected);
                return quadra?.nome || '';
              }
            }}
          >
            <MenuItem value="todas">Todas as quadras</MenuItem>
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
            onChange={handleFilterChange(setFiltroModalidade)}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (selected === 'todas') { 
                  return 'Todas as modalidades';
                }
                return selected;
              }
            }}
          >
            <MenuItem value="todas">Todas as modalidades</MenuItem>
            {modalidades.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>


          <TextField
            type="date"
            size="small"
            value={filtroData}
            onChange={handleFilterChange(setFiltroData)}
            sx={{ minWidth: { xs: '100%', md: 160 } }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            variant="outlined"
            placeholder="Buscar por quadra..."
            value={searchTerm}
            onChange={handleFilterChange(setSearchTerm)}
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
              {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
              ) : reservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Nenhuma reserva encontrada para os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                reservas.map((reserva) => (
                  <TableRow 
                    key={reserva.id}
                    hover 
                    onClick={() => handleAbrirDetalhes(reserva.id)}
                    sx={{ cursor: 'pointer' }}
                  >
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
                        variant="text"
                        size="small"
                        color="secondary"
                        startIcon={<Edit />}
                        onClick={(e) => handleOpenEdit(e, reserva)}
                        sx={{ mr: 1, borderRadius: '999px' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={(e) => handleDelete(e,reserva.id)}
                        sx={{ borderRadius: '999px' }}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalReservas}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      <FormReservaDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        reservaEdicao={reservaEditando}
        quadras={quadras}
      />

      <Dialog open={modalDetalhesOpen} onClose={handleFecharDetalhes} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Reserva</DialogTitle>
        <DialogContent dividers>
          {loadingDetalhes ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
             </Box>
          ) : detalhesReserva ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Reserva criada em</Typography>
                <Typography variant="body1">
                  {new Date(detalhesReserva.createdAt).toLocaleDateString('pt-BR')} às {new Date(detalhesReserva.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
              
              <Divider/>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Data e Horário Marcados</Typography>
                <Typography variant="body1">
                  {formatarData(detalhesReserva.data)} - {formatarHorario(detalhesReserva.horarioInicio, detalhesReserva.horarioFim)}
                </Typography>
              </Box>
              
              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">Quadra</Typography>
                <Typography variant="body1">{detalhesReserva.quadra?.nome}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Modalidade</Typography>
                <Typography variant="body1">{detalhesReserva.quadra?.modalidade}</Typography>
              </Box>

              <Divider />
              
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Responsável (Jogador)
                </Typography>
                <Typography variant="body2"><strong>Nome:</strong> {detalhesReserva.jogador?.nome}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {detalhesReserva.jogador?.email}</Typography>
                <Typography variant="body2"><strong>Telefone:</strong> {detalhesReserva.jogador?.telefone}</Typography>
              </Box>

            </Stack>
          ) : (
             <Typography>Não foi possível carregar os detalhes.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDetalhes}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>

    
  );
}