import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  EventAvailable,
  LocationOnOutlined,
  Search,
  SportsTennis,
} from '@mui/icons-material';

import { authService } from '../services/authService';
import { quadrasService } from '../features/quadras/services/quadrasService';
import { reservasService } from '../features/reservas/services/reservasService';

import FormReservaDialog from '../features/reservas/components/FormReservaDIalog';
import QuadraDetailsDialog from '../features/quadras/components/QuadraDetailsDialog';
import QuadraFormDialog from '../features/quadras/components/QuadraFormDialog';

function QuadrasPage() {
  const [quadras, setQuadras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [modalidade, setModalidade] = useState('todas');

  const [quadraDetalhes, setQuadraDetalhes] = useState(null);

  const [quadraReserva, setQuadraReserva] = useState(null);
  const [dataReserva, setDataReserva] = useState('');

  const [quadraFormOpen, setQuadraFormOpen] = useState(false);
  const [quadraEditando, setQuadraEditando] = useState(null);
  const [salvandoQuadra, setSalvandoQuadra] = useState(false);

  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const currentUser = authService.getCurrentUser();
  const isAdmin = Boolean(currentUser?.isAdmin);

  const carregarQuadras = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await quadrasService.getAll();

      setQuadras(data);
    } catch (requestError) {
      console.error('Erro ao carregar quadras:', requestError);

      setError(
        'Não foi possível carregar as quadras. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    quadrasService
      .getAll()
      .then((data) => {
        if (!isActive) {
          return;
        }

        setQuadras(data);
        setError('');
      })
      .catch((requestError) => {
        if (!isActive) {
          return;
        }

        console.error(
          'Erro ao carregar quadras:',
          requestError,
        );

        setError(
          'Não foi possível carregar as quadras. Verifique sua conexão e tente novamente.',
        );
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const modalidades = useMemo(() => {
    return [...new Set(quadras.map((quadra) => quadra.modalidade))].sort(
      (a, b) => a.localeCompare(b, 'pt-BR'),
    );
  }, [quadras]);

  const quadrasFiltradas = useMemo(() => {
    const termoNormalizado = searchTerm
      .trim()
      .toLocaleLowerCase('pt-BR');

    return quadras.filter((quadra) => {
      const correspondeModalidade =
        modalidade === 'todas' ||
        quadra.modalidade === modalidade;

      const camposPesquisaveis = [
        quadra.nome,
        quadra.modalidade,
        quadra.localizacao,
      ];

      const correspondePesquisa =
        !termoNormalizado ||
        camposPesquisaveis.some((campo) =>
          campo
            .toLocaleLowerCase('pt-BR')
            .includes(termoNormalizado),
        );

      return correspondeModalidade && correspondePesquisa;
    });
  }, [quadras, modalidade, searchTerm]);

  const limparFiltros = () => {
    setSearchTerm('');
    setModalidade('todas');
  };

  const handleReserve = (quadra, data = '') => {
    setQuadraDetalhes(null);
    setQuadraReserva(quadra);
    setDataReserva(data);
  };

  const handleCloseReservation = () => {
    setQuadraReserva(null);
    setDataReserva('');
  };

  const handleSaveReservation = async (formData) => {
    try {
      const payload = {
        jogadorId: currentUser.id,
        quadraId: formData.quadraId,
        data: new Date(`${formData.data}T00:00:00`),
        horarioInicio: new Date(
          `${formData.data}T${formData.horarioInicio}:00`,
        ),
        horarioFim: new Date(
          `${formData.data}T${formData.horarioFim}:00`,
        ),
      };

      await reservasService.create(payload);

      setQuadraReserva(null);
      setDataReserva('');

      setFeedback({
        open: true,
        message: 'Reserva criada com sucesso.',
        severity: 'success',
      });
    } catch (requestError) {
      console.error('Erro ao criar reserva:', requestError);

      setFeedback({
        open: true,
        message:
          requestError.response?.data?.error ||
          'Não foi possível criar a reserva.',
        severity: 'error',
      });
    }
  };

  const handleOpenCreateCourt = () => {
    setQuadraEditando(null);
    setQuadraFormOpen(true);
  };

  const handleOpenEditCourt = (quadra) => {
    setQuadraEditando(quadra);
    setQuadraFormOpen(true);
  };

  const handleCloseCourtForm = () => {
    if (salvandoQuadra) {
      return;
    }

    setQuadraFormOpen(false);
    setQuadraEditando(null);
  };

  const handleSaveCourt = async (formData) => {
    const isEditing = Boolean(quadraEditando);

    try {
      setSalvandoQuadra(true);

      if (isEditing) {
        await quadrasService.update(
          quadraEditando.id,
          formData,
        );
      } else {
        await quadrasService.create(formData);
      }

      setQuadraFormOpen(false);
      setQuadraEditando(null);

      setFeedback({
        open: true,
        message: isEditing
          ? 'Quadra atualizada com sucesso.'
          : 'Quadra cadastrada com sucesso.',
        severity: 'success',
      });

      await carregarQuadras();
    } catch (requestError) {
      console.error('Erro ao salvar quadra:', requestError);

      setFeedback({
        open: true,
        message:
          requestError.response?.data?.error ||
          'Não foi possível salvar a quadra.',
        severity: 'error',
      });
    } finally {
      setSalvandoQuadra(false);
    }
  };

  const handleDeleteCourt = async (quadra) => {
    const confirmed = window.confirm(
      `Deseja excluir a quadra “${quadra.nome}”? As reservas vinculadas também serão removidas.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await quadrasService.delete(quadra.id);

      setFeedback({
        open: true,
        message: 'Quadra excluída com sucesso.',
        severity: 'success',
      });

      await carregarQuadras();
    } catch (requestError) {
      console.error('Erro ao excluir quadra:', requestError);

      setFeedback({
        open: true,
        message:
          requestError.response?.data?.error ||
          'Não foi possível excluir a quadra.',
        severity: 'error',
      });
    }
  };

  const handleCloseFeedback = () => {
    setFeedback((currentFeedback) => ({
      ...currentFeedback,
      open: false,
    }));
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h2" color="primary" gutterBottom>
            Quadras
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Encontre o espaço ideal para sua próxima partida.
          </Typography>
        </Box>

        {isAdmin && (
          <Box
            sx={{
              ml: 'auto',
              alignSelf: {
                xs: 'flex-end',
                sm: 'center',
              },
            }}
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreateCourt}
            >
              Nova quadra
            </Button>
          </Box>
        )}
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <TextField
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar por nome, modalidade ou localização"
          aria-label="Buscar quadras"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          size="small"
          value={modalidade}
          onChange={(event) => setModalidade(event.target.value)}
          aria-label="Filtrar por modalidade"
          sx={{
            minWidth: { xs: '100%', md: 230 },
          }}
        >
          <MenuItem value="todas">
            Todas as modalidades
          </MenuItem>

          {modalidades.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        {(searchTerm || modalidade !== 'todas') && (
          <Button
            color="secondary"
            onClick={limparFiltros}
            sx={{
              minWidth: 'max-content',
            }}
          >
            Limpar filtros
          </Button>
        )}
      </Stack>

      {loading && (
        <Box
          role="status"
          aria-label="Carregando quadras"
          sx={{
            display: 'grid',
            placeItems: 'center',
            minHeight: 300,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <CircularProgress />

            <Typography color="text.secondary">
              Carregando quadras...
            </Typography>
          </Stack>
        </Box>
      )}

      {!loading && error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={carregarQuadras}>
              Tentar novamente
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!loading && !error && quadrasFiltradas.length === 0 && (
        <Box
          sx={{
            py: 10,
            px: 3,
            textAlign: 'center',
            bgcolor: 'white',
            border: '1px solid #E1E5DE',
            borderRadius: '24px',
          }}
        >
          <SportsTennis
            sx={{
              mb: 2,
              color: 'text.secondary',
              fontSize: 56,
            }}
          />

          <Typography variant="h3" gutterBottom>
            Nenhuma quadra encontrada
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Ajuste os filtros para ampliar sua busca.
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            onClick={limparFiltros}
          >
            Limpar filtros
          </Button>
        </Box>
      )}

      {!loading && !error && quadrasFiltradas.length > 0 && (
        <>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {quadrasFiltradas.length}{' '}
            {quadrasFiltradas.length === 1
              ? 'quadra encontrada'
              : 'quadras encontradas'}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                xl: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 3,
            }}
          >
            {quadrasFiltradas.map((quadra) => (
              <Card
                key={quadra.id}
                component="article"
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 290,
                  borderColor: '#DADFD6',
                  transition:
                    'transform 200ms ease, box-shadow 200ms ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow:
                      '0 16px 36px rgba(47, 62, 52, 0.10)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    flexGrow: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 3 }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(58, 90, 64, 0.10)',
                        color: 'primary.main',
                        borderRadius: '16px',
                      }}
                    >
                      <SportsTennis />
                    </Box>

                    {isAdmin && (
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          aria-label={`Editar ${quadra.nome}`}
                          onClick={() =>
                            handleOpenEditCourt(quadra)
                          }
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          aria-label={`Excluir ${quadra.nome}`}
                          onClick={() =>
                            handleDeleteCourt(quadra)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>

                  <Typography variant="h3" sx={{ mb: 1.5 }}>
                    {quadra.nome}
                  </Typography>

                  <Chip
                    label={quadra.modalidade}
                    size="small"
                    sx={{
                      mb: 2,
                      bgcolor: 'rgba(88, 129, 87, 0.12)',
                      color: 'primary.main',
                      fontWeight: 700,
                    }}
                  />

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    color="text.secondary"
                  >
                    <LocationOnOutlined fontSize="small" />

                    <Typography variant="body2">
                      {quadra.localizacao}
                    </Typography>
                  </Stack>
                </CardContent>

                <Divider />

                <CardActions
                  sx={{
                    p: 2,
                    gap: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    onClick={() => setQuadraDetalhes(quadra)}
                  >
                    Ver detalhes
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<EventAvailable />}
                    onClick={() => handleReserve(quadra)}
                  >
                    Reservar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </>
      )}

      <QuadraDetailsDialog
        open={Boolean(quadraDetalhes)}
        quadra={quadraDetalhes}
        onClose={() => setQuadraDetalhes(null)}
        onReserve={handleReserve}
      />

      <FormReservaDialog
        open={Boolean(quadraReserva)}
        onClose={handleCloseReservation}
        onSave={handleSaveReservation}
        fixedQuadra
        initialData={
          quadraReserva
            ? {
                quadraId: quadraReserva.id,
                quadraNome: quadraReserva.nome,
                quadraModalidade: quadraReserva.modalidade,
                data: dataReserva,
              }
            : undefined
        }
      />

      {quadraFormOpen && (
        <QuadraFormDialog
          key={quadraEditando?.id || 'nova-quadra'}
          open
          quadra={quadraEditando}
          loading={salvandoQuadra}
          onClose={handleCloseCourtForm}
          onSave={handleSaveCourt}
        />
      )}

      <Snackbar
        open={feedback.open}
        autoHideDuration={5000}
        onClose={handleCloseFeedback}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity={feedback.severity}
          variant="filled"
          onClose={handleCloseFeedback}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default QuadrasPage;