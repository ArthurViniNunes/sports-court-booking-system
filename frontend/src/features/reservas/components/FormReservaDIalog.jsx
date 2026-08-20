import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  CircularProgress,
  Autocomplete
} from '@mui/material';

import { quadrasService } from '../../quadras/services/quadrasService';

export default function FormReservaDialog({ open, onClose, onSave, reservaEdicao, initialData, fixedQuadra }) {
  const [formData, setFormData] = useState({
    quadraId: '',
    data: '',
    horarioInicio: '',
    horarioFim: ''
  });

  const [quadrasList, setQuadrasList] = useState([]);
  const [loadingQuadras, setLoadingQuadras] = useState(false);

  const prepareDialog = () => {
    if (reservaEdicao?.quadra) {
      setQuadrasList([reservaEdicao.quadra]);
    } else if (
      initialData?.quadraId &&
      initialData?.quadraNome
    ) {
      setQuadrasList([
        {
          id: initialData.quadraId,
          nome: initialData.quadraNome,
          modalidade: initialData.quadraModalidade || '',
        },
      ]);
    } else {
      setQuadrasList([]);
    }

    if (reservaEdicao) {
      const reservationDate = new Date(reservaEdicao.data);

      const formattedDate = new Date(
        reservationDate.getTime() +
          reservationDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split('T')[0];

      const startTime = new Date(
        reservaEdicao.horarioInicio,
      )
        .toTimeString()
        .substring(0, 5);

      const endTime = new Date(
        reservaEdicao.horarioFim,
      )
        .toTimeString()
        .substring(0, 5);

      setFormData({
        quadraId: reservaEdicao.quadraId,
        data: formattedDate,
        horarioInicio: startTime,
        horarioFim: endTime,
      });

      return;
    }

    if (initialData) {
      setFormData({
        quadraId: initialData.quadraId || '',
        data: initialData.data || '',
        horarioInicio: initialData.horarioInicio || '',
        horarioFim: initialData.horarioFim || '',
      });

      return;
    }

    setFormData({
      quadraId: '',
      data: '',
      horarioInicio: '',
      horarioFim: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenQuadras = async () => {
    // Se a quadra for fixa (ex: vindo da Agenda), não precisamos buscar
    if (fixedQuadra) return;
    
    try {
      setLoadingQuadras(true);
      const data = await quadrasService.getAll();
      setQuadrasList(data);
    } catch (error) {
      console.error('Erro ao buscar quadras:', error);
    } finally {
      setLoadingQuadras(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        transition: {
          onEnter: prepareDialog,
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          p: 1,
        },
      }}
    >
      <DialogTitle component="div">
        <Typography variant="h3" color="primary">
          {reservaEdicao ? 'Editar reserva' : 'Nova reserva'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione a quadra, a data e o horário desejado.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Autocomplete
              openOnFocus
              options={quadrasList}
              getOptionLabel={(option) => option ? `${option.nome} - ${option.modalidade}` : ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={quadrasList.find(q => q.id === formData.quadraId) || null}
              onChange={(event, newValue) => {
                handleChange({ target: { name: 'quadraId', value: newValue ? newValue.id : '' } });
              }}
              onOpen={handleOpenQuadras}
              disabled={fixedQuadra}
              loading={loadingQuadras}
              loadingText="Carregando quadras..."
              noOptionsText="Nenhuma quadra encontrada"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Quadra"
                  required
                  InputProps={{ 
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingQuadras ? <CircularProgress color="inherit" size={20} /> : null}
                        {/* {params.InputProps.endAdornment} */}
                      </>
                    ),
                  }}
                />
              )}
            />
            <TextField
              type="date"
              label="Data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              fullWidth
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                type="time"
                label="Horário de início"
                name="horarioInicio"
                value={formData.horarioInicio}
                onChange={handleChange}
                fullWidth
                required
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <TextField
                type="time"
                label="Horário de término"
                name="horarioFim"
                value={formData.horarioFim}
                onChange={handleChange}
                fullWidth
                required
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="secondary" sx={{ fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Confirmar reserva
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}