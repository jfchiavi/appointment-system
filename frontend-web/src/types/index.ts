// src/types/index.ts
export interface Province {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Branch {
  id: string;
  name: string;
  provinceId: string;
  address: string;
  phone: string;
  email: string;
  businessHours: BusinessHours[];
  isActive: boolean;
}

export interface BusinessHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  branchId: string;
  workingHours: WorkingHours[];
  appointmentDuration: number;
  isActive: boolean;
}

export interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  professionalId: string;
  branchId: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}

export interface AppointmentData {
  provinceId: string;
  branchId: string;
  professionalId: string;
  date: string;
  time: string;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}