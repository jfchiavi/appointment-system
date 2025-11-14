// src/controllers/provinceController.ts
import type { Request, Response } from 'express';
import { Province } from '../models/Province.ts';

export const getProvinces = async (req: Request, res: Response) => {
  try {
    const provinces = await Province.find({ isActive: true })
      .sort({ name: 1 })
      .select('name id');
    
    res.json({
      success: true,
      data: provinces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener provincias',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createProvince = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    const province = new Province({ name });
    await province.save();
    
    res.status(201).json({
      success: true,
      data: province
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear provincia',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};