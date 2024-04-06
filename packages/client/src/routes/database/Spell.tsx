import { TextInput, SimpleGrid, Card, Group, Text, Badge, Modal, Button, ActionIcon, Overlay, Loader, Portal, Center, NativeSelect } from '@mantine/core';
import { useDisclosure, useDebouncedValue, useInViewport } from "@mantine/hooks";
import { FC, useState, useEffect, Suspense, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconSettings, IconX } from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';

import { trpc, type RouterOutputs, RouterInputs } from 'trpc';
import { useLazyEffect } from 'utils';
import * as classes from "./Spell.css";

const SpellEntries: FC<{ spell: RouterOutputs["pathfinder"]["spell"]["get"] }> = ({ spell }) => {
    return <>
        <Text mb="xs">{spell.school.name} {spell.subschool && `(${spell.subschool.name})`} {spell.descriptors.length > 0 && `[${spell.descriptors.join(", ")}]`}</Text>
        <Group gap="xs" mb="sm">
            {spell.classes.map((value, index) => <Badge key={index} size="xs" color="blue">{value.class.name} {value.spell_level}</Badge>)}
        </Group>
        {spell.domains && spell.domains.length > 0 && <Text mb={0}>Domain: {spell.domains.map(value => `${value.domain.name} (${value.spell_level})`).join(", ")}</Text>}
        {spell.subdomains && spell.subdomains.length > 0 && <Text mb={0}>Subdomain: {spell.subdomains.map(value => `${value.subdomain.name} (${value.spell_level})`).join(", ")}</Text>}
        {spell.bloodlines && spell.bloodlines.length > 0 && <Text mb={0}>Bloodline: {spell.bloodlines.map(value => `${value.bloodline.name} (${value.class_level})`).join(", ")}</Text>}
        {spell.patrons && spell.patrons.length > 0 && <Text mb={0}>Patron: {spell.patrons.map(value => `${value.patron.name} (${value.class_level})`).join(", ")}</Text>}
        {spell.mysteries && spell.mysteries.length > 0 && <Text mb={0}>Mystery: {spell.mysteries.map(value => `${value.mystery.name} (${value.class_level}) ${value.note === null ? "" : `(${value.note})`}`).join(", ")}</Text>}
        <Text mb={0}>Casting Time: {spell?.casting_time}</Text>
        {spell.targets !== null && <Text mb={0}>Target: {spell?.targets}</Text>}
        <Text mb={0}>Range: {spell.range}</Text>
        {spell.area && <Text mb={0}>Area: {spell.area}</Text>}
        <Text mb={0}>Duration: {spell.duration} {spell.dismissible && "[D]"}</Text>
        <Text mb={0}>Saving Throw: {spell.saving_throw ?? "None"}</Text>
        <Text mb={0}>Spell Resistance: {spell.spell_resistance ?? "no"}</Text>
        <Group gap="xs" mb="xs">
            {spell.somatic && <Badge size="xs" color="green">Somatic</Badge>}
            {spell.verbal && <Badge size="xs" color="green">Verbal</Badge>}
            {spell.material && <Badge size="xs" color="blue">Material {spell.component_costs !== null && `${spell.component_costs}gp`}</Badge>}
            {spell.focus && <Badge size="xs" color="blue">Focus</Badge>}
            {spell.divine_focus && <Badge size="xs" color="pink">Divine Focus</Badge>}
        </Group>
    </>;
}

const SpellModal: FC<{
    spellId: string;
    opened: boolean;
    close: () => void;
}> = (props) => {
    const { spellId } = props;
    const [spell] = trpc.pathfinder.spell.get.useSuspenseQuery({ id: spellId });
    const navigate = useNavigate();

    const onClose = () => {
        navigate("../spell");
        props.close();
    };

    return <Modal
        opened={props.opened}
        onClose={onClose}
        size="lg"
        title={spell.name}
        centered
        overlayProps={{
            transitionProps: {
                duration: 300,
                exitDuration: 300,
            },
            blur: 5,
        }}
    >
        <SpellEntries spell={spell} />
        <Text c="dimmed">{spell.description}</Text>
        {spell.mythic_text && <Text c="dimmed"><strong>Mythic</strong>: {spell.mythic_text}</Text>}
        {spell.augmented && <Text c="dimmed"><strong>Augmented</strong>: {spell.augmented}</Text>}

        <Group justify="space-between" mt="sm">
            <Text>Sourcebook: {spell.sourcebook}</Text>
            {spell.link && <Button component="a" href={spell.link} target="_blank">Archive of Nethys</Button>}
        </Group>
    </Modal>;
}

