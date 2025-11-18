// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Shield, 
  Star,
  ArrowRight
  //CheckCircle
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/reservar');
  };

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Reserva Online 24/7',
      description: 'Agenda tu cita en cualquier momento desde cualquier dispositivo'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Horarios Flexibles',
      description: 'Encuentra el horario que mejor se adapte a tu disponibilidad'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Múltiples Sucursales',
      description: 'Elige la sucursal más conveniente para ti'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Profesionales Calificados',
      description: 'Selecciona entre nuestro equipo de expertos certificados'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Pago Seguro',
      description: 'Transacciones protegidas con encriptación de última generación'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Sistema de Calificación',
      description: 'Califica tu experiencia y ayuda a mejorar nuestro servicio'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Citas Realizadas' },
    { number: '50+', label: 'Profesionales' },
    { number: '15+', label: 'Sucursales' },
    { number: '98%', label: 'Satisfacción del Cliente' }
  ];

  const steps = [
    {
      step: 1,
      title: 'Elige tu ubicación',
      description: 'Selecciona la provincia y sucursal más cercana'
    },
    {
      step: 2,
      title: 'Selecciona profesional',
      description: 'Elige el especialista que prefieras'
    },
    {
      step: 3,
      title: 'Agenda fecha y hora',
      description: 'Encuentra el horario que mejor te convenga'
    },
    {
      step: 4,
      title: 'Confirma y paga',
      description: 'Completa tus datos y realiza el pago seguro'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Agenda tu cita de forma{' '}
              <span className="text-blue-200">sencilla y rápida</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Sistema de turnos online que conecta pacientes con profesionales de salud. 
              Reserva, gestiona y paga tus citas desde cualquier dispositivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleBookAppointment}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Reservar Turno Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Conocer Más
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por qué elegir nuestro sistema
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hacemos que la gestión de tus citas sea simple, segura y eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cómo funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En solo 4 simples pasos agenda tu cita
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={handleBookAppointment}
            >
              Comenzar Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para agendar tu cita?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de pacientes que ya confían en nuestro sistema
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleBookAppointment}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Reservar Turno
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Contactar Soporte
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sistema de Turnos</h3>
              <p className="text-gray-400">
                La solución moderna para la gestión de citas médicas y profesionales.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">Nosotros</a></li>
                <li><a href="/services" className="hover:text-white">Servicios</a></li>
                <li><a href="/professionals" className="hover:text-white">Profesionales</a></li>
                <li><a href="/contact" className="hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white">Privacidad</a></li>
                <li><a href="/terms" className="hover:text-white">Términos</a></li>
                <li><a href="/cookies" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>soporte@turnos.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Lun - Vie: 9:00 - 18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sistema de Turnos. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};