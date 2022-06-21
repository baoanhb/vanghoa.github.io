"use strict";

// constant //
const minsz = 9;
const time_interval = 200;

const root = document.querySelector(':root');

const proproot = getComputedStyle(root);
const navsz = +proproot.getPropertyValue('--navsz').slice(0, -2);
const navszhover = +proproot.getPropertyValue('--navszhover').slice(0, -2);
const paddingli = +proproot.getPropertyValue('--paddingli').slice(0, -2);
const colmax = +proproot.getPropertyValue('--colmax') + 2;
const rowmax = +proproot.getPropertyValue('--rowmax') + 2;
//
const rootstyle = root.style;
const hbhmin = proproot.getPropertyValue('--hbhwidth_min');
let hbhmax = proproot.getPropertyValue('--hbhwidth_max');
const hbhave = proproot.getPropertyValue('--hbhwidth_ave');
//
const soitem = new Array(4);
const ofstscrlrow = (navszhover - paddingli * 2) / 2;

// variable //
let delaypromise = Promise.resolve();
let crrntnavlist = 0;
let crrntitemid = '1';

// local function //
function navlist_navigate(next) {
    let navid = next ? ++crrntnavlist : --crrntnavlist;
    if (navid < 0) {navid = navitem.length - 1;}
    if (navid > navitem.length - 1) {navid = 0;}
    nav_construct(navid);
}
//
function nav_construct(id) {
    crrntnavlist = id;

    navitem.forEach((item, index) => {
        if (index == id) {
            item.forEach((itemm) => {
                itemm.style.display = 'auto';
            })
            return;
        }

        item.forEach((itemm) => {
            itemm.style.display = 'none';
        })
    })

    let posarray = posarr_generate(id); cl(posarray);

    navitem[id].forEach((item, index) => {
        delaypromise = delaypromise.then(function () {
            let positem = posarray[index];
            item.removeAttribute("style");
            item.classList.remove('col', 'row', 'left', 'right');

            item.style.gridColumn = positem.col;
            item.style.gridRow = positem.row;
            item.style[`${positem.colcheck ? 'alignSelf' : 'justifySelf'}`] = positem.initcheck ? 'start' : 'end';
            item.classList.add(`${positem.colcheck ? 'col' : 'row'}`);
            item.classList.add(`${positem.sidecheck}`);
            
            if (positem.colcheck & hovercheck[id]) {
                item.addEventListener("mouseenter", positem.initcheck ? hovertop_in : hoverbot_in);
                item.addEventListener("mouseleave", hover_out);
            } else if (hovercheck[id]) {
                item.addEventListener("mouseenter", positem.initcheck ? hoverleft_in : hoverright_in);
                item.addEventListener("mouseleave", hover_out);
            }

            if (index == navitem[id].length - 1) {
                hovercheck[id] = false;
            }

            return new Promise(function (resolve) {
              setTimeout(resolve, time_interval);
            });
        });
    })
}
//
function posarr_generate(index) {
    let soitemmin = Math.floor(navitem[index].length/4);
    let soitemmax_1 = Math.floor((navitem[index].length - soitemmin * 2)/2);
    let soitemmax_2 = Math.ceil((navitem[index].length - soitemmin * 2)/2);
    
    if (innerHeight > innerWidth) {
        soitem[0] = soitem[1] = soitemmin;
        soitem[2] = soitemmax_1;
        soitem[3] = soitemmax_2;
    } else {
        soitem[2] = soitem[3] = soitemmin;
        soitem[0] = soitemmax_1;
        soitem[1] = soitemmax_2;
    }
    
    let postop = pos_generate(soitem[0], true, true); 
    let posbot = pos_generate(soitem[1], true, false);  
    let posleft = pos_generate(soitem[2], false, true); 
    let posright = pos_generate(soitem[3], false, false);
    return postop.concat(posleft, posright, posbot);
}
//
function pos_generate(soitemmoicanh, colcheck, initcheck) {
    if (soitemmoicanh == 0) {return [];}

    let newarr = [2];
    let numbefore = 2 + minsz;
    const max = colcheck ? colmax : rowmax;
    for (let i = 2; i <= soitemmoicanh; i++) {
        numbefore = rnd_int(numbefore, max - (soitemmoicanh - (i-1))*minsz);
        newarr.push(numbefore);
        numbefore+=minsz;
    }
    newarr.push(max);
    
    let rtarr = [];
    newarr.forEach(pos => {
        rtarr.push({
            col : colcheck ? pos : (initcheck ? 1 : colmax),
            row : colcheck ? (initcheck ? 1 : rowmax) : pos,
            colcheck : colcheck ? true : false,
            initcheck : initcheck ? true : false,
        });
    })

    rtarr.forEach((pos, index) => {
        if (index == rtarr.length - 1) {return;}
        let pos_ = rtarr[index];
        let pos_next = rtarr[index+1];
        let left = pos_.col == 2;
        let right = pos_next.col == colmax;

        if (colcheck) {
            pos_.sidecheck =  (left && right) ? 'center_stretch' : (left ? 'left' : (right ? 'right' : 'individual'));
            
            pos_.col = `${pos.col} / ${pos_next.col}`; 
            return;
        }
        pos_.sidecheck = (pos_.col == 1) ? 'left' : 'right';
        pos_.row = `${pos.row} / ${pos_next.row}`;
    })

    rtarr.pop();
    return rtarr;
}
//
function nav_navigate(item) {
    wlcmscr.classList.add('close');
    item.classList.add('current');
    let itemid = item.getAttribute('id');

    if (crrntitemid == itemid) {
        projfr.firstElementChild.contentWindow.scrollTo(0,0);
        return;
    }
    navitemsampl[+crrntitemid - 1].classList.remove('current');

    crrntitemid = itemid;
    let projfr_id = projfr.querySelectorAll('iframe');
    projfr_id[1].setAttribute('src', `project_pages/${itemid}/project_${itemid}.html`);
    projfr_id[0].contentWindow.document.querySelector('#wrapper').classList.add('wrapper');

    projfr_id.forEach((item,index) => {
        item.setAttribute('hidecheck', `${index}`); 
        item.classList.toggle('hide');
    })
}

