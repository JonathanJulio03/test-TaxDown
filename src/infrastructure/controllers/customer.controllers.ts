import { CustomerAdapter } from "@adapters/customer-adapter";
import { BaseError } from "@error/base-error";
import { CustomerService } from "@services/customer-service";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

const customerService = new CustomerService(new CustomerAdapter());

export class CustomerController {

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            return res.json(await customerService.getById(id, uuidv4()));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async get(req: Request, res: Response) {
        try {
            const order = req.query.order as string | undefined;
            return res.json(await customerService.get(order ?? '', uuidv4()));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async create(
        req: Request,
        res: Response
    ) {
        try {
            return res.status(201).json(await customerService.create(req.body, uuidv4()));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            return res.status(200).json(await customerService.update(id, req.body, uuidv4()));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async patch(req: Request, res: Response) {
        try {
            const { id } = req.params;
            return res.status(200).json(await customerService.patch(id, req.body, uuidv4()));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await customerService.delete(id, uuidv4());
            return res.sendStatus(204);
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }
}