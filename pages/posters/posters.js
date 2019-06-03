import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {

    },

    onLoad: function(options) {
        this.setData({
            imgW: ((app.windowHeight + app.Bheight) * 750 / app.sysWidth - 258) * (670 / 946),
        });
    },

    onShow: function() {

    },

    onHide: function() {

    },

    onShareAppMessage: function() {
        return util.shareObj
    },

    formSubmit: function(e) {
        util.formSubmit(app, e);
    },
})