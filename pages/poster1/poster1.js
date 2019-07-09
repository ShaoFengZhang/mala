import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        classArr:[
            {
                txt: "简约大气",
                id: 1,
            },
            {
                txt: "简约大气",
                id: 1,
            },
            {
                txt: "简约大气",
                id: 1,
            },
            {
                txt: "简约大气",
                id: 1,
            },
            {
                txt: "朴素",
                id: 1,
            },
            {
                txt: "清凉",
                id: 1,
            },
        ],
        classUrls:[
            "https://duanju.58100.com/upload/yasuotu/01.png",
            "https://duanju.58100.com/upload/yasuotu/02.png",
            "https://duanju.58100.com/upload/yasuotu/03.png",
            "https://duanju.58100.com/upload/yasuotu/04.png",
            "https://duanju.58100.com/upload/yasuotu/05.png",
            "https://duanju.58100.com/upload/yasuotu/06.png",
            "https://duanju.58100.com/upload/yasuotu/07.png",
            "https://duanju.58100.com/upload/yasuotu/08.png",
            "https://duanju.58100.com/upload/yasuotu/09.png",
            "https://duanju.58100.com/upload/yasuotu/10.png",
            "https://duanju.58100.com/upload/yasuotu/11.png",
            "https://duanju.58100.com/upload/yasuotu/12.png",
            "https://duanju.58100.com/upload/yasuotu/13.png",
            "https://duanju.58100.com/upload/yasuotu/14.png",
            "https://duanju.58100.com/upload/yasuotu/15.png",
            "https://duanju.58100.com/upload/yasuotu/16.png",
        ]
    },

    onLoad: function (options) {
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 354) * (51 / 85);
        this.setData({
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
            qrcode: `${loginApi.domin}/home/index/qcodes?page=pages/index/index&uid=${wx.getStorageSync('u_id')}&contentid=${options.contentID ? options.contentID : null}`,
            contentID: options.contentID ? options.contentID : null,
            userIcon: app.globalData.userInfo.avatarUrl,
            username: "",
            userDate: '于' + util.formatTime(new Date()),
        });
    },

    onShow: function () {

    },

    onShareAppMessage: function () {

    },

    previewImage:function(){

    },

    changePoster:function(){
        console.log(123456789)
        // let _this = this;
        // let changePosterUrl = loginApi.domin + '/home/index/support';
        // loginApi.requestUrl(_this, changePosterUrl, "POST", {
        //     "id": cid,
        //     "uid": wx.getStorageSync("u_id"),
        // }, function (res) {
        //     console.log(res);
        //     if (res.status == 1) {
                
        //     }
        // })
    },
})