import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany,
    ManyToOne
} from "typeorm";

import type {
    SpellDescriptor,
    School,
    Subschool,
    DomainSpell,
    SubdomainSpell,
    PatronSpell,
    ClassSpell,
    BloodlineSpell,
    MysterySpell,
    Deity,
} from "./index";

@Entity()
export class Spell extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index()
    @Column()
    name!: string;

    @Column({ nullable: true })
    link!: string | null;

    @Column({ type: "text" })
    description!: string;

    @Column({ type: "text", nullable: true })
    mythic_text!: string | null;

    @Column({ type: "text", nullable: true })
    augmented!: string | null;

    @Column()
    casting_time!: string;

    @Column()
    range!: string;

    @Column({ nullable: true })
    area!: string | null;

    @Column({ nullable: true })
    effect!: string | null;

    @Column({ nullable: true })
    targets!: string | null;

    @Column()
    duration!: string;

    @Column({ nullable: true })
    saving_throw!: string | null;

    @Column({ nullable: true })
    spell_resistance!: string | null;

    @Index()
    @Column()
    sourcebook!: string;

    @Column()
    dismissible!: boolean;

    @Column()
    shapeable!: boolean;

    @Column()
    verbal!: boolean;

    @Column()
    somatic!: boolean;

    @Column()
    material!: boolean;

    @Column()
    focus!: boolean;

    @Column()
    divine_focus!: boolean;

    @Column({ nullable: true })
    component_costs!: number | null;

    @Column({ nullable: true })
    permanency!: boolean;

    @Column({ nullable: true })
    permanency_cl!: number | null;

    @Column({ nullable: true })
    permanency_cost!: number | null;

    @Column({ type: "simple-array" })
    descriptors!: Array<SpellDescriptor>;

    @Column({ nullable: true })
    race!: string | null;

    @ManyToOne("School", (school: School) => school.spells, { eager: true })
    school!: School;

    @ManyToOne("Subschool", (sub: Subschool) => sub.spells, { eager: true })
    subschool!: Subschool | null;

    @ManyToOne("Deity", (deity: Deity) => deity.spells, { nullable: true, eager: true, })
    deity!: Deity | null;

    @OneToMany("DomainSpell", (dom: DomainSpell) => dom.spell, { eager: true })
    domains!: Array<DomainSpell>;

    @OneToMany("SubdomainSpell", (dom: SubdomainSpell) => dom.spell, { eager: true })
    subdomains!: Array<SubdomainSpell>;

    @OneToMany("PatronSpell", (patron: PatronSpell) => patron.spell, { eager: true })
    patrons!: Array<PatronSpell>;

    @OneToMany("BloodlineSpell", (bloodline: BloodlineSpell) => bloodline.spell, { eager: true })
    bloodlines!: Array<BloodlineSpell>;

    @OneToMany("MysterySpell", (mystery: MysterySpell) => mystery.spell, { eager: true })
    mysteries!: Array<MysterySpell>;

    @OneToMany("ClassSpell", (cl: ClassSpell) => cl.spell, { eager: true })
    classes!: Array<ClassSpell>;
}
