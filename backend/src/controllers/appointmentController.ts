// src/controllers/appointmentController.ts
import type { Request, Response } from 'express';
import { Appointment } from '../models/Appointment.ts';
import { AvailabilityService } from '../services/availabilityService.ts';
import { PaymentService } from '../services/paymentService.ts';
import { EmailService } from '../services/emailService.ts';

const availabilityService = new AvailabilityService();
const paymentService = new PaymentService();
const emailService = new EmailService();

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { professionalId, date } = req.params;
    
    const availableSlots = await availabilityService.getAvailableSlots(
      professionalId??"", 
      date??""
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

    // Crear cita
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

    // Enviar email de confirmación de forma asíncrona para no bloquear la respuesta
    emailService.sendAppointmentConfirmation(appointment).catch((emailError) => {
      console.error('Error al enviar email de confirmación de cita:', emailError);
      // TODO: Implementar sistema de reintento o notificación de fallos de email
    });

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
  return;
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
      // Actualizar estado de la cita
      appointment.paymentStatus = 'paid';
      appointment.status = 'confirmed';
      appointment.stripePaymentIntentId = paymentResult.paymentIntentId ?? "";
      await appointment.save();

      // Enviar email de confirmación de pago de forma asíncrona para no bloquear la respuesta
      emailService.sendPaymentConfirmation(appointment).catch((emailError) => {
        console.error('Error al enviar email de confirmación de pago:', emailError);
        // TODO: Implementar sistema de reintento o notificación de fallos de email
      });

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
  return;
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
      res.status(400).json({
        success: false,
        message: 'La cita ya fue cancelada'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Enviar email de cancelación de forma asíncrona para no bloquear la respuesta
    emailService.sendAppointmentCancellation(appointment, reason).catch((emailError) => {
      console.error('Error al enviar email de cancelación de cita:', emailError);
      // TODO: Implementar sistema de reintento o notificación de fallos de email
    });

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
  return;
};