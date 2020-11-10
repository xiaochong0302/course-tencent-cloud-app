import * as Config from '@/common/config.js'
import * as Storage from '@/common/storage.js'

export const getNowTime = () => {
	return Math.ceil(Date.now() / 1000)
}

export const formatPrice = (number) => {
	number = parseFloat(number)
	return '￥' + number.toFixed(2)
}

export const formatNumber = (number) => {
	number = number.toString()
	return number[1] ? number : '0' + number
}

export const formatDuration = (number) => {
	let result = '00:00'
	if (number > 0) {
		let hours = Math.floor(number / 3600)
		let minutes = Math.floor((number - hours * 3600) / 60)
		let seconds = number % 60
		let format = []
		if (hours > 0) {
			format.push(formatNumber(hours))
		}
		if (minutes > 0) {
			format.push(formatNumber(minutes))
		}
		if (seconds >= 0) {
			format.push(formatNumber(seconds))
		}
		return format.join(':')
	}
	return result
}

export const thumbAvatar = (url) => {
	return `${url}!avatar_160`
}

export const thumbCover = (url) => {
	return `${url}!cover_270`
}

export const thumbSlide = (url) => {
	return `${url}!slide_1100`
}

export const orderStatus = (status) => {
	const mapping = {
		'1': '待支付',
		'2': '发货中',
		'3': '已完成',
		'4': '已关闭',
		'5': '已退款',
	}
	return mapping[status] ? mapping[status] : '未知'
}

export const refundStatus = (status) => {
	const mapping = {
		'1': '待处理',
		'2': '已取消',
		'3': '退款中',
		'4': '已拒绝',
		'5': '已完成',
		'6': '已失败',
	}
	return mapping[status] ? mapping[status] : '未知'
}

export const courseLevel = (level) => {
	const mapping = {
		'1': '入门',
		'2': '初级',
		'3': '中级',
		'4': '高级',
	}
	return mapping[level] ? mapping[level] : '未知'
}

export const redirect = (url) => {
	const tabUrls = [
		'/pages/index/index',
		'/pages/course/category',
		'/pages/teacher/index',
		'/pages/me/index',
		'/pages/im/index',
	]
	if (tabUrls.indexOf(url) !== -1) {
		uni.switchTab({
			url: url
		})
	} else if (url.indexOf('://') !== -1) {
		plus.runtime.openURL(url)
	} else if (url.indexOf('/pages') == 0) {
		uni.navigateTo({
			url: url
		})
	} else {
		uni.showToast({
			title: '不支持的协议类型'
		})
	}
}

export const getPlatform = () => {
	let platform = 'OTHER'
	// #ifdef H5
	platform = 'H5'
	// #endif
	// #ifdef MP-WEIXIN
	platform = 'MP_WEIXIN'
	// #endif
	// #ifdef MP-ALIPAY
	platform = 'MP_ALIPAY'
	// #endif
	// #ifdef MP-TOUTIAO
	platform = 'MP_TOUTIAO'
	// #endif
	// #ifdef APP-PLUS
	platform = uni.getSystemInfoSync().platform
	// #endif
	return platform.toLowerCase()
}

export const getToken = () => {
	let key = Config.cacheKey.token
	return Storage.get(key)
}

export const setToken = (value) => {
	let key = Config.cacheKey.token
	return Storage.set(key, value)
}

export const checkLogin = (redirect = '') => {
	if (redirect == '') {
		redirect = '/pages/index/index'
	}
	if (getToken() == '') {
		uni.reLaunch({
			url: '/pages/account/login?redirect=' + encodeURIComponent(redirect)
		})
		return false
	}
	return true
}
