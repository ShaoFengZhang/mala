import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        mallArr: [{
                icon: 'https://duanju.58100.com/upload/shop/1.png',
                title: '现金红包10元',
                beans: '99999',
                people: '1',
            }, {
                icon: 'https://duanju.58100.com/upload/shop/2.png',
                title: 'YSL圣罗兰红方管正红色',
                beans: '9000000',
                people: '1',
            },
            {
                icon: 'https://duanju.58100.com/upload/shop/3.png',
                title: '小米AIR蓝牙耳机',
                beans: '8000000',
                people: '1',
            }, {
                icon: 'https://duanju.58100.com/upload/shop/4.png',
                title: '游戏键鼠套装',
                beans: '9999999',
                people: '1',
            }
        ]
    },

    onLoad: function(options) {},

    onShow: function() {

    },

    onHide: function() {

    },

    onShareAppMessage: function() {
        return util.shareObj
    },

    maskeclick: function() {
        util.toast("敬请期待！", 1200)
    },

    // 收集formid
    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})