
import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        showBotTxt: 0,
        contentArr: [],
        srcDomin: loginApi.srcDomin,
        ifshowrulesView: 0,
    },

    onLoad: function (options) {
        let _this = this;
        app.collectIndex=null;
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        };

        this.page = 1;
        this.rows = 6;
        this.cangetData = true;
        this.setData({
            showBotTxt: 0,
            contentArr: [],
        })
        this.getContent();
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

        if (app.collectIndex){
            app.collectIndex = parseInt(app.collectIndex) - 1
            this.data.contentArr.splice([app.collectIndex],1);
            this.setData({
                contentArr: this.data.contentArr
            })
        };
        app.collectIndex = null;

        // 假删除
    },

    // 滑动到底部
    bindscrolltolower: function () {
        if (this.cangetData) {
            this.page++;
            this.getContent();
        }
    },

    // 获取内容
    getContent: function () {
        util.loding('加载中');
        let _this = this;
        let getContentUrl = loginApi.domin + '/home/index/mycollection';
        loginApi.requestUrl(_this, getContentUrl, "POST", {
            "page": this.page,
            "len": this.rows,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            wx.hideLoading();
            if (res.status == 1) {

                for (let n = 0; n < res.mycollection.length; n++) {
                    for (let j = 0; j < res.support.length; j++) {
                        if (res.support[j].contentid == res.mycollection[n].id) {
                            res.mycollection[n].dianji = 12;
                        }
                    }
                }

                for (let i = 0; i < res.mycollection.length; i++) {
                    res.mycollection[i].imgurl = res.mycollection[i].imgurl.split(',');
                }
                _this.setData({
                    contentArr: _this.data.contentArr.concat(res.mycollection),
                });
                if (res.mycollection.length < _this.rows) {
                    _this.cangetData = false;
                    _this.setData({
                        showBotTxt: 1,
                    });
                }
            }
        })
    },

    onShareAppMessage: function (e) {
        this.canshareHide = true;
        if (e.from == "menu") {
            return util.shareObj
        } else {
            let index = e.target.dataset.index;
            return {
                title: this.data.contentArr[index].title.slice(0, 28),
                path: `/pages/index/index?conId=${this.data.contentArr[index].id}&uid=${wx.getStorageSync("u_id")}&type=2`,
                imageUrl: this.data.contentArr[index].imgurl[0] ? this.data.srcDomin + this.data.contentArr[index].imgurl[0] : `/assets/shareimg/img.png`,
            }
        }
    },

    catchtap: function () { },

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
})