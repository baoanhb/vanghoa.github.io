"use strict";
// custom settings //
const minsz = 9;
const time_interval = 250;
const soitemperscreen = 6;

// binding method
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $create = document.createElement.bind(document);

// binding method
const ulnav = $('ul#nav');
const $ulnav = ulnav.querySelector.bind(ulnav);

// binding method
const root = document.querySelector(':root');
const proproot = getComputedStyle(root);
const getprop = proproot.getPropertyValue.bind(proproot);

// binding method
const rootstyle = root.style;
const setprop = rootstyle.setProperty.bind(rootstyle);

// closure function
const r_mouseenter = rmvE_('mouseenter');
const r_transitionend = rmvE_('transitionend');

// css getprop
let navsz = +getprop('--navsz_sampl').slice(0, -2);
const colmax = +getprop('--colmax') + 2;

// locked settings //
const soitem = new Array(4);
let delaypromise = Promise.resolve();
let crrntnavlist = 0;
let count = 0;
let crrntitemid = '1';
let navitemobj = [];
let navitem = [[], [], []];
let hovercheck = [true, true, true];
let availit_num;
let smallersd;
let smallersd_min;

// query elements
const projfr = $ulnav('section#iframe');
const wlcmscr = $ulnav('section#welcome');
const homebtn = $ulnav('.btn[onclick="homescreen()"]');
const seemorebtn = ulnav.querySelectorAll('.seemore_func');
const seemorenav = $$('.seemore');
const sortbtn = $$('.seemore button');
const ckbx = $ulnav('label#tglnav input');
const main = $ulnav('#main');

//border 3d object
const border_3d = {
    top : $ulnav('#top_border'),
    bot : $ulnav('#bot_border'),
    left : $ulnav('#left_border'),
    right : $ulnav('#right_border'),
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

// initialise //
viewportheight();
const touchable = hasTouch(); hoveractivate();
let scrlbrwd = getScrollbarWidth(); setprop('--scrlbrwd', `${scrlbrwd}px`);
let offsetifr = navsz*2 + scrlbrwd + 1 + (!touchable ? +getprop('--hbhwidth_ave').slice(0,-2) : 0) * 2;

projfr.querySelector('iframe').addEventListener('transitionend', nav_navigate_event);

// nav fetch //
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
            elem : $create('div'),
            chld : [
                { 
                    elem : $create('h2'),
                    chld : [
                        $create('span'),
                        $create('span')
                    ],
                },
                $create('p'),
                $create('p'),
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
                                    let span = $create('span');
                                    span.className = `field ${item.field[index].class}`;//-- json props
                                    
                                    fieldcheck(item.field[index].class, navitemobj[key]);

                                    span.textContent = item.field[index].name;//-- json props
                                    divtxt.chld[1].append(span,' ');
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
        let divhover = $create('div');
        divhover.classList.add('hovercontent');
                                if (!item.soon) {//-- json props
                                    divhover.dataset.src = `${+key + 1}`;
                                    divhover.style.backgroundImage = `url('thumbnail/${+key + 1}.jpg')`;
                                } else {
                                    navitemobj[key].soon = true;
                                }

        //li
        let li = $create('li');
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
            if (item.soon) {availit_num--};
        }
    }
    ulnav.appendChild(fragment);

    // navbar construction // 
    onresizesortbtn();
    nav_construct(0);

    delaypromise = delaypromise.then(function() { 
        viewportheight();
        //alert(`ready height: ${screen.height} + ${innerHeight}`);
        return new Promise(function (resolve) {
            resolve();
        });
    })
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
    navsz = +getprop('--navsz_sampl').slice(0, -2);
    // scrollbar width
    scrlbrwd = getScrollbarWidth();
    setprop('--scrlbrwd', `${scrlbrwd}px`);
    // offsetiframe width - change hbhwidth_ave on media css change
    offsetifr = (ckbx.checked == false ? navsz*2 : 0) + scrlbrwd + 1 + (!touchable ? +getprop('--hbhwidth_ave').slice(0,-2) : 0) * 2;
    ifr_widthfit(projfr.querySelector('iframe'));
    // sort button reorganise
    onresizesortbtn();
    // ios vh fix
    viewportheight();
    nav_construct(crrntnavlist);
}, 1000);
