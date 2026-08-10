/*
  Warnings:

  - Added the required column `senha` to the `Jogador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jogador" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senha" TEXT NOT NULL;
