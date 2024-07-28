import { TextInput, SimpleGrid, Card, Group, Text, Badge, Modal, Button, ActionIcon, Overlay, Loader, Portal, Center, NativeSelect } from '@mantine/core';
import { useDisclosure, useDebouncedValue, useInViewport } from "@mantine/hooks";
import { FC, useState, useEffect, Suspense, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconSettings, IconX } from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';

import { trpc, type RouterOutputs, RouterInputs } from 'trpc';
import { useLazyEffect } from 'utils';
import * as classes from "./Feat.css";

const FeatEntries: FC<{ feat: RouterOutputs["pathfinder"]["feat"]["get"] }> = ({ feat }) => {
    return <>
        <Group gap="xs" mb="sm">
            {feat.type.map((value, index) => <Badge key={index} size="xs" color="pink">{value}</Badge>)}
            {feat.multiples && <Badge size="xs" color="green">Multiples</Badge>}
        </Group>
        {feat.prerequisites && <Text mb={0} size="sm" c="dimmed"><b>Prerequisites</b>: {feat.prerequisites}</Text>}
        <Text mb={0}>{feat.description}</Text>
        <Text mb={0} c="dimmed"><b>Source</b>: {feat.source}</Text>
    </>;
}

const FeatModal: FC<{
    featId: string;
    opened: boolean;
    close: () => void;
}> = (props) => {
    const { featId } = props;
    const [feat] = trpc.pathfinder.feat.get.useSuspenseQuery({ id: featId });
    const navigate = useNavigate();

    const onClose = () => {
        navigate("../feat");
        props.close();
    };

    return <Modal
        opened={props.opened}
        onClose={onClose}
        size="lg"
        title={feat.name}
        centered
        overlayProps={{
            transitionProps: {
                duration: 300,
                exitDuration: 300,
            },
            blur: 5,
        }}
    >
        <FeatEntries feat={feat} />
        <Text><b>Benefit</b>: {feat.benefit}</Text>
        {feat.normal && <Text><b>Normal</b>: {feat.normal}</Text>}
        {feat.special && <Text><b>Special</b>: {feat.special}</Text>}
    </Modal>;
}

type FilterType = Omit<RouterInputs["pathfinder"]["feat"]["find"], "cursor" | "pageLength">;

const FeatGrid: FC<{
    input: FilterType,
    onClick: (id: string) => void,
}> = ({ input, onClick }) => {
    const { ref, inViewport } = useInViewport();
    const [data, query] = trpc.pathfinder.feat.find.useSuspenseInfiniteQuery(input, {
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
                {page.feats.map(feat => <Card
                    key={feat.id}
                    classNames={{
                        root: classes.root,
                    }}
                    onClick={() => onClick(feat.id)}
                >
                    <Text fw={500} mb={0}>{feat.name}</Text>
                    <FeatEntries feat={feat} />
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
    const types = [
        "General",
        "Combat",
        "Item creation",
        "Metamagic",
        "Monster",
        "Grit",
        "Panache",
        "Achievement",
        "Story",
        "Mythic",
        "Familiar",
        "Teamwork",
        "Meditation",
        "Conduit",
        "Critical",
        "Style",
        "Performance",
        "Racial",
        "Companion/Familiar",
        "Betrayal",
        "Targeting",
        "Esoteric",
        "Stare",
        "Weapon mastery",
        "Item mastery",
        "Armor mastery",
        "Shield mastery",
        "Blood hex",
        "Trick",
    ];

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
        <NativeSelect
            label="Feat type"
            value={input.type}
            onChange={e => onInputChange({ ...input, type: e.target.value === "" ? undefined : e.target.value as FilterType["type"] })}
            data={[
                { label: "Any", value: "" },
                ...types.map(item => ({ label: item, value: item })),
            ]}
        />
    </Modal>;
};

export const FeatPage: FC = () => {
    const [filterOpened, { open: filterOpen, close: filterClose }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [input, setInput] = useState<FilterType>({});
    const navigate = useNavigate();

    const [debouncedQuery] = useDebouncedValue(input.name, 200);
    const { featId } = useParams();

    useEffect(() => {
        if (featId !== undefined) {
            open();
        } else {
            close();
        }

        return () => { };
    }, [opened, open, featId]);

    return <>
        <Helmet>
            <title>Feat | Database - NumsgilCo Tabletop</title>
        </Helmet>
        <h1>Pathfinder Feats Database</h1>
        <TextInput
            label="Search feat by name"
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
            <FeatGrid input={{ ...input, name: debouncedQuery }} onClick={id => navigate(`./${id}`)} />
        </Suspense>
        {featId && <Suspense fallback={
            <Portal>
                <Overlay fixed>
                    <Center h="100%">
                        <Loader color="green" size="xl" />
                    </Center>
                </Overlay>
            </Portal>
        }>
            <FeatModal featId={featId} opened={opened} close={close} />
        </Suspense>}

        <Suspense>
            <FilterModal input={input} onInputChange={newInput => setInput(prev => ({ ...prev, ...newInput }))} opened={filterOpened} close={filterClose} />
        </Suspense>
    </>;
};
