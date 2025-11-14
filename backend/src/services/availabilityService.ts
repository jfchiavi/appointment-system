// src/services/availabilityService.ts
import { Professional } from '../models/Professional.ts';
import { Appointment } from '../models/Appointment.ts';
import moment from 'moment';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export class AvailabilityService {
  async getAvailableSlots(professionalId: string, date: string): Promise<TimeSlot[]> {
    const professional = await Professional.findById(professionalId);
    
    if (!professional) {
      throw new Error('Profesional no encontrado');
    }

    const targetDate = moment(date);
    const dayOfWeek = targetDate.day(); // 0: Domingo, 1: Lunes, etc.

    // Obtener horario del profesional para ese día
    const daySchedule = professional.workingHours.find(
      wh => wh.dayOfWeek === dayOfWeek
    );

    if (!daySchedule || !daySchedule.startTime) {
      return []; // No trabaja ese día
    }

    // Obtener citas existentes para esa fecha
    const existingAppointments = await Appointment.find({
      professionalId,
      date: targetDate.toDate(),
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generar slots disponibles
    return this.generateTimeSlots(
      daySchedule.startTime,
      daySchedule.endTime,
      professional.appointmentDuration,
      existingAppointments,
      daySchedule.breakStart,
      daySchedule.breakEnd
    );
  }

  private generateTimeSlots(
    startTime: string,
    endTime: string,
    duration: number,
    existingAppointments: any[],
    breakStart?: string,
    breakEnd?: string
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');
    const breakStartMoment = breakStart ? moment(breakStart, 'HH:mm') : null;
    const breakEndMoment = breakEnd ? moment(breakEnd, 'HH:mm') : null;

    let currentTime = start.clone();

    while (currentTime < end) {
      const slotEnd = currentTime.clone().add(duration, 'minutes');
      
      // Verificar si el slot está dentro del horario de break
      const isDuringBreak = breakStartMoment && breakEndMoment &&
        currentTime < breakEndMoment && slotEnd > breakStartMoment;

      if (!isDuringBreak && slotEnd <= end) {
        const slotStartStr = currentTime.format('HH:mm');
        const slotEndStr = slotEnd.format('HH:mm');

        // Verificar si el slot está ocupado
        const isOccupied = existingAppointments.some(appointment => {
          const appStart = moment(appointment.startTime, 'HH:mm');
          const appEnd = moment(appointment.endTime, 'HH:mm');
          return currentTime < appEnd && slotEnd > appStart;
        });

        slots.push({
          startTime: slotStartStr,
          endTime: slotEndStr,
          isAvailable: !isOccupied
        });
      }

      currentTime.add(duration, 'minutes');
    }

    return slots;
  }

  async isTimeSlotAvailable(
    professionalId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const existingAppointment = await Appointment.findOne({
      professionalId,
      date: new Date(date),
      startTime,
      endTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    return !existingAppointment;
  }
}