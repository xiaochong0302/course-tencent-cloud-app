<template>
	<view class="container">
		<u-sticky :enable="enableSticky">
			<view class="filter u-border-bottom">
				<u-tag v-for="item in statuses" :key="item.id" :text="item.name" :type="item.id==status?'primary':'default'" mode="dark"
				 @click="filterByStatus(item.id)"></u-tag>
			</view>
		</u-sticky>
		<view class="item-list" v-if="items.length > 0">
			<view class="item" v-for="(item,index) in items" :key="item.id" @click="gotoRefund(item.sn)">
				<view class="top">
					<view class="sn">编号：{{ item.sn }}</view>
					<view class="status">{{ item.status|refundStatus }}</view>
				</view>
				<view class="body">
					<view class="subject">{{ item.subject }}</view>
				</view>
				<view class="bottom">
					<view class="meta">
						金额：<text class="price">{{ item.amount|formatPrice }}</text>
					</view>
					<view class="action">
						<u-button v-if="item.status == 3" size="mini" @click="cancelRefund(item.sn,index)">取消</u-button>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="loadMore" v-if="items.length > 0"></u-loadmore>
		<u-empty :show="showEmpty" margin-top="100"></u-empty>
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
				loadMore: 'loadmore',
				showEmpty: false,
				enableSticky: true,
				scrollTop: 0,
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
			}
		},
		onLoad() {
			this.loadRefunds()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadRefunds()
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
			gotoRefund(sn) {
				this.$utils.redirect('/pages/refund/info', {
					sn: sn
				})
			},
			loadRefunds() {
				let params = {}
				if (this.status > 0) {
					params.status = this.status
				}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getMyRefunds(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载退款失败')
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
		display: flex;
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
		padding: 30rpx 20rpx;
		margin-bottom: 15rpx;
	}

	.item .top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
		color: $u-tips-color;
	}

	.item .body {
		margin-bottom: 15rpx;
	}

	.item .title {
		color: $u-main-color;
	}

	.item .price {
		color: red;
	}

	.item .bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: $u-tips-color;
	}
	
	.u-load-more-wrap {
		padding-bottom: 30rpx;
	}
</style>
