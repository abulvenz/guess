import m from "mithril";
import tagl from "tagl-mithril";
import { genGame } from "./guess-game";
import solver from "./solver";
import { histogram, print, randomElement, range, use } from "./util";

const { div, table, tr, td } = tagl(m);
const { keys, assign } = Object;
const { min, ceil, trunc, random } = Math;
// const numColors = 8;
// const numTries = 12;
// const numPegs = 5;

const numColors = 6;
const numTries = 10;
const numPegs = 4;

const alphabet = range(numColors + 1, 1);
let showColors = true;

const model = {
    remaining: null,
    game: genGame(alphabet, numPegs, numTries),
    solver: solver(numPegs,alphabet)
};

m.mount(document.body, {
    view: vnode =>
        table(
            tr(
                td(
                    table(
                        alphabet.map(
                            a => tr.peg(td.peg[`peg${a}`]({
                                onclick: () => model.game.next(a)
                            }))
                        ),
                        tr.peg(td.peg.peg0({
                            onclick: () => {
                                if (!model.game.won()) {
                                    model.remaining = model.solver.step(model.game);
                                    model.game.login();
                                }
                            }
                        },
                            model.remaining
                        ))
                    )
                ), td(
                    table.field(
                        model.game.guesses().map(
                            (guess, idx) =>
                                use(idx === model.game.current(), current =>
                                    tr.peg[current ? "current" : ""](
                                        guess.pegs.map(
                                            (peg, idx) => td.peg[`peg${peg}`](
                                                current ? { onclick: () => guess.pegs[idx] = (guess.pegs[idx] + 1) % (alphabet.length + 1) } : {},
                                                showColors ? peg : "")
                                        ),
                                        td(current ? { onclick: e => model.game.login() } : {},
                                            table(
                                                range(
                                                    trunc(guess.result.length / 2)
                                                ).map(resultRow => tr.result(range(
                                                    ceil(guess.result.length / 2)
                                                ).map(some => use(resultRow * ceil(guess.result.length / 2) + some, p => p < guess.result.length ? td.result[`result${guess.result[p]}`]() : null))))
                                            )
                                        )
                                    )
                                )),
                        tr.peg(
                            model.game.solution().map(
                                peg => td.peg[`peg${peg}`](showColors ? peg : "")
                            ),
                            (model.game.won() ? td({
                                onclick: () =>
                                    model.game = genGame(alphabet, numPegs, numTries)
                            }) : null)
                        )
                    )
                )
            )
        )
});