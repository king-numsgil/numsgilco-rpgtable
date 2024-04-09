import { ILike, In, Like } from "typeorm";
import {
    Bloodline,
    BloodlineSpell,
    Class,
    ClassSpell,
    Deity,
    Domain,
    DomainSpell,
    Subdomain,
    SubdomainSpell,
    Mystery,
    MysterySpell,
    Patron,
    PatronSpell,
    School,
    Subschool,
    Spell,
    Feat,
    type FeatType,
    FeatPrerequisite_Feat,
    FeatPrerequisite_Skill,
    FeatPrerequisite_Special,
    FeatPrerequisite_Stat,
} from "./entities";

type SpellEntry = {
    name: string;
    link: string | null;
    description: string;
    rating: number | null;
    school: string;
    subschool: string | null;
    casting_time: string;
    range: string;
    area: string | null;
    effect: string | null;
    targets: string | null;
    duration: string;
    saving_throw: string | null;
    spell_resistance: string | null;
    sourcebook: string;
    dismissible: boolean;
    shapeable: boolean;
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    focus: boolean;
    divine_focus: boolean;
    component_costs: number | null;
    arcanist: number | null;
    wizard: number | null;
    sorcerer: number | null;
    witch: number | null;
    magus: number | null;
    bard: number | null;
    skald: number | null;
    summoner: number | null;
    unsummoner: number | null;
    bloodrager: number | null;
    shaman: number | null;
    druid: number | null;
    hunter: number | null;
    ranger: number | null;
    cleric: number | null;
    oracle: number | null;
    warpriest: number | null;
    inquisitor: number | null;
    antipaladin: number | null;
    paladin: number | null;
    alchemist: number | null;
    investigator: number | null;
    psychic: number | null;
    mesmerist: number | null;
    occultist: number | null;
    spiritualist: number | null;
    medium: number | null;
    permanency: boolean;
    permanency_cl: number | null;
    permanency_cost: number | null;
    acid: boolean;
    air: boolean;
    chaotic: boolean;
    cold: boolean;
    curse: boolean;
    darkness: boolean;
    death: boolean;
    disease: boolean;
    draconic: boolean;
    earth: boolean;
    electricity: boolean;
    emotion: boolean;
    evil: boolean;
    fear: boolean;
    fire: boolean;
    force: boolean;
    good: boolean;
    language_dependent: boolean;
    lawful: boolean;
    light: boolean;
    meditative: boolean;
    mind_affecting: boolean;
    pain: boolean;
    poison: boolean;
    ruse: boolean;
    shadow: boolean;
    sonic: boolean;
    water: boolean;
    sla_level: number | null;
    deity: string | null;
    race: string | null;
    domain: string | null;
    bloodline: string | null;
    patron: string | null;
    mythic_text: string | null;
    augmented: string | null;
};

type DomainList = {
    [name: string]: {
        Subdomains: string[];
        Deities: string[];
    };
};

type MysteryEntry = {
    Name: string;
    Deities: string[];
    Spells: {
        "Level 2": string | string[];
        "Level 4": string | string[];
        "Level 6": string | string[];
        "Level 8": string | string[];
        "Level 10": string | string[];
        "Level 12": string | string[];
        "Level 14": string | string[];
        "Level 16": string | string[];
        "Level 18": string | string[];
    }
};

type FeatPrerequisite = {
    type: "feat";
    name: string;
    note: string | null;
};

type SkillPrerequisite = {
    type: "skill";
    name: string;
    rank: number;
};

type StatPrerequisite = {
    type: "stat";
    name: string;
    value: number;
};

type SpecialPrerequisite = {
    type: "special";
    condition: string;
};

type BasePrerequisite = FeatPrerequisite | SkillPrerequisite | StatPrerequisite | SpecialPrerequisite;
type Prerequisite = BasePrerequisite & { or: Prerequisite | null };

type FeatEntry = {
    name: string;
    type: Array<FeatType>;
    description: string;
    prerequisites: string | null;
    prerequisite_data: Array<Prerequisite> | null;
    benefit: string;
    normal: string | null;
    special: string | null;
    race_name: string | null;
    note: string | null;
    goal: string | null;
    completion_benefit: string | null;
    source: string;
    multiples: boolean;
};

function parseEntry(entry: string): [string, number] {
    const matches = entry.trim().match(/^(.+?)\s\((\d+)\)$/);
    if (!matches || matches.length < 3) {
        throw new Error(`"{entry}" is invalid`);
    }

    return [matches[1].trim(), parseInt(matches[2].trim())];
}

