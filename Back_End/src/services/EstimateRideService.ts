import axios from 'axios';
import prismaClient from '../Prisma';
import dotenv from 'dotenv';

dotenv.config();

interface EstimateRideProps {
    customer_id: string;
    origin: string;
    destination: string;
}

interface DriverOption {
    id: number; 
    nome: string;
    descricao: string;
    carro: string;
    avaliacao: string;
    valor: number; 
}

class EstimateRideService {
    async execute({ customer_id, origin, destination }: EstimateRideProps) {
        if (!customer_id) {
            throw { error_code: "INVALID_DATA", error_description: "customer_id is required." };
        }

        if (!origin || !destination) {
            throw { error_code: "INVALID_DATA", error_description: "Origin and destination are required." };
        }

        if (origin === destination) {
            throw { error_code: "INVALID_DATA", error_description: "Origin and destination cannot be the same." };
        }

        const googleMapsApiKey = process.env.GOOGLE_API_KEY; 
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin,
                destination,
                key: googleMapsApiKey
            }
        });

        const route = response.data.routes[0];
        if (!route) {
            throw { error_code: "INVALID_DATA", error_description: "No route found." };
        }

        const leg = route.legs[0];
        const originLocation = leg.start_location;
        const destinationLocation = leg.end_location;
        const distance = leg.distance.value / 1000; 

        const driverOptions = await this.getAvailableDrivers(distance);

        driverOptions.sort((a, b) => a.valor - b.valor);

        return {
            origin: {
                latitude: originLocation.lat,
                longitude: originLocation.lng,
            },
            destination: {
                latitude: destinationLocation.lat,
                longitude: destinationLocation.lng,
            },
            distance,
            duration: leg.duration.text,
            options: driverOptions, 
            routeResponse: route,
        };
    }

    private async getAvailableDrivers(distance: number) {
        const drivers = await prismaClient.motorista.findMany({
            where: {
                kmMinimo: { lte: distance },
            },
            select: {
                id: true, 
                nome: true,
                descricao: true,
                carro: true,
                avaliacao: true,
                taxaKmMinima: true,
                kmMinimo: true,
            }
        });

        return drivers.map(driver => ({ 
            id: driver.id, 
            nome: driver.nome,
            descricao: driver.descricao,
            carro: driver.carro,
            avaliacao: driver.avaliacao,
            valor: driver.taxaKmMinima * distance 
        }));
    }
}

export { EstimateRideService };