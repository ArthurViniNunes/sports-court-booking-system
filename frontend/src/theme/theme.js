import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#F6F7F4', // Fundo principal da aplicação
      paper: '#FFFFFF',   // Fundo dos cards
    },
    primary: {
      main: '#3A5A40',
      light: '#6FBF73',   // Cor de hover do guia
    },
    secondary: {
      main: '#6B705C',
    },
    text: {
      primary: '#2F3E34',
      secondary: '#6B705C',
    },
    success: {
      main: '#588157',
    },
    warning: {
      main: '#7F5539',
    },
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
    h1: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#2F3E34',
    },
    h2: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
      fontSize: '2rem',
      color: '#2F3E34',
    },
    h3: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#2F3E34',
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Remove o uppercase padrão do MUI
    },
  },
  shape: {
    borderRadius: 10, // Padrão de 10px para inputs
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: '44px',
          borderRadius: '999px', // Botões totalmente arredondados
          padding: '0 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#6FBF73',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Padrão de 16px para Cards/Papers
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px', // Padrão para inputs
        },
      },
    },
  },
}); 

export default theme;