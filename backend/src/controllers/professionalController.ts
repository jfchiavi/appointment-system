// src/controllers/professionalController.ts
import type { Request, Response } from 'express';
import { Professional } from '../models/Professional.ts';

export const getProfessionalsByBranch = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    
    const professionals = await Professional.find({ 
      branchId, 
      isActive: true 
    })
    .populate('branchId', 'name')
    .sort({ name: 1 })
    .select('name specialty workingHours appointmentDuration');
    
    res.json({
      success: true,
      data: professionals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener profesionales',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getProfessionalDetails = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;
    
    const professional = await Professional.findById(professionalId)
      .populate('branchId', 'name address');
    
    if (!professional) {
      res.status(404).json({
        success: false,
        message: 'Profesional no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: professional
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener profesional',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
  return;
};