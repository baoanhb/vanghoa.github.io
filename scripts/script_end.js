"use strict";

// main script //
const navitemsampl = document.querySelectorAll('nav ul li[onclick="nav_navigate(this)"]');
let navitem = [[], [], []];
let hovercheck = [true, true, true];

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
window.onresize = function() {
    ifr_widthfit(projfr.querySelector('iframe'));
    let hbhmax = proproot.getPropertyValue('--hbhwidth_max');
}

for (let navit of navitemsampl) {
    navit.addEventListener("mouseenter", lazyload);
}

function lazyload(e) {
    let li = e.target;
    let img = li.querySelector('img');

    if (!img) {return;}

    img.src = img.dataset.src;
    let div = li.querySelector('div.hovercontent');

    if (li.classList.contains('col')) {
        li.addEventListener('transitionend', colscroll);
    } else if (li.classList.contains('right')) {
        li.addEventListener('transitionend', rowscrollright)
    } else {
        li.addEventListener('transitionend', rowscrollleft)
    }

    li.removeEventListener("mouseenter", lazyload);

    function colscroll(e) { 
        div.scrollTo(0, csscomputed_prop(img, 'height') / 2 - (navszhover - 3*paddingli - csscomputed_prop(div.previousElementSibling, 'height')) / 2);
        //e.target.removeEventListener('transitionend', colscroll);
    }

    function rowscrollright(e) {
        div.scrollTo(csscomputed_prop(img, 'width') / 2 - ofstscrlrow, 0);
        //e.target.removeEventListener('transitionend', rowscrollright);
    }
    
    function rowscrollleft(e) {
        div.scrollTo(0 - (csscomputed_prop(img, 'width') / 2 - ofstscrlrow), 0);
        //e.target.removeEventListener('transitionend', rowscrollleft);
    }
}
