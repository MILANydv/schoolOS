import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management API',
      version: '1.0.0',
      description: 'Phase 1 MVP - Simple CRUD API for School Management System',
      contact: {
        name: 'API Support',
        email: 'support@schoolmanagement.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'School Management API Docs'
  }))
  
  // JSON endpoint for swagger spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  
  console.log('📖 Swagger docs available at http://localhost:5000/api-docs')
}
