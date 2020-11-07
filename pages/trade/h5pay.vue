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
				const baseUrl = this.$config.apiBaseUrl
				return `${baseUrl}/trade/h5/pay?sn=${sn}`
			}
		}
	}
</script>

<style>
</style>
