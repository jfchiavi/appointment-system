// src/components/payment/PaymentForm.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAppointment } from '../../hooks/useAppointment';
import { appointmentService } from '../../services/appointmentService';
import { StripeElements } from './StripeElements.tsx';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key');

export const PaymentForm: React.FC = () => {
  const { state, actions } = useAppointment();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    actions.prevStep();
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Primero crear la cita
      const appointment = await appointmentService.createAppointment({
        clientName: state.appointmentData.clientInfo.name,
        clientEmail: state.appointmentData.clientInfo.email,
        clientPhone: state.appointmentData.clientInfo.phone,
        professionalId: state.appointmentData.professionalId,
        branchId: state.appointmentData.branchId,
        date: state.appointmentData.date,
        startTime: state.appointmentData.time,
        endTime: state.appointmentData.time, // En una implementación real, calcular endTime
        amount: 50, // Monto fijo por ahora
        notes: state.appointmentData.clientInfo.notes,
      });

      // Luego procesar el pago
      await appointmentService.processPayment(appointment.id!, paymentMethodId);
      
      // Redirigir a página de éxito
      window.location.href = `/appointment-confirmation/${appointment.id}`;
      
    } catch (err) {
      setError('Error al procesar el pago. Por favor, intenta nuevamente.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Procesando pago...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pago de Reserva
        </h1>
        <p className="text-gray-600">
          Completa el pago para confirmar tu cita
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Resumen de la cita</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Fecha:</strong> {new Date(state.appointmentData.date).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {state.appointmentData.time}</p>
          <p><strong>Monto de reserva:</strong> $50</p>
        </div>
      </div>

      <Elements stripe={stripePromise}>
        <StripeElements onPaymentSuccess={handlePaymentSuccess} />
      </Elements>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          Volver
        </Button>
      </div>
    </div>
  );
};