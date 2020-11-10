<template>
	<view class="container">
		<view class="filter">
			<u-tag v-for="item in statuses" :key="item.id" :text="item.name" :type="item.id==status?'primary':'default'" mode="dark"
			 @click="filterByStatus(item.id)"></u-tag>
		</view>
		<view class="item-list" v-if="items.length > 0">
			<view class="item" v-for="(item,index) in items" :key="item.id">
				<view class="top">
					<view class="sn">编号：{{ item.sn }}</view>
					<view class="status">{{ item.status|refundStatus }}</view>
				</view>
				<view class="body">
					<view class="subject">{{ item.subject }}</view>
				</view>
				<view class="bottom">
					<view class="price">金额：{{ item.amount|formatPrice }}</view>
					<view class="action">
						<u-button v-if="item.status == 3" size="mini" @click="cancelRefund(item.sn,index)">取消</u-button>
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
				items: [],
				page: 1,
				status: 0,
				hasMore: false,
				statuses: [{
						id: 0,
						name: '全部'
					},
					{
						id: 1,
						name: '待处理'
					},
					{
						id: 2,
						name: '已取消'
					},
					{
						id: 3,
						name: '退款中'
					},
					{
						id: 5,
						name: '已完成'
					}
				],
				pager: {}
			}
		},
		onLoad() {
			this.loadRefunds()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadOrders()
			}
		},
		methods: {
			filterByStatus(status) {
				this.status = status
				this.page = 1
				this.items = []
				this.hasMore = false
				this.loadRefunds()
			},
			cancelRefund(sn, index) {
				this.$api.cancelRefund(sn).then(res => {
					this.items[index].status = 2
					this.$u.toast('取消退款成功')
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			},
			loadRefunds() {
				let params = {}
				if (this.status != 0) {
					params.status = this.status
				}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getMyRefunds(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载退款失败')
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
