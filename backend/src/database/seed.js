import prisma from './prisma.js';

async function main() {
    console.log('Iniciando seed...');

    // Limpa o banco na ordem correta (por causa das Foreign Keys)
    await prisma.reserva.deleteMany();
    await prisma.jogador.deleteMany();
    await prisma.quadra.deleteMany();

    // 1. Criar Jogadores
    const jogador1 = await prisma.jogador.create({
        data: {
            nome: 'Carlos Eduardo',
            email: 'carlos@email.com',
            telefone: '11999999999'
        }
    });

    const jogador2 = await prisma.jogador.create({
        data: {
            nome: 'Ana Beatriz',
            email: 'ana@email.com',
            telefone: '11888888888'
        }
    });

    // 2. Criar Quadras
    const quadra1 = await prisma.quadra.create({
        data: {
            nome: 'Quadra Central',
            modalidade: 'Tênis',
            localizacao: 'Setor A'
        }
    });

    const quadra2 = await prisma.quadra.create({
        data: {
            nome: 'Quadra 2',
            modalidade: 'Vôlei de Areia',
            localizacao: 'Setor B'
        }
    });

    // 3. Criar uma Reserva para o dia seguinte
    const hoje = new Date();
    // Marca para amanhã, das 10h às 11h
    const dataReserva = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
    const horarioInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 10, 0, 0);
    const horarioFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 11, 0, 0);

    await prisma.reserva.create({
        data: {
            jogadorId: jogador1.id,
            quadraId: quadra1.id,
            data: dataReserva,
            horarioInicio: horarioInicio,
            horarioFim: horarioFim
        }
    });

    console.log('✅ Seed executado com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });