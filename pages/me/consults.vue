<template>
	<view class="container">
		<view class="item-list" v-if="items.length > 0">
			<u-swipe-action v-for="(item,index) in items" :key="item.id" :index="index" :options="swipeOptions" @click="swipeClick"
			 @content-click="contentClick">
				<view class="item u-border-bottom">
					<view class="question">
						<view class="label">提问：</view>
						<view class="content">{{ item.question }}</view>
					</view>
					<view class="answer">
						<view class="label">回复：</view>
						<view class="content">{{ item.answer }}</view>
					</view>
				</view>
			</u-swipe-action>
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
				hasMore: false,
				loadMore: 'loadmore',
				showEmpty: false,
				scrollTop: 0,
				swipeOptions: [{
					text: '修改',
					style: {
						backgroundColor: '#2979FF'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
			}
		},
		onLoad() {
			this.loadConsults()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadConsults()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			swipeClick(index1, index2) {
				if (index2 == 0) {
					this.editConsult(index1)
				} else if (index2 == 1) {
					this.deleteConsult(index1)
				}
			},
			contentClick(index) {
				this.$utils.redirect('/pages/consult/info', {
					id: this.getIdByIndex(index)
				})
			},
			editConsult(index) {
				this.$utils.redirect('/pages/consult/edit', {
					id: this.getIdByIndex(index)
				})
			},
			deleteConsult(index) {
				let id = this.getIdByIndex(index)
				this.$api.deleteConsult(id).then(res => {
					this.items.splice(index, 1)
					if (this.items.length == 0) {
						this.page = 1
						this.loadConsults()
					}
				}).catch(e => {
					this.$u.toast('删除咨询失败')
				})
			},
			getIdByIndex(index) {
				return this.items[index].id
			},
			loadConsults() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getMyConsults(params).then(res => {
					let items = this.items.concat(res.pager.items)
					this.items = this.handleConsults(items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载咨询失败')
				})
			},
			handleConsults(items) {
				return items.map(item => {
					if (item.answer == '') {
						item.answer = '请耐心等待回复吧'
					}
					return item
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		display: flex;
		flex-direction: column;
		padding: 20rpx 0;
	}
	
	.item .question {
		display: flex;
		margin-bottom: 15rpx;
	}

	.item .answer {
		display: flex;
	}
	
	.item .content {
		flex: 1;
	}

	.u-load-more-wrap {
		padding: 30rpx;
	}
</style>
