
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
        this.canshareHide = false;
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

    catchtap: function () { },
})