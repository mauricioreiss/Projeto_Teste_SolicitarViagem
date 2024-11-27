import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { EstimateRideController } from "./Controllers/EstimateRideController";
import { ConfirmRideController } from "./Controllers/ConfirmRideController";
import { ListRidesController } from "./Controllers/ListRidesControllers";
import { ListMotoristasController } from "./Controllers/ListDriversController"; 

export async function Routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post("/ride/estimate", async (request: FastifyRequest, reply: FastifyReply) => {
        return new EstimateRideController().handle(request, reply);
    });

    fastify.patch("/ride/confirm", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ConfirmRideController().handle(request, reply);
    });

    fastify.get('/ride/:customer_id', async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListRidesController().handle(request, reply);
    });

    fastify.get('/motoristas', async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListMotoristasController().handle(request, reply);
    });
}