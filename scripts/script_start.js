"use strict";

// constant //
const minsz = 7;
const time_interval = 200;

const proproot = getComputedStyle(document.querySelector(':root'));
const navsz = +proproot.getPropertyValue('--navsz').slice(0, -2);
const colmax = +proproot.getPropertyValue('--colmax') + 2;
const rowmax = +proproot.getPropertyValue('--rowmax') + 2;
const soitem = new Array(4);

// variable //
let delaypromise = Promise.resolve();