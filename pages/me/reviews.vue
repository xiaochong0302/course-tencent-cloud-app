<template>
	<view class="container">
		<view class="item-list" v-if="items.length > 0">
			<u-swipe-action v-for="(item,index) in items" :key="item.id" :index="index" :options="swipeOptions" @click="swipeClick"
			 @content-click=contentClick>
				<view class="item u-border-bottom">
					<view class="title">{{ item.course.title }}</view>
					<view class="content">{{ item.content }}</view>
					<view class="rating">
						<u-rate :current="item.rating" :disabled="true"></u-rate>
					</view>
				</view>
			</u-swipe-action>
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
				hasMore: false,
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
			this.loadReviews()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadReviews()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			swipeClick(index1, index2) {
				if (index2 == 0) {
					this.editReview(index1)
				} else if (index2 == 1) {
					this.deleteReview(index1)
				}
			},
			contentClick(index) {
				this.$utils.redirect('/pages/review/info', {
					id: this.getIdByIndex(index)
				})
			},
			editReview(index) {
				this.$utils.redirect('/pages/review/edit', {
					id: this.getIdByIndex(index)
				})
			},
			deleteReview(index) {
				let id = this.getIdByIndex(index)
				this.$api.deleteReview(id).then(res => {
					this.items.splice(index, 1)
					if (this.items.length == 0) {
						this.page = 1
						this.loadReviews()
					}
				}).catch(e => {
					this.$u.toast('删除评价失败')
				})
			},
			getIdByIndex(index) {
				return this.items[index].id
			},
			loadReviews() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getMyReviews(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载评价失败')
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

	.item .title {
		color: $u-main-color;
		margin-bottom: 15rpx;
	}

	.item .content {
		color: $u-content-color;
		margin-bottom: 15rpx;
	}

	.rating uni-text {
		margin-right: 15rpx;
	}
</style>
