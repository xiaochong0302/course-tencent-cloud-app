<template>
	<view class="container" v-if="refund.sn">
		<view class="section">
			<u-section title="订单信息" :right="false"></u-section>
			<view class="meta">订单编号：{{ refund.order.sn }}</view>
			<view class="meta">商品名称：{{ refund.order.subject }}</view>
			<view class="meta">订单金额：{{ refund.order.amount|formatPrice }}</view>
		</view>
		<view class="section">
			<u-section title="状态信息" :right="false"></u-section>
			<view class="status">
				<view class="meta" v-for="(item,index) in refund.status_history" :key="index">
					<view v-if="item.status == 1">创建时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
					<view v-if="item.status == 2">取消时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
					<view v-if="item.status == 3">审核时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
					<view v-if="item.status == 4">拒绝时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
					<view v-if="item.status == 5">完成时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
					<view v-if="item.status == 6">失败时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
				</view>
			</view>
		</view>
		<view class="section">
			<u-section title="退款信息" :right="false"></u-section>
			<view class="meta">退款编号：{{ refund.sn }}</view>
			<view class="meta">退款金额：{{ refund.amount|formatPrice }}</view>
			<view class="meta">退款状态：{{ refund.status|refundStatus }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refund: {
					order: {}
				}
			}
		},
		onLoad(e) {
			this.loadRefundInfo(e.sn)
		},
		methods: {
			loadRefundInfo(sn) {
				this.$api.getRefundInfo(sn).then(res => {
					this.refund = res.refund
				}).catch(e => {
					this.$u.toast('加载退款失败')
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
	}

	.section {
		margin-bottom: 30rpx;
	}

	.u-section {
		margin-bottom: 30rpx;
	}

	.title {
		font-weight: 600;
	}

	.meta {
		margin-bottom: 15rpx;
	}
</style>
