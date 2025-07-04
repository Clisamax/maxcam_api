import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { config } from 'dotenv';
import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import { Routes } from './routes/@routes';


config();

export const fast: FastifyInstance = fastify({ logger: true });

const PORT = process.env.PORT;

// habilitar qual front pode acessar
fast.register(fastifyCors, {
	origin: true, // permite todas as origens
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	credentials: true
})

// Registrar JWT antes das rotas
fast.register(fastifyJwt, {
	secret: process.env.JWT_SECRET || 'default_secret'
})

// Health check endpoint
fast.get('/health', async (request, reply) => {
	return { status: 'ok', timestamp: new Date().toISOString() };
});

// Registrar todas as rotas sem prefix
fast.register(Routes)

const start = async () => {
	try {
		const address = await fast.listen({
			host: '0.0.0.0',
			port: typeof PORT === 'string' ? Number(PORT) : 3336
		});
		console.log(`server is listening on ${address}`);
	}
	catch (err) {
		console.log('Error starting server:', err)
		process.exit(1)
	}
}

start()

