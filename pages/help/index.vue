<template>
	<view class="container" v-if="helps.length > 0">
		<view class="item" v-for="(item,index) in helps" :key="index">
			<u-section :title="item.category.name" :right="false"></u-section>
			<view class="help" v-for="help in item.helps" :key="help.id" @click="gotoHelp(help.id)">{{ help.title }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				helps: [],
			}
		},
		onLoad() {
			this.loadHelps()
		},
		methods: {
			gotoHelp(id) {
				this.$utils.redirect('/pages/help/info', {
					id: id
				})
			},
			loadHelps() {
				this.$api.getHelpList().then(res => {
					this.helps = res.helps
				}).catch(e => {
					this.$u.toast('加载帮助失败')
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx 15rpx;
	}

	.item {
		margin-bottom: 30rpx;
	}

	.u-section {
		margin-bottom: 30rpx;
	}

	.help {
		padding-left: 15rpx;
		margin-bottom: 30rpx;
	}
</style>
