import { Customer } from "@models/customer";

export interface CustomerUseCase {
    getById(
        id: string,
        correlationId: string,
    ): Promise<Customer | null>;
    get(
        order: string,
        correlationId: string,
    ): Promise<Customer[]>;
    create(
        user: Customer,
        correlationId: string,
    ): Promise<Customer>;
    update(id: string, user: Customer, correlationId: string): Promise<Customer | null>;
    patch(id: string, user: Customer, correlationId: string): Promise<Customer | null>;
    delete(
        id: string,
        correlationId: string,
    ): Promise<void>;
}