export async function seedClass() {
    const classes = [
        "Alchemist",
        "Antipaladin",
        "Arcanist",
        "Barbarian",
        "Barbarian (Unchained)",
        "Bard",
        "Bloodrager",
        "Brawler",
        "Cavalier",
        "Cleric",
        "Druid",
        "Fighter",
        "Gunslinger",
        "Hunter",
        "Inquisitor",
        "Investigator",
        "Kineticist",
        "Magus",
        "Medium",
        "Mesmerist",
        "Monk",
        "Monk (Unchained)",
        "Ninja",
        "Occultist",
        "Oracle",
        "Paladin",
        "Psychic",
        "Ranger",
        "Rogue",
        "Rogue (Unchained)",
        "Samurai",
        "Shaman",
        "Shifter",
        "Skald",
        "Slayer",
        "Sorcerer",
        "Spiritualist",
        "Summoner",
        "Summoner (Unchained)",
        "Swashbuckler",
        "Vigilante",
        "Warpriest",
        "Witch",
        "Wizard"
    ];

    console.log("Seeding classes...");
    await Promise.all([
        Promise.all(classes.map(name => Class.insert({ name }))),
        Promise.all([
            "Abjuration",
            "Conjuration",
            "Divination",
            "Enchantment",
            "Evocation",
            "Illusion",
            "Necromancy",
            "Transmutation",
            "Universal",
        ].map(name => School.insert({ name }))),
        Promise.all([
            "Calling",
            "Charm",
            "Compulsion",
            "Creation",
            "Figment",
            "Glamer",
            "Healing",
            "Pattern",
            "Phantasm",
            "Polymorph",
            "Scrying",
            "Shadow",
            "Summoning",
            "Teleportation",
            "Haunted",
        ].map(name => Subschool.insert({ name }))),
    ]);
    console.log("Done!");
}

export async function seedDomain() {
    console.log("Seeding domains...");
    const file = Bun.file("./src/pathfinder/data/domains.json");
    const data = await file.json() as DomainList;

    for (const name of Object.keys(data)) {
        const domain = new Domain();
        domain.name = name;
        domain.subdomains = [];
        domain.deities = [];

        for (const dname of data[name].Deities) {
            let deity = await Deity.findOne({ where: { name: dname } });
            if (!deity) {
                deity = new Deity();
                deity.name = dname;
                deity.alignement = "Neutral";
                deity.type = "Core God";
                deity = await deity.save();
            }

            domain.deities.push(deity);
        }

        for (const sub of data[name].Subdomains) {
            let subdom = await Subdomain.findOne({ where: { name: sub } });
            if (!subdom) {
                subdom = new Subdomain();
                subdom.name = sub;
                subdom.deities = domain.deities;
                subdom = await subdom.save();
            }

            domain.subdomains.push(subdom);
        }

        await domain.save();
    }
    console.log("Done!");
}

