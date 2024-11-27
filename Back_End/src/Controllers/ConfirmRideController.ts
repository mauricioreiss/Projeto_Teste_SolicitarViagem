import { FastifyRequest, FastifyReply } from "fastify";
import { ConfirmRideService } from "../services/ConfirmRideService";

class ConfirmRideController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { customer_id, origin, destination, distance, duration, driver, value } = request.body as {
            customer_id: string;
            origin: string;
            destination: string;
            distance: number;
            duration: string;
            driver: {
                id: number;
                name: string;
            };
            value: number;
        };

        const confirmRideService = new ConfirmRideService();

        try {
            const result = await confirmRideService.execute({ customer_id, origin, destination, distance, duration, driver, value });
            reply.send(result);
        } catch (error) {
            reply.status(400).send(error);
        }
    }
}

export { ConfirmRideController };