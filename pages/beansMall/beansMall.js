import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
       mallArr:[1,2,3,2,2,2,2,2,2]
    },

    onLoad: function (options) {
    },

    onShow: function () {

    },

    onHide: function () {

    },

    onShareAppMessage: function () {
        return util.shareObj
    },

    // 收集formid
    formSubmit: function (e) {
        util.formSubmit(app, e);
    },
})