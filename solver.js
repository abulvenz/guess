import { evaluate } from "./guess-game";
import treef from "./tree";
import { deepEquals, flatMap, randomElement, repeat, use, range, histogram } from "./util";

const { freeze, create, assign, keys } = Object;
const { max } = Math;

const pushed = (arr, a) => [...arr, a];

const appended = (postfix = [], r = [[]]) =>
    postfix.flatMap(a =>
        r.map(arr => pushed(arr, a)));

const permute = (N, alphabet, res = [[]]) =>
    N === 0
        ? res
        : permute(N - 1, alphabet, appended(alphabet, res));

const index = (result) => result.numBlacks + "+" + result.numWhites;

export default freeze(function (N, alphabet) {
    const combinations =
        permute(N, alphabet);

    const treeNode = (remaining) => {
        const content = {

        };

        if (remaining.length === 1) {
            content.combi = remaining[0];
            content.toString = (indent = "") =>
                content.combi
        } else {

            let minCombi = undefined;
            let minMaxDepth = combinations.length;
            let minR = undefined;

            combinations.forEach(combi => {
                const r = remaining.reduce((acc, solution) => {
                    const result = evaluate(combi, solution);
                    const idx = index(result);
                    acc[idx] = pushed(acc[idx] || [], solution);
                    return acc;
                }, {});

                const maxi = keys(r).map(k => r[k].length).reduce((a, b) => max(a, b));

                if (maxi < minMaxDepth) {
                    minMaxDepth = maxi;
                    minCombi = combi;
                    minR = r;
                }
            });

            content.solutions = {};
            content.combi = minCombi;

            keys(minR).forEach(k => {
                if (k !== N + "+0")
                    content.solutions[k] = treeNode(minR[k]);
                else content.solutions[k] = "Solved"
            });

            content.toString = (indent = "") => {
                let result = JSON.stringify(minCombi);
                keys(minR).forEach(k => result += "\n" + indent + k + ": " + (content.solutions[k] && content.solutions[k].toString && content.solutions[k].toString(indent + "  ") || "Solved"));
                return result;
            };
        }
        return content;
    };

    const tree =
         treef; 
        // 
       // treeNode(combinations);

    const filter = (guesses, options = combinations) => {

        console.log(guesses)

        const everyPeg = (condition) => (guess) => guess.pegs.every(condition);
        const notEmpty = everyPeg((peg) => peg !== 0);
        const empty = everyPeg((peg) => peg === 0);

        let ct = tree;

        guesses
            .filter(notEmpty)
            .forEach(guess => {
                const r = use(histogram(guess.result), h => ({ numBlacks: h[2] || 0, numWhites: h[1] || 0 }));
                ct = ct.solutions[index(r)];
            });

        if (guesses.find(empty)) {
            console.log("empty", guesses.find(empty).pegs = ct.combi)
        }

        return ct && ct.solutions && keys(ct.solutions).length || 0;
    };

    return create({
        step: (game) => {
            console.log("step", game);
            const res = filter(game.guesses());

            console.log(
                deepEquals(1, 1),
                deepEquals(1, 2),
                deepEquals({ a: 1, b: 2 }, { a: 1, c: 2 }),
                deepEquals({ a: 1, b: 2 }, { a: 1, b: 2 }),
                deepEquals({ a: 1, b: 2 }, { a: 1, b: 3 })
            );
            return res;
        }
    });
});