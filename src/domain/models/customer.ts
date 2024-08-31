export class Customer {
    id: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
    email: string;
    phone: string;
    address: string;
    creditAvailable: number;

    constructor(data: Partial<Customer>) {
        Object.assign(this, data);
    }
}