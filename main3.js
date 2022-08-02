import m from "mithril";
import tagl from "tagl-mithril";
import tree from "./tree";
import { range, use } from "./util";

const { div, p, button, table, tr, td, canvas, h1 } = tagl(m);

let combi = null;

const combiC = vnode => ({
    view: vnode => use(vnode.attrs.combi, combi => div.combi(
        combi && combi.map(e => div.elem[`peg${e}`](m.trust('&nbsp;')))
    ))
})

m.mount(document.body, {
    view:
        vnode => div.container(
            combi === null ? [
                div(),
                h1('Hello'),
                p("This is the master minds brain outpost. All possible "
                    + "solutions and pathways leading there have been carefully"
                    + " examined and placed in a look-up table."),
                p("It should not trouble our weary thoughts ever again"
                    + " and has been out-sourced into this evil minion."),
                p("We want to spoil the fun of Master Mind together, right?"),
                button({ onclick: () => combi = tree }, "OK")
            ] : [
                h1("Brain"),h1("Outpost"),
                p("You want to start over?"),
                button({ onclick: () => combi = null }, "Clear"),
                combi.combi ? p("You should now try this combination:") : null,
                m(combiC, { combi: combi.combi }),
                combi.solutions ? [
                    p("Which answer do you get for that one?"),
                    div(Object.keys(combi.solutions).map(result =>
                        use(result.split('+'), frac =>
                            button({ onclick: () => combi = combi.solutions[result], "title": frac[0] + " black " + frac[1] + " white" },
                                div.respeg(
                                    range(+frac[0]).map(e => div.pegb()),
                                    range(+frac[1]).map(e => div.pegw()),
                                    range(4 - +frac[0] - +frac[1]).map(e => div.pegg()),
                                )
                            ))
                    ))
                ] : [combi.combi ? "and win!" : "you already have won"]
            ]
        )
});