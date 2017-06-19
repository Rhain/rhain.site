var iconHamburger = {
    selector: '.icon-hamburger',
    svg: '<svg width="100%" height="100%" viewBox="0 0 65 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.5;"  fill="none" stroke="#000" stroke-width="10"><g><path class="hamburger-top" d="m 5,10 55,0" /><path class="hamburger-middle" d="m 5,30 55,0" /></g><path class="hamburger-bottom" d="m 5,50 55,0" /></svg>',
    transitionTime: 250,
    states: {
        open: [ // 打开动画
            {id: "top-lower", element: ".hamburger-top", y: 20},  // 顶部横线向下移动20px
            {id: "bottom-raise", element: ".hamburger-bottom", y:-20}, // 底部横线向上移动20px  此时跟中间横线合并成一条线
            {waitFor: "top-lower", element: "g", r:45}, // 等顶部横线移动完， 让 g (包含顶部和中间横线) 旋转45度
            {waitFor: "top-lower", element: ".hamburger-bottom", r: -45} // 等底部横线移动完，旋转底部横线45度
        ],
        closed:[  // 关闭动画
            {id:"top-angle", element: "g", r:0}, // g(包含顶部和中间横线) 旋转到0度
            {id:"bottom-angle", element:".hamburger-bottom", r:0}, // 底部横线旋转到0度
            {waitFor:"top-angle", element:".hamburger-top", y:0}, // 等g(包含顶部和中间横线)旋转结束，移动顶部横线到开始位置
            {waitFor:"bottom-angle", element:".hamburger-bottom", y:0} // 等底部横线旋转完， 移动底部横线到开始位置
        ]
    },
    events:[
        {event:"click", state:["open", "closed"]} // 绑定点击事件， 在open和closed之间切换
    ]
};

SnapStates(iconHamburger);

var iconLock = {
    selector: ".icon-lock",
    svg: '<svg width="100%" height="100%" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.5;"><path class="clasp" d="M45.045,42.402L45.045,24.409C45.045,16.873 39.197,10.755 31.995,10.755C24.792,10.755 18.945,16.873 18.945,24.409L18.945,33.817" style="fill:none;stroke:#000;stroke-width:4.5px;"/><path d="M51.113,44.882C50.937,54.8 42.447,62.788 32,62.788C21.552,62.788 13.063,54.8 12.887,44.882L12.884,44.882L12.884,34.276C12.884,33.245 13.719,32.41 14.749,32.41L49.251,32.41C50.281,32.41 51.116,33.245 51.116,34.276L51.116,44.567L51.116,44.567C51.116,44.607 51.116,44.647 51.116,44.686L51.116,44.882L51.113,44.882ZM34,48.606C35.485,47.869 36.505,46.337 36.505,44.567C36.505,42.08 34.488,40.062 32,40.062C29.512,40.062 27.495,42.08 27.495,44.567C27.495,46.337 28.515,47.869 30,48.606L30,52.794L34,52.794L34,48.606Z" style="stroke:#000;stroke-width:1.25px;stroke-linejoin:miter;stroke-miterlimit:10;"/></svg>',
    transitionTime: 250,
    initState: "unlocked",
    states: {
        locked: [ // 锁住状态
            {id: "locked", element: ".clasp", y:0} //clasp 移回原位
        ],
        unlocked: [ // 开锁状态
            {id: "unlocked", element: ".clasp", y:-7} // clasp 向上移动7px
        ]
    },
    events:[
        {event:"click", state:["locked", "unlocked"]}
    ]
};
SnapStates(iconLock);

var iconArrowRotating = {
    selector: '.icon-arrow-rotating',
    transitionTime: 500,
    easing: 'linear',
    states: {
        spin:[
            {id:'spin-init', element:'.arrow-group', r:180, s:.75, repeat:{times:1}}, // 旋转180度 缩小0.75，重复一次，也就是会执行两次动画。
            {id:'spin-after', waitFor:'spin-init', element:'.arrow-group', r:360,s:1}, // 旋转180度后，旋转360度，放大到原来大小
            {waitFor:'spin-after', element:'.arrow-group', r:0, transitionTime:0} // 放大后立即回到初始旋转角度
        ]
    },
    events:[
        {event:'click', state:'spin'}
    ]
};
SnapStates(iconArrowRotating);

var iconMagnifyingGlass = {
    selector: '.icon-magnifying-glass',
    transitionTime: 500,
    states: {
        zoomIn: [
            {id:'vertical-line-in', element:'.vertical', r: 270}, // 竖线旋转270度
            {id:'horizontal-line-in', element:'.horizontal', r:-180} // 横线旋转-180度
        ],
        zoomOut:[
            {id:'vertical-line-out', element:'.vertical', r:0}, // 竖线旋转至初始位置
            {id:'horizontal-line-out', element:'.horizontal', r:0} // 横线旋转至初始位置
        ]
    },
    events:[
        {event:'click', state:['zoomIn', 'zoomOut']}
    ]
};
SnapStates(iconMagnifyingGlass);

var iconFolder = {
    selector: '.icon-folder',
    transitionTime: 500,
    initState: 'open',
    states:{
        open: [  // 路径变换
            {id: 'outline-open', element: '.cover', path: 'M3.5,51.5L54.5,51.5L62.415,24.29L31.915,24.255L23.915,29.49L11.415,29.49L3.5,51.5'},
        ],
        closed:[
            {id: 'outline-close', element: '.cover', path: 'M3.5,51.5L54.5,51.5L54.5,17.8L24,17.765L16,23L3.5,23L3.5,51.5'}
        ],
        hover: [
            {id: 'bounce-up', element:'.folder', y:-2,transitionTime:100, repeat:{times:1}},
            {id: 'bounce-side', waitFor: 'bounce-up', element: '.folder', y:0, transitionTime:100}
        ]
    },
    events: [
        {event: 'click', state: ['closed', 'open']},
        {event: 'mouseenter', state: 'hover'}
    ]
};
SnapStates(iconFolder);

