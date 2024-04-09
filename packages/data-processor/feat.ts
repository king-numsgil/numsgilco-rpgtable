import { sortedIndexOf } from "lodash";
import { Workbook } from "exceljs";

type FeatType = "General"
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

const book = new Workbook();
await book.xlsx.readFile("./Feats.xlsx");

const sheet = book.getWorksheet("Updated 19Jan2020");
if (sheet) {
    console.log(`sheet.rowCount = ${sheet.rowCount}`);
    //console.log(sheet.getRow(2).values);

    const list: Array<FeatEntry> = [];

    sheet.eachRow({ includeEmpty: false }, (row, index) => {
        if (index < 2) {
            return;
        }

        const type = row.getCell(3).text.split(',').map(s => s.trim() as FeatType) || [];
        if (row.getCell(11).value === 1 && !type.includes("Teamwork")) {
            type.push("Teamwork");
        }
        if (row.getCell(12).value === 1 && !type.includes("Critical")) {
            type.push("Critical");
        }
        if (row.getCell(13).value === 1 && !type.includes("Grit")) {
            type.push("Grit");
        }
        if (row.getCell(14).value === 1 && !type.includes("Style")) {
            type.push("Style");
        }
        if (row.getCell(15).value === 1 && !type.includes("Performance")) {
            type.push("Performance");
        }
        if (row.getCell(16).value === 1 && !type.includes("Racial")) {
            type.push("Racial");
        }
        if (row.getCell(17).value === 1 && !type.includes("Companion/Familiar")) {
            type.push("Companion/Familiar");
        }
        if (row.getCell(25).value === 1 && !type.includes("Panache")) {
            type.push("Panache");
        }
        if (row.getCell(26).value === 1 && !type.includes("Betrayal")) {
            type.push("Betrayal");
        }
        if (row.getCell(27).value === 1 && !type.includes("Targeting")) {
            type.push("Targeting");
        }
        if (row.getCell(28).value === 1 && !type.includes("Esoteric")) {
            type.push("Esoteric");
        }
        if (row.getCell(29).value === 1 && !type.includes("Stare")) {
            type.push("Stare");
        }
        if (row.getCell(30).value === 1 && !type.includes("Weapon mastery")) {
            type.push("Weapon mastery");
        }
        if (row.getCell(31).value === 1 && !type.includes("Item mastery")) {
            type.push("Stare");
        }
        if (row.getCell(32).value === 1 && !type.includes("Armor mastery")) {
            type.push("Armor mastery");
        }
        if (row.getCell(33).value === 1 && !type.includes("Shield mastery")) {
            type.push("Shield mastery");
        }
        if (row.getCell(34).value === 1 && !type.includes("Blood hex")) {
            type.push("Blood hex");
        }
        if (row.getCell(35).value === 1 && !type.includes("Trick")) {
            type.push("Trick");
        }

        const feat: FeatEntry = {
            name: row.getCell(2).text.trim(),
            type,
            description: row.getCell(4).text.trim(),
            prerequisites: row.getCell(5).value ? row.getCell(5).text.trim() : null,
            prerequisite_data: null,
            benefit: row.getCell(7).text.trim(),
            normal: row.getCell(8).value ? row.getCell(8).text.trim() : null,
            special: row.getCell(9).value ? row.getCell(9).text.trim() : null,
            note: row.getCell(19).value ? row.getCell(19).text.trim() : null,
            goal: row.getCell(20).value ? row.getCell(20).text.trim() : null,
            completion_benefit: row.getCell(21).value ? row.getCell(21).text.trim() : null,
            race_name: row.getCell(18).value ? row.getCell(18).text.trim() : null,
            source: row.getCell(10).text.trim(),
            multiples: row.getCell(22).value === 1,
        };
        list.push(feat);
    });

    const featNames = list.map(item => item.name).toSorted();
    for (const feat of list) {
        console.log(feat.name, feat.prerequisites);
        feat.prerequisite_data = parsePrereqData(feat.name, feat.prerequisites, featNames);
    }

    console.log(`Got ${list.length} feats in the list`);
    await Bun.write("../server/src/pathfinder/data/feats.json", JSON.stringify(list));
}

