// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './environment.ts';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.uri);
    console.log('✅ Conectado a la base de datos MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

// Manejo de eventos de conexión
mongoose.connection.on('disconnected', () => {
  console.log('🔌 Desconectado de la base de datos');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Error de base de datos:', error);
});