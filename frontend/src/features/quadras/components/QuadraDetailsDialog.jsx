import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  CalendarMonthOutlined,
  LocationOnOutlined,
} from '@mui/icons-material';
import { reservasService } from '../../reservas/services/reservasService';

function getTodayISO() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 10);
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function QuadraDetailsDialog({
  open,
  quadra,
  onClose,
  onReserve,
}) {
  const [data, setData] = useState(getTodayISO());
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !quadra) {
      return;
    }

    const carregarDisponibilidade = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await reservasService.getByQuadra(
          quadra.id,
          data,
        );

        setReservas(response);
      } catch (requestError) {
        console.error(
          'Erro ao consultar disponibilidade:',
          requestError,
        );

        setReservas([]);
        setError(
          'Não foi possível consultar os horários desta quadra.',
        );
      } finally {
        setLoading(false);
      }
    };

    carregarDisponibilidade();
  }, [open, quadra, data]);

  const handleClose = () => {
    setReservas([]);
    setError('');
    onClose();
  };

  if (!quadra) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="quadra-details-title"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle component="div">
        <Typography
          id="quadra-details-title"
          variant="h3"
          color="primary"
          sx={{ mb: 1 }}
        >
          {quadra.nome}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 0.5, sm: 2 }}
          color="text.secondary"
        >
          <Typography variant="body2">
            {quadra.modalidade}
          </Typography>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnOutlined fontSize="small" />

            <Typography variant="body2">
              {quadra.localizacao}
            </Typography>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField
            type="date"
            label="Consultar data"
            value={data}
            onChange={(event) => setData(event.target.value)}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                min: getTodayISO(),
              },
            }}
          />

          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <CalendarMonthOutlined color="primary" />

              <Typography fontWeight={700}>
                Horários já reservados
              </Typography>
            </Stack>

            {loading && (
              <Box
                role="status"
                aria-label="Consultando disponibilidade"
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  minHeight: 120,
                }}
              >
                <CircularProgress size={30} />
              </Box>
            )}

            {!loading && error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {!loading && !error && reservas.length === 0 && (
              <Alert severity="success">
                Nenhuma reserva nesta data. A quadra está livre.
              </Alert>
            )}

            {!loading && !error && reservas.length > 0 && (
              <Stack spacing={1}>
                {reservas.map((reserva) => (
                  <Stack
                    key={reserva.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    sx={{
                      p: 1.5,
                      bgcolor: 'background.default',
                      border: '1px solid #E1E5DE',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography fontWeight={700}>
                      {formatTime(reserva.horarioInicio)}
                      {' – '}
                      {formatTime(reserva.horarioFim)}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {reserva.jogador?.nome || 'Ocupado'}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button color="secondary" onClick={handleClose}>
          Fechar
        </Button>

        <Button
          variant="contained"
          onClick={() => onReserve(quadra, data)}
        >
          Reservar esta quadra
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuadraDetailsDialog;