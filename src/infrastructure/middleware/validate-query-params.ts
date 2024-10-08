import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

const validateQueryParams = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
};

export default validateQueryParams;
