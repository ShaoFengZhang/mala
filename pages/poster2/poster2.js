import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        classIndex:0,
        ifGif: 0,
        postSrc: '',
    },

    onLoad: function (options) {
        this.getposterClass();
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 354) * (51 / 85);
        this.setData({
            imgH: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 354,
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
            contentID: options.contentID ? options.contentID : null,
            classIndex: 0, // 底部海报当前current
            posterIndex: 0,
            viewType: options.picUrl?0:1,
            picUrl: options.picUrl ? options.picUrl : null,
            ifGif: options.picUrl ?0:1,
            userIcon: app.globalData.userInfo.avatarUrl,
            username: "",
            userDate: '于' + util.formatTime(new Date()),
            classIconClick:"changePoster",
            imageTxt: unescape(options.txt)
        });
        this.contentimg = null;
        this.getname();
        // this.changePoster();

    },

    onShow: function () {

    },

    onShareAppMessage: function () {
        return {
            title: '@你，给你留了一段话，快来看看吧~',
            path: `/pages/index/index?conId=${this.data.contentID}&uid=${wx.getStorageSync("u_id")}&type=2&poster=1`,
            imageUrl: this.data.postSrc
        }
    },

    // 生成分享海报换图片
    changeImage: function () {
        let _this = this;
        util.upLoadImage("uploadcontentimg", "image", 1, this, loginApi, function (data) {
            _this.setData({
                ifGif: 1,
            });
            _this.contentimg = data.imgurl;
            _this.changePoster();
        });
    },

    // 放大图片
    previewImage: function (e) {
        let src = e.currentTarget.dataset.src;
        wx.previewImage({
            urls: [this.data.postSrc],
        })
    },

    // 底部分类小icon点击
    changePoster: function (e) {
        if (e && e.currentTarget.dataset.url) {
            var index = e.currentTarget.dataset.index;
            if (index == this.data.posterIndex) {
                return;
            }
            this.setData({
                posterIndex: index,
                ifGif: 1,
            })
            this.posterUrl=null;
            var url = e.currentTarget.dataset.url;
        } else {
            this.setData({
                posterIndex: this.posterUrl ? this.data.posterIndex:0,
            })
            var url = this.data.classArr[0].poster[0].posterAdress;
        }
        if (this.posterUrl) {
            this.posterUrl = this.posterUrl;
        } else {
            this.posterUrl = url;
        }

        let _this = this;
        let changePosterUrl = loginApi.domin + '/home/index/huoqu';
        loginApi.requestUrl(_this, changePosterUrl, "GET", {
            "contentid": this.data.contentID || 3088,
            "uid": wx.getStorageSync("u_id"),
            "posterUrl": this.posterUrl,
            "contentimg": this.contentimg ? this.contentimg : '',
        }, function (res) {
            console.log(res);
            if (res.status == 1) {
                _this.setData({
                    viewType: 1,
                    postSrc: loginApi.srcDomin + res.path.slice(1),
                })
            }
        })
    },

    bindload: function () {
        this.setData({
            ifGif: 0,
        })
    },

    // 请求不同的海报分类
    posterClassChange: function (e) {
        let index = e.currentTarget.dataset.index;
        if (index == this.data.classIndex) {
            return;
        };
        this.setData({
            classIndex: index,
        })
    },

    // 获取海报分类
    getposterClass: function () {
        let _this = this;
        let getposterClassUrl = loginApi.domin + '/home/index/muban';
        loginApi.requestUrl(_this, getposterClassUrl, "GET", {
        }, function (res) {
            if (res.status == 1) {
                _this.setData({
                    classArr: res.contents
                });
                _this.changePoster();
            }
        })
    },

    // 保存图片按钮点击
    savePic: function () {
        let _this = this;
        wx.getSetting({
            success(res) {
                // 进行授权检测，未授权则进行弹层授权
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            _this.saveCanvas();
                        },
                        // 拒绝授权时
                        fail() {
                            _this.saveCanvas();
                        }
                    })
                } else {
                    // 已授权则直接进行保存图片
                    _this.saveCanvas();
                }
            },
            fail(res) {
                _this.saveCanvas();
            }
        })

    },

    // 保存图片
    saveCanvas: function () {
        let _this = this;
        wx.getImageInfo({
            src: this.data.postSrc,
            success(res) {
                console.log(res.path);
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: function () {
                        wx.showModal({
                            title: '海报生成成功',
                            content: `记得分享哦~`,
                            showCancel: false,
                            success: function (data) {
                                wx.previewImage({
                                    urls: [_this.data.postSrc]
                                })
                            }
                        });
                    },
                    fail: function (res) {
                        wx.previewImage({
                            urls: [_this.data.postSrc]
                        })
                    }
                })
            }
        })

    },


    // 获取name
    getname: function () {
        let _this = this;
        let getnameUrl = loginApi.domin + '/home/index/name';
        loginApi.requestUrl(_this, getnameUrl, "POST", {
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            if (res.status == 1) {
                _this.setData({
                    username: res.name
                })

            } else {
                util.toast("数据获取失败,请重试", 300)
            }
        })
    },

    formSubmit: function (e) {
        util.formSubmit(app, e);
    },
})