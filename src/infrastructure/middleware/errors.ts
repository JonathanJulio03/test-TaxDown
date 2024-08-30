import { BaseError } from "@error/base-error";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof BaseError) {
        const { statusCode, errors, logging } = err;
        if (logging) {
            console.error(JSON.stringify({
                code: err.statusCode,
                errors: err.errors,
                stack: err.stack,
            }, null, 2));
        }

        return res.status(statusCode).send({ errors });
    }

    console.error(JSON.stringify(err, null, 2));
    return res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};