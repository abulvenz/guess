const { min, max, trunc, random } = Math;
const { create } = Object;

const range = function(start = 0, end = 0, r = []) {
    for (
        let i = start;
        ((start < end) ? (i <= end) : (i >= end)); i += (start < end ? 1 : -1)
    ) r.push(i);
    return r;
};

const from = (S) => create({
    to: (N) => range(S, N)
});
const flatMap = (arr, fn = (e) => e) => arr.reduce((acc, v) => acc.concat(fn(v)), []);

const repeat = (arr, n) => range(n).map(() => arr);

const alphabet = from(1).to(6);
const randomElement = (arr) => arr[trunc(random() * arr.length)];

const combinations =
    flatMap(
        flatMap(
            flatMap(alphabet,
                a => alphabet.map(
                    b => alphabet.map(
                        c => alphabet.map(
                            d => [a, b, c, d]
                        )
                    )
                )
            )
        )
    );

const game = function(numPegs = 4, numTries = 10) {
    const code = from(1).to(numPegs)
        .map(() => randomElement(alphabet));
    return {
        code
    }
};

console.log(game());