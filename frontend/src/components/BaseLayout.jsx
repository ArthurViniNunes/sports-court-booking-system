import { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Avatar, 
  Typography, 
  IconButton, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { 
  Home, 
  EventAvailable, 
  SportsTennis, 
  People,
  Logout, 
  CalendarMonth, 
  Menu as MenuIcon,
  Person 
} from '@mui/icons-material';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

const drawerWidth = 260;

export default function BaseLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = authService.getCurrentUser();

const [profilePic, setProfilePic] = useState(localStorage.getItem(`profile_pic_${currentUser?.id}`) || '');
  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfilePic(localStorage.getItem(`profile_pic_${currentUser?.id}`) || '');
    };

    window.addEventListener('profilePictureUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profilePictureUpdated', handleProfileUpdate);
    };
  }, [currentUser?.id]);

  const fullMenuItems = [
    { text: 'Início', path: '/dashboard', icon: <Home /> },
    { text: 'Reservas', path: '/reservas', icon: <EventAvailable /> },
    { text: 'Quadras', path: '/quadras', icon: <SportsTennis /> },
    { text: 'Jogadores', path: '/jogadores', icon: <People /> },
    { text: 'Agenda', path: '/agenda', icon: <CalendarMonth /> },
  ];

  const menuItems = fullMenuItems.filter((item) => {
    if (item.path === '/jogadores' && !currentUser?.isAdmin) return false;
    return true;
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <>
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
                onClick={() => handleNavigation(item.path)}
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
            <ListItemText primary="Sair" slotProps={{ primary: { sx: { fontFamily: '"Manrope", sans-serif', fontWeight: 500 } } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Menu Lateral */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          ...( !isMobile && { width: drawerWidth, flexShrink: 0 } ),
          '& .MuiDrawer-paper': {
            width: drawerWidth, 
            boxSizing: 'border-box',
            bgcolor: '#FFFFFF',
            borderRight: 'none',
            boxShadow: '1px 0px 10px rgba(0,0,0,0.05)'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Área Principal */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'transparent', pt: 2, px: { xs: 2, md: 4 } }}>
          <Toolbar sx={{ justifyContent: isMobile ? 'space-between' : 'flex-end', minHeight: '64px !important', px: '0 !important' }}>
            
            {/* Ícone Hamburger (Só aparece no mobile) */}
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="abrir menu"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Avatar
              alt="Perfil do Usuário"
              src={profilePic ? profilePic : undefined}
              sx={{ cursor: 'pointer', width: 42, height: 42 }}
              onClick={() => handleNavigation('/perfil')}
            >
              {!profilePic && <Person />}
            </Avatar>

          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}