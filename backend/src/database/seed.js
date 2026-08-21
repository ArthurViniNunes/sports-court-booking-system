import prisma from './prisma.js';
import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'senha123';

function buildMonthDate(referenceDate, monthOffset) {
  const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + monthOffset, 1, 0, 0, 0);
  return {
    year: date.getFullYear(),
    monthIndex: date.getMonth(),
    daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
  };
}

function createReservationPayload({ userId, quadraId, year, monthIndex, day, startHour, durationMinutes = 60 }) {
  const data = new Date(year, monthIndex, day, 0, 0, 0);
  const horarioInicio = new Date(year, monthIndex, day, startHour, 0, 0);
  const horarioFim = new Date(horarioInicio.getTime() + durationMinutes * 60 * 1000);

  return {
    jogadorId: userId,
    quadraId,
    data,
    horarioInicio,
    horarioFim,
  };
}

async function main() {
  console.log('Iniciando seed...');

  await prisma.reserva.deleteMany();
  await prisma.jogador.deleteMany();
  await prisma.quadra.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(DEFAULT_PASSWORD, salt);

  const admins = [
    { nome: 'Administrador do Sistema', email: 'admin@admin.com', telefone: '00000000000', senha: senhaHash, isAdmin: true },
    { nome: 'Admin Operacional', email: 'admin2@admin.com', telefone: '00000000001', senha: senhaHash, isAdmin: true }
  ];

  const nomesFicticios = [
    'Lucas Martins',
    'Beatriz Costa',
    'Rafael Souza',
    'Mariana Almeida',
    'Pedro Henrique',
    'Camila Ribeiro',
    'João Vitor',
    'Larissa Santos',
    'Thiago Ferreira',
    'Isabela Rocha',
    'Guilherme Lima',
    'Ana Paula',
    'Matheus Oliveira',
    'Julia Nascimento',
    'Vinicius Araujo',
    'Fernanda Pereira',
    'Daniel Silva',
    'Letícia Cardoso'
  ];

  const jogadores = nomesFicticios.map((nome, index) => ({
    nome,
    email: `${nome.toLowerCase().replace(/\s+/g, '.')}${index + 1}@example.com`,
    telefone: `119${String(10000000 + index * 374).padStart(8, '0')}`,
    senha: senhaHash,
    isAdmin: false,
  }));

  const usuarios = [...admins, ...jogadores];
  await prisma.jogador.createMany({ data: usuarios });

  const usuariosCriados = await prisma.jogador.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const quadras = [
    { nome: 'Quadra Central', modalidade: 'Tênis', localizacao: 'Setor A' },
    { nome: 'Quadra 2', modalidade: 'Vôlei de Areia', localizacao: 'Setor B' },
    { nome: 'Quadra 3', modalidade: 'Futsal', localizacao: 'Setor C' },
    { nome: 'Quadra 4', modalidade: 'Paddle', localizacao: 'Setor D' },
  ];

  await prisma.quadra.createMany({ data: quadras });

  const quadrasCriadas = await prisma.quadra.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const currentMonth = buildMonthDate(new Date(), 0);
  const previousMonth = buildMonthDate(new Date(), -1);

  const reservarMes = (monthInfo, totalReservas) => {
    const reservas = [];
    const dayCounts = new Map();

    const doubleDaysTarget = totalReservas > monthInfo.daysInMonth
      ? totalReservas - monthInfo.daysInMonth
      : Math.floor(totalReservas * 0.2);
    const singleDaysTarget = totalReservas - (doubleDaysTarget * 2);

    const doubleDays = new Set();
    for (let index = 0; index < doubleDaysTarget; index += 1) {
      const day = 1 + ((index * 5 + 2) % monthInfo.daysInMonth);
      doubleDays.add(day);
    }

    const usedDays = new Set(doubleDays);
    const singleDays = [];
    for (let index = 0; index < singleDaysTarget; index += 1) {
      let day = 1 + ((index * 7 + 3) % monthInfo.daysInMonth);
      while (usedDays.has(day)) {
        day = day % monthInfo.daysInMonth + 1;
      }
      usedDays.add(day);
      singleDays.push(day);
    }

    for (const day of doubleDays) {
      dayCounts.set(day, 2);
    }
    for (const day of singleDays) {
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    }

    const plannedDays = [...dayCounts.entries()].map(([day, count]) => ({ day, count }));
    plannedDays.sort((a, b) => a.day - b.day);

    for (const { day, count } of plannedDays) {
      for (let slot = 0; slot < count; slot += 1) {
        const user = usuariosCriados[reservas.length % usuariosCriados.length];
        const quadra = quadrasCriadas[(day + slot) % quadrasCriadas.length];
        const startHour = 9 + ((day + slot) % 6);
        const minuteOffset = (day + slot) % 2 === 0 ? 30 : 0;
        const payload = createReservationPayload({
          userId: user.id,
          quadraId: quadra.id,
          year: monthInfo.year,
          monthIndex: monthInfo.monthIndex,
          day,
          startHour,
          durationMinutes: 60,
        });

        if (minuteOffset === 30) {
          payload.horarioInicio = new Date(
            monthInfo.year,
            monthInfo.monthIndex,
            day,
            startHour,
            30,
            0,
          );
          payload.horarioFim = new Date(payload.horarioInicio.getTime() + 60 * 60 * 1000);
        }

        reservas.push(payload);
      }
    }

    return reservas;
  };

  const reservasMesAtual = reservarMes(currentMonth, 30);
  const reservasMesAnterior = reservarMes(previousMonth, 40);

  await prisma.reserva.createMany({
    data: [...reservasMesAnterior, ...reservasMesAtual],
  });

  const totalUsuarios = await prisma.jogador.count();
  const totalAdmins = await prisma.jogador.count({ where: { isAdmin: true } });
  const totalQuadras = await prisma.quadra.count();
  const totalReservas = await prisma.reserva.count();

  console.log(`Seed executado com sucesso!`);
  console.log(`Usuários criados: ${totalUsuarios} (${totalAdmins} admin(s))`);
  console.log(`Quadras criadas: ${totalQuadras}`);
  console.log(`Reservas criadas: ${totalReservas}`);
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });