import { MigrationInterface, QueryRunner } from "typeorm";

export class Customer1732289446729 implements MigrationInterface {
    name = 'Customer1732289446729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" RENAME COLUMN "payment_method" TO "customer"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "customer"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "payment_method" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "customer" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "customer"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "payment_method"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "customer" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" RENAME COLUMN "customer" TO "payment_method"`);
    }

}
