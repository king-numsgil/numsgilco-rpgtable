import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

export type FeatType = 'General' | 'Combat' | 'Item creation' | 'Metamagic' | 'Monster' | 'Grit' | 'Achievement' | 'Story' | 'Mythic' | 'Familiar' | 'Teamwork' | 'Item mastery' | 'Meditation' | 'Conduit';

@Entity()
export class Feat extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updtedAt!: Date;

    @Index()
    @Column()
    name!: string;

    @Index()
    @Column("simple-array")
    type!: Array<FeatType>;

    @Column()
    description!: string;

    @Column({ nullable: true })
    prerequisites!: string | null;

    @Column({ nullable: true })
    prerequisite_feats!: string | null;

    @Column({ type: "text" })
    benefit!: string;

    @Column({ nullable: true })
    normal!: string | null;

    @Column({ nullable: true })
    special!: string | null;

    @Column({ nullable: true })
    suggested_traits!: string | null;

    @Column({ nullable: true })
    prerequisite_skills!: string | null;

    @Column({ nullable: true })
    race_name!: string | null;

    @Column({ nullable: true })
    note!: string | null;

    @Column({ nullable: true })
    goal!: string | null;

    @Column({ nullable: true })
    completion_benefit!: string | null;

    @Column()
    source!: string;

    @Index()
    @Column()
    teamwork!: boolean;

    @Index()
    @Column()
    critical!: boolean;

    @Index()
    @Column()
    grit!: boolean;

    @Index()
    @Column()
    style!: boolean;

    @Index()
    @Column()
    performance!: boolean;

    @Index()
    @Column()
    racial!: boolean;

    @Index()
    @Column()
    companion_familiar!: boolean;

    @Index()
    @Column()
    multiples!: boolean;

    @Index()
    @Column()
    panache!: boolean;

    @Index()
    @Column()
    betrayal!: boolean;

    @Index()
    @Column()
    targeting!: boolean;

    @Index()
    @Column()
    esoteric!: boolean;

    @Index()
    @Column()
    stare!: boolean;

    @Index()
    @Column()
    weapon_mastery!: boolean;

    @Index()
    @Column()
    item_mastery!: boolean;

    @Index()
    @Column()
    armor_mastery!: boolean;

    @Index()
    @Column()
    shield_mastery!: boolean;

    @Index()
    @Column()
    blood_hex!: boolean;

    @Index()
    @Column()
    trick!: boolean;
}