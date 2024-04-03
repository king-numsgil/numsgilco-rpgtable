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
export class Domain extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @OneToMany(() => Subdomain, (sub) => sub.parent)
    subdomains!: Array<Subdomain>;

    @OneToMany(() => DomainSpell, (spell) => spell.domain)
    spells!: Array<DomainSpell>;

    @ManyToMany("Deity", (deity: Deity) => deity.domains)
    deities!: Array<Deity>;
}

@Entity()
export class DomainSpell extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne("Spell", (spell: Spell) => spell.domains)
    spell!: Spell;

    @ManyToOne(() => Domain, (dom) => dom.spells, { eager: true })
    domain!: Domain;

    @Column()
    spell_level!: number;
}

@Entity()
export class Subdomain extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column()
    name!: string;

    @ManyToOne(() => Domain, (domain) => domain.subdomains)
    parent!: Domain;

    @OneToMany(() => SubdomainSpell, (spell) => spell.subdomain)
    spells!: Array<SubdomainSpell>;

    @ManyToMany("Deity", (deity: Deity) => deity.subdomains)
    deities!: Array<Deity>;
}

@Entity()
export class SubdomainSpell extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne("Spell", (spell: Spell) => spell.subdomains)
    spell!: Spell;

    @ManyToOne(() => Subdomain, (dom) => dom.spells, { eager: true })
    subdomain!: Subdomain;

    @Column()
    spell_level!: number;
}
