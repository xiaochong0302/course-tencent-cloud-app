<template>
	<view class="container">
		<view class="section">
			<u-section title="订单信息" :right="false"></u-section>
			<view class="order">
				<view class="subject">{{ order.subject }}</view>
				<view class="sn">订单编号：{{ order.sn }}</view>
				<view class="price">支付金额：{{ order.amount|formatPrice }}</view>
			</view>
		</view>
		<view class="section">
			<u-section title="支付方式" :right="false"></u-section>
			<view class="channel">
				<u-button type="primary" @click="h5Pay(1)">支付宝支付</u-button>
				<u-button type="success" @click="h5Pay(2)">微信支付</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: {}
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
			h5Pay(channel) {
				this.$api.createH5Trade({
					order_sn: this.order.sn,
					channel: channel,
				}).then(res => {
					this.queryPayStatus(res.trade.sn)
					this.$utils.redirect('/pages/trade/h5pay', {
						sn: res.trade.sn
					})
				}).catch(e => {
					this.$u.toast('创建交易失败')
				})
			},
			queryPayStatus(sn) {
				let interval = setInterval(sn => {
					this.$api.getTradeInfo(sn).then(res => {
						if (res.trade.status == 2) {
							clearInterval(interval)
							this.$utils.redirect('/pages/me/orders')
						}
					})
				}, 5000, sn)
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

	.section .u-section {
		margin-bottom: 30rpx;
	}

	.order .subject {
		margin-bottom: 15rpx;
	}

	.order .sn {
		margin-bottom: 15rpx;
	}

	.channel .u-btn {
		margin-bottom: 30rpx;
	}
</style>
