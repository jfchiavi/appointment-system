// src/components/payment/PaymentSuccess.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { CheckCircle, Calendar, Download, Share2 } from 'lucide-react';
//import { CheckCircle, Calendar, Download, Mail, Share2 } from 'lucide-react'; TODO: revisar por que no se usa Mail

interface PaymentSuccessProps {
  appointmentId: string;
  appointmentDetails: {
    clientName: string;
    date: string;
    time: string;
    professionalName: string;
    branchName: string;
    amount: number;
  };
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  appointmentId,
  appointmentDetails
}) => {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    // En una implementación real, generarías un PDF
    console.log('Descargando comprobante...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Comprobante de Cita',
        text: `Mi cita para el ${appointmentDetails.date} a las ${appointmentDetails.time}`,
        url: window.location.href,
      });
    } else {
      // Fallback para copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleNewAppointment = () => {
    navigate('/reservar');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        {/* Icono de éxito */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pago Completado!
          </h1>
          <p className="text-gray-600">
            Tu cita ha sido confirmada y el pago procesado exitosamente
          </p>
        </div>

        {/* Detalles de la cita */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles de tu cita
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Número de reserva:</span>
              <span className="font-mono font-medium">{appointmentId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Paciente:</span>
              <span className="font-medium">{appointmentDetails.clientName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium">
                {new Date(appointmentDetails.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Hora:</span>
              <span className="font-medium">{appointmentDetails.time}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Profesional:</span>
              <span className="font-medium">{appointmentDetails.professionalName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Sucursal:</span>
              <span className="font-medium">{appointmentDetails.branchName}</span>
            </div>
            
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-gray-600">Monto pagado:</span>
              <span className="font-semibold text-lg">${appointmentDetails.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Comprobante
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
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

        {/* Botones de acción principal */}
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