import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { authService } from './services/authService';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import BaseLayout from './components/BaseLayout';
import DashboardPage from './pages/DashboardPage';
import QuadrasPage from './pages/QuadrasPage';
import ReservasPage from './pages/ReservasPage';
import PerfilPage from './pages/PerfilPage';
import AgendaPage from './pages/AgendaPage';

// Componente para proteger rotas que exigem login
function PrivateRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Landing Page Pública */}
          <Route path="/" element={<Home />} />
          
          {/* Tela de Login/Registro */}
          <Route
            path="/login"
            element={
              authService.getCurrentUser()
                ? <Navigate to="/dashboard" replace />
                : <LoginPage />
            }
          />          
          {/* Rotas Protegidas e Envolvidas pelo Layout */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <BaseLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reservas" element={<ReservasPage />} />
            <Route path="quadras" element={<QuadrasPage />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;