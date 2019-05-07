import loginApi from '../../utils/login.js'

const app = getApp();

Page({

    data: {
        copyWriterArr:[1,2,3],
        contentImgArr:[1,2,3],
        txtValue:"发表你的观点",
        srcDomin: loginApi.srcDomin,
    },

    onLoad: function(options) {
        if (options && options.content){
            this.setData({
                content: JSON.parse(unescape(options.content)),
                praiseIndex: options.praiseIndex,
            })
        }
    },

    onShow: function() {

    },

    onShareAppMessage: function() {
        return {
            title: this.data.content.title.slice(0, 28),
            path: `/pages/index/index`,
            imageUrl: this.data.srcDomin+this.data.content.imgurl[0]
        }
    },

    bindconfirm:function(e){
        console.log(e);
        let value=e.detail.value;
        this.contentTxt = value;
    },

    // bindfocus:function(){
    //     this.setData({
    //         txtValue:'',
    //     })
    // },
    
    praiseEvent: function () {
        if (this.data.content.dianji){
            this.crearteAnimation();
            return;
        }
        this.addpriseNum();
    },

    // 点赞请求
    addpriseNum: function () {
        let _this = this;
        let addpriseNumUrl = loginApi.domin + '/home/index/support';
        loginApi.requestUrl(_this, addpriseNumUrl, "POST", {
            "id": this.data.content.id,
            "openid": wx.getStorageSync("user_openID"),
            "uid": wx.getStorageSync("u_id"),
        }, function (res) {
            console.log(res);
            if (res.status == 1) {
                _this.data.content.dianji = 1;
                _this.setData({
                    content: _this.data.content,
                });
                _this.crearteAnimation();
                app.praiseIndex = _this.data.praiseIndex;
            }else{
                util.toast("点赞失败,请重试",300)
            }
        })
    },

    // 提交文案
    postcontext: function () {
        let _this = this;
        let postcontextUrl = loginApi.domin + '/home/index/test';
        loginApi.requestUrl(_this, postcontextUrl, "POST", {
            "txt": this.contentTxt
        }, function (res) {
            console.log(res);
        })
    },

    // 动画
    crearteAnimation: function () {
        let pointAni = wx.createAnimation({
            duration: 500,
            timingFunction: "ease",
        });
        pointAni.scale(1.5, 1.5).step({
            duration: 250,
        });
        pointAni.scale(1, 1).step({
            duration: 250,
        });
        this.setData({
            pointAni: pointAni.export(),
        })
    },

    copytxt:function(){
        wx.setClipboardData({
            data: this.data.content.title,
            success(res) {
            }
        })
    },
})