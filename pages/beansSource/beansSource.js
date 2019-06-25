import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        beansArr:[1,2,3,4,5,6,7,8,9,1,2,3,4,56,,9]
    },

    onLoad: function (options) {

    },

    onShareAppMessage: function () {
        return util.shareObj
    },

    onReachBottom: function () {
        console.log(123)
    },
})