export async function seedSpell() {
    console.log("Seeding spells...");
    const file = Bun.file("./src/pathfinder/data/spell_codex.json");
    const data = await file.json() as SpellEntry[];

    for (const spell of data) {
        if (spell.name === "Gate") {
            spell.subschool = "calling";
        }
        if (spell.name === "Mislead") {
            spell.subschool = "glamer";
        }
        if (spell.name === "Vomit Twin") {
            spell.subschool = "creation";
        }

        const row = new Spell();
        row.name = spell.name;
        row.link = spell.link;
        row.description = spell.description;
        row.mythic_text = spell.mythic_text;
        row.augmented = spell.augmented;
        row.casting_time = spell.casting_time;
        row.range = spell.range;
        row.area = spell.area;
        row.effect = spell.effect;
        row.targets = spell.targets;
        row.duration = spell.duration;
        row.saving_throw = spell.saving_throw;
        row.spell_resistance = spell.spell_resistance;
        row.sourcebook = spell.sourcebook;
        row.dismissible = spell.dismissible;
        row.shapeable = spell.shapeable;
        row.verbal = spell.verbal;
        row.somatic = spell.somatic;
        row.material = spell.material;
        row.focus = spell.focus;
        row.divine_focus = spell.divine_focus;
        row.component_costs = spell.component_costs;
        row.permanency = spell.permanency;
        row.permanency_cl = spell.permanency_cl;
        row.permanency_cost = spell.permanency_cost;
        row.race = spell.race;

        if (spell.school !== "see text") {
            row.school = await School.findOneOrFail({ where: { name: Like(spell.school) } });
        }

        row.subschool = spell.subschool ? await Subschool.findOneOrFail({ where: { name: Like(spell.subschool) } }) : null;
        row.deity = spell.deity ? await Deity.findOne({ where: { name: Like(spell.deity) } }) : null;

        row.descriptors = [];
        if (spell.acid) {
            row.descriptors.push("acid");
        }
        if (spell.air) {
            row.descriptors.push("air");
        }
        if (spell.chaotic) {
            row.descriptors.push("chaotic");
        }
        if (spell.cold) {
            row.descriptors.push("cold");
        }
        if (spell.curse) {
            row.descriptors.push("curse");
        }
        if (spell.darkness) {
            row.descriptors.push("darkness");
        }
        if (spell.death) {
            row.descriptors.push("death");
        }
        if (spell.disease) {
            row.descriptors.push("disease");
        }
        if (spell.draconic) {
            row.descriptors.push("draconic");
        }
        if (spell.earth) {
            row.descriptors.push("earth");
        }
        if (spell.electricity) {
            row.descriptors.push("electricity");
        }
        if (spell.emotion) {
            row.descriptors.push("emotion");
        }
        if (spell.evil) {
            row.descriptors.push("evil");
        }
        if (spell.fear) {
            row.descriptors.push("fear");
        }
        if (spell.fire) {
            row.descriptors.push("fire");
        }
        if (spell.force) {
            row.descriptors.push("force");
        }
        if (spell.good) {
            row.descriptors.push("good");
        }
        if (spell.language_dependent) {
            row.descriptors.push("language_dependent");
        }
        if (spell.lawful) {
            row.descriptors.push("lawful");
        }
        if (spell.light) {
            row.descriptors.push("light");
        }
        if (spell.meditative) {
            row.descriptors.push("meditative");
        }
        if (spell.mind_affecting) {
            row.descriptors.push("mind_affecting");
        }
        if (spell.pain) {
            row.descriptors.push("pain");
        }
        if (spell.poison) {
            row.descriptors.push("poison");
        }
        if (spell.ruse) {
            row.descriptors.push("ruse");
        }
        if (spell.shadow) {
            row.descriptors.push("shadow");
        }
        if (spell.sonic) {
            row.descriptors.push("sonic");
        }
        if (spell.water) {
            row.descriptors.push("water");
        }

        row.classes = [];
        if (spell.arcanist !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Arcanist" } });
            clSpell.spell_level = spell.arcanist;
            row.classes.push(await clSpell.save());
        }
        if (spell.wizard !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Wizard" } });
            clSpell.spell_level = spell.wizard;
            row.classes.push(await clSpell.save());
        }
        if (spell.sorcerer !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Sorcerer" } });
            clSpell.spell_level = spell.sorcerer;
            row.classes.push(await clSpell.save());
        }
        if (spell.witch !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Witch" } });
            clSpell.spell_level = spell.witch;
            row.classes.push(await clSpell.save());
        }
        if (spell.magus !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Magus" } });
            clSpell.spell_level = spell.magus;
            row.classes.push(await clSpell.save());
        }
        if (spell.bard !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Bard" } });
            clSpell.spell_level = spell.bard;
            row.classes.push(await clSpell.save());
        }
        if (spell.skald !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Skald" } });
            clSpell.spell_level = spell.skald;
            row.classes.push(await clSpell.save());
        }
        if (spell.summoner !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Summoner" } });
            clSpell.spell_level = spell.summoner;
            row.classes.push(await clSpell.save());
        }
        if (spell.unsummoner !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Summoner (Unchained)" } });
            clSpell.spell_level = spell.unsummoner;
            row.classes.push(await clSpell.save());
        }
        if (spell.bloodrager !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Bloodrager" } });
            clSpell.spell_level = spell.bloodrager;
            row.classes.push(await clSpell.save());
        }
        if (spell.shaman !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Shaman" } });
            clSpell.spell_level = spell.shaman;
            row.classes.push(await clSpell.save());
        }
        if (spell.druid !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Druid" } });
            clSpell.spell_level = spell.druid;
            row.classes.push(await clSpell.save());
        }
        if (spell.hunter !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Hunter" } });
            clSpell.spell_level = spell.hunter;
            row.classes.push(await clSpell.save());
        }
        if (spell.ranger !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Ranger" } });
            clSpell.spell_level = spell.ranger;
            row.classes.push(await clSpell.save());
        }
        if (spell.cleric !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Cleric" } });
            clSpell.spell_level = spell.cleric;
            row.classes.push(await clSpell.save());
        }
        if (spell.oracle !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Oracle" } });
            clSpell.spell_level = spell.oracle;
            row.classes.push(await clSpell.save());
        }
        if (spell.warpriest !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Warpriest" } });
            clSpell.spell_level = spell.warpriest;
            row.classes.push(await clSpell.save());
        }
        if (spell.inquisitor !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Inquisitor" } });
            clSpell.spell_level = spell.inquisitor;
            row.classes.push(await clSpell.save());
        }
        if (spell.antipaladin !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Antipaladin" } });
            clSpell.spell_level = spell.antipaladin;
            row.classes.push(await clSpell.save());
        }
        if (spell.paladin !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Paladin" } });
            clSpell.spell_level = spell.paladin;
            row.classes.push(await clSpell.save());
        }
        if (spell.alchemist !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Alchemist" } });
            clSpell.spell_level = spell.alchemist;
            row.classes.push(await clSpell.save());
        }
        if (spell.investigator !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Investigator" } });
            clSpell.spell_level = spell.investigator;
            row.classes.push(await clSpell.save());
        }
        if (spell.psychic !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Psychic" } });
            clSpell.spell_level = spell.psychic;
            row.classes.push(await clSpell.save());
        }
        if (spell.mesmerist !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Mesmerist" } });
            clSpell.spell_level = spell.mesmerist;
            row.classes.push(await clSpell.save());
        }
        if (spell.occultist !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Occultist" } });
            clSpell.spell_level = spell.occultist;
            row.classes.push(await clSpell.save());
        }
        if (spell.spiritualist !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Spiritualist" } });
            clSpell.spell_level = spell.spiritualist;
            row.classes.push(await clSpell.save());
        }
        if (spell.medium !== null) {
            const clSpell = new ClassSpell();
            clSpell.class = await Class.findOneOrFail({ where: { name: "Medium" } });
            clSpell.spell_level = spell.medium;
            row.classes.push(await clSpell.save());
        }

        row.domains = [];
        row.subdomains = [];
        if (spell.domain) {
            for (const entry of spell.domain.split(",")) {
                const [name, level] = parseEntry(entry);
                const dom = await Domain.findOne({ where: { name } });
                if (dom) {
                    const domspell = new DomainSpell();
                    domspell.domain = dom;
                    domspell.spell_level = level;
                    row.domains.push(await domspell.save());
                } else {
                    const subdom = await Subdomain.findOne({ where: { name } });
                    if (subdom) {
                        const subdomspell = new SubdomainSpell();
                        subdomspell.subdomain = subdom;
                        subdomspell.spell_level = level;
                        row.subdomains.push(await subdomspell.save());
                    } else {
                        console.log(`"${name}" can't be found in either domains or subdomains for spell "${row.name}"`);
                    }
                }
            }
        }

        row.patrons = [];
        if (spell.patron) {
            for (const entry of spell.patron.split(",")) {
                const [name, level] = parseEntry(entry);
                let patron = await Patron.findOne({ where: { name } });
                if (!patron) {
                    patron = new Patron();
                    patron.name = name;
                    patron = await patron.save();
                }

                const patronSpell = new PatronSpell();
                patronSpell.patron = patron;
                patronSpell.class_level = level;
                row.patrons.push(await patronSpell.save());
            }
        }

        row.bloodlines = [];
        if (spell.bloodline) {
            for (const entry of spell.bloodline.split(",")) {
                const [name, level] = parseEntry(entry);
                let blood = await Bloodline.findOne({ where: { name } });
                if (!blood) {
                    blood = new Bloodline();
                    blood.name = name;
                    blood = await blood.save();
                }

                const bloodSpell = new BloodlineSpell();
                bloodSpell.bloodline = blood;
                bloodSpell.class_level = level;
                row.bloodlines.push(await bloodSpell.save());
            }
        }

        await row.save();
    }
    console.log("Done!");
}

