// src/contexts/AppointmentContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppointmentData, Province, Branch, Professional, TimeSlot } from '../types';

interface AppointmentState {
  currentStep: number;
  appointmentData: AppointmentData;
  provinces: Province[];
  branches: Branch[];
  professionals: Professional[];
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  appointmentId: string | null;
}

type AppointmentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_PROVINCES'; payload: Province[] }
  | { type: 'SET_BRANCHES'; payload: Branch[] }
  | { type: 'SET_PROFESSIONALS'; payload: Professional[] }
  | { type: 'SET_AVAILABLE_SLOTS'; payload: TimeSlot[] }
  | { type: 'SET_APPOINTMENT_ID'; payload: string }
  | { type: 'SET_PROVINCE'; payload: string }
  | { type: 'SET_BRANCH'; payload: string }
  | { type: 'SET_PROFESSIONAL'; payload: string }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_TIME'; payload: string }
  | { type: 'SET_CLIENT_INFO'; payload: AppointmentData['clientInfo'] }
  | { type: 'RESET_APPOINTMENT' };

const initialState: AppointmentState = {
  currentStep: 1,
  appointmentData: {
    provinceId: '',
    branchId: '',
    professionalId: '',
    date: '',
    time: '',
    clientInfo: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  },
  provinces: [],
  branches: [],
  professionals: [],
  availableSlots: [],
  loading: false,
  error: null,
  appointmentId: null, // ✅ Nueva propiedad
};

const appointmentReducer = (state: AppointmentState, action: AppointmentAction): AppointmentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_PROVINCES':
      return { ...state, provinces: action.payload };
    case 'SET_BRANCHES':
      return { ...state, branches: action.payload };
    case 'SET_PROFESSIONALS':
      return { ...state, professionals: action.payload };
    case 'SET_AVAILABLE_SLOTS':
      return { ...state, availableSlots: action.payload };
    case 'SET_APPOINTMENT_ID':
      return {...state, appointmentId: action.payload};
    case 'SET_PROVINCE':
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          provinceId: action.payload,
          branchId: '',
          professionalId: '',
          date: '',
          time: '',
        },
        branches: [],
        professionals: [],
        availableSlots: [],
      };
    case 'SET_BRANCH':
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          branchId: action.payload,
          professionalId: '',
          date: '',
          time: '',
        },
        professionals: [],
        availableSlots: [],
      };
    case 'SET_PROFESSIONAL':
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          professionalId: action.payload,
          date: '',
          time: '',
        },
        availableSlots: [],
      };
    case 'SET_DATE':
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          date: action.payload,
          time: '',
        },
      };
    case 'SET_TIME':
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          time: action.payload,
        },
      };
    case 'SET_CLIENT_INFO':
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          clientInfo: action.payload,
        },
      };
    case 'RESET_APPOINTMENT':
      return initialState;
    default:
      return state;
  }
};

const AppointmentContext = createContext<{
  state: AppointmentState;
  dispatch: React.Dispatch<AppointmentAction>;
} | null>(null);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  return (
    <AppointmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment debe ser usado dentro de AppointmentProvider');
  }
  return context;
};