import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VEXA Healthcare Platform API',
      version: '1.0.0',
      description:
        'Backend API for VEXA — a smart healthcare platform connecting patients with organizations, doctors, and medical services. Powered by Gemini AI for intelligent discovery.',
      contact: {
        name: 'VEXA Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env['PORT'] || 5000}`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'System', description: 'Health check & system info' },
      { name: 'Organizations', description: 'Healthcare organizations (Clinics, Hospitals, Medical Centers)' },
      { name: 'Doctors', description: 'Medical professionals' },
      { name: 'Departments', description: 'Organization departments' },
      { name: 'Services', description: 'Medical services offered' },
      { name: 'Appointments', description: 'Patient appointment booking' },
      { name: 'Availability', description: 'Doctor availability slots' },
      { name: 'AI', description: 'Smart healthcare discovery powered by Gemini' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js'],
};

let spec: object;
try {
  spec = swaggerJsdoc(options);
} catch {
  spec = options.definition as object;
}

export const swaggerSpec = spec;
