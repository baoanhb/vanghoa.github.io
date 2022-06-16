"use strict";

// main script //
const navitemsampl = document.querySelectorAll('nav ul li:not(#main, .btn)');
let navitem = [[], [], []];

navitemsampl.forEach((item, index) => {
    navitem[Math.floor(index/6)].push(item);
})

const projfr = document.querySelector('section#iframe');
const wlcmscr = document.querySelector('section#welcome');
const ulnav = document.querySelector('ul#nav');
const seemorenav = document.querySelectorAll('.seemore');

projfr.querySelector('iframe').addEventListener('transitionend', nav_navigate_event);

// navbar construction // 
nav_construct(0);
window.onresize = function() {ifr_widthfit(projfr.querySelector('iframe'));}

