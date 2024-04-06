import { randomBytes } from "node:crypto";
import * as ohm from 'ohm-js';

const grammar = ohm.grammar(`DiceNotation {
    Formula = AddExp
    AddExp =
        Component "+" MulExp -- plus
        | Component "-" MulExp -- minus
        | MulExp
    MulExp =
        MulExp "*" Component -- time
        | MulExp "/" Component -- div
        | Component

    Component = Die | Number
    Die =
        Number "d" Number "kh" Number -- kh
        | Number "d" Number "kl" Number -- kl
        | Number "d" Number -- simple
    Number = "1".."9" digit*
}`);

function rollDice(qty: number, faces: number): number[] {
    function randomInt(min: number, max: number): number {
        const range = max - min;
        const bytesNeeded = Math.ceil(Math.log2(range) / 8);
        const randomNumber = parseInt(randomBytes(bytesNeeded).toString('hex'), 16);
        return min + (randomNumber % (max - min));
    }

    let rolls: number[] = [];
    for (let i = 0; i < qty; ++i) {
        rolls.push(randomInt(1, faces + 1));
    }
    return rolls;
}

export type DieBreakdown = {
    die: string;
    rolls: number[];
    sum: number;
};

export type RollResult = {
    formula: string;
    total?: number;
    breakdown?: DieBreakdown[];
    message?: string;
};

export function doDiceRoll(formula: string): RollResult {
    const breakdown: DieBreakdown[] = [];

    const semantics = grammar.createSemantics().addOperation('interpret', {
        Formula(e) {
            return e["interpret"]();
        },

        AddExp(e) {
            const result = e["interpret"]();
            return result;
        },

        AddExp_plus(x, _, y) {
            const result = x["interpret"]() + y["interpret"]();
            return result;
        },

        AddExp_minus(x, _, y) {
            const result = x["interpret"]() - y["interpret"]();
            return result;
        },

        MulExp(e) {
            const result = e["interpret"]();
            return result;
        },

        MulExp_time(x, _, y) {
            const result = x["interpret"]() * y["interpret"]();
            return result;
        },

        MulExp_div(x, _, y) {
            const result = x["interpret"]() / y["interpret"]();
            return result;
        },

        Component(e) {
            const result = e["interpret"]();
            return result;
        },

        Die(e) {
            return e["interpret"]();
        },

        Die_simple(_quantity, _, _faces) {
            let rolls = rollDice(_quantity["interpret"](), _faces["interpret"]());
            const sum = rolls.reduce((sum, roll) => sum + roll, 0);;
            breakdown.push({
                die: this.sourceString,
                rolls,
                sum,
            });
            return sum;
        },

        Die_kh(_quantity, _, _faces, _kh, _value) {
            const quantity = _quantity["interpret"]();
            const value = _value["interpret"]();
            let rolls = rollDice(quantity, _faces["interpret"]()).toSorted((a, b) => b - a);
            const effectiveValue = Math.min(value, quantity);

            const sum = rolls.slice(0, effectiveValue).reduce((sum, roll) => sum + roll, 0);
            breakdown.push({
                die: this.sourceString,
                rolls,
                sum,
            });
            return sum;
        },

        Die_kl(_quantity, _, _faces, _kl, _value) {
            const quantity = _quantity["interpret"]();
            const value = _value["interpret"]();
            let rolls = rollDice(quantity, _faces["interpret"]()).toSorted((a, b) => a - b);
            const effectiveValue = Math.min(value, quantity);

            const sum = rolls.slice(0, effectiveValue).reduce((sum, roll) => sum + roll, 0);
            breakdown.push({
                die: this.sourceString,
                rolls,
                sum,
            });
            return sum;
        },

        Number(_1, _2) {
            return parseInt(this.sourceString, 10);
        },
    });

    const result = grammar.match(formula);
    if (result.succeeded()) {
        const total: number = semantics(result)["interpret"]();
        return {
            formula,
            breakdown,
            total,
            message: result.message,
        }
    } else {
        return {
            formula,
            message: result.message,
        };
    }
}
