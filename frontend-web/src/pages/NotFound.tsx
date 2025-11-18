// src/pages/NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto text-center">
        {/* Icono de error */}
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>

        {/* Texto principal */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Lo sentimos, no pudimos encontrar la página que estás buscando. 
          Puede que la dirección sea incorrecta o la página haya sido movida.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={handleGoHome}
            className="flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir al Inicio
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver Atrás
          </Button>
        </div>

        {/* Información adicional */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            ¿Buscas algo específico?
          </h3>
          <p className="text-gray-600 mb-4">
            Te sugerimos:
          </p>
          <ul className="text-left text-gray-600 space-y-2">
            <li>• Verificar que la URL sea correcta</li>
            <li>• Usar nuestro buscador en la página principal</li>
            <li>• Navegar por el menú principal</li>
            <li>• <a href="/contact" className="text-blue-600 hover:underline">Contactar a soporte</a> si necesitas ayuda</li>
          </ul>
        </div>

        {/* Enlaces rápidos */}
        <div className="mt-8">
          <p className="text-gray-600 mb-4">Enlaces que podrían interesarte:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/reservar" className="text-blue-600 hover:underline">
              Reservar Turno
            </a>
            <a href="/about" className="text-blue-600 hover:underline">
              Sobre Nosotros
            </a>
            <a href="/services" className="text-blue-600 hover:underline">
              Servicios
            </a>
            <a href="/contact" className="text-blue-600 hover:underline">
              Contacto
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Si crees que esto es un error, por favor{' '}
            <a href="mailto:soporte@turnos.com" className="text-blue-600 hover:underline">
              contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};