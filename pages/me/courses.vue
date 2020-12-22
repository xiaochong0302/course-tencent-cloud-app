<template>
	<view class="container">
		<view class="item-list" v-if="items.length > 0">
			<u-swipe-action v-for="(item,index) in items" :key="item.key" :index="index" :options="swipeOptions" @click="swipeClick"
			 @content-click="contentClick">
				<view class="item">
					<view class="cover">
						<u-image :src="item.course.cover|thumbCover" width="240" height="134" border-radius="10"></u-image>
					</view>
					<view class="info">
						<view class="title u-line-1">{{ item.course.title }}</view>
						<view class="meta">
							<text class="duration">课时：{{ item.course.lesson_count }}</text>
							<text class="progress">评分：{{ item.course.rating }}</text>
						</view>
						<view class="meta">
							<text class="progress">进度：{{ item.progress }}%</text>
							<text class="duration">用时：{{ item.duration|formatDuration }}</text>
						</view>
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
					text: '评价',
					style: {
						backgroundColor: '#2979FF'
					}
				}],
			}
		},
		onLoad() {
			this.loadCourses()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadCourses()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			swipeClick(index1, index2) {
				if (index2 == 0) {
					this.gotoReview(index1)
				}
			},
			contentClick(index) {
				let id = this.items[index].course.id
				this.$utils.redirect('/pages/course/info', {
					id: id
				})
			},
			gotoReview(index) {
				let id = this.items[index].course.id
				let reviewed = this.items[index].reviewed
				if (reviewed == 0) {
					this.$utils.redirect('/pages/review/add', {
						id: id
					})
				} else {
					this.$u.toast('你已经发表过评价啦')
				}
			},
			loadCourses() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getMyCourses(params).then(res => {
					let items = this.handleCourses(res.pager.items)
					this.items = this.items.concat(items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载课程失败')
				})
			},
			handleCourses(items) {
				return items.map(item => {
					item.key = item.course.id + '-' + item.plan_id
					return item
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		display: flex;
		padding: 10rpx 0;
	}

	.item .cover {
		width: 240rpx;
		height: 134rpx;
		margin-right: 15rpx;
	}

	.item .info {
		flex: 1;
	}

	.info .title {
		width: 465rpx;
		color: $u-main-color;
		margin-bottom: 10rpx;
	}

	.info .meta {
		color: $u-tips-color;
		margin-bottom: 10rpx;
	}

	.meta text {
		margin-right: 15rpx;
	}

	.u-load-more-wrap {
		padding: 30rpx;
	}
</style>
