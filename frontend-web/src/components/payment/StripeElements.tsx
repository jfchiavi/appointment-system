import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Shield, CreditCard, Lock } from 'lucide-react';

interface StripeElementsProps {
  onPaymentSuccess: (paymentMethodId: string) => void;
}

export const StripeElements: React.FC<StripeElementsProps> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Error al procesar la tarjeta');
        setLoading(false);
        return;
      }

      const { error: confirmationError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (confirmationError) {
        setError(confirmationError.message || 'Error al confirmar el pago');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError('Error inesperado al procesar el pago');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mostrar loading state
  if (loading) {
    return (
      <div className="max-w-md mx-auto text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">Procesando tu pago...</p>
        <p className="text-sm text-gray-500 mt-2">
          Por favor no cierres esta ventana
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de seguridad */}
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1 text-green-600" />
            <span>Pago seguro</span>
          </div>
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-1 text-green-600" />
            <span>Cifrado SSL</span>
          </div>
        </div>

        {/* Elementos de pago de Stripe */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Información de pago</h3>
          </div>
          
          <div className="space-y-4">
            <PaymentElement
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: {
                    name: 'never',
                    email: 'never',
                    phone: 'never',
                    address: 'never',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Botón de pago */}
        <Button
          type="submit"
          disabled={!stripe || loading}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Procesando...' : 'Pagar $50.00'}
        </Button>

        {/* Información adicional */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Al completar el pago, aceptas nuestros{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Política de Privacidad
            </a>
          </p>
        </div>

        {/* Métodos de pago aceptados */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Métodos de pago aceptados</p>
          <div className="flex justify-center space-x-2">
            <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs font-bold">VISA</span>
            </div>
            <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs font-bold">MC</span>
            </div>
            <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs font-bold">AMEX</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};