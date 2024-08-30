import { CustomerUseCase } from "../../../../src/application/port/in/customer-use-case.interface";
import { Customer } from "../../../../src/domain/models/customer";

// getById returns a customer when a valid id is provided
it('should return a customer when a valid id is provided', async () => {
    const mockCustomer = new Customer();
    mockCustomer.id = '01a7dc1a-4db2-4703-a085-3f7ecfdaf182';
    mockCustomer.firstName = 'John';
    mockCustomer.lastName = 'Doe';
    mockCustomer.email = 'john.doe@example.com';

    const customerUseCase = {
        getById: jest.fn().mockResolvedValue(mockCustomer),
    } as unknown as CustomerUseCase;

    const result = await customerUseCase.getById('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', 'correlation-id-123');
    expect(result).toEqual(mockCustomer);
});

// getById returns null for a non-existent id
it('should return null for a non-existent id', async () => {
    const customerUseCase = {
        getById: jest.fn().mockResolvedValue(null),
    } as unknown as CustomerUseCase;

    const result = await customerUseCase.getById('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', 'correlation-id-123');
    expect(result).toBeNull();
});