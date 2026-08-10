import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline aplica as cores de background globais e reseta estilos padrão */}
      <CssBaseline />
      <LoginPage />
      
    </ThemeProvider>
  );
}

export default App;