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
        let _this = this;
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
    },

    onTabItemTap: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
        try {
            wx.removeStorageSync('classId');
            wx.removeStorageSync('className');
        } catch (e) {

        };
    },

    onShow: function() {

    },

    catchtap: function() {},

    // 获取授权信息
    getUserInfo: function(e) {
        console.log(e);
        if (!e.detail.userInfo) {
            util.toast("发布需要授权哦亲~", 1200)
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

    onHide: function() {},

    // 分享
    onShareAppMessage: function() {
        return util.shareObj
    },

    // 发布文字
    goToRelease: function(e) {
        let path = e.currentTarget.dataset.path;
        wx.navigateTo({
            url: `${path}`,
        })
    },

    // 选图片
    changePic: function() {
        let _this = this;
        util.upLoadImage("tutieimg", "image", 1, this, loginApi, function(data) {
            _this.contentimg = data.imgurl;
            wx.navigateTo({
                url: `/pages/poster1/poster1?picUrl=${data.imgurl}`,
            })
        });
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})