function parsePrereqData(featName: string, str: string | null, featNames: string[]): Array<Prerequisite> | null {
    if (str === null) {
        return null;
    }

    const pathfinderSkills: string[] = [
        "Acrobatics",
        "Appraise",
        "Bluff",
        "Climb",
        "Craft",
        "Diplomacy",
        "Disable Device",
        "Disguise",
        "Escape Artist",
        "Fly",
        "Handle Animal",
        "Heal",
        "Intimidate",
        "Knowledge (arcana)",
        "Knowledge (dungeoneering)",
        "Knowledge (engineering)",
        "Knowledge (geography)",
        "Knowledge (history)",
        "Knowledge (local)",
        "Knowledge (nature)",
        "Knowledge (nobility)",
        "Knowledge (planes)",
        "Knowledge (religion)",
        "Linguistics",
        "Perception",
        "Perform (act)",
        "Perform (comedy)",
        "Perform (dance)",
        "Perform (keyboard instruments)",
        "Perform (oratory)",
        "Perform (percussion instruments)",
        "Perform (string instruments)",
        "Perform (wind instruments)",
        "Perform (sing)",
        "Profession",
        "Ride",
        "Sense Motive",
        "Sleight of Hand",
        "Spellcraft",
        "Stealth",
        "Survival",
        "Swim",
        "Use Magic Device"
    ];

    if (featName === "Conceal Aura") {
        return [{
            type: "special",
            condition: "Chaotic Alignment",
            or: {
                type: "special",
                condition: "Evil Alignment",
                or: {
                    type: "special",
                    condition: "Good Alignment",
                    or: {
                        type: "special",
                        condition: "Lawful Alignment",
                        or: null,
                    },
                },
            },
        }];
    }

    const ret: Array<Prerequisite> = [];
    const data = str.replaceAll(".", "").split(",").map(s => s.replaceAll("*", "")
        .replaceAll("APG", "")
        .replaceAll("OA", "")
        .replaceAll("ISWG", "")
        .replaceAll("UM", "")
        .replaceAll("UC", "")
        .replaceAll("ACG", "")
        .replaceAll("UCA", "")
        .replaceAll("ARG", "")
        .replaceAll("TG", "")
        .replaceAll("UI", "")
        .trim()
    );

    for (const entry of data) {
        let found = false;

        for (const skill of pathfinderSkills) {
            if (entry.startsWith(`${skill} `)) {
                const match = entry.match(/\d+/);
                const rank = match ? parseInt(match[0]) : 0;
                ret.push({
                    type: "skill",
                    name: skill,
                    rank,
                    or: null,
                });

                found = true;
                break;
            }
        }

        if (!found && entry.toLowerCase().startsWith("base attack bonus ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Base Attack Bonus",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase().startsWith("caster level ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Caster Level",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase().startsWith("character level ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Character Level",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase().startsWith("wizard level ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Wizard Level",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase().startsWith("fighter level ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Fighter Level",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase().startsWith("mesmerist level ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Mesmerist Level",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase().startsWith("kineticist level ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Kineticist Level",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase().startsWith("unchained summoner level ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Unchanined Summoner Level",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.startsWith("Str ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Strength",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.startsWith("Dex ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Dexterity",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && (entry.startsWith("Con ") || entry.startsWith("Constitution "))) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Constitution",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && (entry.startsWith("Int ") || entry.startsWith("Intelligence "))) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Intelligence",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.startsWith("Wis ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Wisdom",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && (entry.startsWith("Cha ") || entry.startsWith("Charisma "))) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "stat",
                name: "Charisma",
                value,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase() === "ability to channel energy") {
            ret.push({
                type: "special",
                condition: "Channel Energy Class Feature",
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase().startsWith("channel energy ")) {
            const match = entry.match(/\d+/);
            const value = match ? parseInt(match[0]) : 0;
            ret.push({
                type: "special",
                condition: `Channel Energy ${value}d6`,
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase() === "ability to cast arcane spells") {
            ret.push({
                type: "special",
                condition: "Arcane Spellcaster",
                or: null,
            });

            found = true;
        }

        if (!found && entry.toLowerCase() === "proficiency with the selected weapon") {
            ret.push({
                type: "special",
                condition: "Proficiency with the Selected Weapon",
                or: null,
            });

            found = true;
        }

        if (!found && entry.endsWith(" class feature")) {
            ret.push({
                type: "special",
                condition: `${entry.replace("class feature", "").trim()} Class Feature`,
                or: null,
            });

            found = true;
        }

        if (!found && entry.endsWith(" alignment")) {
            ret.push({
                type: "special",
                condition: `${entry.replace(" alignment", "").trim()} Alignment`,
                or: null,
            });

            found = true;
        }

        if (!found) {
            let note: string | null = null;
            let tmp = entry;
            if (entry.indexOf("(") > 0) {
                tmp = entry.substring(0, entry.indexOf("(")).trim();
                note = entry.substring(entry.indexOf("(") + 1, entry.indexOf(")")).trim();
            }

            if (sortedIndexOf(featNames, tmp) > 0) {
                ret.push({
                    type: "feat",
                    name: tmp,
                    note,
                    or: null,
                });

                found = true;
            }
        }

        if (!found) {
            console.error(`Unknown prerequisite : ${entry}`);
        }
    }

    return ret;
}