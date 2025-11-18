// database/init.ts
import {connectDatabase} from '../config/database.ts';
import {Province} from '../models/Province.ts';
import { Branch } from '../models/Branch.ts';
import { Professional } from '../models/Professional.ts';
import { SystemConfig } from '../models/SystemConfig.ts'; 


export const initializeDatabase = async (): Promise<void> => {
  await connectDatabase();
   
  // Insertar datos iniciales
  await seedInitialData();
  
  console.log('✅ Base de datos inicializada correctamente');
};


const seedInitialData = async (): Promise<void> => {
  try {
    // Verificar si ya existen datos
    const provinceCount = await Province.countDocuments();
    if (provinceCount > 0) {
      console.log('⚠️  La base de datos ya tiene datos, omitiendo inserción inicial');
      return;
    }

    console.log('🌱 Insertando datos iniciales con Mongoose...');

    // Insertar provincias
    const provinces = await Province.insertMany([
      { name: 'Buenos Aires', isActive: true },
      { name: 'Córdoba', isActive: true },
      { name: 'Santa Fe', isActive: true },
      { name: 'Mendoza', isActive: true },
      { name: 'Tucumán', isActive: true },
      { name: 'Entre Ríos', isActive: true },
      { name: 'Salta', isActive: true },
      { name: 'Misiones', isActive: true },
      { name: 'Chaco', isActive: true },
      { name: 'Corrientes', isActive: true }
    ]);
    console.log(`✅ ${provinces.length} provincias insertadas`);

    // Obtener IDs de provincias insertadas
    const buenosAires = provinces.find(p => p.name === 'Buenos Aires');
    const cordoba = provinces.find(p => p.name === 'Córdoba');

    if (!buenosAires || !cordoba) {
      throw new Error('No se pudieron encontrar las provincias insertadas');
    }

    // Insertar sucursales
    const branches = await Branch.insertMany([
      {
        name: 'Sucursal Microcentro',
        provinceId: buenosAires._id,
        address: 'Av. Corrientes 1234, CABA',
        phone: '+54 11 1234-5678',
        email: 'microcentro@clinica.com',
        businessHours: [
          { dayOfWeek: 1, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 2, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 3, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 4, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 5, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 6, openTime: '09:00', closeTime: '14:00', isClosed: false },
          { dayOfWeek: 0, openTime: '09:00', closeTime: '13:00', isClosed: false }
        ],
        isActive: true
      },
      {
        name: 'Sucursal Palermo',
        provinceId: buenosAires._id,
        address: 'Av. Santa Fe 3456, CABA',
        phone: '+54 11 2345-6789',
        email: 'palermo@clinica.com',
        businessHours: [
          { dayOfWeek: 1, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 2, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 3, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 4, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 5, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 6, openTime: '09:00', closeTime: '13:00', isClosed: false },
          { dayOfWeek: 0, openTime: '09:00', closeTime: '13:00', isClosed: true }
        ],
        isActive: true
      },
      {
        name: 'Sucursal Córdoba Centro',
        provinceId: cordoba._id,
        address: 'Av. Colón 1234, Córdoba',
        phone: '+54 351 456-7890',
        email: 'cordoba@clinica.com',
        businessHours: [
          { dayOfWeek: 1, openTime: '08:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 2, openTime: '08:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 3, openTime: '08:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 4, openTime: '08:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 5, openTime: '08:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 6, openTime: '08:00', closeTime: '12:00', isClosed: false },
          { dayOfWeek: 0, openTime: '08:00', closeTime: '12:00', isClosed: true }
        ],
        isActive: true
      }
    ]);
    console.log(`✅ ${branches.length} sucursales insertadas`);

    // Obtener IDs de sucursales
    const microcentro = branches.find(b => b.name === 'Sucursal Microcentro');
    const palermo = branches.find(b => b.name === 'Sucursal Palermo');
    const cordobaCentro = branches.find(b => b.name === 'Sucursal Córdoba Centro');

    if (!microcentro || !palermo || !cordobaCentro) {
      throw new Error('No se pudieron encontrar las sucursales insertadas');
    }

    // Insertar profesionales
    const professionals = await Professional.insertMany([
      {
        name: 'Dr. Carlos Rodríguez',
        email: 'carlos.rodriguez@clinica.com',
        phone: '+54 11 3456-7890',
        specialty: 'Cardiología',
        branchId: microcentro._id,
        workingHours: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '14:00' }
        ],
        appointmentDuration: 30,
        isActive: true
      },
      {
        name: 'Dra. María González',
        email: 'maria.gonzalez@clinica.com',
        phone: '+54 11 4567-8901',
        specialty: 'Dermatología',
        branchId: microcentro._id,
        workingHours: [
          { dayOfWeek: 1, startTime: '10:00', endTime: '18:00', breakStart: '14:00', breakEnd: '15:00' },
          { dayOfWeek: 2, startTime: '10:00', endTime: '18:00', breakStart: '14:00', breakEnd: '15:00' },
          { dayOfWeek: 4, startTime: '10:00', endTime: '18:00', breakStart: '14:00', breakEnd: '15:00' },
          { dayOfWeek: 5, startTime: '10:00', endTime: '18:00', breakStart: '14:00', breakEnd: '15:00' }
        ],
        appointmentDuration: 30,
        isActive: true
      },
      {
        name: 'Dr. Roberto Sánchez',
        email: 'roberto.sanchez@clinica.com',
        phone: '+54 11 5678-9012',
        specialty: 'Pediatría',
        branchId: palermo._id,
        workingHours: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '16:00', breakStart: '12:00', breakEnd: '13:00' },
          { dayOfWeek: 3, startTime: '08:00', endTime: '16:00', breakStart: '12:00', breakEnd: '13:00' },
          { dayOfWeek: 5, startTime: '08:00', endTime: '16:00', breakStart: '12:00', breakEnd: '13:00' }
        ],
        appointmentDuration: 30,
        isActive: true
      }
    ]);
    console.log(`✅ ${professionals.length} profesionales insertados`);

    // Insertar configuración del sistema
    const systemConfigs = await SystemConfig.insertMany([
      {
        configKey: 'appointment_advance_days',
        configValue: '30',
        description: 'Días de anticipación para reservar citas'
      },
      {
        configKey: 'cancellation_hours',
        configValue: '24',
        description: 'Horas de anticipación para cancelar sin cargo'
      },
      {
        configKey: 'default_appointment_duration',
        configValue: '30',
        description: 'Duración por defecto de las citas en minutos'
      },
      {
        configKey: 'max_appointments_per_day',
        configValue: '8',
        description: 'Máximo de citas por día por profesional'
      },
      {
        configKey: 'payment_required',
        configValue: 'true',
        description: 'Si se requiere pago para confirmar la cita'
      },
      {
        configKey: 'default_appointment_amount',
        configValue: '50.00',
        description: 'Monto por defecto para las citas'
      }
    ]);
    console.log(`✅ ${systemConfigs.length} configuraciones del sistema insertadas`);

    console.log('🎉 Base de datos inicializada exitosamente con Mongoose');
  } catch (error) {
    console.error('❌ Error insertando datos iniciales:', error);
    throw error;
  }
};

// Script ejecutable independiente
const runSeedsAsScript = async () => {
  try {
    // La conexión ya debe estar establecida desde app.ts
    // Si ejecutas esto independientemente, necesitarías conectar aquí
    await initializeDatabase();
    console.log('✅ Script de inicialización completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en script de inicialización:', error);
    process.exit(1);
  }
};

console.log('✅ Ejecutando runAsScript()');
runSeedsAsScript();
