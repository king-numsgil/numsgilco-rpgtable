import { Workbook } from "exceljs";

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

const book = new Workbook();
await book.xlsx.readFile("./TheSpellCodex.xlsx");

const sheet = book.getWorksheet("The Spell Codex");
if (sheet) {
    console.log(`sheet.rowCount = ${sheet.rowCount}`);
    //console.log(sheet.getRow(2).values);

    const list: Array<SpellEntry> = [];

    sheet.eachRow({ includeEmpty: false }, (row, index) => {
        if (index < 2) {
            return;
        }

        const spell: SpellEntry = {
            name: row.getCell(1).text,
            link: row.getCell(1).isHyperlink ? row.getCell(1).hyperlink : null,
            description: row.getCell(2).text,
            rating: row.getCell(3).value ? Number(row.getCell(3).value) : null,
            school: row.getCell(4).text,
            subschool: row.getCell(5).text || null,
            casting_time: row.getCell(6).text,
            range: row.getCell(7).text,
            area: row.getCell(8).text || null,
            effect: row.getCell(9).text || null,
            targets: row.getCell(10).text || null,
            duration: row.getCell(11).text,
            saving_throw: row.getCell(12).text || null,
            spell_resistance: row.getCell(13).text || null,
            sourcebook: row.getCell(14).text,
            dismissible: row.getCell(15).text === '1',
            shapeable: row.getCell(16).text === '1',
            verbal: row.getCell(17).text === '1',
            somatic: row.getCell(18).text === '1',
            material: row.getCell(19).text === '1',
            focus: row.getCell(20).text === '1',
            divine_focus: row.getCell(21).text === '1',
            component_costs: row.getCell(19).text !== '—' ? Number(row.getCell(22).value) : null,
            arcanist: row.getCell(23).text !== '—' ? Number(row.getCell(23).value) : null,
            wizard: row.getCell(24).text !== '—' ? Number(row.getCell(24).value) : null,
            sorcerer: row.getCell(25).text !== '—' ? Number(row.getCell(25).value) : null,
            witch: row.getCell(26).text !== '—' ? Number(row.getCell(26).value) : null,
            magus: row.getCell(27).text !== '—' ? Number(row.getCell(27).value) : null,
            bard: row.getCell(28).text !== '—' ? Number(row.getCell(28).value) : null,
            skald: row.getCell(29).text !== '—' ? Number(row.getCell(29).value) : null,
            summoner: row.getCell(30).text !== '—' ? Number(row.getCell(30).value) : null,
            unsummoner: row.getCell(31).text !== '—' ? Number(row.getCell(31).value) : null,
            bloodrager: row.getCell(32).text !== '—' ? Number(row.getCell(32).value) : null,
            shaman: row.getCell(33).text !== '—' ? Number(row.getCell(33).value) : null,
            druid: row.getCell(34).text !== '—' ? Number(row.getCell(34).value) : null,
            hunter: row.getCell(35).text !== '—' ? Number(row.getCell(35).value) : null,
            ranger: row.getCell(36).text !== '—' ? Number(row.getCell(36).value) : null,
            cleric: row.getCell(37).text !== '—' ? Number(row.getCell(37).value) : null,
            oracle: row.getCell(38).text !== '—' ? Number(row.getCell(38).value) : null,
            warpriest: row.getCell(39).text !== '—' ? Number(row.getCell(39).value) : null,
            inquisitor: row.getCell(40).text !== '—' ? Number(row.getCell(40).value) : null,
            antipaladin: row.getCell(41).text !== '—' ? Number(row.getCell(41).value) : null,
            paladin: row.getCell(42).text !== '—' ? Number(row.getCell(42).value) : null,
            alchemist: row.getCell(43).text !== '—' ? Number(row.getCell(43).value) : null,
            investigator: row.getCell(44).text !== '—' ? Number(row.getCell(44).value) : null,
            psychic: row.getCell(45).text !== '—' ? Number(row.getCell(45).value) : null,
            mesmerist: row.getCell(46).text !== '—' ? Number(row.getCell(46).value) : null,
            occultist: row.getCell(47).text !== '—' ? Number(row.getCell(47).value) : null,
            spiritualist: row.getCell(48).text !== '—' ? Number(row.getCell(48).value) : null,
            medium: row.getCell(49).text !== '—' ? Number(row.getCell(49).value) : null,
            permanency: row.getCell(61).text === '1',
            permanency_cl: row.getCell(62).text !== '—' ? Number(row.getCell(62).value) : null,
            permanency_cost: row.getCell(63).text !== '—' ? Number(row.getCell(63).value) : null,
            acid: row.getCell(64).text === '1',
            air: row.getCell(65).text === '1',
            chaotic: row.getCell(66).text === '1',
            cold: row.getCell(67).text === '1',
            curse: row.getCell(68).text === '1',
            darkness: row.getCell(69).text === '1',
            death: row.getCell(70).text === '1',
            disease: row.getCell(71).text === '1',
            draconic: row.getCell(72).text === '1',
            earth: row.getCell(73).text === '1',
            electricity: row.getCell(74).text === '1',
            emotion: row.getCell(75).text === '1',
            evil: row.getCell(76).text === '1',
            fear: row.getCell(77).text === '1',
            fire: row.getCell(78).text === '1',
            force: row.getCell(19).text === '1',
            good: row.getCell(80).text === '1',
            language_dependent: row.getCell(81).text === '1',
            lawful: row.getCell(82).text === '1',
            light: row.getCell(83).text === '1',
            meditative: row.getCell(84).text === '1',
            mind_affecting: row.getCell(85).text === '1',
            pain: row.getCell(86).text === '1',
            poison: row.getCell(87).text === '1',
            ruse: row.getCell(88).text === '1',
            shadow: row.getCell(89).text === '1',
            sonic: row.getCell(90).text === '1',
            water: row.getCell(91).text === '1',
            sla_level: row.getCell(92).text !== '' && row.getCell(92).text !== '—' ? Number(row.getCell(92).value) : null,
            deity: row.getCell(93).text || null,
            race: row.getCell(94).text || null,
            domain: row.getCell(95).text || null,
            bloodline: row.getCell(96).text || null,
            patron: row.getCell(97).text || null,
            mythic_text: row.getCell(98).text || null,
            augmented: row.getCell(99).text || null,
        };

        list.push(spell);
    });

    console.log(`Got ${list.length} spells in the list`);
    await Bun.write("../server/src/pathfinder/data/spell_codex.json", JSON.stringify(list));
}
