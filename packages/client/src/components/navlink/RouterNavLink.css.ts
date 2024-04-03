import { style } from "@vanilla-extract/css";
import { vars } from "theme";

export const root = style({
    transition: "all .2s",
    color: vars.colors.black,
    textDecoration: "none",

    selectors: {
        "&:hover": {
            textDecoration: "none",
        },

        [vars.darkSelector]: {
            color: vars.colors.gray[1],
        },

        [`${vars.darkSelector}:hover`]: {
        }
    },
});