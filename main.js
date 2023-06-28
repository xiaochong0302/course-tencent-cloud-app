import Vue from 'vue'
import App from './App'
import * as Utils from '@/common/utils.js'
import * as Api from '@/common/api.js'

Vue.prototype.$utils = Utils
Vue.prototype.$api = Api

Vue.config.productionTip = false

Vue.filter('formatPrice', function(argv) {
    return Utils.formatPrice(argv)
})

Vue.filter('formatDuration', function(argv) {
    return Utils.formatDuration(argv)
})

Vue.filter('humanNumber', function(argv) {
    return Utils.humanNumber(argv)
})

Vue.filter('thumbAvatar', function(argv) {
    return Utils.thumbAvatar(argv)
})

Vue.filter('thumbCover', function(argv) {
    return Utils.thumbCover(argv)
})

Vue.filter('thumbSlide', function(argv) {
    return Common.thumbSlide(argv)
})

Vue.filter('courseLevel', function(argv) {
    return Utils.courseLevel(argv)
})

Vue.filter('orderStatus', function(argv) {
    return Utils.orderStatus(argv)
})

Vue.filter('refundStatus', function(argv) {
    return Utils.refundStatus(argv)
})

App.mpType = 'app'

import uView from 'uview-ui'

Vue.use(uView)

const app = new Vue({
    ...App
})

app.$mount()