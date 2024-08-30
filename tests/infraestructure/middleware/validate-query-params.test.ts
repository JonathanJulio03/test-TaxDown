import { Request, Response } from "express";
import validateQueryParams from "../../../src/infrastructure/middleware/validate-query-params";

// valid query parameters pass validation and call next function
it('should call next function when query parameters are valid', () => {
    const schema = {
        validate: jest.fn().mockReturnValue({ error: null })
    };
    const req = { query: { param1: 'value1' } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateQueryParams(schema as any);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.query);
    expect(next).toHaveBeenCalled();
});

// invalid query parameters return 400 status code
it('should return 400 status code when query parameters are invalid', () => {
    const schema = {
        validate: jest.fn().mockReturnValue({ error: { details: [{ message: 'Invalid query parameter' }] } })
    };
    const req = { query: { param1: 'invalid' } } as unknown as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as any as Response;
    const next = jest.fn();

    const middleware = validateQueryParams(schema as any);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid query parameter' });
    expect(next).not.toHaveBeenCalled();
});