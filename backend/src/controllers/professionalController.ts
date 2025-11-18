// controllers/professionalController.ts
import type { Request, Response } from 'express';
import { Professional } from '../models/Professional.ts';
import { Branch } from '../models/Branch.ts';

export const getProfessionalsByBranch = async (req: Request, res:Response) => {
  try {
    const { branchId } = req.params;
    
    // Verificar que la sucursal existe
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Sucursal no encontrada'
      });
    }
    
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
      .populate({
        path: 'branchId',
        select: 'name address',
        populate: {
          path: 'provinceId',
          select: 'name'
        }
      });
    
    if (!professional) {
      return res.status(404).json({
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
};

export const createProfessional = async (req: Request, res: Response) => {
  try {
    const professionalData = req.body;
    
    const professional = new Professional(professionalData);
    await professional.save();
    
    // Populate para devolver datos completos
    await professional.populate({
      path: 'branchId',
      select: 'name',
      populate: {
        path: 'provinceId',
        select: 'name'
      }
    });
    
    res.status(201).json({
      success: true,
      data: professional
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un profesional con ese email'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear profesional',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};