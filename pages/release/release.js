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
        classId: 10,
        srcDomin: loginApi.srcDomin,
        textArea:'',
        relasePrompt:1,
    },

    onLoad: function(options) {
        let _this = this;
        this.txtArea = '';
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
    },

    onShow: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
        let classId = wx.getStorageSync("classId");
        let className = wx.getStorageSync("className");
        this.setData({
            classTxt: className ? className : "选择话题",
            classId: classId ? classId : 10,
        })
    },

    onUnload:function(){
        try {
            wx.removeStorageSync('classId');
            wx.removeStorageSync('className');
        } catch (e) {

        };
    },

    catchtap:function(){},

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
        let _this=this;
        if (9 - this.data.userPicArr.length<=0){
            util.toast("最多上传九张图片",1200);
            return;
        }
        util.upLoadImage("uploadimg", "image", (9-this.data.userPicArr.length), this, loginApi, function(data) {
            console.log(data);
            if(data.status==1){
                _this.data.userPicArr.push(data.imgurl)
                _this.setData({
                    userPicArr: _this.data.userPicArr,
                })
            }else{
                util.toast('上传失败',1200);
                return;
            }
            
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
        let releaseFunUrl = loginApi.domin + '/home/index/userrelease';
        loginApi.requestUrl(_this, releaseFunUrl, "POST", {
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "title": this.txtArea,
            "imgurl": this.data.userPicArr.join(','),
            "typeid": this.data.classId,
        }, function(res) {
            wx.hideLoading();
            if (res.status == 1) {
                // util.toast('发布成功', 1200);
                _this.setData({
                    userPicArr: [],
                    classTxt: "选择话题",
                    classId: null,
                    textArea: '',
                });
                wx.navigateTo({
                    url: `/pages/details/details?conId=${res.contentid}`,
                })
            }else{
                util.toast('发布失败，请重试~',1200);
            }
        })
    },

    // 文本框输入时触发
    txtBindInput: function(e) {
        this.txtArea = e.detail.value;
    },

    bindfocus: function(){
        this.setData({
            relasePrompt: 0,  
        })
    },

    bindblur:function(){
        if (!util.check(this.txtArea)) {
            this.setData({
                relasePrompt: 1,   
            });
            this.txtArea="";
        }else{
            this.setData({
                relasePrompt: 0,
            }) 
        }
    },

    formSubmit: function (e) {
        util.formSubmit(app, e);
    },
})