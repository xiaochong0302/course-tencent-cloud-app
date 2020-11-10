<template>
	<view class="container">
		<view class="section" v-if="profile.vip == 1">
			<u-section title="我的会员" :right="false"></u-section>
			<view class="count-down">
				<u-count-down :timestamp="vipExpiryTime" separator="zh"></u-count-down>
			</view>
		</view>
		<view class="section">
			<u-section title="会员权益" :right="false"></u-section>
			<view class="right-list">
				<u-tag v-for="(value,key) in vipRights" :key="key" :text="value" type="primary" mode="dark"></u-tag>
			</view>
		</view>
		<view class="section">
			<u-section title="会员类型" :right="false"></u-section>
			<view class="option-list">
				<view class="option" v-for="option in vipOptions" :key="option.id">
					<view class="title">{{ option.title }}</view>
					<view class="price">{{ option.price|formatPrice }}</view>
					<view class="action">
						<u-button type="primary" size="mini" @click="buyVip(option.id)">立即开通</u-button>
					</view>
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
				this.$utils.redirect(`/pages/order/confirm?item_id=${itemId}&item_type=4`)
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

<style>
	.container {
		padding: 50rpx 30rpx;
	}

	.section {
		margin-bottom: 50rpx;
	}

	.u-section {
		margin-bottom: 50rpx;
	}

	.right-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 50rpx;
	}

	.right-list .u-tag {
		min-width: 160rpx;
		margin-bottom: 30rpx;
	}

	.option-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 50rpx;
	}

	.option {
		min-width: 270rpx;
		margin-bottom: 50rpx;
		padding: 20rpx 0;
		text-align: center;
		background-color: #F8F8F8;
	}

	.option .title,
	.option .price {
		margin-bottom: 15rpx;
	}
</style>
