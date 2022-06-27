"use strict";

const ulnav = document.querySelector('ul#nav');
const projfr = ulnav.querySelector('section#iframe');
const wlcmscr = ulnav.querySelector('section#welcome');
const homebtn = ulnav.querySelector('.btn[onclick="homescreen()"]');
const seemorebtn = ulnav.querySelectorAll('.btn[onclick="seemore()"]');
const seemorenav = document.querySelectorAll('.seemore');
const sortbtn = document.querySelectorAll('.seemore button');
const ckbx = ulnav.querySelector('label#tglnav input');
const main = ulnav.querySelector('#main');
let navitemobj = [];
let navitem = [[], [], []];
let hovercheck = [true, true, true];
let availit_num;

const border_3d = {
    top : ulnav.querySelector('#top_border'),
    bot : ulnav.querySelector('#bot_border'),
    left : ulnav.querySelector('#left_border'),
    right : ulnav.querySelector('#right_border'),
    removehighlight_border_top : function(e) {
        color_border('top', e.target, false, 'N/A');
    },
    removehighlight_border_bot : function(e) {
        color_border('bot', e.target, false, 'N/A');
    },
    removehighlight_border_left : function(e) {
        color_border('left', e.target, false, 'N/A');
    },
    removehighlight_border_right : function(e) {
        color_border('right', e.target, false, 'N/A');
    },
}

let smallersd;
let smallersd_min;

projfr.querySelector('iframe').addEventListener('transitionend', nav_navigate_event);

// main script //
fetch('item.json')
                .then(res => res.json())
                .then(data => {
                  console.log(data);
                  navli_html_generation(data);
                })
                .catch(err => console.error(err));

function navli_html_generation(data) {
    const fragment = document.createDocumentFragment();
    availit_num = data.length;

    for (let key in data) {
        let item = data[key];
        navitemobj[key] = {
            dg_pro: false,
            print: false,
            mo_gra: false,
            illus: false,
            spcl: false,
            gr_co: false,
            time: true,
            soon: false,
        }

        // div text
        let divtxt = {
            elem : document.createElement('div'),
            chld : [
                { 
                    elem : document.createElement('h2'),
                    chld : [
                        document.createElement('span'),
                        document.createElement('span')
                    ],
                },
                document.createElement('p'),
                document.createElement('p'),
            ]
        };
                                // div text h2
                                divtxt.chld[0].chld[0].textContent = item.name;//-- json props
                                divtxt.chld[0].chld[1].textContent = item.date;//-- json props
                                divtxt.chld[0].elem.append( divtxt.chld[0].chld[0],
                                                            ' ',
                                                            divtxt.chld[0].chld[1]
                                )
                                // div text p date
                                divtxt.chld[1].classList.add('date');
                                for (let index in item.field) {
                                    let span = document.createElement('span');
                                    span.className = `field ${item.field[index].class}`;//-- json props
                                    
                                    fieldcheck(item.field[index].class, navitemobj[key]);

                                    span.textContent = item.field[index].name;//-- json props
                                    divtxt.chld[1].appendChild(span);
                                }
                                // div text p description
                                divtxt.chld[2].textContent = item.description;//-- json props
                                //div text
                                divtxt.elem.classList.add('text');
                                divtxt.elem.append( divtxt.chld[0].elem,
                                                    divtxt.chld[1],
                                                    divtxt.chld[2]
                                );

        // div hovercontent
        let divhover = document.createElement('div');
        divhover.classList.add('hovercontent');
                                if (!item.soon) {//-- json props
                                    let divhoverimg = document.createElement('img');
                                    divhoverimg.classList.add('thumb');
                                    divhoverimg.dataset.src = `thumbnail/${+key + 1}.jpg`;
                                    divhoverimg.alt = item.description;
                                    divhover.append(divhoverimg);
                                } else {
                                    navitemobj[key].soon = true;
                                }

        //li
        let li = document.createElement('li');
        if (item.soon) {li.classList.add('soon');}
        li.setAttribute('onclick', 'nav_navigate(this)');
        li.id = `_${+key + 1}`;
        li.append(divtxt.elem, divhover);
        fragment.appendChild(li);

        // li initialise
        if (key == 0) {li.classList.add('current');} // initial current nav
        navitemobj[key].elem = li;
        navitem[Math.floor(key/soitemperscreen)].push(li);
        if (!touchable) {
            li.addEventListener("mouseleave", hover_out);
            li.addEventListener("mouseenter", lazyload);
            if (item.soon) {availit_num--};
        }
    }
    ulnav.appendChild(fragment);

    // navbar construction // 
    onresizesortbtn();
    nav_construct(0);
}

function fieldcheck(class_, item) {
    if (fieldcheck_('dg_pro')) {return;};
    if (fieldcheck_('print')) {return;};
    if (fieldcheck_('mo_gra')) {return;};
    if (fieldcheck_('illus')) {return;};
    if (fieldcheck_('spcl')) {return;};

    function fieldcheck_(check) {
        item[check] = item[check]  || (class_ == check);
        return class_ == check;
    }
}


// on resize //
window.onresize = _.debounce(function() {
    // media change => get navbar
    navsz = +proproot.getPropertyValue('--navsz_sampl').slice(0, -2);
    // scrollbar width
    scrlbrwd = getScrollbarWidth();
    rootstyle.setProperty('--scrlbrwd', `${scrlbrwd}px`);
    // offsetiframe width
    offsetifr = navsz*2 + scrlbrwd + 1 + (!touchable ? +hbhave.slice(0,-2) : 0) * 2;
    ifr_widthfit(projfr.querySelector('iframe'));
    // stroke3d width
    hbhmax = proproot.getPropertyValue('--hbhwidth_max');
    // sort button reorganise
    onresizesortbtn();
    // ios vh fix
    viewportheight();
    nav_construct(crrntnavlist);
}, 1000);

function lazyload(e) {
    let li = e.target;
    let img = li.querySelector('img');

    if (!img) {return;}

    img.src = img.dataset.src;

    li.removeEventListener("mouseenter", lazyload);
}
