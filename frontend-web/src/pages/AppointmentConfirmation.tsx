// src/pages/AppointmentConfirmation.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppointmentSuccess } from '../components/appointment/AppointmentSuccess';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { appointmentService } from '../services/appointmentService';
import { useAppointment } from '../hooks/useAppointment';
import type { Appointment } from '../types/index';

export const AppointmentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppointment(); // ✅ Usar el hook para obtener el estado
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
            // ✅ Usar el appointmentId del contexto
      const appointmentId = state.appointmentId;

      if (!appointmentId) {
        setError('ID de cita no válido');
        setLoading(false);
        return;
      }

      try {
        console.log('📍 Buscando cita con ID:', appointmentId);
        const appointmentData = await appointmentService.getAppointment(appointmentId);
        console.log('📍 Cita encontrada:', appointmentData);
        
        setAppointment(appointmentData);
      } catch (err) {
        console.error('📍 Error fetching appointment:', err);
        setError('Error al cargar los detalles de la cita');

        // Fallback para desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('📍 Usando datos mock para desarrollo');
          const mockAppointment: Appointment = {
            id: appointmentId,
            clientName: state.appointmentData.clientInfo.name,
            clientEmail: state.appointmentData.clientInfo.email,
            clientPhone: state.appointmentData.clientInfo.phone,
            professionalId: state.appointmentData.professionalId,
            branchId: state.appointmentData.branchId,
            date: state.appointmentData.date,
            startTime: state.appointmentData.time,
            endTime: state.appointmentData.time,
            status: 'confirmed'
          };
          setAppointment(mockAppointment);
          setError(null);
        }

      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [state.appointmentId, state.appointmentData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">
            {error || 'No se pudo encontrar la cita'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const appointmentDetails = {
    clientName: appointment.clientName,
    date: appointment.date,
    time: appointment.startTime,
    professionalName: 'Dr. Carlos Rodríguez', // En real, buscarías el nombre del profesional
    branchName: 'Sucursal Centro', // En real, buscarías el nombre de la sucursal
    amount: appointment.amount
  };

  return (
    <AppointmentSuccess // ✅ Usar el nuevo componente
      appointmentId={appointment.id || appointment._id || 'N/A'}
      appointmentDetails={appointmentDetails}
    />
  );
};