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
import JogadoresPage from './pages/JogadoresPage';
import { ToastContainer, toast } from 'react-toastify';


function PrivateRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  return currentUser?.isAdmin ? children : <Navigate to="/dashboard" replace />;
}

function PublicRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  return currentUser ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Landing Page Publica */}
          <Route path="/" element={<Home />} />
          
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
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
            <Route path="jogadores" element={<AdminRoute><JogadoresPage /></AdminRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />

    </ThemeProvider>
  );
}

export default App;