type FilterType = Omit<RouterInputs["pathfinder"]["spell"]["find"], "cursor" | "pageLength">;

const SpellGrid: FC<{
    input: FilterType,
    onClick: (id: string) => void,
}> = ({ input, onClick }) => {
    const { ref, inViewport } = useInViewport();
    const [data, query] = trpc.pathfinder.spell.find.useSuspenseInfiniteQuery(input, {
        getNextPageParam: (lastPage) => lastPage.currentPage * lastPage.pageLength < lastPage.count ? lastPage.currentPage + 1 : undefined,
        initialCursor: 0,
    });

    useLazyEffect(() => {
        if (inViewport && query.hasNextPage) {
            query.fetchNextPage();
        }
    }, [query, inViewport], 200);

    return <>
        <SimpleGrid mt="md" cols={{ base: 1, md: 2, lg: 3 }}>
            {data.pages.map((page, index) => <Fragment key={index}>
                {page.spells.map(spell => <Card
                    key={spell.id}
                    classNames={{
                        root: classes.root,
                    }}
                    onClick={() => onClick(spell.id)}
                >
                    <Text fw={500} mb={0}>{spell.name}</Text>
                    <SpellEntries spell={spell} />
                </Card>)}
            </Fragment>)}
        </SimpleGrid>
        <div ref={ref}></div>
    </>;
}

const FilterModal: FC<{
    input: FilterType,
    onInputChange: (input: FilterType) => void,
    opened: boolean;
    close: () => void;
}> = ({ input, onInputChange, opened, close }) => {
    const [{ schools }] = trpc.pathfinder.spell.school.list.useSuspenseQuery();
    const [{ subschools }] = trpc.pathfinder.spell.subschool.list.useSuspenseQuery();
    const [{ classes }] = trpc.pathfinder.class.list.useSuspenseQuery({ spellcasting: true });
    const [{ domains }] = trpc.pathfinder.domain.list.useSuspenseQuery();
    const [{ subdomains }] = trpc.pathfinder.subdomain.list.useSuspenseQuery();
    const [{ bloodlines }] = trpc.pathfinder.bloodline.list.useSuspenseQuery();
    const [{ patrons }] = trpc.pathfinder.patron.list.useSuspenseQuery();
    const [{ mysteries }] = trpc.pathfinder.mystery.list.useSuspenseQuery();

    return <Modal
        onClose={close}
        opened={opened}
        title="Spell Filters"
        size="lg"
        overlayProps={{
            transitionProps: {
                duration: 300,
                exitDuration: 300,
            },
            blur: 5,
        }}
        centered
    >
        <Group grow>
            <NativeSelect
                label="Spell School"
                value={input.school}
                onChange={e => onInputChange({ ...input, school: e.target.value === "" ? undefined : e.target.value })}
                data={[
                    { label: "Any", value: "" },
                    ...schools.map(item => ({ label: item.name, value: item.id })),
                ]}
            />
            <NativeSelect
                label="Spell Subschool"
                value={input.subschool}
                onChange={e => onInputChange({ ...input, subschool: e.target.value === "" ? undefined : e.target.value })}
                data={[
                    { label: "Any", value: "" },
                    ...subschools.map(item => ({ label: item.name, value: item.id })),
                ]}
            />
        </Group>
        <Group grow>
            <NativeSelect
                label="Spellcasting Class"
                value={input.class}
                onChange={e => onInputChange({ ...input, class: e.target.value === "" ? undefined : e.target.value })}
                data={[
                    { label: "Any", value: "" },
                    ...classes.map(item => ({ label: item.name, value: item.id })),
                ]}
            />
            <NativeSelect
                label="Spell Level"
                value={input.spellLevel?.toString()}
                onChange={e => onInputChange({ ...input, spellLevel: e.target.value === "" ? undefined : parseInt(e.target.value) })}
                data={[
                    { label: "All", value: "" },
                    { label: "Cantrip/Orison", value: "0" },
                    { label: "1st Level", value: "1" },
                    { label: "2st Level", value: "2" },
                    { label: "3st Level", value: "3" },
                    { label: "4st Level", value: "4" },
                    { label: "5st Level", value: "5" },
                    { label: "6st Level", value: "6" },
                    { label: "7st Level", value: "7" },
                    { label: "8st Level", value: "8" },
                    { label: "9st Level", value: "9" },
                ]}
            />
        </Group>
        <Group grow>
            <NativeSelect
                label="Divine Domain"
                value={input.domain}
                onChange={e => onInputChange({ ...input, domain: e.target.value === "" ? undefined : e.target.value })}
                data={[
                    { label: "Any", value: "" },
                    ...domains.map(item => ({ label: item.name, value: item.id })),
                ]}
            />
            <NativeSelect
                label="Divine Subdomain"
                value={input.subdomain}
                onChange={e => onInputChange({ ...input, subdomain: e.target.value === "" ? undefined : e.target.value })}
                data={[
                    { label: "Any", value: "" },
                    ...subdomains.map(item => ({ label: item.name, value: item.id })),
                ]}
            />
        </Group>
        <Group grow>
            <NativeSelect
                label="Patron"
                value={input.patron}
                onChange={e => onInputChange({ ...input, patron: e.target.value === "" ? undefined : e.target.value })}
                data={[
                    { label: "Any", value: "" },
                    ...patrons.map(item => ({ label: item.name, value: item.id })),
                ]}
            />
            <NativeSelect
                label="Bloodline"
                value={input.bloodline}
                onChange={e => onInputChange({ ...input, bloodline: e.target.value === "" ? undefined : e.target.value })}
                data={[
                    { label: "Any", value: "" },
                    ...bloodlines.map(item => ({ label: item.name, value: item.id })),
                ]}
            />
        </Group>
        <NativeSelect
            label="Mystery"
            value={input.mystery}
            onChange={e => onInputChange({ ...input, mystery: e.target.value === "" ? undefined : e.target.value })}
            data={[
                { label: "Any", value: "" },
                ...mysteries.map(item => ({ label: item.name, value: item.id })),
            ]}
        />
    </Modal>;
};

