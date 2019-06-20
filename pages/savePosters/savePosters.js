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
        postSrc: "/assets/shareimg/img2.png",
        ifGif: 1,
    },

    onLoad: function(options) {
        let imgW = ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 258) * (670 / 946);
        this.setData({
            imgW: imgW > 750 ? imgW * ((750 / imgW) - 0.02) : imgW,
            posterId: options.posterId ? options.posterId : 0,
            qrcode: `${loginApi.domin}/home/index/qcodes?page=pages/index/index&uid=${wx.getStorageSync('u_id')}&contentid=${options.contentID ? options.contentID : null}`,
        });
        options.contentID ? this.getcontent(options.contentID) : ""
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
            urls: [this.data.postSrc],
        })
    },

    backTopPage: function() {
        wx.navigateBack({
            delta: 1
        })
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
                    contentImg: obj.imgurl[0] ? _this.data.srcDomin + obj.imgurl[0] : "https://duanju.58100.com/upload/usercontent/1561007045451.png",
                    contentTxt: obj.title ? obj.title : "麻辣短句欢迎您！"
                });
                _this.drawcanvs();
            } else {
                util.toast("数据获取失败,请重试", 300)
            }
        })
    },

    // 绘制Canvas
    drawcanvs: function() {
        let _this = this;
        let cantarget = this.data.cardArr[this.data.posterId];
        let ctx = wx.createCanvasContext('canvas');
        let uerName = app.globalData.userInfo.nickName.slice(0, 10);
        let userDate = '于' + util.formatTime(new Date());
        let canvasImg = null;
        let userImg = null;
        let qrcodeimg = null;
        let posterImg = null;

        wx.getImageInfo({
            src: cantarget.bgUrl,
            success: function(res) {
                _this.setData({
                    bgimgH: res.height * 2 / 3,
                    bgimgW: res.width * 2 / 3,
                });
                canvasImg = res.path;
                wx.getImageInfo({
                    src: _this.data.contentImg,
                    success: function(res1) {
                        console.log(res1.path)
                        ctx.drawImage(res1.path,0,0,res1.width,res1.height, cantarget.left, cantarget.top, cantarget.width, cantarget.height);
                        ctx.drawImage(canvasImg, 0, 0, _this.data.bgimgW, _this.data.bgimgH);
                        ctx.setTextBaseline('top');
                        ctx.setTextAlign('left');
                        ctx.setFillStyle(cantarget.posterColor)
                        ctx.setFontSize(24);
                        ctx.fillText(userDate, 224, 800);
                        ctx.setFontSize(32);
                        ctx.fillText(uerName, 224, 748);
                        ctx.font = 'italic bold 36px cursive';
                        let txtw = 40;
                        const cvsT = util.javaTrim(_this.data.contentTxt);
                        const metrics = ctx.measureText(cvsT);
                        const tarW = parseInt(590 / (Math.ceil(metrics.width) / cvsT.length))
                        console.log(tarW);
                        if (Math.ceil(metrics.width) > 1770) {
                            ctx.fillText(cvsT.slice(0, tarW), txtw, 440);
                            ctx.fillText(cvsT.slice(tarW, 2 * tarW), txtw, 440 + 56);
                            ctx.fillText(cvsT.slice(2 * tarW, 3 * tarW), txtw, 440 + 56 * 2);
                            ctx.fillText(cvsT.slice(3 * tarW, 4 * tarW - 2) + "...", txtw, 440 + 56 * 3);

                        } else if (Math.ceil(metrics.width) > 1180 && Math.ceil(metrics.width) < 1770) {
                            ctx.fillText(cvsT.slice(0, tarW), txtw, 440);
                            ctx.fillText(cvsT.slice(tarW, 2 * tarW), txtw, 440 + 56);
                            ctx.fillText(cvsT.slice(2 * tarW), txtw, 440 + 56 * 2);

                        } else if (Math.ceil(metrics.width) > 590 && Math.ceil(metrics.width) < 1180) {
                            ctx.fillText(cvsT.slice(0, tarW), txtw, 440);
                            ctx.fillText(cvsT.slice(tarW), txtw, 440 + 56);
                        } else {
                            ctx.fillText(cvsT, txtw, 440);
                        };

                        wx.getImageInfo({
                            src: _this.data.qrcode,
                            success: function (res) {
                                qrcodeimg = res.path;
                                // 绘制圆形二维码
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(132, 794, 72, 0, 2 * Math.PI);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(qrcodeimg, 60, 722, 144, 144);
                                ctx.restore();
                                ctx.beginPath();
                                ctx.stroke();
                                wx.getImageInfo({
                                    src: app.globalData.userInfo.avatarUrl,
                                    success: function (res) {
                                        userImg = res.path;
                                        // 绘制圆形头像
                                        ctx.save();
                                        ctx.beginPath();
                                        ctx.arc(132, 794, 33, 0, 2 * Math.PI);
                                        ctx.closePath();
                                        ctx.clip();
                                        ctx.drawImage(userImg, 100, 762, 66, 66);
                                        ctx.restore();
                                        ctx.beginPath();
                                        ctx.stroke();
                                        ctx.draw();
                                        setTimeout(function () {
                                            _this.showOffRecord()
                                        }, 2000)
                                    }
                                })
                            }
                        }) 
                    }
                })

            }
        });
    },

    // 生成临时图片
    showOffRecord: function() {
        let _this = this;
        wx.canvasToTempFilePath({
            destWidth: this.data.bgimgW,
            destHeight: this.data.bgimgH,
            canvasId: 'canvas',
            success: function(res) {
                _this.setData({
                    postSrc: res.tempFilePath,
                    ifGif: 0,
                })
                _this.saveCanvas(res);
            }
        })
    },

    // 保存图片
    saveCanvas: function(res) {
        wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function() {
                wx.showModal({
                    title: '海报生成成功',
                    content: `记得分享哦~`,
                    showCancel: false,
                    success: function(data) {
                        wx.previewImage({
                            urls: [res.tempFilePath]
                        })
                    }
                });
            },
            fail: function() {
            }
        })
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})