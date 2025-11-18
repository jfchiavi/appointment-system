// src/components/appointment/ProvinceSelector.tsx
import React, { useEffect } from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ProvinceSelector: React.FC = () => {
  const { state, actions } = useAppointment();

  useEffect(() => {
    actions.loadProvinces();
  }, []);

  const handleProvinceSelect = (provinceId: string) => {
    actions.setProvince(provinceId);
    actions.loadBranches(provinceId);
    actions.nextStep();
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{state.error}</p>
        <Button onClick={() => actions.loadProvinces()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selecciona tu Provincia
        </h1>
        <p className="text-gray-600">
          Elige la provincia donde deseas atenderse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.provinces.map((province) => (
          <button
            key={province.id}
            onClick={() => handleProvinceSelect(province.id)}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
          >
            <h3 className="font-semibold text-gray-900 text-lg">
              {province.name}
            </h3>
          </button>
        ))}
      </div>

      {state.provinces.length === 0 && !state.loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay provincias disponibles</p>
        </div>
      )}
    </div>
  );
};