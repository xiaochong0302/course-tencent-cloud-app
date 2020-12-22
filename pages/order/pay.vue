<template>
	<view class="container" v-if="order.sn">
		<view class="section">
			<view class="head">
				<u-section title="订单信息" :right="false"></u-section>
			</view>
			<view class="order">
				<view class="title">{{ order.subject }}</view>
				<view class="sn">订单编号：{{ order.sn }}</view>
				<view class="price">支付金额：{{ order.amount|formatPrice }}</view>
			</view>
		</view>
		<view class="section">
			<view class="head">
				<u-section title="支付方式" :right="false"></u-section>
			</view>
			<view class="channel-list">
				<!-- #ifdef H5 -->
				<view class="channel">
					<u-button type="primary" @click="h5Pay(1)">支付宝支付</u-button>
				</view>
				<view class="channel">
					<u-button type="success" @click="h5Pay(2)">微信支付</u-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="channel">
					<u-button type="success" @click="mpWxpay">微信支付</u-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<view class="channel">
					<u-button type="success" @click="mpAlipay">微信支付</u-button>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: {},
			}
		},
		onLoad(e) {
			this.loadOrder(e.sn)
		},
		methods: {
			loadOrder(sn) {
				this.$api.getOrderInfo(sn).then(res => {
					if (res.order.status != 1) {
						this.$utils.redirect('/pages/me/orders')
					}
					this.order = res.order
				}).catch(e => {
					this.$u.toast('加载订单失败')
				})
			},
			// #ifdef H5
			h5Pay(channel) {
				this.$api.createH5Trade({
					order_sn: this.order.sn,
					channel: channel,
				}).then(res => {
					if (res.payment.redirect != '') {
						this.showModal = true
						this.trade = res.trade
						location.href = res.payment.redirect
					} else {
						this.$u.toast('创建交易失败')
					}
				}).catch(e => {
					this.$u.toast('创建交易失败')
				})
			},
			// #endif
			// #ifdef MP-WEIXIN
			mpWxpay() {
				this.$api.createMpTrade({
					order_sn: this.order.sn,
					channel: channel,
				}).then(res => {
					if (res.payment.redirect != '') {
						location.href = res.payment.redirect
					} else {
						this.$u.toast('生成支付链接失败')
					}
				}).catch(e => {
					this.$u.toast('创建交易失败')
				})
			},
			// #endif
			// #ifdef MP-ALIPAY
			mpAlipay() {

			},
			// #endif
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

	.order .title {
		color: $u-main-color;
		margin-bottom: 15rpx;
	}

	.order .sn {
		margin-bottom: 15rpx;
	}

	.channel {
		margin-bottom: 30rpx;
	}
</style>
