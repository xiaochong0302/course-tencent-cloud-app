<template>
	<view class="container">
		<u-swipe-action v-for="(item,index) in items" :key="item.id" :index="index" :options="swipeOptions" @click="swipeClick"
		 @content-click="contentClick">
			<view class="item">
				<view class="info">
					<view class="title">{{item.title}}</view>
					<view class="meta">
						<text class="user">学员：{{item.user_count}}</text>
						<text class="favorite">收藏：{{item.favorite_count}}</text>
						<text class="rating">评分：{{item.rating}}</text>
					</view>
				</view>
			</view>
		</u-swipe-action>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: [],
				page: 1,
				hasMore: false,
				swipeOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
			}
		},
		onLoad() {
			this.loadFavorites()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadFavorites()
			}
		},
		methods: {
			swipeClick(index1, index2) {
				if (index2 === 0) {
					this.unfavorite(index1)
				}
			},
			contentClick(index) {
				let id = this.getIdByIndex(index)
				this.$utils.redirect(`/pages/course/info?id=${id}`)
			},
			unfavorite(index) {
				let id = this.getIdByIndex(index)
				this.$api.unfavoriteCourse(id).then(res => {
					this.items.splice(index, 1)
					if (this.items.length === 0) {
						this.page = 1
						this.loadFavorites()
					}
				}).catch(e => {
					this.$u.toast('取消收藏失败')
				})
			},
			getIdByIndex(index) {
				return this.items[index].id
			},
			loadFavorites() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getMyFavorites(params).then(res => {
					let items = this.handleFavorites(res.pager.items)
					this.items = this.items.concat(items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载收藏失败')
				})
			},
			handleFavorites(items) {
				return items.map(item => {
					item.cover = this.$utils.thumbCover(item.cover)
					return item
				})
			}
		}
	}
</script>

<style>
	.item {
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1px solid rgba(0, 0, 0, .2);
	}

	.item .info {
		flex: 1;
	}

	.info .title {
		font-weight: 600;
		margin-bottom: 15rpx;
	}

	.meta text {
		margin-right: 15rpx;
	}
</style>
