// src/hooks/useAppointment.ts
import { useAppointment as useAppointmentContext } from '../contexts/AppointmentContext';
import { appointmentService } from '../services/appointmentService';
import { useApi } from './useApi';

export const useAppointment = () => {
  const { state, dispatch } = useAppointmentContext();
  const provincesApi = useApi();
  const branchesApi = useApi();
  const professionalsApi = useApi();
  const slotsApi = useApi();

  const loadProvinces = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const provinces = await appointmentService.getProvinces();
      dispatch({ type: 'SET_PROVINCES', payload: provinces });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar provincias' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadBranches = async (provinceId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const branches = await appointmentService.getBranchesByProvince(provinceId);
      dispatch({ type: 'SET_BRANCHES', payload: branches });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar sucursales' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadProfessionals = async (branchId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const professionals = await appointmentService.getProfessionalsByBranch(branchId);
      dispatch({ type: 'SET_PROFESSIONALS', payload: professionals });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar profesionales' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadAvailableSlots = async (professionalId: string, date: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const slots = await appointmentService.getAvailableSlots(professionalId, date);
      dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: slots });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar horarios disponibles' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const nextStep = () => {
    dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
  };

  const prevStep = () => {
    dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
  };

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const setProvince = (provinceId: string) => {
    dispatch({ type: 'SET_PROVINCE', payload: provinceId });
  };

  const setBranch = (branchId: string) => {
    dispatch({ type: 'SET_BRANCH', payload: branchId });
  };

  const setProfessional = (professionalId: string) => {
    dispatch({ type: 'SET_PROFESSIONAL', payload: professionalId });
  };

  const setDate = (date: string) => {
    dispatch({ type: 'SET_DATE', payload: date });
  };

  const setTime = (time: string) => {
    dispatch({ type: 'SET_TIME', payload: time });
  };

  const setClientInfo = (clientInfo: any) => {
    dispatch({ type: 'SET_CLIENT_INFO', payload: clientInfo });
  };

  const resetAppointment = () => {
    dispatch({ type: 'RESET_APPOINTMENT' });
  };

  return {
    state,
    actions: {
      loadProvinces,
      loadBranches,
      loadProfessionals,
      loadAvailableSlots,
      nextStep,
      prevStep,
      setStep,
      setProvince,
      setBranch,
      setProfessional,
      setDate,
      setTime,
      setClientInfo,
      resetAppointment,
    },
    apis: {
      provinces: provincesApi,
      branches: branchesApi,
      professionals: professionalsApi,
      slots: slotsApi,
    },
  };
};