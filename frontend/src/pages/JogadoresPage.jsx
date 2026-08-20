import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { getJogadores, createJogador, updateJogador, deleteJogador } from '../services/api';
import FormJogador from '../features/jogadores/components/FormJogador';
import ModalConfirmarExclusao from '../features/jogadores/components/ModalConfirmarExclusao';

const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  const numeros = telefone.replace(/\D/g, '');
  if (numeros.length <= 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export default function JogadoresPage() {
  const [loading, setLoading] = useState(false);
  const [jogadores, setJogadores] = useState([]);
  const [totalJogadores, setTotalJogadores] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [novoJogador, setNovoJogador] = useState({ nome: '', email: '', telefone: '' });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [jogadorEditando, setJogadorEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ nome: '', email: '', telefone: '' });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [jogadorParaExcluir, setJogadorParaExcluir] = useState(null);

  const carregarJogadores = async () => {
    setLoading(true);
    try {
      const response = await getJogadores();
      let dados = response.data;
      if (searchTerm.trim()) {
        dados = dados.filter((jogador) =>
          jogador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          jogador.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setJogadores(dados);
      setTotalJogadores(dados.length);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarJogadores();
  }, [searchTerm]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setPage(0);
  };

  const jogadoresPaginados = jogadores.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenCreate = () => {
    setNovoJogador({ nome: '', email: '', telefone: '' });
    setOpenCreateModal(true);
  };

  const handleCloseCreate = () => {
    setOpenCreateModal(false);
    setNovoJogador({ nome: '', email: '', telefone: '' });
  };

  const handleCreateChange = (e) => {
    setNovoJogador({ ...novoJogador, [e.target.name]: e.target.value });
  };

  const handleCreateSave = async () => {
    try {
      setLoading(true);
      await createJogador(novoJogador);
      handleCloseCreate();
      carregarJogadores();
    } catch (error) {
      console.error('Erro ao criar jogador:', error);
      alert(error.response?.data?.error || 'Erro ao criar jogador.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (jogador) => {
    setJogadorEditando(jogador);
    setFormEdit({
      nome: jogador.nome || '',
      email: jogador.email || '',
      telefone: jogador.telefone || '',
    });
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setJogadorEditando(null);
    setFormEdit({ nome: '', email: '', telefone: '' });
  };

  const handleEditChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      await updateJogador(jogadorEditando.id, formEdit);
      handleCloseEdit();
      carregarJogadores();
    } catch (error) {
      console.error('Erro ao atualizar jogador:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar jogador.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (jogador) => {
    setJogadorParaExcluir(jogador);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
    setJogadorParaExcluir(null);
  };

  const handleConfirmDelete = async () => {
    if (!jogadorParaExcluir) return;
    try {
      setLoading(true);
      await deleteJogador(jogadorParaExcluir.id);
      handleCloseDelete();
      carregarJogadores();
    } catch (error) {
      console.error('Erro ao excluir jogador:', error);
      alert(error.response?.data?.error || 'Erro ao excluir jogador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h2" color="primary" gutterBottom>
            Jogadores
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie os jogadores cadastrados no sistema.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenCreate}>
          Novo Jogador
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD' }}>
        <Typography variant="h3" color="primary" sx={{ mb: 3, fontSize: '1.2rem' }}>
          Lista de jogadores
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: { xs: '100%', md: 300 }, flexGrow: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
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
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>NOME</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>E-MAIL</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>TELEFONE</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', textAlign: 'center' }}>
                  AÇÕES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : jogadoresPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    {searchTerm ? 'Nenhum jogador encontrado para a busca.' : 'Nenhum jogador cadastrado.'}
                  </TableCell>
                </TableRow>
              ) : (
                jogadoresPaginados.map((jogador) => (
                  <TableRow key={jogador.id} hover>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {jogador.nome}
                      </Typography>
                    </TableCell>
                    <TableCell>{jogador.email}</TableCell>
                    <TableCell>{formatarTelefone(jogador.telefone)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        size="small"
                        color="secondary"
                        startIcon={<Edit />}
                        onClick={() => handleOpenEdit(jogador)}
                        sx={{ mr: 1, borderRadius: '999px' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleOpenDelete(jogador)}
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
          count={totalJogadores}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      <Dialog open={openCreateModal} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600, color: 'primary.main' }}>
          Novo Jogador
        </DialogTitle>
        <DialogContent dividers>
          <FormJogador formData={novoJogador} onChange={handleCreateChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cancelar</Button>
          <Button onClick={handleCreateSave} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600, color: 'primary.main' }}>
          Editar Jogador
        </DialogTitle>
        <DialogContent dividers>
          <FormJogador formData={formEdit} onChange={handleEditChange} disabled={loading} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ModalConfirmarExclusao
        open={openDeleteModal}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        nome={jogadorParaExcluir?.nome}
        loading={loading}
      />
    </Box>
  );
}