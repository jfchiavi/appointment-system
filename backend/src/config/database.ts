// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './environment.ts';

export const connectDatabase = async (): Promise<void> => {
  try {
      // Configurar Mongoose para evitar warnings
      mongoose.set('strictQuery', true);
      mongoose.set('bufferCommands', false);
    
      await mongoose.connect(config.database.uri, {
        // Opciones para evitar warnings
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ Conectado a MongoDB con Mongoose');
  } catch (error) {
      console.error('❌ Error conectando a la base de datos:', error);
      process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};

// Manejo de eventos de conexión
mongoose.connection.on('disconnected', () => {
  console.log('🔌 Desconectado de la base de datos');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Error de base de datos:', error);
});