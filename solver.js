import { evaluate } from "./guess-game";
import { deepEquals, flatMap, randomElement, repeat, use } from "./util";

const { freeze, create } = Object;


export default freeze(function(alphabet) {
    const combinations =
        flatMap(
            flatMap(
                flatMap(alphabet,
                    (a) => alphabet.map(
                        (b) => alphabet.map(
                            (c) => alphabet.map(
                                (d) => [a, b, c, d]
                            )
                        )
                    )
                )
            )
        );

    const filter = (guesses) => {
        console.log(guesses)

        const everyPeg = (condition) => (guess) => guess.pegs.every(condition);
        const notEmpty = everyPeg((peg) => peg !== 0);
        const empty = everyPeg((peg) => peg === 0);

        const remaining = combinations.filter(
            (combi) => guesses
            .filter(notEmpty)
            .every((guess) => deepEquals(
                guess.result,
                use(evaluate(combi, guess.pegs),
                    (result) => [
                        ...repeat(2, result.numBlacks),
                        ...repeat(1, result.numWhites),
                        ...repeat(0, combi.length -
                            result.numBlacks -
                            result.numWhites)
                    ])
            ))
        );

        console.log("remaining", remaining);
        if (guesses.find(empty)) {
            console.log("empty", guesses.find(empty).pegs = randomElement(remaining))
        }
    };

    return create({
        step: (game) => {
            console.log("step", game);
            filter(game.guesses());

            console.log(
                deepEquals(1, 1),
                deepEquals(1, 2),
                deepEquals({ a: 1, b: 2 }, { a: 1, c: 2 }),
                deepEquals({ a: 1, b: 2 }, { a: 1, b: 2 }),
                deepEquals({ a: 1, b: 2 }, { a: 1, b: 3 })
            );

        }
    });
});