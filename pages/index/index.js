
import loginApi from '../../utils/login.js'

const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        classArr:[
            {
               txt:"全部" ,
               classId:0,
            },
            {
                txt: "励志",
                classId: 1,
            },
            {
                txt: "经典",
                classId: 2,
            },
            {
                txt: "唯美",
                classId: 3,
            },
            {
                txt: "哲学",
                classId: 4,
            },
            {
                txt: "心情",
                classId: 5,
            },
            {
                txt: "历史",
                classId: 6,
            },
        ],
        swiperCurrentIndex:0,
    },

    onLoad: function(options) {
        console.log("onLoad");
        let _this = this;
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }

        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }; 

        this.setData({
            classScrollHeight: app.windowHeight * 750 / app.sysWidth - 98,
            // classScrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 416,
        });
    },

    onShow:function(){
        console.log("onShow")
    },

    //监听页面初次渲染完成
    onReady: function () {
        console.log("onReady")
    },

    // 获取用户信息
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    //swiperBindtap
    swiperBindtap:function(e){
        let classId = e.currentTarget.dataset.id;
        if (this.data.swiperCurrentIndex == classId){
            return;
        };
        this.setData({
            swiperCurrentIndex:classId,
        });
    },

    //测试回调
    ceshiBalck: function (options){
        console.log(this.options)
       
    }
})