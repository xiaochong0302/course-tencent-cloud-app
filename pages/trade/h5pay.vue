<template>
	<view class="container">
		<web-view :src="targetUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				targetUrl: ''
			}
		},
		onLoad(e) {
			this.targetUrl = this.getTargetUrl(e.sn)
		},
		methods: {
			getTargetUrl(sn) {
				let apiBaseUrl = this.$utils.getApiBaseUrl()
				return `${apiBaseUrl}/trade/h5/pay?sn=${sn}`
			}
		}
	}
</script>

<style>
</style>
