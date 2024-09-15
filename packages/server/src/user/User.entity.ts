import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    email!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ select: false })
    password!: string;

    @Column({ default: false })
    isAdmin!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    public async encryptPassword(password: string) {
        this.password = await Bun.password.hash(password);
    }

    public async verifyPassword(password: string) {
        return await Bun.password.verify(password, this.password);
    }
}
