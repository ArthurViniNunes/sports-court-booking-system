import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme/theme';
import { authService } from './services/authService';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

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
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard Protegido */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;