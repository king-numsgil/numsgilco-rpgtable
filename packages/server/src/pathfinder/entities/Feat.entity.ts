import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany,
    ManyToOne,
} from "typeorm";

import type { FeatType } from ".";

@Entity()
export class Feat extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

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

    @Column({ type: "text" })
    benefit!: string;

    @Column({ nullable: true })
    normal!: string | null;

    @Column({ nullable: true })
    special!: string | null;

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

    @Column()
    multiples!: boolean;

    @OneToMany(() => FeatPrerequisite_Feat, prereq => prereq.parent)
    required_by!: FeatPrerequisite_Feat[];

    @OneToMany(() => FeatPrerequisite_Feat, prereq => prereq.parent)
    requisite_feats!: FeatPrerequisite_Feat[];

    @OneToMany(() => FeatPrerequisite_Skill, prereq => prereq.parent)
    requisite_skills!: FeatPrerequisite_Skill[];

    @OneToMany(() => FeatPrerequisite_Stat, prereq => prereq.parent)
    requisite_stats!: FeatPrerequisite_Stat[];

    @OneToMany(() => FeatPrerequisite_Special, prereq => prereq.parent)
    requisite_special!: FeatPrerequisite_Special[];
}

@Entity()
export class FeatPrerequisite_Feat extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Feat, feat => feat.requisite_feats)
    parent!: Feat;

    @ManyToOne(() => Feat, feat => feat.required_by)
    feat!: Feat;

    @Column({ nullable: true })
    note!: string | null;
}

@Entity()
export class FeatPrerequisite_Skill extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Feat, feat => feat.requisite_skills)
    parent!: Feat;

    @Column()
    name!: string;

    @Column()
    rank!: number;
}

@Entity()
export class FeatPrerequisite_Stat extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Feat, feat => feat.requisite_stats)
    parent!: Feat;

    @Column()
    name!: string;

    @Column()
    value!: number;
}

@Entity()
export class FeatPrerequisite_Special extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Feat, feat => feat.requisite_special)
    parent!: Feat;

    @Column()
    condition!: string;
}