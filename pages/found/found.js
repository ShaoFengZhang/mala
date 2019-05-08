
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
        console.log("onLoad")
        let _this = this;
        this.setData({
            classScrollHeight: app.windowHeight * 750 / app.sysWidth - 98,
        });
        this.cantemp = true;
    },

    onTabItemTap: function() {
        if (!this.cantemp){
            return;
        }
        console.log("onTabItemTap")
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.setData({
            showBotTxt: 0,
            swiperCurrentIndex: 0,
            contentArr: [],
            praiseId: '',
        })
        this.getContent();
        this.cantemp = false;
    },

    onShow: function () {
        // console.log("onShow")
        if (app.praiseIndex) {
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
        this.getContent();
    },

    // 获取内容
    getContent: function () {
        util.loding('加载中');
        let _this = this;
        let getContentUrl = loginApi.domin + '/home/index/selected';
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

    onShareAppMessage: function (e) {
        this.canshareHide=true;
        if (e.from == "menu") {
            return {
                title: "点击查看",
                path: `/pages/index/index`,
            }
        } else {
            let index = e.target.dataset.index;
            return {
                title: this.data.contentArr[index].title.slice(0, 28),
                path: `/pages/index/index`,
                imageUrl: this.data.srcDomin + this.data.contentArr[index].imgurl[0]
            }
        }
    },

    catchtap: function () { },
})