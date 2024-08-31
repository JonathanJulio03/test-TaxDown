import { AppDataSource } from "@database/db";
import { CustomerEntity } from "@database/entities/customer-entity";
import { Customer } from "@models/customer";
import { CustomerAdapterPort } from "@out/customer-adapter-port.interface";
import { FindOptionsOrderValue, Repository } from "typeorm";

export class CustomerAdapter implements CustomerAdapterPort {
    private customerRepository: Repository<CustomerEntity>;

    constructor() {
        this.customerRepository = AppDataSource.getRepository(CustomerEntity);
    }

    async getById(id: string, correlationId: string): Promise<Customer | null> {
        return this.customerRepository.findOneBy({ id });
    }

    async get(order: string, correlationId: string): Promise<Customer[]> {
        const orderValue: FindOptionsOrderValue = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        return this.customerRepository.find({
            order: {
                creditAvailable: orderValue,
            },
        });
    }
    
    async create(customer: Partial<Customer>, correlationId: string): Promise<Customer> {
        const newCustomer = this.customerRepository.create(customer);
        return this.customerRepository.save(newCustomer);
    }

    async update(id: string, customer: Partial<Customer>, correlationId: string): Promise<Customer | null> {
        await this.customerRepository.update(id, customer);
        return this.customerRepository.findOneBy({ id });
    }

    async delete(id: string, correlationId: string): Promise<void> {
        this.customerRepository.delete(id);
    }
    async getByEmail(email: string, correlationId: string): Promise<Customer | null> {
        return this.customerRepository.findOneBy({ email });
    }    
}