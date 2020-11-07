const install = (Vue, vm) => {

	Vue.prototype.$u.http.setConfig({
		baseUrl: 'http://10.86.40.27/api',
		originalData: true,
	});

	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.token = vm.token
		return config
	}

	Vue.prototype.$u.http.interceptor.response = (res) => {
		if (res.statusCode == 200) {
			return res.data
		} else if (res.statusCode == 401) {
			vm.$u.toast('验证失败，请重新登录');
			setTimeout(() => {
				vm.$u.route('/pages/account/login')
			}, 1500)
			return false
		} else {
			return false
		}
	}
}

export default {
	install
}
