// src/components/appointment/AppointmentSummary.tsx
import React from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import { Button } from '../common/Button';
import { MapPin, Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

export const AppointmentSummary: React.FC = () => {
  const { state, actions } = useAppointment();

  console.log('📍 AppointmentSummary - Estado completo:', state);
  console.log('📍 AppointmentSummary - Provincias:', state.provinces);
  console.log('📍 AppointmentSummary - Branches:', state.branches);
  console.log('📍 AppointmentSummary - Professionals:', state.professionals);
  console.log('📍 AppointmentSummary - AppointmentData:', state.appointmentData);

  // TODO:En una implementación real, estos datos vendrían de APIs
  const getCurrentProvince = () => {
     const province = state.provinces.find(p => p.id === state.appointmentData.provinceId || p._id === state.appointmentData.provinceId);
    console.log('📍 Provincia encontrada:', province);
    return province;
  };

  const getCurrentBranch = () => {
    const branch = state.branches.find(b => b.id === state.appointmentData.branchId || b._id === state.appointmentData.branchId);
    console.log('📍 Sucursal encontrada:', branch);
    return branch;
  };

  const getCurrentProfessional = () => {
    const professional = state.professionals.find(p => p.id === state.appointmentData.professionalId || p._id === state.appointmentData.professionalId);
    console.log('📍 Profesional encontrado:', professional);
    return professional;
  };

  const handleConfirm = async () => {
    try {
      // ✅ Crear la cita directamente sin proceso de pago
      await actions.createAppointment();
      actions.nextStep(); // Ir a la página de confirmación
    } catch (error) {
      console.error('Error al confirmar cita:', error);
      // Manejar error (podrías mostrar un toast o mensaje de error)
    }
  };

  const handleBack = () => {
    actions.prevStep();
  };

  const handleEditStep = (step: number) => {
    actions.setStep(step);
  };

  const province = getCurrentProvince();
  const branch = getCurrentBranch();
  const professional = getCurrentProfessional();

    // ✅ Si no hay datos, mostrar mensaje
  if (!province || !branch || !professional) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resumen de tu Cita
          </h1>
          <p className="text-gray-600">
            Revisa los detalles de tu reserva antes de confirmar
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ Datos Incompletos
          </h3>
          <p className="text-yellow-700">
            No se pudieron cargar todos los datos de la cita. Por favor, vuelve atrás y completa los pasos nuevamente.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={handleBack}>
              Volver Atrás
            </Button>
          </div>
        </div>
      </div>
    );
  }

    if (state.loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Cargando resumen...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resumen de tu Cita
        </h1>
        <p className="text-gray-600">
          Revisa los detalles de tu reserva antes de confirmar
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {/* Información de Ubicación */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditStep(1)}
            >
              Cambiar
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">{province?.name}</p>
                <p className="text-sm text-gray-600">{branch?.name}</p>
                <p className="text-sm text-gray-600">{branch?.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Profesional */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Profesional</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditStep(3)}
            >
              Cambiar
            </Button>
          </div>
          <div className="flex items-center text-gray-700">
            <User className="w-5 h-5 mr-3 text-gray-400" />
            <div>
              <p className="font-medium">{professional?.name}</p>
              <p className="text-sm text-gray-600">{professional?.specialty}</p>
            </div>
          </div>
        </div>

        {/* Información de Fecha y Hora */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fecha y Hora</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditStep(4)}
            >
              Cambiar
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">Fecha</p>
                <p className="text-sm text-gray-600">
                  {formatDate(state.appointmentData.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">Hora</p>
                <p className="text-sm text-gray-600">{state.appointmentData.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Cliente */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tus Datos</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditStep(6)}
            >
              Cambiar
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-700">
              <User className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">Nombre</p>
                <p className="text-sm text-gray-600">{state.appointmentData.clientInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">{state.appointmentData.clientInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-sm text-gray-600">{state.appointmentData.clientInfo.phone}</p>
              </div>
            </div>
            {state.appointmentData.clientInfo.notes && (
              <div className="md:col-span-2">
                <p className="font-medium text-gray-700 mb-1">Notas adicionales</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {state.appointmentData.clientInfo.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          Volver
        </Button>
        <Button onClick={handleConfirm}>
          Confirmar Cita
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          📧 Al confirmar, recibirás un email con los detalles de tu cita.
        </p>
      </div>
    </div>
  );
};