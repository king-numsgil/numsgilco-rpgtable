import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany,
    ManyToOne,
    ManyToMany,
} from "typeorm";

import type {
    Deity,
    Spell,
} from "./index";

@Entity()
export class Mystery extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @OneToMany(() => MysterySpell, (spell) => spell.mystery)
    spells!: Array<MysterySpell>;

    @ManyToMany("Deity", (deity: Deity) => deity.mysteries)
    deities!: Array<Deity>;
}

@Entity()
export class MysterySpell extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne("Spell", (spell: Spell) => spell.mysteries)
    spell!: Spell;

    @ManyToOne(() => Mystery, (mystery) => mystery.spells, { eager: true })
    mystery!: Mystery;

    @Column()
    class_level!: number;

    @Column({ nullable: true })
    note!: string | null;
}