export async function seedMysteries() {
    console.log("Seeding mysteries...");
    const file = Bun.file("./src/pathfinder/data/OracleMysteries.json");
    const data = await file.json() as MysteryEntry[];

    await Promise.all(data.map(async entry => {
        const mystery = new Mystery();
        mystery.name = entry.Name;
        mystery.deities = await Deity.find({
            where: {
                name: In(entry.Deities),
            },
        });

        mystery.spells = [];
        if (entry.Spells["Level 2"] instanceof Array) {
            const [name, note] = entry.Spells["Level 2"];
            const spell = new MysterySpell();
            spell.class_level = 2;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 2;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 2"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        if (entry.Spells["Level 4"] instanceof Array) {
            const [name, note] = entry.Spells["Level 4"];
            const spell = new MysterySpell();
            spell.class_level = 4;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 4;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 4"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        if (entry.Spells["Level 6"] instanceof Array) {
            const [name, note] = entry.Spells["Level 6"];
            const spell = new MysterySpell();
            spell.class_level = 6;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 6;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 6"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        if (entry.Spells["Level 8"] instanceof Array) {
            const [name, note] = entry.Spells["Level 8"];
            const spell = new MysterySpell();
            spell.class_level = 8;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 8;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 8"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        if (entry.Spells["Level 10"] instanceof Array) {
            const [name, note] = entry.Spells["Level 10"];
            const spell = new MysterySpell();
            spell.class_level = 10;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 10;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 10"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        if (entry.Spells["Level 12"] instanceof Array) {
            const [name, note] = entry.Spells["Level 12"];
            const spell = new MysterySpell();
            spell.class_level = 12;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 12;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 12"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        if (entry.Spells["Level 14"] instanceof Array) {
            const [name, note] = entry.Spells["Level 14"];
            const spell = new MysterySpell();
            spell.class_level = 14;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 14;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 14"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        if (entry.Spells["Level 16"] instanceof Array) {
            const [name, note] = entry.Spells["Level 16"];
            const spell = new MysterySpell();
            spell.class_level = 16;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 16;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 16"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        if (entry.Spells["Level 18"] instanceof Array) {
            const [name, note] = entry.Spells["Level 18"];
            const spell = new MysterySpell();
            spell.class_level = 18;
            spell.note = note;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(name),
                },
            });
            mystery.spells.push(await spell.save());
        } else {
            const spell = new MysterySpell();
            spell.class_level = 18;
            spell.note = null;
            spell.spell = await Spell.findOneOrFail({
                where: {
                    name: ILike(entry.Spells["Level 18"]),
                },
            });
            mystery.spells.push(await spell.save());
        }

        return mystery.save();
    }));

    console.log("Done!");
}

