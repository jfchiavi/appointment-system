// components/appointment/AppointmentSuccess.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { CheckCircle, Calendar, MapPin, User } from 'lucide-react';

interface AppointmentSuccessProps {
  appointmentId: string;
  appointmentDetails: {
    clientName: string;
    date: string;
    time: string;
    professionalName: string;
    branchName: string;
    amount?: number;
  };
  onNewAppointment?: () => void; // ✅ Nueva prop para callback
}

export const AppointmentSuccess: React.FC<AppointmentSuccessProps> = ({
  appointmentId,
  appointmentDetails,
  onNewAppointment // ✅ Recibir callback
}) => {
  const navigate = useNavigate();

  const handleNewAppointment = () => {
    console.log('Iniciando nueva cita onNewAppointment...', onNewAppointment);
    if (onNewAppointment) {
      // ✅ Si hay callback, usarlo
      onNewAppointment();
    } else {  
      // ✅ Fallback: navegar directamente
      navigate('/reservar');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const formattedDate = new Date(appointmentDetails.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        {/* Icono de éxito */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Cita Confirmada!
          </h1>
          <p className="text-gray-600">
            Tu cita ha sido agendada exitosamente
          </p>
        </div>

        {/* Detalles de la cita */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles de tu cita
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Número de reserva:</span>
              <span className="font-mono font-medium">{appointmentId}</span>
            </div>
            
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Paciente:</span>
              <span className="font-medium ml-2">{appointmentDetails.clientName}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium ml-2">{formattedDate}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Hora:</span>
              <span className="font-medium ml-2">{appointmentDetails.time}</span>
            </div>
            
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Profesional:</span>
              <span className="font-medium ml-2">{appointmentDetails.professionalName}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Sucursal:</span>
              <span className="font-medium ml-2">{appointmentDetails.branchName}</span>
            </div>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Recordatorios importantes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Llega 15 minutos antes de tu cita</li>
            <li>• Trae tu identificación oficial</li>
            <li>• Cancela con 24 horas de anticipación si no puedes asistir</li>
            <li>• Recibirás un recordatorio por email 24 horas antes</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleNewAppointment}
            className="flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
          
          <Button
            variant="outline"
            onClick={handleBackToHome}
          >
            Volver al Inicio
          </Button>
        </div>

        {/* Información de contacto */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            ¿Tienes preguntas?{' '}
            <a href="mailto:soporte@turnos.com" className="text-blue-600 hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};