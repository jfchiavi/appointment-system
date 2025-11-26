// src/pages/AppointmentConfirmation.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PaymentSuccess } from '../components/payment/PaymentSuccess';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { appointmentService } from '../services/appointmentService'; //TODO: revisar ahora esta mockeado
import type { Appointment } from '../types/index';

export const AppointmentConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) {
        setError('ID de cita no válido');
        setLoading(false);
        return;
      }

      try {
        // TODO: En una implementación real, harías una llamada a la API
        const appointmentData = await appointmentService.getAppointment(id);
        console.log('📍 Cita encontrada:', appointmentData);
        
        // Simulamos datos de la cita
        // const mockAppointment: Appointment = {
        //   id: id,
        //   clientName: 'Juan Pérez',
        //   clientEmail: 'juan@example.com',
        //   clientPhone: '+1234567890',
        //   professionalId: 'prof-123',
        //   branchId: 'branch-123',
        //   date: new Date().toISOString(),
        //   startTime: '14:00',
        //   endTime: '14:30',
        //   amount: 50,
        //   status: 'confirmed',
        //   paymentStatus: 'paid'
        // };

        setAppointment(appointmentData);
      } catch (err) {
        console.error('📍 Error fetching appointment:', err);
        setError('Error al cargar los detalles de la cita');
        console.error('Error fetching appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

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
    <PaymentSuccess
      appointmentId={appointment.id!}
      appointmentDetails={appointmentDetails}
    />
  );
};