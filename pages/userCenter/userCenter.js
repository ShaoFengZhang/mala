import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        contentArr: [],
        showBotTxt:1,
        focus:0,
        srcDomin: loginApi.srcDomin,
    },

    onLoad: function(options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
        let _this = this;
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        console.log(options);
        if (options && options.uid) {
            this.openid = options.openid;
            this.uid = options.uid;
            this.getUserContent();
            this.setData({
                useIcon: options.urlsrc[0] == '/' ? loginApi.domin + options.urlsrc : options.urlsrc,
                note: util.check(options.note) ? options.note:"这个人很懒，什么也不想写~",
                username:options.name,
            })
        }
    },

    onShow: function() {
        if (app.praiseIndex) {
            app.praiseIndex = parseInt(app.praiseIndex) - 1
            console.log(this.data.contentArr[app.praiseIndex-1])
            this.data.contentArr[app.praiseIndex].dianji = 1;
            this.data.contentArr[app.praiseIndex].support = this.data.contentArr[app.praiseIndex].support + 1;
            this.setData({
                contentArr: this.data.contentArr
            })
        };
        app.praiseIndex = null;
    },

    onHide: function() {

    },

    // 分享
    onShareAppMessage: function() {
        return util.shareObj
    },

    catchtap:function(){},

    // 获取授权信息
    getUserInfo: function (e) {
        console.log(e);
        if (!e.detail.userInfo) {
            util.toast("关注需要授权哦亲~", 1200)
            return
        }
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        let iv = e.detail.iv;
        let encryptedData = e.detail.encryptedData;
        let session_key = app.globalData.session_key;
        loginApi.checkUserInfo(app, e.detail, iv, encryptedData, session_key)
    },

    // 得到内容信息
    getUserContent: function() {
        let _this = this;
        let getUserContent = loginApi.domin + '/home/index/getusercontent';
        loginApi.requestUrl(_this, getUserContent, "POST", {
            "bopenid": _this.openid,
            "buid": _this.uid,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "page": this.page,
            "len": this.rows,
        }, function(res) {
            console.log(res);
            if (res.status == 1) {

                for (let n = 0; n < res.contents.length; n++) {
                    for (let j = 0; j < res.support.length; j++) {
                        if (res.support[j].contentid == res.contents[n].id) {
                            res.contents[n].dianji = 12;
                        }
                    }
                }

                for (let i = 0; i < res.contents.length; i++) {
                    res.contents[i].imgurl = res.contents[i].imgurl.split(',');
                };

                for (let i = 0; i < res.contents.length; i++) {
                    // 获赞处理
                    if (parseInt(res.contents[i].support) > 10000) {
                        let num = parseInt(res.contents[i].support);
                        res.contents[i].support = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                    // 评论
                    if (parseInt(res.contents[i].comments) > 10000) {
                        let num = parseInt(res.contents[i].comments);
                        res.contents[i].comments = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                };

                _this.setData({
                    contentArr: _this.data.contentArr.concat(res.contents),
                    focus:res.focus,
                });
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                    _this.setData({
                        showBotTxt: 1,
                    });
                };
            }
        })
    },

    // 滑动到底部
    bindscrolltolower: function () {
        if (this.cangetData) {
            this.page++;
            this.getUserContent();
        }
    },

    fansFocus:function(){
        let _this = this;
        let fansFocusUrl = loginApi.domin + '/home/index/addfocus';
        loginApi.requestUrl(_this, fansFocusUrl, "POST", {
            "bopenid": _this.openid,
            "buid": _this.uid,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            console.log(res);
            if (res.status == 1) {
                util.toast("关注成功",1200);
                _this.setData({
                    focus:1,
                })               
            }else{
                util.toast("关注失败", 1200); 
            }
        })
    },

    fansCancelFocus:function(){
        let _this = this;
        let fansFocusUrl = loginApi.domin + '/home/index/delfocus';
        loginApi.requestUrl(_this, fansFocusUrl, "POST", {
            "bopenid": _this.openid,
            "buid": _this.uid,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            console.log(res);
            if (res.status == 1) {
                util.toast("取消关注", 1200)
                _this.setData({
                    focus:0,
                })
            } else {
                util.toast("取消失败", 1200);
            }
        })
    },

    // 跳转详情页
    goToDetails: function (e) {
        let index = parseInt(e.currentTarget.dataset.index);
        wx.navigateTo({
            url: `/pages/details/details?conId=${this.data.contentArr[index].id}&index=${index+1}`,
        })
    },
})