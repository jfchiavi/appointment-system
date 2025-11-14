// src/services/emailService.ts
import nodemailer from 'nodemailer';
import { config } from '../config/environment.ts';
import type { IAppointment } from '../models/Appointment.ts';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendAppointmentConfirmation(appointment: IAppointment): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to: appointment.clientEmail,
      subject: 'Confirmación de Cita',
      html: this.generateAppointmentConfirmationEmail(appointment)
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPaymentConfirmation(appointment: IAppointment): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to: appointment.clientEmail,
      subject: 'Confirmación de Pago - Cita',
      html: this.generatePaymentConfirmationEmail(appointment)
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendAppointmentCancellation(appointment: IAppointment, reason: string): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to: appointment.clientEmail,
      subject: 'Cancelación de Cita',
      html: this.generateCancellationEmail(appointment, reason)
    };

    await this.transporter.sendMail(mailOptions);
  }

  private generateAppointmentConfirmationEmail(appointment: IAppointment): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmación de Cita</h1>
          </div>
          <div class="content">
            <p>Hola ${appointment.clientName},</p>
            <p>Tu cita ha sido confirmada para:</p>
            <p><strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Hora:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
            <p><strong>Monto:</strong> $${appointment.amount}</p>
            <p>Por favor presenta este correo al llegar a la sucursal.</p>
          </div>
          <div class="footer">
            <p>Si necesitas cancelar o modificar tu cita, contáctanos.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePaymentConfirmationEmail(appointment: IAppointment): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pago Confirmado</h1>
          </div>
          <div class="content">
            <p>Hola ${appointment.clientName},</p>
            <p>Tu pago ha sido procesado exitosamente.</p>
            <p><strong>Cita:</strong> ${new Date(appointment.date).toLocaleDateString()} a las ${appointment.startTime}</p>
            <p><strong>Monto pagado:</strong> $${appointment.amount}</p>
            <p>Te esperamos en tu cita.</p>
          </div>
          <div class="footer">
            <p>Gracias por confiar en nosotros.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateCancellationEmail(appointment: IAppointment, reason: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f44336; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Cita Cancelada</h1>
          </div>
          <div class="content">
            <p>Hola ${appointment.clientName},</p>
            <p>Tu cita para el ${new Date(appointment.date).toLocaleDateString()} a las ${appointment.startTime} ha sido cancelada.</p>
            ${reason ? `<p><strong>Razón:</strong> ${reason}</p>` : ''}
            <p>Si fue un error o deseas reagendar, contáctanos.</p>
          </div>
          <div class="footer">
            <p>Esperamos verte pronto.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}