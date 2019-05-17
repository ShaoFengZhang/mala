import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        classArr: []
    },

    onLoad: function(options) {
        this.getClass();
    },

    onShow: function() {

    },

    onHide: function() {

    },

    onShareAppMessage: function() {
        return util.shareObj
    },

    // 
    closeClassView:function(e){
        let index = e.currentTarget.dataset.index;
        let id = this.data.classArr[index].id;
        let title = this.data.classArr[index].title;
        wx.setStorageSync("classId", id);
        wx.setStorageSync("className", title);
        wx.navigateBack({
            delta: 1
        });
    },

    //获取分类
    getClass: function () {
        util.loding('加载中');
        let _this = this;
        let getClassUrl = loginApi.domin + '/home/index/dotype';
        loginApi.requestUrl(_this, getClassUrl, "POST", {}, function (res) {
            wx.hideLoading();
            if (res.status == 1) {
                _this.setData({
                    classArr: res.type
                });
            }
        })
    },
})