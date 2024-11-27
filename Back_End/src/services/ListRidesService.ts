import prismaClient from '../Prisma';

class ListRidesService {
  async execute(customer_id: string, driver_id?: string) {
    if (!customer_id) {
      throw { error_code: "INVALID_DATA", error_description: "customer_id não pode estar em branco." };
    }

    const whereClause = { customerId: customer_id };

    if (driver_id) {
      const motorista = await prismaClient.motorista.findUnique({
        where: { id: parseInt(driver_id) }
      });

      if (!motorista) {
        throw { error_code: "INVALID_DRIVER", error_description: "Motorista inválido." };
      }

      whereClause.customerId = driver_id.toString();
    }

    const rides = await prismaClient.viagem.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        viagemId: true,
        origin: true,
        destination: true,
        distance: true,
        driverId: true,
        driverName:true,
        duration: true,
        value: true
      }
    });

    if (rides.length === 0) {
      throw { error_code: "NO_RIDES_FOUND", error_description: "Nenhum registro encontrado." };
    }

    return {
      customer_id,
      rides
    };
  }
}

export { ListRidesService };