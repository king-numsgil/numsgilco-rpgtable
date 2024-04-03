import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany
} from "typeorm";

import type { Spell } from "./index";

@Entity()
export class School extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @OneToMany("Spell", (spell: Spell) => spell.school)
    spells!: Array<Spell>;
}

@Entity()
export class Subschool extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @OneToMany("Spell", (spell: Spell) => spell.subschool)
    spells!: Array<Spell>;
}
