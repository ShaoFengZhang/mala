import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        srcDomin: loginApi.srcDomin,
        userBeans:0,
        dayArr: [

            {
                dayTxt: "第一天",
                beans: 5,
                ifSign: 0,
            },
            {
                dayTxt: "第二天",
                beans: 5,
                ifSign: 0,
            },
            {
                dayTxt: "第三天",
                beans: 5,
                ifSign: 0,
            },
            {
                dayTxt: "第四天",
                beans: 5,
                ifSign: 0,
            },
            {
                dayTxt: "第五天",
                beans: 5,
                ifSign: 1,
            },
            {
                dayTxt: "第六天",
                beans: 5,
                ifSign: 0,
            },
            {
                dayTxt: "第七天",
                beans: 5,
                ifSign: 0,
            },
        ],
        taskObj: [{
                title: '首次连续签到7天领句豆',
                content: '别忘了每天来打卡哦',
                btnTxt: '签到',
                path: "api",
                type: 1,
            },
            // {
            //     title: '首次发布短句',
            //     content: '+50句豆',
            //     btnTxt: '去发布',
            //     path: '/pages/release/release',
            //     type: 2,
            // },
            {
                title: '首次点赞评论内容',
                content: '+20句豆',
                btnTxt: '去评论',
                path: '/pages/index/index',
                type: 2,
            },
            {
                title: '首次邀请好友',
                content: '+20句豆',
                btnTxt: '去邀请',
                path: '/pages/shareMakes/shareMakes',
                type: 3,
            }
        ]
    },

    onLoad: function(options) {
        let _this = this;
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
        this.foundSign(1);
        this.getuserbeans();
    },

    onShareAppMessage: function(e) {
        return util.shareObj
    },

    // 获取用户信息
    getUserInfo: function(e) {
        console.log(e);
        if (!e.detail.userInfo) {
            util.toast("我们需要您的授权哦亲~", 1200)
            return
        };
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        let iv = e.detail.iv;
        let encryptedData = e.detail.encryptedData;
        let session_key = app.globalData.session_key;
        loginApi.checkUserInfo(app, e.detail, iv, encryptedData, session_key);
    },

    catchtap: function() {},

    // 签到click
    signClick: function() {
        this.foundSign(2)
    },

    // 签到的接口
    foundSign: function(type) {
        let _this = this;
        let foundSignUrl = loginApi.domin + '/home/index/sign';
        loginApi.requestUrl(_this, foundSignUrl, "POST", {
            "uid": wx.getStorageSync("u_id"),
            "type": type,
        }, function(res) {
            if (res.status == 1) {
                console.log(res);
                for (let i = 0; i < _this.data.dayArr.length; i++) {
                    _this.data.dayArr[i].beans = res.beans[i + 1];
                    _this.data.dayArr[i].ifSign = i < res.day ? 1 : 0;
                    _this.setData({
                        dayArr: _this.data.dayArr,
                        daynums: res.day,
                    });
                    type==2?util.toast("签到成功"):null;
                }
            } else if (res.status == 0){
                util.toast("每天只能签到一次")
            }else {
                wx.showModal({
                    title: '提示',
                    content: '数据获取失败,请稍后再试',
                    showCancel: false,
                    success: function(res) {
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    }
                })
            }
        })
    },

    pageNav: function(e) {
        let navPath = e.currentTarget.dataset.path;
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
            this.foundSign(2)
        } else if (type == 2) {
            wx.switchTab({
                url: `${navPath}`
            })
        } else {
            wx.navigateTo({
                url: `${navPath}`,
            })
        }

    },

    showbeansMask: function() {
        this.setData({
            ifshowrulesView: !this.data.ifshowrulesView
        })
    },

    getuserbeans: function () {
        let _this = this;
        let getuserbeansUrl = loginApi.domin + '/home/index/query';
        loginApi.requestUrl(_this, getuserbeansUrl, "POST", {
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            if (res.status == 1) {
                _this.setData({
                    userBeans: res.beans,
                })
            }

        })
    },
})