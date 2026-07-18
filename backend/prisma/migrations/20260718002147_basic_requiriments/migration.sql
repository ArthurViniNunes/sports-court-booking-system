/*
  Warnings:

  - You are about to drop the column `senha` on the `Jogador` table. All the data in the column will be lost.
  - You are about to drop the column `precoHora` on the `Quadra` table. All the data in the column will be lost.
  - You are about to drop the column `tipoEsporte` on the `Quadra` table. All the data in the column will be lost.
  - You are about to drop the column `dataHora` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `duracaoHoras` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `valorTotal` on the `Reserva` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quadraId,data,horarioInicio,horarioFim]` on the table `Reserva` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telefone` to the `Jogador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localizacao` to the `Quadra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modalidade` to the `Quadra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horarioFim` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horarioInicio` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Reserva_quadraId_dataHora_key";

-- AlterTable
ALTER TABLE "Jogador" DROP COLUMN "senha",
ADD COLUMN     "telefone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quadra" DROP COLUMN "precoHora",
DROP COLUMN "tipoEsporte",
ADD COLUMN     "localizacao" TEXT NOT NULL,
ADD COLUMN     "modalidade" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "dataHora",
DROP COLUMN "duracaoHoras",
DROP COLUMN "valorTotal",
ADD COLUMN     "data" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "horarioFim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "horarioInicio" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Reserva_quadraId_data_idx" ON "Reserva"("quadraId", "data");

-- CreateIndex
CREATE INDEX "Reserva_jogadorId_data_idx" ON "Reserva"("jogadorId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_quadraId_data_horarioInicio_horarioFim_key" ON "Reserva"("quadraId", "data", "horarioInicio", "horarioFim");
