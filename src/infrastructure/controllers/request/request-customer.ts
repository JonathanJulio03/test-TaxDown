import { plainToInstance } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RequestCustomer {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    firstName: string;
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    lastName: string;
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    documentNumber: string;
    @IsString()
    @IsEmail()
    @MinLength(3)
    @MaxLength(50)
    email: string;
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    phone: string;
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    address: string;
    creditAvailable: number;

    // Factory method to create a Customer instance from plain object
    static fromJson(json: string): RequestCustomer {
        return plainToInstance(RequestCustomer, JSON.parse(json));
    }
}