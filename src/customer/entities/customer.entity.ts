import { PurchaseEntity} from "../../purchases/entities/purchase.entity";
import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, OneToMany } from "typeorm";


@Entity('payment_methods')
export class CustomerEntity extends BaseEntity{

    @Column({type: "varchar"})
    customer: string;

    @OneToMany(() => PurchaseEntity, (purchase) => purchase.customer)
    purchase: PurchaseEntity[];
}
