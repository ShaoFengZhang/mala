import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        txtValue: "",
        srcDomin: loginApi.srcDomin,
        praiseEvent: 'praiseEvent',
        commentArr: [1, 2],
        ifPopUp: 0,
    },

    onLoad: function(options) {
        this.setData({
            classScrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 110,
        });
        console.log(options)
        if (options && options.conId) {
            this.getcontent(options.conId);
            this.setData({
                praiseIndex: parseInt(options.index),
                conId: options.conId,
            })
            console.log(this.data.praiseIndex);
            return;
        };
    },

    onShow: function() {},

    onShareAppMessage: function() {
        return {
            title: this.data.content.title.slice(0, 28),
            path: `/pages/index/index?conId=${this.data.content.id}`,
            imageUrl: this.data.content.imgurl[0] ? this.data.srcDomin + this.data.content.imgurl[0] : `/assets/shareimg/img.png`
        }
    },

    // 收藏
    collectionContent: function (e) {
        let _this = this;
        let url=e.currentTarget.dataset.url;
        let collectUrl = loginApi.domin + `/home/index/${url}`;
        loginApi.requestUrl(_this, collectUrl, "POST", {
            "contentid": this.data.conId,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    collection: url =="collection"?1:0,
                });
                util.toast(url == "collection" ? "收藏成功~":"取消成功~", 1200)
            } else {
                util.toast(url == "collection" ? "收藏失败，请重试" : "取消失败，请重试", 1200)
            }
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
                obj.dianji = res.dianji;
                obj.imgurl = res.content.imgurl.split(',');
                _this.setData({
                    content: obj,
                    collection: res.collection,
                })
            } else {
                util.toast("数据获取失败,请重试", 300)
            }
        })
    },

    // 提交评论
    commitComments: function() {
        if (!util.check(this.contentTxt)) {
            util.toast('请输入有效的评论', 1200);
            return;
        }
    },

    // 提交评论请求
    commitUrl: function() {
        let _this = this;
        let commitUrl = loginApi.domin + '/home/index/support';
        loginApi.requestUrl(_this, addpriseNumUrl, "POST", {
            "txt": this.contentTxt,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
            console.log(res);
            if (res.status == 1) {
                _this.data.content.dianji = 1;
                _this.setData({
                    content: _this.data.content,
                });
                _this.crearteAnimation();
                app.praiseIndex = _this.data.praiseIndex;
                console.log(app.praiseIndex);
            } else {
                util.toast("点赞失败,请重试", 300)
            }
        })
    },

    bindinput: function(e) {
        console.log(e);
        let value = e.detail.value;
        this.contentTxt = value;
    },

    bindblur: function() {
        this.setData({
            ifPopUp: 0,
            txtValue: '',
        })
    },

    bindfocus: function() {
        this.setData({
            ifPopUp: 1,
        })
    },

    // 点赞事件
    praiseEvent: function() {
        if (this.data.content.dianji) {
            this.crearteAnimation();
            return;
        }
        this.addpriseNum();
    },

    // 点赞请求
    addpriseNum: function() {
        let _this = this;
        let addpriseNumUrl = loginApi.domin + '/home/index/support';
        loginApi.requestUrl(_this, addpriseNumUrl, "POST", {
            "id": this.data.content.id,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
            console.log(res);
            if (res.status == 1) {
                _this.data.content.dianji = 1;
                _this.setData({
                    content: _this.data.content,
                });
                _this.crearteAnimation();
                app.praiseIndex = _this.data.praiseIndex;
                console.log(app.praiseIndex);
            } else {
                util.toast("点赞失败,请重试", 300)
            }
        })
    },

    // 动画
    crearteAnimation: function() {
        this.setData({
            pointAni: null,
            praiseEvent: '',
        })
        let pointAni = wx.createAnimation({
            duration: 500,
            timingFunction: "ease",
        });
        pointAni.scale(1.5, 1.5).step({
            duration: 250,
        });
        pointAni.scale(1, 1).step({
            duration: 250,
        });
        this.setData({
            pointAni: pointAni.export(),
        });
        setTimeout(() => {
            this.setData({
                praiseEvent: 'praiseEvent',
            })
        }, 600)
    },

    // 复制文本
    copytxt: function() {
        wx.setClipboardData({
            data: this.data.content.title,
            success(res) {}
        })
    },

    showImg: function(e) {
        let src = e.currentTarget.dataset.src;
        wx.previewImage({
            urls: [src] // 需要预览的图片http链接列表
        })
    },

    // 跳转用户主页
    gotoUserHome: function(e) {
        let uid = e.currentTarget.dataset.uid;
        let openid = e.currentTarget.dataset.openid;
        let urlsrc = e.currentTarget.dataset.src;
        let name = e.currentTarget.dataset.name;
        let note = e.currentTarget.dataset.note;
        wx.navigateTo({
            url: `/pages/userCenter/userCenter?uid=${uid}&openid=${openid}&urlsrc=${urlsrc}&name=${name}&note=${note}`,
        })
    },
})