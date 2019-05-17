import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },

    onLoad: function(options) {
        
    },

    onShow: function() {},

    onHide: function() {

    },

    onTabItemTap: function() {
        try {
            wx.removeStorageSync('classId');
            wx.removeStorageSync('className');
        } catch (e) {

        }
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
        this.getMyDate();
    },

    onShareAppMessage: function() {
        return util.shareObj
    },

    getUserInfo:function(e){
        console.log(e);
        if (!e.detail.userInfo){
            util.toast("微信授权没有风险哦亲~",1200)
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

    getMyDate: function() {
        util.loding('加载中');
        let _this = this;
        let getMyDateUrl = loginApi.domin + '/home/index/getuserinfos';
        loginApi.requestUrl(_this, getMyDateUrl, "POST", {
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
            wx.hideLoading();
            if (res.status == 1) {
                _this.setData({
                    userInfos: res.userinfo,
                })
            }
        })
    },

    pageNav: function(e) {
        let navPath = e.currentTarget.dataset.path;
        wx.navigateTo({
            url: `${navPath}`,
        })
    }
})