import { TextField, Stack } from '@mui/material';

export default function FormJogador({ formData, onChange, disabled }) {
  return (
    <Stack spacing={3} sx={{ mt: 1 }}>
      <TextField
        label="Nome completo"
        name="nome"
        value={formData.nome || ''}
        onChange={onChange}
        fullWidth
        required
        disabled={disabled}
        placeholder="Ex: João da Silva"
      />
      <TextField
        label="E-mail"
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={onChange}
        fullWidth
        required
        disabled={disabled}
        placeholder="joao@email.com"
      />
      <TextField
        label="Telefone"
        name="telefone"
        value={formData.telefone || ''}
        onChange={onChange}
        fullWidth
        required
        disabled={disabled}
        placeholder="(00) 00000-0000"
      />
    </Stack>
  );
}