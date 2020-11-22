<template>
	<view class="container">
		<u-sticky :enable="enableSticky">
			<view class="filter u-border-bottom">
				<u-tag v-for="item in statuses" :key="item.id" :text="item.name" :type="item.id==status?'primary':'default'" mode="dark"
				 @click="filterByStatus(item.id)"></u-tag>
			</view>
		</u-sticky>
		<view class="item-list" v-if="items.length > 0">
			<view class="item" v-for="item in items" :key="item.id" @click="gotoOrder(item.sn)">
				<view class="top">
					<view class="sn">编号：{{ item.sn }}</view>
					<view class="status">{{ item.status|orderStatus }}</view>
				</view>
				<view class="body">
					<view class="title">{{ item.subject }}</view>
				</view>
				<view class="bottom">
					<view class="meta">
						金额：<text class="price">{{ item.amount|formatPrice }}</text>
					</view>
					<view class="action">
						<u-button v-if="item.status == 1" size="mini" @click="gotoPay(item.sn)">支付</u-button>
						<u-button v-if="[1,2].includes(item.item_type) && item.status == 3" size="mini" @click="gotoRefund(item.sn)">退款</u-button>
					</view>
				</view>
			</view>
		</view>
		<u-empty margin-top="100" :show="showEmpty"></u-empty>
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
				showEmpty: false,
				enableSticky: true,
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
		onShow() {
			this.enableSticky = true
		},
		onHide() {
			this.enableSticky = false
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
				this.$utils.redirect('/pages/order/info', {
					sn: sn
				})
			},
			gotoPay(sn) {
				this.$utils.redirect('/pages/order/pay', {
					sn: sn
				})
			},
			gotoRefund(sn) {
				this.$utils.redirect('/pages/refund/confirm', {
					sn: sn
				})
			},
			loadOrders() {
				let params = {}
				if (this.status > 0) {
					params.status = this.status
				}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getMyOrders(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载订单失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0;
	}

	.filter {
		padding: 20rpx;
		background-color: #FFFFFF;
	}

	.filter .u-tag {
		margin-right: 20rpx;
	}

	.item-list {
		background-color: $u-bg-color;
	}

	.item {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		margin-bottom: 15rpx;
		padding: 30rpx 20rpx;
	}

	.item .top {
		display: flex;
		justify-content: space-between;
		color: $u-tips-color;
		margin-bottom: 15rpx;
	}

	.item .status {
		color: red;
	}
	
	.item .price {
		color: red;
	}

	.item .body {
		margin-bottom: 15rpx;
	}

	.item .title {
		color: $u-main-color;
	}

	.item .bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: $u-tips-color;
	}
</style>
