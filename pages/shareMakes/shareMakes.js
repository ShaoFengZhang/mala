import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        ifshowInput:0,
        inputValue:'来麻辣短句，分享你的诗意',
        focusNum:0,
        focusUserArr:[1,23,5,6],
        rewardView:0,
    },

    onLoad: function (options) {
        this.drawcanvs()
    },

    onShow: function () {

    },

    onHide: function () {

    },

    onShareAppMessage: function () {
        return util.shareObj
    },

    editorTxt:function(){
        this.setData({
            ifshowInput:1,
            inputValue:'',
        });
        this.inputValue=null;
    },

    bindinput:function(e){
        this.inputValue=e.detail.value;
    },

    saveTxt:function(){
        this.setData({
            inputValue: this.inputValue ? this.inputValue:'',
        })
        if (!util.check(this.data.inputValue)) {
            util.toast("请输入有效内容~", 1200);
            this.setData({
                inputValue:'来麻辣短句，分享你的诗意',
            });
        };

        let inputValue=null;
        if (this.data.inputValue==""){
            inputValue ="来麻辣短句，分享你的诗意";
        }else{
            inputValue = this.data.inputValue
        }
        this.setData({
            ifshowInput: 0,
            inputValue: inputValue,
        })
    },

    closeReward:function(){
        this.setData({
            rewardView: !this.data.rewardView, 
        })
    },

    formSubmit: function (e) {
        util.formSubmit(app, e);
    },

    // 绘制Canvas
    drawcanvs: function () {
        let _this = this;
        let ctx = wx.createCanvasContext('canvas');
        let canvasImg = 'https://duanju.58100.com/upload/bg.png';
        let qrcodeimg = `${loginApi.domin}/home/index/shares?page=pages/index/index&uid=${wx.getStorageSync('u_id')})`;
        let userImg = null;

        wx.getImageInfo({
            src: canvasImg,
            success: function (res) {
                _this.setData({
                    bgimgH: res.height,
                    bgimgW: res.width,
                });
                ctx.drawImage(res.path, 0, 0, _this.data.bgimgW, _this.data.bgimgH);
                wx.getImageInfo({
                    src: qrcodeimg,
                    success: function (res1) {
                        // 绘制圆形二维码
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(336, 130, 90, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(res1.path, 246, 40, 180, 180);
                        ctx.restore();
                        ctx.beginPath();
                        ctx.stroke();
                        wx.getImageInfo({
                            src: app.globalData.userInfo.avatarUrl,
                            success: function (res2) {
                                // 绘制圆形头像
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(336, 130, 38, 0, 2 * Math.PI);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(res2.path, 298, 92, 76, 76);
                                ctx.restore();
                                ctx.beginPath();
                                ctx.stroke();
                                ctx.draw();
                            }
                        })
                    }
                })
            }
        });
    },

    // 生成临时图片
    showOffRecord: function () {
        let _this = this;
        wx.canvasToTempFilePath({
            destWidth: this.data.bgimgW,
            destHeight: this.data.bgimgH,
            canvasId: 'canvas',
            success: function (res) {
                console.log(res.tempFilePath)
                _this.saveCanvas(res);
            }
        })
    },

    // 保存图片
    saveCanvas: function (res) {
        wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
                wx.showModal({
                    title: '海报生成成功',
                    content: `记得分享哦~`,
                    showCancel: false,
                    success: function (data) {
                        wx.previewImage({
                            urls: [res.tempFilePath]
                        })
                    }
                });
            },
            fail: function () {
                wx.previewImage({
                    urls: [res.tempFilePath]
                })
            }
        })
    },

    savePic: function () {
        let _this = this;
        wx.getSetting({
            success(res) {
                // 进行授权检测，未授权则进行弹层授权
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            _this.showOffRecord() 
                        },
                        // 拒绝授权时
                        fail() {
                            _this.showOffRecord() 
                        }
                    })
                } else {
                    // 已授权则直接进行保存图片
                    _this.showOffRecord()
                }
            },
            fail(res) {
                _this.showOffRecord()
            }
        })

    },
})