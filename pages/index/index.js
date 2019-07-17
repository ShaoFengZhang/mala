import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
        contentView:1,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        drawStart: "drawStart",
        drawMove: 'drawMove',
        showBotTxt: 0,
        srcDomin: loginApi.srcDomin,
        swiperCurrentIndex: 0,
        contentArr: [],
        current: 0,
        ifloadtxt: 0,
        ifshowrulesView:0,
        classArr: [{
            title: "关注",
            id: 1,
        },{
                title: "短句",
                id: 0,
        },
            {
                title: "美图",
                id: 2,
            }],
    },

    onLoad: function(options) {
        let _this = this;
        this.page = 1;
        this.rows = 20;
        this.cangetData = true;

        if (app.globalData.userInfo) {
            console.log('if');
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse) {
            console.log('elseif');
            app.userInfoReadyCallback = res => {
                console.log('index');
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
                app.globalData.userInfo = res.userInfo;
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                let session_key = app.globalData.session_key;
                loginApi.checkUserInfo(app, res, iv, encryptedData, session_key);
            }
        } else {
            console.log('else');
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                    let iv = res.iv;
                    let encryptedData = res.encryptedData;
                    let session_key = app.globalData.session_key;
                    loginApi.checkUserInfo(app, res, iv, encryptedData, session_key);
                }
            })
        };

        // 带参数二维码
        if (options && options.scene) {
            console.log('SCENE', options);
            let scene = decodeURIComponent(options.scene);
            options.conId = scene.split('&')[0];
            this.shareUid = scene.split('&')[1];
            this.gotoPoster=true;
        };

        if (options && options.poster){
            this.gotoPoster = true;
        };

        loginApi.wxlogin(app).then(function(value) {
            console.log(options);
            if (options && options.conId) {
                _this.getContent(0, options.conId);
            } else {
                _this.getContent(0);
            };
            if (options && options.scene){
                _this.checkNewFans(_this.shareUid)
            };
            if(options && options.type){
                _this.checkNewFans(options.uid, options.type)
            }
        }, function(error) {
            console.log("error", error);
            if (options && options.conId) {
                if (wx.getStorageSync("u_id")) {
                    _this.getContent(0, options.conId);
                }
            } else {
                if (wx.getStorageSync("u_id")) {
                    _this.getContent(0);
                }
            }
            if (options && options.scene) {
                _this.checkNewFans(_this.shareUid)
            };
            if (options && options.type) {
                _this.checkNewFans(options.uid, options.type)
            }
        })
        
        this.timeOut = setTimeout(() => {
            if (wx.getStorageSync("u_id") && this.data.contentArr.length == 0) {
                console.log("this.timeOut")
                if (options && options.conId) {
                    _this.getContent(0, options.conId);
                } else {
                    _this.getContent(0);
                }
                if (options && options.scene) {
                    _this.checkNewFans(_this.shareUid)
                };
                if (options && options.type) {
                    _this.checkNewFans(options.uid, options.type)
                }
            }
        }, 2200)
    },

    onShow: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
        // this.getClass();
        console.log(app.praiseIndex, 'app.praiseIndex')
        if (app.praiseIndex) {
            app.praiseIndex = parseInt(app.praiseIndex) - 1
            console.log(this.data.contentArr[app.praiseIndex])
            this.data.contentArr[app.praiseIndex].dianji = 1;
            this.data.contentArr[app.praiseIndex].support = this.data.contentArr[app.praiseIndex].support + 1;
            this.setData({
                contentArr: this.data.contentArr
            })
        };
        app.praiseIndex = null;
    },

    onTabItemTap: function() {
        try {
            wx.removeStorageSync('classId');
            wx.removeStorageSync('className');
        } catch (e) {

        };
    },

    // 分享
    onShareAppMessage: function(e) {
        if (e.from == "menu") {
            return util.shareObj
        } else {
            let index = e.target.dataset.index;
            return {
                title: this.data.contentArr[index].title.slice(0, 28),
                path: `/pages/index/index?conId=${this.data.contentArr[index].id}&uid=${wx.getStorageSync("u_id")}&type=2`,
                imageUrl: this.data.contentArr[index].imgurl[0] ? this.data.srcDomin + this.data.contentArr[index].imgurl[0] : `/assets/shareimg/img.png`
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

    //swiperBindtap 切换顶部tap
    swiperBindtap: function(e) {
        let classId = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        if (this.data.swiperCurrentIndex == classId) {
            return;
        };

        let classlen = this.data.classArr.length;
        clearTimeout(this.bottomTime);
        clearTimeout(this.timeOut);
        this.setData({
            swiperCurrentIndex: classId,
            contentArr: [],
            praiseId: '',
            showBotTxt: 0,
            ifloadtxt: 0,
            // current: (classlen > 6 && index >= 5) ? ((index == classlen - 1) ? (this.data.current) : index - 4) : 0,
        });
        this.page = 1;
        this.rows = 20;
        this.cangetData = true;
        if (classId ==2){
            this.setData({
                contentView:0,  
            })
            this.getImglist();
            return;
        }
        this.setData({
            contentView: 1,
        })
        classId == 1 ? this.getfocuContent():this.getContent(classId);
    },

    // 获取短句内容
    getContent: function(type, conId) {
        util.loding('加载中');
        let _this = this;
        let getContentUrl = loginApi.domin + '/home/index/doindex';
        wx.reportAnalytics('classclickevent', {
            uid: wx.getStorageSync("u_id"),
            classid: type ? type : "default",
        });
        loginApi.requestUrl(_this, getContentUrl, "POST", {
            "page": this.page,
            "len": this.rows,
            "typeid": type ? type : "",
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function(res) {
            if (res.status == 1) {
                console.log("content")
                for (let n = 0; n < res.contents.length; n++) {
                    for (let j = 0; j < res.supports.length; j++) {
                        if (res.supports[j].contentid == res.contents[n].id) {
                            res.contents[n].dianji = 12;
                        }
                    }
                }

                for (let i = 0; i < res.contents.length; i++) {
                    res.contents[i].imgurl = res.contents[i].imgurl.split(',');
                    res.contents[i].ySupport = parseInt(res.contents[i].support);
                    res.contents[i].yComments = parseInt(res.contents[i].comments);
                };

                for (let i = 0; i < res.contents.length; i++) {
                    // 获赞处理
                    if (parseInt(res.contents[i].support) >= 10000) {
                        let num = parseInt(res.contents[i].support);
                        res.contents[i].support = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                    // 评论
                    if (parseInt(res.contents[i].comments) >= 10000) {
                        let num = parseInt(res.contents[i].comments);
                        res.contents[i].comments = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                };

                if (res.contents.length == 0) {
                    _this.page == 1 ? _this.page : _this.page--;
                    _this.cangetData = false;
                    util.toast("暂无更多更新");
                    _this.setData({
                        ifloadtxt: 0,
                        showBotTxt: 1,
                    });
                    return;
                };

                _this.setData({
                    contentArr: [],
                    ifloadtxt: 0,
                });

                _this.setData({
                    contentArr: res.contents,
                    ifloadtxt: 1,
                });
                wx.stopPullDownRefresh();

                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                    _this.setData({
                        showBotTxt: 1,
                        ifloadtxt: 0,
                    });
                };
                if (conId) {
                    wx.hideLoading();
                    _this.goToDetails(conId);
                } else {
                    wx.hideLoading();
                };

            }
        })
    },

    // 获取关注内容
    getfocuContent:function(){
        util.loding('加载中');
        let _this = this;
        let getfocuContentUrl = loginApi.domin + '/home/index/focususercontents';
        loginApi.requestUrl(_this, getfocuContentUrl, "POST", {
            "page": this.page,
            "len": this.rows,
            "uid": wx.getStorageSync("u_id"),
            "openid": wx.getStorageSync("user_openID"),
        }, function (res) {
            wx.hideLoading();
            if (res.status == 1) {
                console.log("content")
                for (let n = 0; n < res.contents.length; n++) {
                    for (let j = 0; j < res.supports.length; j++) {
                        if (res.supports[j].contentid == res.contents[n].id) {
                            res.contents[n].dianji = 12;
                        }
                    }
                }

                for (let i = 0; i < res.contents.length; i++) {
                    res.contents[i].imgurl = res.contents[i].imgurl.split(',');
                    res.contents[i].ySupport = parseInt(res.contents[i].support);
                    res.contents[i].yComments = parseInt(res.contents[i].comments);
                };

                for (let i = 0; i < res.contents.length; i++) {
                    // 获赞处理
                    if (parseInt(res.contents[i].support) >= 10000) {
                        let num = parseInt(res.contents[i].support);
                        res.contents[i].support = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                    // 评论
                    if (parseInt(res.contents[i].comments) >= 10000) {
                        let num = parseInt(res.contents[i].comments);
                        res.contents[i].comments = (Math.floor(num / 1000) / 10) + 'w+'
                    };
                };

                if (res.contents.length == 0) {
                    _this.page == 1 ? _this.page : _this.page--;
                    _this.cangetData = false;
                    util.toast("暂无更多更新");
                    _this.setData({
                        ifloadtxt: 0,
                        showBotTxt: 1,
                    });
                    return;
                };

                _this.setData({
                    contentArr: [],
                    ifloadtxt: 0,
                });

                _this.setData({
                    contentArr: res.contents,
                    ifloadtxt: 1,
                });
                wx.stopPullDownRefresh();

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

    // 获取美图
    getImglist:function(){
        util.loding('加载中');
        let _this = this;
        let getfocuContentUrl = loginApi.domin + '/home/index/photo';
        loginApi.requestUrl(_this, getfocuContentUrl, "POST", {
            "page": this.page,
            "len": this.rows,
        }, function (res) {
            wx.hideLoading();
            if (res.status == 1) {
                console.log(res);
                if (res.contents.length == 0) {
                    _this.page == 1 ? _this.page : _this.page--;
                    _this.cangetData = false;
                    util.toast("暂无更多更新");
                    _this.setData({
                        ifloadtxt: 0,
                        showBotTxt: 1,
                    });
                    return;
                };

                _this.setData({
                    contentArr: [],
                    ifloadtxt: 0,
                });

                _this.setData({
                    contentArr: res.contents,
                    ifloadtxt: 1,
                });
                wx.stopPullDownRefresh();

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

    //获取分类
    getClass: function() {
        // util.loding('加载中');
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/dotype';
        loginApi.requestUrl(_this, getClassUrl, "POST", {}, function(res) {
            // wx.hideLoading();
            if (res.status == 1) {
                _this.setData({
                    classArr: _this.data.classArr.concat(res.type)
                });
            }
        })
    },

    // 加载上一页
    onPullDownRefresh: function() {
        console.log("onPullDownRefresh")
        let _this = this;
        if (this.page > 1) {
            this.page--;
            // this.getContent(this.data.swiperCurrentIndex);
            if (this.data.swiperCurrentIndex == 2) {
                this.getImglist();
                wx.stopPullDownRefresh();
                return;
            }
            this.data.swiperCurrentIndex == 1 ? this.getfocuContent() : this.getContent(this.data.swiperCurrentIndex);
        } else {
            // util.toast('暂无更多更新', 800);
            // this.getContent(this.data.swiperCurrentIndex);
            if (this.data.swiperCurrentIndex == 2) {
                this.getImglist();
                wx.stopPullDownRefresh();
                return;
            }
            this.data.swiperCurrentIndex == 1 ? this.getfocuContent() : this.getContent(this.data.swiperCurrentIndex);
            wx.stopPullDownRefresh();
        };
        return;
    },

    // 加载下一页
    onReachBottom: function() {
        if (this.cangetData) {
            this.page++;
            clearTimeout(this.bottomTime);
            this.bottomTime = setTimeout(() => {
                // this.getContent(this.data.swiperCurrentIndex);
                if (this.data.swiperCurrentIndex == 2) {
                    // this.getImglist();
                    return;
                }
                this.data.swiperCurrentIndex == 1 ? this.getfocuContent() : this.getContent(this.data.swiperCurrentIndex);
            }, 1000)

        } else {
            util.toast('暂无更多更新', 1200);
        }
    },

    catchtap: function() {},

    // 跳转海报页
    goToPoster:function(e){
        let iconurl = e.currentTarget.dataset.icon;
        let posterurl = e.currentTarget.dataset.posterurl;
        let txt = e.currentTarget.dataset.txt;
        wx.navigateTo({
            url: `/pages/poster3/poster3?picUrl=${iconurl}&posterurl=${posterurl}&txt=${escape(txt)}`,
        })
    },

    // 跳转详情页
    goToDetails: function(conId) {
        if (this.gotoPoster){
            this.gotoPoster=null;
            wx.navigateTo({
                url: `/pages/poster2/poster2?contentID=${conId}`,
            })
        }else{
            wx.navigateTo({
                url: `/pages/details/details?conId=${conId}`,
            })
        }
    },

    checkNewFans:function(fatherId,type){
        if (fatherId == wx.getStorageSync("u_id") || !wx.getStorageSync("ifnewUser")){
            return;
        }
        let _this = this;
        let checkNewFansUrl = loginApi.domin + '/home/index/newfan';
        loginApi.requestUrl(_this, checkNewFansUrl, "POST", {
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "fuid": fatherId,
            "type": type ? type:"1",
            "newuser": wx.getStorageSync("ifnewUser"),
        }, function (res) {
        })
    },

    showbeansMask: function () {
        this.setData({
            ifshowrulesView: !this.data.ifshowrulesView
        });
        // if (!this.data.ifshowrulesView) {
        //     wx.showTabBar({
        //         animation: true
        //     });
        // } else {
        //     wx.hideTabBar({
        //         animation: true
        //     });
        // }
    },

    goToFounPage:function(){
        wx.switchTab({
            url: '/pages/found/found'
        })
        this.showbeansMask();
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },

    // 获取授权信息
    getUserInfo: function (e) {
        console.log(e);
        if (!e.detail.userInfo) {
            util.toast("我们需要您的授权哦亲~", 1200)
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
})