// src/components/appointment/DateSelector.tsx
import React, { useState } from 'react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppointment } from '../../hooks/useAppointment';
import { Button } from '../common/Button';
import { Calendar } from 'lucide-react';
//import { format, addDays, isToday, isTomorrow, parseISO } from 'date-fns'; TODO: revisar parseISO

export const DateSelector: React.FC = () => {
  const { state, actions } = useAppointment();
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Generar próximos 30 días
  const dates = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));

  const handleDateSelect = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const professionalId = state.appointmentData.professionalId;
    
    // ✅ Validar que professionalId existe
    if (!professionalId) {
      console.error('❌ professionalId es undefined');
      return;
    }

    console.log('📍 DateSelector - professionalId:', professionalId);
    console.log('📍 DateSelector - date:', dateString);

    setSelectedDate(dateString);
    actions.setDate(dateString);
    actions.loadAvailableSlots(state.appointmentData.professionalId, dateString);
    actions.nextStep();
  };

  const handleBack = () => {
    actions.prevStep();
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return format(date, 'EEE d MMM', { locale: es });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selecciona Fecha
        </h1>
        <p className="text-gray-600">
          Elige la fecha para tu cita
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {dates.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateSelect(date)}
            className={`p-4 border rounded-lg text-center transition-all ${
              selectedDate === format(date, 'yyyy-MM-dd')
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <Calendar size={20} className="mx-auto mb-2" />
            <div className="text-sm font-medium">
              {getDateLabel(date)}
            </div>
            <div className="text-xs text-gray-500">
              {format(date, 'd/M', { locale: es })}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <Button variant="outline" onClick={handleBack}>
          Volver
        </Button>
      </div>
    </div>
  );
};