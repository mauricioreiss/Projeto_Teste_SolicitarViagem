import React, { useState } from 'react';
import { Api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RideRequestForm: React.FC = () => {
    const [customerId, setCustomerId] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const response = await Api.post('/ride/estimate', {
                customer_id: customerId,
                origin,
                destination
            });

            console.log('Resposta da estimativa:', response.data);
            navigate('/options', { state: { rideOptions: response.data, customerId } });

        } catch (err: any) {
            setError(err.response?.data?.error_description || 'Erro ao solicitar a viagem');
        }
    };

    const handleViewHistory = () => {
        navigate('/HistoryRides', { state: { customerId } }); 
    };

    return (
        <div className="w-full min-h-screen bg-gray-700 flex justify-center px-4">
            <main className="my-10 w-full md:max-w-2xl">
                <h1 className="text-4xl font-medium text-white">Solicitação de Viagem</h1>

                <form className="flex flex-col my-6" onSubmit={handleSubmit}>
                    <label className="font-medium text-white">ID do Usuário:</label>
                    <input
                        type="text"
                        className="w-full mb-5 p-2 rounded"
                        placeholder="Digite seu ID..."
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                    />
                    <label className="font-medium text-white">Endereço de Origem:</label>
                    <input
                        type="text"
                        className="w-full mb-5 p-2 rounded"
                        placeholder="Digite seu endereço de origem..."
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        required
                    />
                    <label className="font-medium text-white">Endereço de Destino:</label>
                    <input
                        type="text"
                        className="w-full mb-5 p-2 rounded"
                        placeholder="Digite seu endereço de destino..."
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                    <div className="flex justify-between">
                        <input
                            type="submit"
                            value="Solicitar Viagem"
                            className="cursor-pointer w-full p-2 bg-red-600 rounded font-medium text-white"
                        />
                        <button
                            type="button" 
                            onClick={handleViewHistory}
                            className="cursor-pointer w-full p-2 bg-blue-600 rounded font-medium text-white"
                        >
                            Ver Histórico
                        </button>
                    </div>
                </form>

                {error && <p className="text-red-500">{error}</p>}
            </main>
        </div>
    );
};

export default RideRequestForm;