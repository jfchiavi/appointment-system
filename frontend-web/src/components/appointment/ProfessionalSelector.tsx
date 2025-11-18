// src/components/appointment/ProfessionalSelector.tsx
import React from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { User, Clock } from 'lucide-react';

export const ProfessionalSelector: React.FC = () => {
  const { state, actions } = useAppointment();

  const handleProfessionalSelect = (professionalId: string) => {
    actions.setProfessional(professionalId);
    actions.nextStep();
  };

  const handleBack = () => {
    actions.prevStep();
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selecciona Profesional
        </h1>
        <p className="text-gray-600">
          Elige el profesional con quien deseas atenderse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.professionals.map((professional) => (
          <div
            key={professional.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-blue-600" />
            </div>
            
            <h3 className="font-semibold text-gray-900 text-lg mb-2">
              {professional.name}
            </h3>
            
            <p className="text-blue-600 font-medium mb-3">
              {professional.specialty}
            </p>

            <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
              <Clock size={16} className="mr-1" />
              <span>{professional.appointmentDuration} min</span>
            </div>

            <Button
              onClick={() => handleProfessionalSelect(professional.id)}
              className="w-full"
            >
              Seleccionar
            </Button>
          </div>
        ))}
      </div>

      {state.professionals.length === 0 && !state.loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay profesionales disponibles en esta sucursal</p>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button variant="outline" onClick={handleBack}>
          Volver
        </Button>
      </div>
    </div>
  );
};