import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        cardArr: [{
                txt: "文艺",
                id: 0,
                color: "#D0CCE4",
                bg: "bgw",
                cardColor: "#ACA5CE",
                posterColor: "#75789C",
                bgUrl: "https://duanju.58100.com/upload/wenyi.png"
            },
            {
                txt: "祝福",
                id: 1,
                color: "#FFD973",
                bg: "bgz",
                cardColor: "#FF744F",
                posterColor: "#fff",
                bgUrl: "https://duanju.58100.com/upload/zhufu.png"
            },
            {
                txt: "爱情",
                id: 2,
                color: "#F7D5DE",
                bg: "bga",
                cardColor: "#DC284F",
                posterColor: "#DC284F",
                bgUrl: "https://duanju.58100.com/upload/aiqing.png"
            },
            {
                txt: "贺卡",
                id: 3,
                color: "#BF1A1F",
                bg: "bgh",
                cardColor: "#FFCA5F",
                posterColor: "#C40900",
                bgUrl: "https://duanju.58100.com/upload/heka.png"
            },
            {
                txt: "信纸",
                id: 4,
                color: "#E5D1C4",
                bg: "bgx",
                cardColor: "#806B5D",
                posterColor: "#806B5D",
                bgUrl: "https://duanju.58100.com/upload/xinzhi.png"
            },
        ],
        selectCardId: 0,
        postSrc: "/assets/shareimg/img2.png",
        ifGif: 1,
    },

    onLoad: function(options) {
        console.log(app.globalData)
        this.setBackColor(this.data.cardArr[0].color);
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 258) * (670 / 946);
        this.setData({
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
            qrcode: this.qrcodeImg = `${loginApi.domin}/home/index/qcodes?page=pages/index/index&uid=${wx.getStorageSync('u_id')}&contentid=${2057}`,
            // userIcon: app.globalData.userInfo.avatarUrl
            userIcon: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqibOnajgQ9rXbM64pBA6MPZb8S8RicBhY10Nr4C9Fo6UPnRlNY8ZAdZ2hVlJz1tMMRys64NxpCnwOQ/132"
        });
        console.log(options);
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

    savePic: function() {
        let _this = this;
        wx.getSetting({
            success(res) {
                // 进行授权检测，未授权则进行弹层授权
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            _this.saveImage()
                        },
                        // 拒绝授权时
                        fail() {
                            wx.navigateTo({
                                url: `/pages/savePosters/savePosters`,
                            })
                        }
                    })
                } else {
                    // 已授权则直接进行保存图片
                    _this.saveImage()

                }
            },
            fail(res) {
                wx.navigateTo({
                    url: `/pages/savePosters/savePosters`,
                })
            }
        })

    },

    saveImage: function() {
        wx.getImageInfo({
            src: 'https://duanju.58100.com/upload/usercontent/1559530636695.png',
            success(res) {
                let {
                    path
                } = res;
                wx.saveImageToPhotosAlbum({
                    filePath: path,
                    success(res) {
                        wx.navigateTo({
                            url: `/pages/savePosters/savePosters`,
                        })
                    },
                    complete(res) {}
                })
            }
        })
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})