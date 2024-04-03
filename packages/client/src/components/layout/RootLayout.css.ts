import { style } from '@vanilla-extract/css';
import { vars } from 'theme';

export const header = style({
    backgroundColor: vars.colors.green[4],

    selectors: {
        [vars.darkSelector]: {
            backgroundColor: vars.colors.green[9],
        },
    },
});

export const navbar = style({
    backgroundColor: vars.colors.green[4],

    selectors: {
        [vars.darkSelector]: {
            backgroundColor: vars.colors.green[9],
        },
    },
});

export const main = style({
});

export const colorButton = style({
    backgroundColor: vars.colors.green[9],
    color: vars.colors.gray[1],
    border: 0,
    transition: "all .2s",

    selectors: {
        "&:hover": {
            backgroundColor: vars.colors.green[4],
            color: vars.colors.dark[4],
        },

        [vars.darkSelector]: {
            backgroundColor: vars.colors.green[4],
            color: vars.colors.dark[4],
        },

        [`${vars.darkSelector}:hover`]: {
            backgroundColor: vars.colors.green[9],
            color: vars.colors.gray[1],
        }
    },
});
