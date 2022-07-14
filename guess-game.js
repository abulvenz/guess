import { histogram, print, randomElement, range, repeat, use } from "./util";

const { keys, assign } = Object;
const { min, ceil, trunc, random } = Math;

export const evaluate = function(solution, guess) {
    const exactMatches = (peg, idx) => peg === solution[idx];
    const numBlacks = guess.filter(exactMatches).length;
    const guessHist = histogram(guess);
    const solutionHist = histogram(solution);
    const numWhites = keys(solutionHist)
        .map((color) => min(solutionHist[color], guessHist[color] || 0))
        .reduce((sum, colorMatches) => sum + colorMatches, 0) - numBlacks;
    return { numBlacks, numWhites };
};

export const genGame = function(alphabet, numPegs, numTries) {
    const solution = range(numPegs).map(() => randomElement(alphabet));
    const guesses = range(numTries).map(() => assign({
        pegs: range(numPegs).map(() => 0),
        result: range(numPegs).map(() => 0),
    }));
    let guess = 0;
    const currentGuess = () => guesses[guess];
    const notSet = (p) => p === 0;
    const login = () => {
        if (currentGuess().pegs.some(notSet)) {
            return;
        }

        const {
            numBlacks,
            numWhites
        } = evaluate(solution, currentGuess().pegs);

        currentGuess().result = [
            ...repeat(2, numBlacks),
            ...repeat(1, numWhites),
            ...repeat(0, numPegs - numBlacks - numWhites)
        ];

        if (numBlacks < numPegs) {
            guess = guess + 1;
        } else {
            guess = -1;
        }
    };

    const won = () => guess === -1;
    return {
        next: col => use(
            currentGuess().pegs.findIndex(e => e === 0),
            (idx) => idx >= 0 ? currentGuess().pegs[idx] = col : login()
        ),
        guesses: () => guesses,
        solution: () => solution.map(e => won() ? e : 0),
        login,
        won,
        current: () => guess
    };
};