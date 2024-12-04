const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books API',
            version: '1.0.0',
            description: 'API documentation for the Books service',
        },
        servers: [
            {
                url: 'http://localhost:3004', // Replace with the URL of your books service
            },
        ],
    },
    apis: ['./books.js'], // Path to your API routes
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};