import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        stateArr:[],
        showBotTxt:0,
        srcDomin: loginApi.srcDomin,
    },

    onLoad: function (options) {
        let _this = this;
        this.page = 1;
        this.rows = 10;
        this.cangetData = true;
        this.getUserContent();
    },

    onShow: function () {
        if (app.praiseIndex) {
            app.praiseIndex = parseInt(app.praiseIndex) - 1
            console.log(this.data.contentArr[app.praiseIndex - 1])
            this.data.contentArr[app.praiseIndex].dianji = 1;
            this.data.contentArr[app.praiseIndex].support = this.data.contentArr[app.praiseIndex].support + 1;
            this.setData({
                contentArr: this.data.contentArr
            })
        };
        app.praiseIndex = null;
    },

    onHide: function () {

    },

    onShareAppMessage: function () {
        return util.shareObj
    },

    // 得到内容信息
    getUserContent: function () {
        let _this = this;
        let getUserContent = loginApi.domin + '/home/index/getusercontents';
        loginApi.requestUrl(_this, getUserContent, "POST", {
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
            "page": this.page,
            "len": this.rows,
        }, function (res) {
            console.log(res);
            if (res.status == 1) {

                for (let n = 0; n < res.contents.length; n++) {
                    for (let j = 0; j < res.support.length; j++) {
                        if (res.support[j].contentid == res.contents[n].id) {
                            res.contents[n].dianji = 12;
                        }
                    }
                }

                for (let i = 0; i < res.contents.length; i++) {
                    res.contents[i].imgurl = res.contents[i].imgurl.split(',');
                };

                _this.setData({
                    stateArr: _this.data.stateArr.concat(res.contents),
                });
                if (res.contents.length < _this.rows) {
                    _this.cangetData = false;
                    _this.setData({
                        showBotTxt: 1,
                    });
                };
            }
        })
    },

    // 跳转详情页
    goToDetails: function (e) {
        let index = parseInt(e.currentTarget.dataset.index);
        wx.navigateTo({
            url: `/pages/details/details?conId=${this.data.contentArr[index].id}&index=${index + 1}`,
        })
    },
})