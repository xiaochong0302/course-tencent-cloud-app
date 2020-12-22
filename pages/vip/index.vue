<template>
	<view class="container">
		<view class="section" v-if="profile.vip == 1">
			<view class="head">
				<u-section title="我的会员" :right="false"></u-section>
			</view>
			<view class="count-down">
				<u-count-down :timestamp="vipExpiryTime" separator="zh"></u-count-down>
			</view>
		</view>
		<view class="section">
			<view class="head">
				<u-section title="会员权益" :right="false"></u-section>
			</view>
			<view class="right-list">
				<view class="right btn" v-for="(value,key) in vipRights" :key="key">
					{{ value }}
				</view>
			</view>
		</view>
		<view class="section">
			<view class="head">
				<u-section title="会员类型" :right="false"></u-section>
			</view>
			<view class="option-list">
				<view class="option" v-for="option in vipOptions" :key="option.id">
					<view class="title">{{ option.title }}</view>
					<view class="price">{{ option.price|formatPrice }}</view>
					<view class="action btn" @click="buyVip(option.id)">立即开通</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: {},
				vipExpiryTime: 0,
				vipRights: ['好课畅学', '会员折扣', '高清视频', '广告免疫', '会员标识', '贴心服务'],
				vipOptions: [],
			}
		},
		onLoad() {
			this.loadMyProfile()
			this.loadVipOptions()
		},
		methods: {
			buyVip(itemId) {
				this.$utils.redirect('/pages/order/confirm', {
					item_id: itemId,
					item_type: 4,
				})
			},
			loadVipOptions() {
				this.$api.getVipOptions().then(res => {
					this.vipOptions = res.options
				}).catch(e => {
					this.$u.toast('加载会员选项失败')
				})
			},
			loadMyProfile() {
				this.$api.getMyProfile().then(res => {
					this.profile = res.profile
					this.vipExpiryTime = res.profile.vip_expiry_time - this.$utils.getNowTime()
				}).catch(e => {
					this.$u.toast('获取资料失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 50rpx 30rpx;
	}

	.btn {
		color: white;
		text-align: center;
		background-color: $u-type-primary;
		border-radius: 10rpx;
		padding: 10rpx 0;
	}

	.section {
		margin-bottom: 50rpx;
	}

	.section .head {
		margin-bottom: 50rpx;
	}

	.right-list {
		display: flex;
		flex-wrap: wrap;
	}

	.right-list .right {
		width: 160rpx;
		margin-right: 50rpx;
		margin-bottom: 50rpx;
	}

	.option-list {
		display: flex;
		flex-wrap: wrap;
	}

	.option {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: $u-bg-color;
		border-radius: 10rpx;
		margin-right: 50rpx;
		margin-bottom: 50rpx;
		padding: 30rpx 0;
		width: 280rpx;
	}

	.option .title,
	.option .price {
		margin-bottom: 15rpx;
	}

	.option .price {
		color: red;
	}
	.option .action {
		width: 160rpx;
	}
</style>
