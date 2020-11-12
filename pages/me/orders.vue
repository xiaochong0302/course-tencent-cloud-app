<template>
	<view class="container">
		<view class="filter">
			<u-tag v-for="item in statuses" :key="item.id" :text="item.name" :type="item.id==status?'primary':'default'" mode="dark"
			 @click="filterByStatus(item.id)"></u-tag>
		</view>
		<view class="item-list" v-if="items.length > 0">
			<view class="item" v-for="item in items" :key="item.id" @click="gotoOrder(item.sn)">
				<view class="top">
					<view class="sn">编号：{{ item.sn }}</view>
					<view class="status">{{ item.status|orderStatus }}</view>
				</view>
				<view class="body">
					<view class="subject">{{ item.subject }}</view>
				</view>
				<view class="bottom">
					<view class="price">金额：{{ item.amount|formatPrice }}</view>
					<view class="action">
						<u-button v-if="item.status == 1" size="mini" @click="gotoPay(item.sn)">支付</u-button>
						<u-button v-if="[1,2].includes(item.item_type) && item.status == 3" size="mini" @click="gotoRefund(item.sn)">退款</u-button>
					</view>
				</view>
			</view>
		</view>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: [],
				page: 1,
				status: 0,
				hasMore: false,
				scrollTop: 0,
				statuses: [{
						id: 0,
						name: '全部'
					},
					{
						id: 1,
						name: '待支付'
					},
					{
						id: 3,
						name: '已完成'
					},
					{
						id: 4,
						name: '已关闭'
					},
					{
						id: 5,
						name: '已退款'
					}
				]
			}
		},
		onLoad(e) {
			this.loadOrders()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadOrders()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			filterByStatus(status) {
				this.status = status
				this.page = 1
				this.items = []
				this.hasMore = false
				this.loadOrders()
			},
			gotoOrder(sn) {
				this.$utils.redirect(`/pages/order/info?sn=${sn}`)
			},
			gotoPay(sn) {
				this.$utils.redirect(`/pages/order/pay?sn=${sn}`)
			},
			gotoRefund(sn) {
				this.$utils.redirect(`/pages/refund/confirm?sn=${sn}`)
			},
			loadOrders() {
				let params = {}
				if (this.status != 0) {
					params.status = this.status
				}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getMyOrders(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载订单失败')
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
	}

	.filter {
		display: flex;
		margin-top: 20rpx;
		margin-bottom: 30rpx;
	}

	.filter .u-tag {
		margin-right: 20rpx;
	}

	.item {
		display: flex;
		flex-direction: column;
		padding: 30rpx 0;
		border-top: 1px solid rgba(0, 0, 0, .2);
	}

	.item .top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
	}

	.item .body {
		margin-bottom: 15rpx;
	}

	.item .bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
