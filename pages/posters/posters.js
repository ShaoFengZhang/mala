import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        srcDomin: loginApi.srcDomin,
        cardArr: [{
                txt: "文艺",
                id: 0,
                color: "#D0CCE4",
                bg: "bgw",
                cardColor: "#ACA5CE",
                posterColor: "#75789C",
                bgUrl: loginApi.srcDomin + "/upload/wenyi.png",
                topimg: "wenyiimg",
                top: 0,
                left: 0,
                width: 670,
                height: 400,
            },
            {
                txt: "祝福",
                id: 1,
                color: "#FFD973",
                bg: "bgz",
                cardColor: "#FF744F",
                posterColor: "#fff",
                bgUrl: loginApi.srcDomin + "/upload/zhufu.png",
                topimg: "zhufuimg",
                top: 24,
                left: 14,
                width: 642,
                height: 252,
            },
            {
                txt: "爱情",
                id: 2,
                color: "#F7D5DE",
                bg: "bga",
                cardColor: "#DC284F",
                posterColor: "#DC284F",
                bgUrl: loginApi.srcDomin + "/upload/aiqing.png",
                topimg: "aiqingimg",
                top: 42,
                left: 142,
                width: 390,
                height: 320,
            },
            {
                txt: "贺卡",
                id: 3,
                color: "#BF1A1F",
                bg: "bgh",
                cardColor: "#FFCA5F",
                posterColor: "#C40900",
                bgUrl: loginApi.srcDomin + "/upload/heka.png",
                topimg: "hekaimg",
                top: 0,
                left: 114,
                width: 442,
                height: 346,
            },
            {
                txt: "信纸",
                id: 4,
                color: "#E5D1C4",
                bg: "bgx",
                cardColor: "#806B5D",
                posterColor: "#806B5D",
                bgUrl: loginApi.srcDomin + "/upload/xinzhi.png",
                topimg: "xinzhiimg",
                top: 92,
                left: 48,
                width: 616,
                height: 224,
            },
        ],
        selectCardId: 0,
        postSrc: "/assets/shareimg/img2.png",
        contentImg: "https://duanju.58100.com/upload/mala.png",
        contentTxt: '麻辣短句欢迎您！'
    },

    onLoad: function(options) {
        console.log(app.globalData)
        this.setBackColor(this.data.cardArr[0].color);
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 258) * (670 / 946);
        this.setData({
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
            qrcode: `${loginApi.domin}/home/index/qcodes?page=pages/index/index&uid=${wx.getStorageSync('u_id')}&contentid=${options.contentID ? options.contentID : null}`,
            contentID: options.contentID ? options.contentID : null,
            userIcon: app.globalData.userInfo.avatarUrl,
        });
        console.log(options);
        if (options && options.contentID) {
            this.getcontent(options.contentID);
        }

    },

    onShow: function() {},

    onHide: function() {

    },

    onShareAppMessage: function() {
        return util.shareObj
    },

    bindload: function() {
        this.setData({
            ifGif: 0,
        })
    },

    // 设置背景颜色
    setBackColor: function(color) {
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: color,
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        });
    },

    // 切换贺卡
    changeCard: function(e) {
        let id = e.currentTarget.dataset.id;
        if (id == this.data.selectCardId) {
            return;
        };
        this.setData({
            selectCardId: id,
            // ifGif: 1,
        });
        this.setBackColor(this.data.cardArr[id].color)
    },

    // 获取内容
    getcontent: function(conId) {
        let _this = this;
        let getcontentUrl = loginApi.domin + '/home/index/contentone';
        loginApi.requestUrl(_this, getcontentUrl, "POST", {
            "id": conId,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
            if (res.status == 1) {
                let obj = res.content;
                obj.imgurl = res.content.imgurl.split(',');
                _this.setData({
                    contentId: obj.id,
                    contentImg: obj.imgurl[0] ? _this.data.srcDomin + obj.imgurl[0] : "https://duanju.58100.com/upload/mala.png",
                    contentTxt: obj.title ? obj.title : "麻辣短句欢迎您！"
                })
            } else {
                util.toast("数据获取失败,请重试", 300)
            }
        })
    },

    savePic: function() {
        let _this = this;
        wx.getSetting({
            success(res) {
                // 进行授权检测，未授权则进行弹层授权
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            _this.toSaveposters()
                        },
                        // 拒绝授权时
                        fail() {
                            _this.toSaveposters()
                        }
                    })
                } else {
                    // 已授权则直接进行保存图片
                    _this.toSaveposters()
                }
            },
            fail(res) {
                _this.toSaveposters()
            }
        })

    },

    toSaveposters: function() {
        wx.navigateTo({
            url: `/pages/savePosters/savePosters?contentID=${this.data.contentID}&posterId=${this.data.selectCardId}`,
        })
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})