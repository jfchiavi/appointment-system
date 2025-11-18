// src/components/appointment/TimeSlotSelector.tsx
import React, { useState } from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Clock } from 'lucide-react';

export const TimeSlotSelector: React.FC = () => {
  const { state, actions } = useAppointment();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleTimeSelect = (timeSlot: string) => {
    setSelectedTime(timeSlot);
    actions.setTime(timeSlot);
    actions.nextStep();
  };

  const handleBack = () => {
    actions.prevStep();
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Cargando horarios disponibles...</span>
      </div>
    );
  }

  const availableSlots = state.availableSlots.filter(slot => slot.isAvailable);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selecciona Horario
        </h1>
        <p className="text-gray-600">
          Elige el horario que prefieras para tu cita
        </p>
      </div>

      {availableSlots.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleTimeSelect(slot.startTime)}
              className={`p-4 border rounded-lg text-center transition-all ${
                selectedTime === slot.startTime
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <Clock size={20} className="mx-auto mb-2" />
              <div className="font-medium">
                {slot.startTime}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No hay horarios disponibles para esta fecha</p>
          <Button variant="outline" onClick={handleBack}>
            Elegir otra fecha
          </Button>
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