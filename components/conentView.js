import loginApi from '../utils/login.js'
import util from '../utils/util.js'
const app = getApp();
Component({

    properties: {

        contentArr:{
            type:Array,
            value:{}
        },
        srcDomin:{
            type:String,
            value:'',
        },
        showBotTxt:{
            type:Boolean,
            value:0,
        },
    },

    data: {
        showBotTxt:0,
        praiseId:"",
        pointAni: null,
        praiseEvent:'praiseEvent',
    },

    methods: {
        catchtap:function(){},
        // 跳转详情页
        goToDetails: function (e) {
            let index = parseInt(e.currentTarget.dataset.index);
            wx.navigateTo({
                url: `/pages/details/details?content=${escape(JSON.stringify(this.data.contentArr[index]))}&praiseIndex=${index}`,
            })
        },

        // 动画
        crearteAnimation: function () {

            if(!this.canAni){
                let _this = this;
                this.setData({
                    // praiseId: '',
                    pointAni: null,
                    praiseEvent: 'catchtap',
                })
                let pointAni = wx.createAnimation({
                    duration: 500,
                    timingFunction: "linear",
                });
                pointAni.scale(1.5, 1.5).step({
                    duration: 250,
                });
                pointAni.scale(1, 1).step({
                    duration: 250,
                });
                this.setData({
                    pointAni: pointAni.export(),
                });
                setTimeout(()=>{
                    this.setData({
                        praiseEvent: 'praiseEvent',
                    })
                },600)
            }
        },

        praiseEvent: function (e) {
            this.setData({
                praiseId: '',
                pointAni: null,
            });
            let id = e.currentTarget.dataset.id;
            let index = e.currentTarget.dataset.index;
            if (this.data.contentArr[index].dianji) {
                this.setData({
                    praiseId: id,
                });
                this.crearteAnimation();
                return;
            }
            this.addpriseNum(id, index);
        },

        // 点赞请求
        addpriseNum: function (cid, index) {
            let _this = this;
            let addpriseNumUrl = loginApi.domin + '/home/index/support';
            loginApi.requestUrl(_this, addpriseNumUrl, "POST", {
                "id": cid,
                "openid": wx.getStorageSync("user_openID"),
                "uid": wx.getStorageSync("u_id"),
            }, function (res) {
                console.log(res);
                if (res.status == 1) {
                    let arr = _this.data.contentArr;
                    arr[index].support = parseInt(arr[index].support) + 1;
                    arr[index].dianji = 1;
                    _this.setData({
                        contentArr: arr,
                        praiseId: cid,
                        pointAni: null,
                    });
                    _this.crearteAnimation();
                }
            })
        },
    },
})
