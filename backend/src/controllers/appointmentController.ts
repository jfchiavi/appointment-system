// controllers/appointmentController.ts
import type { Request, Response } from 'express';
import { Appointment } from '../models/Appointment.ts';
import { Professional } from '../models/Professional.ts';
import { AvailabilityService } from '../services/availabilityService.ts';
import { PaymentService } from '../services/paymentService.ts';
import { EmailService } from '../services/emailService.ts';

const availabilityService = new AvailabilityService();
const paymentService = new PaymentService();
const emailService = new EmailService();

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { professionalId, date } = req.params;
    
    // Verificar que el profesional existe
    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: 'Profesional no encontrado'
      });
    }
    console.log("TODO: AppointmentController.getAvailableSlots - Date param:", date);
    const availableSlots = await availabilityService.getAvailableSlots(
      professional.id, 
      date?"":""
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
      status: 'pending'
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

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { paymentMethodId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'La cita ya fue pagada'
      });
    }

    // Procesar pago con Stripe
    const paymentResult = await paymentService.processPayment(
      appointment.amount,
      paymentMethodId,
      `Pago cita ${appointmentId}`
    );

    if (paymentResult.success) {
      // Actualizar estado de la cita con Mongoose
      appointment.paymentStatus = 'paid';
      appointment.status = 'confirmed';
      appointment.stripePaymentIntentId = paymentResult.paymentIntentId;
      await appointment.save();

      // Populate para obtener datos completos
      await appointment.populate([
        {
          path: 'professionalId',
          select: 'name specialty'
        },
        {
          path: 'branchId',
          select: 'name address'
        }
      ]);

      // Enviar email de confirmación de pago
      await emailService.sendPaymentConfirmation(appointment);

      res.json({
        success: true,
        data: {
          appointment,
          paymentIntent: paymentResult.paymentIntent
        },
        message: 'Pago procesado exitosamente'
      });
    } else {
      appointment.paymentStatus = 'failed';
      await appointment.save();

      res.status(400).json({
        success: false,
        message: 'Error en el pago',
        error: paymentResult.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al procesar pago',
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