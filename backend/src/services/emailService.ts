// services/emailService.ts
import nodemailer from 'nodemailer';
import { config } from '../config/environment.ts';
import { Appointment } from '../models/Appointment.ts';

// Tipo para los datos de la cita que necesitamos en los emails
interface AppointmentEmailData {
  clientName: string;
  clientEmail: string;
  date: Date;
  startTime: string;
  endTime: string;
  amount: number;
  professionalName?: string;
  branchName?: string;
  provinceName?: string;
}

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

  async sendAppointmentConfirmation(appointment: any): Promise<void> {
    try {
      // Si appointment es un documento de Mongoose, convertirlo a objeto plano
      const appointmentData = appointment.toObject ? appointment.toObject() : appointment;
      
      const emailData: AppointmentEmailData = {
        clientName: appointmentData.clientName,
        clientEmail: appointmentData.clientEmail,
        date: appointmentData.date,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        amount: appointmentData.amount,
        professionalName: appointmentData.professionalId?.name || 'el profesional',
        branchName: appointmentData.branchId?.name || 'la sucursal',
        provinceName: appointmentData.branchId?.provinceId?.name || ''
      };

      const mailOptions = {
        from: config.email.user,
        to: appointmentData.clientEmail,
        subject: 'Confirmación de Cita - Sistema de Turnos',
        html: this.generateAppointmentConfirmationEmail(emailData)
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de confirmación enviado a: ${appointmentData.clientEmail}`);
    } catch (error) {
      console.error('❌ Error enviando email de confirmación:', error);
      // No lanzamos el error para no interrumpir el flujo principal
    }
  }

  async sendPaymentConfirmation(appointment: any): Promise<void> {
    try {
      const appointmentData = appointment.toObject ? appointment.toObject() : appointment;
      
      const emailData: AppointmentEmailData = {
        clientName: appointmentData.clientName,
        clientEmail: appointmentData.clientEmail,
        date: appointmentData.date,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        amount: appointmentData.amount,
        professionalName: appointmentData.professionalId?.name || 'el profesional',
        branchName: appointmentData.branchId?.name || 'la sucursal'
      };

      const mailOptions = {
        from: config.email.user,
        to: appointmentData.clientEmail,
        subject: 'Confirmación de Pago - Cita Confirmada',
        html: this.generatePaymentConfirmationEmail(emailData)
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de confirmación de pago enviado a: ${appointmentData.clientEmail}`);
    } catch (error) {
      console.error('❌ Error enviando email de confirmación de pago:', error);
    }
  }

  async sendAppointmentCancellation(appointment: any, reason?: string): Promise<void> {
    try {
      const appointmentData = appointment.toObject ? appointment.toObject() : appointment;
      
      const emailData: AppointmentEmailData = {
        clientName: appointmentData.clientName,
        clientEmail: appointmentData.clientEmail,
        date: appointmentData.date,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        amount: appointmentData.amount,
        professionalName: appointmentData.professionalId?.name || 'el profesional',
        branchName: appointmentData.branchId?.name || 'la sucursal'
      };

      const mailOptions = {
        from: config.email.user,
        to: appointmentData.clientEmail,
        subject: 'Cancelación de Cita - Sistema de Turnos',
        html: this.generateCancellationEmail(emailData, reason)
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de cancelación enviado a: ${appointmentData.clientEmail}`);
    } catch (error) {
      console.error('❌ Error enviando email de cancelación:', error);
    }
  }

  async sendAppointmentReminder(appointment: any): Promise<void> {
    try {
      const appointmentData = appointment.toObject ? appointment.toObject() : appointment;
      
      const emailData: AppointmentEmailData = {
        clientName: appointmentData.clientName,
        clientEmail: appointmentData.clientEmail,
        date: appointmentData.date,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        amount: appointmentData.amount,
        professionalName: appointmentData.professionalId?.name || 'el profesional',
        branchName: appointmentData.branchId?.name || 'la sucursal',
        provinceName: appointmentData.branchId?.provinceId?.name || ''
      };

      const mailOptions = {
        from: config.email.user,
        to: appointmentData.clientEmail,
        subject: 'Recordatorio de Cita - Mañana tienes una cita',
        html: this.generateReminderEmail(emailData)
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email recordatorio enviado a: ${appointmentData.clientEmail}`);
    } catch (error) {
      console.error('❌ Error enviando email recordatorio:', error);
    }
  }

  private generateAppointmentConfirmationEmail(data: AppointmentEmailData): string {
    const formattedDate = new Date(data.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6;
            color: #333;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
          }
          .header { 
            background: #4CAF50; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
          }
          .content { 
            padding: 20px; 
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            color: #666; 
            font-size: 14px;
          }
          .appointment-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Confirmación de Cita</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${data.clientName}</strong>,</p>
            <p>Tu cita ha sido confirmada exitosamente. Aquí tienes los detalles:</p>
            
            <div class="appointment-details">
              <h3>📅 Detalles de la Cita</h3>
              <p><strong>Profesional:</strong> ${data.professionalName}</p>
              <p><strong>Fecha:</strong> ${formattedDate}</p>
              <p><strong>Hora:</strong> ${data.startTime} - ${data.endTime}</p>
              <p><strong>Sucursal:</strong> ${data.branchName}</p>
              ${data.provinceName ? `<p><strong>Provincia:</strong> ${data.provinceName}</p>` : ''}
              <p><strong>Monto:</strong> $${data.amount}</p>
            </div>

            <p>Por favor presenta este correo al llegar a la sucursal.</p>
            
            <div style="text-align: center;">
              <a href="#" class="button">Ver Detalles Completos</a>
            </div>
          </div>
          <div class="footer">
            <p>Si necesitas cancelar o modificar tu cita, contáctanos con al menos 24 horas de anticipación.</p>
            <p>📞 Teléfono: +1 (555) 123-4567 | ✉️ Email: soporte@turnos.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePaymentConfirmationEmail(data: AppointmentEmailData): string {
    const formattedDate = new Date(data.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .payment-details { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Pago Confirmado</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${data.clientName}</strong>,</p>
            <p>Tu pago ha sido procesado exitosamente y tu cita está confirmada.</p>
            
            <div class="payment-details">
              <h3>📋 Resumen del Pago</h3>
              <p><strong>Cita con:</strong> ${data.professionalName}</p>
              <p><strong>Fecha:</strong> ${formattedDate}</p>
              <p><strong>Hora:</strong> ${data.startTime}</p>
              <p><strong>Monto pagado:</strong> $${data.amount}</p>
              <p><strong>Estado:</strong> <span style="color: #4CAF50;">✅ Confirmado</span></p>
            </div>

            <p>Te esperamos en tu cita. Por favor llega 15 minutos antes.</p>
          </div>
          <div class="footer">
            <p>Gracias por confiar en nosotros.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateCancellationEmail(data: AppointmentEmailData, reason?: string): string {
    const formattedDate = new Date(data.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .header { background: #f44336; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .cancellation-details { background: #ffeaea; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Cita Cancelada</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${data.clientName}</strong>,</p>
            <p>Tu cita ha sido cancelada.</p>
            
            <div class="cancellation-details">
              <h3>📅 Cita Cancelada</h3>
              <p><strong>Profesional:</strong> ${data.professionalName}</p>
              <p><strong>Fecha:</strong> ${formattedDate}</p>
              <p><strong>Hora:</strong> ${data.startTime}</p>
              <p><strong>Sucursal:</strong> ${data.branchName}</p>
              ${reason ? `<p><strong>Razón:</strong> ${reason}</p>` : ''}
            </div>

            <p>Si fue un error o deseas reagendar, contáctanos.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="#" style="display: inline-block; padding: 12px 24px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
                Agendar Nueva Cita
              </a>
            </div>
          </div>
          <div class="footer">
            <p>Esperamos verte pronto.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateReminderEmail(data: AppointmentEmailData): string {
    const formattedDate = new Date(data.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .header { background: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .reminder-details { background: #fff3e0; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Recordatorio de Cita</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${data.clientName}</strong>,</p>
            <p>Este es un recordatorio de que tienes una cita programada para mañana.</p>
            
            <div class="reminder-details">
              <h3>📅 Tu Cita de Mañana</h3>
              <p><strong>Profesional:</strong> ${data.professionalName}</p>
              <p><strong>Fecha:</strong> ${formattedDate}</p>
              <p><strong>Hora:</strong> ${data.startTime}</p>
              <p><strong>Sucursal:</strong> ${data.branchName}</p>
              ${data.provinceName ? `<p><strong>Ubicación:</strong> ${data.provinceName}</p>` : ''}
            </div>

            <p><strong>📋 Recomendaciones:</strong></p>
            <ul>
              <li>Llega 15 minutos antes de tu cita</li>
              <li>Trae tu identificación oficial</li>
              <li>Si no puedes asistir, cancela con anticipación</li>
            </ul>
          </div>
          <div class="footer">
            <p>Te esperamos en tu cita.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Método para verificar la conexión del transporter
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Conexión con el servidor de email verificada');
      return true;
    } catch (error) {
      console.error('❌ Error verificando conexión de email:', error);
      return false;
    }
  }
}