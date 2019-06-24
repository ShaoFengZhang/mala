import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        classArr: [{
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
        ifloadtxt: 0,
    },

    onLoad: function(options) {
        let _this = this;
        // this.setData({
        //     scrollHeight: app.windowHeight * 750 / app.sysWidth - 0,
        // });
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

        if (!this.cantemp) {
            return;
        }
        this.page = 1;
        this.rows = 20;
        this.cangetData = true;
        this.setData({
            showBotTxt: 0,
            ifloadtxt:0,
            swiperCurrentIndex: 0,
            contentArr: [],
            praiseId: '',
        })
        this.getContent('selected'); 
        this.cantemp = false;
    },

    onShow: function() {
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
        this.canshareHide = false;
    },

    onHide: function() {
        if (!this.canshareHide) {
            this.cantemp = true;
        }
    },

    onShareAppMessage: function(e) {
        this.canshareHide = true;
        if (e.from == "menu") {
            return util.shareObj
        } else {
            let index = e.target.dataset.index;
            return {
                title: this.data.contentArr[index].title.slice(0, 28),
                path: `/pages/index/index?conId=${this.data.contentArr[index].id}&uid=${wx.getStorageSync("u_id")}&type==2`,
                imageUrl: this.data.contentArr[index].imgurl[0] ? this.data.srcDomin + this.data.contentArr[index].imgurl[0] : `/assets/shareimg/img.png`,
            }
        }
    },

    // 获取用户信息
    onMyevent: function(e) {
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
    swiperBindtap: function(e) {
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
        clearTimeout(this.bottomTime);
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        classId == 0 ? this.getContent("focus") : this.getContent("selected")

    },

    // 加载上一页
    onPullDownRefresh: function () {
        let _this = this;
        if (this.page > 1) {
            this.page--;
            this.getContent("selected")
        } else {
            util.toast('暂无更多更新', 1200);
            wx.stopPullDownRefresh();
        };
        return;
    },

    // 加载下一页
    onReachBottom: function () {
        if (this.cangetData) {
            this.page++;
            clearTimeout(this.bottomTime);
            this.bottomTime = setTimeout(() => {
                
                // this.data.swiperCurrentIndex == 0 ? this.getContent("focus") : this.getContent("selected");
                this.getContent("selected")
            }, 1000)

        } else {
            util.toast('暂无更多更新', 1200);
        }
    },

    // 获取一周精选内容
    getContent: function(url) {
        util.loding('加载中');
        let _this = this;
        let getContentUrl = loginApi.domin + `/home/index/${url}`;
        loginApi.requestUrl(_this, getContentUrl, "POST", {
            "page": this.page,
            "len": this.rows,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
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

                for (let i = 0; i < res.contents.length; i++) {
                    // 获赞处理
                    if (parseInt(res.contents[i].support) > 10000) {
                        let num = parseInt(res.contents[i].support);
                        res.contents[i].support = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                    // 评论
                    if (parseInt(res.contents[i].comments) > 10000) {
                        let num = parseInt(res.contents[i].comments);
                        res.contents[i].comments = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                };

                if (res.contents.length == 0) {
                    _this.page == 1 ? _this.page : _this.page--;
                    _this.cangetData=false;
                    util.toast("暂无更多更新");
                    _this.setData({
                        ifloadtxt: 0, 
                        showBotTxt: 1,
                    })
                    return;
                }

                _this.setData({
                    contentArr: [],
                    ifloadtxt: 0,
                });

                _this.setData({
                    contentArr: res.contents,
                    ifloadtxt: 1,
                });
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                    _this.setData({
                        showBotTxt: 1,
                        ifloadtxt: 0,
                    });
                };
            }
        })
    },

    catchtap: function() {},
})