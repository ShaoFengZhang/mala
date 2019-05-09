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
        showBotTxt:0,
        classArr: [{
                title: "推荐",
                id: 0,
            },
        ],
        srcDomin: loginApi.srcDomin,
        swiperCurrentIndex: 0,
        contentArr: [],
        current:0,
    },

    onLoad: function(options) {
        let _this = this;
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;

        loginApi.wxlogin(app).then(function (value) {
            loginApi.getSettingfnc(app);
            _this.getContent(0);
        });
        
        this.setData({
            classScrollHeight: app.windowHeight * 750 / app.sysWidth - 98,
            // classScrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 416,
        });
    },

    onShow: function() {
        this.getClass();
        if (app.praiseIndex){
            console.log(this.data.contentArr[app.praiseIndex])
            this.data.contentArr[app.praiseIndex].dianji=1;
            this.data.contentArr[app.praiseIndex].support = this.data.contentArr[app.praiseIndex].support+1;
            this.setData({
                contentArr: this.data.contentArr
            })
        };
        app.praiseIndex = null;
    },


    onShareAppMessage:function(e){
        if(e.from=="menu"){
            return {
                title: "点击查看",
                path: `/pages/index/index`,
                imageUrl: `/assets/shareimg/img${Math.floor(Math.random() * (4 - 1 + 1) + 1)}.png`
            }
        }else{
            
            let index = e.target.dataset.index;
            return {
                title: this.data.contentArr[index].title.slice(0, 28),
                path: `/pages/index/index`,
                imageUrl: this.data.contentArr[index].imgurl[0] ? this.data.srcDomin + this.data.contentArr[index].imgurl[0] : `/assets/shareimg/img${Math.floor(Math.random() * (4 - 1 + 1) + 1)}.png`
            }
        }
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
    swiperBindtap: function(e) {
        let classId = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        if (this.data.swiperCurrentIndex == classId) {
            return;
        };
        console.log(index);
        this.setData({
            swiperCurrentIndex: classId,
            contentArr: [],
            praiseId:'',
            showBotTxt: 0,
            current: index > 2 ? (this.data.classArr.length - index > 3 ? index - 2 : index - 5):0,
        });
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.getContent(classId);
    },

    // 获取内容
    getContent:function(type){
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
            "typeid": type ? type:"",
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            wx.hideLoading();
            if (res.status == 1) {
                for (let n = 0; n < res.contents.length;n++){
                    for (let j = 0; j < res.supports.length;j++){
                        if (res.supports[j].contentid == res.contents[n].id){
                            res.contents[n].dianji=12;
                        }
                    }
                }

                for (let i = 0; i < res.contents.length;i++){
                    res.contents[i].imgurl = res.contents[i].imgurl.split(',');
                };
                
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

    //获取分类
    getClass:function(){
        util.loding('加载中');
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/dotype';
        loginApi.requestUrl(_this, getClassUrl, "POST", {}, function (res) {
            wx.hideLoading();
            if (res.status == 1) {
                _this.setData({
                    classArr: _this.data.classArr.concat(res.type)
                });
            }
        })
    },

    // 滑动到底部
    bindscrolltolower: function () {
        if (this.cangetData) {
            this.page++;
            this.getContent();
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
        let _this=this;
        let touch = e.touches[0]
        let disX = this.data.startX - touch.clientX;
        let disY = touch.clientY - this.data.startY;
        if (!this.canmove){
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
                            current: i-1 > 2 ? (this.data.classArr.length- i+1 > 3 ? i-1 - 2 : this.data.current) : 0,
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
                            current: i+1 > 2 ? (this.data.classArr.length - i-1 > 3 ? (i+1) - 2 : this.data.current) : 0,
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
    
    catchtap:function(){},
})