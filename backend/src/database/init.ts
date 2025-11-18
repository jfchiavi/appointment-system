import { connectDatabase, disconnectDatabase } from '../config/database.ts';
import { Province } from '../models/Province.ts';
import { Branch } from '../models/Branch.ts';
import { Professional } from '../models/Professional.ts';
import { SystemConfig } from '../models/SystemConfig.ts';
import { Appointment } from '../models/Appointment.ts';

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando INIT de la base de datos...');
    await connectDatabase();
    // Con Mongoose, los índices se crean automáticamente basados en los schemas
    // Pero podemos forzar la creación si es necesario
    console.log("Intentado crear Indices")
    await createIndexes();
    
    console.log('✅ Base de datos inicializada correctamente con Mongoose');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    // Mongoose crea automáticamente los índices definidos en los schemas
    // Pero podemos forzar la creación sincrónica si es necesario
    await Province.syncIndexes();
    await Branch.syncIndexes();
    await Professional.syncIndexes();
    await Appointment.syncIndexes();
    await SystemConfig.syncIndexes();
    
    console.log('✅ Índices de Mongoose sincronizados');
  } catch (error) {
    console.error('❌ Error sincronizando índices:', error);
    throw error;
  }
  console.log('✅ Ejecutando disconnectDatabase()');  
  disconnectDatabase();
};

console.log('✅ Ejecutando initializeDatabase()');
initializeDatabase();