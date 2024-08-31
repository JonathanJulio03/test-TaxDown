import { CustomerAdapterPort } from "../../../src/application/port/out/customer-adapter-port.interface";
import { CustomerService } from "../../../src/application/services/customer-service";
import { Customer } from "../../../src/domain/models/customer";
import BadError from "../../../src/infrastructure/errors/bad-error";

// Returns customer when valid ID is provided
it('should return customer when valid ID is provided', async () => {
    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const mockCustomerAdapterPort = {
        getById: jest.fn().mockResolvedValue(new Customer({ id, firstName: 'John', lastName: 'Doe' }))
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const correlationId = 'test-correlation-id';
    const customer = await customerService.getById(id, correlationId);
    expect(customer).toBeInstanceOf(Customer);
    expect(mockCustomerAdapterPort.getById).toHaveBeenCalledWith(id, correlationId);
});

// Handles non-existent customer ID gracefully
it('should throw BadError when customer ID does not exist', async () => {
    const mockCustomerAdapterPort = {
        getById: jest.fn().mockResolvedValue(null)
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const correlationId = 'test-correlation-id';
    await expect(customerService.getById(id, correlationId)).rejects.toThrow(BadError);
    expect(mockCustomerAdapterPort.getById).toHaveBeenCalledWith(id, correlationId);
});

// handles null or undefined correlationId gracefully
it('should handle null or undefined correlationId gracefully', async () => {
    const mockCustomerAdapterPort = {
        get: jest.fn().mockResolvedValue([])
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const customers = await customerService.get('ASC', '');
    expect(customers).toEqual([]);
});

// Successfully creates a new customer when email does not exist
it('should create a new customer when email does not exist', async () => {
    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const mockCustomerAdapterPort = {
        getByEmail: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', active: true })
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const customer = new Customer({ id, firstName: 'John', lastName: 'Doe' });
    customer.firstName = 'John';
    customer.lastName = 'Doe';
    customer.email = 'john.doe@example.com';
    const correlationId = 'test-correlation-id';
    const result = await customerService.create(customer, correlationId);
    expect(result).toEqual({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', active: true });
    expect(mockCustomerAdapterPort.getByEmail).toHaveBeenCalledWith('john.doe@example.com', correlationId);
    expect(mockCustomerAdapterPort.create).toHaveBeenCalledWith(customer, correlationId);
});

// Throws BadError when email already exists
it('should throw BadError when email already exists', async () => {
    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const mockCustomerAdapterPort = {
        getByEmail: jest.fn().mockResolvedValue({ id, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', active: true }),
        create: jest.fn()
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const customer = new Customer({ id, firstName: 'Jane', lastName: 'Doe' });
    customer.firstName = 'Jane';
    customer.lastName = 'Doe';
    customer.email = 'jane.doe@example.com';
    const correlationId = 'test-correlation-id';
    await expect(customerService.create(customer, correlationId)).rejects.toThrow(BadError);
    expect(mockCustomerAdapterPort.getByEmail).toHaveBeenCalledWith('jane.doe@example.com', correlationId);
    expect(mockCustomerAdapterPort.create).not.toHaveBeenCalled();
});

// Successfully updates customer when email is unique and valid
it('should successfully update customer when email is unique and valid', async () => {
    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const mockCustomerAdapterPort = {
        getByEmail: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue(undefined)
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const customer = new Customer({ id, firstName: 'John', lastName: 'Doe' });
    customer.id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    customer.firstName = 'John';
    customer.lastName = 'Doe';
    customer.email = 'john.doe@example.com';
    const correlationId = 'test-correlation-id';

    await customerService.update('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', customer, correlationId);

    expect(mockCustomerAdapterPort.getByEmail).toHaveBeenCalledWith(customer.email, correlationId);
    expect(mockCustomerAdapterPort.update).toHaveBeenCalledWith('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', customer, correlationId);
});

// Throws BadError if email already exists for another customer
it('should throw BadError if email already exists for another customer', async () => {
    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const existingCustomer = new Customer({ id, firstName: 'John', lastName: 'Doe' });
    existingCustomer.id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf183';
    existingCustomer.firstName = 'Jane';
    existingCustomer.lastName = 'Doe';
    existingCustomer.email = 'jane.doe@example.com';

    const mockCustomerAdapterPort = {
        getByEmail: jest.fn().mockResolvedValue(existingCustomer),
        update: jest.fn()
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const customer = new Customer({ id, firstName: 'John', lastName: 'Doe' });
    customer.id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    customer.firstName = 'John';
    customer.lastName = 'Doe';
    customer.email = 'jane.doe@example.com';
    const correlationId = 'test-correlation-id';

    await expect(customerService.update('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', customer, correlationId)).rejects.toThrow(BadError);

    expect(mockCustomerAdapterPort.getByEmail).toHaveBeenCalledWith(customer.email, correlationId);
    expect(mockCustomerAdapterPort.update).not.toHaveBeenCalled();
});

// Successfully deletes a customer when a valid ID is provided
it('should successfully delete a customer when a valid ID is provided', async () => {
    const mockCustomerAdapterPort = {
        delete: jest.fn().mockResolvedValue(undefined)
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const correlationId = 'test-correlation-id';

    await customerService.delete(id, correlationId);

    expect(mockCustomerAdapterPort.delete).toHaveBeenCalledWith(id, correlationId);
});

// Attempts to delete a customer that does not exist
it('should throw an error when attempting to delete a customer that does not exist', async () => {
    const mockCustomerAdapterPort = {
        delete: jest.fn().mockRejectedValue(new BadError({ code: 404, message: "Customer not found!", logging: true }))
    } as unknown as CustomerAdapterPort;
    const customerService = new CustomerService(mockCustomerAdapterPort);
    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf181';
    const correlationId = 'test-correlation-id';

    await expect(customerService.delete(id, correlationId)).rejects.toThrow(BadError);
    expect(mockCustomerAdapterPort.delete).toHaveBeenCalledWith(id, correlationId);
});