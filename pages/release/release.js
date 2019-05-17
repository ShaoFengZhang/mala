import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userPicArr: [],
        classTxt: "选择话题",
        classId: '',
        classId: null,
    },

    onLoad: function(options) {
        let _this = this;
        this.txtArea = '';
    },

    onTabItemTap: function () {
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
        let classId = wx.getStorageSync("classId");
        let className = wx.getStorageSync("className");
        this.setData({
            classTxt: className ? className : "选择话题",
            classId: classId ? classId : '',
        })
    },

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

    // 跳转选择类别
    changeClass: function() {
        wx.navigateTo({
            url: `/pages/changeClass/changeClass`,
        })
    },

    // 删除用户的图片
    deletepic: function(e) {
        let index = e.currentTarget.dataset.index;
        this.data.userPicArr.splice(index, 1);
        this.setData({
            userPicArr: this.data.userPicArr,
        });
    },

    // 上传图片
    uploadPictures: function() {
        util.upLoadImage("uploadphoto", "photo", 1, this, loginApi, function(data) {
            _this.setData({
                avatarUrl: loginApi.domin + data.imgurl
            })
        });
    },

    // 确认发布
    confirmRelease: function() {
        if (!util.check(this.txtArea)) {
            util.toast("请输入有效内容~", 1200)
            return;
        };
        this.releaseFun();
    },

    // 发布请求
    releaseFun: function() {
        util.loding('发布中');
        let _this = this;
        let releaseFunUrl = loginApi.domin + '/home/index/release';
        loginApi.requestUrl(_this, releaseFunUrl, "POST", {
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "content": this.txtArea,
            "pic": this.data.userPicArr,
            "classId": this.data.classId,
        }, function(res) {
            wx.hideLoading();
            if (res.status == 1) {
                util('发布成功', 1200);
            }else{
                util('发布失败，请重试~',1200);
            }
        })
    },

    // 文本框输入时触发
    txtBindInput: function(e) {
        this.txtArea = e.detail.value;
    }, 
})