import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({
    data: {
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
        bindscrolltolower:'',
        bindscrolltoupper:'',
    },

    onLoad: function(options) {
        let _this = this;
        this.page = 1;
        this.rows = 20;
        this.cangetData = true;

        loginApi.wxlogin(app).then(function(value) {
            loginApi.getSettingfnc(app);
            if (options && options.conId){
                util.loding('登录中');
                _this.getContent(0, options.conId);
            }else{
                _this.getContent(0);
            }
        });

        this.setData({
            classScrollHeight: app.windowHeight * 750 / app.sysWidth - 98,
            // classScrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 416,
        });

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
    },

    onShow: function() {
        this.setData({
            classArr: [{
                title: "推荐",
                id: 0,
            }],
        });
        this.getClass();
        console.log(app.praiseIndex)
        if (app.praiseIndex) {
            app.praiseIndex = parseInt(app.praiseIndex)-1 
            console.log(this.data.contentArr[app.praiseIndex])
            this.data.contentArr[app.praiseIndex].dianji = 1;
            this.data.contentArr[app.praiseIndex].support = this.data.contentArr[app.praiseIndex].support + 1;
            this.setData({
                contentArr: this.data.contentArr
            })
        };
        app.praiseIndex = null;
    },

    onTabItemTap: function () {
        try {
            wx.removeStorageSync('classId');
            wx.removeStorageSync('className');
        } catch (e) {
            
        }
    },

    // 分享
    onShareAppMessage: function(e) {
        if (e.from == "menu") {
            return util.shareObj
        } else {
            let index = e.target.dataset.index;
            return {
                title: this.data.contentArr[index].title.slice(0, 28),
                path: `/pages/index/index?conId=${this.data.contentArr[index].id}`,
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

    //swiperBindtap
    swiperBindtap: function(e) {
        let classId = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        if (this.data.swiperCurrentIndex == classId) {
            return;
        };

        let classlen = this.data.classArr.length;
        this.setData({
            swiperCurrentIndex: classId,
            contentArr: [],
            praiseId: '',
            showBotTxt: 0,
            current: classlen < 6 ? 0 : (index > 4 ? (index == classlen - 1 ? index - 5 : index - 4) : 0)
        });
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        clearTimeout(this.scrollTime);
        this.getContent(classId);
    },

    // 获取内容
    getContent: function (type,conId) {
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
                for (let n = 0; n < res.contents.length; n++) {
                    for (let j = 0; j < res.supports.length; j++) {
                        if (res.supports[j].contentid == res.contents[n].id) {
                            res.contents[n].dianji = 12;
                        }
                    }
                }

                for (let i = 0; i < res.contents.length; i++) {
                    res.contents[i].imgurl = res.contents[i].imgurl.split(',');
                };

                _this.setData({
                    // contentArr: _this.data.contentArr.concat(res.contents),
                    contentArr:res.contents,
                    bindscrolltolower: 'bindscrolltolower',                    
                    // [`contentArr[${_this.page-1}]`]: res.contents,
                });
                                
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                    _this.setData({
                        showBotTxt: 1,
                    });
                };
                if (conId){
                    wx.hideLoading();
                    _this.goToDetails(conId);
                }else{
                    wx.hideLoading();
                };
                
                clearTimeout(_this.scrollTime);
                _this.scrollTime = setTimeout(function () {
                    _this.setData({
                        bindscrolltoupper: 'bindscrolltoupper',
                    })
                }, 1000);
            }
        })
    },

    //获取分类
    getClass: function() {
        util.loding('加载中');
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/dotype';
        loginApi.requestUrl(_this, getClassUrl, "POST", {}, function(res) {
            wx.hideLoading();
            if (res.status == 1) {
                _this.setData({
                    classArr: _this.data.classArr.concat(res.type)
                });
            }
        })
    },

    //滑动到顶部
    bindscrolltoupper:function(){
        if (this.page>1){
            this.page--;
            this.setData({
                bindscrolltolower: '',
                bindscrolltoupper: '',
                contentArr: null,
            })
            this.getContent(this.data.swiperCurrentIndex);
        }else{
            util.toast('暂无更多更新',1200);
        }    
    },

    // 滑动到底部
    bindscrolltolower: function() {
        if (this.cangetData) {
            this.page++;
            this.setData({
                bindscrolltolower: '',
                bindscrolltoupper: '',
                contentArr: null,
            })
            this.getContent(this.data.swiperCurrentIndex);
        }
    },

    // 滑动切换选项相关事件
    drawStart: function(e) {
        let touch = e.touches[0];
        this.setData({
            startX: touch.clientX,
            startY: touch.clientY,
        });
        this.canmove = true;
    },

    drawMove: function(e) {
        let _this = this;
        let touch = e.touches[0]
        let disX = this.data.startX - touch.clientX;
        let disY = touch.clientY - this.data.startY;
        if (!this.canmove) {
            return;
        }
        if (Math.abs(disY) > 8) {
            return;
        } else {
            this.canmove = false;
            // 往左边
            if (disX <= -10) {
                _this.setData({
                    drawStart: "",
                    drawMove: '',
                });
                if (_this.data.swiperCurrentIndex == _this.data.classArr[0].id) {
                    return;
                }
                for (let i = 0; i < _this.data.classArr.length; i++) {
                    if (_this.data.classArr[i].id == _this.data.swiperCurrentIndex) {
                        _this.setData({
                            swiperCurrentIndex: _this.data.classArr[i - 1].id,
                            current: i - 1 > 2 ? (this.data.classArr.length - i + 1 > 3 ? i - 1 - 2 : this.data.current) : 0,
                            contentArr: [],
                            praiseId: '',
                        });
                        this.page = 1;
                        this.rows = 10;
                        this.cangetData = true;
                        this.getContent(_this.data.classArr[i - 1].id);
                        return;
                    }
                };
                // 往右边
            } else if (disX >= 10) {
                _this.setData({
                    drawStart: "",
                    drawMove: '',
                });

                if (_this.data.swiperCurrentIndex == _this.data.classArr[_this.data.classArr.length - 1].id) {
                    return;
                };
                for (let i = 0; i < _this.data.classArr.length; i++) {
                    if (_this.data.classArr[i].id == _this.data.swiperCurrentIndex) {
                        _this.setData({
                            swiperCurrentIndex: _this.data.classArr[i + 1].id,
                            current: i + 1 > 2 ? (this.data.classArr.length - i - 1 > 3 ? (i + 1) - 2 : this.data.current) : 0,
                            contentArr: [],
                            praiseId: '',
                        });
                        this.page = 1;
                        this.rows = 10;
                        this.cangetData = true;
                        this.getContent(_this.data.classArr[i + 1].id);
                        return;
                    }
                };
            }
        }
    },

    drawEnd: function(e) {
        let _this = this;
        setTimeout(function() {
            _this.setData({
                drawStart: "drawStart",
                drawMove: 'drawMove',
                startX: null,
                startY: null,
            });
        }, 500);
    },

    catchtap: function() {},
    // 跳转详情页
    goToDetails: function (conId) {
        wx.navigateTo({
            url: `/pages/details/details?conId=${conId}`,
        })
    },
})