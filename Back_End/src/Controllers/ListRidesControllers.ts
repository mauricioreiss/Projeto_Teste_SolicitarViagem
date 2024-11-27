import { FastifyRequest, FastifyReply } from "fastify";
import { ListRidesService } from "../services/ListRidesService";

class ListRidesController {
    
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { customer_id } = request.params as { customer_id: string };
        const { driver_id } = request.query as { driver_id?: string };

        const listRidesService = new ListRidesService();

        try {
            const rides = await listRidesService.execute(customer_id, driver_id);
            reply.send({
                customer_id,
                rides: rides.map(ride => ({
                    id: ride.id,
                    date: ride.createdAt,
                    origin: ride.origin,
                    destination: ride.destination,
                    distance: ride.distance,
                    duration: ride.duration,
                    driver: {
                        id: ride.driverId,
                        name: ride.driverName,
                    },
                    value: ride.value,
                })),
            });
        } catch (error) {
            reply.status(400).send(error); 
        }
    }
}

export { ListRidesController };