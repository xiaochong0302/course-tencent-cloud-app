const install = (Vue, vm) => {

	const search = (params) => {
		return vm.$u.get('/search', params)
	}

	const getSiteInfo = () => {
		return vm.$u.get('/site/info')
	}

	const getCaptchaInfo = () => {
		return vm.$u.get('/captcha/info')
	}

	const getRewardOptions = () => {
		return vm.$u.get('/reward/options')
	}

	const getVipOptions = () => {
		return vm.$u.get('/vip/options')
	}

	const getIndexSlides = () => {
		return vm.$u.get('/index/slides')
	}

	const getIndexNewCourses = () => {
		return vm.$u.get('/index/courses/new')
	}

	const getIndexFreeCourses = () => {
		return vm.$u.get('/index/courses/free')
	}

	const getIndexVipCourses = () => {
		return vm.$u.get('/index/courses/vip')
	}

	const getCourseCategories = () => {
		return vm.$u.get('/course/categories')
	}

	const getCourseList = (params) => {
		return vm.$u.get('/course/list', params)
	}

	const getCourseInfo = (id) => {
		return vm.$u.get(`/course/${id}/info`)
	}

	const getCourseChapters = (id) => {
		return vm.$u.get(`/course/${id}/chapters`)
	}

	const getCoursePackages = (id) => {
		return vm.$u.get(`/course/${id}/packages`)
	}

	const getCourseReviews = (id, params) => {
		return vm.$u.get(`/course/${id}/reviews`, params)
	}

	const getCourseConsults = (id, params) => {
		return vm.$u.get(`/course/${id}/consults`, params)
	}

	const favoriteCourse = (id) => {
		return vm.$u.post(`/course/${id}/favorite`)
	}

	const unfavoriteCourse = (id) => {
		return vm.$u.post(`/course/${id}/unfavorite`)
	}

	const getChapterInfo = (id) => {
		return vm.$u.get(`/chapter/${id}/info`)
	}

	const getChapterResources = (id) => {
		return vm.$u.get(`/course/${id}/resources`)
	}

	const likeChapter = (id) => {
		return vm.$u.post(`/chapter/${id}/like`)
	}

	const unlikeChapter = (id) => {
		return vm.$u.post(`/chapter/${id}/unlike`)
	}

	const learningChapter = (id, params) => {
		return vm.$u.post(`/chapter/${id}/learning`, params)
	}

	const createConsult = (params) => {
		return vm.$u.post('/consult/create', params)
	}

	const getConsultInfo = (id) => {
		return vm.$u.post(`/consult/${id}/info`)
	}

	const updateConsult = (id, params) => {
		return vm.$u.post(`/consult/${id}/update`, params)
	}

	const deleteConsult = (id) => {
		return vm.$u.post(`/consult/${id}/delete`)
	}

	const likeConsult = (id) => {
		return vm.$u.post(`/consult/${id}/like`)
	}

	const unlikeConsult = (id) => {
		return vm.$u.post(`/consult/${id}/unlike`)
	}

	const createReview = (params) => {
		return vm.$u.post('/review/create', params)
	}

	const getReviewInfo = (id) => {
		return vm.$u.post(`/review/${id}/info`)
	}

	const updateReview = (id, params) => {
		return vm.$u.post(`/review/${id}/update`, params)
	}

	const deleteReview = (id) => {
		return vm.$u.post(`/review/${id}/delete`)
	}

	const likeReview = (id) => {
		return vm.$u.post(`/review/${id}/like`)
	}

	const unlikeReview = (id) => {
		return vm.$u.post(`/review/${id}/unlike`)
	}

	const getOrderInfo = (sn) => {
		return vm.$u.get('/order/info', {
			sn: sn
		})
	}

	const getOrderConfirm = (itemId, itemType) => {
		return vm.$u.get('/order/confirm', {
			item_id: itemId,
			item_type: itemType
		})
	}

	const createOrder = (params) => {
		return vm.$u.post('/order/create', params)
	}

	const cancelOrder = (params) => {
		return vm.$u.post('/order/cancel', params)
	}

	const getTradeInfo = (sn) => {
		return vm.$u.get('/trade/info', {
			sn: sn
		})
	}

	const createH5Trade = (params) => {
		return vm.$u.post('/trade/h5/create', params)
	}

	const createMpTrade = (params) => {
		return vm.$u.post('/trade/mp/create', params)
	}

	const createAppTrade = (params) => {
		return vm.$u.post('/trade/app/create', params)
	}

	const getUserInfo = (id) => {
		return vm.$u.get(`/user/${id}/info`)
	}

	const getUserCourses = (id, params = {}) => {
		return vm.$u.get(`/user/${id}/courses`, params)
	}

	const getUserFavorites = (id, params = {}) => {
		return vm.$u.get(`/user/${id}/favorites`, params)
	}

	const getUserFriends = (id, params = {}) => {
		return vm.$u.get(`/user/${id}/friends`, params)
	}

	const getUserGroups = (id, prams = {}) => {
		return vm.$u.get(`/user/${id}/groups`, params)
	}

	const getMyProfile = () => {
		return vm.$u.get('/uc/profile')
	}

	const getMyAccount = () => {
		return vm.$u.get('/uc/account')
	}

	const getMyOrders = (params = {}) => {
		return vm.$u.get('/uc/orders', params)
	}

	const getMyRefunds = (params = {}) => {
		return vm.$u.get('/uc/refunds', params)
	}

	const getMyCourses = (params = {}) => {
		return vm.$u.get('/uc/courses', params)
	}

	const getMyConsults = (params = {}) => {
		return vm.$u.get('/uc/consults', params)
	}

	const getMyReviews = (params = {}) => {
		return vm.$u.get('/uc/reviews', params)
	}

	const getMyFavorites = (params = {}) => {
		return vm.$u.get('/uc/favorites', params)
	}

	const getMyFriends = (params = {}) => {
		return vm.$u.get('/uc/friends', params)
	}

	const getMyGroups = (params = {}) => {
		return vm.$u.get('/uc/groups', params)
	}

	const updateMyProfile = (params = {}) => {
		return vm.$u.post('/uc/profile/update', params)
	}

	const registerAccount = (params = {}) => {
		return vm.$u.post('/account/register', params)
	}

	const loginByPassword = (params = {}) => {
		return vm.$u.post('/account/password/login', params)
	}

	const loginByVerify = (params = {}) => {
		return vm.$u.post('/account/verify/login', params)
	}

	const logoutAccount = (params = {}) => {
		return vm.$u.post('/account/logout', params)
	}

	const resetPassword = (params = {}) => {
		return vm.$u.post('/account/password/reset', params)
	}

	const updatePhone = (params = {}) => {
		return vm.$u.post('/account/phone/update', params)
	}

	const updateEmail = (params = {}) => {
		return vm.$u.post('/account/email/update', params)
	}

	const updatePassword = (params = {}) => {
		return vm.$u.post('/account/password/update', params)
	}

	const sendSmsVerifyCode = (params = {}) => {
		return vm.$u.post('/verify/sms/code', params)
	}

	const sendEmailVerifyCode = (params = {}) => {
		return vm.$u.post('/verify/email/code', params)
	}

	const uploadAvatar = (filePath) => {
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

	vm.$u.api = {
		search,
		getCaptchaInfo,
		getSiteInfo,
		getRewardOptions,
		getVipOptions,
		getIndexSlides,
		getIndexNewCourses,
		getIndexFreeCourses,
		getIndexVipCourses,
		getCourseCategories,
		getCourseList,
		getCourseInfo,
		getCourseChapters,
		getCoursePackages,
		getCourseReviews,
		getCourseConsults,
		favoriteCourse,
		unfavoriteCourse,
		getChapterInfo,
		getChapterResources,
		likeChapter,
		unlikeChapter,
		learningChapter,
		getConsultInfo,
		createConsult,
		updateConsult,
		deleteConsult,
		likeConsult,
		unlikeConsult,
		getReviewInfo,
		createReview,
		updateReview,
		deleteReview,
		likeReview,
		unlikeReview,
		getOrderInfo,
		getOrderConfirm,
		createOrder,
		cancelOrder,
		getTradeInfo,
		createH5Trade,
		createMpTrade,
		createAppTrade,
		getUserInfo,
		getUserCourses,
		getUserFavorites,
		getUserFriends,
		getUserGroups,
		getMyProfile,
		getMyAccount,
		getMyCourses,
		getMyFavorites,
		getMyFriends,
		getMyGroups,
		getMyOrders,
		getMyRefunds,
		getMyConsults,
		getMyReviews,
		updateMyProfile,
		updateEmail,
		updatePhone,
		updatePassword,
		logoutAccount,
		registerAccount,
		loginByPassword,
		loginByVerify,
		resetPassword,
		sendSmsVerifyCode,
		sendEmailVerifyCode,
		uploadAvatar,
	}
}

export default {
	install
}
