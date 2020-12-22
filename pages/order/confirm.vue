<template>
	<view class="container" v-if="confirm.item_type > 0">
		<view class="section">
			<view class="head">
			<u-section title="商品信息" :right="false"></u-section>
			</view>
			<view class="item-course" v-if="confirm.item_type== 1">
				<view class="course">
					<view class="title">课程 - {{ itemInfo.course.title }}</view>
					<view class="meta">
						<text>学习期限：{{ itemInfo.course.study_expiry }}个月</text>
						<text>退款期限：{{ itemInfo.course.refund_expiry }}个月</text>
					</view>
					<view class="meta">
						<text>市场价格：{{ itemInfo.course.market_price|formatPrice }}</text>
						<text>会员价格：{{ itemInfo.course.vip_price|formatPrice }}</text>
					</view>
				</view>
			</view>
			<view class="item-package" v-else-if="confirm.item_type== 2">
				<view class="course" v-for="course in itemInfo.package.courses" :key="course.id">
					<view class="title">课程 - {{ course.title }}</view>
					<view class="meta">
						<text>学习期限：{{ course.study_expiry }}个月</text>
						<text>退款期限：{{ course.refund_expiry }}个月</text>
					</view>
					<view class="meta">
						<text>市场价格：{{ course.market_price|formatPrice }}</text>
						<text>会员价格：{{ course.vip_price|formatPrice }}</text>
					</view>
				</view>
			</view>
			<view class="item-reward" v-else-if="confirm.item_type== 3">
				<view class="title">赞赏 - {{ itemInfo.course.title }}</view>
				<view class="meta">金额：{{ itemInfo.reward.price|formatPrice }}</view>
			</view>
			<view class="item-vip" v-else-if="confirm.item_type== 4">
				<view class="title">会员服务</view>
				<view class="meta">
					<text>价格：{{ itemInfo.vip.price|formatPrice }}</text>
					<text>期限：{{ itemInfo.vip.expiry }}个月</text>
				</view>
			</view>
		</view>
		<view class="section">
			<view class="head">
			<u-section title="支付信息" :right="false"></u-section>
			</view>
			<view class="stats">
				<view class="meta">商品总价：{{ confirm.total_amount|formatPrice }}</view>
				<view class="meta">优惠金额：{{ confirm.discount_amount|formatPrice }}</view>
				<view class="meta">支付金额：{{ confirm.pay_amount|formatPrice }}</view>
			</view>
		</view>
		<view class="section">
			<u-button type="primary" @click="createOrder">提交订单</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				confirm: {},
				itemInfo: {
					course: {},
					package: [],
					reward: {},
					vip: {},
				},
				disabled: false
			}
		},
		onLoad(e) {
			this.loadOrderConfirm(e.item_id, e.item_type)
		},
		methods: {
			loadOrderConfirm(itemId, itemType) {
				this.$api.getOrderConfirm(itemId, itemType).then(res => {
					this.confirm = res.confirm
					this.itemInfo = res.confirm.item_info
				}).catch(e => {
					this.$u.toast('加载信息失败')
				})
			},
			createOrder() {
				this.$api.createOrder({
					item_id: this.confirm.item_id,
					item_type: this.confirm.item_type,
				}).then(res => {
					this.$utils.redirect('/pages/order/pay', {
						sn: res.order.sn
					})
				}).catch(e => {
					this.$u.toast('提交订单失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding-top: 30rpx;
	}

	.section {
		margin-bottom: 30rpx;
	}
	
	.section .head {
		margin-bottom: 30rpx;
	}
	
	.title {
		color: $u-main-color;
	}

	.meta text {
		margin-right: 15rpx;
	}

	.course {
		margin-bottom: 20rpx;
	}

	.course .title {
		margin-bottom: 15rpx;
	}

	.course .meta {
		margin-bottom: 15rpx;
	}

	.item-reward .title {
		margin-bottom: 15rpx;
	}

	.item-vip .title {
		margin-bottom: 15rpx;
	}

	.stats .meta {
		margin-bottom: 15rpx;
	}
</style>
