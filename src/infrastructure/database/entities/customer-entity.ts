import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('customer')
export class CustomerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    documentNumber: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    creditAvailable: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAd: Date;
}