import { style } from '@vanilla-extract/css';
import { vars } from 'theme';

export const root = style({
    transition: "all .2s",
    color: vars.colors.text,
    backgroundColor: vars.colors.gray[2],
    boxShadow: `0px 0px 10px 2px ${vars.colors.dark[4]}`,

    selectors: {
        "&:hover": {
            textDecoration: "none",
            cursor: "pointer",
            backgroundColor: vars.colors.gray[4],
            boxShadow: `0px 0px 10px 4px ${vars.colors.dark[6]}`,
        },

        [vars.darkSelector]: {
            backgroundColor: vars.colors.dark[4],
            boxShadow: `0px 0px 10px 2px ${vars.colors.dark[6]}`,
        },

        [`${vars.darkSelector}:hover`]: {
            backgroundColor: vars.colors.dark[3],
            boxShadow: `0px 0px 10px 4px ${vars.colors.dark[3]}`,
        }
    },
});
