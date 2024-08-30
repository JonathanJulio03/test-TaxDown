import { CustomerService } from "../../../src/application/services/customer-service";
import { CustomerController } from "../../../src/infrastructure/controllers/customer.controllers";
import { Request, Response } from "express";
import BadError from "../../../src/infrastructure/errors/bad-error";

// Successfully retrieve a customer by ID
it('should return customer data when a valid ID is provided', async () => {
    const req = { params: { id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182' } } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const customerServiceMock = {
        getById: jest.fn().mockResolvedValue({ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'John' })
    };

    jest.spyOn(CustomerService.prototype, 'getById').mockImplementation(customerServiceMock.getById);

    await CustomerController.getById(req, res);

    expect(customerServiceMock.getById).toHaveBeenCalledWith('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', '');
});

// Attempt to retrieve a customer with a non-existent ID
it('should return 404 error when customer ID does not exist', async () => {
    const req = { params: { id: '999' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const customerServiceMock = {
        getById: jest.fn().mockRejectedValue(new BadError({ code: 404, message: "Customer not found!", logging: true }))
    };
    jest.spyOn(CustomerService.prototype, 'getById').mockImplementation(customerServiceMock.getById);

    await CustomerController.getById(req, res);

    expect(customerServiceMock.getById).toHaveBeenCalledWith('999', '');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found!' });
});

// should return a list of customers when the service returns data
it('should return a list of customers when the service returns data', async () => {
    const mockCustomers = [{ id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182', firstName: 'John Doe', email: 'john@example.com' }];

    const req = { query: { order: 'DESC' } } as unknown as Request;
    const res = {
        json: jest.fn().mockImplementation((data) => data),
        status: jest.fn().mockReturnThis()
    } as unknown as Response;

    const customerServiceMock = {
        get: jest.fn().mockResolvedValue(mockCustomers)
    };

    jest.spyOn(CustomerService.prototype, 'get').mockImplementation(customerServiceMock.get);

    await CustomerController.get(req, res);

    expect(customerServiceMock.get).toHaveBeenCalledWith('DESC', '');
    expect(res.json).toHaveBeenCalledWith(mockCustomers);
});

// should handle when the CustomerService throws a BaseError
it('should handle when the CustomerService throws a BaseError', async () => {
    const req = { query: { order: 'DESC' } } as unknown as Request;
    const res = {
        json: jest.fn().mockImplementation((data) => data),
        status: jest.fn().mockReturnThis()
    } as unknown as Response;

    const error = new BadError({ code: 404, message: "Customer not found!", logging: true });

    const customerServiceMock = {
        get: jest.fn().mockRejectedValue(error)
    };

    jest.spyOn(CustomerService.prototype, 'get').mockImplementation(customerServiceMock.get);

    await CustomerController.get(req, res);

    expect(customerServiceMock.get).toHaveBeenCalledWith('DESC', '');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
});

// successfully creates a new customer with valid data
it('should create a new customer when valid data is provided', async () => {
    const req = {
        body: {
            firstName: "John Doe",
            email: "johndoe@example.com"
        }
    } as Request;

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;

    const customerServiceMock = {
        create: jest.fn().mockResolvedValue(req.body)
    };

    jest.spyOn(CustomerService.prototype, 'create').mockImplementation(customerServiceMock.create);

    await CustomerController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
});

// attempts to create a customer with an existing email
it('should return 400 when email already exists', async () => {
    const req = {
        body: {
            firstName: "John Doe",
            email: "existingemail@example.com"
        }
    } as Request;

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;

    const error = new BadError({ code: 400, message: "Email exist!", logging: true });

    const customerServiceMock = {
        create: jest.fn().mockRejectedValue(error)
    };

    jest.spyOn(CustomerService.prototype, 'create').mockImplementation(customerServiceMock.create);

    await CustomerController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email exist!" });
});

// Successfully updates a customer when valid id and data are provided
it('should update the customer successfully when valid id and data are provided', async () => {
    const req = { params: { id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182' }, body: { firstName: 'John Doe', email: 'john.doe@example.com' } };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        sendStatus: jest.fn()
    };

    const customerServiceMock = {
        update: jest.fn().mockResolvedValue(undefined)
    };
    jest.spyOn(CustomerService.prototype, 'update').mockImplementation(customerServiceMock.update);

    await CustomerController.update(req as any, res as any);

    expect(customerServiceMock.update).toHaveBeenCalledWith('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', req.body, '');
});

// Handles non-existent customer id gracefully
it('should handle non-existent customer id gracefully', async () => {
    const req = { params: { id: '999' }, body: { firstName: 'John Doe', email: 'john.doe@example.com' } };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        sendStatus: jest.fn()
    };

    const error = new BadError({ code: 404, message: "Customer not found", logging: true });
    jest.spyOn(CustomerService.prototype, 'update').mockRejectedValue(error);

    await CustomerController.update(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
});

// Successfully deletes a customer when a valid ID is provided
it('should delete a customer when a valid ID is provided', async () => {
    const req = { params: { id: '01a7dc1a-4db2-4703-a085-3f7ecfdaf182' } };
    const res = {
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const customerServiceMock = {
        delete: jest.fn().mockResolvedValue(undefined),
    };

    jest.spyOn(CustomerService.prototype, 'delete').mockImplementation(customerServiceMock.delete);

    await CustomerController.delete(req as any, res as any);

    expect(customerServiceMock.delete).toHaveBeenCalledWith('01a7dc1a-4db2-4703-a085-3f7ecfdaf182', '');
    expect(res.sendStatus).toHaveBeenCalledWith(204);
});