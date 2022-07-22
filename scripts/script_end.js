"use strict";
// custom settings //
const minsz = 10;
const time_interval = 250;
const soitemperscreen = 6;
const soitem_tong = 16;

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
let fetch_data;
let soitem_soon;
let not_firstload = false;

// query elements
const projfr = $ulnav('section#iframe');
const wlcmscr = $ulnav('section#welcome');
const homebtn = $ulnav('.btn[onclick="homescreen()"]');
const seemorebtn = ulnav.querySelectorAll('.seemore_func');
const seemorenav = $$('.seemore');
const sortbtn = $$('.seemore button');
const ckbx = $ulnav('label#tglnav input');
const tglnav = $ulnav('label#tglnav');
const main = $ulnav('#main');
const sneak = $ulnav('#sneak_peek');
const landing = $ulnav('#landing_pg');
const about = $ulnav('#about');
const sneak_title = $ulnav('#sneak_title');
const resume = $ulnav('#myresume');
const btn_img = $ulnav('.btn img');
const description = $ulnav('#description');

//fragment
const fragment = document.createDocumentFragment();
const fragment_sneak = document.createDocumentFragment();

// border 3d object
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
};

// extra objects
const soon_obj = {
    "name" : "Coming",
    "date" : "soon",
    "field" : [
        {
            "name" : "Intentionally",
            "class" : ""
        },
        {
            "name" : "left",
            "class" : ""
        },
        {
            "name" : "blank",
            "class" : ""
        }
    ],
    "description" : "",
    "soon" : true
};
const misc_obj = {
    "name" : "Misc projects",
    "date" : "1/2020 - present",
    "field" : [
        {
            "name" : "Communication design",
            "class" : ""
        },
        {
            "name" : "Poster design",
            "class" : "illus"
        },
        {
            "name" : "NFT design",
            "class" : "dg_pro"
        }
    ],
    "description" : "Various small-scale projects, personal and full-time works",
    "soon" : false
};

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
                    availit_num = data.length + 1;
                    fetch_data = data;

                    fetch_data.push(misc_obj);
                    soitem_soon = soitem_tong - availit_num;
                    for (let i = 1; i <= soitem_soon; i++) {
                        fetch_data.push(soon_obj);
                    }
                    
                    navli_html_generation(fetch_data);
                })
                .catch(err => console.error(err));

function navli_html_generation(data) {
    for (let key in data) {
        let item = data[key];
        let key_ = (+key + 1 == availit_num) ? 'misc' : (+key + 1);
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
                                    divtxt.chld[0].chld[1].classList.add('date');
                                divtxt.chld[0].elem.append( divtxt.chld[0].chld[0],
                                                            ' ',
                                                            divtxt.chld[0].chld[1]
                                )
                                // div text p field
                                divtxt.chld[1].classList.add('field');
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
                                    divhover.dataset.src = `${key_}`;
                                    divhover.style.backgroundImage = `url('thumbnail/${key_}.jpg')`;
                                } else {
                                    navitemobj[key].soon = true;
                                }

        //li
        let li = $create('li');
        if (item.soon) {li.classList.add('soon');}
        li.setAttribute('onclick', 'nav_navigate(this)');
        li.id = `_${+key + 1}`;
        li.title = `click to see this project: ${item.name}`;
        li.append(divtxt.elem, divhover);
        fragment.appendChild(li);

                                // li initialise
                                if (key == 0) {li.classList.add('current');} // initial current nav
                                navitemobj[key].elem = li;
                                navitem[Math.floor(key/soitemperscreen)].push(li);
                                if (!touchable) {
                                    li.addEventListener("mouseleave", hover_out);
                                }

        //sneak
        if (!item.soon) {
            let li_ = $create('li');
            let div = $create('div');
                div.setAttribute('onclick', `nav_navigate(navitemobj[${key}].elem)`);
                div.title = li.title;
            let h2 = $create('h2');
            let name = $create('span');
                name.textContent = `${+key + 1}/ ${item.name}`;
            let date = $create('span');
                date.textContent = item.date;
                date.classList.add('date');
            let img = $create('img');
                img.src = `thumbnail/home/${key_}.jpg`;
                img.alt = item.name;
            h2.append(name,' ',date);
            div.append(img, h2);
            li_.appendChild(div);
            fragment_sneak.appendChild(li_);
        }
    }

    // navbar construction // 
    onresizesortbtn(false);

    /*
    delaypromise = delaypromise.then(function() { 
        cl('ok');
        //alert(`ready height: ${screen.height} + ${innerHeight}`);
        return new Promise(function (resolve) {
            resolve();
        });
    })
    */

    btn_img.addEventListener('transitionend', init_vh);

    ckbx.checked = true;
    togglenav(ckbx);
}

function init_vh() {
    r_transitionend([init_vh], btn_img);
    viewportheight();
    cl('ok');
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
    offsetifr = (ckbx.checked == false ? navsz*2 : 0) + scrlbrwd + 1 + ((!touchable && (ckbx.checked == false)) ? +getprop('--hbhwidth_ave').slice(0,-2) : 0) * 2;
    ifr_widthfit(projfr.querySelector('iframe'));
    // ios vh fix
    viewportheight();
    // sort button reorganise + generate nav bar
    onresizesortbtn(true);
}, 1000);
