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
    game: genGame(alphabet, numPegs, numTries),
    solver: solver(alphabet)
};

m.mount(document.body, {
    view: vnode => [
        div.game(
            div.colors(
                alphabet.map(
                    a => div.color[`peg${a}`]({
                        onclick: () => model.game.next(a)
                    }))
            ),
            div.field(
                div.guess(
                    div.guessedPeg(), div.guessedPeg(), div.guessedPeg(), div.guessedPeg(),
                    div.result(
                        div.resultPeg1()
                    )
                ),

                model.game.guesses().map(
                    (guess, idx) =>
                    use(idx === model.game.current(), current =>
                        div.guess[current ? "current" : ""](
                            guess.pegs.map(
                                (peg, idx) => div.guessedPeg[`peg${peg}`](
                                    current ? { onclick: () => guess.pegs[idx] = (guess.pegs[idx] + 1) % alphabet.length } : {},
                                    showColors ? peg : "")
                            ),
                            div.result(current ? { onclick: e => model.game.login() } : {},
                                table(
                                    range(guess.result.length).map(
                                        p => div[`result-peg${guess.result[p]}`]()
                                    )
                                )
                            )
                        )),
                    // tr.peg(
                    //     model.game.solution().map(
                    //         peg => td.peg[`peg${peg}`](showColors ? peg : "")
                    //     ),
                    //     (model.game.won() ? td({
                    //         onclick: () =>
                    //             model.game = genGame(alphabet, numPegs, numTries)
                    //     }) : null)
                    // )
                )


            )
        ),
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
                            onclick: () => model.solver.step(model.game)
                        }))
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
    ]
});