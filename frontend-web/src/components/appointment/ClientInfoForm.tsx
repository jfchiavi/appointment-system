// src/components/appointment/ClientInfoForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAppointment } from '../../hooks/useAppointment';
import { Button } from '../common/Button';
import { User, Mail, Phone, FileText } from 'lucide-react';

interface ClientInfoFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export const ClientInfoForm: React.FC = () => {
  const { state, actions } = useAppointment();
  const { register, handleSubmit, formState: { errors } } = useForm<ClientInfoFormData>({
    defaultValues: state.appointmentData.clientInfo
  });

  const onSubmit = (data: ClientInfoFormData) => {
    actions.setClientInfo(data);
    actions.nextStep();
  };

  const handleBack = () => {
    actions.prevStep();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Información Personal
        </h1>
        <p className="text-gray-600">
          Completa tus datos para confirmar la cita
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            <User size={16} className="inline mr-2" />
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { 
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa tu nombre completo"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail size={16} className="inline mr-2" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            {...register('email', { 
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone size={16} className="inline mr-2" />
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone', { 
              required: 'El teléfono es requerido',
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: 'Teléfono inválido'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText size={16} className="inline mr-2" />
            Notas adicionales (opcional)
          </label>
          <textarea
            id="notes"
            rows={4}
            {...register('notes')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Alguna información adicional que quieras compartir..."
          />
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={handleBack}>
            Volver
          </Button>
          <Button type="submit">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
};