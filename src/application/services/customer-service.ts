import BadError from "@error/bad-error";
import { Customer } from "@models/customer";
import { CustomerAdapterPort } from "@out/customer-adapter-port.interface";

export class CustomerService {
    constructor(
        private customerAdapterPort: CustomerAdapterPort
    ) { }
    async getById(id: string, correlationId: string): Promise<Customer | null> {
        const customer = await this.customerAdapterPort.getById(id, correlationId);
        if (customer == null) {
            throw new BadError({ code: 404, message: "Customer not found!", logging: true });
        }
        return customer;
    }
    async get(order: string, correlationId: string): Promise<Customer[]> {
        return this.customerAdapterPort.get(order, correlationId);
    }
    async create(customer: Customer, correlationId: string): Promise<Customer> {
        await this.validateExistEmail(customer.email, '0', correlationId);
        return this.customerAdapterPort.create(customer, correlationId);
    }
    async update(id: string, customer: Customer, correlationId: string): Promise<Customer | null> {
        await this.validateExistEmail(customer.email, id, correlationId);
        return this.customerAdapterPort.update(id, customer, correlationId);
    }
    async patch(id: string, customer: Customer, correlationId: string): Promise<Customer | null> {
        return this.customerAdapterPort.update(id, customer, correlationId);
    }
    async delete(id: string, correlationId: string): Promise<void> {
        return this.customerAdapterPort.delete(id, correlationId);
    }

    async validateExistEmail(email: string, id: string, correlationId: string) {
        const getCustomer = await this.customerAdapterPort.getByEmail(email, correlationId);
        if (getCustomer != null && id != getCustomer.id) {
            throw new BadError({ code: 400, message: "Email exist!", logging: true });
        }
    }
}