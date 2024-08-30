
import { Request, Response } from "express";
import validateBody from "../../../src/infrastructure/middleware/validate-body";
// valid body passes validation and calls next function
it('should call next function when body is valid', () => {
    const schema = {
        validate: jest.fn().mockReturnValue({ error: null })
    };
    const req = { body: { name: 'John Doe' } } as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateBody(schema as any);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalled();
});

// invalid body returns 400 status code
it('should return 400 status code when body is invalid', () => {
    const schema = {
        validate: jest.fn().mockReturnValue({ error: { details: [{ message: 'Invalid body' }] } })
    };
    const req = { body: { name: '' } } as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as any as Response;
    const next = jest.fn();

    const middleware = validateBody(schema as any);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid body' });
    expect(next).not.toHaveBeenCalled();
});