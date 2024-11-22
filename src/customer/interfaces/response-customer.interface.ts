import { CustomerEntity } from "../entities/customer.entity";

export interface ResponseAllCustomer{
    page: number;
    lastPage: number;
    limit: number;
    total: number;
    data: CustomerEntity[];
}