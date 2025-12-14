<template>
	<view class="container">
		<web-view :src="targetUrl" sandbox="allow-scripts allow-top-navigation allow-same-origin"></web-view>
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
				let baseUrl = this.$utils.getApiBaseUrl()
				return `${baseUrl}/trade/h5/pay?sn=${sn}`
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
