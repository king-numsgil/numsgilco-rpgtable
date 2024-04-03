type FeatType = 'General' | 'Combat' | 'Item creation' | 'Metamagic' | 'Monster' | 'Grit' | 'Achievement' | 'Story' | 'Mythic' | 'Familiar' | 'Teamwork' | 'Item mastery' | 'Meditation' | 'Conduit';

type FeatEntry = {
    name: string;
    type: Array<FeatType>;
    description: string;
    prerequisites: string | null;
    prerequisite_feats: string | null;
    benefit: string;
    normal: string | null;
    special: string | null;
    suggested_traits: string | null;
    prerequisite_skills: string | null;
    race_name: string | null;
    note: string | null;
    goal: string | null;
    completion_benefit: string | null;
    source: string;
    teamwork: boolean;
    critical: boolean;
    grit: boolean;
    style: boolean;
    performance: boolean;
    racial: boolean;
    companion_familiar: boolean;
    multiples: boolean;
    panache: boolean;
    betrayal: boolean;
    targeting: boolean;
    esoteric: boolean;
    stare: boolean;
    weapon_mastery: boolean;
    item_mastery: boolean;
    armor_mastery: boolean;
    shield_mastery: boolean;
    blood_hex: boolean;
    trick: boolean;
};

const file = Bun.file("./src/pathfinder/feats.json");
const data = await file.json() as Array<FeatEntry>;

console.log(data.length);
data.forEach(feat => {
    if (feat.prerequisites) {
    }
});