export const SpellPage: FC = () => {
    const [filterOpened, { open: filterOpen, close: filterClose }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [input, setInput] = useState<FilterType>({});
    const navigate = useNavigate();

    const [debouncedQuery] = useDebouncedValue(input.name, 200);
    const { spellId } = useParams();

    useEffect(() => {
        if (spellId !== undefined) {
            open();
        } else {
            close();
        }

        return () => { };
    }, [opened, open, spellId]);

    return <>
        <Helmet>
            <title>Spell | Database - NumsgilCo Tabletop</title>
        </Helmet>
        <h1>Pathfinder Spells Database</h1>
        <TextInput
            label="Search spell by name"
            value={input.name ?? ""}
            onChange={event => setInput(prev => ({ ...prev, name: event.target.value }))}
            rightSectionWidth="md"
            rightSection={
                <Group gap="xs">
                    {Object.keys(input).length > 0 && <ActionIcon
                        variant="subtle"
                        onClick={() => setInput({})}
                    >
                        <IconX stroke={1.5} />
                    </ActionIcon>}
                    <ActionIcon
                        variant="subtle"
                        onClick={() => filterOpen()}
                    >
                        <IconSettings stroke={1.5} />
                    </ActionIcon>
                </Group>
            }
        />
        <Suspense fallback={<Center h={100}><Loader color="green" size="lg" /></Center>}>
            <SpellGrid input={{ ...input, name: debouncedQuery }} onClick={id => navigate(`./${id}`)} />
        </Suspense>
        {spellId && <Suspense fallback={
            <Portal>
                <Overlay fixed>
                    <Center h="100%">
                        <Loader color="green" size="xl" />
                    </Center>
                </Overlay>
            </Portal>
        }>
            <SpellModal spellId={spellId} opened={opened} close={close} />
        </Suspense>}

        <Suspense>
            <FilterModal input={input} onInputChange={newInput => setInput(prev => ({ ...prev, ...newInput }))} opened={filterOpened} close={filterClose} />
        </Suspense>
    </>;
};
