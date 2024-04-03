import { subdomainRouter } from "./subdomainRouter";
import { bloodlineRouter } from "./bloodlineRouter";
import { mysteryRouter } from "./mysteryRouter";
import { patronRouter } from "./patronRouter";
import { domainRouter } from "./domainRouter";
import { classRouter } from "./classRouter";
import { spellRouter } from "./spellRouter";
import { router } from "trpc";

export const pathfinderRouter = router({
    subdomain: subdomainRouter,
    bloodline: bloodlineRouter,
    mystery: mysteryRouter,
    patron: patronRouter,
    domain: domainRouter,
    spell: spellRouter,
    class: classRouter,
});
