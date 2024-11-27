import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const motoristaService = {
    async getAllMotoristas() {
        try {
            const motoristas = await prisma.motorista.findMany();
            return motoristas;
        } catch (error) {
            console.error('Erro ao buscar motoristas:', error);
            throw new Error('Erro ao buscar motoristas');
        }
    },
};