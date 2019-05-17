import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        messageArr:[1,23,4,56,7,8],
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
    
})