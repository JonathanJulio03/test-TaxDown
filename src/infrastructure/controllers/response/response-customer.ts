import { Expose } from "class-transformer";

export class ResponseCustomer {
    @Expose()
    id: string;
    @Expose()
    firstName: string;
    @Expose()
    lastName: string;
    @Expose()
    documentNumber: string;
    @Expose()
    email: string;
    @Expose()
    phone: string;
    @Expose()
    address: string;
    @Expose()
    creditAvailable: number;
}