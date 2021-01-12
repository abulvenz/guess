import m from "mithril";
import tagl from "tagl-mithril";

const { div, table, tr, td } = tagl(m);
const { keys, assign } = Object;
const { min, ceil, trunc, random } = Math;

const range = (N = 0, S = 0, r = []) => (
    N === S ?
    r :
    range(N, S + 1, [...r, S]));
const randomElement = (arr = []) => arr[trunc(random() * arr.length)];
const use = (v, fn) => fn(v);

// const numColors = 8;
// const numTries = 12;
// const numPegs = 5;

const numColors = 6;
const numTries = 10;
const numPegs = 4;

const alphabet = range(numColors + 1, 1);
let showColors = false;

const histogram = (arr) => arr.reduce((acc, v) => assign(acc, {
    [v]: (acc[v] || 0) + 1
}), {});

const print = arr => JSON.stringify(arr);

const genGame = function(alphabet, numPegs, numTries) {
    const solution = range(numPegs).map(() => randomElement(alphabet));
    const guesses = range(numTries).map(() => assign({
        pegs: range(numPegs).map(() => 0),
        result: range(numPegs).map(() => 0),
    }));
    let guess = 0;
    const login = () => {
        if (guesses[guess].pegs.some(p => p === 0))
            return;

        const numBlacks = guesses[guess].pegs.filter((peg, idx) => peg === solution[idx]).length;

        const incorrectPegs = histogram(guesses[guess].pegs.filter((peg, idx) => peg !== solution[idx]));

        const remaining = histogram(solution.filter((peg, idx) => peg !== guesses[guess].pegs[idx]));

        const numWhites = keys(remaining)
            .map(key => min(remaining[key], incorrectPegs[key] || 0))
            .reduce((acc, v) => acc + v, 0);

        console.log("---------------------\nsolution ", print(solution));
        console.log("guess ", print(guesses[guess].pegs));
        console.log("blacks ", numBlacks);
        console.log("incorrectPegs ", print(incorrectPegs));
        console.log("remaining ", print(remaining));

        guesses[guess].result = [
            ...range(numBlacks).map(() => 2),
            ...range(numWhites).map(() => 1),
            ...range(numPegs - numBlacks - numWhites).map(() => 0)
        ];

        if (numBlacks < numPegs) {
            guess += 1;
        } else {
            guess = -1;
        }
    };

    const won = () => guess === -1;
    return {
        next: col => use(
            guesses[guess].pegs.findIndex(e => e === 0),
            (idx) => idx >= 0 ? guesses[guess].pegs[idx] = col : login()
        ),
        guesses: () => guesses,
        solution: () => solution.map(e => won() ? e : 0),
        login,
        won,
        current: () => guess
    };
};

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
                                        peg => td.peg[`peg${peg}`](showColors ? peg : "")
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