import m from "mithril";
import tagl from "tagl-mithril";
import { genGame } from "./guess-game";
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
let showColors = false;



const model = {
    game: genGame(alphabet, numPegs, numTries)
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
                        )
                    )
                ), td(
                    table.field(
                        model.game.guesses().map(
                            (guess, idx) =>
                            use(idx === model.game.current(), current =>
                                tr.peg[current ? "current" : ""](
                                    guess.pegs.map(
                                        (peg, idx) => td.peg[`peg${peg}`](
                                            current ? { onclick: () => guess.pegs[idx] = (guess.pegs[idx] + 1) % alphabet.length } : {},
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