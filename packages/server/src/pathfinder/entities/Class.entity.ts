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
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @OneToMany(() => ClassSpell, (spell) => spell.class)
    spells!: Array<ClassSpell>;
}

@Entity()
export class ClassSpell extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne("Spell", (spell: Spell) => spell.classes)
    spell!: Spell;

    @ManyToOne(() => Class, (class_) => class_.spells, { eager: true })
    class!: Class;

    @Column()
    spell_level!: number;
}
