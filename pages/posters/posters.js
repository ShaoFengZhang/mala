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

    onLoad: function(options) {
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 258) * (670 / 946);
        this.setData({
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
        });
        console.log(options);
    },

    onShow: function() {

    },

    onHide: function() {

    },

    onShareAppMessage: function() {
        return util.shareObj
    },

    previewImage: function(e) {
        let src = e.currentTarget.dataset.src;
        wx.previewImage({
            urls: ["https://duanju.58100.com/upload/usercontent/1559530636695.png"],
        })
    },

    // 切换贺卡
    changeCard: function(e) {
        let id = e.currentTarget.dataset.id;
        if (id == this.data.selectCardId) {
            return;
        };
        this.setData({
            selectCardId: id,
        })
    },

    savePic: function() {
        let _this=this;
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
                    complete(res){
                    }
                })
            }
        })
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})