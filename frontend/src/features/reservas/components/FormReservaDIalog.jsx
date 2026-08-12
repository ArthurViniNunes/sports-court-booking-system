import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';

export default function FormReservaDialog({ open, onClose, onSave, reservaEdicao, initialData, quadras }) {
// export default function FormReservaDialog({ open, onClose, onSave, reservaEdicao, quadras }) {
  const [formData, setFormData] = useState({
    quadraId: '',
    data: '',
    horarioInicio: '',
    horarioFim: ''
  });

  useEffect(() => {
    if (reservaEdicao) {
      // Ajuste para evitar fuso horário puxando a data um dia para trás
      const date = new Date(reservaEdicao.data);
      const dataFormatada = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
        .toISOString().split('T')[0];
      
      const inicio = new Date(reservaEdicao.horarioInicio);
      const horarioInicioFormatado = inicio.toTimeString().substring(0, 5);

      const fim = new Date(reservaEdicao.horarioFim);
      const horarioFimFormatado = fim.toTimeString().substring(0, 5);

      setFormData({
        quadraId: reservaEdicao.quadraId,
        data: dataFormatada,
        horarioInicio: horarioInicioFormatado,
        horarioFim: horarioFimFormatado
      });
    } else if (initialData) {
      // Novo: Configura dados baseados na Agenda
      setFormData({
        quadraId: initialData.quadraId || '',
        data: initialData.data || '',
        horarioInicio: initialData.horarioInicio || '',
        horarioFim: initialData.horarioFim || ''
      });
    } else {
      setFormData({
        quadraId: '',
        data: '',
        horarioInicio: '',
        horarioFim: ''
      });
    }
  }, [reservaEdicao, initialData, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
      <DialogTitle>
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
            <TextField
              select
              label="Quadra"
              name="quadraId"
              value={formData.quadraId}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="" disabled>Selecione uma quadra</MenuItem>
              {quadras.map((q) => (
                <MenuItem key={q.id} value={q.id}>
                  {q.nome} - {q.modalidade}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                type="time"
                label="Horário de Início"
                name="horarioInicio"
                value={formData.horarioInicio}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="time"
                label="Horário de Fim"
                name="horarioFim"
                value={formData.horarioFim}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
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