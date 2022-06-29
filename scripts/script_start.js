"use strict";
// constant //
let count = 0;
const minsz = 9;
const time_interval = 250;
const soitemperscreen = 6;

// binding
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $create = document.createElement.bind(document);

// binding
const root = document.querySelector(':root');
const proproot = getComputedStyle(root);
const getprop = proproot.getPropertyValue.bind(proproot);

// binding
const rootstyle = root.style;
const setprop = rootstyle.setProperty.bind(rootstyle);

let navsz = +getprop('--navsz_sampl').slice(0, -2);
const navszhover = +getprop('--navszhover').slice(0, -2);
const paddingli = +getprop('--paddingli').slice(0, -2);
const offsetborderstyle = +getprop('--offsetborderstyle').slice(0, -2);
const colmax = +getprop('--colmax') + 2;
const rowmax = +getprop('--rowmax') + 2;
//
const hbhmin = getprop('--hbhwidth_min');
let hbhmax = getprop('--hbhwidth_max');
const hbhave = getprop('--hbhwidth_ave');
let seemoresz = +getprop('--seemoresz').slice(0, -2);
//
const soitem = new Array(4);
const ofstscrlrow = (navszhover - paddingli * 2 - offsetborderstyle * 2) / 2;
//
const r_mouseenter = rmvE_('mouseenter');
const r_transitionend = rmvE_('transitionend');

// variable //
let delaypromise = Promise.resolve();
let crrntnavlist = 0;
let crrntitemid = '1';

