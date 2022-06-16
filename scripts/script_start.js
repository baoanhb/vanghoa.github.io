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
let crrntnavlist = 0;

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
            item.classList.remove('col', 'row');
            item.style.gridColumn = positem.col;
            item.style.gridRow = positem.row;
            item.style[`${positem.colcheck ? 'alignSelf' : 'justifySelf'}`] = positem.initcheck ? 'start' : 'end';
            item.classList.add(`${positem.colcheck ? 'col' : 'row'}`);
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
    return arr_sffl(postop.concat(posleft, posright, posbot));
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
        if (colcheck) {
            rtarr[index].col = `${pos.col} / ${rtarr[index+1].col}`; return;
        }
        rtarr[index].row = `${pos.row} / ${rtarr[index+1].row}`;
    })

    rtarr.pop();
    return rtarr;
}
//
function nav_navigate(item) {
    wlcmscr.classList.add('close');

    let projfr_id = projfr.querySelectorAll('iframe');
    projfr_id[1].setAttribute('src', `project_pages/project_${item.getAttribute('id')}.html`);

    projfr_id.forEach((item,index) => {
        item.setAttribute('hidecheck', `${index}`); 
        item.classList.toggle('hide');
    })
}

function nav_navigate_event() {
    let projfr_id = projfr.querySelector('iframe');

    projfr.appendChild(projfr_id);
    projfr_id.setAttribute('src', 'about:blank');
}
//
function ifr_widthfit(frame) {
    if (!+frame.getAttribute('hidecheck')) {return;}

    cl(frame);
    frame.contentWindow.document.body.style.width = `${innerWidth - navsz*2 - getScrollbarWidth() - 1}px`;
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

