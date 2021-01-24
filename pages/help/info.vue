<template>
	<view class="container" v-if="help.id > 0">
		<view class="title">{{ help.title }}</view>
		<view class="content markdown-body">
			<u-parse :html="help.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				help: {}
			}
		},
		onLoad(e) {
			this.loadHelp(e.id)
		},
		methods: {
			loadHelp(id) {
				this.$api.getHelpInfo(id).then(res => {
					this.help = res.help
				}).catch(e => {
					this.$u.toast('加载帮助失败')
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
