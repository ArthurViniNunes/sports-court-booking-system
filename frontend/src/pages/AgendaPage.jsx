import { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField, MenuItem, Stack } from '@mui/material';
import { quadrasService } from '../features/quadras/services/quadrasService';
import { reservasService } from '../features/reservas/services/reservasService';
import { authService } from '../services/authService';
import FormReservaDialog from '../features/reservas/components/FormReservaDIalog';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function AgendaPage() {
  const [quadras, setQuadras] = useState([]);
  const [selectedQuadra, setSelectedQuadra] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservas, setReservas] = useState([]);
  
  const [openModal, setOpenModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const currentUser = authService.getCurrentUser();

  // Mapeamento dos eventos para o calendário
  const events = reservas.map(reserva => ({
    title: reserva.jogadorId === currentUser.id ? 'Agendado' : 'Ocupado',
    start: new Date(reserva.horarioInicio),
    end: new Date(reserva.horarioFim),
    isMine: reserva.jogadorId === currentUser.id
  }));

  useEffect(() => {
    const fetchQuadras = async () => {
      try {
        const data = await quadrasService.getAll();
        setQuadras(data);
        if (data.length > 0) setSelectedQuadra(data[0].id);
      } catch (error) {
        console.error('Erro ao buscar quadras:', error);
      }
    };
    fetchQuadras();
  }, []);

  const fetchReservas = async () => {
    if (!selectedQuadra) return;
    try {
      const data = await reservasService.getByQuadra(selectedQuadra);
      setReservas(data);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [selectedQuadra]);

  const handleSave = async (formData) => {
    try {
      const dataIso = formData.data; 
      const horarioInicioIso = new Date(`${dataIso}T${formData.horarioInicio}:00`);
      const horarioFimIso = new Date(`${dataIso}T${formData.horarioFim}:00`);

      const payload = {
        jogadorId: currentUser.id,
        quadraId: formData.quadraId,
        data: new Date(`${dataIso}T00:00:00`),
        horarioInicio: horarioInicioIso,
        horarioFim: horarioFimIso
      };

      await reservasService.create(payload);
      setOpenModal(false);
      fetchReservas();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      alert(error.response?.data?.error || 'Erro ao salvar reserva.');
    }
  };

  // Disparado ao clicar ou arrastar (selecionar) espaços em branco no calendário
  const handleSlotClick = (slotInfo) => {
    const start = format(slotInfo.start, 'HH:mm');
    const end = format(slotInfo.end, 'HH:mm');
    setInitialData({
        quadraId: selectedQuadra,
        data: selectedDate,
        horarioInicio: start,
        horarioFim: end
    });
    setOpenModal(true);
  };

  // Mantém a navegação por setas do calendário em sincronia com o TextField de data
  const handleNavigate = (newDate) => {
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  return (
    <Box>
      <Typography variant="h2" color="primary" gutterBottom>
        Agenda Diária
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Consulte a disponibilidade da quadra e faça sua reserva clicando e arrastando nos horários livres.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          select
          label="Selecione a Quadra"
          value={selectedQuadra}
          onChange={(e) => setSelectedQuadra(e.target.value)}
          sx={{ minWidth: 250 }}
        >
          {quadras.map((q) => (
            <MenuItem key={q.id} value={q.id}>
              {q.nome} - {q.modalidade}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          type="date"
          label="Data"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          height: '700px', // Importante para o calendário renderizar as divisões
          backgroundColor: '#F6F7F4',
          // Estilização customizada sobrescrevendo as classes do react-big-calendar
          '& .rbc-calendar': {
            fontFamily: '"Manrope", sans-serif',
            color: '#2F3E34'
          },
          '& .rbc-toolbar button': {
            color: '#3A5A40',
            borderColor: '#DAD7CD',
            borderRadius: '8px',
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 600,
            textTransform: 'capitalize'
          },
          '& .rbc-toolbar button:active, & .rbc-toolbar button.rbc-active': {
            backgroundColor: 'rgba(58, 90, 64, 0.1)',
            borderColor: '#3A5A40',
            boxShadow: 'none',
          },
          '& .rbc-time-view': {
            border: '1px solid #DAD7CD',
            // border: 'none',
            // borderRadius: '10px',
            overflow: 'hidden',
            marginRight: '0px',
            backgroundColor: '#ffffff8d'
          },
          '& .rbc-time-header': {
            backgroundColor: '#F6F7F4',
          },

          '& .rbc-time-content': {
            // borderTop: '1px solid #DAD7CD'
            // overflow: 'hidden',
            border: 'none',

          },
          '& .rbc-timeslot-group': {
            // borderBottom: '1px solid #DAD7CD',
            // border: none
            border: 'none',
            backgroundColor: '#F6F7F4'
          },
          '& rbc-btn-group': {
            // borderBottom: '1px solid #DAD7CD',
            border: 'none'
          }
          ,
          '& button': {
            // borderBottom: '1px solid #DAD7CD',
            border: 'none'
          }
          ,
          '& .rbc-today': {
            backgroundColor: 'rgba(111, 191, 115, 0.04)' // Cor sutil indicando a coluna de hoje
          },
          '& .rbc-event': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            border: 'none',
          },
          '& .rbc-event-label': {
            display: 'none' // Remove o rótulo de horário muito pequeno de dentro da caixa colorida
          }
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['day']} // Remove Mês, Semana, etc
          defaultView="day"
          date={new Date(`${selectedDate}T00:00:00`)}
          onNavigate={handleNavigate}
          min={new Date(1970, 0, 1, 6, 0, 0)} // Início do dia (06:00)
          max={new Date(1970, 0, 1, 23, 59, 59)} // Fim do dia (23:59)
          step={30} // Blocos de 30 minutos
          timeslots={2}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            day: "Dia",
            noEventsInRange: "Nenhuma reserva neste dia.",
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.isMine ? '#3A5A40' : '#6B705C', // Verde primário para suas reservas, Cinza Secundário para terceiros
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '4px 8px',
            }
          })}
          onSelectSlot={(slotInfo) => handleSlotClick(slotInfo)}
          selectable
        />
      </Paper>

      <FormReservaDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        initialData={initialData}
        quadras={quadras}
      />
    </Box>
  );
}