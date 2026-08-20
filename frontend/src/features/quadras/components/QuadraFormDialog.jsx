import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const emptyFormData = {
  nome: '',
  modalidade: '',
  localizacao: '',
};

function getInitialFormData(quadra) {
  if (!quadra) {
    return emptyFormData;
  }

  return {
    nome: quadra.nome,
    modalidade: quadra.modalidade,
    localizacao: quadra.localizacao,
  };
}

function QuadraFormDialog({
  open,
  quadra,
  loading,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(quadra),
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      nome: formData.nome.trim(),
      modalidade: formData.modalidade.trim(),
      localizacao: formData.localizacao.trim(),
    });
  };

  const isFormInvalid =
    !formData.nome.trim() ||
    !formData.modalidade.trim() ||
    !formData.localizacao.trim();

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="quadra-form-title"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle component="div">
        <Typography
          id="quadra-form-title"
          variant="h3"
          color="primary"
        >
          {quadra ? 'Editar quadra' : 'Nova quadra'}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {quadra
            ? 'Atualize as informações da quadra.'
            : 'Preencha os dados para cadastrar uma nova quadra.'}
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              name="nome"
              label="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
              disabled={loading}
              slotProps={{
                htmlInput: {
                  maxLength: 100,
                },
              }}
            />

            <TextField
              name="modalidade"
              label="Modalidade"
              value={formData.modalidade}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
              slotProps={{
                htmlInput: {
                  maxLength: 80,
                },
              }}
            />

            <TextField
              name="localizacao"
              label="Localização"
              value={formData.localizacao}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
              slotProps={{
                htmlInput: {
                  maxLength: 150,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            color="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || isFormInvalid}
          >
            {loading ? 'Salvando...' : 'Salvar quadra'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default QuadraFormDialog;