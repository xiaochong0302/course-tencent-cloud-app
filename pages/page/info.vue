<template>
	<view class="container" v-if="page.id > 0">
		<view class="title">{{ page.title }}</view>
		<view class="content markdown-body">
			<u-parse :html="page.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: {}
			}
		},
		onLoad(e) {
			this.loadPage(e.id)
		},
		methods: {
			loadPage(id) {
				this.$api.getPageInfo(id).then(res => {
					this.page = res.page
				}).catch(e => {
					this.$u.toast('加载单页失败')
				})
			}
		}
	}
</script>

<style>
	.container {
		padding-top: 30rpx;
	}

	.title {
		font-weight: 600;
		margin-bottom: 30rpx;
	}

	.content {}
</style>
