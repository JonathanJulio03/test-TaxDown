import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class RequestPatchCustomer {
    @IsNumber()
    @IsNotEmpty()
    creditAvailable: number;

    // Factory method to create a Customer instance from plain object
    static fromJson(json: string): RequestPatchCustomer {
        return plainToInstance(RequestPatchCustomer, JSON.parse(json));
    }
}