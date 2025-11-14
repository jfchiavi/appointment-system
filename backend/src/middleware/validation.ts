// src/middleware/validation.ts
import Joi from 'joi';
import type { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        error: error?.details?.[0]?.message ?? error?.message ?? 'Validation error'
      });
      return;
    }

    next();
  };
};

// Esquemas de validación
export const appointmentSchema = Joi.object({
  clientName: Joi.string().min(2).max(100).required(),
  clientEmail: Joi.string().email().required(),
  clientPhone: Joi.string().min(8).max(20).required(),
  professionalId: Joi.string().required(),
  branchId: Joi.string().required(),
  date: Joi.date().required(),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  amount: Joi.number().min(0).required(),
  notes: Joi.string().max(500).optional()
});

export const paymentSchema = Joi.object({
  paymentMethodId: Joi.string().required()
});