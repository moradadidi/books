const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customers API',
      version: '1.0.0',
      description: 'API documentation for the Customers service',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Replace with the URL of your customers service
      },
    ],
  },
  apis: ['./customers.js'], // Path to your API routes
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
