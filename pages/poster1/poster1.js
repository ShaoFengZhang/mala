import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        ifGif:1,
        postSrc:'',
        classArr:[
            {
                txt: "",
                id: 1,
                poster:[
                    {
                        icon:"https://duanju.58100.com/upload/yasuotu/01.png",
                        posterAdress:"https://duanju.58100.com/upload/img/1.png"
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
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 354) * (51 / 85);
        this.setData({
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
            contentID: options.contentID ? options.contentID : null,
            classIndex: 0, // 底部海报当前current
            posterIndex:0,
        });
        this.contentimg=null;
        this.changePoster();
        
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

    changeImage:function(){
        console.log(123)
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
    changePoster: function (e){
        if (e && e.currentTarget.dataset.url){
            var index = e.currentTarget.dataset.index;
            if (index == this.data.posterIndex) {
                return;
            }
            this.setData({
                posterIndex: index,
                ifGif: 1,
            })
            var url = e.currentTarget.dataset.url;
        }else{
            this.setData({
                posterIndex: 0,
            })
            var url = this.data.classArr[0].poster[0].posterAdress; 
        }
        
        let _this = this;
        let changePosterUrl = loginApi.domin + '/home/index/huoqu';
        loginApi.requestUrl(_this, changePosterUrl, "GET", {
            "contentid": this.data.contentID || 3088,
            "uid": wx.getStorageSync("u_id"),
            "posterUrl": url,
            "contentimg": this.contentimg ? this.contentimg:'',
        }, function (res) {
            console.log(res);
            if (res.status == 1) {
                _this.setData({
                    postSrc: loginApi.srcDomin+res.path.slice(1)
                })
            }
        })
    },

    bindload:function(){
        this.setData({
            ifGif:0,
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
        let _this=this;
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
    getClass:function(){
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

    formSubmit: function (e) {
        util.formSubmit(app, e);
    },
})