const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')

};

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
};

const loding = function(args) {
    wx.showLoading({
        title: args?`${args}`:"加载中",
        mask: true,
    })
}

const toast = function (ags, time) {
    wx.showToast({
        title: `${ags}`,
        icon: "none",
        duration: time ? time : 1600,
        mask: true,
    });
};


module.exports = {
    formatTime: formatTime,
    formatNumber: formatNumber,
    loding: loding,
    toast: toast,
}