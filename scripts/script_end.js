"use strict";

// main script //
const navitem = document.querySelectorAll('nav ul li:not(#main)');
const projfr = document.querySelector('iframe');

// navbar construction // 
nav_construct();
window.onresize = function() { nav_construct(); ifr_widthfit()}

