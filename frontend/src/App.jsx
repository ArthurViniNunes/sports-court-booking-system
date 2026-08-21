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
import { ToastContainer } from 'react-toastify';


function PrivateRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  if (currentUser) {
    return currentUser.isAdmin ? <Navigate to="/dashboard" replace /> : <Navigate to="/perfil" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  return currentUser?.isAdmin ? children : <Navigate to="/perfil" replace />;
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
          

          <Route path="/" element={<PrivateRoute><BaseLayout /></PrivateRoute>}>
            {/* O Dashboard agora é exclusivo de Admins */}
            <Route path="dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
            <Route path="jogadores" element={<AdminRoute><JogadoresPage /></AdminRoute>} />
            
            <Route path="reservas" element={<ReservasPage />} />
            <Route path="quadras" element={<QuadrasPage />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />

    </ThemeProvider>
  );
}

export default App;