import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  ArrowForward,
  CalendarMonthOutlined,
  CheckCircleOutlined,
  Search,
  SportsTennis,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const steps = [
  {
    number: '01',
    icon: <Search />,
    title: 'Encontre sua quadra',
    description:
      'Explore os espaços disponíveis e escolha a modalidade que combina com seu jogo.',
  },
  {
    number: '02',
    icon: <CalendarMonthOutlined />,
    title: 'Escolha o horário',
    description:
      'Consulte a agenda em tempo real e encontre o melhor momento para sua equipe.',
  },
  {
    number: '03',
    icon: <CheckCircleOutlined />,
    title: 'Confirme e jogue',
    description:
      'Faça sua reserva em poucos cliques e chegue à quadra com tudo organizado.',
  },
];

function Brand({ dark = false }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.2}>
      <Box
        sx={{
          width: 38,
          height: 38,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '12px',
          bgcolor: dark ? 'rgba(255, 255, 255, 0.12)' : 'primary.main',
          color: 'white',
        }}
      >
        <SportsTennis fontSize="small" />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: dark ? 'white' : 'primary.main',
          fontFamily: '"Fraunces", serif',
          fontWeight: 700,
        }}
      >
        QuadraFácil
      </Typography>
    </Stack>
  );
}

function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: 'rgba(246, 247, 244, 0.95)',
          borderBottom: '1px solid rgba(58, 90, 64, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 72, md: 82 },
              justifyContent: 'space-between',
            }}
          >
            <Brand />

            <Stack direction="row" spacing={1}>
              <Button
                component="a"
                href="#como-funciona"
                color="secondary"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              >
                Como funciona
              </Button>

              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
              >
                Entrar
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main">
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 6, md: 9 },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'minmax(0, 0.88fr) minmax(0, 1.12fr)',
              },
              gap: { xs: 5, md: 7 },
              alignItems: 'center',
            }}
          >
            <Box sx={{ maxWidth: 560 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  mb: 3,
                  color: 'primary.main',
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 2,
                    bgcolor: 'primary.main',
                  }}
                />

                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                  }}
                >
                  Reserve. Reúna. Jogue.
                </Typography>
              </Stack>

              <Typography
                component="h1"
                sx={{
                  mb: 3,
                  color: 'text.primary',
                  fontFamily: '"Fraunces", serif',
                  fontSize: {
                    xs: '2.8rem',
                    sm: '4rem',
                    md: '4.5rem',
                  },
                  fontWeight: 700,
                  lineHeight: 0.98,
                  letterSpacing: '-0.04em',
                }}
              >
                Seu jogo começa com um{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  bom horário.
                </Box>
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  maxWidth: 500,
                  mb: 4,
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  lineHeight: 1.7,
                }}
              >
                Encontre quadras, confira a disponibilidade e organize a
                próxima partida sem mensagens desencontradas ou conflitos de
                agenda.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ sm: 'center' }}
              >
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    height: 54,
                    px: 3.5,
                  }}
                >
                  Encontrar uma quadra
                </Button>

                <Typography variant="body2" color="text.secondary">
                  Agendamento simples e gratuito
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ position: 'relative' }}>
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -45,
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  bgcolor: 'rgba(111, 191, 115, 0.18)',
                }}
              />

              <Box
                component="img"
                src="/hero.webp"
                alt="Grupo de amigos chegando a uma quadra esportiva"
                sx={{
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  minHeight: {
                    xs: 330,
                    sm: 430,
                    md: 520,
                  },
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: {
                    xs: '24px',
                    md: '36px',
                  },
                  boxShadow: '0 28px 70px rgba(47, 62, 52, 0.18)',
                }}
              />

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  position: 'absolute',
                  left: { xs: 16, md: -28 },
                  bottom: { xs: 16, md: 34 },
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 14px 38px rgba(47, 62, 52, 0.18)',
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    borderRadius: '50%',
                    bgcolor: 'rgba(88, 129, 87, 0.13)',
                    color: 'success.main',
                  }}
                >
                  <CheckCircleOutlined />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    Reserva confirmada
                  </Typography>

                  <Typography variant="body2" fontWeight={800}>
                    Agora é só jogar
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>

        <Box
          id="como-funciona"
          component="section"
          sx={{
            bgcolor: 'white',
            py: { xs: 8, md: 11 },
            scrollMarginTop: 24,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                maxWidth: 680,
                mx: 'auto',
                mb: { xs: 6, md: 8 },
                textAlign: 'center',
              }}
            >
              <Typography
                variant="overline"
                color="primary"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                }}
              >
                Como funciona
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  mt: 1,
                  fontSize: { xs: '2rem', md: '2.7rem' },
                }}
              >
                Da busca à quadra em três passos
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Menos tempo organizando. Mais tempo aproveitando o jogo.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {steps.map((step) => (
                <Box
                  key={step.number}
                  component="article"
                  sx={{
                    position: 'relative',
                    p: { xs: 3, md: 4 },
                    bgcolor: 'background.default',
                    border: '1px solid #E1E5DE',
                    borderRadius: '24px',
                    transition:
                      'transform 200ms ease, box-shadow 200ms ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow:
                        '0 16px 40px rgba(47, 62, 52, 0.10)',
                    },
                  }}
                >
                  <Typography
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      top: 22,
                      right: 25,
                      color: 'rgba(58, 90, 64, 0.16)',
                      fontFamily: '"Fraunces", serif',
                      fontWeight: 700,
                      fontSize: '2rem',
                    }}
                  >
                    {step.number}
                  </Typography>

                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      display: 'grid',
                      placeItems: 'center',
                      mb: 3,
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '16px',
                    }}
                  >
                    {step.icon}
                  </Box>

                  <Typography variant="h3" sx={{ mb: 1.5 }}>
                    {step.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: '#24352B',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 4, md: 3 }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{
              py: { xs: 5, md: 6 },
            }}
          >
            <Box sx={{ maxWidth: 350 }}>
              <Brand dark />

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: 'rgba(255, 255, 255, 0.66)',
                  lineHeight: 1.7,
                }}
              >
                Encontre o melhor horário, reúna sua equipe e aproveite o jogo.
              </Typography>
            </Box>

            <Stack
              component="nav"
              aria-label="Navegação do rodapé"
              direction="column"
            >
              <Button
                component="a"
                href="#como-funciona"
                color="inherit"
                sx={{
                  height: 38,
                  px: 0,
                  justifyContent: 'flex-start',
                  color: 'rgba(255, 255, 255, 0.76)',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'white',
                  },
                }}
              >
                Como funciona
              </Button>

              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                sx={{
                  height: 38,
                  px: 0,
                  justifyContent: 'flex-start',
                  color: 'rgba(255, 255, 255, 0.76)',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'white',
                  },
                }}
              >
                Entrar
              </Button>
            </Stack>
          </Stack>

          <Divider
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="space-between"
            sx={{
              py: 2.5,
              color: 'rgba(255, 255, 255, 0.46)',
            }}
          >
            <Typography variant="caption">
              © {new Date().getFullYear()} QuadraFácil
            </Typography>

            <Typography variant="caption">
              Organizando partidas, aproximando pessoas.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;