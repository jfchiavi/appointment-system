// src/services/appointmentService.ts
import { api } from './api';
import type { Province, Branch, Professional, TimeSlot, Appointment, ApiResponse } from '../types';


export const appointmentService = {
  // Provincias
  getProvinces: async (): Promise<Province[]> => {
    const response = await api.get<ApiResponse<Province[]>>('/provinces');
    return response.data.data;
  },

  // Sucursales
  getBranchesByProvince: async (provinceId: string): Promise<Branch[]> => {
    // ✅ Validar provinceId antes de hacer la llamada
    if (!provinceId || provinceId === 'undefined') {
      throw new Error('Province ID es requerido');
    }

    console.log('📍 appointmentService - getBranchesByProvince ID:', provinceId);
    
    const response = await api.get<ApiResponse<Branch[]>>(`/branches/province/${provinceId}`);
    return response.data.data;
  },

  getBranchDetails: async (branchId: string): Promise<Branch> => {
    const response = await api.get<ApiResponse<Branch>>(`/branches/${branchId}`);
    return response.data.data;
  },

  // Profesionales
  getProfessionalsByBranch: async (branchId: string): Promise<Professional[]> => {
    console.log('📍 appointmentService - getProfessionalsByBranch ID:', branchId);
    const response = await api.get<ApiResponse<Professional[]>>(`/professionals/branch/${branchId}`);
    return response.data.data;
  },

  getProfessionalDetails: async (professionalId: string): Promise<Professional> => {
    const response = await api.get<ApiResponse<Professional>>(`/professionals/${professionalId}`);
    return response.data.data;
  },

  // Disponibilidad
  getAvailableSlots: async (professionalId: string, date: string): Promise<TimeSlot[]> => {
    const response = await api.get<ApiResponse<TimeSlot[]>>(
      `/appointments/availability/${professionalId}/${date}`
    );
    return response.data.data;
  },

  // Citas
  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', appointment);
    return response.data.data;
  },

  processPayment: async (appointmentId: string, paymentMethodId: string): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(
      `/appointments/${appointmentId}/payment`,
      { paymentMethodId }
    );
    return response.data.data;
  },

  cancelAppointment: async (appointmentId: string, reason?: string): Promise<void> => {
    await api.put(`/appointments/${appointmentId}/cancel`, { reason });
  },
};