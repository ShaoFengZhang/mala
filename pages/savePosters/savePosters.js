import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        cardArr: [{
            txt: "文艺",
            id: 0,
        },
        {
            txt: "祝福",
            id: 1,
        },
        {
            txt: "爱情",
            id: 2,
        },
        {
            txt: "贺卡",
            id: 3,
        },
        {
            txt: "信纸",
            id: 4,
        },
        ],
        selectCardId: 0,
        postSrc: "/assets/shareimg/img2.png"
    },

    onLoad: function (options) {
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 258) * (670 / 946);
        this.setData({
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
        });
    },

    onShow: function () {

    },

    onHide: function () {

    },

    onShareAppMessage: function () {
        return util.shareObj
    },
    
    previewImage: function (e) {
        let src = e.currentTarget.dataset.src;
        wx.previewImage({
            urls: ["https://duanju.58100.com/upload/usercontent/1559530636695.png"],
        })
    },

    backTopPage:function(){
        wx.navigateBack({
            delta: 1
        })
    },

    formSubmit: function (e) {
        util.formSubmit(app, e);
    },
})