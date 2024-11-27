import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Api } from '../services/api';

interface DriverOption {
    id: number;
    nome: string;
    descricao: string;
    carro: string;
    avaliacao: string;
    valor: number;
}

const RideOptions: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { rideOptions, customerId } = location.state as { rideOptions: any; customerId: string };

    const handleChooseDriver = async (driverId: number) => {
        try {
            await Api.post('/ride/confirm', { driver_id: driverId });
            navigate('/history', { state: { customerId } }); 
        } catch (err: any) {
            console.error('Erro ao confirmar a viagem:', err);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-700 flex flex-col items-center px-4">
            <h1 className="text-4xl font-medium text-white">Opções de Motoristas</h1>

            <div className="options-list mt-6 w-full md:max-w-2xl">
                {rideOptions.map((option: DriverOption) => (
                    <div key={option.id} className="option-card bg-gray-800 p-4 mb-4 rounded">
                        <h3 className="text-white">{option.nome}</h3>
                        <p className="text-gray-400">Descrição: {option.descricao}</p>
                        <p className="text-gray-400">Carro: {option.carro}</p>
                        <p className="text-gray-400">Avaliação: {option.avaliacao}</p>
                        <p className="text-white">Valor: R$ {option.valor.toFixed(2)}</p>
                        <button
                            onClick={() => handleChooseDriver(option.id)}
                            className="mt-2 p-2 bg-green-600 rounded text-white cursor-pointer"
                        >
                            Escolher Motorista
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => navigate('/')}
                className="mt-4 p-2 bg-red-600 rounded text-white cursor-pointer"
            >
                Voltar
            </button>
        </div>
    );
};

export default RideOptions;