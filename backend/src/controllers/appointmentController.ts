// controllers/appointmentController.ts
import type { Request, Response } from 'express';
import { Appointment } from '../models/Appointment.ts';
import { Professional } from '../models/Professional.ts';
import { AvailabilityService } from '../services/availabilityService.ts';
import { EmailService } from '../services/emailService.ts';

const availabilityService = new AvailabilityService();

const emailService = new EmailService();

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { professionalId, date } = req.params;
   
    // ✅ VALIDAR que los parámetros no sean undefined
    if (!professionalId || !date) {
      return res.status(400).json({
        success: false,
        message: 'professionalId y date son requeridos'
      });
    }

    // Verificar que el profesional existe
    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Profesional no encontrado'
      });
    }

    const availableSlots = await availabilityService.getAvailableSlots(
      professional.id, 
      date // ✅ Ahora es string, no undefined
    );
    
    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener horarios disponibles',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      professionalId,
      branchId,
      date,
      startTime,
      endTime,
      amount,
      notes
    } = req.body;

    // Verificar disponibilidad
    const isAvailable = await availabilityService.isTimeSlotAvailable(
      professionalId,
      date,
      startTime,
      endTime
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'El horario seleccionado ya no está disponible'
      });
    }

    // Crear cita con Mongoose
    const appointment = new Appointment({
      clientName,
      clientEmail,
      clientPhone,
      professionalId,
      branchId,
      date,
      startTime,
      endTime,
      amount,
      notes,
      status: 'confirmed'
    });

    await appointment.save();

    // Populate para obtener datos relacionados
    await appointment.populate([
      {
        path: 'professionalId',
        select: 'name specialty'
      },
      {
        path: 'branchId',
        select: 'name address',
        populate: {
          path: 'provinceId',
          select: 'name'
        }
      }
    ]);

    // Enviar email de confirmación
    await emailService.sendAppointmentConfirmation(appointment);

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Cita creada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear cita',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'La cita ya fue cancelada'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Populate para obtener datos del cliente y profesional
    await appointment.populate([
      {
        path: 'professionalId',
        select: 'name'
      },
      {
        path: 'branchId',
        select: 'name'
      }
    ]);

    // Enviar email de cancelación
    await emailService.sendAppointmentCancellation(appointment, reason);

    res.json({
      success: true,
      message: 'Cita cancelada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar cita',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getAppointmentDetails = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    
    // ✅ Validar appointmentId
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'appointmentId es requerido'
      });
    }

    console.log('📍 getAppointmentDetails - appointmentId:', appointmentId);

    const appointment = await Appointment.findById(appointmentId)
      .populate([
        {
          path: 'professionalId',
          select: 'name specialty email phone'
        },
        {
          path: 'branchId',
          select: 'name address phone email',
          populate: {
            path: 'provinceId',
            select: 'name'
          }
        }
      ]);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener detalles de la cita',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};