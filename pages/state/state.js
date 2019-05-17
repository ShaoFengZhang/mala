import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        stateArr:[1,2,3,4,5,6,7,8]
    },

    onLoad: function (options) {

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

    // 跳转详情页
    goToDetails: function (e) {
        let index = parseInt(e.currentTarget.dataset.index);
        wx.navigateTo({
            url: `/pages/details/details?conId=${this.data.contentArr[index].id}&index=${index + 1}`,
        })
    },
})