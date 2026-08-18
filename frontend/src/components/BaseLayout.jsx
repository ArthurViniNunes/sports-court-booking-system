import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Avatar, Typography } from '@mui/material';
import { Home, EventAvailable, SportsTennis, Logout, CalendarMonth } from '@mui/icons-material';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

const drawerWidth = 260;

export default function BaseLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Início', path: '/dashboard', icon: <Home /> },
    { text: 'Reservas', path: '/reservas', icon: <EventAvailable /> },
    { text: 'Quadras', path: '/quadras', icon: <SportsTennis /> },
    { text: 'Agenda', path: '/agenda', icon: <CalendarMonth /> },

  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Menu Lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#FFFFFF',
            borderRight: 'none',
            boxShadow: '1px 0px 10px rgba(0,0,0,0.05)'
          },
        }}
      >
        <Box sx={{ p: 4, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" color="primary" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700 }}>
            QuadraFácil
          </Typography>
        </Box>
        
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: isActive ? 'rgba(58, 90, 64, 0.1)' : 'transparent',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: 'rgba(58, 90, 64, 0.15)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: '"Manrope", sans-serif',
                          fontWeight: isActive ? 700 : 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <List sx={{ px: 2, pb: 3 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '10px',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)', color: 'error.main' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Sair" slotProps={{ primary: { sx: { fontFamily: '"Manrope", sans-serif', fontWeight: 500 } } }} />            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Área Principal */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'transparent', pt: 2, px: 4 }}>
          <Toolbar sx={{ justifyContent: 'flex-end', minHeight: '64px !important', px: '0 !important' }}>
            <Avatar
              alt="Perfil do Usuário"
              src="https://mui.com/static/images/avatar/1.jpg" // Imagem de placeholder
              sx={{ cursor: 'pointer', width: 42, height: 42 }}
              onClick={() => navigate('/perfil')}
            />
          </Toolbar>
        </AppBar>

        {/* Conteúdo Dinâmico (Telas) */}
        <Box sx={{ p: 4, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}