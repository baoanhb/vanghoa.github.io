"use strict";

// main script //
const navitemsampl = document.querySelectorAll('nav ul li[onclick="nav_navigate(this)"]');
const navitemobj = [
    { //0 Kasper
        dg_pro : false,
        print : true,
        gr_co : true,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
    { //1 Vietnamme mag
        dg_pro : true,
        print : false,
        gr_co : true,
        mo_gra : false,
        illus : true,
        spcl : false,
        time : true,
    },
    { //2 Tabao Tammy
        dg_pro : false,
        print : true,
        gr_co : true,
        mo_gra : false,
        illus : true,
        spcl : false,
        time : true,
    },
    { //3 Liturgical calendar
        dg_pro : false,
        print : true,
        gr_co : true,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
    { //4 Mac gi?
        dg_pro : false,
        print : false,
        gr_co : true,
        mo_gra : true,
        illus : false,
        spcl : true,
        time : true,
    },
    { //5 3D markup
        dg_pro : true,
        print : false,
        gr_co : true,
        mo_gra : false,
        illus : false,
        spcl : true,
        time : true,
    },
    { //6 Love is hard
        dg_pro : true,
        print : false,
        gr_co : true,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
    { //7 Sese
        dg_pro : true,
        print : false,
        gr_co : true,
        mo_gra : true,
        illus : true,
        spcl : false,
        time : true,
    },
    { //8 Duolingo
        dg_pro : true,
        print : false,
        gr_co : true,
        mo_gra : true,
        illus : true,
        spcl : false,
        time : true,
    },
    { //9 Khoi Minh
        dg_pro : true,
        print : false,
        gr_co : false,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
    { //10 Misc projects
        dg_pro : false,
        print : false,
        gr_co : true,
        mo_gra : false,
        illus : true,
        spcl : false,
        time : true,
    },
    { //11
        dg_pro : false,
        print : false,
        gr_co : false,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
    { //12
        dg_pro : false,
        print : false,
        gr_co : false,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
    { //13
        dg_pro : false,
        print : false,
        gr_co : false,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
    { //14
        dg_pro : false,
        print : false,
        gr_co : false,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
    { //15
        dg_pro : false,
        print : false,
        gr_co : false,
        mo_gra : false,
        illus : false,
        spcl : false,
        time : true,
    },
]

let navitem = [[], [], []];
let hovercheck = [true, true, true];

// initialise //
for (let key in navitemobj) {
    let item = navitemsampl[key];
    navitemobj[key].elem = item;
    navitem[Math.floor(key/soitemperscreen)].push(item);
    if (!touchable) {item.addEventListener("mouseleave", hover_out);}
}

const ulnav = document.querySelector('ul#nav');
const projfr = ulnav.querySelector('section#iframe');
const wlcmscr = ulnav.querySelector('section#welcome');
const homebtn = ulnav.querySelector('.btn[onclick="homescreen()"]');
const seemorebtn = ulnav.querySelector('.btn[onclick="seemore()"]');
const seemorenav = document.querySelectorAll('.seemore');
const sortbtn = document.querySelectorAll('.seemore button');
const ckbx = ulnav.querySelector('label#tglnav input');

let smallersd;
let smallersd_min;

projfr.querySelector('iframe').addEventListener('transitionend', nav_navigate_event);

// navbar construction // 
onresizesortbtn();
nav_construct(0);

// on resize //
window.onresize = _.debounce(function() {
    // media change => get navbar
    navsz = +proproot.getPropertyValue('--navsz').slice(0, -2);
    // scrollbar width
    scrlbrwd = getScrollbarWidth();
    rootstyle.setProperty('--scrlbrwd', `${scrlbrwd}px`);
    // offsetiframe width
    offsetifr = navsz*2 + scrlbrwd + 1 + (!touchable ? +hbhave.slice(0,-2) : 0) * 2 + 8;
    ifr_widthfit(projfr.querySelector('iframe'));
    // stroke3d width
    hbhmax = proproot.getPropertyValue('--hbhwidth_max');
    // sort button reorganise
    onresizesortbtn();
    // ios vh fix
    viewportheight();
    nav_construct(crrntnavlist);
}, 1000);

// img lazy load //
if (!touchable) {
    for (let navit of navitemsampl) {
        navit.addEventListener("mouseenter", lazyload);
    }
}

function lazyload(e) {
    let li = e.target;
    let img = li.querySelector('img');

    if (!img) {return;}

    img.src = img.dataset.src;

    li.removeEventListener("mouseenter", lazyload);
}
