<template>
	<view class="container">
		<u-swipe-action v-for="(item,index) in items" :key="item.id" :index="index" :options="swipeOptions" @click="swipeClick"
		 @content-click=contentClick>
			<view class="item">
				<view class="title">{{ item.course.title }}</view>
				<view class="content">{{ item.content }}</view>
				<view class="rating">
					<text>内容实用：{{ item.rating1 }} 星</text>
					<text>通俗易懂：{{ item.rating2 }} 星</text>
					<text>逻辑清晰：{{ item.rating3 }} 星</text>
				</view>
			</view>
		</u-swipe-action>
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
				let id = this.getIdByIndex(index)
				this.$utils.redirect(`/pages/review/info?id=${id}`)
			},
			editReview(index) {
				let id = this.getIdByIndex(index)
				this.$utils.redirect(`/pages/review/edit?id=${id}`)
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
					this.page++
				}).catch(e => {
					this.$u.toast('加载评价失败')
				})
			}
		}
	}
</script>

<style>
	.item {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid rgba(0, 0, 0, .2);
		padding: 20rpx 0;
	}

	.item .title {
		font-weight: 600;
		margin-bottom: 15rpx;
	}

	.item .content {
		display: -webkit-box;
		margin-bottom: 15rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
	}

	.rating text {
		margin-right: 15rpx;
	}
</style>
