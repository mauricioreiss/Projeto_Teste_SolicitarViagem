import fastify from "fastify";
import Cors from "@fastify/cors";
import {Routes} from "./routes";
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
dotenv.config();
const app = fastify();

async function seedMotoristas() {
  const motoristas = [
    {
        id: 1,
        nome: "Homer Simpson",
        descricao: "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
        carro: "Plymouth Valiant 1973 rosa e enferrujado",
        avaliacao: "2/5 Motorista simpático,mas errou o caminho 3 vezes. O carro cheira a donuts.",
        taxaKmMinima: 2.50,
        kmMinimo: 1.0,
    },
    {
        id: 2,
        nome: "Dominic Toretto",
        descricao: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
        carro: "Dodge Charger R/T 1970 modificado",
        avaliacao: "4/5 Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
        taxaKmMinima: 5.00,
        kmMinimo: 5.00,
    },
    { 
        id: 3,
        nome: "James Bond",
        descricao: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
        carro: "Aston Martin DB5 clássico",
        avaliacao: "5/5 Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
        taxaKmMinima: 10.00,
        kmMinimo: 10.00,
    },
];

  const existingMotoristas = await prisma.motorista.findMany();
  if (existingMotoristas.length === 0) {
    await prisma.motorista.createMany({
      data: motoristas,
    });
    console.log('Dados de seed inseridos no banco!');
  } else {
    console.log('Dados de seed já inseridos no banco. Ignorando operação.');
  }
}

const start = async () => {
    try {
      await seedMotoristas(); 
  
      await app.register(Cors);
      await app.register(Routes);
  
      await app.listen({ port: 3333 });
      console.log('Servidor ouvindo na porta 3333!');
    } catch (err) {
      console.error('Erro ao iniciar o servidor:', err);
      process.exit(1);
    }
  };
  
  start();