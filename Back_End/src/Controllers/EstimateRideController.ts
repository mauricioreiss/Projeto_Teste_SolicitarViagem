import { FastifyRequest, FastifyReply } from "fastify";
import { EstimateRideService } from "../services/EstimateRideService";

class EstimateRideController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { customer_id, origin, destination } = request.body as { customer_id: string; origin: string; destination: string };

        const estimateRideService = new EstimateRideService();

        try {
            const estimate = await estimateRideService.execute({ customer_id, origin, destination });
            
            if (estimate.message) {
                reply.status(400).send(estimate);
            } else {
                reply.send(estimate);
            }
        } catch (error) {
            reply.status(400).send(error); 
        }
    }
}

export { EstimateRideController };