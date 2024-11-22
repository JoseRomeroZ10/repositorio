import { Injectable } from '@nestjs/common';



import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllCustomer } from './interfaces/response-customer.interface';

@Injectable()
export class CustomerService {

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly CustomerRepository: Repository<CustomerEntity>
  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    try {
      const customer = await this.CustomerRepository.save(createCustomerDto);
      if (!customer) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Customer not created!',
        });
      }
      return customer;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseAllCustomer> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      // const total = await this.categoryRepository.count({ where: { isActive: true } });
      // const data = await this.categoryRepository.find({ where: { isActive: true }, take: limit, skip: skip })
      const [total, data] = await Promise.all([
        this.CustomerRepository.count({ where: { isActive: true } }),
        this.CustomerRepository.createQueryBuilder('Customer')
          .where({ isActive: true })
          .leftJoinAndSelect('Customer.paymentMethod', 'paymentMethod')
          .take(limit)
          .skip(skip)
          .getMany()
      ]);
      const lastPage = Math.ceil(total / limit);

      if (!data) {
        new ManagerError({
          type: "NOT_FOUND",
          message: "No hay Customers"
        })
      }

      return {
        page,
        limit,
        lastPage,
        total,
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<CustomerEntity> {
    try {
      const customer = await this.CustomerRepository.createQueryBuilder('Customer')
        .where({ isActive: true })
        .leftJoinAndSelect('Customer.paymentMethod', 'paymentMethod')
        .getOne()

      if (!customer) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Customer not found',
        });
      }

      return customer;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<UpdateResult> {
    try {
      const customer = await this.CustomerRepository.update(id, updateCustomerDto)
      if (customer.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Customero not found',
        });
      }

      return customer;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const customer = await this.CustomerRepository.update({ id }, { isActive: false })
      if (customer.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Customer not found',
        });
      }

      return customer;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}