// local function //
function nav_construct(id) {
    crrntnavlist = id;

    for (let item of navitemobj) {
        item.elem.style.display = 'none';
    }
    
    if (!touchable) {
        init_border('top');
        init_border('bot');
        init_border('left');
        init_border('right');

        function init_border(check) {
            border_3d[check].removeAttribute("style");
            border_3d[check].style.visibility = 'hidden';
        }
    }

    let posarray = posarr_generate(id);

    let count_ = count;
    
    for (let index in navitem[id]) {
        delaypromise = delaypromise.then(function() {
            if (count != count_) {
                return new Promise(function (resolve) {
                    resolve();
                });
            }

            const item = navitem[id][index];
            const positem = posarray[index];
            const colcheck = positem.colcheck;
            const initcheck = positem.initcheck;
            const sidecheck = positem.sidecheck;

            item.removeAttribute("style");
            item.classList.remove('col', 'row', 'left', 'right', 'top', 'bot', 'horizontal', 'vertical', 'horizontal_ani', 'vertical_ani', 'forward', 'reverse');
            item.style.display = 'auto';
            item.style.gridColumn = positem.col;
            item.style.gridRow = positem.row;
            item.style[`${colcheck ? 'alignSelf' : 'justifySelf'}`] = initcheck ? 'end' : 'start';
            item.classList.add( `${colcheck ? 'col' : 'row'}`, 
                                `${colcheck ? 'horizontal' : 'vertical'}`,
                                `${colcheck ? 'horizontal_ani' : 'vertical_ani'}`,
                                `${colcheck ? (initcheck ? 'forward' : 'reverse') : (sidecheck == 'right' ? 'forward' : 'reverse' )}`,
                                `${colcheck ? (initcheck ? 'top' : 'bot') : 'row'}`, 
                                `${sidecheck}`
                            );
            if (!touchable) {
                let img = item.querySelector('img');
                let class_ = item.className;
                ////////
                if (hovercheck[id]) {
                    if (colcheck) {
                        item.addEventListener("mouseenter", initcheck ? hovertop_in : hoverbot_in);
                        if (img) {item.addEventListener('transitionend', colscroll);}
                    } else {
                        item.addEventListener("mouseenter", initcheck ? hoverleft_in : hoverright_in);
                        if (img) {item.addEventListener("transitionend", initcheck ? rowscrollleft : rowscrollright);}
                    }
                }
                ////////
                if (index == navitem[id].length - 1) {
                    hovercheck[id] = false;
                }
                ////////
                soon_border('top', 'col', 'Top', 'top');
                soon_border('left', 'row', 'Left', 'lr');
                soon_border('right', 'row', 'Right', 'lr');
                soon_border('bot', 'col', 'Bottom', 'bot');
                ////////
                if (img && !img.src) {
                    img.src = img.dataset.src;
                }
                ////////
                function soon_border(check, check_, bor_name, alpha_name) {
                    if (class_.includes(check) && class_.includes(check_)) {
                        if (class_.includes('soon')) {
                            border_3d[check].style[`border${bor_name}Color`] = `rgba(255, 255, 0, var(--${alpha_name}_alpha)`;
                        }
                        border_3d[check].style.visibility = 'visible';
                    }
                }
            }

            return new Promise(function (resolve) {
              setTimeout(resolve, time_interval);
            });
        });
    }
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
    return postop.concat(posright, posbot.reverse(), posleft.reverse());
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

// function button //
function navlist_navigate(next, btn) {
    count++;
    let navid = next ? ++crrntnavlist : --crrntnavlist;
    if (navid < 0) {navid = navitem.length - 1;}
    if (navid > navitem.length - 1) {navid = 0;}
    nav_construct(navid);
}
//
function nav_navigate(item) {
    if (ckbx.checked == true) {return;}

    wlcmscr.classList.add('close');
    item.classList.add('current');
    let itemid = item.getAttribute('id').slice(1);

    if (crrntitemid == itemid) {
        projfr.firstElementChild.contentWindow.scrollTo(0,0);
        return;
    }
    navitemobj[+crrntitemid - 1].elem.classList.remove('current');

    crrntitemid = itemid;
    let projfr_id = projfr.querySelectorAll('iframe');
    projfr_id[1].setAttribute('src', `project_pages/${itemid}/project.html`);
    projfr_id[0].contentWindow.document.querySelector('#wrapper').classList.add('wrapper');

    projfr_id.forEach((item, index) => {
        item.setAttribute('hidecheck', `${index}`); 
        item.classList.toggle('hide');
    })

    if (!touchable && itemid <= availit_num) {
        setprop('--border_img',`url('thumbnail/border/${itemid}.jpg')`);
    }
}
// 
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

    if (!wlcmscr.classList.contains('close')) {
        removeseemore();
    }
}
//
function seemore() {
    ulnav.classList.toggle('show');
    for (let item of seemorenav) {
        item.classList.toggle('show');
    }
    
    if (ckbx.checked == true) {
        ckbx.checked = false;
        togglenav(ckbx);
    }
}
//
function removeseemore() {
    ulnav.classList.remove('show');
    for (let item of seemorenav) {
        item.classList.remove('show');
    }
}
//
function togglenav(ckbx) {
    if (ckbx.checked == true){
        setprop('--navsz','0px');
        setprop('--pad_btn','0px');
        removeseemore();
        offsetifr = offsetifr - navsz*2;
        ifr_widthfit(projfr.querySelector('iframe'));
    } else {
        setprop('--navsz',`var(--navsz_sampl)`);
        setprop('--pad_btn','10px');
        offsetifr = offsetifr + navsz*2;
        ifr_widthfit(projfr.querySelector('iframe'));
    }
}
//
function btn_ani(that, class_ani, horcheck, vercheck, t_, r_) {
    wlcmscr.style.overflow = 'visible';
    let showcheck = ulnav.classList.contains('show');
    let rec = that.getBoundingClientRect();

    setprop(`--lr_${class_ani}`,`${(horcheck ? 0 : innerWidth) - rec.left - (r_ && showcheck ? seemoresz : 0) - (horcheck ? 0 : +getprop('--navsz').slice(0, -2))}px`);
    setprop(`--tb_${class_ani}`,`${(vercheck ? 0 : innerHeight) - rec.top + (t_ && showcheck ? seemoresz : 0) - (vercheck ? 0 : +getprop('--navsz').slice(0, -2))}px`);
    setprop(`--h_${class_ani}`,`${rec.height}px`);
    that.style.minHeight = '0';
    that.style.zIndex = '2';
    that.classList.add(`${class_ani}_ani`);
    that.addEventListener("animationend", btn_ani_end);

    function btn_ani_end(e) {
        let item = e.target;
        let par = item.parentElement;
        item.removeEventListener("animationend", btn_ani_end);
        if (par.children.length < 2) {
            par.previousElementSibling.textContent = 'ok! welcom to site';
            par.remove();
        }
        item.remove();
        wlcmscr.style.overflow = 'auto';
    }
}

// hover border 3D event function //
function hovertop_in() {
    setprop('--hbhwidth_bot',hbhmin);
    setprop('--hbhwidth_top',hbhmax);
}

function hoverleft_in() {
    setprop('--hbhwidth_right',hbhmin);
    setprop('--hbhwidth_left',hbhmax);
}

function hoverright_in() {
    setprop('--hbhwidth_left',hbhmin);
    setprop('--hbhwidth_right',hbhmax);
}

function hoverbot_in() {
    setprop('--hbhwidth_top',hbhmin);
    setprop('--hbhwidth_bot',hbhmax);
}

function hover_out() {
    setprop('--hbhwidth_top',hbhave);
    setprop('--hbhwidth_bot',hbhave);
    setprop('--hbhwidth_left',hbhave);
    setprop('--hbhwidth_right',hbhave);
}

// scroll mid img //
function colscroll(e) {
    let li = e.target;
    let div = li.querySelector('div.hovercontent');
    let img = li.querySelector('img');
    div.scrollTo(0, csscomputed_prop(img, 'height') / 2 - (navszhover - 3*paddingli - csscomputed_prop(div.previousElementSibling, 'height')) / 2);
}

function rowscrollright(e) {
    let li = e.target;
    li.querySelector('div.hovercontent').scrollTo(csscomputed_prop(li.querySelector('img'), 'width') / 2 - ofstscrlrow, 0);
}

