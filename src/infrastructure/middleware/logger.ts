import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);

    // Log the response on finish
    res.on('RESPONSE: ', () => {
        console.log(`[${new Date().toISOString()}] ${method} ${url} ${res.statusCode}`);
    });

    next();
};

export default logger;