import { histogram, print, randomElement, range, use } from "./util";

const { keys, assign } = Object;
const { min, ceil, trunc, random } = Math;

export const genGame = function(alphabet, numPegs, numTries) {
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
        const guessedHist = histogram(guesses[guess].pegs);
        const solutionHist = histogram(solution);

        const numWhites = keys(solutionHist)
            .map(key => min(solutionHist[key], guessedHist[key] || 0))
            .reduce((acc, v) => acc + v, 0) - numBlacks;

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