function rowscrollleft(e) {
    let li = e.target;
    li.querySelector('div.hovercontent').scrollTo(0 - (csscomputed_prop(li.querySelector('img'), 'width') / 2 - ofstscrlrow), 0);
}

// sorting button toggle //
function Sortingfunc(axis) {
    count++;
    let count_ = count;
    let navsrt1 = [];
    let navsrt2 = [];  
    navitem = [[], [], []];
    hovercheck = [true, true, true];

    seemorebtn.forEach(function(item) {
        item.classList.remove('highlightsort');
    })

    for (let key in navitemobj) {
        let elem = navitemobj[key].elem;
        if (navitemobj[key][axis]) {
            navsrt1.push(elem);
        } else {
            navsrt2.push(elem);
        }
        elem.classList.remove('highlightsort');
        if (!touchable) {
            r_mouseenter([hovertop_in, hoverbot_in, hoverleft_in, hoverright_in], elem);
            r_transitionend([colscroll, rowscrollright, rowscrollleft], elem);
        }
    }

    let navsrt = navsrt1.concat(navsrt2); 

    for (let key in navsrt) {
        navitem[Math.floor(key/soitemperscreen)].push(navsrt[key]);
    }
    nav_construct(0);

    delaypromise = delaypromise.then(function() {
        if (count != count_) {
            return new Promise(function (resolve) {
                resolve();
            });
        }

        setprop('--highlightcolor',`rgb(var(--${axis}))`);
    
        for (let key in navsrt1) {
            if (key == soitemperscreen) {break;}
            navsrt1[key].addEventListener("animationend", removehighlight);
            navsrt1[key].classList.add('highlightsort');
            //
            if (!touchable) {
                let classlist = navsrt1[key].classList;
                if (classlist.contains('col')) {
                    let check = classlist.contains('top') ? 'top' : 'bot';
                    color_border(check, border_3d[check], true, axis);
                } else {
                    let check = classlist.contains('left') ? 'left' : 'right';
                    color_border(check, border_3d[check], true, axis);
                }
            }
            //
        }
        seemorebtn.forEach(function(item) {
            item.addEventListener("animationend", removehighlight);
            item.classList.add('highlightsort');
        });
        
        return new Promise(function (resolve) {
            resolve();
        });
    });
}

function color_border(check, target, init, axis) {
    setprop(`--${check}_color_be4`, init ? `255, 255, 255` : `var(--colortheme_rgb)`);
    setprop(`--${check}_color_aft`, `var(--${init ? axis : 'colortheme_rgb'})`);

    target.classList[init ? 'add' : 'remove'](`highlightsort_border_${check}`);
    target[`${init ? 'add' : 'remove'}EventListener`]("animationend", border_3d[`removehighlight_border_${check}`]);
}

function removehighlight(e) {
    e.target.classList.remove('highlightsort');
    e.target.removeEventListener("animationend", removehighlight);
}

function onresizesortbtn() {
    let new_smallersd = innerWidth < innerHeight ? 1 : 2;
    let ratio = innerWidth/innerHeight;
    ratio = ratio < 1 ? 1/ratio : ratio;
    let new_smallersd_min = (ratio > 2) ? 1 : ((ratio > 1.3) ? 2 : sortbtn.length/2);

    if(new_smallersd == smallersd && new_smallersd_min == smallersd_min) {return;}
    smallersd = new_smallersd;
    smallersd_min = new_smallersd_min;

    let smsmall = $(`.seemore:nth-of-type(${smallersd})`);
    let smbig = $(`.seemore:nth-of-type(${3 - smallersd})`);
    sortbtn.forEach((item,key) => {
        if ((key + 1) <= smallersd_min) {
            smsmall.appendChild(item);
            adddecor(item, smallersd == 1);
        } else {
            smbig.appendChild(item);
            adddecor(item, (3 - smallersd) == 1);
        }
    })
    
    function adddecor(item, sdcheck) {
        item.className = '';
        item.classList.add(sdcheck ? 'horizontal' : 'vertical')
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
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; 
    outer.style.msOverflowStyle = 'scrollbar'; 
    document.body.appendChild(outer);
  
    const inner = document.createElement('div');
    outer.appendChild(inner);
  
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  
    outer.parentNode.removeChild(outer);
  
    return scrollbarWidth;
}

function csscomputed_prop(itm, prop) {
    return +getComputedStyle(itm).getPropertyValue(`${prop}`).slice(0, -2);
}

function hoveractivate() {
      if (!touchable) { 
        document.body.classList.add('hasHover');
      }
}

function hasTouch() {
    return 'ontouchstart' in document.documentElement
           || navigator.maxTouchPoints > 0
           || navigator.msMaxTouchPoints > 0;
}

function viewportheight() {
    let vh = window.innerHeight * 0.01;
    setprop('--vh', `${vh}px`);
}

function rmvE_(event) {
    function rmvE(func, elem) {
        for (let func_ of func) {
            elem.removeEventListener(event, func_);
        }
    }
    return rmvE;
}