
import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        classArr: [
            {
                title: "关注",
                id: 0,
            },
            {
                title: "一周精选",
                id: 2,
            },    
        ],
        showBotTxt: 0,
        swiperCurrentIndex: 0,
        contentArr: [],
        srcDomin: loginApi.srcDomin,
    },

    onLoad: function (options) {
        let _this = this;
        this.setData({
            scrollHeight: app.windowHeight * 750 / app.sysWidth - 0,
        });
        this.cantemp = true;
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
        
        if (!this.cantemp){
            return;
        }
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.setData({
            showBotTxt: 0,
            swiperCurrentIndex: 0,
            contentArr: [],
            praiseId: '',
        })
        this.getContent('selected');
        this.cantemp = false;
    },

    onShow: function () {
        // console.log("onShow")
        if (app.praiseIndex) {
            app.praiseIndex = parseInt(app.praiseIndex) - 1
            console.log(this.data.contentArr[app.praiseIndex])
            this.data.contentArr[app.praiseIndex].dianji = 1;
            this.setData({
                contentArr: this.data.contentArr
            })
        };
        app.praiseIndex = null;
        this.canshareHide=false;
    },

    onHide:function(){
        if (!this.canshareHide){
            this.cantemp = true;
        }          
    },

    onShareAppMessage: function (e) {
        this.canshareHide = true;
        if (e.from == "menu") {
            return util.shareObj
        } else {
            let index = e.target.dataset.index;
            return {
                title: this.data.contentArr[index].title.slice(0, 28),
                path: `/pages/index/index?conId=${this.data.contentArr[index].id}`,
                imageUrl: this.data.contentArr[index].imgurl[0] ? this.data.srcDomin + this.data.contentArr[index].imgurl[0] : `/assets/shareimg/img${Math.floor(Math.random() * (4) + 1)}.png`,
            }
        }
    },

    // 获取用户信息
    onMyevent: function (e) {
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

    //swiperBindtap
    swiperBindtap: function (e) {
        let classId = e.currentTarget.dataset.id;
        if (this.data.swiperCurrentIndex == classId) {
            return;
        };
        this.setData({
            swiperCurrentIndex: classId,
            contentArr: [],
            praiseId: '',
            showBotTxt: 0,
        });
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        classId == 0 ? this.getContent("focus") : this.getContent("selected")
        
    },

    // 滑动到底部
    bindscrolltolower: function () {
        if (this.cangetData) {
            this.page++;
            this.data.swiperCurrentIndex == 0 ? this.getContent("focus") : this.getContent("selected");
        }
    },

    // 获取一周精选内容
    getContent: function (url) {
        util.loding('加载中');
        let _this = this;
        let getContentUrl = loginApi.domin + `/home/index/${url}`;
        loginApi.requestUrl(_this, getContentUrl, "POST", {
            "page": this.page,
            "len": this.rows,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            wx.hideLoading();
            if (res.status == 1) {

                for (let n = 0; n < res.contents.length; n++) {
                    for (let j = 0; j < res.supports.length; j++) {
                        if (res.supports[j].contentid == res.contents[n].id) {
                            res.contents[n].dianji = 12;
                        }
                    }
                }

                for (let i = 0; i < res.contents.length; i++) {
                    res.contents[i].imgurl = res.contents[i].imgurl.split(',');
                }
                _this.setData({
                    contentArr: _this.data.contentArr.concat(res.contents),
                });
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                    _this.setData({
                        showBotTxt: 1,
                    });
                }
            }
        })
    },

    catchtap: function () { },
})