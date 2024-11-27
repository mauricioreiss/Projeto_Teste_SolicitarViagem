import { FastifyRequest, FastifyReply } from 'fastify';
import { motoristaService } from '../services/GetAllDriversService';

export class ListMotoristasController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        try {
            const motoristas = await motoristaService.getAllMotoristas();
            reply.send(motoristas);
        } catch (error) {
            console.error('Erro ao listar motoristas:', error);
            reply.status(500).send({ error: 'Erro ao buscar motoristas' });
        }
    }
}