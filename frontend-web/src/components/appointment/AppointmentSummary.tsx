// src/components/appointment/AppointmentSummary.tsx
import React from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import { Button } from '../common/Button';
import { MapPin, Calendar, Clock, User, Mail, Phone } from 'lucide-react';

export const AppointmentSummary: React.FC = () => {
  const { state, actions } = useAppointment();

  // En una implementación real, estos datos vendrían de APIs
  const getCurrentProvince = () => {
    return state.provinces.find(p => p.id === state.appointmentData.provinceId);
  };

  const getCurrentBranch = () => {
    return state.branches.find(b => b.id === state.appointmentData.branchId);
  };

  const getCurrentProfessional = () => {
    return state.professionals.find(p => p.id === state.appointmentData.professionalId);
  };

  const handleConfirm = () => {
    actions.nextStep();
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
                  {new Date(state.appointmentData.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
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

        {/* Resumen de Pago */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Pago</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Costo de consulta</span>
              <span className="font-medium">$50.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impuestos</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-semibold">$50.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          Volver
        </Button>
        <Button onClick={handleConfirm}>
          Confirmar y Pagar
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          💡 Al confirmar, serás redirigido a nuestro sistema de pago seguro para completar la reserva.
        </p>
      </div>
    </div>
  );
};