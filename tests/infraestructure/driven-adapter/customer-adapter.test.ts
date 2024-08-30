import { Repository } from "typeorm";
import { CustomerAdapter } from "../../../src/infrastructure/driven-adapter/customer-adapter";
import { CustomerEntity } from "../../../src/infrastructure/database/entities/customer-entity";

// returns CustomerModel when customer with given id exists
it('should return CustomerModel when customer with given id exists', async () => {
    const mockRepository = {
        findOneBy: jest.fn().mockResolvedValue({
            id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
        })
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockRepository;

    const result = await customerAdapter.getById('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', 'correlation-id-123');

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182' });
    expect(result).toEqual({
        id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
    });
});

// handles non-existent id gracefully
it('should return null when customer with given id does not exist', async () => {
    const mockRepository = {
        findOneBy: jest.fn().mockResolvedValue(null)
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockRepository;

    const result = await customerAdapter.getById('01a7dc1a-4db2-4703-a085-3f7ecfdaf184', 'correlation-id-123');

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf184' });
    expect(result).toBeNull();
});

// returns all customers when repository has multiple customers
it('should return all customers when repository has multiple customers', async () => {
    const mockCustomers = [
        { id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf183', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' }
    ];
    const customerRepository = {
        find: jest.fn().mockResolvedValue(mockCustomers)
    };
    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = customerRepository as any;
    const result = await customerAdapter.get('desc', 'correlation-id');
    expect(result).toEqual(mockCustomers);
    expect(customerRepository.find).toHaveBeenCalledTimes(1);
});

// handles repository connection failure gracefully
it('should handle repository connection failure gracefully', async () => {
    const customerRepository = {
        find: jest.fn().mockRejectedValue(new Error('Connection failed'))
    };
    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = customerRepository as any;
    await expect(customerAdapter.get('desc', 'correlation-id')).rejects.toThrow('Connection failed');
    expect(customerRepository.find).toHaveBeenCalledTimes(1);
});

// successfully creates a new customer with valid data
it('should create a new customer when valid data is provided', async () => {
    const mockCustomerRepository = {
        create: jest.fn().mockReturnValue({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }),
        save: jest.fn().mockResolvedValue({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' })
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockCustomerRepository;

    const customer = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
    const result = await customerAdapter.create(customer, 'correlation-id');

    expect(mockCustomerRepository.create).toHaveBeenCalledWith(customer);
    expect(mockCustomerRepository.save).toHaveBeenCalledWith({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
    expect(result).toEqual({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
});

// handles creation with missing optional fields
it('should create a customer when optional fields are missing', async () => {
    const mockCustomerRepository = {
        create: jest.fn().mockReturnValue({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' }),
        save: jest.fn().mockResolvedValue({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' })
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockCustomerRepository;

    const customer = { firstName: 'Jane', email: 'jane.doe@example.com' };
    const result = await customerAdapter.create(customer, 'correlation-id');

    expect(mockCustomerRepository.create).toHaveBeenCalledWith(customer);
    expect(mockCustomerRepository.save).toHaveBeenCalledWith({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' });
    expect(result).toEqual({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' });
});

// successfully updates an existing customer with valid data
it('should successfully update an existing customer with valid data', async () => {
    const mockRepository = {
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        findOneBy: jest.fn().mockResolvedValue({
            id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
        })
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockRepository;

    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const customer = { firstName: 'John', lastName: 'Doe' };
    const correlationId = 'test-correlation-id';

    await customerAdapter.update(id, customer, correlationId);

    expect(mockRepository.update).toHaveBeenCalledWith(id, customer);
});

// attempts to update a customer that does not exist
it('should handle updating a non-existent customer', async () => {
    const mockRepository = {
        update: jest.fn().mockResolvedValue({ affected: 0 }),
        findOneBy: jest.fn().mockResolvedValue(null)
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockRepository;

    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const customer = { firstName: 'Jane', lastName: 'Doe' };
    const correlationId = 'test-correlation-id';

    await customerAdapter.update(id, customer, correlationId);

    expect(mockRepository.update).toHaveBeenCalledWith(id, customer);
});

// Successfully deletes a customer when a valid ID is provided
it('should delete a customer when a valid ID is provided', async () => {
    const mockRepository = {
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockRepository;

    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const correlationId = 'test-correlation-id';

    await customerAdapter.delete(id, correlationId);

    expect(mockRepository.delete).toHaveBeenCalledWith(id);
});

// Deleting a customer that does not exist
it('should handle deleting a customer that does not exist', async () => {
    const mockRepository = {
        delete: jest.fn().mockResolvedValue({ affected: 0 }),
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockRepository;

    const id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    const correlationId = 'test-correlation-id';

    await customerAdapter.delete(id, correlationId);

    expect(mockRepository.delete).toHaveBeenCalledWith(id);
});

// returns CustomerModel when email exists in the database
it('should return CustomerModel when email exists in the database', async () => {
    const mockRepository = {
        findOneBy: jest.fn().mockResolvedValue({
            id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
        })
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockRepository;

    const result = await customerAdapter.getByEmail('john.doe@example.com', 'correlation-id-123');

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
    expect(result).toEqual({
        id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
    });
});

// handles empty email string
it('should return null when email is an empty string', async () => {
    const mockRepository = {
        findOneBy: jest.fn().mockResolvedValue(null)
    } as unknown as Repository<CustomerEntity>;

    const customerAdapter = new CustomerAdapter();
    customerAdapter['customerRepository'] = mockRepository;

    const result = await customerAdapter.getByEmail('', 'correlation-id-123');

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email: '' });
    expect(result).toBeNull();
});