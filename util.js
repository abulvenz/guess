const { keys, assign } = Object;
const { min, ceil, trunc, random } = Math;

export const range = (N = 0, S = 0, r = []) => (
    N === S ?
    r :
    range(N, S + 1, [...r, S]));
export const randomElement = (arr = []) => arr[trunc(random() * arr.length)];
export const use = (v, fn) => fn(v);
export const histogram = (arr = []) => arr.reduce((acc, v) => assign(acc, {
    [v]: (acc[v] || 0) + 1
}), {});

export const print = arr => JSON.stringify(arr);
export const repeat = (arr = "", n = 0) => range(n).map(() => arr);
export const flatMap = (arr = [], fn = (e) => e) => arr
    .reduce((acc, v) => acc.concat(fn(v)), []);

export const deepEquals = (o1, o2) => use(o1 === o2 ?
    true :
    !o1 || !o2 ?
    false :
    typeof(o1) !== typeof(o2) ? false :
    typeof(o1) === 'object' ?
    (keys(o1).length !== keys(o2).length ? false :
        keys(o1).every(k => deepEquals(o1[k], o2[k]))) :
    o1 === o2, res => res)