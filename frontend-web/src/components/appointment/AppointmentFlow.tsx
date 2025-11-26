// src/components/appointment/AppointmentFlow.tsx
import React, { useEffect } from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import { ProvinceSelector } from './ProvinceSelector';
import { BranchSelector } from './BranchSelector';
import { ProfessionalSelector } from './ProfessionalSelector';
import { DateSelector } from './DateSelector';
import { TimeSlotSelector } from './TimeSlotSelector';
import { ClientInfoForm } from './ClientInfoForm';
import { AppointmentConfirmation } from '../../pages/AppointmentConfirmation';
import { AppointmentSummary } from './AppointmentSummary';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { CheckCircle2 } from 'lucide-react';
//import { ChevronRight, CheckCircle2 } from 'lucide-react';

export const AppointmentFlow: React.FC = () => {
  const { state, actions } = useAppointment();

  // ✅ Cargar provincias una sola vez al montar el componente
  useEffect(() => {
    if (state.provinces.length === 0 && !state.loading && state.currentStep === 1) {
      actions.loadProvinces();
    }
  }, [state.provinces.length, state.loading, state.currentStep, actions.loadProvinces]);

  const steps = [
    { number: 1, title: 'Provincia', completed: state.currentStep > 1 },
    { number: 2, title: 'Sucursal', completed: state.currentStep > 2 },
    { number: 3, title: 'Profesional', completed: state.currentStep > 3 },
    { number: 4, title: 'Fecha', completed: state.currentStep > 4 },
    { number: 5, title: 'Horario', completed: state.currentStep > 5 },
    { number: 6, title: 'Datos', completed: state.currentStep > 6 },
    { number: 7, title: 'Resumen', completed: state.currentStep > 7 },
    { number: 8, title: 'Confirmación', completed: state.currentStep > 8 },
  ];

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <ProvinceSelector />;
      case 2:
        return <BranchSelector />;
      case 3:
        return <ProfessionalSelector />;
      case 4:
        return <DateSelector />;
      case 5:
        return <TimeSlotSelector />;
      case 6:
        return <ClientInfoForm />;
      case 7:
        return <AppointmentSummary />;
      case 8:
        return <AppointmentConfirmation />;
      default:
        return <ProvinceSelector />;
    }
  };

  if (state.loading && state.currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando sistema de turnos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Turnos
          </h1>
          <p className="text-gray-600">
            Completa los siguientes pasos para agendar tu cita
          </p>
        </div>

        {/* Progress Steps - Desktop */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step.completed || state.currentStep === step.number
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`ml-3 font-medium ${
                      step.completed || state.currentStep === step.number
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step.completed ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Progress Steps - Mobile */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Paso {state.currentStep} de {steps.length}
            </span>
            <span className="font-medium text-blue-600">
              {steps[state.currentStep - 1]?.title}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(state.currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderStep()}
        </div>

        {/* Información de ayuda */}
        {state.currentStep < 8 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Necesitas ayuda?{' '}
              <a 
                href="mailto:soporte@turnos.com" 
                className="text-blue-600 hover:underline"
              >
                Contáctanos
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};