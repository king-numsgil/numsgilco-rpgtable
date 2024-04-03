import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany,
    ManyToOne,
} from "typeorm";

import type {
    Spell,
} from "./index";

@Entity()
export class Bloodline extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @OneToMany(() => BloodlineSpell, (spell) => spell.bloodline)
    spells!: Array<BloodlineSpell>;
}

@Entity()
export class BloodlineSpell extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne("Spell", (spell: Spell) => spell.bloodlines)
    spell!: Spell;

    @ManyToOne(() => Bloodline, (bloodline) => bloodline.spells, { eager: true })
    bloodline!: Bloodline;

    @Column()
    class_level!: number;
}
