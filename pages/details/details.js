import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        txtValue: "",
        srcDomin: loginApi.srcDomin,
        praiseEvent: 'praiseEvent',
        commentArr: [],
        ifPopUp: 0,
        showBotTxt: 0,
        praiseId: "",
        praiseEvent2: 'praiseEvent2',
        ifshowrulesView: 0,
    },

    onLoad: function(options) {

        this.page = 1;
        this.rows = 10;
        this.cangetData = true;

        this.setData({
            classScrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 110,
        });
        console.log(options)
        if (options && options.conId) {
            this.getcontent(options.conId);
            this.getSupportcontent(options.conId);
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
            path: `/pages/index/index?conId=${this.data.content.id}&uid=${wx.getStorageSync("u_id")}&type=2`,
            imageUrl: this.data.content.imgurl[0] ? this.data.srcDomin + this.data.content.imgurl[0] : `/assets/shareimg/img.png`
        }
    },

    // 收藏
    collectionContent: function(e) {
        let _this = this;
        let url = e.currentTarget.dataset.url;
        let collectUrl = loginApi.domin + `/home/index/${url}`;
        loginApi.requestUrl(_this, collectUrl, "POST", {
            "contentid": this.data.conId,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
            if (res.status == 1) {
                _this.setData({
                    collection: url == "collection" ? 1 : 0,
                });
                url == "collection" ? app.collectIndex = null : app.collectIndex = _this.data.praiseIndex;
                util.toast(url == "collection" ? "收藏成功~" : "取消成功~", 1200)
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

    // 获取评论内容
    getSupportcontent: function(conId) {
        let _this = this;
        let getSupportcontentUrl = loginApi.domin + '/home/index/getcomments';
        loginApi.requestUrl(_this, getSupportcontentUrl, "POST", {
            "id": conId,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "page": this.page,
            "len": this.rows,
        }, function(res) {
            if (res.status == 1) {

                for (let n = 0; n < res.comments.length; n++) {
                    for (let j = 0; j < res.issupport.length; j++) {

                        if (res.issupport[j].commentsid == res.comments[n].id) {
                            res.comments[n].dianji = 12;
                        };
                    };

                    if (parseInt(res.comments[n].support) > 10000) {
                        let num = parseInt(res.comments[n].support);
                        res.comments[n].support = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                }

                _this.setData({
                    commentArr: _this.data.commentArr.concat(res.comments),
                });

                if (res.comments.length < _this.rows) {
                    _this.cangetData = false;
                    _this.setData({
                        showBotTxt: 1,
                    });
                };
            } else {
                util.toast("数据获取失败,请重试", 300)
            }
        })
    },

    // 滑动到底部
    bindscrolltolower: function() {
        if (this.cangetData) {
            this.page++;
            this.getSupportcontent(options.conId);
        }
    },

    // 提交评论
    commitComments: function() {
        if (!util.check(this.contentTxt)) {
            util.toast('请输入有效的评论', 1200);
            return;
        };
        this.commitUrl();
    },

    goToQrCode: function () {
        wx.navigateTo({
            url: `/pages/posters/posters?contentID=${this.data.content.id}`,
        })
    },

    // 提交评论请求
    commitUrl: function() {
        let _this = this;
        let commitUrl = loginApi.domin + '/home/index/comments';
        loginApi.requestUrl(_this, commitUrl, "POST", {
            "title": this.contentTxt,
            "contentid": this.data.content.id,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "bopenid": this.data.content.openid,
            "buid": this.data.content.uid,
        }, function(res) {
            console.log(res);
            if (res.status == 1) {
                _this.page = 1;
                _this.rows = 10;
                _this.cangetData = true;
                _this.setData({
                    commentArr: [],
                    praiseId: '',
                    pointAni: null,
                })
                _this.getSupportcontent(_this.data.conId);
            } else {
                util.toast("评论失败,请重试", 300)
            }
        })
    },

    bindinput: function(e) {
        let value = e.detail.value;
        this.contentTxt = value;
    },

    bindblur: function() {
        this.setData({
            ifPopUp: 0,
            txtValue: '',
            praiseId: '',
            pointAni: null,
            txtpointAni: null,
        })
    },

    bindfocus: function() {
        this.setData({
            ifPopUp: 1,
        })
    },

    // 点赞事件
    praiseEvent: function() {
        this.setData({
            praiseEvent: '',
        })
        if (this.data.content.dianji) {
            this.crearteAnimation();
            return;
        }
        this.addpriseNum();
    },

    // 评论点赞事件
    praiseEvent2: function(e) {
        this.setData({
            praiseId: '',
            pointAni: null,
            praiseEvent2: 'catchtap',
        });
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        if (this.data.commentArr[index].dianji) {
            this.setData({
                praiseId: id,
            });
            this.crearteAnimationP();
            return;
        }
        this.addpriseNum2(id, index);
    },

    // 点赞请求
    addpriseNum: function() {
        let _this = this;
        let addpriseNumUrl = loginApi.domin + '/home/index/support';
        loginApi.requestUrl(_this, addpriseNumUrl, "POST", {
            "id": this.data.content.id,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "bopenid": this.data.content.openid,
            "buid": this.data.content.uid,
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
                res.new ? "" : _this.triggerEvent('showbeansMask')
            } else {
                util.toast("点赞失败,请重试", 300)
            }
        })
    },

    // 评论点赞请求
    addpriseNum2: function(id, index) {
        let _this = this;
        let addpriseNumUrl = loginApi.domin + '/home/index/commentsupport';
        loginApi.requestUrl(_this, addpriseNumUrl, "POST", {
            "commentsid": id,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "bopenid": this.data.commentArr[index].openid,
            "buid": this.data.commentArr[index].uid,
        }, function(res) {
            console.log(res);
            if (res.status == 1) {
                _this.data.commentArr[index].dianji = 1;
                _this.data.commentArr[index].support++;
                _this.setData({
                    commentArr: _this.data.commentArr,
                });
                _this.crearteAnimationP();
            } else {
                util.toast("点赞失败,请重试", 300)
            }
        })
    },

    showTables: function (e) {
        let id = parseInt(e.currentTarget.dataset.id);
        console.log(id);
        // wx.navigateTo({
        //     url: `/pages/details/details?conId=${this.data.contentArr[index].id}`,
        // })
    },

    // 动画
    crearteAnimation: function() {
        this.setData({
            txtpointAni: null,
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
            txtpointAni: pointAni.export(),
        });
        setTimeout(() => {
            this.setData({
                praiseEvent: 'praiseEvent',
            })
        }, 600)
    },

    // 动画
    crearteAnimationP: function() {

        if (!this.canAni) {
            let _this = this;
            this.setData({
                pointAni: null,
                praiseEvent2: 'catchtap',
            })
            let pointAni = wx.createAnimation({
                duration: 500,
                timingFunction: "linear",
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
                    praiseEvent2: 'praiseEvent2',
                })
            }, 600)
        }
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

    showbeansMask: function () {
        this.setData({
            ifshowrulesView: !this.data.ifshowrulesView
        })
    },

    goToFounPage: function () {
        wx.switchTab({
            url: '/pages/found/found'
        })
        this.showbeansMask();
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})