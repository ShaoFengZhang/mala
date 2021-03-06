import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        ifGif: 0,
        postSrc: '',
        classArr: [
            {
                txt: "",
                id: 1,
                poster: [
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/01.png",
                        posterAdress: "https://duanju.58100.com/upload/img/1.png"
                    },
                    // {
                    //     icon: "https://duanju.58100.com/upload/yasuotu/02.png",
                    //     posterAdress: "https://duanju.58100.com/upload/img/2.png"
                    // },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/03.png",
                        posterAdress: "https://duanju.58100.com/upload/img/3.png"
                    },
                    // {
                    //     icon: "https://duanju.58100.com/upload/yasuotu/04.png",
                    //     posterAdress: "https://duanju.58100.com/upload/img/4.png"
                    // },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/05.png",
                        posterAdress: "https://duanju.58100.com/upload/img/5.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/06.png",
                        posterAdress: "https://duanju.58100.com/upload/img/6.png"
                    },
                    // {
                    //     icon: "https://duanju.58100.com/upload/yasuotu/07.png",
                    //     posterAdress: "https://duanju.58100.com/upload/img/7.png"
                    // },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/08.png",
                        posterAdress: "https://duanju.58100.com/upload/img/8.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/09.png",
                        posterAdress: "https://duanju.58100.com/upload/img/9.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/10.png",
                        posterAdress: "https://duanju.58100.com/upload/img/10.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/11.png",
                        posterAdress: "https://duanju.58100.com/upload/img/11.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/12.png",
                        posterAdress: "https://duanju.58100.com/upload/img/12.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/13.png",
                        posterAdress: "https://duanju.58100.com/upload/img/13.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/14.png",
                        posterAdress: "https://duanju.58100.com/upload/img/14.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/15.png",
                        posterAdress: "https://duanju.58100.com/upload/img/15.png"
                    },
                    {
                        icon: "https://duanju.58100.com/upload/yasuotu/16.png",
                        posterAdress: "https://duanju.58100.com/upload/img/16.png"
                    },

                ]
            },

        ],
    },

    onLoad: function (options) {
        console.log(options)
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 354) * (51 / 85);
        this.setData({
            imgH: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 354,
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
            contentID: options.contentID ? options.contentID : null,
            classIndex: 0, // 底部海报当前current
            posterIndex: 0,
            viewType: 0,
            picUrl: options.picUrl ? options.picUrl : null,
            imageTxt: options.txt ? unescape(options.txt): null,
            posterurl: options.posterurl ? options.posterurl : null,
            userIcon: app.globalData.userInfo.avatarUrl,
            username: "",
            userDate: '于' + util.formatTime(new Date()),
            classIconClick: options.picUrl ? "generateImg" : "changePoster"
        });
        this.getname();
        this.generateImg();

    },

    onShow: function () {

    },

    onShareAppMessage: function () {
        return {
            title: '@你，给你留了一段话，快来看看吧~',
            path: `/pages/index/index?uid=${wx.getStorageSync("u_id")}`,
            imageUrl: this.data.postSrc
        }
    },

    // 生成分享海报换图片
    changeImage: function () {
        let _this = this;
        util.upLoadImage("uploadcontentimg", "image", 1, this, loginApi, function (data) {
            _this.setData({
                ifGif: 1,
                picUrl: data.imgurl
            });
            _this.generateImg(1);
        });
    },

    // 发布图片换文字
    changeTxt: function () {
        this.setData({
            ifGif: 1,
        });
        this.getImgTxt();
    },

    // 得到文案
    getImgTxt: function () {
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/gettext';
        loginApi.requestUrl(_this, getClassUrl, "GET", {
        }, function (res) {
            console.log(res)
            if (res.status == 1) {
                _this.setData({
                    imageTxt: res.contents
                });
                _this.generateImg(1);
            }
        })
    },

    // 生成美图
    generateImg: function (type) {
        this.setData({
            ifGif: type?1:0,
        })
        let _this = this;
        let getnameUrl = loginApi.domin + '/home/index/tutie';
        loginApi.requestUrl(_this, getnameUrl, "GET", {
            "uid": wx.getStorageSync("u_id"),
            "imgurl": this.data.picUrl,
            "posterUrl": this.data.posterurl,
            "text": this.data.imageTxt,
        }, function (res) {
            console.log("generateImg", res);
            if (res.status == 1) {
                _this.setData({
                    viewType: 1,
                    postSrc: loginApi.srcDomin + res.path.slice(1)
                })
            }
        })
    },

    // 放大图片
    previewImage: function (e) {
        let src = e.currentTarget.dataset.src;
        wx.previewImage({
            urls: [this.data.postSrc],
        })
    },

    bindload: function () {
        console.log("bindload");
        this.setData({
            ifGif: 0,
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

    // 获取分类
    getClass: function () {
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/getClass';
        loginApi.requestUrl(_this, getClassUrl, "GET", {
        }, function (res) {
            if (res.status == 1) {
                _this.setData({
                    classArr: res.class
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