import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
} from "typeorm";

import type {
    Alignment,
    Domain,
    Subdomain,
    Mystery,
    Spell,
} from "./index";

@Entity()
export class Deity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @Column()
    type!: string;

    @Column({ type: "simple-enum", enum: ["Lawful Good", "Lawful Neutral", "Lawful Evil", "Neutral Good", "Neutral", "Neutral Evil", "Chaotic Good", "Chaotic Neutral", "Chaotic Evil"] })
    alignement!: Alignment;

    @ManyToMany("Domain", (domain: Domain) => domain.deities)
    @JoinTable()
    domains!: Array<Domain>;

    @ManyToMany("Subdomain", (subdomain: Subdomain) => subdomain.deities)
    @JoinTable()
    subdomains!: Array<Subdomain>;

    @ManyToMany("Mystery", (mystery: Mystery) => mystery.deities)
    @JoinTable()
    mysteries!: Array<Subdomain>;

    @OneToMany("Spell", (spell: Spell) => spell.deity)
    spells!: Array<Spell>;
}