var iconRecycling = {
    selector: '.icon-recycling',
    transitionTime: 350,
    easing: 'easeinout',
    states:{
        recycle: [
            {id:'open-bin', element:'.recycling-bin-lid',x:-4,y:-5,r:-24}, // 垃圾盖 右移4px 上移5像素，同时旋转24度 实现侧面打开的效果
            {id:'throw-garbage', element:'.recycling-bin-garbage', waitFor:'open-bin',x:-50,y:25,r:360,transitionTime:600}, //垃圾 右移50px 下移25度，旋转360度
            {id:'close-lid', element:'.recycling-bin-lid',waitFor:'throw-garbage', x:0,y:0,r:0}, // 垃圾盖还原
            {id:'retrieve-garbage', element:'.recycling-bin-garbage',waitFor:'throw-garbage',x:0,y:0,r:0, transitionTime:0} // 垃圾还原
        ]
    },
    events:[
        {event:'click', state: 'recycle'}
    ]
};
SnapStates(iconRecycling);

var iconSpeaker = {
    selector: '.icon-speaker',
    easing: 'linear',
    states:{
        mute:[
            {id:'waveline1', element:'.wave-line-1', x:-10,s:0.1, attr:{opacity:.8}, transitionTime:250},
            {id:'waveline2', element:'.wave-line-2',x:-16,s:0.1, attr:{opacity:.8}, transitionTime:300},
            {id:'waveline3', element:'.wave-line-3',x:-22,s:0.1, attr:{opacity:.8}, transitionTime:350}
        ],
        unmute:[
            {id:'waveline1', element:'.wave-line-1',x:0,s:1, attr:{opacity:1}, transitionTime:350},
            {id:'waveline2', element:'.wave-line-2',x:0,s:1,attr:{opacity:1}, transitionTime:300},
            {id:'waveline3', element:'.wave-line-3',x:0,s:1,attr:{opacity:1}, transitionTime:250}
        ]
    },
    events:[
        {event:'click', state:['mute','unmute']}
    ]
}

SnapStates(iconSpeaker);


var iconEnvelope = {
    selector: '.icon-envelope',
    transitionTime: 500,
    easing: 'linear',
    states: {
        open: [
            {id: 'fold-up', element: '.flap', y:-17.5, s:[1,-1]} // y轴放到-1倍，可以实现翻转的效果。
        ],
        close:[
            {id: 'fold-down', element: '.flap', y:0, s:[1, 1]}
        ]
    },
    events:[
        {event: 'click', state: ['open', 'close']}
    ]
}
SnapStates(iconEnvelope);

var iconShare = {
    selector: '.icon-share',
    transitionTime: 400,
    states:{
        showMore:[
            {id:'transform-s-in', element:'.share-icon-main', x:11, s:.5}, // 把大icon 右移同时缩小0.5倍

            {waitFor:'transform-s-in', element:'.left', drawPath: 100}, // .left path 全长画出来
            {waitFor:'transform-s-in', element:'.center-circle', attr:{r:11}, transitionTime: 1500},// 中间的圆放大
            {waitFor:'transform-s-in', element: '.bottom-line', drawPath:100}, // .bottom-line 全长画出来
            {waitFor:'transform-s-in', element:'.top-line', drawPath:100},// .top-line 全长画出来
            {waitFor:'transform-s-in', element:'.right-upper-circle', s:.7,x:2,y:-1},// .right-upper-circle 缩小0.7倍，右移2px 上移1px

            {id:['right-upper-branch',600], element:'.right-upper-branch', drawPath:100}, //延迟600ms  .right-upper-branch 全长画出来
            {id:['left-upper-circle', 600], element: '.left-upper-circle', s:1, attr:{opacity:1}},//延迟600ms  .left-upper-circle 放大到1倍， 透明度为1
            {id:['left-lower-circle',600], element:'.left-lower-circle',s:1,attr:{opacity:1}},//延迟600ms  .left-lower-circle 放大到1倍， 透明度为1
            {id:['right-upper-branch-circle', 600], element:'.right-upper-branch-circle',s:1,attr:{opacity:1}} //延迟600ms  .right-upper-branch-circle 放大到1倍， 透明度为1

        ],
        showLess: [
            // 跟showMore 相反的过程
            {id:'left-upper-circle-hide',element:'.left-upper-circle', s:0, attr:{opacity:0}},
            {id:'left-lower-circle-hide',element:'.left-lower-circle',s:0,attr:{opacity:0}},
            {id:'right-upper-branch-circle-hide',element:'.right-upper-branch-circle',s:0,attr:{opacity:0}},
            {id:'right-upper-branch-hide', element:'.right-upper-branch',drawPath:0},
            {id:'left-hide', element:'.left', drawPath:0},
            {id:'center-circle-hide',element:'.center-circle', attr:{r:7}},
            {id:'bottom-line-hide', element:'.bottom-line',drawPath:0},
            {id:'top-line-hide', element:'.top-line', drawPath:0},
            {id:'right-upper-circle-hide', element:'.right-upper-circle', s:1,x:0,y:0},

            {waitFor:'left-hide', element:'.share-icon-main',x:0,s:1},
        ]
    },
    events: [
        {event:'mouseenter', state:'showMore'},
        {event:'mouseleave', state:'showLess'}
    ]
}
SnapStates(iconShare);