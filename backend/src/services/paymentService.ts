// src/services/paymentService.ts
import Stripe from 'stripe';
import { config } from '../config/environment.ts';

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
}

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2025-10-29.clover'
    });
  }

  async processPayment(
    amount: number,
    paymentMethodId: string,
    description: string
  ): Promise<PaymentResult> {
    try {
      // Convertir a centavos (Stripe usa centavos)
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        description,
        return_url: `${config.corsOrigins[0]}/payment-success`
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        paymentIntent
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en el pago'
      };
    }
  }

  async createPaymentIntent(amount: number, description: string) {
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  }
}