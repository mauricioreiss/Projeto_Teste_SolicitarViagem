import prismaClient from '../Prisma';

interface ConfirmRideProps {
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
}

class ConfirmRideService {
    async execute({ customer_id, origin, destination, distance, duration, driver, value }: ConfirmRideProps) {
        if (!customer_id) {
            throw { error_code: "INVALID_DATA", error_description: "O id do usuário não pode estar em branco." };
        }

        if (!origin || !destination) {
            throw { error_code: "INVALID_DATA", error_description: "Os endereços de origem e destino não podem estar em branco." };
        }

        if (origin === destination) {
            throw { error_code: "INVALID_DATA", error_description: "Os endereços de origem e destino não podem ser o mesmo endereço." };
        }

        const motorista = await this.getDriverWithCriteria(driver.id, distance);
        if (!motorista) {
            throw { error_code: "DRIVER_NOT_FOUND", error_description: "Motorista não encontrado ou não atende aos critérios." };
        }

        const expectedValue = this.calculateRideValue(distance, motorista.taxaKmMinima); 
        if (value !== expectedValue) {
            throw { error_code: "INVALID_DISTANCE", error_description: "Quilometragem inválida para o motorista." };
        }

       await prismaClient.viagem.create({
            data: {
                customerId: customer_id,
                origin,
                destination,
                distance,
                duration,
                driverId: motorista.id, 
                driverName: motorista.nome,
                value,
            }
        });

        return { success: true };
    }

    private async getDriverWithCriteria(driverId: number, distance: number) {
        return await prismaClient.motorista.findUnique({
            where: { id: driverId },
            select: {
                id: true,
                nome: true,
                taxaKmMinima: true,
                kmMinimo: true,
            }
        }).then(driver => {
            if (driver && driver.kmMinimo <= distance) {
                return driver; 
            }
            return null; 
        });
    }

    private calculateRideValue(distance: number, taxaKmMinima: number): number {
        const baseFare = taxaKmMinima;
        const perKmRate = 2; 
        return baseFare + (distance / 1000) * perKmRate;
    }
}

export { ConfirmRideService };