import * as About from '@/common/about.js'
import * as Config from '@/common/config.js'
import * as Utils from '@/common/utils.js'
import * as Storage from '@/common/storage.js'

export const search = (params) => {
	return httpGet('/search', params)
}

export const getSocketInfo = () => {
	return httpGet('/socket/info')
}

export const getSiteInfo = () => {
	return httpGet('/site/info')
}

export const getCaptchaInfo = () => {
	return httpGet('/captcha/info')
}

export const getRewardOptions = () => {
	return httpGet('/reward/options')
}

export const getVipOptions = () => {
	return httpGet('/vip/options')
}

export const getHelpList = () => {
	return httpGet('/help/list')
}

export const getHelpInfo = (id) => {
	return httpGet(`/help/${id}/info`)
}

export const getPageInfo = (id) => {
	return httpGet(`/page/${id}/info`)
}

export const getIndexSlides = () => {
	return httpGet('/index/slides')
}

export const getIndexNewCourses = () => {
	return httpGet('/index/courses/new')
}

export const getIndexFreeCourses = () => {
	return httpGet('/index/courses/free')
}

export const getIndexVipCourses = () => {
	return httpGet('/index/courses/vip')
}

export const getCourseCategories = () => {
	return httpGet('/course/categories')
}

export const getCourseList = (params = {}) => {
	return httpGet('/course/list', params)
}

export const getCourseInfo = (id) => {
	return httpGet(`/course/${id}/info`)
}

export const getCourseChapters = (id) => {
	return httpGet(`/course/${id}/chapters`)
}

export const getCoursePackages = (id) => {
	return httpGet(`/course/${id}/packages`)
}

export const getCourseReviews = (id, params = {}) => {
	return httpGet(`/course/${id}/reviews`, params)
}

export const getCourseConsults = (id, params = {}) => {
	return httpGet(`/course/${id}/consults`, params)
}

export const favoriteCourse = (id) => {
	return httpPost(`/course/${id}/favorite`)
}

export const getChapterInfo = (id) => {
	return httpGet(`/chapter/${id}/info`)
}

export const getChapterConsults = (id, params = {}) => {
	return httpGet(`/chapter/${id}/consults`, params)
}

export const getChapterResources = (id) => {
	return httpGet(`/chapter/${id}/resources`)
}

export const likeChapter = (id) => {
	return httpPost(`/chapter/${id}/like`)
}

export const learningChapter = (id, params) => {
	return httpPost(`/chapter/${id}/learning`, params)
}

export const getLiveList = () => {
	return httpGet('/live/list')
}

export const getLiveChats = (id) => {
	return httpGet(`/live/${id}/chats`)
}

export const bindLiveUser = (id, params) => {
	return httpPost(`/live/${id}/user/bind`, params)
}

export const sendLiveMessage = (id, params) => {
	return httpPost(`/live/${id}/msg/send`, params)
}

export const createConsult = (params) => {
	return httpPost('/consult/create', params)
}

export const getConsultInfo = (id) => {
	return httpGet(`/consult/${id}/info`)
}

export const updateConsult = (id, params) => {
	return httpPost(`/consult/${id}/update`, params)
}

export const deleteConsult = (id) => {
	return httpPost(`/consult/${id}/delete`)
}

export const likeConsult = (id) => {
	return httpPost(`/consult/${id}/like`)
}

export const createReview = (params) => {
	return httpPost('/review/create', params)
}

export const getReviewInfo = (id) => {
	return httpGet(`/review/${id}/info`)
}

export const updateReview = (id, params) => {
	return httpPost(`/review/${id}/update`, params)
}

export const deleteReview = (id) => {
	return httpPost(`/review/${id}/delete`)
}

export const likeReview = (id) => {
	return httpPost(`/review/${id}/like`)
}

export const unlikeReview = (id) => {
	return httpPost(`/review/${id}/unlike`)
}

export const getOrderInfo = (sn) => {
	return httpGet('/order/info', {
		sn: sn
	})
}

export const getOrderConfirm = (itemId, itemType) => {
	return httpGet('/order/confirm', {
		item_id: itemId,
		item_type: itemType
	})
}

export const createOrder = (params) => {
	return httpPost('/order/create', params)
}

export const cancelOrder = (sn) => {
	return httpPost('/order/cancel', {
		sn: sn
	})
}

export const getRefundConfirm = (sn) => {
	return httpGet('/refund/confirm', {
		sn: sn
	})
}

export const getRefundInfo = (sn) => {
	return httpGet('/refund/info', {
		sn: sn
	})
}

export const createRefund = (params) => {
	return httpPost('/refund/create', params)
}

export const cancelRefund = (sn) => {
	return httpPost('/refund/cancel', {
		sn: sn
	})
}

export const getTradeInfo = (sn) => {
	return httpGet('/trade/info', {
		sn: sn
	})
}

