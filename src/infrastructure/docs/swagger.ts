import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Swagger Demo Project',
        description: 'Implementation of Swagger with TypeScript'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: ''
        },
    ],
    components: {}
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/infrastructure/routes/customer.routes.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);