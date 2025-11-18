// controllers/branchController.ts
import type { Request, Response } from 'express';
import { Branch } from '../models/Branch.ts';
import { Province } from '../models/Province.ts';

export const getBranchesByProvince = async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.params;
    
    // Verificar que la provincia existe
    const province = await Province.findById(provinceId);
    if (!province) {
      return res.status(404).json({
        success: false,
        message: 'Provincia no encontrada'
      });
    }
    
    const branches = await Branch.find({ 
      provinceId, 
      isActive: true 
    })
    .populate('provinceId', 'name')
    .sort({ name: 1 })
    .select('name address phone email businessHours');
    
    res.json({
      success: true,
      data: branches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener sucursales',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getBranchDetails = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    
    const branch = await Branch.findById(branchId)
      .populate('provinceId', 'name');
    
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Sucursal no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener sucursal',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createBranch = async (req: Request, res: Response) => {
  try {
    const branchData = req.body;
    
    const branch = new Branch(branchData);
    await branch.save();
    
    // Populate para devolver datos completos
    await branch.populate('provinceId', 'name');
    
    res.status(201).json({
      success: true,
      data: branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear sucursal',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};