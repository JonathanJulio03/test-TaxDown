import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./infrastructure/docs/swagger_output.json";
import { errorHandler } from '@middleware/errors';
import customerRoutes from '@routes/customer.routes';
import logger from '@middleware/logger';
import bodyParser from 'body-parser';
import routerJwe from '@routes/jwe.routes';

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(logger)
app.use(routerJwe)
app.use(customerRoutes)

// Error handling
app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get('/', (req, res) => {
    res.send('Health!');
});

export default app;