export async function seedFeats() {
    console.log("Seeding feats...");
    const file = Bun.file("./src/pathfinder/data/feats.json");
    const data = await file.json() as FeatEntry[];

    for (const entry of data) {
        const feat = new Feat();
        feat.benefit = entry.benefit;
        feat.completion_benefit = entry.completion_benefit;
        feat.description = entry.description;
        feat.goal = entry.goal;
        feat.multiples = entry.multiples;
        feat.name = entry.name;
        feat.normal = entry.normal;
        feat.note = entry.note;
        feat.prerequisites = entry.prerequisites;
        feat.race_name = entry.race_name;
        feat.source = entry.source;
        feat.special = entry.special
        feat.type = entry.type;
        feat.requisite_feats = [];
        feat.requisite_skills = [];
        feat.requisite_special = [];
        feat.requisite_stats = [];

        if (entry.prerequisite_data) {
            for (const req of entry.prerequisite_data) {
                if (req.type === "skill") {
                    const skill = new FeatPrerequisite_Skill();
                    skill.name = req.name;
                    skill.rank = req.rank;
                    feat.requisite_skills.push(await skill.save());
                }

                if (req.type === "stat") {
                    const stat = new FeatPrerequisite_Stat();
                    stat.name = req.name;
                    stat.value = req.value;
                    feat.requisite_stats.push(await stat.save());
                }

                if (req.type === "special") {
                    const special = new FeatPrerequisite_Special();
                    special.condition = req.condition;
                    feat.requisite_special.push(await special.save());
                }
            }
        }

        await feat.save();
    }

    for (const entry of data) {
        if (entry.prerequisite_data) {
            const feat = await Feat.findOneOrFail({
                where: {
                    name: entry.name,
                },
            });

            try {
                for (const req of entry.prerequisite_data) {
                    if (req.type === "feat") {
                        await FeatPrerequisite_Feat.insert({
                            feat: await Feat.findOneOrFail({
                                where: {
                                    name: req.name,
                                },
                            }),
                            note: req.note,
                            parent: feat,
                        });
                    }
                }
            } catch (e) {
                console.error(`${entry.name} : ${e}`);
            }
        }
    }

    console.log("Done!");
}