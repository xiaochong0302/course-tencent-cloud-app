<template>
	<view class="container">
		<uni-section title="会员权益" type="line"></uni-section>
		<view class="right-list">
			<uni-tag v-for="(value,key) in vipRights" :key="key" :text="value" type="primary"></uni-tag>
		</view>
		<uni-section title="会员类型" type="line"></uni-section>
		<view class="option-list">
			<view class="option" v-for="option in vipOptions" :key="option.id">
				<view class="title">{{option.title}}</view>
				<view class="price">{{option.price|formatPrice}}</view>
				<view class="action">
					<button type="primary" size="mini" @click="buyVip(option.id)">立即开通</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vipRights: ['好课畅学', '会员折扣', '高清视频', '广告免疫', '会员标识', '贴心服务'],
				vipOptions: [],
			}
		},
		onLoad() {
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
			}
		}
	}
</script>

<style>
	.uni-section {
		margin-bottom: 30rpx;
	}

	.right-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 60rpx;
	}

	.right-list .uni-tag {
		margin-bottom: 20rpx;
	}

	.option-list {
		display: flex;
		flex-wrap: wrap;
		justify-content:space-between;
		margin: 0 50rpx;
	}

	.option {
		min-width: 300rpx;
		margin-bottom: 30rpx;
		padding: 20rpx 0;
		text-align: center;
		background-color: #F8F8F8;
	}
	
	.option .title, .option .price {
		margin-bottom: 15rpx;
	}
</style>
