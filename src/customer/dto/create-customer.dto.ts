import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import {  } from "src/common/enums/purchases-status.enum";

export class CreateCustomerDto {

    @IsNotEmpty()
    @IsString()
    customer: string
}
