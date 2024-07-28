export type SpellDescriptor = "acid"
    | "air"
    | "chaotic"
    | "cold"
    | "curse"
    | "darkness"
    | "death"
    | "disease"
    | "draconic"
    | "earth"
    | "electricity"
    | "emotion"
    | "evil"
    | "fear"
    | "fire"
    | "force"
    | "good"
    | "language_dependent"
    | "lawful"
    | "light"
    | "meditative"
    | "mind_affecting"
    | "pain"
    | "poison"
    | "ruse"
    | "shadow"
    | "sonic"
    | "water";

export type Alignment = "Lawful Good" | "Lawful Neutral" | "Lawful Evil" | "Neutral Good" | "Neutral" | "Neutral Evil" | "Chaotic Good" | "Chaotic Neutral" | "Chaotic Evil";

export type FeatType =
    | "General"
    | "Combat"
    | "Item creation"
    | "Metamagic"
    | "Monster"
    | "Grit"
    | "Panache"
    | "Achievement"
    | "Story"
    | "Mythic"
    | "Familiar"
    | "Teamwork"
    | "Meditation"
    | "Conduit"
    | "Critical"
    | "Style"
    | "Performance"
    | "Racial"
    | "Companion/Familiar"
    | "Betrayal"
    | "Targeting"
    | "Esoteric"
    | "Stare"
    | "Weapon mastery"
    | "Item mastery"
    | "Armor mastery"
    | "Shield mastery"
    | "Blood hex"
    | "Trick";

export * from "./Bloodline.entity";
export * from "./Mystery.entity";
export * from "./School.entity";
export * from "./Domain.entity";
export * from "./Patron.entity";
export * from "./Class.entity";
export * from "./Deity.entity";
export * from "./Spell.entity";
export * from "./Feat.entity";
