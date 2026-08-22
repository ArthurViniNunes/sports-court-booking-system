import { useState, useEffect } from 'react';
import { Typography, Box, Paper, Stack, Grid, Avatar, CircularProgress, LinearProgress } from '@mui/material';
import {
  CalendarMonth,
  GroupAdd,
  EmojiEvents,
  SportsTennis,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  CategoryOutlined,
  QueryStats
} from '@mui/icons-material';
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { dashboardService } from '../features/dashboard/services/dashboardService';

// Cores baseadas no tema (tons terrosos/verdes)
const COLORS = ['#3A5A40', '#588157', '#A3B18A', '#DAD7CD', '#2F3E46'];

const StatCard = ({ icon, title, value, subtitle, color = 'primary.main', bgColor = 'rgba(58, 90, 64, 0.1)', trend }) => (
  <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD', height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
    <Avatar sx={{ bgcolor: bgColor, color: color, width: 56, height: 56 }}>
      {icon}
    </Avatar>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography variant="h3" sx={{ fontSize: '1.8rem', my: 0.5 }}>{value}</Typography>
        {trend !== undefined && trend !== null && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.3}
            sx={{
              color: trend > 0 ? '#3A5A40' : trend < 0 ? '#B3261E' : 'text.secondary',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            {trend > 0 ? <TrendingUp sx={{ fontSize: 16 }} /> : trend < 0 ? <TrendingDown sx={{ fontSize: 16 }} /> : <TrendingFlat sx={{ fontSize: 16 }} />}
            <span>{Math.abs(trend).toFixed(0)}%</span>
          </Stack>
        )}
      </Stack>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </Box>
  </Paper>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas do dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const maxTopJogador = stats?.top5Jogadores?.[0]?.total || 1;

  return (
    <Box sx={{ pb: 6 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h2" color="primary" gutterBottom>Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">Visão geral do sistema e estatísticas de uso.</Typography>
        </Box>
      </Stack>

      {/* Cartões de Indicadores (KPIs) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<CalendarMonth fontSize="large" />}
            title="Reservas neste Mês"
            value={stats?.totalReservasMes || 0}
            subtitle={`Total geral: ${stats?.totalReservasGeral || 0} reservas`}
            trend={stats?.variacaoMes}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<GroupAdd fontSize="large" />}
            title="Novos Usuários (Mês)"
            value={stats?.novosUsuariosMes || 0}
            subtitle={`Total de usuários: ${stats?.totalUsuarios || 0}`}
            color="#2F3E46"
            bgColor="rgba(47, 62, 70, 0.1)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<EmojiEvents fontSize="large" />}
            title="Jogador Destaque (Mês)"
            value={stats?.jogadorDestaque?.nome || '-'}
            subtitle={stats?.jogadorDestaque ? `${stats.jogadorDestaque.total} reservas realizadas` : 'Sem reservas'}
            color="#d4af37"
            bgColor="rgba(212, 175, 55, 0.1)"
          />
        </Grid>
      </Grid>

      {/* Tendência de Reservas (últimos 14 dias) */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD', height: 320, mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <QueryStats color="primary" />
          <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>Tendência de Reservas (últimos 14 dias)</Typography>
        </Stack>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={stats?.graficoTendencia} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="corTendencia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3A5A40" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3A5A40" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E5DE" />
            <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#6B705C', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B705C', fontSize: 12 }} allowDecimals={false} />
            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #DAD7CD' }} />
            <Area type="monotone" dataKey="total" name="Reservas" stroke="#3A5A40" strokeWidth={2} fill="url(#corTendencia)" />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {/* Crescimento de Reservas ao Longo do Ano */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD', height: 320, mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <TrendingUp color="primary" />
          <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>Crescimento de Reservas (Últimos 12 Meses)</Typography>
        </Stack>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={stats?.graficoCrescimentoAnual} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E5DE" />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6B705C', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B705C', fontSize: 12 }} allowDecimals={false} />
            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #DAD7CD' }} />
            <Line
              type="monotone"
              dataKey="total"
              name="Reservas"
              stroke="#2F3E46"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2F3E46', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
      
      {/* Gráficos Recharts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>

        {/* Gráfico de Barras: Distribuição por Quadra */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD', height: 380, width: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <TrendingUp color="primary" />
              <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>Volume de Reservas por Quadra</Typography>
            </Stack>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={stats?.graficoQuadras} margin={{ top: 10, right: 10, left: -20, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E5DE" />
                <XAxis dataKey="name" hide axisLine={false} tickLine={false} tick={false} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B705C' }} allowDecimals={false} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(58, 90, 64, 0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #DAD7CD' }}
                  labelFormatter={(label) => label}
                  formatter={(value, name, props) => [
                    `${value} reserva${Number(value) === 1 ? '' : 's'}`,
                    props?.payload?.name || 'Quadra'
                  ]}
                />
                <Bar dataKey="value" fill="#3A5A40" radius={[4, 4, 0, 0]} name="Qtd de Reservas" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Pizza: Modalidades */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD', height: 380 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <CategoryOutlined color="primary" />
              <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>Reservas por Modalidade</Typography>
            </Stack>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={stats?.graficoModalidades}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats?.graficoModalidades?.map((entry, index) => (
                    <Cell key={`cell-modalidade-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #DAD7CD' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>

        {/* Gráfico de Barras: Dia da Semana */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD', height: 360 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <SportsTennis color="primary" />
              <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>Movimento por Dia da Semana</Typography>
            </Stack>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={stats?.graficoDiaSemana} margin={{ top: 10, right: 10, left: -20, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E5DE" />
                <XAxis dataKey="name" hide axisLine={false} tickLine={false} tick={false} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B705C' }} allowDecimals={false} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(58, 90, 64, 0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #DAD7CD' }}
                  labelFormatter={(label) => label}
                  formatter={(value, name, props) => [
                    `${value} reserva${Number(value) === 1 ? '' : 's'}`,
                    props?.payload?.name || 'Dia'
                  ]}
                />
                <Bar dataKey="total" fill="#588157" radius={[4, 4, 0, 0]} name="Qtd de Reservas" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Ranking Top 5 Jogadores */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #DAD7CD', height: 360, display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <EmojiEvents sx={{ color: '#d4af37' }} />
              <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>Top 5 Jogadores do Mês</Typography>
            </Stack>
            {(!stats?.top5Jogadores || stats.top5Jogadores.length === 0) ? (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Nenhuma reserva este mês.</Typography>
              </Box>
            ) : (
              <Stack spacing={2} sx={{ mt: 1, overflowY: 'auto' }}>
                {stats.top5Jogadores.map((jogador, index) => (
                  <Box key={`${jogador.nome}-${index}`}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>
                        {index + 1}. {jogador.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {jogador.total} {jogador.total === 1 ? 'reserva' : 'reservas'}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(jogador.total / maxTopJogador) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#E1E5DE',
                        '& .MuiLinearProgress-bar': { bgcolor: COLORS[index % COLORS.length], borderRadius: 3 }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
}