import { IconSun, IconMoon, IconHome, IconSwords, IconKarate, IconUsers, IconDice, IconDatabase, IconWand, IconNotes, IconArrowUp } from '@tabler/icons-react';
import { AppShell, Burger, Group, Text, ActionIcon, useMantineColorScheme, ScrollArea, Affix, Transition, Button, rem } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { FC, PropsWithChildren } from "react";

import { RouterNavLink } from 'components';
import * as classes from "./RootLayout.css";

export const RootLayout: FC<PropsWithChildren> = ({ children }) => {
    const { toggleColorScheme, colorScheme } = useMantineColorScheme();
    const [opened, { toggle }] = useDisclosure();
    const [scroll, scrollTo] = useWindowScroll();

    return <AppShell
        classNames={{
            header: classes.header,
            navbar: classes.navbar,
            main: classes.main,
        }}
        header={{
            height: 60,
        }}
        navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
        }}
        withBorder={false}
        padding="md"
    >
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="md"
                />
                <Text
                    size="xl"
                    mb={0}
                    fw="bold"
                >
                    Numsgil Co
                </Text>
                <ActionIcon
                    onClick={() => toggleColorScheme()}
                    variant="default"
                    size="lg"
                    ml="auto"
                    aria-label="Toggle color scheme"
                    classNames={{
                        root: classes.colorButton,
                    }}
                >
                    {colorScheme === "dark" && <IconSun stroke={1.5} />}
                    {colorScheme === "light" && <IconMoon stroke={1.5} />}
                </ActionIcon>
            </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
            <AppShell.Section>Navbar header</AppShell.Section>
            <AppShell.Section grow my="md" component={ScrollArea}>
                <RouterNavLink label="Home" to="/" leftSection={<IconHome size="1rem" stroke={1.5} />} />
                <RouterNavLink label="Database" leftSection={<IconDatabase size="1rem" stroke={1.5} />}>
                    <RouterNavLink label="Spell" to="/database/spell" leftSection={<IconWand size="1rem" stroke={1.5} />} />
                    <RouterNavLink label="Feat" to="/database/feat" leftSection={<IconNotes size="1rem" stroke={1.5} />} />
                </RouterNavLink>
                <RouterNavLink label="Combat" leftSection={<IconSwords size="1rem" stroke={1.5} />}>
                    <RouterNavLink label="Party" to="/combat/party" leftSection={<IconUsers size="1rem" stroke={1.5} />} />
                    <RouterNavLink label="Encounter" to="/combat/encounter" leftSection={<IconKarate size="1rem" stroke={1.5} />} />
                    <RouterNavLink label="Initiative" to="/combat/initiative" leftSection={<IconDice size="1rem" stroke={1.5} />} />
                </RouterNavLink>
            </AppShell.Section>
            <AppShell.Section>Navbar footer - always at the bottom</AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>

            {children}
        </AppShell.Main>
    </AppShell>;
};