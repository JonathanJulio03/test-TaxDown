import { CustomerAdapter } from "@adapters/customer-adapter";
import { BaseError } from "@error/base-error";
import { CustomerService } from "@services/customer-service";
import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { RequestCustomer } from "./request/request-customer";
import { plainToClass } from "class-transformer";
import { Customer } from "@models/customer";
import { ResponseCustomer } from "./response/response-customer";
import { RequestPatchCustomer } from "./request/request-patch-customer";

const customerService = new CustomerService(new CustomerAdapter());

export class CustomerController {

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            return res.json(await customerService.getById(id, ''));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async get(req: Request, res: Response) {
        try {
            const order = req.query.order as string | undefined;
            return res.json(await customerService.get(order ?? '', ''));
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
            const customer = RequestCustomer.fromJson(req.body);
            await validateOrReject(customer);
            return res.status(201).json(plainToClass(ResponseCustomer, await customerService.create(plainToClass(Customer, customer), '')));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const customer = RequestCustomer.fromJson(req.body);
            await validateOrReject(customer);
            return res.status(200).json(plainToClass(ResponseCustomer, await customerService.update(id, plainToClass(Customer, customer), '')));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            } else {
                return res.status(400).json({ message: 'Validation failed', errors: error });
            }
        }
    }

    static async patch(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const customer = RequestPatchCustomer.fromJson(req.body);
            await validateOrReject(customer);
            return res.status(200).json(plainToClass(ResponseCustomer, await customerService.patch(id, plainToClass(Customer, customer), '')));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await customerService.delete(id, '');
            return res.sendStatus(204).json("successful");
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }
}