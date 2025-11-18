// src/controllers/provinceController.ts
import type { Request, Response } from 'express';
import { Province } from '../models/Province.ts';

export const getProvinces = async (req: Request, res: Response) => {
  try {
    const provinces = await Province.find({ isActive: true })
      .sort({ name: 1 })
      .select('name _id');
    
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
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una provincia con ese nombre'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear provincia',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getProvinceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const province = await Province.findById(id);
    
    if (!province) {
      return res.status(404).json({
        success: false,
        message: 'Provincia no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: province
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener provincia',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};