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
  const { state, actions } = useAppointment(); // ✅ Usar el hook para obtener el estado, ✅ Obtener actions también
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professionalName, setProfessionalName] = useState<string>();
  const [branchName, setBranchName] = useState<string>();
  const [professionalSpeciality, setProfessionalSpecialty] = useState<string>();
  const [branchAdress, setBranchAdress] = useState<string>();
  

  setProfessionalSpecialty

    // ✅ Función para limpiar y empezar nueva cita
  const handleNewAppointment = () => {
    console.log('📍 Limpiando datos para nueva cita...');
    actions.resetAppointment(); // ✅ Limpiar el estado
    navigate('/reservar'); // ✅ Navegar al inicio del flujo
  };

  const getJsonDataFromObject = (jsonString: any): any => {
    try {
      const obj = JSON.parse(JSON.stringify(jsonString)); 
      return obj
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return { name: 'Error parsing JSON' };
    }
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      // ✅ Usando el appointmentId del contexto
      const appointmentId = state.appointmentId;

      if (!appointmentId) {
        setError('ID de cita no válido');
        setLoading(false);
        return;
      }

      try {
        const appointmentData = await appointmentService.getAppointment(appointmentId);
        setAppointment(appointmentData);
        const datosBranch = getJsonDataFromObject(appointmentData.branchId);
        const datosProfessional = getJsonDataFromObject(appointmentData.professionalId);
        setBranchName(datosBranch.name);
        setBranchAdress(datosBranch.address);
        setProfessionalName(datosProfessional.name);
        setProfessionalSpecialty(datosProfessional.specialty);
        setError(null);

      } catch (err) {
        console.error('📍 Error fetching appointment:', err);
        setError('Error al cargar los detalles de la cita');
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
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleNewAppointment}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nueva Cita
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const appointmentDetails = {
    clientName: appointment.clientName,
    date: appointment.date,
    time: appointment.startTime,
    professionalName: professionalName??"Nombre no disponible", // por si no llega el nombre
    branchName: branchName??"Nombre no disponible", // igual que el de arriba
    branchAdress: branchAdress??"Dirección no disponible",
    professionalSpeciality: professionalSpeciality??"Especialidad no disponible",
    amount: appointment.amount
  };

  return (
    <AppointmentSuccess // ✅ Usar el nuevo componente
      appointmentId={appointment.id || appointment._id || 'N/A'}
      appointmentDetails={appointmentDetails}
      onNewAppointment={handleNewAppointment} // ✅ Pasar el callback
    />
  );
};