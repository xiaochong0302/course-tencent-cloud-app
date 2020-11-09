<template>
	<view class="container">
		<u-swipe-action v-for="(item,index) in items" :key="item.key" :index="index" :options="swipeOptions" @click="swipeClick"
		 @content-click="contentClick">
			<view class="item">
				<view class="cover">
					<u-image width="250" height="140" border-radius="10" :src="item.course.cover|thumbCover"></u-image>
				</view>
				<view class="info">
					<view class="title">{{item.course.title}}</view>
					<view class="meta">
						<text class="progress">进度：{{item.progress}}%</text>
						<text class="duration">用时：{{item.duration|formatDuration}}</text>
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
		methods: {
			swipeClick(index1, index2) {
				if (index2 === 0) {
					this.gotoReview(index1)
				}
			},
			contentClick(index) {
				let id = this.items[index].course.id
				this.$utils.redirect(`/pages/course/info?id=${id}`)
			},
			gotoReview(index) {
				let id = this.items[index].course.id
				let reviewed = this.items[index].reviewed
				if (reviewed === 0) {
					this.$utils.redirect(`/pages/review/add?id=${id}`)
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
		margin-bottom: 15rpx;
	}

	.meta text {
		margin-right: 15rpx;
	}
</style>
