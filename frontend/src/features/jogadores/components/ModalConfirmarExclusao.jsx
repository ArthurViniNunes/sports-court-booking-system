import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Typography,
  Box
} from '@mui/material';

export default function ModalConfirmarExclusao({
  open,
  onClose,
  onConfirm,
  nome,
  loading
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 600, color: 'error.main' }}>
        Confirmar Exclusão
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary' }}>
          Tem certeza que deseja excluir o jogador{' '}
          <strong style={{ color: '#3A5A40' }}>
            {nome || 'este jogador'}
          </strong>?
          <br />
          <br />
          <Typography variant="body2" color="text.secondary">
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? 'Excluindo...' : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}