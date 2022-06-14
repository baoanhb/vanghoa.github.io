"use strict";

// local function //
function ifr_widthfit() {
    let projfr_body = projfr.contentWindow.document.body;
    projfr_body.style.width = `${window.innerWidth - navsz*2 - getScrollbarWidth()}px`;
}

function nav_construct() {
    soitem[0] = soitem[1] = soitem[2] = soitem[3] = Math.round(navitem.length/4);
    soitem[rnd_int(0, 3)] = navitem.length - soitem[0]*3;

    let postop = generatepos(soitem[0], true, true); 
    let posleft = generatepos(soitem[1], false, true); 
    let posright = generatepos(soitem[2], false, false); 
    let posbot = generatepos(soitem[3], true, false); 
    let posarray = arr_sffl(postop.concat(posleft, posright, posbot)); cl(posarray);

    navitem.forEach((item, index) => {
        delaypromise = delaypromise.then(function () {
            let positem = posarray[index];
            item.removeAttribute("style");
            item.classList.remove('li_col', 'li_row');
            item.style.gridColumn = positem.col;
            item.style.gridRow = positem.row;
            item.style[`${positem.colcheck ? 'alignSelf' : 'justifySelf'}`] = positem.initcheck ? 'start' : 'end';
            item.classList.add(`${positem.colcheck ? 'li_col' : 'li_row'}`);
            // promise delay
            return new Promise(function (resolve) {
              setTimeout(resolve, time_interval);
            });
        });
    })
}

function generatepos(soitemmoicanh, colcheck, initcheck) {
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

function nav_navigate(item) {
    projfr.setAttribute('src', `project_pages/project_${item.getAttribute('id')}.html`);
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

