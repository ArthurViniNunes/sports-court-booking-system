import prisma from '../database/prisma.js';

const NOMES_DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const service = {
    getStats: async () => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const catorzeDiasAtras = new Date();
        catorzeDiasAtras.setDate(catorzeDiasAtras.getDate() - 13);
        catorzeDiasAtras.setHours(0, 0, 0, 0);

        // Consultas simultâneas para maior performance
        const [
            totalReservasGeral,
            totalReservasMes,
            totalReservasMesAnterior,
            totalUsuarios,
            novosUsuariosMes,
            top5JogadoresAgrupado,
            topQuadraAgrupada,
            reservasPorQuadra,
            reservasPorDiaRaw,
            reservasPorDiaSemanaRaw,
            reservasPorModalidadeRaw,
            reservasPorMesRaw
        ] = await Promise.all([
            prisma.reserva.count(),
            prisma.reserva.count({
                where: { data: { gte: firstDayOfMonth, lte: lastDayOfMonth } }
            }),
            prisma.reserva.count({
                where: { data: { gte: firstDayOfLastMonth, lte: lastDayOfLastMonth } }
            }),
            prisma.jogador.count({ where: { isAdmin: false } }),
            prisma.jogador.count({
                where: { isAdmin: false, createdAt: { gte: firstDayOfMonth, lte: lastDayOfMonth } }
            }),
            // Top 5 jogadores do mês (em vez de só o primeiro)
            prisma.reserva.groupBy({
                by: ['jogadorId'],
                where: { data: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 5
            }),
            prisma.reserva.groupBy({
                by: ['quadraId'],
                where: { data: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 1
            }),
            // Dados para o Gráfico (Todas as reservas agrupadas por quadra)
            prisma.reserva.groupBy({
                by: ['quadraId'],
                _count: { id: true }
            }),
            // Reservas por dia (últimos 14 dias) - para o gráfico de tendência
            prisma.$queryRaw`
                SELECT to_char("data", 'YYYY-MM-DD') as dia, COUNT(*)::int as total
                FROM "Reserva"
                WHERE "data" >= ${catorzeDiasAtras}
                GROUP BY dia
                ORDER BY dia
            `,
            // Reservas por dia da semana (histórico geral)
            prisma.$queryRaw`
                SELECT EXTRACT(DOW FROM "data")::int as dow, COUNT(*)::int as total
                FROM "Reserva"
                GROUP BY dow
                ORDER BY dow
            `,
            // Reservas por modalidade (via join com Quadra)
            prisma.$queryRaw`
                SELECT q."modalidade" as modalidade, COUNT(r.id)::int as total
                FROM "Reserva" r
                JOIN "Quadra" q ON q.id = r."quadraId"
                GROUP BY q."modalidade"
                ORDER BY total DESC
            `,
            prisma.$queryRaw`
                SELECT to_char("data", 'YYYY-MM') as mes, COUNT(*)::int as total
                FROM "Reserva"
                WHERE "data" >= ${new Date(now.getFullYear(), now.getMonth() - 11, 1)}
                GROUP BY mes
                ORDER BY mes
            `
        ]);

        // Busca os nomes dos Top 5 Jogadores
        let top5Jogadores = [];
        if (top5JogadoresAgrupado.length > 0) {
            const jogadores = await prisma.jogador.findMany({
                where: { id: { in: top5JogadoresAgrupado.map(j => j.jogadorId) } }
            });
            top5Jogadores = top5JogadoresAgrupado.map(item => {
                const jogador = jogadores.find(j => j.id === item.jogadorId);
                return { nome: jogador?.nome || 'Excluído', total: item._count.id };
            });
        }
        const jogadorDestaque = top5Jogadores[0] || null;

        // Busca o nome da Quadra Destaque
        let quadraDestaque = null;
        if (topQuadraAgrupada.length > 0) {
            const quadra = await prisma.quadra.findUnique({ where: { id: topQuadraAgrupada[0].quadraId } });
            if (quadra) {
                quadraDestaque = { nome: quadra.nome, total: topQuadraAgrupada[0]._count.id };
            }
        }

        // Formata os dados para o gráfico de barras/pizza por quadra
        const quadras = await prisma.quadra.findMany();
        const graficoQuadras = reservasPorQuadra.map(req => {
            const quadra = quadras.find(q => q.id === req.quadraId);
            return {
                name: quadra ? quadra.nome : 'Excluída',
                value: req._count.id
            };
        });

        // Preenche os últimos 14 dias (inclusive os que tiveram 0 reservas)
        const graficoTendencia = [];
        for (let i = 13; i >= 0; i--) {
            const dia = new Date();
            dia.setDate(dia.getDate() - i);
            const chave = dia.toISOString().split('T')[0];
            const encontrado = reservasPorDiaRaw.find(r => r.dia === chave);
            graficoTendencia.push({
                dia: dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                total: encontrado ? encontrado.total : 0
            });
        }

        // Preenche os 7 dias da semana (inclusive os sem nenhuma reserva)
        const graficoDiaSemana = NOMES_DIAS_SEMANA.map((nome, index) => {
            const encontrado = reservasPorDiaSemanaRaw.find(r => r.dow === index);
            return { name: nome, total: encontrado ? encontrado.total : 0 };
        });

        // Distribuição por modalidade
        const graficoModalidades = reservasPorModalidadeRaw.map(r => ({
            name: r.modalidade,
            value: r.total
        }));

        // Variação percentual de reservas em relação ao mês anterior
        let variacaoMes = null;
        if (totalReservasMesAnterior > 0) {
            variacaoMes = ((totalReservasMes - totalReservasMesAnterior) / totalReservasMesAnterior) * 100;
        } else if (totalReservasMes > 0) {
            variacaoMes = 100;
        }

        return {
            totalReservasGeral,
            totalReservasMes,
            totalReservasMesAnterior,
            variacaoMes,
            totalUsuarios,
            novosUsuariosMes,
            jogadorDestaque,
            top5Jogadores,
            quadraDestaque,
            graficoQuadras,
            graficoTendencia,
            graficoDiaSemana,
            graficoModalidades
        };
    }
};

export default service;