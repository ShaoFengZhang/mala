import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        ifshowInput:0,
        inputValue:'来麻辣短句，分享你的诗意',
        focusNum:0,
        focusUserArr:[1,23,5,6],
        rewardView:0,
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

    editorTxt:function(){
        this.setData({
            ifshowInput:1,
            inputValue:'',
        });
        this.inputValue=null;
    },

    bindinput:function(e){
        this.inputValue=e.detail.value;
    },

    saveTxt:function(){
        this.setData({
            inputValue: this.inputValue ? this.inputValue:'',
        })
        if (!util.check(this.data.inputValue)) {
            util.toast("请输入有效内容~", 1200);
            this.setData({
                inputValue:'来麻辣短句，分享你的诗意',
            });
        };

        let inputValue=null;
        if (this.data.inputValue==""){
            inputValue ="来麻辣短句，分享你的诗意";
        }else{
            inputValue = this.data.inputValue
        }
        this.setData({
            ifshowInput: 0,
            inputValue: inputValue,
        })
    },

    closeReward:function(){
        this.setData({
            rewardView: !this.data.rewardView, 
        })
    },

    formSubmit: function (e) {
        util.formSubmit(app, e);
    },
})