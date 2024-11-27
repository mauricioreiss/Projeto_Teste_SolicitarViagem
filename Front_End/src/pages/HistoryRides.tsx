import React, { useState, useEffect } from 'react';
import { Api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HistoryRides: React.FC = () => {
    const [drivers, setDrivers] = useState<Motorista[]>([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [trips, setTrips] = useState<Viagem[]>([]);
    const [customerId, setCustomerId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    interface Motorista {
        id: number;
        nome: string;
        descricao: string;
        carro: string;
        avaliacao: string;
        taxaKmMinima: number;
        kmMinimo: number;
    }

    interface Viagem {
        id: number;
        dataHora: string;
        motorista: Motorista;
        origem: string;
        destino: string;
        distancia: number;
        tempo: number;
        valor: number;
    }

    useEffect(() => {
        LoadDrivers();
    }, []);

    async function LoadDrivers() {
        try {
            const response = await Api.get("/motoristas");
            setDrivers(response.data);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar motoristas');
        }
    }

    async function LoadRides() {
        if (!customerId) {
            setError('ID do usuário não pode estar vazio.');
            return;
        }
        try {
            const response = await Api.get(`/ride/${customerId}`);
            setTrips(response.data.rides); // Certifique-se de que a estrutura da resposta esteja correta
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar viagens');
        }
    }

    const filteredDrivers = selectedDriver
        ? drivers.filter(driver => driver.id === Number(selectedDriver))
        : drivers;

    const filteredTrips = selectedDriver
        ? trips.filter(trip => trip.motorista.id === Number(selectedDriver))
        : trips;

    return (
        <div className="w-full min-h-screen bg-gray-700 flex justify-center px-4">
            <main className="my-10 w-full md:max-w-2xl">
                <h1 className="text-4xl font-medium text-white">Histórico de Viagens</h1>

                <div className="flex flex-col my-6">
                    <label className="font-medium text-white">ID do Usuário:</label>
                    <input
                        type="text"
                        className="w-full mb-5 p-2 rounded"
                        placeholder="Digite seu ID..."
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                    />
                    <label className="font-medium text-white">Selecionar Motorista:</label>
                    <select
                        className="w-full mb-5 p-2 rounded"
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                    >
                        <option value="">Todos os Motoristas</option>
                        {drivers.length > 0 ? (
                            drivers.map(driver => (
                                <option key={driver.id} value={driver.id}>
                                    {driver.nome}
                                </option>
                            ))
                        ) : (
                            <option value="">Nenhum motorista disponível</option>
                        )}
                    </select>
                    <button
                        className="cursor-pointer w-full p-2 bg-red-600 rounded font-medium text-white"
                        onClick={LoadRides} 
                    >
                        Carregar Viagens
                    </button>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <section className="mt-6">
                    <h2 className="text-2xl font-medium text-white">Viagens Realizadas:</h2>
                    <ul className="mt-4">
                        {filteredTrips.length > 0 ? (
                                filteredTrips.map((trip) => (
                                    <li key={trip.id} className="text-white mb-2">
                                        <p><strong>Data e Hora:</strong> {new Date(trip.dataHora).toLocaleString()}</p>
                                        <p><strong>Motorista:</strong> {trip.motorista.nome}</p>
                                        <p><strong>Descrição:</strong> {trip.motorista.descricao}</p>
                                        <p><strong>Avaliação:</strong> {trip.motorista.avaliacao}</p>
                                        <p><strong>Origem:</strong> {trip.origem}</p>
                                        <p><strong>Destino:</strong> {trip.destino}</p>
                                        <p><strong>Distância:</strong> {trip.distancia} km</p>
                                        <p><strong>Tempo:</strong> {trip.tempo} minutos</p>
                                        <p><strong>Valor:</strong> R$ {trip.valor.toFixed(2)}</p>
                                    </li>
                                ))
                            ) : (
                                <li className="text-white">Nenhuma viagem encontrada.</li>
                            )}
                    </ul>
                </section>

                <section className="flex flex-col gap-4 mt-6">
                    <h2 className="text-2xl font-medium text-white">Motoristas:</h2>
                    {filteredDrivers.length > 0 ? (
                        filteredDrivers.map(driver => (
                            <article key={driver.id} className="w-full bg-white rounded p-4 relative hover:scale-105 duration-200">
                                <p><span className="font-medium">Nome:</span> {driver.nome}</p>
                                <p><span className="font-medium">Descrição:</span> {driver.descricao}</p>
                                <p><span className="font-medium">Avaliação:</span> {driver.avaliacao}</p>
                                <p><span className="font-medium">Carro:</span> {driver.carro}</p>
                                <p><span className="font-medium">Taxa Km Mínima:</span> R$ {driver.taxaKmMinima.toFixed(2)}</p>
                                <p><span className="font-medium">Km Mínimo:</span> {driver.kmMinimo} km</p>
                            </article>
                        ))
                    ) : (
                        <article className="w-full bg-white rounded p-4">
                            <p className="text-center text-black">Nenhum motorista disponível.</p>
                        </article>
                    )}
                </section>

                <button
                    className="cursor-pointer w-full p-2 bg-blue-600 rounded font-medium text-white"
                    onClick={() => navigate('/')}
                >
                    Voltar
                </button>
            </main>
        </div>
    );
};

export default HistoryRides;