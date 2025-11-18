// services/availabilityService.ts (Versión más robusta)
import { Professional } from '../models/Professional.ts';
import { Appointment } from '../models/Appointment.ts';
import moment from 'moment';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart?: string | null;
  breakEnd?: string | null;
}

export class AvailabilityService {
  async getAvailableSlots(professionalId: string, date: string): Promise<TimeSlot[]> {
    const professional = await Professional.findById(professionalId);
    
    if (!professional) {
      throw new Error('Profesional no encontrado');
    }

    const targetDate = moment(date);
    const dayOfWeek = targetDate.day();

    // Obtener horario del profesional para ese día con tipado explícito
    const daySchedule = professional.workingHours.find(
      (wh: WorkingHours) => wh.dayOfWeek === dayOfWeek
    );

    if (!daySchedule || !daySchedule.startTime) {
      return [];
    }

    // Obtener citas existentes
    const existingAppointments = await Appointment.find({
      professionalId,
      date: targetDate.toDate(),
      status: { $in: ['pending', 'confirmed'] }
    });

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
    breakStart?: string | null,
    breakEnd?: string | null
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');
    
    // Función helper para crear moment objects de forma segura
    const createMoment = (timeString: string | null | undefined): moment.Moment | null => {
      if (!timeString) return null;
      return moment(timeString, 'HH:mm');
    };
    
    const breakStartMoment = createMoment(breakStart);
    const breakEndMoment = createMoment(breakEnd);

    let currentTime = start.clone();

    while (currentTime < end) {
      const slotEnd = currentTime.clone().add(duration, 'minutes');
      
      // Verificar si el slot está dentro del horario de break
      const isDuringBreak = this.isDuringBreak(currentTime, slotEnd, breakStartMoment, breakEndMoment);

      if (!isDuringBreak && slotEnd <= end) {
        const slotStartStr = currentTime.format('HH:mm');
        const slotEndStr = slotEnd.format('HH:mm');

        const isOccupied = this.isSlotOccupied(currentTime, slotEnd, existingAppointments);

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

  private isDuringBreak(
    slotStart: moment.Moment,
    slotEnd: moment.Moment,
    breakStart: moment.Moment | null,
    breakEnd: moment.Moment | null
  ): boolean {
    if (!breakStart || !breakEnd) return false;
    
    return slotStart < breakEnd && slotEnd > breakStart;
  }

  private isSlotOccupied(
    slotStart: moment.Moment,
    slotEnd: moment.Moment,
    existingAppointments: any[]
  ): boolean {
    return existingAppointments.some(appointment => {
      const appStart = moment(appointment.startTime, 'HH:mm');
      const appEnd = moment(appointment.endTime, 'HH:mm');
      return slotStart < appEnd && slotEnd > appStart;
    });
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

  async getProfessionalWorkingHours(professionalId: string, date: string) {
    const professional = await Professional.findById(professionalId);
    if (!professional) return null;

    const targetDate = moment(date);
    const dayOfWeek = targetDate.day();

    return professional.workingHours.find((wh: WorkingHours) => wh.dayOfWeek === dayOfWeek);
  }
}