export const createH5Trade = (params) => {
	return httpPost('/trade/h5/create', params)
}

export const createMpTrade = (params) => {
	return httpPost('/trade/mp/create', params)
}

export const createAppTrade = (params) => {
	return httpPost('/trade/app/create', params)
}

export const getImGroupList = (params = {}) => {
	return httpGet('/im/group/list', params)
}

export const getImGroupInfo = (id) => {
	return httpGet(`/im/group/${id}/info`)
}

export const getImGroupUsers = (id, params = {}) => {
	return httpGet(`/im/group/${id}/users`, params)
}

export const getTeacherList = (params = {}) => {
	return httpGet('/teacher/list', params)
}

export const getTeacherInfo = (id) => {
	return httpGet(`/teacher/${id}/info`)
}

export const getTeacherCourses = (id, params = {}) => {
	return httpGet(`/teacher/${id}/courses`, params)
}

export const getUserInfo = (id) => {
	return httpGet(`/user/${id}/info`)
}

export const getUserCourses = (id, params = {}) => {
	return httpGet(`/user/${id}/courses`, params)
}

export const getUserFavorites = (id, params = {}) => {
	return httpGet(`/user/${id}/favorites`, params)
}

export const getUserFriends = (id, params = {}) => {
	return httpGet(`/user/${id}/friends`, params)
}

export const getUserGroups = (id, params = {}) => {
	return httpGet(`/user/${id}/groups`, params)
}

export const getMyProfile = () => {
	return httpGet('/uc/profile')
}

export const getMyAccount = () => {
	return httpGet('/uc/account')
}

export const getMyOrders = (params = {}) => {
	return httpGet('/uc/orders', params)
}

export const getMyRefunds = (params = {}) => {
	return httpGet('/uc/refunds', params)
}

export const getMyCourses = (params = {}) => {
	return httpGet('/uc/courses', params)
}

export const getMyConsults = (params = {}) => {
	return httpGet('/uc/consults', params)
}

export const getMyReviews = (params = {}) => {
	return httpGet('/uc/reviews', params)
}

export const getMyFavorites = (params = {}) => {
	return httpGet('/uc/favorites', params)
}

export const getMyFriends = (params = {}) => {
	return httpGet('/uc/friends', params)
}

export const getMyGroups = (params = {}) => {
	return httpGet('/uc/groups', params)
}

export const updateMyProfile = (params = {}) => {
	return httpPost('/uc/profile/update', params)
}

export const registerAccount = (params = {}) => {
	return httpPost('/account/register', params)
}

export const loginByPassword = (params = {}) => {
	return httpPost('/account/password/login', params)
}

export const loginByVerify = (params = {}) => {
	return httpPost('/account/verify/login', params)
}

export const logoutAccount = (params = {}) => {
	return httpPost('/account/logout', params)
}

export const resetPassword = (params = {}) => {
	return httpPost('/account/password/reset', params)
}

export const updatePhone = (params = {}) => {
	return httpPost('/account/phone/update', params)
}

export const updateEmail = (params = {}) => {
	return httpPost('/account/email/update', params)
}

export const updatePassword = (params = {}) => {
	return httpPost('/account/password/update', params)
}

export const sendSmsVerifyCode = (params = {}) => {
	return httpPost('/verify/sms/code', params)
}

export const sendEmailVerifyCode = (params = {}) => {
	return httpPost('/verify/email/code', params)
}

export const uploadAvatar = (filePath) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: Config.apiBaseUrl + '/upload/avatar/img',
			name: 'file',
			filePath: filePath,
			success: (res) => {
				resolve(res)
			},
			fail: (e) => {
				reject(e)
			}
		})
	})
}

const httpGet = (path, params = {}, header = {}) => {
	return httpRequest(path, params, 'GET', header)
}

const httpPost = (path, params = {}, header = {}) => {
	return httpRequest(path, params, 'POST', header)
}

const httpRequest = (path, params = {}, method = 'GET', header = {}) => {

	let url = Config.apiBaseUrl + path

	header['X-Version'] = About.appInfo.version
	header['X-Platform'] = Utils.getPlatform()
	header['X-Timestamp'] = Utils.getNowTime()
	header['X-Token'] = Storage.get(Storage.cacheKey.token)

	return new Promise(function(resolve, reject) {
		uni.request({
			url: url,
			data: params,
			method: method,
			header: header,
			success: function(res) {
				if (res.statusCode == 200) {
					if (res.data.code == 0) {
						resolve(res.data)
					} else {
						reject(res.data)
					}
				} else if (res.statusCode == 401) {
					Utils.clearToken()
					uni.navigateTo({
						url: '/pages/account/login'
					})
				} else {
					reject(res.data)
				}
			},
			fail: function(err) {
				reject(err)
			}
		})
	})
}
