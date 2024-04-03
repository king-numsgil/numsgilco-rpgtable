import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany,
    ManyToOne,
} from "typeorm";

import type { Spell } from "./index";

@Entity()
export class Patron extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @OneToMany(() => PatronSpell, (spell) => spell.patron)
    spells!: Array<PatronSpell>;
}

@Entity()
export class PatronSpell extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne("Spell", (spell: Spell) => spell.patrons)
    spell!: Spell

    @ManyToOne(() => Patron, (patron) => patron.spells, { eager: true })
    patron!: Patron;

    @Column()
    class_level!: number;
}
