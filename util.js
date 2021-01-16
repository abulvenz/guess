const { keys, assign } = Object;
const { min, ceil, trunc, random } = Math;

export const range = (N = 0, S = 0, r = []) => (
    N === S ?
    r :
    range(N, S + 1, [...r, S]));
export const randomElement = (arr = []) => arr[trunc(random() * arr.length)];
export const use = (v, fn) => fn(v);
export const histogram = (arr) => arr.reduce((acc, v) => assign(acc, {
    [v]: (acc[v] || 0) + 1
}), {});

export const print = arr => JSON.stringify(arr);