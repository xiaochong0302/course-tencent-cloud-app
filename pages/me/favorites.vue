<template>
	<view class="container">
		<view class="favorite-list" v-if="items.length > 0">
			<u-swipe-action v-for="(item,index) in items" :key="item.id" :index="index" :options="swipeOptions" @click="swipeClick"
			 @content-click="contentClick">
				<view class="item">
					<view class="cover">
						<u-image width="240" height="133" border-radius="10" :src="item.cover|thumbCover"></u-image>
					</view>
					<view class="info">
						<view class="title u-line-1">{{ item.title }}</view>
						<view class="meta">
							<text class="user">学员：{{ item.user_count }}</text>
							<text class="favorite">收藏：{{ item.favorite_count }}</text>
						</view>
						<view class="meta">
							<text class="favorite">课时：{{ item.lesson_count }}</text>
							<text class="rating">评分：{{ item.rating }}</text>
						</view>
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
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			swipeClick(index1, index2) {
				if (index2 == 0) {
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
					if (this.items.length == 0) {
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
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载收藏失败')
				})
			}
		}
	}
</script>

<style>
	.item {
		display: flex;
		padding: 10rpx 0;
	}

	.item .cover {
		margin-right: 15rpx;
	}

	.item .info {
		flex: 1;
	}

	.info .title {
		font-weight: 600;
		margin-bottom: 10rpx;
		width: 465rpx;
	}

	.meta {
		margin-bottom: 10rpx;
	}

	.meta text {
		margin-right: 15rpx;
	}
</style>
