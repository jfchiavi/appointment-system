import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment.ts';
import { connectDatabase } from './config/database.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import routes from './routes/index.ts';

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

// Limitar requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv 
  });
});

// Manejo de errores
app.use(errorHandler);

const PORT = config.port || 3001;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Ambiente: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;


// app.get('/', (req, res) => {
//     res.json([{id:1, name:'John Doe'}, {id:2, name:'Jane Smith'}]);
// });

// app.listen(PORT, () =>{
//     console.log('runing on port',PORT);
// });