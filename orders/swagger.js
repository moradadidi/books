const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Orders API',
            version: '1.0.0',
            description: 'API documentation for the Orders service',
        // Path to your API routes
        },
        servers: [
            {
                url: 'http://localhost:9000', // Replace with the URL of your orders service
            },
        ],
    },
    apis: ['./orders.js'],
        
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};