// src/components/appointment/BranchSelector.tsx
import React from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MapPin, Phone, Mail } from 'lucide-react';

export const BranchSelector: React.FC = () => {
  const { state, actions } = useAppointment();

  const handleBranchSelect = (branchId: string) => {
    actions.setBranch(branchId);
    actions.loadProfessionals(branchId);
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
          Selecciona Sucursal
        </h1>
        <p className="text-gray-600">
          Elige la sucursal donde deseas atenderse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.branches.map((branch) => (
          <div
            key={branch.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 text-lg mb-3">
              {branch.name}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span>{branch.address}</span>
              </div>
              
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span>{branch.phone}</span>
              </div>
              
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span>{branch.email}</span>
              </div>
            </div>

            <Button
              onClick={() => handleBranchSelect(branch.id)}
              className="w-full mt-4"
            >
              Seleccionar Sucursal
            </Button>
          </div>
        ))}
      </div>

      {state.branches.length === 0 && !state.loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay sucursales disponibles en esta provincia</p>
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