function nav_navigate_event() {
    let projfr_id = projfr.querySelector('iframe');

    projfr.appendChild(projfr_id);
    projfr_id.setAttribute('src', '');
}
//
function ifr_widthfit(frame) {
    if (!+frame.getAttribute('hidecheck')) {return;}

    frame.contentWindow.document.body.style.width = `${innerWidth - offsetifr}px`;
}
//
function homescreen() {
    wlcmscr.classList.toggle('close');
}
//
function seemore() {
    ulnav.classList.toggle('show');
    for (let item of seemorenav) {
        item.classList.toggle('show');
    }
}

function hovertop_in() {
    rootstyle.setProperty('--hbhwidth_bot',hbhmin);
    rootstyle.setProperty('--hbhwidth_top',hbhmax);
}

function hoverleft_in() {
    rootstyle.setProperty('--hbhwidth_right',hbhmin);
    rootstyle.setProperty('--hbhwidth_left',hbhmax);
}

function hoverright_in() {
    rootstyle.setProperty('--hbhwidth_left',hbhmin);
    rootstyle.setProperty('--hbhwidth_right',hbhmax);
}

function hoverbot_in() {
    rootstyle.setProperty('--hbhwidth_top',hbhmin);
    rootstyle.setProperty('--hbhwidth_bot',hbhmax);
}

function hover_out() {
    rootstyle.setProperty('--hbhwidth_top',hbhave);
    rootstyle.setProperty('--hbhwidth_bot',hbhave);
    rootstyle.setProperty('--hbhwidth_left',hbhave);
    rootstyle.setProperty('--hbhwidth_right',hbhave);
}

// global/reused function //
function cl(x){
    console.log(x);
}

function rnd_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function arr_sffl(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}
  
function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
  
    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);
  
    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
  
    return scrollbarWidth;
}

function csscomputed_prop(itm, prop) {
    return +getComputedStyle(itm).getPropertyValue(`${prop}`).slice(0, -2);
}
