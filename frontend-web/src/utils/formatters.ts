// src/utils/formatters.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: "UTC",
  });
};

export const formatTime = (time: string): string => {
  return time; // Puedes agregar lógica de formato si es necesario
};

export const generateAppointmentId = (): string => {
  return `TURN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
};